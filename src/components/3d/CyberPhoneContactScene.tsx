"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import *  as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export interface CyberPhoneContactSceneRef {
  triggerSubmitAnimation: () => void;
  toggleAudio: () => boolean;
}

interface CyberPhoneContactSceneProps {
  accentColor?: string;
}

const SUBMIT_DURATION = 1.4;

export const CyberPhoneContactScene = forwardRef<CyberPhoneContactSceneRef, CyberPhoneContactSceneProps>(
  ({ accentColor = "#FFC82C" }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneStateRef = useRef({
      submitting: false,
      animProgress: 0,
      targetMouseX: 0,
      targetMouseY: 0,
    });

    useImperativeHandle(ref, () => ({
      triggerSubmitAnimation: () => {
        sceneStateRef.current.submitting = true;
        sceneStateRef.current.animProgress = 0;
      },
      toggleAudio: () => true,
    }));

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      let width = container.clientWidth || 1;
      let height = container.clientHeight || 1;
      const isMobile = width < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      const accent = new THREE.Color(accentColor);

      // 1. Scene, Camera, Renderer
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#0b0d18");
      scene.fog = new THREE.Fog("#0b0d18", 30, 80);

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
      camera.position.set(4, 5, 26);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // 2. Environment & Studio Lighting
      const pmrem = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      const envTex = pmrem.fromScene(roomEnv, 0.04).texture;
      scene.environment = envTex;

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));

      const keyLight = new THREE.DirectionalLight(accent.getHex(), 2.8);
      keyLight.position.set(18, 28, 20);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
      keyLight.shadow.bias = -0.0002;
      keyLight.shadow.radius = 4;
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xff3b56, 2.4);
      rimLight.position.set(-25, 18, -15);
      scene.add(rimLight);

      const fillLight = new THREE.PointLight(0xffd36b, 150, 60, 2);
      fillLight.position.set(0, 6, 16);
      scene.add(fillLight);

      // 3. Materials
      const goldMat = new THREE.MeshPhysicalMaterial({
        color: accent,
        metalness: 0.95,
        roughness: 0.18,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.4,
        emissive: accent,
        emissiveIntensity: 0.08,
      });

      const obsidianMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a0c16,
        metalness: 0.8,
        roughness: 0.15,
        clearcoat: 1.0,
        envMapIntensity: 1.2,
      });

      const glassScreenMat = new THREE.MeshPhysicalMaterial({
        color: 0x080a12,
        roughness: 0.05,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transmission: 0.2,
        opacity: 0.98,
        transparent: true,
      });

      const crimsonMat = new THREE.MeshStandardMaterial({
        color: 0xff3b56,
        emissive: 0xff3b56,
        emissiveIntensity: 0.9,
        roughness: 0.3,
      });

      // 4. Main Group (Free-Floating in 3D Space - No Box / No Cadran)
      const mainGroup = new THREE.Group();
      mainGroup.position.set(0, 0, 0);
      scene.add(mainGroup);

      // Studio Shadow Ground Plane
      const groundGeo = new THREE.PlaneGeometry(100, 100);
      const groundMat = new THREE.ShadowMaterial({ opacity: 0.65 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -5.5;
      ground.receiveShadow = true;
      scene.add(ground);

      // --- A) 3D CHAT SPEECH BUBBLE ---
      const bubbleGroup = new THREE.Group();
      const bubbleBaseY = 3.2;
      bubbleGroup.position.set(-4.5, bubbleBaseY, -3.0);

      const bubbleMesh = new THREE.Mesh(new RoundedBoxGeometry(8.5, 5.8, 1.0, 6, 0.45), goldMat);
      bubbleGroup.add(bubbleMesh);

      // Bubble Tail
      const tailShape = new THREE.Shape();
      tailShape.moveTo(-3.0, -2.4);
      tailShape.lineTo(-1.0, -2.4);
      tailShape.lineTo(-3.4, -4.2);
      tailShape.closePath();

      const tailGeo = new THREE.ExtrudeGeometry(tailShape, {
        depth: 0.6,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.15,
      });
      tailGeo.translate(0, 0, -0.3);
      bubbleGroup.add(new THREE.Mesh(tailGeo, goldMat));

      // UI Slots on Bubble
      [
        { w: 6.0, y: 1.4 },
        { w: 4.2, y: 0.4 },
      ].forEach((r) => {
        const slot = new THREE.Mesh(new RoundedBoxGeometry(r.w, 0.45, 0.25, 3, 0.1), obsidianMat);
        slot.position.set(-3.0 + r.w / 2, r.y, 0.55);
        bubbleGroup.add(slot);
      });

      // Typing dots
      const dots: THREE.Mesh[] = [];
      const dotGeo = new THREE.SphereGeometry(0.26, 24, 24);
      for (let i = 0; i < 3; i++) {
        const dot = new THREE.Mesh(dotGeo, crimsonMat);
        dot.position.set(-2.4 + i * 0.9, -0.75, 0.6);
        bubbleGroup.add(dot);
        dots.push(dot);
      }
      mainGroup.add(bubbleGroup);

      // --- B) 3D MODERN CYBER SMARTPHONE (ULTRA-SLLEEK NO ROTARY DIAL / NO BOX FRAME!) ---
      const phoneGroup = new THREE.Group();
      phoneGroup.position.set(2.2, -1.0, 1.2);
      phoneGroup.rotation.y = -Math.PI / 8;
      phoneGroup.rotation.x = Math.PI / 16;

      // Smartphone Body Chassis (Gold Metallic Curved Edges)
      const phoneWidth = 6.4;
      const phoneHeight = 12.8;
      const phoneThickness = 0.65;
      const phoneBody = new THREE.Mesh(
        new RoundedBoxGeometry(phoneWidth, phoneHeight, phoneThickness, 8, 0.5),
        goldMat
      );
      phoneBody.castShadow = true;
      phoneBody.receiveShadow = true;
      phoneGroup.add(phoneBody);

      // Screen Glass Bezel & Display
      const screenWidth = 6.0;
      const screenHeight = 12.2;
      const screenMesh = new THREE.Mesh(
        new RoundedBoxGeometry(screenWidth, screenHeight, 0.1, 6, 0.4),
        glassScreenMat
      );
      screenMesh.position.z = phoneThickness / 2 + 0.02;
      phoneGroup.add(screenMesh);

      // Dynamic Holographic Screen UI Elements (App Cards & Message Bubbles)
      const uiGroup = new THREE.Group();
      uiGroup.position.z = phoneThickness / 2 + 0.1;

      // Status Bar Pill / Notch
      const notchMesh = new THREE.Mesh(
        new RoundedBoxGeometry(2.2, 0.35, 0.08, 4, 0.1),
        obsidianMat
      );
      notchMesh.position.y = 5.6;
      uiGroup.add(notchMesh);

      // Floating Message Cards on Phone Screen
      const msgCard1 = new THREE.Mesh(
        new RoundedBoxGeometry(5.2, 1.8, 0.08, 4, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x161a2e, metalness: 0.5, roughness: 0.3 })
      );
      msgCard1.position.set(0, 3.2, 0.02);
      uiGroup.add(msgCard1);

      // Avatar Icon Circle on Card
      const avatarMesh = new THREE.Mesh(
        new THREE.CircleGeometry(0.45, 24),
        crimsonMat
      );
      avatarMesh.position.set(-1.9, 3.2, 0.08);
      uiGroup.add(avatarMesh);

      // Message Line 1
      const line1 = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.2, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xffc82c, emissive: 0xffc82c, emissiveIntensity: 0.6 })
      );
      line1.position.set(0.1, 3.4, 0.08);
      uiGroup.add(line1);

      // Message Line 2
      const line2 = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.15, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x8090b0 })
      );
      line2.position.set(-0.3, 3.0, 0.08);
      uiGroup.add(line2);

      // Message Card 2 (User reply)
      const msgCard2 = new THREE.Mesh(
        new RoundedBoxGeometry(5.2, 2.4, 0.08, 4, 0.15),
        new THREE.MeshStandardMaterial({ color: 0xffc82c, emissive: 0xffc82c, emissiveIntensity: 0.3, roughness: 0.2 })
      );
      msgCard2.position.set(0, 0.6, 0.02);
      uiGroup.add(msgCard2);

      // Call Button Pill on Screen
      const callBtnMesh = new THREE.Mesh(
        new RoundedBoxGeometry(4.8, 1.0, 0.1, 6, 0.2),
        crimsonMat
      );
      callBtnMesh.position.set(0, -3.8, 0.04);
      uiGroup.add(callBtnMesh);

      phoneGroup.add(uiGroup);

      // Triple Camera Island on Back of Phone
      const cameraIsland = new THREE.Mesh(
        new RoundedBoxGeometry(2.2, 2.2, 0.2, 4, 0.2),
        obsidianMat
      );
      cameraIsland.position.set(-1.5, 4.4, -phoneThickness / 2 - 0.1);
      phoneGroup.add(cameraIsland);

      // 3 Camera Lenses
      const lensGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 24);
      lensGeo.rotateX(Math.PI / 2);
      const lensMat = new THREE.MeshStandardMaterial({ color: 0x05070e, metalness: 0.9, roughness: 0.1 });

      const lens1 = new THREE.Mesh(lensGeo, lensMat);
      lens1.position.set(-1.8, 4.8, -phoneThickness / 2 - 0.2);
      const lens2 = lens1.clone();
      lens2.position.y = 4.0;
      const lens3 = lens1.clone();
      lens3.position.x = -1.1;
      lens3.position.y = 4.4;
      phoneGroup.add(lens1);
      phoneGroup.add(lens2);
      phoneGroup.add(lens3);

      mainGroup.add(phoneGroup);

      // Mouse Hover Rotation Tracking
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        const my = (e.clientY - rect.top) / rect.height - 0.5;
        sceneStateRef.current.targetMouseX = mx * 0.4;
        sceneStateRef.current.targetMouseY = my * 0.3;
      };
      window.addEventListener("mousemove", handleMouseMove);

      // Particles
      const pCount = isMobile ? 100 : 200;
      const pPos = new Float32Array(pCount * 3);
      const pCol = new Float32Array(pCount * 3);
      const crimson = new THREE.Color(0xff3b56);

      for (let p = 0; p < pCount; p++) {
        pPos[p * 3] = (Math.random() - 0.5) * 44;
        pPos[p * 3 + 1] = Math.random() * 24 - 4;
        pPos[p * 3 + 2] = (Math.random() - 0.5) * 30 - 4;
        const c = Math.random() < 0.25 ? crimson : accent;
        pCol[p * 3] = c.r;
        pCol[p * 3 + 1] = c.g;
        pCol[p * 3 + 2] = c.b;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
      const pMat = new THREE.PointsMaterial({
        size: 0.45,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // Post-Processing Composer (Bloom & AA)
      const rt = new THREE.WebGLRenderTarget(width * dpr, height * dpr, {
        type: THREE.HalfFloatType,
        samples: 4,
      });
      const composer = new EffectComposer(renderer, rt);
      composer.setPixelRatio(dpr);
      composer.setSize(width, height);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.3, 0.5, 0.85));
      composer.addPass(new OutputPass());

      const resizeObserver = new ResizeObserver(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        width = w;
        height = h;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
      });
      resizeObserver.observe(container);

      // Render Loop
      let animId = 0;
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.05);
        const time = clock.elapsedTime;
        const state = sceneStateRef.current;

        // Smooth interactive mouse tilt
        mainGroup.rotation.y += (state.targetMouseX - mainGroup.rotation.y) * 0.08;
        mainGroup.rotation.x += (-state.targetMouseY - mainGroup.rotation.x) * 0.08;

        // Floating motion
        mainGroup.position.y = Math.sin(time * 1.5) * 0.35;
        phoneGroup.position.y = -1.0 + Math.sin(time * 2) * 0.25;
        bubbleGroup.position.y = bubbleBaseY + Math.cos(time * 1.6) * 0.2;

        // Typing dots animation
        dots.forEach((d, i) => {
          d.position.y = -0.75 + Math.abs(Math.sin(time * 3.5 - i * 0.6)) * 0.25;
        });

        particles.rotation.y = time * 0.02;

        // Submit animation (Smartphone scale bounce & pulse!)
        if (state.submitting) {
          state.animProgress += delta / SUBMIT_DURATION;
          const p = Math.min(state.animProgress, 1);
          const bounce = 1 + Math.sin(p * Math.PI) * 0.15;
          phoneGroup.scale.setScalar(bounce);

          if (p >= 1) {
            state.submitting = false;
            phoneGroup.scale.setScalar(1);
          }
        }

        composer.render();
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", handleMouseMove);
        resizeObserver.disconnect();

        scene.traverse((obj) => {
          const m = obj as THREE.Mesh;
          if (m.geometry) m.geometry.dispose();
          const mat = m.material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat?.dispose();
        });
        pmrem.dispose();
        roomEnv.dispose();
        envTex.dispose();
        composer.dispose();
        rt.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
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