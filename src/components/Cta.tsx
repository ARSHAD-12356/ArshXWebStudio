"use client";

import { useRef } from "react";
import { gsap, isMobile, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { B } from "@/lib/config";
import Reveal from "./Reveal";

export default function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = root.current!.querySelectorAll(".cta-title .wi");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: isMobile() ? "+=100%" : "+=160%",
          pin: true,
          scrub: 0.8,
        },
      });
      tl.fromTo(".cta-glow", { yPercent: 45, scale: 0.9, opacity: 0.55 }, { yPercent: 0, scale: 1.15, opacity: 1, ease: "none", duration: 1 }, 0)
        .fromTo(words, { opacity: 0.18, filter: "blur(4px)" }, { opacity: 1, filter: "blur(0px)", stagger: 0.05, ease: "none", duration: 0.5 }, 0)
        .fromTo([".cta-sub", ".cta-btn"], { opacity: 0.2, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, ease: "none", duration: 0.4 }, 0.3)
        // Panel shrinks into a rounded card.
        .to(".cta-panel", { scale: 0.86, borderRadius: 32, ease: "power1.inOut", duration: 0.7 }, 1.0);
    },
    { scope: root },
  );

  return (
    <section className="section dark cta" data-theme="dark" ref={root} id="contact">
      <div className="cta-panel">
        <div className="cta-glow" aria-hidden="true" />
        <div className="cta-content">
          <Reveal className="h2 center cta-title" mode="none" text="Contact us to discuss your project" />
          <p className="cta-sub">
            Get in touch with us, and we’ll guide you through running your ML model on {B} Inference at the Edge. Together,
            we’ll explore how our service can benefit your end users.
          </p>
          <a href="mailto:sales@example.com" className="btn btn-white cta-btn">
            Talk to an expert
          </a>
        </div>
      </div>
    </section>
  );
}
