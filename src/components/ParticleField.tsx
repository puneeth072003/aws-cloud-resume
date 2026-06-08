import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const PARTICLE_COUNT = 5000;
const RADIUS = 2.5;

function Sphere({ animate }: { animate: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseX = useRef(0);

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const phi = THREE.MathUtils.randFloatSpread(360);
      arr[i * 3] = RADIUS * Math.sin(theta) * Math.cos(phi);
      arr[i * 3 + 1] = RADIUS * Math.sin(theta) * Math.sin(phi);
      arr[i * 3 + 2] = RADIUS * Math.cos(theta);
    }
    return arr;
  }, []);

  useEffect(() => {
    if (!animate) return;
    const onMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [animate]);

  useFrame(() => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += animate ? 0.0005 + mouseX.current * 0.0005 : 0;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial color={0x38bdf8} size={0.015} sizeAttenuation />
    </points>
  );
}

/** The rotating particle sphere behind the hero, ported from the Three.js scene. */
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
