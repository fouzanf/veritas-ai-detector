"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, PerspectiveCamera, MeshWobbleMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.1;
      meshRef.current.rotation.y = t * 0.15;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05;
    }
  });

  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[2, 1]} />
          <MeshWobbleMaterial
            color="#6C63FF"
            factor={0.4}
            speed={2}
            roughness={0}
            metalness={1}
            emissive="#6C63FF"
            emissiveIntensity={0.2}
            wireframe
          />
        </mesh>
      </Float>

      <Points ref={particlesRef} positions={particles}>
        <PointMaterial
          transparent
          color="#00FFCC"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </>
  );
}

export function HeroGlobe() {
  return (
    <div className="w-full h-full min-h-[400px] sm:min-h-[500px] absolute inset-0 -z-10 opacity-70">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#6C63FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00FFCC" />
        <Scene />
      </Canvas>
    </div>
  );
}
