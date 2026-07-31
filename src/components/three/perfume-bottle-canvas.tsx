"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import {
  AdditiveBlending,
  Group,
  MathUtils,
  Points,
  PointsMaterial,
  type BufferGeometry,
} from "three";
import { Suspense, useMemo, useRef, type MutableRefObject } from "react";

function Mist({ progress }: { progress: MutableRefObject<number> }) {
  const points = useRef<Points<BufferGeometry, PointsMaterial>>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(1400 * 3);
    for (let index = 0; index < 1400; index += 1) {
      const distance = Math.pow(index / 1400, 0.62) * 5.8;
      const angle = index * 2.399;
      const spread = 0.06 + distance * 0.34;
      data[index * 3] = Math.cos(angle) * spread + distance;
      data[index * 3 + 1] = 1.45 + Math.sin(angle * 1.7) * spread * 0.62;
      data[index * 3 + 2] = Math.sin(angle) * spread;
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const spray = MathUtils.smoothstep(progress.current, 0.2, 0.42) *
      (1 - MathUtils.smoothstep(progress.current, 0.58, 0.78));
    points.current.material.opacity = spray * 0.8;
    points.current.scale.setScalar(0.15 + spray * 1.05);
    points.current.rotation.x = Math.sin(clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <points ref={points} position={[0.3, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f4dca2"
        size={0.025}
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Bottle({ progress }: { progress: MutableRefObject<number> }) {
  const bottle = useRef<Group>(null);
  const cap = useRef<Group>(null);
  const atomizer = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!bottle.current || !cap.current || !atomizer.current) return;
    const value = progress.current;
    const capLift = MathUtils.smoothstep(value, 0.13, 0.27);
    const press = MathUtils.smoothstep(value, 0.29, 0.34) -
      MathUtils.smoothstep(value, 0.38, 0.44);

    cap.current.position.y = MathUtils.lerp(2.25, 3.45, capLift);
    cap.current.rotation.z = capLift * 0.22;
    atomizer.current.position.y = 1.92 - press * 0.12;
    bottle.current.rotation.y = clock.elapsedTime * 0.16 + value * Math.PI * 1.25 + pointer.x * 0.12;
    bottle.current.rotation.x = pointer.y * 0.06;
    bottle.current.position.x = MathUtils.lerp(0, -1.5, MathUtils.smoothstep(value, 0.55, 0.82));
    bottle.current.position.y = -0.48;
    bottle.current.scale.setScalar(MathUtils.lerp(0.88, 1.24, value));
  });

  return (
    <group ref={bottle}>
      <RoundedBox args={[2.15, 3.35, 1.05]} radius={0.22} smoothness={8} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#2b2118"
          transmission={0.62}
          thickness={1.6}
          roughness={0.12}
          metalness={0.08}
          ior={1.5}
          clearcoat={1}
        />
      </RoundedBox>
      <mesh position={[0, -1.26, 0]}>
        <boxGeometry args={[1.84, 0.32, 0.84]} />
        <meshStandardMaterial color="#8a5a26" roughness={0.25} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0.56]}>
        <boxGeometry args={[1.5, 1.12, 0.035]} />
        <meshStandardMaterial color="#090909" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0.585]}>
        <planeGeometry args={[1.18, 0.82]} />
        <meshStandardMaterial color="#c6a86a" metalness={0.72} roughness={0.28} />
      </mesh>
      <group ref={atomizer} position={[0, 1.92, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 32]} />
          <meshStandardMaterial color="#b69b63" metalness={0.92} roughness={0.16} />
        </mesh>
        <mesh position={[0.16, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.38, 20]} />
          <meshStandardMaterial color="#d4ba7a" metalness={1} roughness={0.12} />
        </mesh>
      </group>
      <group ref={cap} position={[0, 2.25, 0]}>
        <RoundedBox args={[0.95, 0.9, 0.78]} radius={0.08} smoothness={6}>
          <meshStandardMaterial color="#16130f" metalness={0.82} roughness={0.18} />
        </RoundedBox>
      </group>
    </group>
  );
}

function Scene({ progress }: { progress: MutableRefObject<number> }) {
  useFrame(({ camera }) => {
    camera.position.z = MathUtils.lerp(8.2, 6.3, progress.current);
    camera.position.x = MathUtils.lerp(0, 0.45, progress.current);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight position={[4, 7, 5]} intensity={70} color="#ffe1a2" angle={0.35} penumbra={1} />
      <spotLight position={[-5, 1, 3]} intensity={45} color="#8f7252" angle={0.6} penumbra={1} />
      <pointLight position={[0, -2, 2]} intensity={18} color="#c38a35" />
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
        <Bottle progress={progress} />
      </Float>
      <Mist progress={progress} />
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.68} intensity={1.2} mipmapBlur />
        <Vignette eskil={false} offset={0.12} darkness={0.78} />
      </EffectComposer>
    </>
  );
}

export function PerfumeBottleCanvas({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.2], fov: 38 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
      }}
    >
      <Scene progress={progress} />
    </Canvas>
  );
}
