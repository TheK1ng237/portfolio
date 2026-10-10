"use client";

import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Footer minimal : des points de broderie en raphia se rassemblent en treillis de Ndop.
 * Ils se posent une fois, de gauche à droite, quand le footer entre à l'écran. Le pointeur les
 * écarte comme on tirerait des fils, puis ils reviennent à leur place. Une fois posés, rien ne bouge :
 * la boucle d'animation s'arrête (zéro CPU au repos). Avec « mouvement réduit », le motif est fixe.
 */

const LINKS = [
  { label: "Email", href: "mailto:tangking237@gmail.com", external: false },
  { label: "LinkedIn", href: "https://linkedin.com/in/ndoh-yannick-tang-5b004934a", external: true },
  { label: "GitHub", href: "https://github.com/TangB5", external: true },
  { label: "Instagram", href: "https://instagram.com/Thek1ng237337", external: true },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC82C]";

/* -------------------------------------------------------------------------- */
/*  Le treillis : les positions « maison » de chaque point                    */
/* -------------------------------------------------------------------------- */

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number; // position maison
  hy: number;
  r: number;
  color: string;
  delay: number; // secondes avant de partir vers sa place
};

const RAFFIA = "#E9D8A6";
const GOLD = "#FFC82C";
const INDIGO = "#6B7DE0";

function prng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Losanges de Ndop (contour raphia, losange intérieur or, point central, coins indigo). */
export function buildParticles(w: number, h: number): Particle[] {
  const rnd = prng(237);
  const tile = Math.min(72, Math.max(44, w / 16));
  const cols = Math.max(4, Math.floor(w / tile));
  const rows = Math.max(2, Math.floor(h / tile));
  const ox = (w - cols * tile) / 2;
  const oy = (h - rows * tile) / 2;
  const list: Particle[] = [];

  const add = (hx: number, hy: number, r: number, color: string) =>
    list.push({
      x: rnd() * w,
      y: rnd() * h,
      vx: 0,
      vy: 0,
      hx,
      hy,
      r,
      color,
      delay: (hx / w) * 0.9 + rnd() * 0.25,
    });

  const diamond = (cx: number, cy: number, d: number, n: number, r: number, color: string) => {
    const v = [
      [cx, cy - d],
      [cx + d, cy],
      [cx, cy + d],
      [cx - d, cy],
    ];
    for (let k = 0; k < 4; k++) {
      const a = v[k];
      const b = v[(k + 1) % 4];
      for (let s = 0; s < n; s++) add(a[0] + ((b[0] - a[0]) * s) / n, a[1] + ((b[1] - a[1]) * s) / n, r, color);
    }
  };

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cx = ox + (i + 0.5) * tile;
      const cy = oy + (j + 0.5) * tile;
      diamond(cx, cy, tile * 0.42, 4, 1.5, RAFFIA);
      diamond(cx, cy, tile * 0.2, 2, 1.7, GOLD);
      add(cx, cy, 2.4, GOLD);
    }
  }
  for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) add(ox + i * tile, oy + j * tile, 2, INDIGO);

  return list;
}

/* -------------------------------------------------------------------------- */
/*  Épingle en bois                                                           */
/* -------------------------------------------------------------------------- */

function Pin({ size = 16 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" focusable="false" style={{ filter: "drop-shadow(1px 3px 2px rgba(0,0,0,.6))" }}>
      <defs>
        <radialGradient id={`pw-${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#D9A867" />
          <stop offset="0.6" stopColor="#A9743A" />
          <stop offset="1" stopColor="#6A4120" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill={`url(#pw-${uid})`} stroke="#4A2C14" strokeWidth="1" />
      <path d="M5 11C9 8 19 8 23 11M4.5 15C9 12 19 12 23.5 15M6 19.5C10 17 18 17 22 19.5" stroke="#5A3618" strokeOpacity="0.5" strokeWidth="1" fill="none" />
      <ellipse cx="10" cy="9" rx="3.4" ry="2" fill="#fff" opacity="0.28" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  const t = useTranslations("Footer");
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let started = !!reduce; // le footer est-il déjà entré à l'écran ?
    let assembled = !!reduce; // tous les points sont-ils posés ?
    let running = false;
    let raf = 0;
    let startTime = 0;
    let pointer: { x: number; y: number } | null = null;
    const RADIUS = 84;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const byColor = new Map<string, Particle[]>();
      for (const p of particles) {
        const g = byColor.get(p.color);
        if (g) g.push(p);
        else byColor.set(p.color, [p]);
      }
      byColor.forEach((group, color) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        for (const p of group) {
          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;
      let moving = false;

      for (const p of particles) {
        if (!assembled && elapsed < p.delay) {
          moving = true;
          continue;
        }
        p.vx += (p.hx - p.x) * 0.045;
        p.vy += (p.hy - p.y) * 0.045;
        if (pointer) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < RADIUS * RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / RADIUS) ** 2 * 3.2;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;
        if (Math.abs(p.vx) > 0.02 || Math.abs(p.vy) > 0.02 || Math.abs(p.hx - p.x) > 0.2 || Math.abs(p.hy - p.y) > 0.2) moving = true;
      }

      draw();
      if (moving || pointer) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        assembled = true;
      }
    };

    const kick = () => {
      if (reduce || !started || running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = buildParticles(w, h);
      if (assembled) for (const p of particles) (p.x = p.hx), (p.y = p.hy);
      draw();
      kick();
    };

    build();

    const resize = new ResizeObserver(build);
    resize.observe(wrap);

    let io: IntersectionObserver | null = null;
    if (!reduce) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting) && !started) {
            started = true;
            startTime = 0;
            kick();
            io?.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      io.observe(wrap);
    }

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      kick();
    };
    const onLeave = () => {
      pointer = null;
    };
    if (!reduce) {
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      io?.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <footer className="bg-[#0B0D18] font-azurio">
      <div aria-hidden="true" className="border-t-2 border-dashed border-[#E9D8A6]/40" />

      <div ref={wrapRef} className="relative h-52 w-full sm:h-64" aria-hidden="true">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-10 pt-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2.5 text-base text-gray-100">
            <Pin size={16} />
            <span>
              © {year} Thek1ng237, {t("metadata.location")}
            </span>
          </p>
          <p className="mt-1.5 max-w-sm text-sm font-light text-gray-400">{t("brand.tagline")}</p>
        </div>

        <nav aria-label={t("external_links")}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`text-sm text-gray-200 underline decoration-[#E9D8A6]/40 underline-offset-4 transition-colors hover:text-[#FFC82C] hover:decoration-[#FFC82C] ${focusRing}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}