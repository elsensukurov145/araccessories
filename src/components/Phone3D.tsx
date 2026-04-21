import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float, Sparkles, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function ScreenGradient() {
  // Animated radial gradient texture for the screen
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#1e3a8a');
    grad.addColorStop(0.5, '#7c3aed');
    grad.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    // glowing orbs
    for (let i = 0; i < 4; i++) {
      const r = ctx.createRadialGradient(
        40 + i * 60, 60 + i * 50, 5,
        40 + i * 60, 60 + i * 50, 80
      );
      r.addColorStop(0, 'rgba(212,175,55,0.5)');
      r.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = r;
      ctx.fillRect(0, 0, size, size);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (matRef.current) {
      // subtle pulsing emissive
      matRef.current.emissiveIntensity = 0.55 + Math.sin(state.clock.elapsedTime * 1.2) * 0.18;
    }
  });

  return (
    <meshStandardMaterial
      ref={matRef}
      map={texture}
      emissive="#4f46e5"
      emissiveMap={texture}
      emissiveIntensity={0.6}
      metalness={0.3}
      roughness={0.15}
    />
  );
}

function PhoneMesh({ tilt, reducedMotion, isMobile }: { tilt: { x: number; y: number }; reducedMotion: boolean; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentTilt = useRef({ x: 0, z: 0 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Y rotation: 360deg over ~10s — disabled on mobile and reduced motion
    if (!reducedMotion && !isMobile) {
      groupRef.current.rotation.y += delta * 0.55;
    }
    // Spring-lerp toward target tilt for a "heavy" feel (mobile = no tilt)
    const targetX = isMobile ? 0 : tilt.y * 0.22;
    const targetZ = isMobile ? 0 : tilt.x * 0.22;
    // critically-damped-ish spring approximation
    currentTilt.current.x += (targetX - currentTilt.current.x) * Math.min(1, delta * 4);
    currentTilt.current.z += (targetZ - currentTilt.current.z) * Math.min(1, delta * 4);
    groupRef.current.rotation.x = currentTilt.current.x;
    groupRef.current.rotation.z = currentTilt.current.z;
  });

  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0a0a0d', metalness: 0.95, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1,
  }), []);
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a2a30', metalness: 1, roughness: 0.25,
  }), []);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d4af37', metalness: 1, roughness: 0.12,
  }), []);
  const lensMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0a0a0a', metalness: 1, roughness: 0.05, clearcoat: 1,
  }), []);

  return (
    <group ref={groupRef}>
      {/* Outer chassis */}
      <RoundedBox args={[1.7, 3.4, 0.22]} radius={0.22} smoothness={6} material={bodyMat} />
      {/* Polished metal frame ring */}
      <RoundedBox args={[1.72, 3.42, 0.2]} radius={0.22} smoothness={6} material={frameMat} />
      {/* Screen */}
      <RoundedBox args={[1.55, 3.18, 0.02]} radius={0.18} smoothness={6} position={[0, 0, 0.115]}>
        <ScreenGradient />
      </RoundedBox>
      {/* Dynamic island */}
      <mesh position={[0, 1.35, 0.13]}>
        <capsuleGeometry args={[0.06, 0.28, 8, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {/* Camera bump */}
      <RoundedBox args={[0.62, 0.62, 0.1]} radius={0.12} smoothness={4} position={[-0.45, 1.18, -0.14]}>
        <meshStandardMaterial color="#15151a" metalness={0.8} roughness={0.3} />
      </RoundedBox>
      {[[-0.55, 1.28], [-0.35, 1.28], [-0.55, 1.08], [-0.35, 1.08]].map(([x, y], i) => (
        <group key={i} position={[x, y, -0.2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={lensMat}>
            <cylinderGeometry args={[0.085, 0.085, 0.04, 32]} />
          </mesh>
          <mesh position={[0, 0, -0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 24]} />
            <meshStandardMaterial color="#1a3d8f" metalness={0.9} roughness={0.1} emissive="#1a3d8f" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
      {/* Side buttons (gold accent) */}
      <mesh position={[0.86, 0.6, 0]} material={accentMat}>
        <boxGeometry args={[0.04, 0.55, 0.09]} />
      </mesh>
      <mesh position={[-0.86, 0.7, 0]} material={accentMat}>
        <boxGeometry args={[0.04, 0.25, 0.08]} />
      </mesh>
      <mesh position={[-0.86, 0.35, 0]} material={accentMat}>
        <boxGeometry args={[0.04, 0.4, 0.08]} />
      </mesh>
    </group>
  );
}

function PulsingBloom() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const p = 0.6 + Math.sin(s.clock.elapsedTime * 1.5) * 0.18;
    ref.current.scale.set(p, p, p);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(s.clock.elapsedTime * 1.5) * 0.1;
  });
  return (
    <mesh ref={ref} position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.6, 48]} />
      <meshBasicMaterial color="#d4af37" transparent opacity={0.3} />
    </mesh>
  );
}

export default function Phone3D() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const lastMoveRef = useRef(0);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    setReducedMotion(motion.matches);
    setIsMobile(mobile.matches);
    const onMotion = () => setReducedMotion(motion.matches);
    const onMobile = () => setIsMobile(mobile.matches);
    motion.addEventListener('change', onMotion);
    mobile.addEventListener('change', onMobile);
    return () => {
      motion.removeEventListener('change', onMotion);
      mobile.removeEventListener('change', onMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return; // no mouse tilt on mobile
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMoveRef.current < 16) return; // 60fps debounce
      lastMoveRef.current = now;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
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
  }, [isMobile]);

  return (
    <div ref={containerRef} className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 32 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={1.3} castShadow />
        <directionalLight position={[-5, -2, 3]} intensity={0.5} color="#d4af37" />
        <pointLight position={[0, 0, 4]} intensity={0.6} color="#7c3aed" />
        <Suspense fallback={null}>
          <Float
            speed={reducedMotion ? 0 : 1.4}
            rotationIntensity={0}
            floatIntensity={reducedMotion ? 0 : 0.8}
            floatingRange={[-0.15, 0.15]}
          >
            <PhoneMesh tilt={tilt} reducedMotion={reducedMotion} isMobile={isMobile} />
          </Float>
          {!reducedMotion && (
            <Sparkles count={40} scale={[5, 6, 3]} size={3} speed={0.4} color="#d4af37" opacity={0.7} />
          )}
          <PulsingBloom />
          <ContactShadows position={[0, -2.1, 0]} opacity={0.55} scale={6} blur={2.6} far={3} color="#000" />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
