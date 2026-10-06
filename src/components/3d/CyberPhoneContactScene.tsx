"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";

export interface CyberPhoneContactSceneRef {
  triggerSubmitAnimation: () => void;
  toggleAudio: () => boolean;
}

interface CyberPhoneContactSceneProps {
  accentColor?: string;
}

export const CyberPhoneContactScene = forwardRef<CyberPhoneContactSceneRef, CyberPhoneContactSceneProps>(
  ({ accentColor = "#FFC82C" }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneStateRef = useRef<{
      submitting: boolean;
      animProgress: number;
      targetMouseX: number;
      targetMouseY: number;
    }>({
      submitting: false,
      animProgress: 0,
      targetMouseX: 0,
      targetMouseY: 0,
    });

    const triggerSubmitAnimation = () => {
      sceneStateRef.current.submitting = true;
      sceneStateRef.current.animProgress = 0;
    };

    const toggleAudio = () => {
      return true;
    };

    useImperativeHandle(ref, () => ({
      triggerSubmitAnimation,
      toggleAudio,
    }));

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // 1. Scene, Camera, Renderer
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#0b0d18");

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
      camera.position.set(0, 4, 26);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // 2. Studio Lighting Setup (Tailored to Gold DA)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Key light with warm gold hue
      const keyLight = new THREE.DirectionalLight(0xffc82c, 2.5);
      keyLight.position.set(20, 30, 20);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.bias = -0.0001;
      scene.add(keyLight);

      // Rim light from back left (Crimson accent)
      const rimLight = new THREE.DirectionalLight(0xff3b56, 1.8);
      rimLight.position.set(-25, 20, -15);
      scene.add(rimLight);

      // Fill light
      const fillLight = new THREE.PointLight(0xffd700, 2.0, 50);
      fillLight.position.set(0, 5, 15);
      scene.add(fillLight);

      // 3. Ground Studio Shadow Plane
      const groundGeo = new THREE.PlaneGeometry(120, 120);
      const groundMat = new THREE.ShadowMaterial({ opacity: 0.7 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -3.2;
      ground.receiveShadow = true;
      scene.add(ground);

      // 4. MAIN 3D MODEL GROUP (Phone + Speech Bubble)
      const mainGroup = new THREE.Group();
      mainGroup.position.set(2, 0, 0);

      // Primary Brand Gold Yellow Metallic Material
      const phoneMat = new THREE.MeshStandardMaterial({
        color: 0xffc82c,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0xffc82c,
        emissiveIntensity: 0.25,
      });

      const obsidianMat = new THREE.MeshStandardMaterial({
        color: 0x121526,
        metalness: 0.9,
        roughness: 0.15,
      });

      const crimsonMat = new THREE.MeshStandardMaterial({
        color: 0xff3b56,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0xff3b56,
        emissiveIntensity: 0.4,
      });

      // --- A) 3D CHAT SPEECH BUBBLE ---
      const bubbleGroup = new THREE.Group();
      bubbleGroup.position.set(-4.5, 2.2, -3.5);

      const bubbleBodyGeo = new THREE.BoxGeometry(9, 6.5, 1.2);
      const bubbleBody = new THREE.Mesh(bubbleBodyGeo, phoneMat);
      bubbleBody.castShadow = true;
      bubbleGroup.add(bubbleBody);

      // Tail of speech bubble
      const tailShape = new THREE.Shape();
      tailShape.moveTo(0, 0);
      tailShape.lineTo(-2, -2);
      tailShape.lineTo(0, -2);
      tailShape.closePath();

      const extrudeSettings = { depth: 1.2, bevelEnabled: false };
      const tailGeo = new THREE.ExtrudeGeometry(tailShape, extrudeSettings);
      const tailMesh = new THREE.Mesh(tailGeo, phoneMat);
      tailMesh.position.set(-3.5, -2.8, -0.6);
      bubbleGroup.add(tailMesh);

      // 3 horizontal slots on bubble
      for (let i = 0; i < 3; i++) {
        const slotGeo = new THREE.BoxGeometry(6.2, 0.5, 0.4);
        const slot = new THREE.Mesh(slotGeo, obsidianMat);
        slot.position.set(0, 1.4 - i * 1.3, 0.5);
        bubbleGroup.add(slot);
      }

      mainGroup.add(bubbleGroup);

      // --- B) 3D RETRO ROTARY TELEPHONE IN ROYAL GOLD ---
      const phoneGroup = new THREE.Group();
      phoneGroup.position.set(2.5, -1.8, 1);

      // Base Body
      const baseGeo = new THREE.CylinderGeometry(3.6, 5.2, 3.2, 32);
      const baseMesh = new THREE.Mesh(baseGeo, phoneMat);
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      phoneGroup.add(baseMesh);

      // Front Rotary Wheel Dial Plate
      const dialPlateGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.4, 32);
      dialPlateGeo.rotateX(Math.PI / 4);
      const dialPlate = new THREE.Mesh(dialPlateGeo, phoneMat);
      dialPlate.position.set(0, 0.6, 2.2);
      dialPlate.castShadow = true;
      phoneGroup.add(dialPlate);

      // Rotary Finger Wheel
      const dialWheelGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.15, 32);
      dialWheelGeo.rotateX(Math.PI / 4);
      const dialWheel = new THREE.Mesh(dialWheelGeo, obsidianMat);
      dialWheel.name = "dialWheel";
      dialWheel.position.set(0, 0.7, 2.3);
      phoneGroup.add(dialWheel);

      // Center Crimson Button on Dial
      const centerBtnGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 24);
      centerBtnGeo.rotateX(Math.PI / 4);
      const centerBtn = new THREE.Mesh(centerBtnGeo, crimsonMat);
      centerBtn.position.set(0, 0.78, 2.35);
      phoneGroup.add(centerBtn);

      // Cradle Forks for Handset
      const forkGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.4, 16);
      const forkLeft = new THREE.Mesh(forkGeo, obsidianMat);
      forkLeft.position.set(-1.8, 1.9, 0);
      const forkRight = forkLeft.clone();
      forkRight.position.x = 1.8;
      phoneGroup.add(forkLeft);
      phoneGroup.add(forkRight);

      // Handset Receiver (Bar + 2 Earpieces)
      const handsetGroup = new THREE.Group();
      handsetGroup.name = "handsetGroup";
      handsetGroup.position.set(0, 2.6, 0);

      // Bar handle
      const handleBarGeo = new THREE.CylinderGeometry(0.45, 0.45, 7.8, 24);
      handleBarGeo.rotateZ(Math.PI / 2);
      const handleBar = new THREE.Mesh(handleBarGeo, phoneMat);
      handleBar.castShadow = true;
      handsetGroup.add(handleBar);

      // Left Earpiece Cup
      const cupGeo = new THREE.SphereGeometry(1.4, 24, 24);
      cupGeo.scale(1, 0.6, 1);
      const cupLeft = new THREE.Mesh(cupGeo, phoneMat);
      cupLeft.position.set(-3.7, 0, 0);
      cupLeft.castShadow = true;
      handsetGroup.add(cupLeft);

      // Right Earpiece Cup
      const cupRight = cupLeft.clone();
      cupRight.position.x = 3.7;
      handsetGroup.add(cupRight);

      phoneGroup.add(handsetGroup);

      // --- C) SPIRAL COILED TELEPHONE CORD ---
      const cordPoints: THREE.Vector3[] = [];
      const coilTurns = 18;
      const coilLength = 6.0;

      for (let i = 0; i <= 150; i++) {
        const t = i / 150;
        const angle = t * Math.PI * 2 * coilTurns;
        const radius = 0.5 + Math.sin(t * Math.PI) * 0.2;
        const x = -3.5 - t * coilLength + Math.cos(angle) * radius * 0.4;
        const y = 2.0 - t * 3.5 + Math.sin(angle) * radius * 0.4;
        const z = t * 2.5 + Math.sin(angle * 0.5) * 0.3;
        cordPoints.push(new THREE.Vector3(x, y, z));
      }

      const cordCurve = new THREE.CatmullRomCurve3(cordPoints);
      const cordGeo = new THREE.TubeGeometry(cordCurve, 150, 0.12, 8, false);
      const cordMesh = new THREE.Mesh(cordGeo, obsidianMat);
      phoneGroup.add(cordMesh);

      mainGroup.add(phoneGroup);
      scene.add(mainGroup);

      // Floating Gold/Crimson particles
      const pCount = 200;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);

      for (let p = 0; p < pCount; p++) {
        pPos[p * 3] = (Math.random() - 0.5) * 40;
        pPos[p * 3 + 1] = Math.random() * 25 - 5;
        pPos[p * 3 + 2] = (Math.random() - 0.5) * 30;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ color: 0xffc82c, size: 0.35, transparent: true, opacity: 0.65 });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // Mouse interactive tilt
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        const my = (e.clientY - rect.top) / rect.height - 0.5;
        sceneStateRef.current.targetMouseX = mx * 0.35;
        sceneStateRef.current.targetMouseY = my * 0.25;
      };

      window.addEventListener("mousemove", handleMouseMove);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // Render Loop
      let animId: number;
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();
        const state = sceneStateRef.current;

        mainGroup.rotation.y += (state.targetMouseX - mainGroup.rotation.y) * 0.08;
        mainGroup.rotation.x += (-state.targetMouseY - mainGroup.rotation.x) * 0.08;

        mainGroup.position.y = Math.sin(time * 1.5) * 0.3;

        const dial = phoneGroup.getObjectByName("dialWheel");
        if (dial) {
          dial.rotation.z = Math.sin(time * 2) * 0.15;
        }

        const handset = phoneGroup.getObjectByName("handsetGroup");
        if (handset && state.submitting) {
          state.animProgress += delta * 2.5;
          handset.position.y = 2.6 + Math.sin(state.animProgress * Math.PI) * 2.2;
          handset.rotation.z = Math.sin(state.animProgress * Math.PI) * 0.25;

          if (state.animProgress >= 1.0) {
            state.submitting = false;
            handset.position.y = 2.6;
            handset.rotation.z = 0;
          }
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
      };
    }, [accentColor]);

    return (
      <div className="relative w-full h-full min-h-[500px] md:min-h-[650px] overflow-hidden select-none">
        <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
      </div>
    );
  }
);

CyberPhoneContactScene.displayName = "CyberPhoneContactScene";
