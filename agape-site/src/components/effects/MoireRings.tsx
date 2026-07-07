"use client";

import { useEffect, useRef } from "react";

/* Interference-ring canvas — the festival logo's moiré motif, breathing
   slowly behind the hero wordmark. Two off-center ring sets drift in and
   out of phase; where they overlap the lines beat against each other.
   Cheap: one 2D canvas, ~90 strokes/frame, paused when off-screen. */
export default function MoireRings({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let running = true;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const spread = Math.min(w, h) * 0.16 + Math.sin(t * 0.00045) * 14;
      const maxR = Math.min(w, h) * 0.44;
      const rings = 26;
      const gap = maxR / rings;

      ctx.lineWidth = 1;
      for (const dir of [-1, 1]) {
        const ox = cx + dir * spread;
        const oy = cy + Math.sin(t * 0.0003 * dir) * 6;
        const phase = (t * 0.012 * dir) % gap;
        for (let i = 0; i < rings; i++) {
          const r = i * gap + ((phase % gap) + gap) % gap;
          if (r < 2) continue;
          const fade = 1 - r / maxR;
          if (fade <= 0) continue;
          ctx.strokeStyle = `rgba(240, 240, 240, ${0.045 * fade})`;
          ctx.beginPath();
          ctx.arc(ox, oy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      t += 16;
    };

    const loop = () => {
      if (!running) return;
      draw();
      if (!reduceMotion) raf = requestAnimationFrame(loop);
    };

    // Only animate while visible
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        running = true;
        loop();
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
