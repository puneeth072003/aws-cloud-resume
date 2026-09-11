import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * The hero's WebGL layer: a cluster of glass bars that assembles while the page
 * loads and then tumbles in front of the name, with the whole frame pushed
 * through a mouse-driven fluid field so the type stays liquid and iridescent.
 *
 * Rendered in three passes each frame:
 *   1. a ping-pong fluid buffer that the cursor paints velocity into,
 *   2. the scene (title plane + bars) into an offscreen target,
 *   3. a composite that re-samples the scene through the fluid + noise warp,
 *      splitting the channels for dispersion.
 */

/** Eight bars radiating along the cube diagonals — a 3D asterisk. */
const BAR_DIRECTIONS = [
  new THREE.Vector3(1, 1, 1),
  new THREE.Vector3(-1, 1, 1),
  new THREE.Vector3(1, -1, 1),
  new THREE.Vector3(-1, -1, 1),
  new THREE.Vector3(1, 1, -1),
  new THREE.Vector3(-1, 1, -1),
  new THREE.Vector3(1, -1, -1),
  new THREE.Vector3(-1, -1, -1),
].map((v) => v.normalize());

const BAR_LENGTH = 1.55;
const BAR_THICKNESS = 0.34;
/** Gap between the cluster's centre and the near end of each bar. */
const BAR_GAP = 0.45;

const CAMERA_Z = 6;
const TITLE_Z = -1.25;

const barVertexShader = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vLocal;

  void main() {
    vLocal = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const barFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uColorD;
  uniform float uTime;
  uniform float uHue;
  uniform float uAlpha;
  uniform float uRainbow;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vLocal;

  // Four-stop ramp standing in for the spectral spread of real glass.
  vec3 ramp(float t) {
    t = fract(t);
    vec3 c = mix(uColorA, uColorB, smoothstep(0.0, 0.35, t));
    c = mix(c, uColorC, smoothstep(0.35, 0.68, t));
    c = mix(c, uColorD, smoothstep(0.68, 1.0, t));
    return c;
  }

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(vViewDir);
    float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.2);

    // Ramp position from facing direction + distance along the bar, so each
    // face reads as one long gradient rather than a flat colour.
    float t = 0.5 + 0.5 * dot(n, normalize(vec3(0.55, 0.8, 0.25)));
    t += vLocal.z * 0.22 + uHue + uTime * (0.02 + uRainbow * 0.55);
    vec3 base = ramp(t);

    vec3 light = normalize(vec3(0.35, 1.0, 0.55));
    float spec = pow(max(dot(reflect(-v, n), light), 0.0), 42.0);
    float edge = pow(fres, 5.5);

    vec3 col = base * (0.62 + 0.55 * fres) + spec * 0.55 + edge * 0.4;
    float alpha = clamp(0.5 + fres * 0.9, 0.0, 1.0) * uAlpha;

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

const titleVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const titleFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform float uReveal;
  uniform float uAlpha;
  uniform vec3 uColor;

  varying vec2 vUv;

  void main() {
    // Diagonal wipe: letters resolve from the lower-left as the intro lands.
    float sweep = (1.0 - vUv.y) * 0.65 + vUv.x * 0.35;
    float mask = smoothstep(sweep - 0.22, sweep + 0.02, uReveal * 1.24);

    // Until a letter is fully revealed it is still sliding up into place.
    vec2 uv = vUv + vec2(0.0, (1.0 - mask) * 0.06);
    float glyph = texture2D(uMap, uv).a;

    float alpha = glyph * mask * uAlpha;
    gl_FragColor = vec4(uColor * alpha, alpha);
  }
`;

const fullscreenVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/** Ping-pong buffer: the cursor paints velocity, which spreads and decays. */
const simFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uAspect;
  uniform float uDt;

  varying vec2 vUv;

  void main() {
    vec2 uv = ((vUv - 0.5) * (1.0 - 0.35 * uDt)) + 0.5;
    vec3 frame = texture2D(uPrev, uv).xyz;
    frame *= 1.0 - 1.25 * uDt;

    vec2 p = (vUv - 0.5) * 2.0;
    p.x *= uAspect;
    vec2 m = uMouse;
    m.x *= uAspect;

    float d = length(p - m);
    float splat = pow(1.0 - smoothstep(0.04, 0.32, d), 3.0);
    frame.xy += uVelocity * 1.5 * splat;

    gl_FragColor = vec4(clamp(frame, -1.0, 1.0), 1.0);
  }
`;

const compositeFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uScene;
  uniform sampler2D uSim;
  uniform vec2 uRez;
  uniform float uTime;
  uniform float uWarp;
  uniform float uOpacity;
  uniform vec3 uFringe;

  varying vec2 vUv;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i);
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  void main() {
    vec2 fluid = texture2D(uSim, vUv).xy;

    // Slow liquid drift that never fully settles, biased horizontally so the
    // letterforms smear sideways the way poured glass would pull them.
    float n1 = noise(vec3(vUv * vec2(3.4, 2.2), uTime * 0.11));
    float n2 = noise(vec3(vUv * vec2(2.6, 3.1) + 19.0, uTime * 0.09));
    vec2 drift = vec2(n1 - 0.5, (n2 - 0.5) * 0.55) * uWarp;

    vec2 disp = drift + fluid * 0.2;
    float amount = length(disp);

    vec4 r = texture2D(uScene, vUv + disp * 1.0);
    vec4 g = texture2D(uScene, vUv + disp * 0.93);
    vec4 b = texture2D(uScene, vUv + disp * 0.86);

    vec3 col = vec3(r.r, g.g, b.b);
    float alpha = max(max(r.a, g.a), b.a);

    // Prism fringe where the field is moving fastest.
    col += uFringe * amount * 3.2 * alpha;
    col += (hash(vec3(vUv * uRez, uTime)) - 0.5) * 0.022 * alpha;

    gl_FragColor = vec4(col, alpha) * uOpacity;
  }
