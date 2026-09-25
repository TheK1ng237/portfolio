"use client";

import React, { useEffect, useRef } from "react";

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for physics interaction
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 180,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Particle pool definition
    const particleCount = Math.min(Math.floor(width / 18), 70);
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      goldColor: string;
    }

    const goldShades = [
      "rgba(233, 184, 38,", // #E9B826 Primary Gold
      "rgba(255, 215, 0,",  // #FFD700 Vivid Gold
      "rgba(230, 57, 70,",  // #E63946 Crimson accent
      "rgba(255, 245, 220,",// Ivory highlight
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const shade = goldShades[Math.floor(Math.random() * goldShades.length)];
      const baseAlpha = 0.15 + Math.random() * 0.45;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1 + Math.random() * 2.5,
        alpha: baseAlpha,
        baseAlpha,
        goldColor: shade,
      });
    }

    // Render loop
    const render = () => {
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Draw faint background ambient glow gradient
      const ambientGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        Math.max(width, height) * 0.6
      );
      ambientGlow.addColorStop(0, "rgba(233, 184, 38, 0.035)");
      ambientGlow.addColorStop(0.5, "rgba(230, 57, 70, 0.015)");
      ambientGlow.addColorStop(1, "rgba(5, 5, 8, 0)");
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse proximity reaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.05;
          p.x -= (dx / dist) * force * 15;
          p.y -= (dy / dist) * force * 15;
          p.alpha = Math.min(1, p.baseAlpha + 0.4 * (1 - dist / mouse.radius));
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.02;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.goldColor}${p.alpha})`;
        ctx.fill();

        // Connect nearby particles with geometric constellation lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pDx = p.x - p2.x;
          const pDy = p.y - p2.y;
          const pDist = Math.sqrt(pDx * pDx + pDy * pDy);

          const maxDist = 120;
          if (pDist < maxDist) {
            const lineAlpha = (1 - pDist / maxDist) * 0.12 * p.alpha;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(233, 184, 38, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
