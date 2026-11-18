"use client";

import { useEffect, useRef } from "react";
import { Globe2 } from "lucide-react";
import { gsap, isMobile, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { createGlobe } from "@/lib/globe";
import { B } from "@/lib/config";
import Reveal from "./Reveal";

/** Twinkling star field on a canvas. */
function useStars(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduced = prefersReducedMotion();
    let raf = 0;
    let stars: { x: number; y: number; r: number; p: number; s: number }[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.offsetWidth * dpr;
      c.height = c.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((c.offsetWidth * c.offsetHeight) / 9000);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * c.offsetWidth,
        y: Math.random() * c.offsetHeight,
        r: Math.random() * 1.1 + 0.3,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * 1.5 + 0.5,
      }));
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight);
      ctx.fillStyle = "#fff";
      for (const st of stars) {
        ctx.globalAlpha = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t / 1000 * st.s + st.p));
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [ref]);
}

export default function GlobalNetwork() {
  const root = useRef<HTMLElement>(null);
  const globe = useRef<HTMLCanvasElement>(null);
  const stars = useRef<HTMLCanvasElement>(null);
  useStars(stars);

  useEffect(
    () =>
      createGlobe(globe.current!, {
        step: 2.2,
        dotColor: "#e9e4f2",
        dotSize: 4.2,
        radius: 0.96,
        speed: 0.08,
        tilt: 0.42,
        rotation: 0.6,
        sphere: ["#2a1424", "#120a10"],
      }),
    [],
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: isMobile() ? "+=90%" : "+=150%",
          pin: true,
          scrub: 0.8,
        },
      });
      tl.fromTo(".globe-wrap", { yPercent: 62, scale: 0.8 }, { yPercent: 8, scale: 1.3, ease: "none" }, 0)
        .to(".gn-head", { yPercent: -60, opacity: 0, ease: "none" }, 0.25)
        .fromTo(".globe-rim", { opacity: 0.7 }, { opacity: 1, ease: "none" }, 0);
    },
    { scope: root },
  );

  return (
    <section className="section dark global" data-theme="dark" ref={root} id="network">
      <canvas className="stars" ref={stars} aria-hidden="true" />
      <div className="gn-head container">
        <span className="badge">
          <Globe2 size={12} className="badge-icon" /> Global Network
        </span>
        <Reveal className="h2 center" text={"A truly global network\nfor lightning-fast inference"} start="top 85%" end="top 30%" />
        <p className="gn-sub">
          {B} global network consists of more than 160 locations,
          <br />
          allowing you to reach your users anywhere in the world
        </p>
      </div>
      <div className="globe-wrap" aria-hidden="true">
        <div className="globe-rim" />
        <canvas ref={globe} className="globe-canvas" />
      </div>
    </section>
  );
}
