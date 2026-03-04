"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Ashima Arts simplex noise (GLSL) ── */
const snoise3D = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */ `
${snoise3D}
uniform float uTime;
uniform float uScroll;

void main() {
  vec3 pos = position;
  vec3 dir = normalize(pos);

  // Multi-octave noise — organic surface morphing
  float n1 = snoise(pos * 0.7 + uTime * 0.12) * 0.22;
  float n2 = snoise(pos * 1.4 + uTime * 0.08 + vec3(uScroll * 0.0004)) * 0.10;
  float n3 = snoise(pos * 2.8 + uTime * 0.18) * 0.05;

  pos += dir * (n1 + n2 + n3);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const fragmentShader = /* glsl */ `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.09);
}`;

/* ──────────────────────────────────────────────
   Dense interlocking-ring wireform
   60 great-circles on a sphere → GPU noise morph
   ────────────────────────────────────────────── */
function Wireform() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const scrollRef = useRef(0);
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const mouseTarget = useRef({ x: 0, y: 0 });

  /* Build geometry: many great circles evenly distributed */
  const geometry = useMemo(() => {
    const verts: number[] = [];
    const NUM_RINGS = 60;
    const PTS = 180;
    const R = 2.8;

    for (let r = 0; r < NUM_RINGS; r++) {
      // Fibonacci-sphere distribution for even spacing
      const phi = Math.acos(1 - 2 * (r + 0.5) / NUM_RINGS);
      const theta = Math.PI * (1 + Math.sqrt(5)) * r;

      // Ring normal
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);

      // Build orthonormal basis in ring plane
      let ux: number, uy: number, uz: number;
      if (Math.abs(ny) < 0.9) {
        ux = nz; uy = 0; uz = -nx;
      } else {
        ux = 0; uy = -nz; uz = ny;
      }
      const len = Math.sqrt(ux * ux + uy * uy + uz * uz);
      ux /= len; uy /= len; uz /= len;

      // v = normal × u
      const vx = ny * uz - nz * uy;
      const vy = nz * ux - nx * uz;
      const vz = nx * uy - ny * ux;

      // Generate line-segment pairs around the circle
      for (let p = 0; p < PTS; p++) {
        const a1 = (p / PTS) * Math.PI * 2;
        const a2 = ((p + 1) / PTS) * Math.PI * 2;
        const c1 = Math.cos(a1), s1 = Math.sin(a1);
        const c2 = Math.cos(a2), s2 = Math.sin(a2);

        verts.push(
          R * (c1 * ux + s1 * vx),
          R * (c1 * uy + s1 * vy),
          R * (c1 * uz + s1 * vz),
          R * (c2 * ux + s2 * vx),
          R * (c2 * uy + s2 * vy),
          R * (c2 * uz + s2 * vz),
        );
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, []);

  /* Listeners */
  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    const onMouse = (e: MouseEvent) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  /* Animate */
  useFrame(({ clock }) => {
    if (!groupRef.current || !matRef.current) return;
    const t = clock.elapsedTime;
    const scroll = scrollRef.current;

    // Smooth mouse
    mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * 0.03;
    mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * 0.03;

    // Scroll + time + mouse → rotation
    const sr = scroll * 0.0006;
    groupRef.current.rotation.x = sr * 0.5 + t * 0.015 + mouseSmooth.current.y * 0.12;
    groupRef.current.rotation.y = sr + t * 0.025 + mouseSmooth.current.x * 0.15;
    groupRef.current.rotation.z = sr * 0.3 + t * 0.008;

    // Uniforms
    matRef.current.uniforms.uTime.value = t;
    matRef.current.uniforms.uScroll.value = scroll;
  });

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScroll: { value: 0 } }),
    [],
  );

  return (
    <group ref={groupRef} scale={[1.15, 0.95, 1.0]}>
      <lineSegments geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
        />
      </lineSegments>
    </group>
  );
}

/* ──────────────────────────────────────────────
   Fixed Canvas Wrapper (desktop only)
   ────────────────────────────────────────────── */
export default function ParallaxField() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.innerWidth >= 768);
    const onResize = () => setEnabled(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Wireform />
      </Canvas>
    </div>
  );
}
