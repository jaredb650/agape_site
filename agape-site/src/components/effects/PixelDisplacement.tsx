"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * WebGL mouse-reactive pixel displacement overlay.
 * Renders a canvas on top of its parent that smears/displaces the
 * underlying visual using a fragment shader driven by mouse position.
 * Disabled on mobile (< 768px) for performance.
 */

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  varying vec2 v_uv;
  uniform vec2 u_mouse;        // normalized mouse position (0..1)
  uniform vec2 u_resolution;   // canvas size in pixels
  uniform float u_time;
  uniform float u_intensity;   // mouse proximity intensity (0..1)
  uniform sampler2D u_texture;

  void main() {
    vec2 uv = v_uv;

    // Distance from mouse
    vec2 mouseUV = u_mouse;
    float dist = distance(uv, mouseUV);

    // Soft falloff — organic smeared shape, not a hard circle
    float radius = 0.18;
    float falloff = smoothstep(radius, 0.0, dist);

    // Displacement direction: radial push from mouse + subtle swirl
    vec2 dir = normalize(uv - mouseUV + 0.001);
    float angle = atan(dir.y, dir.x) + u_time * 0.3;
    vec2 swirl = vec2(cos(angle), sin(angle));

    // Combine radial + swirl for organic feel
    vec2 displacement = mix(dir, swirl, 0.3) * falloff * 0.04 * u_intensity;

    // Chromatic aberration — shift R, G, B channels differently
    float aberration = falloff * 0.008 * u_intensity;

    float r = texture2D(u_texture, uv + displacement + vec2(aberration, 0.0)).r;
    float g = texture2D(u_texture, uv + displacement).g;
    float b = texture2D(u_texture, uv + displacement - vec2(aberration, 0.0)).b;
    float a = texture2D(u_texture, uv + displacement).a;

    // Subtle scan lines for CRT feel
    float scanline = sin(uv.y * u_resolution.y * 1.5) * 0.03 * falloff * u_intensity;

    gl_FragColor = vec4(r + scanline, g, b - scanline, a);
  }
`;

interface PixelDisplacementProps {
  /** Source image URL to displace */
  src: string;
  alt?: string;
  className?: string;
  /** Displacement intensity multiplier (default 1.0) */
  intensity?: number;
}

export default function PixelDisplacement({
  src,
  alt = "",
  className = "",
  intensity = 1.0,
}: PixelDisplacementProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const intensityRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const initGL = useCallback(
    (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
      });
      if (!gl) return;
      glRef.current = gl;

      // Compile shaders
      const vs = gl.createShader(gl.VERTEX_SHADER)!;
      gl.shaderSource(vs, VERTEX_SHADER);
      gl.compileShader(vs);

      const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fs, FRAGMENT_SHADER);
      gl.compileShader(fs);

      const program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);
      programRef.current = program;

      // Full-screen quad
      const positions = new Float32Array([
        -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
      ]);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const aPos = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      // Texture from image
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      startTimeRef.current = Date.now();
    },
    []
  );

  // Render loop
  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;

    image.onload = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      initGL(canvas, image);

      const render = () => {
        const gl = glRef.current;
        const program = programRef.current;
        if (!gl || !program) return;

        // Smooth mouse interpolation (lerp)
        mouseRef.current.x +=
          (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
        mouseRef.current.y +=
          (targetMouseRef.current.y - mouseRef.current.y) * 0.08;

        // Intensity lerps toward target
        const isNear =
          Math.abs(targetMouseRef.current.x - 0.5) < 0.5 &&
          Math.abs(targetMouseRef.current.y - 0.5) < 0.5;
        const targetIntensity = isNear ? 1.0 : 0.0;
        intensityRef.current +=
          (targetIntensity - intensityRef.current) * 0.05;

        const time = (Date.now() - startTimeRef.current) / 1000;

        gl.viewport(0, 0, canvas.width, canvas.height);

        const uMouse = gl.getUniformLocation(program, "u_mouse");
        const uRes = gl.getUniformLocation(program, "u_resolution");
        const uTime = gl.getUniformLocation(program, "u_time");
        const uIntensity = gl.getUniformLocation(program, "u_intensity");

        gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, time);
        gl.uniform1f(uIntensity, intensityRef.current * intensity);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animRef.current = requestAnimationFrame(render);
      };

      animRef.current = requestAnimationFrame(render);
    };

    // Mouse tracking
    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseRef.current.x = (e.clientX - rect.left) / rect.width;
      targetMouseRef.current.y =
        1.0 - (e.clientY - rect.top) / rect.height; // flip Y for GL
    };

    const handleLeave = () => {
      targetMouseRef.current.x = 0.5;
      targetMouseRef.current.y = 0.5;
    };

    container.addEventListener("mousemove", handleMouse);
    container.addEventListener("mouseleave", handleLeave);

    // Resize
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      glRef.current?.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      container.removeEventListener("mousemove", handleMouse);
      container.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [src, isMobile, intensity, initGL]);

  // On mobile, just show the image
  if (isMobile) {
    return (
      <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Hidden image for fallback/SEO */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ visibility: "hidden" }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