`;

type Palette = {
  colors: [THREE.Color, THREE.Color, THREE.Color, THREE.Color];
  title: THREE.Color;
  fringe: THREE.Color;
};

function paletteFor(theme: "dark" | "light"): Palette {
  return theme === "light"
    ? {
        colors: [
          new THREE.Color("#0284c7"),
          new THREE.Color("#6d5bd0"),
          new THREE.Color("#0d9488"),
          new THREE.Color("#be3b74"),
        ],
        title: new THREE.Color("#0f172a"),
        fringe: new THREE.Color("#2563eb"),
      }
    : {
        colors: [
          new THREE.Color("#38bdf8"),
          new THREE.Color("#815af0"),
          new THREE.Color("#14b8a6"),
          new THREE.Color("#f0518b"),
        ],
        title: new THREE.Color("#eaf6ff"),
        fringe: new THREE.Color("#3fa8ff"),
      };
}

/** Draws the name onto a canvas we can feed through the distortion pass. */
function drawTitle(canvas: HTMLCanvasElement, words: string[]) {
  const lines = words.map((w) => w.toUpperCase());
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width: W, height: H } = canvas;
  ctx.clearRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0.05em";

  let size = 320;
  const font = (px: number) => `900 ${px}px Orbitron, sans-serif`;
  ctx.font = font(size);
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 1);
  const maxWidth = W * 0.94;
  if (widest > maxWidth) {
    size *= maxWidth / widest;
    ctx.font = font(size);
  }

  // White here; the material tints it, which keeps one texture per language.
  ctx.fillStyle = "#ffffff";
  const lineHeight = size * 1.02;
  lines.forEach((line, i) => {
    const y = H / 2 + (i - (lines.length - 1) / 2) * lineHeight;
    ctx.fillText(line, W / 2, y);
  });
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export function HeroScene({
  progress,
  revealed,
  title,
  theme,
  rainbow = false,
  onUnsupported,
}: {
  /** Intro progress 0→1; drives the bars flying in and assembling. */
  progress: number;
  /** Once the intro lands, the name resolves in. */
  revealed: boolean;
  title: string;
  theme: "dark" | "light";
  rainbow?: boolean;
  /** Called when WebGL is unavailable, so the DOM hero can show the name. */
  onUnsupported?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Props the render loop reads without forcing the scene to rebuild.
  const live = useRef({ progress, revealed, rainbow });
  live.current = { progress, revealed, rainbow };

  const reducedMotion = usePrefersReducedMotion();
  const titleTextureRef = useRef<{
    canvas: HTMLCanvasElement;
    texture: THREE.CanvasTexture;
  } | null>(null);
  const materialsRef = useRef<{
    bars: THREE.ShaderMaterial[];
    title: THREE.ShaderMaterial | null;
    composite: THREE.ShaderMaterial | null;
  }>({ bars: [], title: null, composite: null });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      onUnsupported?.(); // No WebGL — let the DOM hero show the name instead.
      return;
    }

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      window.innerWidth < 700 ? 1.3 : 1.75
    );
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = CAMERA_Z;

    const palette = paletteFor(theme);

    // ---- title plane ----------------------------------------------------
    const titleCanvas = document.createElement("canvas");
    titleCanvas.width = 2048;
    titleCanvas.height = 1024;
    const titleTexture = new THREE.CanvasTexture(titleCanvas);
    titleTexture.minFilter = THREE.LinearFilter;
    titleTexture.magFilter = THREE.LinearFilter;
    titleTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    titleTextureRef.current = { canvas: titleCanvas, texture: titleTexture };
    drawTitle(titleCanvas, title.trim().split(/\s+/));
    titleTexture.needsUpdate = true;

    const titleMaterial = new THREE.ShaderMaterial({
      vertexShader: titleVertexShader,
      fragmentShader: titleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      uniforms: {
        uMap: { value: titleTexture },
        uReveal: { value: 0 },
        uAlpha: { value: 1 },
        uColor: { value: palette.title.clone() },
      },
    });
    const titleMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), titleMaterial);
    titleMesh.position.z = TITLE_Z;
    titleMesh.renderOrder = 0;
    scene.add(titleMesh);

    // ---- bar cluster ----------------------------------------------------
    const cluster = new THREE.Group();
    scene.add(cluster);

    const barGeometry = new RoundedBoxGeometry(
      BAR_THICKNESS,
      BAR_THICKNESS,
      BAR_LENGTH,
      2,
      0.035
    );
    const zAxis = new THREE.Vector3(0, 0, 1);

    const bars = BAR_DIRECTIONS.map((dir, i) => {
      const material = new THREE.ShaderMaterial({
        vertexShader: barVertexShader,
        fragmentShader: barFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
        uniforms: {
          uColorA: { value: palette.colors[0].clone() },
          uColorB: { value: palette.colors[1].clone() },
          uColorC: { value: palette.colors[2].clone() },
          uColorD: { value: palette.colors[3].clone() },
          uTime: { value: 0 },
          uHue: { value: i * 0.115 },
          uAlpha: { value: 0 },
          uRainbow: { value: 0 },
        },
      });

      const mesh = new THREE.Mesh(barGeometry, material);
      mesh.renderOrder = 1;
      cluster.add(mesh);

      const home = dir.clone().multiplyScalar(BAR_GAP + BAR_LENGTH / 2);
      const homeQuat = new THREE.Quaternion().setFromUnitVectors(zAxis, dir);
      homeQuat.multiply(
        new THREE.Quaternion().setFromAxisAngle(zAxis, i * 0.7)
      );

      // Each bar flies in along its own radial line, so a half-assembled
      // cluster still reads as one object converging on the centre.
      const start = dir.clone().multiplyScalar(5.4 + (i % 3) * 1.1);
      const startQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(i * 1.3, i * 0.9 + 2.1, i * 0.5)
      );

      return { mesh, material, dir, home, homeQuat, start, startQuat };
    });

    materialsRef.current = {
      bars: bars.map((b) => b.material),
      title: titleMaterial,
      composite: null,
    };

    // ---- offscreen targets + post passes --------------------------------
    const makeSceneTarget = (w: number, h: number) =>
      new THREE.WebGLRenderTarget(w, h, {
        samples: 4,
        depthBuffer: true,
      });
    const makeSimTarget = (w: number, h: number) =>
      new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType,
        depthBuffer: false,
      });

    let sceneTarget = makeSceneTarget(2, 2);
    let simA = makeSimTarget(2, 2);
    let simB = makeSimTarget(2, 2);

    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: simFragmentShader,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uPrev: { value: simA.texture },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: 1 },
        uDt: { value: 1 / 60 },
      },
    });

    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: compositeFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      uniforms: {
        uScene: { value: sceneTarget.texture },
        uSim: { value: simA.texture },
        uRez: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uWarp: { value: reducedMotion ? 0 : 0.03 },
        uOpacity: { value: 1 },
        uFringe: { value: palette.fringe.clone() },
      },
    });
    materialsRef.current.composite = compositeMaterial;

    const quadScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial);
    quad.frustumCulled = false;
    quadScene.add(quad);
    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // ---- sizing ---------------------------------------------------------
    let viewWidth = 1;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      sceneTarget.setSize(w * dpr, h * dpr);
      const simW = Math.max(128, Math.round((w * dpr) / 4));
      const simH = Math.max(128, Math.round((h * dpr) / 4));
      simA.setSize(simW, simH);
      simB.setSize(simW, simH);

      compositeMaterial.uniforms.uRez.value.set(w, h);
      simMaterial.uniforms.uAspect.value = w / h;

      // Fit the title plane to the viewport at its depth.
      const distance = CAMERA_Z - TITLE_Z;
      const visibleHeight =
        2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      viewWidth = visibleHeight * camera.aspect;
      const planeWidth = Math.min(viewWidth * 0.94, visibleHeight * 1.75);
      titleMesh.scale.set(planeWidth, planeWidth / 2, 1);

      // Shrink the cluster on narrow screens so it stays inside the name.
      const clusterScale = THREE.MathUtils.clamp(viewWidth / 16, 0.17, 0.62);
      cluster.userData.baseScale = clusterScale;
    };
    resize();
    window.addEventListener("resize", resize);

    // ---- pointer --------------------------------------------------------
    const pointer = new THREE.Vector2(0, 0);
    const pointerPrev = new THREE.Vector2(0, 0);
    const pointerEased = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      pointer.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ---- loop -----------------------------------------------------------
    const clock = new THREE.Clock();
    let raf = 0;
    let introEased = 0;
    let revealEased = 0;
    let rainbowEased = 0;
    let cleared = false;

    const render = () => {
      raf = requestAnimationFrame(render);

      const dt = Math.min(clock.getDelta(), 1 / 30);
      const time = clock.elapsedTime;
      const state = live.current;

      const scrollProgress = clamp01(window.scrollY / window.innerHeight);
      const opacity = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.08, 0.62);
      compositeMaterial.uniforms.uOpacity.value = opacity;
      if (opacity <= 0.002) {
        // Scrolled past the hero: wipe the canvas once, then idle.
        if (!cleared) {
          renderer.setRenderTarget(null);
          renderer.clear();
          cleared = true;
        }
        return;
      }
      cleared = false;

      const ease = (k: number) => 1 - Math.exp(-dt * k);
      introEased += (state.progress - introEased) * ease(9);
      revealEased += ((state.revealed ? 1 : 0) - revealEased) * ease(5);
      rainbowEased += ((state.rainbow ? 1 : 0) - rainbowEased) * ease(3);

      // Cursor velocity for the fluid splat.
      const velX = pointer.x - pointerPrev.x;
      const velY = pointer.y - pointerPrev.y;
      pointerPrev.lerp(pointer, Math.min(1, dt * 14));
      pointerEased.lerp(pointer, Math.min(1, dt * 3));

      // --- bars
      const idleSpin = reducedMotion ? 0 : 1;
      cluster.rotation.y += dt * 0.14 * idleSpin + scrollProgress * dt * 0.9;
      cluster.rotation.x += dt * 0.055 * idleSpin;
      cluster.rotation.z = Math.sin(time * 0.18) * 0.12 * idleSpin;
      cluster.position.y = scrollProgress * 2.4;
      cluster.position.x = pointerEased.x * 0.22;

      const base = (cluster.userData.baseScale as number) ?? 1;
      const scale = base * (1 - scrollProgress * 0.32);
      cluster.scale.setScalar(scale);

      bars.forEach((bar, i) => {
        const t = easeOutCubic(clamp01((introEased - i * 0.062) / 0.5));
        bar.mesh.position.lerpVectors(bar.start, bar.home, t);
        // Breathing: bars ease in and out from the centre once assembled.
        if (t > 0.999 && !reducedMotion) {
          const breathe = Math.sin(time * 0.55 + i * 0.8) * 0.09;
          bar.mesh.position.addScaledVector(bar.dir, breathe);
        }
        bar.mesh.quaternion.slerpQuaternions(bar.startQuat, bar.homeQuat, t);
        bar.material.uniforms.uTime.value = time;
        bar.material.uniforms.uAlpha.value = clamp01(t * 1.6);
        bar.material.uniforms.uRainbow.value = rainbowEased;
      });

      // --- title
      titleMaterial.uniforms.uReveal.value = revealEased;
      titleMaterial.uniforms.uAlpha.value = clamp01(1 - scrollProgress * 1.5);
      titleMesh.position.y = scrollProgress * 1.6;

      // --- pass 1: fluid
      simMaterial.uniforms.uPrev.value = simA.texture;
      simMaterial.uniforms.uMouse.value.copy(pointer);
      const velScale = reducedMotion
        ? 0
        : Math.min(1, 0.05 / (Math.hypot(velX, velY) || 1e-6));
      simMaterial.uniforms.uVelocity.value.set(velX * velScale, velY * velScale);
      simMaterial.uniforms.uDt.value = dt;
      quad.material = simMaterial;
      renderer.setRenderTarget(simB);
      renderer.render(quadScene, quadCamera);
      const swap = simA;
      simA = simB;
      simB = swap;

      // --- pass 2: scene
      renderer.setRenderTarget(sceneTarget);
      renderer.clear();
      renderer.render(scene, camera);

      // --- pass 3: composite
      compositeMaterial.uniforms.uScene.value = sceneTarget.texture;
      compositeMaterial.uniforms.uSim.value = simA.texture;
      compositeMaterial.uniforms.uTime.value = time;
      quad.material = compositeMaterial;
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(quadScene, quadCamera);
    };
    render();

    // Fonts can land after the first paint; redraw the name when they do.
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (disposed) return;
      drawTitle(titleCanvas, title.trim().split(/\s+/));
      titleTexture.needsUpdate = true;
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      barGeometry.dispose();
      titleMesh.geometry.dispose();
      quad.geometry.dispose();
      titleTexture.dispose();
      titleMaterial.dispose();
      simMaterial.dispose();
      compositeMaterial.dispose();
      bars.forEach((b) => b.material.dispose());
      sceneTarget.dispose();
      simA.dispose();
      simB.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      titleTextureRef.current = null;
      materialsRef.current = { bars: [], title: null, composite: null };
    };
    // Built once; live props flow through refs, theme/title through the
    // effects below, so the GL context survives re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Language switch: repaint the name texture in place.
  useEffect(() => {
    const entry = titleTextureRef.current;
    if (!entry) return;
    drawTitle(entry.canvas, title.trim().split(/\s+/));
    entry.texture.needsUpdate = true;
  }, [title]);

  // Theme switch: swap the palette without rebuilding the scene.
  useEffect(() => {
    const { bars, title: titleMaterial, composite } = materialsRef.current;
    const palette = paletteFor(theme);
    bars.forEach((material) => {
      material.uniforms.uColorA.value.copy(palette.colors[0]);
      material.uniforms.uColorB.value.copy(palette.colors[1]);
      material.uniforms.uColorC.value.copy(palette.colors[2]);
      material.uniforms.uColorD.value.copy(palette.colors[3]);
    });
    titleMaterial?.uniforms.uColor.value.copy(palette.title);
    composite?.uniforms.uFringe.value.copy(palette.fringe);
  }, [theme]);

  return <div ref={hostRef} className="hero-scene" aria-hidden="true" />;
}
