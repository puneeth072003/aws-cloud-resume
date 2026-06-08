import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const PARTICLE_COUNT = 5000;
const RADIUS = 2.5;
const ATTRACT_RADIUS = 1.3; // world units around the cursor that react
const ATTRACT_STRENGTH = 0.55; // how strongly particles pull toward the cursor
const RETURN_EASE = 0.08; // how quickly they drift back home

function Sphere({ animate }: { animate: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Resting positions on the sphere (home) + the live positions we mutate.
  const { home, live } = useMemo(() => {
    const home = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const phi = THREE.MathUtils.randFloatSpread(360);
      home[i * 3] = RADIUS * Math.sin(theta) * Math.cos(phi);
      home[i * 3 + 1] = RADIUS * Math.sin(theta) * Math.sin(phi);
      home[i * 3 + 2] = RADIUS * Math.cos(theta);
    }
    return { home, live: home.slice() };
  }, []);

  // Cursor target in the sphere's local space; null when the cursor is away.
  const target = useRef<THREE.Vector3 | null>(null);
  const plane = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    if (animate) {
      points.rotation.y += 0.0006 + state.pointer.x * 0.0004;
    }

    // Project the cursor onto the z=0 plane to get a world-space point, then
    // rotate it into the points' local space (they only spin around Y).
    let localX = 0;
    let localY = 0;
    let localZ = 0;
    const hasTarget = target.current !== null && animate;
    if (hasTarget) {
      const t = target.current!;
      const rot = -points.rotation.y;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      localX = t.x * cos + t.z * sin;
      localZ = -t.x * sin + t.z * cos;
      localY = t.y;
    }

    const geom = points.geometry;
    const arr = (geom.getAttribute("position") as THREE.BufferAttribute)
      .array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const hx = home[ix];
      const hy = home[ix + 1];
      const hz = home[ix + 2];

      let tx = hx;
      let ty = hy;
      let tz = hz;

      if (hasTarget) {
        const dx = localX - hx;
        const dy = localY - hy;
        const dz = localZ - hz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < ATTRACT_RADIUS) {
          const pull = (1 - dist / ATTRACT_RADIUS) * ATTRACT_STRENGTH;
          tx = hx + dx * pull;
          ty = hy + dy * pull;
          tz = hz + dz * pull;
        }
      }

      live[ix] += (tx - live[ix]) * RETURN_EASE;
      live[ix + 1] += (ty - live[ix + 1]) * RETURN_EASE;
      live[ix + 2] += (tz - live[ix + 2]) * RETURN_EASE;

      arr[ix] = live[ix];
      arr[ix + 1] = live[ix + 1];
      arr[ix + 2] = live[ix + 2];
    }
    geom.getAttribute("position").needsUpdate = true;
  });

  const updateTarget = (e: ThreeEvent<PointerEvent>) => {
    // The event point is already in world space; store it for the next frame.
    target.current = plane.copy(e.point);
  };

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[live, 3]}
            count={PARTICLE_COUNT}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0x38bdf8}
          size={0.02}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>

      {/* Transparent interaction plane (sibling, so it doesn't spin with the
          points) that captures the cursor's world position via raycasting. */}
      <mesh
        onPointerMove={updateTarget}
        onPointerLeave={() => (target.current = null)}
      >
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

/** The rotating particle sphere behind the hero; particles drift toward the cursor. */
export function ParticleField() {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <Canvas
      id="hero-canvas"
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ alpha: true, antialias: true }}
    >
      <Sphere animate={!reducedMotion} />
    </Canvas>
  );
}
