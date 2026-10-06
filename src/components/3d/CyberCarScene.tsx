"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
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

/* ========================================================================== */
/*  Ambiance par biome (ciel, brouillard, soleil/lune, LED, poussières)        */
/* ========================================================================== */
const LOOK = [
  { fog: "#0b3a26", skyTop: "#031a10", glow: "#2fbf71", sun: "#d8ffe0", sunI: 1.5, sunDir: [30, 90, 35], amb: 0.5, hemiSky: "#6bf0b0", hemiGround: "#08180e", hemiI: 0.9, density: 0.0085, stars: 0.15, led: "#10B981", dust: "#b9f5d0", exposure: 1.05 },
  { fog: "#4a2a10", skyTop: "#150b2a", glow: "#ff8a3d", sun: "#ffb25e", sunI: 2.4, sunDir: [-95, 48, 70], amb: 0.55, hemiSky: "#ffcf8a", hemiGround: "#2a1405", hemiI: 0.8, density: 0.0042, stars: 0.35, led: "#FFC82C", dust: "#f4c97c", exposure: 1.15 },
  { fog: "#0d1233", skyTop: "#02030f", glow: "#6a4ee0", sun: "#9db4ff", sunI: 1.1, sunDir: [-70, 85, -45], amb: 0.45, hemiSky: "#8f7bff", hemiGround: "#06071a", hemiI: 0.8, density: 0.0034, stars: 1.0, led: "#A855F7", dust: "#cdb6ff", exposure: 1.2 },
  { fog: "#0b3550", skyTop: "#021019", glow: "#1fb6d6", sun: "#a8e0ff", sunI: 1.3, sunDir: [40, 90, -30], amb: 0.5, hemiSky: "#5fd6ff", hemiGround: "#041420", hemiI: 0.9, density: 0.0052, stars: 0.7, led: "#06B6D4", dust: "#c8f1ff", exposure: 1.15 },
  { fog: "#0c2a18", skyTop: "#02100a", glow: "#9bd13a", sun: "#e1ffa6", sunI: 1.0, sunDir: [20, 85, 20], amb: 0.5, hemiSky: "#a0e060", hemiGround: "#06130b", hemiI: 0.9, density: 0.0095, stars: 0.2, led: "#84CC16", dust: "#e0f9a8", exposure: 1.1 },
];

/* ========================================================================== */
/*  Helpers maths / bruit                                                      */
/* ========================================================================== */
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const hash2 = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const vnoise = (x: number, y: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  return (
    hash2(xi, yi) * (1 - u) * (1 - v) +
    hash2(xi + 1, yi) * u * (1 - v) +
    hash2(xi, yi + 1) * (1 - u) * v +
    hash2(xi + 1, yi + 1) * u * v
  );
};
const fbm = (x: number, y: number, oct = 4) => {
  let a = 0.5;
  let f = 1;
  let s = 0;
  let n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * vnoise(x * f, y * f);
    n += a;
    f *= 2;
    a *= 0.5;
  }
  return s / n;
};
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Poids de chaque biome en fonction de la progression (transitions douces)
const biomeWeights = (u: number) => {
  const b = [0.2, 0.4, 0.6, 0.8].map((x) => smooth(x - 0.025, x + 0.025, u));
  return [1 - b[0], b[0] - b[1], b[1] - b[2], b[2] - b[3], b[3]];
};

type Frame = { p: THREE.Vector3; t: THREE.Vector3; n: THREE.Vector3 };
type Spot = { x: number; z: number; y: number; r: number; f: number };

const BRIDGE_A = 0.585;
const BRIDGE_B = 0.815;
const WATER_Y = -9;
const RIVER_BED = -17;

// Hauteur du terrain : collines / dunes selon le biome, rives du Wouri, plateaux
function terrainHeight(u: number, lat: number, wx: number, wz: number, baseY: number, spots: Spot[]) {
  const a = Math.abs(lat);
  const w = biomeWeights(u);
  const f1 = fbm(wx * 0.011, wz * 0.011);
  const f2 = fbm(wx * 0.045 + 19, wz * 0.045 + 7, 3);
  const hills = (f1 - 0.3) * 1.6;
  const dune = Math.pow(0.5 + 0.5 * Math.sin(wx * 0.035 + wz * 0.012 + f1 * 6), 2) * 14 + f1 * 8;
  const h =
    (hills * 18 + f2 * 3) * w[0] +
    dune * 0.7 * w[1] +
    (dune * 1.2 + f2 * 2) * w[2] +
    (hills * 6 + f2 * 1.5) * w[3] +
    (hills * 26 + f2 * 4) * w[4];
  let y = baseY - 0.55 + h * smooth(10, 70, a) + smooth(8.5, 12, a) * f2 * 0.6;
  y -= smooth(140, 168, a) * 28;
  const river = smooth(BRIDGE_A, BRIDGE_A + 0.04, u) * (1 - smooth(BRIDGE_B - 0.04, BRIDGE_B, u));
  y = mix(y, RIVER_BED + f2 * 1.5, river);
  for (const s of spots) {
    const d = Math.hypot(wx - s.x, wz - s.z);
    y = mix(y, s.y, 1 - smooth(s.r, s.r + s.f, d));
  }
  return y;
}

/* ========================================================================== */
/*  Textures procédurales (canvas)                                             */
/* ========================================================================== */
const makeCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d") as CanvasRenderingContext2D;
  return { c, g };
};
const canvasTex = (c: HTMLCanvasElement, srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

function makeGlowTexture(inner = 1, mid = 0.35) {
  const { c, g } = makeCanvas(128, 128);
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, `rgba(255,255,255,${inner})`);
  gr.addColorStop(0.35, `rgba(255,255,255,${mid})`);
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return canvasTex(c);
}

// Asphalte : grain, traces de pneus, fissures, marquages. 16 m de large x 12 m de long par tuile.
function makeRoadTextures() {
  const W = 1024;
  const H = 1024;
  const px = (m: number) => ((m + 8) / 16) * W;
  const color = makeCanvas(W, H);
  const rough = makeCanvas(W, H);
  const glow = makeCanvas(W, H);

  color.g.fillStyle = "#1a1e2d";
  color.g.fillRect(0, 0, W, H);
  rough.g.fillStyle = "rgb(214,214,214)";
  rough.g.fillRect(0, 0, W, H);
  glow.g.fillStyle = "#000";
  glow.g.fillRect(0, 0, W, H);

  const img = color.g.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 30;
    const k = Math.random() < 0.012 ? 40 : 0;
    d[i] += n + k;
    d[i + 1] += n + k;
    d[i + 2] += n * 1.1 + k;
  }
  color.g.putImageData(img, 0, 0);

  // Plaques d'usure
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 40 + Math.random() * 140;
    const gr = color.g.createRadialGradient(x, y, 0, x, y, r);
    const dark = Math.random() < 0.6;
    gr.addColorStop(0, dark ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.05)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    color.g.fillStyle = gr;
    color.g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Traces de roues (plus lisses = plus réfléchissantes)
  [-6, -2, 2, 6].forEach((lane) => {
    [-0.85, 0.85].forEach((o) => {
      const x = px(lane + o);
      const gw = 44;
      const g1 = color.g.createLinearGradient(x - gw, 0, x + gw, 0);
      g1.addColorStop(0, "rgba(0,0,0,0)");
      g1.addColorStop(0.5, "rgba(0,0,0,0.3)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      color.g.fillStyle = g1;
      color.g.fillRect(x - gw, 0, gw * 2, H);
      const g2 = rough.g.createLinearGradient(x - gw, 0, x + gw, 0);
      g2.addColorStop(0, "rgba(110,110,110,0)");
      g2.addColorStop(0.5, "rgba(105,105,105,0.75)");
      g2.addColorStop(1, "rgba(110,110,110,0)");
      rough.g.fillStyle = g2;
      rough.g.fillRect(x - gw, 0, gw * 2, H);
    });
  });

  // Flaques
  for (let i = 0; i < 14; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 30 + Math.random() * 70;
    const gr = rough.g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, "rgba(40,40,40,0.9)");
    gr.addColorStop(1, "rgba(40,40,40,0)");
    rough.g.fillStyle = gr;
    rough.g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Fissures
  color.g.strokeStyle = "rgba(0,0,0,0.4)";
  color.g.lineWidth = 1.3;
  for (let i = 0; i < 26; i++) {
    let x = Math.random() * W;
    let y = Math.random() * H;
    color.g.beginPath();
    color.g.moveTo(x, y);
    for (let k = 0; k < 9; k++) {
      x += (Math.random() - 0.5) * 38;
      y += Math.random() * 30;
      color.g.lineTo(x, y);
    }
    color.g.stroke();
  }

  // Marquages
  const line = (xm: number, wm: number, dashed: boolean, col: string, glowCol: string) => {
    const x = px(xm - wm / 2);
    const w = (wm / 16) * W;
    const draw = (g: CanvasRenderingContext2D, fill: string) => {
      g.fillStyle = fill;
      if (!dashed) g.fillRect(x, 0, w, H);
      else for (let y = 0; y < H; y += H / 2) g.fillRect(x, y, w, H * 0.25);
    };
    draw(color.g, col);
    draw(glow.g, glowCol);
  };
  line(-7.45, 0.22, false, "#ffc82c", "#ffb81c");
  line(7.45, 0.22, false, "#ffc82c", "#ffb81c");
  line(-0.2, 0.13, false, "#ffc82c", "#e0a010");
  line(0.2, 0.13, false, "#ffc82c", "#e0a010");
  line(-4, 0.14, true, "#e8ecf4", "rgba(255,255,255,0.22)");
  line(4, 0.14, true, "#e8ecf4", "rgba(255,255,255,0.22)");

  // Marquages usés
  color.g.fillStyle = "rgba(26,30,45,0.55)";
  for (let i = 0; i < 500; i++) color.g.fillRect(Math.random() * W, Math.random() * H, 2 + Math.random() * 7, 1 + Math.random() * 5);

  const map = canvasTex(color.c);
  const roughnessMap = canvasTex(rough.c, false);
  const emissiveMap = canvasTex(glow.c);
  [map, roughnessMap, emissiveMap].forEach((t) => {
    t.wrapT = THREE.RepeatWrapping;
  });
  return { map, roughnessMap, emissiveMap };
}

