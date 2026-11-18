"use client";

import { useRef } from "react";
import { Sparkle } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/events";
import Reveal from "./Reveal";
import HeroCircuit from "./HeroCircuit";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = root.current!.querySelectorAll(".hero-title .wi");
      const fades = root.current!.querySelectorAll(".hero-badge, .hero-sub, .hero-ctas");
      gsap.set(words, { opacity: 0, y: 30, filter: "blur(10px)" });
      gsap.set(fades, { opacity: 0, y: 20 });

      // Element refs, not selector strings: this callback runs inside the preloader's GSAP context.
      const q = (s: string) => root.current!.querySelector(s);
      const [badge, sub, ctas] = [q(".hero-badge"), q(".hero-sub"), q(".hero-ctas")];
      onPreloaderDone(() => {
        const tl = gsap.timeline();
        tl.to(badge, { opacity: 1, y: 0, duration: 0.8 })
          .to(words, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.12, ease: "expo.out" }, "-=0.55")
          .to(sub, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
          .to(ctas, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7");
      });

      // Beam shimmer: opacity pulse + small translate loop.
      gsap.to(".hero-beam", { opacity: 0.65, x: -18, y: 10, duration: 2.6, ease: "sine.inOut", repeat: -1, yoyo: true });

      // Content parallax (moves up slower than the scroll).
      gsap.to(".hero-content", {
        yPercent: 35,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section className="section hero" data-theme="dark" data-sheet-under ref={root} id="top">
      <div className="sheet-dim" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-beam" aria-hidden="true">
        <span />
      </div>
      <div className="hero-content container">
        <span className="badge hero-badge">
          <Sparkle size={13} className="badge-icon" fill="currentColor" /> Beta release
        </span>
        <Reveal as="h1" mode="load" className="hero-title" text="Inference at the Edge" />
        <p className="hero-sub">
          Boost your AI application’s speed and efficiency globally by bringing inference closer to your users. Enjoy
          customization and cost-efficiency for a best-in-class inference experience.
        </p>
        <div className="hero-ctas">
          <a href="#pricing" className="btn btn-orange">
            Get started
          </a>
          <a href="#contact" className="btn btn-text">
            Book a demo
          </a>
        </div>
      </div>
      <HeroCircuit />
    </section>
  );
}
