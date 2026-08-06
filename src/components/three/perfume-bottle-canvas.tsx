"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
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
    const spray =
      MathUtils.smoothstep(progress.current, 0.2, 0.42) *
      (1 - MathUtils.smoothstep(progress.current, 0.58, 0.78));
    points.current.material.opacity = spray * 0.8;
    points.current.scale.setScalar(0.15 + spray * 1.05);
    points.current.rotation.x = Math.sin(clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <points ref={points} position={[0.48, 1.5, 0]}>
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
    const press =
      MathUtils.smoothstep(value, 0.29, 0.34) -
      MathUtils.smoothstep(value, 0.38, 0.44);

    cap.current.position.y = MathUtils.lerp(1.76, 2.96, capLift);
    cap.current.rotation.z = capLift * 0.22;
    atomizer.current.position.y = 1.48 - press * 0.12;
    bottle.current.rotation.y =
      clock.elapsedTime * 0.16 + value * Math.PI * 1.25 + pointer.x * 0.12;
    bottle.current.rotation.x = pointer.y * 0.06;
    bottle.current.position.x = MathUtils.lerp(
      0,
      -1.5,
      MathUtils.smoothstep(value, 0.55, 0.82),
    );
    bottle.current.position.y = -0.62;
    bottle.current.scale.setScalar(MathUtils.lerp(0.72, 1.02, value));
  });

  return (
    <group ref={bottle}>
      <mesh position={[0, -0.34, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 2.42, 64]} />
        <meshPhysicalMaterial
          color="#7D959F"
          transmission={0.08}
          thickness={1.1}
          roughness={0.34}
          metalness={0.02}
          ior={1.52}
          clearcoat={0.58}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh position={[0, -1.54, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.08, 64]} />
        <meshPhysicalMaterial
          color="#7D959F"
          roughness={0.24}
          clearcoat={0.8}
        />
      </mesh>
      <BottleLabels />
      <mesh position={[0, 0.96, 0]}>
        <cylinderGeometry args={[0.67, 0.67, 0.26, 64]} />
        <meshPhysicalMaterial
          color="#0a0b0d"
          metalness={0.48}
          roughness={0.12}
          clearcoat={1}
        />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.42, 0.48, 0.24, 48]} />
        <meshPhysicalMaterial
          color="#090a0c"
          metalness={0.58}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>
      <group ref={atomizer} position={[0, 1.48, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.36, 40]} />
          <meshStandardMaterial
            color="#07080a"
            metalness={0.62}
            roughness={0.12}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.39, 0.39, 0.23, 48]} />
          <meshPhysicalMaterial
            color="#08090b"
            metalness={0.72}
            roughness={0.08}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0.37, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.055, 0.28, 20]} />
          <meshStandardMaterial
            color="#101216"
            metalness={0.75}
            roughness={0.1}
          />
        </mesh>
      </group>
      <group ref={cap} position={[0, 1.76, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.54, 0.54, 0.94, 64, 1, true]} />
          <meshPhysicalMaterial
            color="#b9c8ee"
            transmission={0.82}
            thickness={0.12}
            transparent
            opacity={0.48}
            roughness={0.05}
            metalness={0}
            ior={1.46}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0.47, 0]}>
          <cylinderGeometry args={[0.54, 0.54, 0.045, 64]} />
          <meshPhysicalMaterial
            color="#c5d0ed"
            transmission={0.8}
            transparent
            opacity={0.52}
            roughness={0.04}
          />
        </mesh>
      </group>
      <Mist progress={progress} />
    </group>
  );
}

function createBottleLabel(side: "front" | "back") {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 920;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createLinearGradient(0, 0, 720, 920);
  gradient.addColorStop(0, "#101824");
  gradient.addColorStop(0.5, "#070b13");
  gradient.addColorStop(1, "#111824");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 720, 920);
  context.strokeStyle = "#125bcc";
  context.lineWidth = 4;
  [
    [-40, 170, 760, 650],
    [60, -40, 610, 960],
    [550, -30, 690, 950],
    [-20, 610, 740, 320],
  ].forEach(([x1, y1, x2, y2]) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  });
  context.fillStyle = "#f3f4f7";
  context.textAlign = "center";

  if (side === "front") {
    context.strokeStyle = "#edf2ff";
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(145, 302);
    context.bezierCurveTo(230, 222, 365, 216, 455, 275);
    context.bezierCurveTo(505, 307, 555, 318, 592, 300);
    context.stroke();
    context.strokeStyle = "#1b6ef3";
    context.lineWidth = 7;
    context.beginPath();
    context.moveTo(148, 318);
    context.bezierCurveTo(280, 282, 410, 342, 585, 306);
    context.stroke();
    context.font = "600 66px Arial";
    context.fillText("AUTOROMA", 360, 430);
    context.fillStyle = "#226de2";
    context.font = "24px Arial";
    context.fillText("PRESTIGE SCENTED RIDES", 360, 478);
    context.fillStyle = "#f0f0f1";
    context.font = "bold 46px Georgia";
    context.fillText("MODISH SEDUCTION", 360, 575);
    context.font = "italic 29px Georgia";
    context.fillText("30ml", 360, 660);
  } else {
    context.textAlign = "left";
    context.font = "25px Georgia";
    const lines = [
      "Indulge in Luxury: Experience the world's finest fragrance,",
      "reimagined for your car.",
      "Crafted in India with the highest quality standards, our",
      "car fresheners are inspired by iconic perfumes, bringing",
      "a touch of opulence to every drive.",
      "Infusion: Top Notes: Fruity · Vanilla · Slight Powder",
      "Middle Notes: White Flower · Base Notes: Musk Amber",
      "How to use: Use 2 sprays in the air and one spray on fabric.",
      "Caution: Keep away from children. Do not spray on leather.",
    ];
    lines.forEach((line, index) =>
      context.fillText(line, 38, 120 + index * 72),
    );
    context.textAlign = "center";
    context.fillStyle = "#8fb4ff";
    context.font = "22px Arial";
    context.fillText("AUTOROMA · 30 ML", 360, 825);
  }

  const canvasTexture = new CanvasTexture(canvas);
  canvasTexture.minFilter = LinearFilter;
  canvasTexture.magFilter = LinearFilter;
  canvasTexture.anisotropy = 4;
  return canvasTexture;
}

function BottleLabels() {
  const frontTexture = useMemo(() => createBottleLabel("front"), []);
  const backTexture = useMemo(() => createBottleLabel("back"), []);

  return (
    <group position={[0, -0.36, 0]}>
      {frontTexture && (
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry
            args={[0.726, 0.726, 1.72, 64, 1, true, -Math.PI / 2, Math.PI]}
          />
          <meshStandardMaterial
            map={frontTexture}
            roughness={0.38}
            metalness={0.08}
          />
        </mesh>
      )}
      {backTexture && (
        <mesh>
          <cylinderGeometry
            args={[0.726, 0.726, 1.72, 64, 1, true, Math.PI / 2, Math.PI]}
          />
          <meshStandardMaterial
            map={backTexture}
            roughness={0.38}
            metalness={0.08}
          />
        </mesh>
      )}
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
      <spotLight
        position={[4, 7, 5]}
        intensity={82}
        color="#ffe3aa"
        angle={0.32}
        penumbra={1}
        castShadow
      />
      <spotLight
        position={[-4, 2, 4]}
        intensity={38}
        color="#9c7a54"
        angle={0.48}
        penumbra={1}
      />
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