// Texture de détail multipliée sur le terrain
function makeDetailTexture() {
  const S = 512;
  const { c, g } = makeCanvas(S, S);
  g.fillStyle = "#d2d2d2";
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 240; i++) {
    const x = Math.random() * S;
    const y = Math.random() * S;
    const r = 8 + Math.random() * 50;
    const k = (150 + Math.random() * 105) | 0;
    for (const dx of [-S, 0, S]) {
      for (const dy of [-S, 0, S]) {
        const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
        gr.addColorStop(0, `rgba(${k},${k},${k},0.35)`);
        gr.addColorStop(1, `rgba(${k},${k},${k},0)`);
        g.fillStyle = gr;
        g.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
      }
    }
  }
  const img = g.getImageData(0, 0, S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 40;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  const t = canvasTex(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Blocs de grès pour les pyramides
function makeStoneTexture() {
  const S = 512;
  const { c, g } = makeCanvas(S, S);
  g.fillStyle = "#5a3d1a";
  g.fillRect(0, 0, S, S);
  const rows = 8;
  const n = 8;
  const rh = S / rows;
  for (let r = 0; r < rows; r++) {
    const off = (r % 2) * (S / n / 2);
    for (let i = -1; i <= n; i++) {
      const k = 0.8 + Math.random() * 0.32;
      g.fillStyle = `rgb(${(201 * k) | 0},${(154 * k) | 0},${(85 * k) | 0})`;
      g.fillRect(i * (S / n) + off + 1.5, r * rh + 1.5, S / n - 3, rh - 3);
    }
  }
  const img = g.getImageData(0, 0, S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const k = (Math.random() - 0.5) * 34;
    img.data[i] += k;
    img.data[i + 1] += k;
    img.data[i + 2] += k;
  }
  g.putImageData(img, 0, 0);
  const t = canvasTex(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Pseudo-hiéroglyphes lumineux pour les obélisques
function makeGlyphTexture() {
  const { c, g } = makeCanvas(128, 512);
  g.fillStyle = "#000";
  g.fillRect(0, 0, 128, 512);
  g.strokeStyle = "#ffc82c";
  g.lineWidth = 3;
  for (let y = 24; y < 500; y += 36) {
    for (const x of [30, 64, 98]) {
      g.beginPath();
      switch (Math.floor(Math.random() * 5)) {
        case 0:
          g.arc(x, y, 8, 0, Math.PI * 2);
          break;
        case 1:
          g.moveTo(x, y - 10);
          g.lineTo(x, y + 10);
          g.moveTo(x - 7, y - 3);
          g.lineTo(x + 7, y - 3);
          break;
        case 2:
          g.moveTo(x - 9, y + 6);
          g.lineTo(x - 3, y - 6);
          g.lineTo(x + 3, y + 6);
          g.lineTo(x + 9, y - 6);
          break;
        case 3:
          g.rect(x - 7, y - 8, 14, 16);
          break;
        default:
          g.ellipse(x, y, 11, 5, 0, 0, Math.PI * 2);
          g.moveTo(x, y - 2);
          g.lineTo(x, y + 2);
      }
      g.stroke();
    }
  }
  return canvasTex(c);
}

// Normal map d'eau (périodique => tuilable)
function makeWaterNormal() {
  const S = 256;
  const { c, g } = makeCanvas(S, S);
  const img = g.createImageData(S, S);
  const a = (Math.PI * 2) / S;
  const H = (x: number, y: number) => {
    const xx = ((x % S) + S) % S;
    const yy = ((y % S) + S) % S;
    return (
      0.5 * Math.sin(a * (2 * xx + yy)) +
      0.35 * Math.sin(a * (3 * xx - 2 * yy) + 1.3) +
      0.25 * Math.sin(a * (5 * xx + 4 * yy) + 2.1) +
      0.15 * Math.sin(a * (9 * xx - 7 * yy) + 0.4)
    );
  };
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const nx = -(H(x + 1, y) - H(x - 1, y)) * 6;
      const ny = -(H(x, y + 1) - H(x, y - 1)) * 6;
      const len = Math.sqrt(nx * nx + ny * ny + 1);
      const i = (y * S + x) * 4;
      img.data[i] = ((nx / len) * 0.5 + 0.5) * 255;
      img.data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = canvasTex(c, false);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function makeMoonTexture() {
  const { c, g } = makeCanvas(256, 256);
  g.fillStyle = "#f6ebd0";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 16; i++) {
    g.fillStyle = `rgba(150,130,100,${0.1 + Math.random() * 0.12})`;
    g.beginPath();
    g.arc(Math.random() * 256, Math.random() * 256, 8 + Math.random() * 30, 0, Math.PI * 2);
    g.fill();
  }
  return canvasTex(c);
}

function makeLabelTexture(text: string) {
  const { c, g } = makeCanvas(512, 128);
  g.clearRect(0, 0, 512, 128);
  g.fillStyle = "rgba(5,8,20,0.55)";
  g.beginPath();
  g.roundRect(8, 24, 496, 80, 18);
  g.fill();
  g.strokeStyle = "rgba(255,200,44,0.9)";
  g.lineWidth = 3;
  g.stroke();
  g.fillStyle = "#fff6d6";
  g.font = "600 40px system-ui, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text.length > 26 ? text.slice(0, 25) + "…" : text, 256, 66);
  return canvasTex(c);
}

// Environnement HDR procédural : dégradé de ciel + softboxes => reflets nets sur la peinture
function makeEnvironment(renderer: THREE.WebGLRenderer) {
  const envScene = new THREE.Scene();
  const { c, g } = makeCanvas(8, 512);
  const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, "#050a24");
  gr.addColorStop(0.35, "#16255a");
  gr.addColorStop(0.5, "#e9a86a");
  gr.addColorStop(0.55, "#2a3560");
  gr.addColorStop(1, "#05060e");
  g.fillStyle = gr;
  g.fillRect(0, 0, 8, 512);
  const skyTex = canvasTex(c);
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide })));
  const softbox = (w: number, h: number, x: number, y: number, z: number, intensity: number, col: string) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(intensity), side: THREE.DoubleSide })
    );
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    envScene.add(m);
  };
  softbox(36, 5, 0, 32, 8, 7, "#ffffff");
  softbox(5, 20, -34, 12, 0, 5, "#9fe8ff");
  softbox(5, 20, 34, 12, 0, 5, "#ffd9a0");
  softbox(24, 3, 0, 6, -36, 4, "#ffffff");
  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(envScene, 0.03);
  pmrem.dispose();
  skyTex.dispose();
  envScene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    if (m.material) (m.material as THREE.Material).dispose();
  });
  return rt;
}

/* ========================================================================== */
/*  Géométries                                                                 */
/* ========================================================================== */

// Extrude un profil le long de la route (profil = [décalage latéral, hauteur])
function sweepProfile(frames: Frame[], profile: [number, number][], closed: boolean, from = 0, to = frames.length - 1) {
  const m = profile.length;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = from; i <= to; i++) {
    const f = frames[i];
    for (const [lat, h] of profile) pos.push(f.p.x + f.n.x * lat, f.p.y + h, f.p.z + f.n.z * lat);
  }
  const rows = to - from + 1;
  const segs = closed ? m : m - 1;
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < segs; j++) {
      const a = i * m + j;
      const b = i * m + ((j + 1) % m);
      const c = (i + 1) * m + j;
      const d = (i + 1) * m + ((j + 1) % m);
      idx.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// Ruban de route texturé (a > b pour une face visible vers le haut)
function ribbon(frames: Frame[], length: number, a: number, b: number, y: number, tile: number) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  frames.forEach((f, i) => {
    const v = ((i / (frames.length - 1)) * length) / tile;
    pos.push(f.p.x + f.n.x * a, f.p.y + y, f.p.z + f.n.z * a, f.p.x + f.n.x * b, f.p.y + y, f.p.z + f.n.z * b);
    uv.push(0, v, 1, v);
    if (i < frames.length - 1) {
      const c = i * 2;
      idx.push(c, c + 2, c + 1, c + 1, c + 2, c + 3);
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// Blob organique (feuillage)
function blobGeometry(detail: number, jitter: number) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const k = 1 + (hash2(x * 7.13 + y * 3.1, z * 5.7 + y * 2.3) - 0.5) * jitter;
    p.setXYZ(i, x * k, y * k, z * k);
  }
  return g;
}

function sculpt(geo: THREE.BufferGeometry, fn: (x: number, y: number, z: number) => number) {
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) * fn(p.getX(i), p.getY(i), p.getZ(i)));
  p.needsUpdate = true;
}

// Profil de côté (z = longueur, y = hauteur) extrudé en largeur puis modelé (galbes)
function extrudeSide(shape: THREE.Shape, width: number, bevel: number, taper: (x: number, y: number, z: number) => number) {
  const depth = width - bevel * 2;
  let g: THREE.BufferGeometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 28,
    steps: 1,
  });
  g.translate(0, 0, -depth / 2);
  g.rotateY(-Math.PI / 2);
  sculpt(g, taper);
  g = toCreasedNormals(g, 0.7);
  return g;
}

