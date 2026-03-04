"use client";

import { useEffect, useRef } from "react";

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    // Size canvas to viewport — we use a smaller buffer and scale up for perf
    const GRAIN_SCALE = 2; // render at half res, scale 2x
    let w = 0;
    let h = 0;

    const resize = () => {
      w = Math.ceil(window.innerWidth / GRAIN_SCALE);
      h = Math.ceil(window.innerHeight / GRAIN_SCALE);
      canvas.width = w;
      canvas.height = h;
    };

    resize();
    window.addEventListener("resize", resize);

    // Pre-create ImageData for speed
    let imageData = ctx.createImageData(w, h);
    let data = imageData.data;

    let lastFrame = 0;
    const FPS_CAP = 12; // Grain doesn't need 60fps — 12fps gives filmic flicker
    const FRAME_DURATION = 1000 / FPS_CAP;

    const render = (timestamp: number) => {
      if (timestamp - lastFrame < FRAME_DURATION) {
        animRef.current = requestAnimationFrame(render);
        return;
      }
      lastFrame = timestamp;

      // Regenerate imageData if canvas resized
      if (imageData.width !== w || imageData.height !== h) {
        imageData = ctx.createImageData(w, h);
        data = imageData.data;
      }

      const len = w * h * 4;
      for (let i = 0; i < len; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="grain-overlay"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        imageRendering: "pixelated",
        mixBlendMode: "overlay",
        opacity: 0.05,
      }}
    />
  );
}
