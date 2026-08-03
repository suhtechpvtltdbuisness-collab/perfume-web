"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import {
  AdditiveBlending,
  CanvasTexture,
  Group,
  LinearFilter,
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
      data[index * 3 + 1] = Math.sin(angle * 1.7) * spread * 0.62;
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
    <points ref={points} position={[0.3, 1.92, 0]}>
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
    bottle.current.position.y = -0.62;
    bottle.current.scale.setScalar(MathUtils.lerp(0.72, 1.02, value));
  });

  return (
    <group ref={bottle}>
      <RoundedBox
        args={[1.86, 3.18, 0.86]}
        radius={0.18}
        smoothness={10}
        position={[0, 0, 0]}
        castShadow
      >
        <meshPhysicalMaterial
          color="#1c1712"
          transmission={0.72}
          thickness={1.85}
          roughness={0.08}
          metalness={0.04}
          ior={1.52}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </RoundedBox>
      <mesh position={[0, -1.22, 0]}>
        <boxGeometry args={[1.58, 0.38, 0.68]} />
        <meshStandardMaterial color="#6f451d" roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.03, 0.455]}>
        <boxGeometry args={[1.26, 0.94, 0.035]} />
        <meshStandardMaterial color="#070604" roughness={0.3} metalness={0.15} />
      </mesh>
      <LabelFrame />
      <mesh position={[0, 1.69, 0]}>
        <cylinderGeometry args={[0.29, 0.34, 0.2, 48]} />
        <meshPhysicalMaterial color="#11100e" metalness={0.72} roughness={0.16} clearcoat={1} />
      </mesh>
      <mesh position={[0, 1.79, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.055, 48]} />
        <meshStandardMaterial color="#c6aa69" metalness={0.95} roughness={0.14} />
      </mesh>
      <group ref={atomizer} position={[0, 1.92, 0]}>
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 0.22, 32]} />
          <meshStandardMaterial color="#b69b63" metalness={0.92} roughness={0.16} />
        </mesh>
        <mesh position={[0.14, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.32, 20]} />
          <meshStandardMaterial color="#d4ba7a" metalness={1} roughness={0.12} />
        </mesh>
      </group>
      <group ref={cap} position={[0, 2.25, 0]}>
        <RoundedBox args={[0.78, 0.76, 0.66]} radius={0.055} smoothness={8} castShadow>
          <meshPhysicalMaterial color="#0b0a08" metalness={0.92} roughness={0.12} clearcoat={1} />
        </RoundedBox>
      </group>
      <Mist progress={progress} />
    </group>
  );
}

function LabelFrame() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 560;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const gradient = context.createLinearGradient(0, 0, 768, 560);
    gradient.addColorStop(0, "#17140f");
    gradient.addColorStop(0.5, "#050504");
    gradient.addColorStop(1, "#15110c");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 768, 560);
    context.strokeStyle = "#d5b974";
    context.lineWidth = 7;
    context.strokeRect(18, 18, 732, 524);
    context.textAlign = "center";
    context.fillStyle = "#ead59d";
    context.font = "58px Georgia";
    context.fillText("A U T O R O M A", 384, 235);
    context.fillStyle = "#b69b63";
    context.font = "20px Arial";
    context.fillText("L U X U R Y   F R A G R A N C E S", 384, 292);
    context.fillStyle = "#8e7950";
    context.font = "16px Arial";
    context.fillText("E X T R A I T   ·   7 5  M L", 384, 430);

    const canvasTexture = new CanvasTexture(canvas);
    canvasTexture.minFilter = LinearFilter;
    canvasTexture.magFilter = LinearFilter;
    canvasTexture.anisotropy = 4;
    return canvasTexture;
  }, []);

  const material = <meshStandardMaterial color="#d6bb79" metalness={0.9} roughness={0.18} />;
  return (
    <group position={[0, -0.03, 0.48]}>
      {texture && (
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[1.08, 0.82]} />
          <meshStandardMaterial map={texture} roughness={0.28} metalness={0.22} />
        </mesh>
      )}
      <mesh position={[0, 0.43, 0]}><boxGeometry args={[1.12, 0.018, 0.014]} />{material}</mesh>
      <mesh position={[0, -0.43, 0]}><boxGeometry args={[1.12, 0.018, 0.014]} />{material}</mesh>
      <mesh position={[-0.55, 0, 0]}><boxGeometry args={[0.018, 0.86, 0.014]} />{material}</mesh>
      <mesh position={[0.55, 0, 0]}><boxGeometry args={[0.018, 0.86, 0.014]} />{material}</mesh>
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
      <ambientLight intensity={0.22} />
      <spotLight position={[4, 7, 5]} intensity={82} color="#ffe3aa" angle={0.32} penumbra={1} castShadow />
      <spotLight position={[-4, 2, 4]} intensity={38} color="#9c7a54" angle={0.48} penumbra={1} />
      <pointLight position={[0, -2.4, 2]} intensity={22} color="#d49a42" />
      <pointLight position={[2.8, 0, -2]} intensity={14} color="#6f87a2" />
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
        <Bottle progress={progress} />
      </Float>
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>
      <ContactShadows
        position={[0, -2.72, 0]}
        opacity={0.34}
        scale={5.5}
        blur={3}
        far={4}
        color="#4b351e"
      />
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
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
      }}
    >
      <Scene progress={progress} />
    </Canvas>
  );
}