/* ========================================================================== */
/*  Voiture                                                                    */
/* ========================================================================== */
function buildCar(envMap: THREE.Texture, glowTex: THREE.Texture) {
  const car = new THREE.Group(); // racine : porte les projecteurs
  const vis = new THREE.Group(); // partie visuelle (masquée en vue cockpit)
  car.add(vis);

  const hdr = (hex: number, k: number) => new THREE.Color(hex).multiplyScalar(k);
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0xf2b21f,
    metalness: 0.85,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMap,
    envMapIntensity: 1.5,
  });
  const carbon = new THREE.MeshStandardMaterial({ color: 0x0b0e15, metalness: 0.6, roughness: 0.38, envMap, envMapIntensity: 1 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x06101a,
    metalness: 0.2,
    roughness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    transparent: true,
    opacity: 0.88,
    envMap,
    envMapIntensity: 2.2,
    emissive: 0x00c8e0,
    emissiveIntensity: 0.12,
  });
  const cyan = new THREE.MeshBasicMaterial({ color: hdr(0x00f3ff, 2.6) });
  const gold = new THREE.MeshBasicMaterial({ color: hdr(0xffc82c, 1.6) });
  const rearMat = new THREE.MeshBasicMaterial({ color: hdr(0xff1744, 2.2) });
  const steel = new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 1, roughness: 0.3, envMap, envMapIntensity: 1.2 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xf2b21f, metalness: 0.95, roughness: 0.22, envMap, envMapIntensity: 1.6, emissive: 0xffc82c, emissiveIntensity: 0.15 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x0a0b10, roughness: 0.75, metalness: 0 });

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, cast = true) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = cast;
    vis.add(m);
    return m;
  };
  const box = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, cast = true) =>
    add(new THREE.BoxGeometry(w, h, d), mat, x, y, z, cast);

  // --- Carrosserie principale (profil latéral avec passages de roues) ---
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-2.62, 0.28);
  bodyShape.lineTo(-2.37, 0.28);
  bodyShape.lineTo(-2.37, 0.52);
  bodyShape.absarc(-1.75, 0.52, 0.62, Math.PI, 0, true);
  bodyShape.lineTo(-1.13, 0.28);
  bodyShape.lineTo(1.13, 0.28);
  bodyShape.lineTo(1.13, 0.52);
  bodyShape.absarc(1.75, 0.52, 0.62, Math.PI, 0, true);
  bodyShape.lineTo(2.37, 0.28);
  bodyShape.lineTo(2.7, 0.28);
  bodyShape.quadraticCurveTo(2.95, 0.3, 2.93, 0.6);
  bodyShape.quadraticCurveTo(2.9, 0.95, 2.55, 1.12);
  bodyShape.bezierCurveTo(1.8, 1.2, 0.8, 1.34, 0.3, 1.38);
  bodyShape.bezierCurveTo(-0.5, 1.42, -1.6, 1.45, -2.3, 1.38);
  bodyShape.quadraticCurveTo(-2.75, 1.3, -2.85, 0.9);
  bodyShape.quadraticCurveTo(-2.9, 0.5, -2.62, 0.28);
  add(
    extrudeSide(bodyShape, 3.2, 0.07, (_x, y, z) => (1 - 0.2 * smooth(1.7, 2.9, Math.abs(z))) * (1 - 0.13 * smooth(1.1, 1.45, y))),
    paint
  );

  // Dessous sombre (masque l'intérieur des passages de roues)
  box(2.5, 0.75, 4.7, carbon, 0, 0.66, 0, false);

  // --- Habitacle vitré + toit peint ---
  const cabinTaper = (_x: number, y: number) => 1 - 0.3 * clamp01((y - 1.3) / 0.7);
  const cabin = new THREE.Shape();
  cabin.moveTo(-1.6, 1.3);
  cabin.bezierCurveTo(-1.2, 1.55, -0.9, 1.9, -0.5, 1.95);
  cabin.bezierCurveTo(-0.1, 2.0, 0.3, 1.98, 0.5, 1.92);
  cabin.bezierCurveTo(0.8, 1.7, 1.1, 1.5, 1.35, 1.3);
  cabin.closePath();
  add(extrudeSide(cabin, 2.2, 0.04, cabinTaper), glass);

  const roof = new THREE.Shape();
  roof.moveTo(-0.92, 1.86);
  roof.bezierCurveTo(-0.7, 1.95, -0.4, 2.03, -0.1, 2.04);
  roof.bezierCurveTo(0.2, 2.04, 0.45, 1.99, 0.62, 1.9);
  roof.lineTo(0.6, 1.83);
  roof.lineTo(-0.88, 1.8);
  roof.closePath();
  add(extrudeSide(roof, 2.2, 0.04, cabinTaper), paint);

  // Rétroviseurs
  [-1, 1].forEach((s) => {
    box(0.3, 0.12, 0.22, carbon, s * 1.3, 1.5, 0.75);
    box(0.2, 0.05, 0.05, carbon, s * 1.18, 1.46, 0.75);
  });

  // --- Aérodynamique ---
  box(3.0, 0.07, 0.5, carbon, 0, 0.27, 2.78); // splitter
  box(2.9, 0.025, 0.1, gold, 0, 0.245, 3.02);
  box(2.3, 0.22, 0.5, carbon, 0, 0.38, -2.7); // diffuseur
  box(3.1, 0.06, 0.55, carbon, 0, 1.82, -2.72); // aileron
  [-1, 1].forEach((s) => {
    box(0.05, 0.3, 0.6, carbon, s * 1.55, 1.76, -2.72);
    box(0.1, 0.5, 0.28, carbon, s * 0.8, 1.6, -2.5);
    box(0.03, 0.05, 2.0, cyan, s * 1.62, 0.38, 0); // bandeau LED de bas de caisse
    box(0.02, 0.02, 4.2, gold, s * 1.605, 1.12, 0); // liseré doré
    box(0.012, 0.62, 0.02, carbon, s * 1.605, 0.88, 0.55); // joint de porte
    box(0.02, 0.18, 0.8, carbon, s * 1.605, 0.8, -0.9); // prise d'air latérale
  });
  box(3.0, 0.012, 0.12, gold, 0, 1.855, -2.72);

  // --- Optiques ---
  [-1, 1].forEach((s) => box(0.75, 0.1, 0.08, cyan, s * 0.95, 0.93, 2.8, false));
  box(2.2, 0.05, 0.06, cyan, 0, 0.78, 2.885, false);
  box(2.3, 0.1, 0.06, rearMat, 0, 1.0, -2.87, false);

  // --- Roues ---
  const tireProfile = [
    [0.34, -0.2],
    [0.46, -0.21],
    [0.52, -0.15],
    [0.53, -0.06],
    [0.53, 0.06],
    [0.52, 0.15],
    [0.46, 0.21],
    [0.34, 0.2],
    [0.34, -0.2],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const tireGeo = new THREE.LatheGeometry(tireProfile, 40);
  tireGeo.rotateZ(Math.PI / 2);
  const discGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.04, 32);
  discGeo.rotateZ(Math.PI / 2);
  const lipGeo = new THREE.TorusGeometry(0.37, 0.028, 10, 40);
  lipGeo.rotateY(Math.PI / 2);
  const capGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.06, 16);
  capGeo.rotateZ(Math.PI / 2);
  const brakeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.03, 32);
  brakeGeo.rotateZ(Math.PI / 2);
  const sideRingGeo = new THREE.TorusGeometry(0.43, 0.012, 6, 48);
  sideRingGeo.rotateY(Math.PI / 2);
  const spokeGeo = new THREE.BoxGeometry(0.035, 0.3, 0.075);

  const wheels: { steer: THREE.Group; spin: THREE.Group; front: boolean }[] = [];
  const wheelDefs: [number, number][] = [
    [-1, 1.75],
    [1, 1.75],
    [-1, -1.75],
    [1, -1.75],
  ];
  wheelDefs.forEach(([sx, z]) => {
    const root = new THREE.Group();
    root.position.set(sx * 1.36, 0.54, z);
    const steer = new THREE.Group();
    const spin = new THREE.Group();
    root.add(steer);
    steer.add(spin);

    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    spin.add(tire);
    const disc = new THREE.Mesh(discGeo, rimMat);
    disc.position.x = sx * 0.15;
    spin.add(disc);
    const lip = new THREE.Mesh(lipGeo, rimMat);
    lip.position.x = sx * 0.18;
    spin.add(lip);
    const cap = new THREE.Mesh(capGeo, steel);
    cap.position.x = sx * 0.19;
    spin.add(cap);
    const ring = new THREE.Mesh(sideRingGeo, cyan);
    ring.position.x = sx * 0.205;
    spin.add(ring);
    for (let k = 0; k < 5; k++) {
      const holder = new THREE.Group();
      holder.rotation.x = (k / 5) * Math.PI * 2;
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      spoke.position.set(sx * 0.17, 0.2, 0);
      holder.add(spoke);
      spin.add(holder);
    }
    const brake = new THREE.Mesh(brakeGeo, steel);
    brake.position.x = sx * 0.05;
    steer.add(brake);
    const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.14), cyan);
    caliper.position.set(sx * 0.09, 0.2, 0.05);
    steer.add(caliper);

    vis.add(root);
    wheels.push({ steer, spin, front: z > 0 });
  });

  // --- Faisceaux des phares (volumes) + projecteurs réels ---
  const coneGeo = new THREE.ConeGeometry(3.2, 28, 24, 1, true);
  coneGeo.rotateX(-Math.PI / 2);
  coneGeo.translate(0, 0, 14);
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0x00dfff,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  [-1, 1].forEach((s) => {
    const beam = new THREE.Mesh(coneGeo, coneMat);
    beam.position.set(s * 0.95, 0.94, 2.82);
    vis.add(beam);
    const spot = new THREE.SpotLight(0x8cefff, 11, 48, Math.PI / 9, 0.55, 1.2);
    spot.position.set(s * 0.95, 0.92, 2.78);
    spot.target.position.set(s * 0.95, 0.15, 32);
    car.add(spot, spot.target);
  });

  // --- Flammes de propulsion ---
  const flameGeo = new THREE.ConeGeometry(0.22, 1.8, 14, 1, true);
  flameGeo.rotateX(-Math.PI / 2);
  flameGeo.translate(0, 0, -0.9);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0x2fe6ff,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const flames: THREE.Mesh[] = [];
  [-1, 1].forEach((s) => {
    const f = new THREE.Mesh(flameGeo, flameMat);
    f.position.set(s * 0.7, 0.62, -2.92);
    vis.add(f);
    flames.push(f);
  });

  // --- Halo de lumière au sol (remplace l'anneau plat) ---
  const glowGeo = new THREE.PlaneGeometry(8, 11);
  glowGeo.rotateX(-Math.PI / 2);
  const underglow = new THREE.MeshBasicMaterial({
    map: glowTex,
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const ug = new THREE.Mesh(glowGeo, underglow);
  ug.position.y = 0.06;
  vis.add(ug);

  return { car, vis, wheels, rearMat, flameMat, flames, underglow };
}

/* ========================================================================== */
/*  Nettoyage mémoire                                                          */
/* ========================================================================== */
function disposeObject(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (mat) {
      (Array.isArray(mat) ? mat : [mat]).forEach((mm) => {
        Object.values(mm).forEach((v) => {
          if (v instanceof THREE.Texture) v.dispose();
        });
        mm.dispose();
      });
    }
  });
}

