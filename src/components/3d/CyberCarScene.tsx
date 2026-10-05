"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import  * as THREE from "three";
import { Project } from "@/app/type";

export type CameraMode = "chase" | "cockpit" | "orbit" | "map";

export interface CyberCarSceneRef {
  teleportToBiome: (index: number) => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleAudio: () => boolean;
  triggerBoost: () => void;
  setThrottle: (active: boolean) => void;
  setBrake: (active: boolean) => void;
  setSteerLeft: (active: boolean) => void;
  setSteerRight: (active: boolean) => void;
}

interface CyberCarSceneProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onBiomeChange?: (biomeIndex: number, biomeName: string) => void;
  onSpeedChange?: (speed: number) => void;
  onNearProject?: (project: Project | null) => void;
}

// 5 Legendary Biomes Definitions
export const BIOMES = [
  {
    id: "jungle",
    name: "Jungle Tropicale 3D",
    subtitle: "Secteur 01 · Canopy & Flore Sacrée",
    color: "#0a2f1d",
    fogColor: "#051f12",
    accent: "#10B981",
    description: "Forêt dense, lianes suspendues et lumière perçante.",
    trackRange: [0, 0.2] as [number, number],
  },
  {
    id: "pyramids",
    name: "Pyramides d'Égypte 3D",
    subtitle: "Secteur 02 · Mystères des Pharaons",
    color: "#2a1708",
    fogColor: "#1c0d04",
    accent: "#FFC82C",
    description: "Pyramides dorées à capstone lumineux et obélisques antiques.",
    trackRange: [0.2, 0.4] as [number, number],
  },
  {
    id: "sahara",
    name: "Désert du Sahara 3D",
    subtitle: "Secteur 03 · Dunes Infinies & Nuit Étoilée",
    color: "#0c0e21",
    fogColor: "#050714",
    accent: "#A855F7",
    description: "Oasis scintillantes, mirages et voûte céleste cosmique.",
    trackRange: [0.4, 0.6] as [number, number],
  },
  {
    id: "wouri",
    name: "Fleuve du Wouri 3D (Cameroun)",
    subtitle: "Secteur 04 · Le Pont Majestic & Eaux du Littoral",
    color: "#041a29",
    fogColor: "#020f18",
    accent: "#06B6D4",
    description: "Surface aquatique réfléchissante, arches du pont du Wouri et brume fluviale.",
    trackRange: [0.6, 0.8] as [number, number],
  },
  {
    id: "sud_cameroun",
    name: "Forêt du Sud Cameroun 3D",
    subtitle: "Secteur 05 · La Grande Réserve Équatoriale",
    color: "#0e2216",
    fogColor: "#06130b",
    accent: "#84CC16",
    description: "Arbres géants émergents, champignons bioluminescents et lueurs de crépuscule.",
    trackRange: [0.8, 1.0] as [number, number],
  },
];

