import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function PhoneMesh({ tilt, reducedMotion }: { tilt: { x: number; y: number }; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Y rotation: 360deg over ~10s => 2π / 10 ≈ 0.628 rad/s
    if (!reducedMotion) {
      groupRef.current.rotation.y += delta * 0.628;
    }
    // Smooth tilt toward cursor (max ~15deg = 0.26 rad)
    const targetX = tilt.y * 0.26;
    const targetZ = tilt.x * 0.26;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08;
    groupRef.current.rotation.z += (targetZ - groupRef.current.rotation.z) * 0.08;
  });

  // Memoize materials to avoid re-creation
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0f0f12', metalness: 0.85, roughness: 0.25 }), []);
  const screenMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0a1f44', metalness: 0.4, roughness: 0.1, emissive: '#1a3d8f', emissiveIntensity: 0.3 }), []);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 1, roughness: 0.15 }), []);

  return (
    <group ref={groupRef}>
      {/* Phone body */}
      <RoundedBox args={[1.6, 3.2, 0.18]} radius={0.18} smoothness={4} material={bodyMat} />
      {/* Screen */}
      <RoundedBox args={[1.45, 3.0, 0.02]} radius={0.14} smoothness={4} position={[0, 0, 0.1]} material={screenMat} />
      {/* Camera bump */}
      <mesh position={[-0.45, 1.15, -0.11]}>
        <boxGeometry args={[0.55, 0.55, 0.08]} />
        <meshStandardMaterial color="#1a1a1f" metalness={0.7} roughness={0.3} />
      </mesh>
      {[[-0.55, 1.25], [-0.35, 1.25], [-0.55, 1.05], [-0.35, 1.05]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 24]} />
          <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Accent button on side */}
      <mesh position={[0.81, 0.6, 0]} material={accentMat}>
        <boxGeometry args={[0.04, 0.5, 0.08]} />
      </mesh>
    </group>
  );
}

export default function Phone3D() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Normalize -1..1
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pendingRef.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, -y)) };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          if (pendingRef.current) setTilt(pendingRef.current);
          rafRef.current = null;
        });
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />
        <directionalLight position={[-5, -3, 2]} intensity={0.4} color="#d4af37" />
        <Suspense fallback={null}>
          <PhoneMesh tilt={tilt} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