// Post-traitement : flou radial de vitesse, aberration chromatique, vignette, grain
const SpeedShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uStrength: { value: 0 },
    uTime: { value: 0 },
    uAberration: { value: 0.0012 },
    uVignette: { value: 0.55 },
    uGrain: { value: 0.03 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uStrength; uniform float uTime;
    uniform float uAberration; uniform float uVignette; uniform float uGrain;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5;
      float r = length(c);
      vec2 off = c * uAberration * (1.0 + uStrength * 6.0) * r * 6.0;
      vec3 col = vec3(0.0);
      float total = 0.0;
      for (int i = 0; i < 6; i++) {
        float f = float(i) / 5.0;
        float s = 1.0 - f * uStrength * 0.1;
        float w = 1.0 - f * 0.5;
        vec2 uv = 0.5 + c * s;
        col.r += texture2D(tDiffuse, uv + off).r * w;
        col.g += texture2D(tDiffuse, uv).g * w;
        col.b += texture2D(tDiffuse, uv - off).b * w;
        total += w;
      }
      col /= total;
      float vig = 1.0 - smoothstep(0.3, 0.95, r);
      col *= mix(1.0, vig, uVignette);
      col += (hash(vUv * 1000.0 + uTime) - 0.5) * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }`,
};

const UP = new THREE.Vector3(0, 1, 0);

/* ========================================================================== */
/*  Composant                                                                  */
/* ========================================================================== */
export const CyberCarScene = forwardRef<CyberCarSceneRef, CyberCarSceneProps>(
  ({ projects, onSelectProject, onBiomeChange, onSpeedChange, onNearProject }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [audioMuted, setAudioMuted] = useState(true);
    const [cameraMode, setCameraModeState] = useState<CameraMode>("chase");

    // Les callbacks passent par une ref : plus de reconstruction de la scène si le parent recrée ses fonctions
    const cbRef = useRef({ onSelectProject, onBiomeChange, onSpeedChange, onNearProject });
    cbRef.current = { onSelectProject, onBiomeChange, onSpeedChange, onNearProject };

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

      let width = container.clientWidth || 1;
      let height = container.clientHeight || 1;
      const coarse = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
      const pr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);

      /* ---------- 1. Renderer, scène, caméra, post-traitement ---------- */
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(LOOK[0].fog);
      scene.fog = new THREE.FogExp2(LOOK[0].fog, LOOK[0].density);

      const camera = new THREE.PerspectiveCamera(64, width / height, 0.1, 1400);

      const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(pr);
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      const rt = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: 4 });
      const composer = new EffectComposer(renderer, rt);
      composer.setPixelRatio(pr);
      composer.setSize(width, height);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.75, 0.55, 0.82);
      composer.addPass(bloom);
      const speedPass = new ShaderPass(SpeedShader);
      composer.addPass(speedPass);
      composer.addPass(new OutputPass());

      const envRT = makeEnvironment(renderer);
      const envTex = envRT.texture;
      const glowTex = makeGlowTexture();
      const rng = mulberry32(20260910);
      const rand = (a = 0, b = 1) => a + (b - a) * rng();
      const dummy = new THREE.Object3D();
      const M = (x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, ry = 0, rx = 0, rz = 0) => {
        dummy.position.set(x, y, z);
        dummy.rotation.set(rx, ry, rz);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        return dummy.matrix.clone();
      };
      const inst = (geo: THREE.BufferGeometry, mat: THREE.Material, ms: THREE.Matrix4[], cols?: THREE.Color[], shadow = true) => {
        const im = new THREE.InstancedMesh(geo, mat, Math.max(ms.length, 1));
        ms.forEach((m, i) => im.setMatrixAt(i, m));
        im.count = ms.length;
        if (cols) cols.forEach((c, i) => im.setColorAt(i, c));
        im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        im.castShadow = shadow;
        im.receiveShadow = true;
        im.frustumCulled = false;
        return im;
      };

      /* ---------- 2. Ambiance dynamique ---------- */
      const looks = LOOK.map((l) => ({
        fog: new THREE.Color(l.fog),
        skyTop: new THREE.Color(l.skyTop),
        glow: new THREE.Color(l.glow),
        sun: new THREE.Color(l.sun),
        sunI: l.sunI,
        sunDir: new THREE.Vector3(...(l.sunDir as [number, number, number])),
        amb: l.amb,
        hemiSky: new THREE.Color(l.hemiSky),
        hemiGround: new THREE.Color(l.hemiGround),
        hemiI: l.hemiI,
        density: l.density,
        stars: l.stars,
        led: new THREE.Color(l.led),
        dust: new THREE.Color(l.dust),
        exposure: l.exposure,
      }));
      const cur = {
        fog: looks[0].fog.clone(),
        skyTop: looks[0].skyTop.clone(),
        glow: looks[0].glow.clone(),
        sun: looks[0].sun.clone(),
        sunI: looks[0].sunI,
        sunDir: looks[0].sunDir.clone(),
        amb: looks[0].amb,
        hemiSky: looks[0].hemiSky.clone(),
        hemiGround: looks[0].hemiGround.clone(),
        hemiI: looks[0].hemiI,
        density: looks[0].density,
        stars: looks[0].stars,
        led: looks[0].led.clone(),
        dust: looks[0].dust.clone(),
        exposure: looks[0].exposure,
      };
      const lerpLook = (idx: number, k: number) => {
        const t = looks[idx];
        cur.fog.lerp(t.fog, k);
        cur.skyTop.lerp(t.skyTop, k);
        cur.glow.lerp(t.glow, k);
        cur.sun.lerp(t.sun, k);
        cur.sunDir.lerp(t.sunDir, k);
        cur.hemiSky.lerp(t.hemiSky, k);
        cur.hemiGround.lerp(t.hemiGround, k);
        cur.led.lerp(t.led, k);
        cur.dust.lerp(t.dust, k);
        cur.sunI = mix(cur.sunI, t.sunI, k);
        cur.amb = mix(cur.amb, t.amb, k);
        cur.hemiI = mix(cur.hemiI, t.hemiI, k);
        cur.density = mix(cur.density, t.density, k);
        cur.stars = mix(cur.stars, t.stars, k);
        cur.exposure = mix(cur.exposure, t.exposure, k);
      };

      /* ---------- 3. Lumières ---------- */
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const hemiLight = new THREE.HemisphereLight(0x6bf0b0, 0x08180e, 0.9);
      scene.add(hemiLight);
      const dirLight = new THREE.DirectionalLight(0xfffaed, 1.5);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(2048, 2048);
      const sc = dirLight.shadow.camera;
      sc.left = -36;
      sc.right = 36;
      sc.top = 36;
      sc.bottom = -36;
      sc.near = 1;
      sc.far = 320;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.05;
      scene.add(dirLight, dirLight.target);

      /* ---------- 4. Ciel : dôme dégradé, étoiles, lune ---------- */
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uTop: { value: new THREE.Color() },
          uHorizon: { value: new THREE.Color() },
          uGlow: { value: new THREE.Color() },
        },
        vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uGlow; varying vec3 vDir;
          void main(){
            float t = smoothstep(0.0, 0.6, vDir.y);
            vec3 col = mix(uHorizon, uTop, pow(t, 0.7));
            col += uGlow * pow(max(0.0, 1.0 - abs(vDir.y) * 3.2), 2.0) * 0.55;
            col = mix(col, uHorizon * 0.6, smoothstep(0.0, -0.25, vDir.y));
            gl_FragColor = vec4(col, 1.0);
          }`,
      });
      const skyDome = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), skyMat);
      skyDome.renderOrder = -10;
      skyDome.frustumCulled = false;
      scene.add(skyDome);

      const skyGroup = new THREE.Group(); // suit la caméra
      const starCount = 1400;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const th = rand(0, Math.PI * 2);
        const ph = Math.acos(rand(0.05, 1));
        starPos[i * 3] = Math.sin(ph) * Math.cos(th) * 1000;
        starPos[i * 3 + 1] = Math.cos(ph) * 1000;
        starPos[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * 1000;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: false, fog: false, transparent: true, depthWrite: false });
      const stars = new THREE.Points(starGeo, starMat);
      stars.frustumCulled = false;
      skyGroup.add(stars);
      const moonDir = new THREE.Vector3(-0.45, 0.5, 0.75).normalize();
      const moonMat = new THREE.MeshBasicMaterial({ map: makeMoonTexture(), fog: false });
      const moon = new THREE.Mesh(new THREE.SphereGeometry(55, 32, 24), moonMat);
      moon.position.copy(moonDir).multiplyScalar(850);
      skyGroup.add(moon);
      const moonGlowMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffe2a8, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
      const moonGlow = new THREE.Sprite(moonGlowMat);
      moonGlow.scale.set(520, 520, 1);
      moonGlow.position.copy(moon.position);
      skyGroup.add(moonGlow);
      scene.add(skyGroup);

      /* ---------- 5. Tracé de la route ---------- */
      const trackPoints: THREE.Vector3[] = [];
      const numSegments = 160;
      const totalLength = 1600;
      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        const z = t * totalLength;
        const x = Math.sin(t * Math.PI * 6) * 40 + Math.cos(t * Math.PI * 2) * 15;
        const baseY = Math.sin(t * Math.PI * 8) * 5;
        const bridgeY = 10 + Math.sin(clamp01((t - 0.6) / 0.2) * Math.PI) * 12;
        const bridge = smooth(BRIDGE_A, BRIDGE_A + 0.03, t) * (1 - smooth(BRIDGE_B - 0.03, BRIDGE_B, t));
        trackPoints.push(new THREE.Vector3(x, mix(baseY, bridgeY, bridge), z));
      }
      const trackCurve = new THREE.CatmullRomCurve3(trackPoints, false, "centripetal");
      const L = trackCurve.getLength();
      const at = (u: number): Frame => {
        const uu = clamp01(u);
        const t = trackCurve.getTangentAt(uu);
        return { p: trackCurve.getPointAt(uu), t, n: new THREE.Vector3(-t.z, 0, t.x).normalize() };
      };
      const FN = 520;
      const frames: Frame[] = [];
      for (let i = 0; i <= FN; i++) frames.push(at(i / FN));

      /* ---------- 6. Plateaux (pyramides, oasis) puis terrain ---------- */
      const spots: Spot[] = [];
      const addSpot = (u: number, lat: number, r: number, f: number, dy = -0.55) => {
        const fr = at(u);
        const s: Spot = { x: fr.p.x + fr.n.x * lat, z: fr.p.z + fr.n.z * lat, y: fr.p.y + dy, r, f };
        spots.push(s);
        return s;
      };
      const PYR = [
        { u: 0.23, side: -1, offset: 82, scale: 1.1 },
        { u: 0.29, side: 1, offset: 100, scale: 1.35 },
        { u: 0.36, side: -1, offset: 90, scale: 1.0 },
      ];
      const pyrSpots = PYR.map((p) => addSpot(p.u, p.side * p.offset, 45 * p.scale + 6, 40));
      const oasis = addSpot(0.5, 52, 20, 18, -1.6);

      const groundAt = (u: number, lat: number) => {
        const f = at(u);
        const x = f.p.x + f.n.x * lat;
        const z = f.p.z + f.n.z * lat;
        return { x, z, y: terrainHeight(u, lat, x, z, f.p.y, spots), f };
      };

      {
        const LAT = 170;
        const K = 26;
        const cols: number[] = [];
        for (let k = K; k >= 1; k--) cols.push(-LAT * Math.pow(k / K, 1.7));
        cols.push(0);
        for (let k = 1; k <= K; k++) cols.push(LAT * Math.pow(k / K, 1.7));
        const PAL = [
          ["#0b3418", "#2f7a3a"],
          ["#9a6a28", "#e6b86a"],
          ["#17163d", "#4d4296"],
          ["#1b3a2a", "#3f6b45"],
          ["#0a2713", "#23602f"],
        ].map(([a, b]) => [new THREE.Color(a), new THREE.Color(b)]);
        const mud = new THREE.Color("#2b2219");
        const gravel = new THREE.Color("#2b2e38");
        const c = new THREE.Color();
        const pos: number[] = [];
        const col: number[] = [];
        const uv: number[] = [];
        const idx: number[] = [];
        const nc = cols.length;
        frames.forEach((f, i) => {
          const u = i / FN;
          const w = biomeWeights(u);
          cols.forEach((lat) => {
            const wx = f.p.x + f.n.x * lat;
            const wz = f.p.z + f.n.z * lat;
            const y = terrainHeight(u, lat, wx, wz, f.p.y, spots);
            pos.push(wx, y, wz);
            uv.push(wx / 14, wz / 14);
            const f2 = fbm(wx * 0.045 + 19, wz * 0.045 + 7, 3);
            const k = clamp01(f2 * 1.3 + (y - f.p.y) * 0.015 + 0.15);
            c.setRGB(0, 0, 0);
            for (let b = 0; b < 5; b++) {
              c.r += mix(PAL[b][0].r, PAL[b][1].r, k) * w[b];
              c.g += mix(PAL[b][0].g, PAL[b][1].g, k) * w[b];
              c.b += mix(PAL[b][0].b, PAL[b][1].b, k) * w[b];
            }
            c.lerp(mud, smooth(-8, -13, y));
            c.lerp(gravel, 1 - smooth(8.8, 16, Math.abs(lat)));
            col.push(c.r, c.g, c.b);
          });
          if (i < FN) {
            for (let j = 0; j < nc - 1; j++) {
              const a = i * nc + j;
              const b = a + 1;
              const cc = a + nc;
              const d = cc + 1;
              idx.push(a, b, cc, b, d, cc);
            }
          }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        geo.setIndex(idx);
        geo.computeVertexNormals();
        const terrain = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({ vertexColors: true, map: makeDetailTexture(), roughness: 0.95, metalness: 0, side: THREE.DoubleSide })
        );
        terrain.receiveShadow = true;
        terrain.frustumCulled = false;
        scene.add(terrain);
      }

      /* ---------- 7. Route, accotements, glissières, éclairage ---------- */
      const roadTex = makeRoadTextures();
      const roadMat = new THREE.MeshPhysicalMaterial({
        map: roadTex.map,
        color: 0xd0d2da,
        roughnessMap: roadTex.roughnessMap,
        emissiveMap: roadTex.emissiveMap,
        emissive: 0xffffff,
        emissiveIntensity: 1.2,
        roughness: 1,
        metalness: 0.1,
        clearcoat: 0.25,
        clearcoatRoughness: 0.35,
        envMap: envTex,
        envMapIntensity: 0.55,
      });
      const roadMesh = new THREE.Mesh(ribbon(frames, L, 8, -8, 0.025, 12), roadMat);
      roadMesh.receiveShadow = true;
      roadMesh.frustumCulled = false;
      scene.add(roadMesh);

      const shoulderMat = new THREE.MeshStandardMaterial({ color: 0x2a2d3a, roughness: 0.92, metalness: 0.05 });
      [ribbon(frames, L, 10.6, 8, 0.0, 12), ribbon(frames, L, -8, -10.6, 0.0, 12)].forEach((g) => {
        const m = new THREE.Mesh(g, shoulderMat);
        m.receiveShadow = true;
        m.frustumCulled = false;
        scene.add(m);
      });

      const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const concreteMat = new THREE.MeshStandardMaterial({ color: 0x5b6070, roughness: 0.8, metalness: 0.1, side: THREE.DoubleSide });
      const jersey: [number, number][] = [
        [-0.4, 0],
        [0.4, 0],
        [0.26, 0.45],
        [0.18, 1.0],
        [-0.18, 1.0],
        [-0.26, 0.45],
      ];
      const ledProfile: [number, number][] = [
        [-0.31, 0.5],
        [-0.25, 0.5],
        [-0.25, 0.6],
        [-0.31, 0.6],
      ];
      [-1, 1].forEach((s) => {
        const place = (prof: [number, number][]) => prof.map(([dx, h]) => [s * (9.4 + dx), h] as [number, number]);
        const barrier = new THREE.Mesh(sweepProfile(frames, place(jersey), true), concreteMat);
        barrier.frustumCulled = false;
        scene.add(barrier);
        const led = new THREE.Mesh(sweepProfile(frames, place(ledProfile), true), ledMat);
        led.frustumCulled = false;
        scene.add(led);
      });

      // Lampadaires (instanciés) + flaques de lumière au sol
      {
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x2b3040, metalness: 0.8, roughness: 0.4, envMap: envTex, envMapIntensity: 0.8 });
        const lampMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffd9a0).multiplyScalar(3) });
        const poolMat = new THREE.MeshBasicMaterial({
          map: glowTex,
          color: 0xffd9a0,
          transparent: true,
          opacity: 0.32,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -3,
          polygonOffsetUnits: -3,
        });
        const poleGeo = new THREE.CylinderGeometry(0.12, 0.18, 9, 8);
        poleGeo.translate(0, 4.5, 0);
        const armGeo = new THREE.BoxGeometry(3.2, 0.14, 0.14);
        const headGeo = new THREE.BoxGeometry(1.1, 0.12, 0.45);
        const poolGeo = new THREE.PlaneGeometry(15, 15);
        poolGeo.rotateX(-Math.PI / 2);
        const poles: THREE.Matrix4[] = [];
        const arms: THREE.Matrix4[] = [];
        const heads: THREE.Matrix4[] = [];
        const pools: THREE.Matrix4[] = [];
        const count = Math.floor(L / 36);
        const q = new THREE.Quaternion();
        const sc1 = new THREE.Vector3(1, 1, 1);
        for (let i = 0; i < count; i++) {
          const f = at((i + 0.5) / count);
          const flat = new THREE.Vector3(f.t.x, 0, f.t.z).normalize();
          [-1, 1].forEach((s) => {
            const base = f.p.clone().addScaledVector(f.n, s * 10.4);
            dummy.position.copy(base);
            dummy.lookAt(base.clone().add(flat));
            q.copy(dummy.quaternion);
            const toward = f.n.clone().multiplyScalar(-s);
            poles.push(new THREE.Matrix4().compose(base, q, sc1));
            arms.push(new THREE.Matrix4().compose(base.clone().addScaledVector(toward, 1.6).add(new THREE.Vector3(0, 8.7, 0)), q, sc1));
            heads.push(new THREE.Matrix4().compose(base.clone().addScaledVector(toward, 3.0).add(new THREE.Vector3(0, 8.55, 0)), q, sc1));
            const poolPos = base.clone().addScaledVector(toward, 3.0);
            poolPos.y = f.p.y + 0.07;
            pools.push(new THREE.Matrix4().compose(poolPos, new THREE.Quaternion(), sc1));
          });
        }
        scene.add(inst(poleGeo, poleMat, poles), inst(armGeo, poleMat, arms, undefined, false), inst(headGeo, lampMat, heads, undefined, false));
        const poolMesh = inst(poolGeo, poolMat, pools, undefined, false);
        poolMesh.receiveShadow = false;
        scene.add(poolMesh);
      }

      /* ---------- 8. Voiture ---------- */
      const built = buildCar(envTex, glowTex);
      const carGroup = built.car;
      scene.add(carGroup);

      // Traînée de particules à l'arrière
      const trailCount = 90;
      const trailPos = new Float32Array(trailCount * 3);
      const resetTrail = (i: number, spread = true) => {
        trailPos[i * 3] = (rng() < 0.5 ? -0.7 : 0.7) + (rng() - 0.5) * 0.3;
        trailPos[i * 3 + 1] = 0.55 + rng() * 0.2;
        trailPos[i * 3 + 2] = -3.0 - (spread ? rng() * 7 : 0);
      };
      for (let i = 0; i < trailCount; i++) resetTrail(i);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
      const trailMat = new THREE.PointsMaterial({ color: 0x2fe6ff, size: 0.55, map: glowTex, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending });
      const trail = new THREE.Points(trailGeo, trailMat);
      trail.frustumCulled = false;
      built.vis.add(trail);

      /* ---------- 9. Décors par biome ---------- */
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 0.85 });
      const blobGeo = blobGeometry(1, 0.35);
      const trunkGeo = new THREE.CylinderGeometry(0.5, 0.85, 1, 7);
      trunkGeo.translate(0, 0.5, 0);
      const randSide = () => (rng() < 0.5 ? -1 : 1);

      // --- Jungle ---
      {
        const g = new THREE.Group();
        const bark = new THREE.MeshStandardMaterial({ color: 0x3a2814, roughness: 0.95 });
        const trunks: THREE.Matrix4[] = [];
        const crowns: THREE.Matrix4[] = [];
        const crownCols: THREE.Color[] = [];
        for (let i = 0; i < 75; i++) {
          const s = groundAt(rand(0.008, 0.195), randSide() * rand(14, 70));
          const h = rand(9, 18);
          const w = rand(0.8, 1.4);
          trunks.push(M(s.x, s.y - 0.5, s.z, w, h + 0.5, w, rand(0, 6)));
          for (let k = 0; k < 3; k++) {
            const r = rand(3.6, 6) * w;
            crowns.push(M(s.x + rand(-2.5, 2.5) * w, s.y + h * rand(0.85, 1.05), s.z + rand(-2.5, 2.5) * w, r, r * rand(0.7, 0.95), r, rand(0, 6)));
            crownCols.push(new THREE.Color().setHSL(rand(0.3, 0.4), rand(0.5, 0.7), rand(0.16, 0.3)));
          }
        }
        g.add(inst(trunkGeo, bark, trunks), inst(blobGeo, foliageMat, crowns, crownCols));

        const bushes: THREE.Matrix4[] = [];
        const bushCols: THREE.Color[] = [];
        for (let i = 0; i < 180; i++) {
          const s = groundAt(rand(0.005, 0.2), randSide() * rand(11, 48));
          const r = rand(1.2, 2.6);
          bushes.push(M(s.x, s.y + r * 0.2, s.z, r, r * rand(0.5, 0.9), r, rand(0, 6)));
          bushCols.push(new THREE.Color().setHSL(rand(0.28, 0.4), rand(0.5, 0.75), rand(0.14, 0.26)));
        }
        g.add(inst(blobGeo, foliageMat, bushes, bushCols));

        const flowerGeo = new THREE.SphereGeometry(0.22, 8, 6);
        const flowerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const flowers: THREE.Matrix4[] = [];
        const flowerCols: THREE.Color[] = [];
        const fc = [0xff5fa2, 0xffc24a, 0xff7a3d, 0xb36bff];
        for (let i = 0; i < 90; i++) {
          const s = groundAt(rand(0.005, 0.2), randSide() * rand(11, 38));
          flowers.push(M(s.x, s.y + rand(0.4, 1.8), s.z));
          flowerCols.push(new THREE.Color(fc[Math.floor(rng() * fc.length)]).multiplyScalar(2.2));
        }
        g.add(inst(flowerGeo, flowerMat, flowers, flowerCols, false));

        // Rayons de lumière à travers la canopée
        const shaftMat = new THREE.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
        const shaftGeo = new THREE.ConeGeometry(12, 70, 24, 1, true);
        for (let i = 0; i < 7; i++) {
          const s = groundAt(0.02 + i * 0.026, randSide() * rand(14, 30));
          const m = new THREE.Mesh(shaftGeo, shaftMat);
          m.position.set(s.x, s.y + 32, s.z);
          m.rotation.set(rand(-0.2, 0.2), 0, rand(-0.25, 0.25));
          g.add(m);
        }
        scene.add(g);
      }

      // --- Pyramides d'Égypte ---
      {
        const g = new THREE.Group();
        const stone = makeStoneTexture();
        stone.repeat.set(10.5, 3);
        const pyramidGeo = new THREE.ConeGeometry(45, 40, 4, 1);
        pyramidGeo.rotateY(Math.PI / 4);
        const pyramidMat = new THREE.MeshStandardMaterial({ map: stone, roughness: 0.85, flatShading: true, color: 0xe6c488 });
        const capstoneMat = new THREE.MeshStandardMaterial({ color: 0xffc82c, emissive: 0xffc82c, emissiveIntensity: 1.2, metalness: 0.7, roughness: 0.25 });
        const beamMat = new THREE.MeshBasicMaterial({ color: 0xffc82c, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
        PYR.forEach((p, i) => {
          const sp = pyrSpots[i];
          const grp = new THREE.Group();
          grp.position.set(sp.x, sp.y - 0.2, sp.z);
          grp.scale.setScalar(p.scale);
          const pyr = new THREE.Mesh(pyramidGeo, pyramidMat);
          pyr.position.y = 20;
          pyr.castShadow = true;
          pyr.receiveShadow = true;
          grp.add(pyr);
          const cap = new THREE.Mesh(new THREE.ConeGeometry(2.6, 2.6, 4), capstoneMat);
          cap.rotation.y = Math.PI / 4;
          cap.position.y = 39.3;
          grp.add(cap);
          const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 4, 200, 14, 1, true), beamMat);
          beam.position.y = 140;
          grp.add(beam);
          g.add(grp);
        });

        // Obélisques + braseros le long de la route
        const obeliskGeo = new THREE.CylinderGeometry(0.55, 1.1, 20, 4, 1);
        obeliskGeo.rotateY(Math.PI / 4);
        obeliskGeo.translate(0, 10, 0);
        const obeliskMat = new THREE.MeshStandardMaterial({ color: 0x1a1510, metalness: 0.3, roughness: 0.35, emissive: 0xffffff, emissiveMap: makeGlyphTexture(), emissiveIntensity: 1.3, envMap: envTex, envMapIntensity: 0.6 });
        const tipGeo = new THREE.ConeGeometry(0.78, 1.8, 4);
        tipGeo.rotateY(Math.PI / 4);
        tipGeo.translate(0, 20.9, 0);
        const obelisks: THREE.Matrix4[] = [];
        const tips: THREE.Matrix4[] = [];
        const bowls: THREE.Matrix4[] = [];
        const flames: THREE.Matrix4[] = [];
        for (let i = 0; i < 8; i++) {
          [-1, 1].forEach((s) => {
            const o = groundAt(0.208 + i * 0.0245, s * 15.5);
            obelisks.push(M(o.x, o.y, o.z));
            tips.push(M(o.x, o.y, o.z));
            const b = groundAt(0.208 + i * 0.0245 + 0.0122, s * 13);
            bowls.push(M(b.x, b.y + 1.0, b.z));
            flames.push(M(b.x, b.y + 1.9, b.z, 1, rand(0.8, 1.3), 1));
          });
        }
        const bowlGeo = new THREE.CylinderGeometry(0.8, 0.45, 0.7, 10);
        const pedestalGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.0, 8);
        pedestalGeo.translate(0, -0.9, 0);
        const flameGeo = new THREE.ConeGeometry(0.5, 1.6, 8);
        const flameMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff9a2e).multiplyScalar(2.4) });
        const darkStone = new THREE.MeshStandardMaterial({ color: 0x2a2118, roughness: 0.8 });
        g.add(inst(obeliskGeo, obeliskMat, obelisks), inst(tipGeo, capstoneMat, tips, undefined, false));
        g.add(inst(bowlGeo, darkStone, bowls), inst(pedestalGeo, darkStone, bowls), inst(flameGeo, flameMat, flames, undefined, false));
        scene.add(g);
      }

      // --- Sahara : cristaux violets + oasis + palmiers ---
      const palmFronds: THREE.Group[] = [];
      let oasisWater: THREE.Mesh | null = null;
      {
        const g = new THREE.Group();
        const crystalMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0xa855f7, emissiveIntensity: 1.6, roughness: 0.2, metalness: 0.2, flatShading: true });
        const crystalGeo = new THREE.OctahedronGeometry(1, 0);
        const cr: THREE.Matrix4[] = [];
        for (let i = 0; i < 16; i++) {
          const base = groundAt(rand(0.41, 0.59), randSide() * rand(14, 34));
          for (let k = 0; k < 4; k++) {
            const h = rand(1.5, 5) * (k === 0 ? 1.8 : 1);
            cr.push(M(base.x + rand(-1.6, 1.6), base.y + h * 0.7, base.z + rand(-1.6, 1.6), h * 0.28, h, h * 0.28, rand(0, 6), rand(-0.25, 0.25), rand(-0.25, 0.25)));
          }
        }
        g.add(inst(crystalGeo, crystalMat, cr));

        // Oasis
        oasisWater = new THREE.Mesh(
          new THREE.CircleGeometry(24, 48),
          new THREE.MeshStandardMaterial({ color: 0x0b4a72, roughness: 0.06, metalness: 0.9, envMap: envTex, envMapIntensity: 1.4, emissive: 0x0b6a9a, emissiveIntensity: 0.25 })
        );
        oasisWater.rotation.x = -Math.PI / 2;
        oasisWater.position.set(oasis.x, oasis.y + 0.25, oasis.z);
        g.add(oasisWater);

        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4b3320, roughness: 0.9 });
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x1f8a46, roughness: 0.7, flatShading: true, side: THREE.DoubleSide });
        const frondGeo = new THREE.ConeGeometry(0.55, 5.2, 3);
        frondGeo.translate(0, 2.6, 0);
        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * Math.PI * 2 + rand(-0.2, 0.2);
          const d = rand(24, 32);
          const px = oasis.x + Math.cos(a) * d;
          const pz = oasis.z + Math.sin(a) * d;
          const py = terrainHeight(0.5, 52 + Math.sin(a) * d, px, pz, at(0.5).p.y, spots);
          const h = rand(8, 12);
          const lean = rand(-3, 3);
          const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(lean * 0.2, h * 0.55, 0), new THREE.Vector3(lean, h, rand(-1, 1)));
          const palm = new THREE.Group();
          palm.position.set(px, py - 0.3, pz);
          const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.32, 6), trunkMat);
          trunk.castShadow = true;
          palm.add(trunk);
          const crown = new THREE.Group();
          crown.position.copy(curve.getPoint(1));
          for (let k = 0; k < 9; k++) {
            const wr = new THREE.Group();
            wr.rotation.y = (k / 9) * Math.PI * 2;
            const fr = new THREE.Mesh(frondGeo, leafMat);
            fr.rotation.z = -(Math.PI / 2 - 0.55);
            fr.scale.z = 0.25;
            fr.castShadow = true;
            wr.add(fr);
            crown.add(wr);
          }
          palm.add(crown);
          palmFronds.push(crown);
          g.add(palm);
        }
        scene.add(g);
      }

      // --- Fleuve du Wouri : eau, pont, piliers, pirogues, brume ---
      const waterNormal = makeWaterNormal();
      waterNormal.repeat.set(60, 28);
      const pirogues: { m: THREE.Group; phase: number; y: number }[] = [];
      const mistSprites: THREE.Sprite[] = [];
      {
        const g = new THREE.Group();
        const wc = at(0.7).p;
        const water = new THREE.Mesh(
          new THREE.PlaneGeometry(900, 420),
          new THREE.MeshStandardMaterial({ color: 0x04283d, roughness: 0.08, metalness: 0.9, envMap: envTex, envMapIntensity: 1.3, normalMap: waterNormal, normalScale: new THREE.Vector2(0.5, 0.5) })
        );
        water.rotation.x = -Math.PI / 2;
        water.position.set(wc.x, WATER_Y, wc.z);
        water.receiveShadow = true;
        g.add(water);

        const i0 = Math.floor(BRIDGE_A * FN);
        const i1 = Math.ceil(BRIDGE_B * FN);
        const deck = new THREE.Mesh(
          sweepProfile(frames, [[-8.6, -1.5], [8.6, -1.5], [8.6, 0], [-8.6, 0]], true, i0, i1),
          new THREE.MeshStandardMaterial({ color: 0x3a3f4e, roughness: 0.7, metalness: 0.3, side: THREE.DoubleSide, envMap: envTex, envMapIntensity: 0.5 })
        );
        deck.frustumCulled = false;
        deck.castShadow = true;
        g.add(deck);
        [-1, 1].forEach((s) => {
          const strip = new THREE.Mesh(
            sweepProfile(frames, [[s * 8.7 - 0.07, -1.0], [s * 8.7 + 0.07, -1.0], [s * 8.7 + 0.07, -0.86], [s * 8.7 - 0.07, -0.86]], true, i0, i1),
            ledMat
          );
          strip.frustumCulled = false;
          g.add(strip);
        });

        // Piliers
        const pierMat = new THREE.MeshStandardMaterial({ color: 0x4b5160, roughness: 0.75, metalness: 0.25, envMap: envTex, envMapIntensity: 0.5 });
        for (let k = 0; k < 10; k++) {
          const f = at(0.6 + k * 0.0222);
          const hgt = f.p.y - 1.5 - RIVER_BED;
          const orient = new THREE.Object3D();
          orient.position.copy(f.p);
          orient.lookAt(f.p.clone().add(new THREE.Vector3(f.t.x, 0, f.t.z)));
          [-1, 1].forEach((s) => {
            const col = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.1, hgt, 12), pierMat);
            col.position.copy(f.p).addScaledVector(f.n, s * 5);
            col.position.y = RIVER_BED + hgt / 2;
            col.castShadow = true;
            g.add(col);
          });
          const beam = new THREE.Mesh(new THREE.BoxGeometry(16, 1.4, 2.6), pierMat);
          beam.position.copy(f.p);
          beam.position.y = f.p.y - 2.2;
          beam.quaternion.copy(orient.quaternion);
          beam.castShadow = true;
          g.add(beam);
        }

        // Arches métalliques éclairées
        const archMat = new THREE.MeshStandardMaterial({ color: 0x8aa3b5, metalness: 0.9, roughness: 0.28, envMap: envTex, envMapIntensity: 1.4 });
        for (let i = 0; i < 6; i++) {
          const f = at(0.63 + i * 0.028);
          const arch = new THREE.Group();
          arch.position.copy(f.p);
          arch.lookAt(f.p.clone().add(f.t));
          const main = new THREE.Mesh(new THREE.TorusGeometry(10, 0.5, 12, 48, Math.PI), archMat);
          main.castShadow = true;
          arch.add(main);
          const inner = new THREE.Mesh(new THREE.TorusGeometry(9.3, 0.2, 8, 48, Math.PI), archMat);
          inner.position.z = 0.7;
          arch.add(inner);
          const lamp = new THREE.Mesh(new THREE.TorusGeometry(10, 0.12, 6, 48, Math.PI), ledMat);
          lamp.position.z = 0.55;
          arch.add(lamp);
          g.add(arch);
        }

        // Pirogues
        const hullMat = new THREE.MeshStandardMaterial({ color: 0x5a3a1e, roughness: 0.85 });
        const lanternMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffb347).multiplyScalar(3) });
        const hullGeo = new THREE.SphereGeometry(1, 16, 10);
        const lanternGeo = new THREE.SphereGeometry(0.12, 8, 6);
        for (let i = 0; i < 9; i++) {
          const f = at(rand(0.62, 0.78));
          const lat = randSide() * rand(26, 110);
          const pg = new THREE.Group();
          const hull = new THREE.Mesh(hullGeo, hullMat);
          hull.scale.set(0.5, 0.22, 2.4);
          pg.add(hull);
          const lantern = new THREE.Mesh(lanternGeo, lanternMat);
          lantern.position.set(0, 0.55, 1.6);
          pg.add(lantern);
          pg.position.set(f.p.x + f.n.x * lat, WATER_Y + 0.05, f.p.z + f.n.z * lat);
          pg.rotation.y = rand(0, 6);
          g.add(pg);
          pirogues.push({ m: pg, phase: rand(0, 6), y: WATER_Y + 0.05 });
        }

        // Brume basse
        for (let i = 0; i < 28; i++) {
          const f = at(rand(0.6, 0.8));
          const lat = rand(-120, 120);
          const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xbfe9ff, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending }));
          sp.scale.set(rand(50, 90), rand(14, 24), 1);
          sp.position.set(f.p.x + f.n.x * lat, WATER_Y + rand(1, 4), f.p.z + f.n.z * lat);
          g.add(sp);
          mistSprites.push(sp);
        }
        scene.add(g);
      }

      // --- Forêt du Sud Cameroun ---
      {
        const g = new THREE.Group();
        const bark = new THREE.MeshStandardMaterial({ color: 0x241709, roughness: 0.95 });
        const trunkG = new THREE.CylinderGeometry(1.8, 3.2, 1, 10);
        trunkG.translate(0, 0.5, 0);
        const rootGeo = new THREE.ConeGeometry(0.9, 9, 4);
        rootGeo.translate(0, 4.5, 0);
        const trunks: THREE.Matrix4[] = [];
        const roots: THREE.Matrix4[] = [];
        const canopies: THREE.Matrix4[] = [];
        const canopyCols: THREE.Color[] = [];
        const vines: THREE.Matrix4[] = [];
        for (let i = 0; i < 36; i++) {
          const s = groundAt(rand(0.805, 0.995), randSide() * rand(20, 75));
          const h = rand(30, 48);
          trunks.push(M(s.x, s.y - 1, s.z, 1, h + 1, 1, rand(0, 6)));
          for (let k = 0; k < 5; k++) {
            const a = (k / 5) * Math.PI * 2 + rand(-0.3, 0.3);
            dummy.position.set(s.x + Math.cos(a) * 1.8, s.y - 0.8, s.z + Math.sin(a) * 1.8);
            dummy.rotation.order = "YXZ";
            dummy.rotation.set(-0.25, Math.PI / 2 - a, 0);
            dummy.scale.set(0.45, rand(0.8, 1.2), 1);
            dummy.updateMatrix();
            roots.push(dummy.matrix.clone());
            dummy.rotation.order = "XYZ";
          }
          for (let k = 0; k < 4; k++) {
            const r = rand(9, 14);
            canopies.push(M(s.x + rand(-8, 8), s.y + h + rand(-2, 3), s.z + rand(-8, 8), r * 1.3, r * 0.5, r * 1.3, rand(0, 6)));
            canopyCols.push(new THREE.Color().setHSL(rand(0.3, 0.38), rand(0.55, 0.7), rand(0.14, 0.24)));
          }
          for (let k = 0; k < 3; k++) vines.push(M(s.x + rand(-6, 6), s.y + h - 2, s.z + rand(-6, 6), 1, rand(8, 20), 1));
        }
        const vineGeo = new THREE.CylinderGeometry(0.07, 0.07, 1, 5);
        vineGeo.translate(0, -0.5, 0);
        g.add(inst(trunkG, bark, trunks), inst(rootGeo, bark, roots), inst(blobGeo, foliageMat, canopies, canopyCols));
        g.add(inst(vineGeo, new THREE.MeshStandardMaterial({ color: 0x1c4a22, roughness: 0.9 }), vines, undefined, false));

        // Champignons bioluminescents
        const stemGeo = new THREE.CylinderGeometry(0.12, 0.2, 1, 6);
        stemGeo.translate(0, 0.5, 0);
        const capGeo = new THREE.SphereGeometry(1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const stems: THREE.Matrix4[] = [];
        const caps: THREE.Matrix4[] = [];
        const capCols: THREE.Color[] = [];
        const mc = [0x84cc16, 0x2fe6ff, 0xff6ec7, 0xb6ff4a];
        for (let i = 0; i < 130; i++) {
          const s = groundAt(rand(0.805, 0.995), randSide() * rand(10.5, 36));
          const h = rand(0.5, 2.6);
          const r = h * rand(0.5, 0.8);
          stems.push(M(s.x, s.y, s.z, 1, h, 1));
          caps.push(M(s.x, s.y + h, s.z, r, r * 0.6, r));
          capCols.push(new THREE.Color(mc[Math.floor(rng() * mc.length)]).multiplyScalar(2.4));
        }
        const capMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        g.add(inst(stemGeo, new THREE.MeshStandardMaterial({ color: 0xcfd8c0, roughness: 0.8, emissive: 0x335522, emissiveIntensity: 0.4 }), stems, undefined, false));
        g.add(inst(capGeo, capMat, caps, capCols, false));
        scene.add(g);
      }

      /* ---------- 10. Portails des projets ---------- */
      const waypointObjects: { grp: THREE.Group; ring1: THREE.Mesh; ring2: THREE.Mesh; core: THREE.Mesh; project: Project; progress: number }[] = [];
      {
        const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffc82c).multiplyScalar(2.2) });
        const ring2Mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x00f3ff).multiplyScalar(2.2) });
        const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x00f3ff).multiplyScalar(2), wireframe: true });
        const discMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
        const padMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffc82c).multiplyScalar(1.6), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
        projects.forEach((proj, idx) => {
          const u = 0.05 + (idx / Math.max(projects.length, 1)) * 0.88;
          const f = at(u);
          const grp = new THREE.Group();
          grp.position.set(f.p.x, f.p.y + 5.8, f.p.z);
          grp.lookAt(grp.position.clone().add(f.t));
          const ring1 = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.3, 16, 64), ringMat);
          const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.7, 0.12, 12, 64), ring2Mat);
          const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.8, 0), coreMat);
          const disc = new THREE.Mesh(new THREE.CircleGeometry(5.3, 48), discMat);
          grp.add(ring1, ring2, core, disc);

          const raw = proj as unknown as Record<string, unknown>;
          const name = typeof raw.title === "string" ? raw.title : typeof raw.name === "string" ? raw.name : `Projet ${idx + 1}`;
          const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeLabelTexture(name), transparent: true, depthWrite: false }));
          label.scale.set(16, 4, 1);
          label.position.set(0, 8.5, 0);
          grp.add(label);
          scene.add(grp);

          const pad = new THREE.Mesh(new THREE.RingGeometry(4.2, 5.8, 48), padMat);
          pad.rotation.x = -Math.PI / 2;
          pad.position.set(f.p.x, f.p.y + 0.09, f.p.z);
          scene.add(pad);

          waypointObjects.push({ grp, ring1, ring2, core, project: proj, progress: u });
        });
      }

      /* ---------- 11. Particules d'ambiance (poussière / spores / pollen) ---------- */
      const dustCount = 280;
      const dustPos = new Float32Array(dustCount * 3);
      const dustVel = new Float32Array(dustCount * 3);
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
      const dustMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, map: glowTex, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending });
      const dust = new THREE.Points(dustGeo, dustMat);
      dust.frustumCulled = false;
      scene.add(dust);
      const respawnDust = (i: number, origin: THREE.Vector3, t: THREE.Vector3, n: THREE.Vector3, ahead: boolean) => {
        const along = ahead ? rand(10, 70) : rand(-30, 70);
        dustPos[i * 3] = origin.x + t.x * along + n.x * rand(-40, 40);
        dustPos[i * 3 + 1] = origin.y + rand(-1, 16);
        dustPos[i * 3 + 2] = origin.z + t.z * along + n.z * rand(-40, 40);
        dustVel[i * 3] = rand(-0.6, 0.6);
        dustVel[i * 3 + 1] = rand(-0.1, 0.3);
        dustVel[i * 3 + 2] = rand(-0.6, 0.6);
      };
      {
        const f0 = at(0);
        for (let i = 0; i < dustCount; i++) respawnDust(i, f0.p, f0.t, f0.n, false);
      }

      /* ---------- 12. Placement initial ---------- */
      lerpLook(0, 1);
      {
        const f0 = frames[0];
        carGroup.position.copy(f0.p);
        carGroup.position.y += 0.02;
        carGroup.lookAt(f0.p.clone().add(f0.t.clone().multiplyScalar(10)));
        camera.position.copy(f0.p.clone().add(f0.t.clone().multiplyScalar(-22)).add(new THREE.Vector3(0, 9, 0)));
        camera.lookAt(f0.p.clone().add(new THREE.Vector3(0, 2, 0)));
      }

      /* ---------- 13. Événements ---------- */
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
        width = container.clientWidth || 1;
        height = container.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
      };
      const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(handleResize) : null;
      ro?.observe(container);
      window.addEventListener("resize", handleResize);

      /* ---------- 14. Boucle d'animation ---------- */
      let raf = 0;
      const clock = new THREE.Clock();
      let lastReportedSpeed = -1;
      let prevSpeed = 0;
      let camFovTarget = 64;
      const tmpA = new THREE.Vector3();

      const animate = () => {
        raf = requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.05);
        const time = clock.elapsedTime;
        const state = sceneStateRef.current;

        // --- Accélération / freinage ---
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
          if (state.boostTimer <= 0) state.boostActive = false;
        }

        // --- Direction ---
        if (keysPressed["KeyA"] || keysPressed["ArrowLeft"] || state.isSteeringLeft) {
          state.laneOffset = Math.max(-5.5, state.laneOffset - 9 * delta);
          state.steering = -0.35;
        } else if (keysPressed["KeyD"] || keysPressed["ArrowRight"] || state.isSteeringRight) {
          state.laneOffset = Math.min(5.5, state.laneOffset + 9 * delta);
          state.steering = 0.35;
        } else {
          state.steering *= 0.85;
        }

        if (isDriving) state.speed += (state.targetSpeed - state.speed) * (1 - Math.exp(-2.2 * delta));
        else state.speed *= Math.exp(-2.6 * delta);

        if (Math.abs(state.speed) > 0.08) {
          state.progress = (state.progress + ((state.speed / 3.6) * delta) / L + 1) % 1;
        } else {
          state.speed = 0;
        }

        const kmh = Math.round(Math.abs(state.speed));
        if (kmh !== lastReportedSpeed) {
          lastReportedSpeed = kmh;
          cbRef.current.onSpeedChange?.(kmh);
        }
        const sf = clamp01(Math.abs(state.speed) / 125); // facteur de vitesse 0..1

        // --- Position de la voiture sur la route ---
        const carProgress = state.progress;
        const cf = at(carProgress);
        const finalCarPos = cf.p.clone().addScaledVector(cf.n, state.laneOffset);
        finalCarPos.y += 0.02;
        const heading = cf.t.clone().applyAxisAngle(UP, -state.steering * 0.3);
        carGroup.position.copy(finalCarPos);
        carGroup.lookAt(finalCarPos.clone().add(heading.multiplyScalar(10)));
        carGroup.rotateZ(-state.steering * 0.1);

        // Tangage (cabrage / plongée) et micro-vibrations
        const dv = delta > 0 ? (state.speed - prevSpeed) / delta : 0;
        prevSpeed = state.speed;
        const pitchTarget = Math.max(-0.04, Math.min(0.04, -dv * 0.0006));
        built.vis.rotation.x += (pitchTarget - built.vis.rotation.x) * (1 - Math.exp(-8 * delta));
        built.vis.position.y = Math.sin(time * 26) * 0.006 * sf;
        built.vis.visible = state.cameraMode !== "cockpit";

        built.wheels.forEach((w) => {
          w.spin.rotation.x += (state.speed / 3.6 * delta) / 0.53;
          if (w.front) w.steer.rotation.y = -state.steering;
        });

        // Feux, flammes, halo
        const braking = state.targetSpeed < state.speed - 1 && state.speed > 1;
        built.rearMat.color.setRGB(braking ? 6 : 2.2, braking ? 0.2 : 0.08, braking ? 0.3 : 0.15);
        built.flameMat.opacity = clamp01(0.05 + sf * 0.55 + (state.boostActive ? 0.35 : 0)) * (state.speed > 1 ? 1 : 0.15);
        built.flames.forEach((f) => f.scale.set(1, 1, 0.5 + sf * 1.2 + (state.boostActive ? 1.2 : 0) + Math.sin(time * 40) * 0.08));
        built.underglow.opacity = 0.5 + Math.sin(time * 6) * 0.12;
        built.underglow.color.copy(cur.led).lerp(new THREE.Color(0x00e5ff), 0.5);

        // Particules de traînée
        for (let i = 0; i < trailCount; i++) {
          trailPos[i * 3 + 2] -= (5 + Math.abs(state.speed) * 0.1) * delta;
          trailPos[i * 3 + 1] += delta * 0.25;
          if (trailPos[i * 3 + 2] < -10 || trailPos[i * 3 + 1] > 1.6) resetTrail(i, false);
        }
        (trailGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        trailMat.opacity = 0.25 + sf * 0.6;

        // --- Biome actif + ambiance ---
        let newBiomeIndex = 0;
        BIOMES.forEach((b, idx) => {
          if (carProgress >= b.trackRange[0] && carProgress < b.trackRange[1]) newBiomeIndex = idx;
        });
        if (newBiomeIndex !== state.activeBiomeIndex) {
          state.activeBiomeIndex = newBiomeIndex;
          cbRef.current.onBiomeChange?.(newBiomeIndex, BIOMES[newBiomeIndex].name);
        }
        lerpLook(state.activeBiomeIndex, 1 - Math.exp(-1.6 * delta));

        (scene.background as THREE.Color).copy(cur.fog);
        const fog = scene.fog as THREE.FogExp2;
        fog.color.copy(cur.fog);
        fog.density = cur.density;
        skyMat.uniforms.uTop.value.copy(cur.skyTop);
        skyMat.uniforms.uHorizon.value.copy(cur.fog);
        skyMat.uniforms.uGlow.value.copy(cur.glow);
        ambientLight.intensity = cur.amb;
        hemiLight.color.copy(cur.hemiSky);
        hemiLight.groundColor.copy(cur.hemiGround);
        hemiLight.intensity = cur.hemiI;
        dirLight.color.copy(cur.sun);
        dirLight.intensity = cur.sunI;
        dirLight.position.copy(finalCarPos).add(cur.sunDir);
        dirLight.target.position.copy(finalCarPos);
        ledMat.color.copy(cur.led).multiplyScalar(2.4);
        dustMat.color.copy(cur.dust);
        starMat.opacity = cur.stars;
        moonMat.opacity = 1;
        moonGlowMat.opacity = 0.5 * cur.stars;
        moon.visible = cur.stars > 0.3;
        moonGlow.visible = moon.visible;
        renderer.toneMappingExposure = cur.exposure;
        skyDome.position.copy(camera.position);
        skyGroup.position.copy(camera.position);

        // --- Proximité des portails ---
        let closestProject: Project | null = null;
        for (const wp of waypointObjects) {
          wp.ring1.rotation.z += delta * 0.6;
          wp.ring2.rotation.z -= delta * 1.1;
          wp.core.rotation.y += delta * 1.5;
          wp.core.rotation.x += delta * 0.8;
          const near = Math.abs(carProgress - wp.progress) < 0.035;
          if (near) closestProject = wp.project;
          const sPulse = near ? 1.08 + Math.sin(time * 6) * 0.04 : 1;
          wp.grp.scale.setScalar(mix(wp.grp.scale.x, sPulse, 1 - Math.exp(-6 * delta)));
        }
        if (closestProject !== state.nearProject) {
          state.nearProject = closestProject;
          cbRef.current.onNearProject?.(closestProject);
        }

        // --- Décor animé ---
        waterNormal.offset.x += delta * 0.012;
        waterNormal.offset.y += delta * 0.007;
        pirogues.forEach((p) => {
          p.m.position.y = p.y + Math.sin(time * 1.2 + p.phase) * 0.12;
          p.m.rotation.z = Math.sin(time * 0.9 + p.phase) * 0.03;
        });
        mistSprites.forEach((m, i) => {
          m.position.x += Math.sin(time * 0.1 + i) * delta * 0.8;
        });
        palmFronds.forEach((c, i) => {
          c.rotation.z = Math.sin(time * 1.1 + i) * 0.03;
          c.rotation.x = Math.cos(time * 0.9 + i) * 0.03;
        });
        if (oasisWater) oasisWater.position.y += Math.sin(time * 0.8) * 0.0008;

        // Particules d'ambiance
        for (let i = 0; i < dustCount; i++) {
          dustPos[i * 3] += (dustVel[i * 3] + Math.sin(time * 0.7 + i) * 0.2) * delta;
          dustPos[i * 3 + 1] += (dustVel[i * 3 + 1] + Math.cos(time * 0.5 + i) * 0.1) * delta;
          dustPos[i * 3 + 2] += dustVel[i * 3 + 2] * delta;
          const dx = dustPos[i * 3] - finalCarPos.x;
          const dz = dustPos[i * 3 + 2] - finalCarPos.z;
          if (dx * dx + dz * dz > 6400) respawnDust(i, finalCarPos, cf.t, cf.n, true);
        }
        (dustGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

        // --- Caméra ---
        const fovBase = state.cameraMode === "cockpit" ? 78 : 62;
        camFovTarget = fovBase + sf * 14 + (state.boostActive ? 8 : 0);
        if (Math.abs(camera.fov - camFovTarget) > 0.02) {
          camera.fov += (camFovTarget - camera.fov) * (1 - Math.exp(-4 * delta));
          camera.updateProjectionMatrix();
        }

        if (state.cameraMode === "chase") {
          const back = 22 + sf * 3 + (state.boostActive ? 8 : 0);
          const targetCamPos = finalCarPos.clone().addScaledVector(cf.t, -back);
          targetCamPos.y += 9;
          camera.position.lerp(targetCamPos, 1 - Math.exp(-8 * delta));
          const shake = sf * sf * 0.05;
          camera.position.x += Math.sin(time * 41) * shake;
          camera.position.y += Math.cos(time * 37) * shake;
          camera.lookAt(tmpA.copy(finalCarPos).addScaledVector(cf.t, 5).add(new THREE.Vector3(0, 2.5, 0)));
        } else if (state.cameraMode === "cockpit") {
          camera.position.copy(finalCarPos).add(new THREE.Vector3(0, 1.55, 0));
          camera.lookAt(tmpA.copy(finalCarPos).addScaledVector(heading, 30).add(new THREE.Vector3(0, 1.2, 0)));
        } else if (state.cameraMode === "orbit") {
          const orbitAngle = time * 0.5;
          camera.position.set(finalCarPos.x + Math.sin(orbitAngle) * 30, finalCarPos.y + 14, finalCarPos.z + Math.cos(orbitAngle) * 30);
          camera.lookAt(finalCarPos);
        } else {
          camera.position.set(finalCarPos.x, finalCarPos.y + 180, finalCarPos.z + 10);
          camera.lookAt(finalCarPos);
        }

        // Moteur audio
        if (state.audioEnabled && state.audioCtx && state.engineOsc) {
          const targetFreq = 45 + Math.abs(state.speed) * 0.9;
          state.engineOsc.frequency.setTargetAtTime(targetFreq, state.audioCtx.currentTime, 0.1);
        }

        // --- Rendu avec post-traitement ---
        speedPass.uniforms.uStrength.value = Math.pow(sf, 1.4) * (state.boostActive ? 1.6 : 1);
        speedPass.uniforms.uTime.value = time;
        composer.render(delta);
      };

      animate();

      /* ---------- 15. Nettoyage ---------- */
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("resize", handleResize);
        ro?.disconnect();
        container.removeEventListener("wheel", handleWheel);

        const st = sceneStateRef.current;
        if (st.audioCtx) {
          st.audioCtx.close().catch(() => undefined);
          st.audioCtx = null;
          st.engineOsc = null;
          st.engineGain = null;
          st.audioEnabled = false;
        }

        disposeObject(scene);
        glowTex.dispose();
        envRT.dispose();
        composer.dispose();
        rt.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }, [projects]);

    return (
      <div className="relative w-full h-full min-h-[85vh] overflow-hidden bg-[#050714]">
        <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
      </div>
    );
  }
);

CyberCarScene.displayName = "CyberCarScene";