export const CyberCarScene = forwardRef<CyberCarSceneRef, CyberCarSceneProps>(
  ({ projects, onSelectProject, onBiomeChange, onSpeedChange, onNearProject }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [audioMuted, setAudioMuted] = useState(true);
    const [cameraMode, setCameraModeState] = useState<CameraMode>("chase");

    // Internal animation refs
    const sceneStateRef = useRef<{
      progress: number;
      speed: number;
      targetSpeed: number;
      steering: number;
      laneOffset: number;
      cameraMode: CameraMode;
      boostActive: boolean;
      boostTimer: number;
      nearProject: Project | null;
      activeBiomeIndex: number;
      audioEnabled: boolean;
      audioCtx: AudioContext | null;
      engineOsc: OscillatorNode | null;
      engineGain: GainNode | null;
      // Touch/HUD Virtual Button States
      isAccelerating: boolean;
      isBraking: boolean;
      isSteeringLeft: boolean;
      isSteeringRight: boolean;
    }>({
      progress: 0,
      speed: 0.0,
      targetSpeed: 0.0,
      steering: 0,
      laneOffset: 0,
      cameraMode: "chase",
      boostActive: false,
      boostTimer: 0,
      nearProject: null,
      activeBiomeIndex: 0,
      audioEnabled: false,
      audioCtx: null,
      engineOsc: null,
      engineGain: null,
      isAccelerating: false,
      isBraking: false,
      isSteeringLeft: false,
      isSteeringRight: false,
    });

    const toggleAudio = () => {
      const state = sceneStateRef.current;
      if (!state.audioCtx) {
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          state.audioCtx = new AudioContextClass();
          
          const osc = state.audioCtx.createOscillator();
          const gain = state.audioCtx.createGain();
          
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(60, state.audioCtx.currentTime);
          gain.gain.setValueAtTime(0.04, state.audioCtx.currentTime);
          
          osc.connect(gain);
          gain.connect(state.audioCtx.destination);
          osc.start();
          
          state.engineOsc = osc;
          state.engineGain = gain;
          state.audioEnabled = true;
          setAudioMuted(false);
          return true;
        } catch {
          return false;
        }
      } else {
        if (state.audioCtx.state === "suspended") {
          state.audioCtx.resume();
          state.audioEnabled = true;
          setAudioMuted(false);
          return true;
        } else if (state.audioCtx.state === "running") {
          state.audioCtx.suspend();
          state.audioEnabled = false;
          setAudioMuted(true);
          return false;
        }
      }
      return false;
    };

    const teleportToBiome = (biomeIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(BIOMES.length - 1, biomeIndex));
      const targetProgress = BIOMES[clampedIndex].trackRange[0] + 0.02;
      sceneStateRef.current.progress = targetProgress;
      sceneStateRef.current.speed = 0;
    };

    const setCameraMode = (mode: CameraMode) => {
      sceneStateRef.current.cameraMode = mode;
      setCameraModeState(mode);
    };

    const triggerBoost = () => {
      sceneStateRef.current.boostActive = true;
      sceneStateRef.current.boostTimer = 2.0;
    };

    const setThrottle = (active: boolean) => {
      sceneStateRef.current.isAccelerating = active;
    };
    const setBrake = (active: boolean) => {
      sceneStateRef.current.isBraking = active;
    };
    const setSteerLeft = (active: boolean) => {
      sceneStateRef.current.isSteeringLeft = active;
    };
    const setSteerRight = (active: boolean) => {
      sceneStateRef.current.isSteeringRight = active;
    };

    useImperativeHandle(ref, () => ({
      teleportToBiome,
      setCameraMode,
      toggleAudio,
      triggerBoost,
      setThrottle,
      setBrake,
      setSteerLeft,
      setSteerRight,
    }));

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // 1. Scene, Camera, Renderer
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#050714");
      scene.fog = new THREE.FogExp2("#050714", 0.006);

      const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1200);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // 2. Lighting Setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfffaed, 1.6);
      dirLight.position.set(50, 100, 40);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 300;
      scene.add(dirLight);

      const hemiLight = new THREE.HemisphereLight(0x10b981, 0x0b0d18, 0.9);
      scene.add(hemiLight);

      // 3. Track Spline Curve
      const trackPoints: THREE.Vector3[] = [];
      const numSegments = 120;
      const totalLength = 1600;

      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        const z = t * totalLength;
        const x = Math.sin(t * Math.PI * 6) * 40 + Math.cos(t * Math.PI * 2) * 15;
        let y = Math.sin(t * Math.PI * 8) * 5;

        if (t >= 0.6 && t <= 0.8) {
          // Elevated bridge section over Fleuve Wouri
          y = 10 + Math.sin((t - 0.6) / 0.2 * Math.PI) * 12;
        }

        trackPoints.push(new THREE.Vector3(x, y, z));
      }

      const trackCurve = new THREE.CatmullRomCurve3(trackPoints, false, "centripetal");

      // 4. Highway Road Mesh
      const roadWidth = 16;
      const roadPositions: number[] = [];
      const roadIndices: number[] = [];
      const roadSegments = 400;
      for (let i = 0; i <= roadSegments; i++) {
        const progress = i / roadSegments;
        const point = trackCurve.getPointAt(progress);
        const tangent = trackCurve.getTangentAt(progress);
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const left = point.clone().add(side.clone().multiplyScalar(roadWidth / 2));
        const right = point.clone().add(side.clone().multiplyScalar(-roadWidth / 2));
        roadPositions.push(left.x, left.y + 0.025, left.z, right.x, right.y + 0.025, right.z);

        if (i < roadSegments) {
          const current = i * 2;
          const next = current + 2;
          roadIndices.push(current, next, current + 1, current + 1, next, next + 1);
        }
      }
      const roadGeometry = new THREE.BufferGeometry();
      roadGeometry.setAttribute("position", new THREE.Float32BufferAttribute(roadPositions, 3));
      roadGeometry.setIndex(roadIndices);
      roadGeometry.computeVertexNormals();
      const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x161a2e,
        roughness: 0.3,
        metalness: 0.7,
      });
      const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
      roadMesh.receiveShadow = true;
      scene.add(roadMesh);

      // Neon Gold Edge Lines
      const leftEdgePoints: THREE.Vector3[] = [];
      const rightEdgePoints: THREE.Vector3[] = [];

      for (let i = 0; i <= 400; i++) {
        const u = i / 400;
        const pos = trackCurve.getPointAt(u);
        const tangent = trackCurve.getTangentAt(u);
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

        leftEdgePoints.push(pos.clone().add(normal.clone().multiplyScalar(roadWidth * 0.48)).add(new THREE.Vector3(0, 0.05, 0)));
        rightEdgePoints.push(pos.clone().add(normal.clone().multiplyScalar(-roadWidth * 0.48)).add(new THREE.Vector3(0, 0.05, 0)));
      }

      const leftEdgeLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(leftEdgePoints),
        new THREE.LineBasicMaterial({ color: 0xffc82c, linewidth: 4 })
      );
      const rightEdgeLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(rightEdgePoints),
        new THREE.LineBasicMaterial({ color: 0xffc82c, linewidth: 4 })
      );
      scene.add(leftEdgeLine);
      scene.add(rightEdgeLine);

      // 5. VIBRANT, ULTRA-VISIBLE HIGH-TECH CYBER CAR MODEL
      const carGroup = new THREE.Group();

      // Main Aerodynamic Chassis (Vibrant Gold & Matte Black)
      const bodyGeo = new THREE.BoxGeometry(3.2, 1.2, 5.8);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xffc82c,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0xffc82c,
        emissiveIntensity: 0.25,
      });
      const carBody = new THREE.Mesh(bodyGeo, bodyMat);
      carBody.position.y = 1.0;
      carBody.castShadow = true;
      carGroup.add(carBody);

      // Cyber Black Accent Shell
      const shellGeo = new THREE.BoxGeometry(3.0, 1.1, 3.2);
      const shellMat = new THREE.MeshStandardMaterial({
        color: 0x080c18,
        metalness: 0.95,
        roughness: 0.1,
      });
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      shellMesh.position.set(0, 1.35, -0.4);
      carGroup.add(shellMesh);

      // Neon Cyan Windshield Cockpit
      const cockpitGeo = new THREE.ConeGeometry(1.6, 1.4, 4);
      cockpitGeo.rotateX(Math.PI / 4);
      const cockpitMat = new THREE.MeshPhysicalMaterial({
        color: 0x00f3ff,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.6,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
      });
      const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
      cockpit.position.set(0, 1.9, -0.2);
      cockpit.scale.set(1.4, 0.9, 1.8);
      carGroup.add(cockpit);

      // FLOATING NEON UNDERGLOW HALO RING (makes car POP out from any background)
      const haloGeo = new THREE.RingGeometry(2.0, 3.8, 32);
      haloGeo.rotateX(-Math.PI / 2);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.y = 0.08;
      carGroup.add(haloMesh);

      // Massive Dual Cyan Laser Headlights + Light Beams
      const headlightGeo = new THREE.BoxGeometry(0.8, 0.3, 0.2);
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
      
      const hlLeft = new THREE.Mesh(headlightGeo, headlightMat);
      hlLeft.position.set(-1.1, 1.1, 2.91);
      const hlRight = hlLeft.clone();
      hlRight.position.x = 1.1;
      carGroup.add(hlLeft);
      carGroup.add(hlRight);

      // Forward Light Cones (volumetric beam effect)
      const coneGeo = new THREE.ConeGeometry(3.5, 30, 16);
      coneGeo.rotateX(Math.PI / 2);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });
      const beamLeft = new THREE.Mesh(coneGeo, coneMat);
      beamLeft.position.set(-1.1, 1.0, 17);
      const beamRight = beamLeft.clone();
      beamRight.position.x = 1.1;
      carGroup.add(beamLeft);
      carGroup.add(beamRight);

      // Red Rear LED Bar
      const rearLightGeo = new THREE.BoxGeometry(2.8, 0.25, 0.15);
      const rearLightMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
      const rearLight = new THREE.Mesh(rearLightGeo, rearLightMat);
      rearLight.position.set(0, 1.1, -2.91);
      carGroup.add(rearLight);

      // 4 Glowing Wheels
      const wheels: THREE.Group[] = [];
      const wheelPositions = [
        [-1.7, 0.6, 1.8],
        [1.7, 0.6, 1.8],
        [-1.7, 0.6, -1.8],
        [1.7, 0.6, -1.8],
      ];

      const wheelTireGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 24);
      wheelTireGeo.rotateZ(Math.PI / 2);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x080a10, roughness: 0.7 });
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xffc82c, emissive: 0xffc82c, emissiveIntensity: 0.5, metalness: 0.9 });

      wheelPositions.forEach(([wx, wy, wz]) => {
        const wGroup = new THREE.Group();
        wGroup.position.set(wx, wy, wz);

        const tire = new THREE.Mesh(wheelTireGeo, tireMat);
        wGroup.add(tire);

        const rimGeo = new THREE.TorusGeometry(0.42, 0.08, 12, 24);
        rimGeo.rotateY(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, rimMat);
        wGroup.add(rim);

        carGroup.add(wGroup);
        wheels.push(wGroup);
      });

      scene.add(carGroup);

      // Exhaust Particle System
      const particleCount = 80;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);

      for (let p = 0; p < particleCount; p++) {
        particlePositions[p * 3] = (Math.random() - 0.5) * 1.2;
        particlePositions[p * 3 + 1] = Math.random() * 0.6;
        particlePositions[p * 3 + 2] = -3.0 - Math.random() * 5;
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x00f3ff,
        size: 0.45,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const exhaustParticles = new THREE.Points(particleGeo, particleMat);
      carGroup.add(exhaustParticles);

      // 6. PROCEDURAL BIOMES

      // BIOME 0: Jungle 3D (0% - 20%)
      const jungleGroup = new THREE.Group();
      const treeTrunkGeo = new THREE.CylinderGeometry(0.6, 1.0, 8, 8);
      const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x2b1d0c });
      const treeLeavesMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5, flatShading: true });
      const treeLeavesGeo = new THREE.ConeGeometry(4, 8, 7);

      for (let i = 0; i < 50; i++) {
        const u = 0.01 + Math.random() * 0.18;
        const pos = trackCurve.getPointAt(u);
        const tangent = trackCurve.getTangentAt(u);
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const side = Math.random() > 0.5 ? 1 : -1;
        const dist = 14 + Math.random() * 30;

        const tree = new THREE.Group();
        tree.position.copy(pos.clone().add(normal.multiplyScalar(side * dist)));

        const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
        trunk.position.y = 4;
        tree.add(trunk);

        const leaves = new THREE.Mesh(treeLeavesGeo, treeLeavesMat);
        leaves.position.y = 8;
        tree.add(leaves);

        const s = 0.8 + Math.random() * 0.7;
        tree.scale.set(s, s, s);
        jungleGroup.add(tree);
      }
      scene.add(jungleGroup);

      // BIOME 1: Pyramides d'Égypte 3D (20% - 40%)
      const pyramidsGroup = new THREE.Group();
      const pyramidGeo = new THREE.ConeGeometry(45, 40, 4);
      pyramidGeo.rotateY(Math.PI / 4);
      const pyramidMat = new THREE.MeshStandardMaterial({ color: 0xd4a359, roughness: 0.6 });
      const capstoneMat = new THREE.MeshStandardMaterial({ color: 0xffc82c, emissive: 0xffc82c, emissiveIntensity: 0.9 });

      [
        { u: 0.23, side: -1, offset: 70, scale: 1.2 },
        { u: 0.29, side: 1, offset: 80, scale: 1.6 },
        { u: 0.36, side: -1, offset: 90, scale: 1.1 },
      ].forEach(({ u, side, offset, scale }) => {
        const pos = trackCurve.getPointAt(u);
        const tangent = trackCurve.getTangentAt(u);
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

        const pGroup = new THREE.Group();
        pGroup.position.copy(pos.clone().add(normal.multiplyScalar(side * offset)));
        pGroup.scale.set(scale, scale, scale);

        const pyr = new THREE.Mesh(pyramidGeo, pyramidMat);
        pyr.position.y = 20;
        pGroup.add(pyr);

        const cap = new THREE.Mesh(new THREE.ConeGeometry(6, 6, 4), capstoneMat);
        cap.position.y = 37;
        pGroup.add(cap);

        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(1, 5, 200, 12),
          new THREE.MeshBasicMaterial({ color: 0xffc82c, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending })
        );
        beam.position.y = 130;
        pGroup.add(beam);

        pyramidsGroup.add(pGroup);
      });
      scene.add(pyramidsGroup);

      // BIOME 2: Désert du Sahara 3D (40% - 60%)
      const saharaGroup = new THREE.Group();

      // Cosmic Starry Sky
      const starCount = 800;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);

      for (let s = 0; s < starCount; s++) {
        const u = 0.4 + Math.random() * 0.2;
        const pos = trackCurve.getPointAt(u);
        starPos[s * 3] = pos.x + (Math.random() - 0.5) * 450;
        starPos[s * 3 + 1] = pos.y + 40 + Math.random() * 250;
        starPos[s * 3 + 2] = pos.z + (Math.random() - 0.5) * 450;
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, transparent: true, opacity: 0.85 }));
      saharaGroup.add(stars);

      // Harvest Moon
      const moon = new THREE.Mesh(new THREE.SphereGeometry(22, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffe5b4 }));
      const moonCenter = trackCurve.getPointAt(0.5);
      moon.position.set(moonCenter.x - 140, moonCenter.y + 100, moonCenter.z + 160);
      saharaGroup.add(moon);

      scene.add(saharaGroup);

      // BIOME 3: Fleuve du Wouri 3D (60% - 80%)
      const wouriGroup = new THREE.Group();

      // Water Plane Mesh
      const waterMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 350),
        new THREE.MeshStandardMaterial({ color: 0x033047, roughness: 0.1, metalness: 0.85 })
      );
      waterMesh.rotateX(-Math.PI / 2);
      const wouriCenter = trackCurve.getPointAt(0.7);
      waterMesh.position.set(wouriCenter.x, wouriCenter.y - 10, wouriCenter.z);
      wouriGroup.add(waterMesh);

      // Bridge Arches
      const archMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8 });
      for (let i = 0; i < 5; i++) {
        const u = 0.63 + (i / 5) * 0.14;
        const pos = trackCurve.getPointAt(u);
        const arch = new THREE.Mesh(new THREE.TorusGeometry(14, 0.8, 12, 24, Math.PI), archMat);
        arch.position.set(pos.x, pos.y + 4, pos.z);
        wouriGroup.add(arch);
      }

      scene.add(wouriGroup);

      // BIOME 4: Forêt du Sud Cameroun 3D (80% - 100%)
      const sudCameroonGroup = new THREE.Group();
      const gTrunkGeo = new THREE.CylinderGeometry(2.5, 4.5, 24, 10);
      const gTrunkMat = new THREE.MeshStandardMaterial({ color: 0x1f140a });
      const gCanopyGeo = new THREE.SphereGeometry(15, 10, 10);
      gCanopyGeo.scale(1.4, 0.6, 1.4);
      const gCanopyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, flatShading: true });

      for (let i = 0; i < 30; i++) {
        const u = 0.81 + Math.random() * 0.18;
        const pos = trackCurve.getPointAt(u);
        const tangent = trackCurve.getTangentAt(u);
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const side = Math.random() > 0.5 ? 1 : -1;

        const gTree = new THREE.Group();
        gTree.position.copy(pos.clone().add(normal.multiplyScalar(side * (20 + Math.random() * 35))));

        const trunk = new THREE.Mesh(gTrunkGeo, gTrunkMat);
        trunk.position.y = 12;
        gTree.add(trunk);

        const canopy = new THREE.Mesh(gCanopyGeo, gCanopyMat);
        canopy.position.y = 24;
        gTree.add(canopy);

        sudCameroonGroup.add(gTree);
      }
      scene.add(sudCameroonGroup);

      // 7. 3D Project Holographic Portals
      const waypointsGroup = new THREE.Group();
      const waypointObjects: { mesh: THREE.Group; project: Project; progress: number }[] = [];

      projects.forEach((proj, idx) => {
        const projProgress = 0.05 + (idx / Math.max(projects.length, 1)) * 0.88;
        const pos = trackCurve.getPointAt(projProgress);

        const wpGroup = new THREE.Group();
        wpGroup.position.set(pos.x, pos.y + 5, pos.z);

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(5.5, 0.35, 16, 32),
          new THREE.MeshStandardMaterial({ color: 0xffc82c, emissive: 0xffc82c, emissiveIntensity: 0.8 })
        );
        wpGroup.add(ring);

        const core = new THREE.Mesh(
          new THREE.OctahedronGeometry(2.0, 0),
          new THREE.MeshStandardMaterial({ color: 0x00f3ff, emissive: 0x00f3ff, emissiveIntensity: 0.9, wireframe: true })
        );
        core.name = "core";
        wpGroup.add(core);

        waypointsGroup.add(wpGroup);
        waypointObjects.push({ mesh: wpGroup, project: proj, progress: projProgress });
      });

      scene.add(waypointsGroup);

      // Initial Camera placement directly behind car on Frame 1!
      const initialPos = trackCurve.getPointAt(0);
      const initialTangent = trackCurve.getTangentAt(0);
      carGroup.position.copy(initialPos);
      carGroup.position.y += 0.08;
      carGroup.lookAt(initialPos.clone().add(initialTangent.clone().multiplyScalar(10)));
      camera.position.copy(initialPos.clone().add(initialTangent.clone().multiplyScalar(-22)).add(new THREE.Vector3(0, 9, 0)));
      camera.lookAt(initialPos.clone().add(new THREE.Vector3(0, 2, 0)));

      // 8. Event Listeners (Keyboard & Wheel)
      const keysPressed: { [key: string]: boolean } = {};

      const handleKeyDown = (e: KeyboardEvent) => {
        keysPressed[e.code] = true;
        if (e.code === "KeyC") {
          const modes: CameraMode[] = ["chase", "cockpit", "orbit", "map"];
          const currentIdx = modes.indexOf(sceneStateRef.current.cameraMode);
          setCameraMode(modes[(currentIdx + 1) % modes.length]);
        } else if (e.code === "Space") {
          e.preventDefault();
          triggerBoost();
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        keysPressed[e.code] = false;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * 0.00005;
        sceneStateRef.current.progress = (sceneStateRef.current.progress + delta + 1) % 1;
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      container.addEventListener("wheel", handleWheel, { passive: false });

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // 9. ANIMATION LOOP (Optimized 60FPS)
      let animationFrameId: number;
      const clock = new THREE.Clock();
      let lastReportedSpeed = -1;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.05);
        const time = clock.getElapsedTime();
        const state = sceneStateRef.current;

        // ACCELERATION / BRAKING PHYSICS (No auto-drive unless key or UI pressed!)
        let isDriving = false;

        if (keysPressed["KeyW"] || keysPressed["ArrowUp"] || state.isAccelerating) {
          state.targetSpeed = 72;
          isDriving = true;
        } else if (keysPressed["KeyS"] || keysPressed["ArrowDown"] || state.isBraking) {
          state.targetSpeed = -25;
          isDriving = true;
        } else {
          state.targetSpeed = 0;
        }

        if (state.boostActive) {
          state.boostTimer -= delta;
          state.targetSpeed = 125;
          isDriving = true;
          if (state.boostTimer <= 0) {
            state.boostActive = false;
          }
        }

        // Steer left/right
        if (keysPressed["KeyA"] || keysPressed["ArrowLeft"] || state.isSteeringLeft) {
          state.laneOffset = Math.max(-5.5, state.laneOffset - 9 * delta);
          state.steering = -0.35;
        } else if (keysPressed["KeyD"] || keysPressed["ArrowRight"] || state.isSteeringRight) {
          state.laneOffset = Math.min(5.5, state.laneOffset + 9 * delta);
          state.steering = 0.35;
        } else {
          state.steering *= 0.85;
        }

        // Smooth speed interpolation (friction damping)
        if (isDriving) {
          state.speed += (state.targetSpeed - state.speed) * (1 - Math.exp(-2.2 * delta));
        } else {
          state.speed *= Math.exp(-2.6 * delta);
        }

        if (Math.abs(state.speed) > 0.08) {
          state.progress = (state.progress + (state.speed / 3.6 * delta) / trackCurve.getLength() + 1) % 1;
        } else {
          state.speed = 0;
        }

        if (onSpeedChange) {
          const displayKmH = Math.round(Math.abs(state.speed));
          if (displayKmH !== lastReportedSpeed) {
            lastReportedSpeed = displayKmH;
            onSpeedChange(displayKmH);
          }
        }

        // Position car on 3D spline
        const carProgress = state.progress;
        const carPos = trackCurve.getPointAt(carProgress);
        const carTangent = trackCurve.getTangentAt(carProgress);
        const carNormal = new THREE.Vector3(-carTangent.z, 0, carTangent.x).normalize();

        const finalCarPos = carPos.clone().add(carNormal.multiplyScalar(state.laneOffset));
        finalCarPos.y += 0.08;

        carGroup.position.copy(finalCarPos);
        const lookAtTarget = finalCarPos.clone().add(carTangent.clone().multiplyScalar(10));
        carGroup.lookAt(lookAtTarget);

        carGroup.rotation.z = -state.steering * 0.18;
        wheels[0].rotation.y = state.steering;
        wheels[1].rotation.y = state.steering;

        wheels.forEach((w) => {
          w.children[0].rotation.x += (state.speed / 3.6 * delta) / 0.65;
        });

        // Pulsing Underglow Halo effect
        haloMat.opacity = 0.6 + Math.sin(time * 6) * 0.2;

        // Active Biome Check
        let newBiomeIndex = 0;
        BIOMES.forEach((b, idx) => {
          if (carProgress >= b.trackRange[0] && carProgress < b.trackRange[1]) {
            newBiomeIndex = idx;
          }
        });

        if (newBiomeIndex !== state.activeBiomeIndex) {
          state.activeBiomeIndex = newBiomeIndex;
          const currentBiome = BIOMES[newBiomeIndex];
          if (scene.fog) {
            scene.fog.color.lerp(new THREE.Color(currentBiome.fogColor), 0.1);
            scene.background = scene.fog.color;
          }
          hemiLight.color.lerp(new THREE.Color(currentBiome.accent), 0.1);

          if (onBiomeChange) {
            onBiomeChange(newBiomeIndex, currentBiome.name);
          }
        }

        // Proximity to Waypoints
        let closestProject: Project | null = null;
        waypointObjects.forEach(({ mesh, project, progress }) => {
          const core = mesh.getObjectByName("core");
          if (core) {
            core.rotation.y += delta * 1.5;
            core.rotation.x += delta * 0.8;
          }

          const dist = Math.abs(carProgress - progress);
          if (dist < 0.035) {
            closestProject = project;
          }
        });

        if (closestProject !== state.nearProject) {
          state.nearProject = closestProject;
          if (onNearProject) {
            onNearProject(closestProject);
          }
        }

        // Audio synth pitch update
        if (state.audioEnabled && state.audioCtx && state.engineOsc) {
          const targetFreq = 45 + Math.abs(state.speed) * 0.9;
          state.engineOsc.frequency.setTargetAtTime(targetFreq, state.audioCtx.currentTime, 0.1);
        }

        // Camera Modes
        if (state.cameraMode === "chase") {
          const camOffset = carTangent.clone().multiplyScalar(-22).add(new THREE.Vector3(0, 9, 0));
          if (state.boostActive) {
            camOffset.add(carTangent.clone().multiplyScalar(-8));
          }
          const targetCamPos = finalCarPos.clone().add(camOffset);
          camera.position.lerp(targetCamPos, 1 - Math.exp(-8 * delta));
          camera.lookAt(finalCarPos.clone().add(new THREE.Vector3(0, 2.5, 0)));
        } else if (state.cameraMode === "cockpit") {
          const cockpitPos = finalCarPos.clone().add(new THREE.Vector3(0, 2.0, 0.5));
          camera.position.copy(cockpitPos);
          camera.lookAt(finalCarPos.clone().add(carTangent.clone().multiplyScalar(30)));
        } else if (state.cameraMode === "orbit") {
          const orbitAngle = time * 0.5;
          const orbitRadius = 30;
          camera.position.set(
            finalCarPos.x + Math.sin(orbitAngle) * orbitRadius,
            finalCarPos.y + 14,
            finalCarPos.z + Math.cos(orbitAngle) * orbitRadius
          );
          camera.lookAt(finalCarPos);
        } else if (state.cameraMode === "map") {
          camera.position.set(finalCarPos.x, finalCarPos.y + 180, finalCarPos.z + 10);
          camera.lookAt(finalCarPos);
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("resize", handleResize);
        container.removeEventListener("wheel", handleWheel);

        if (sceneStateRef.current.audioCtx) {
          sceneStateRef.current.audioCtx.close();
        }

        renderer.dispose();
      };
    }, [projects, onSelectProject, onBiomeChange, onSpeedChange, onNearProject]);

    return (
      <div className="relative w-full h-full min-h-[85vh] overflow-hidden bg-[#050714]">
        <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
      </div>
    );
  }
);

CyberCarScene.displayName = "CyberCarScene";
