"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { emitPreloaderDone } from "@/lib/events";
import { lockScroll } from "@/lib/lenis";
import { CONFIG } from "@/lib/config";
import { GMark } from "./BrandMark";

/**
 * 0–2.7 s intro: dot → radio button → "G" mark → wordmark letters → scale-up → dark curtain.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const finish = () => {
        lockScroll(false);
        gsap.set(el, { autoAlpha: 0, display: "none" });
        emitPreloaderDone();
        ScrollTrigger.refresh();
      };

      if (prefersReducedMotion()) {
        finish();
        return;
      }
      lockScroll(true);

      const logo = el.querySelector<HTMLElement>(".pl-logo")!;
      const word = el.querySelector<HTMLElement>(".pl-word")!;
      const letters = el.querySelectorAll(".pl-letter");
      const shift = (word.offsetWidth + 14) / 2;

      gsap.set(logo, { x: shift });
      gsap.set(".pl-g", { autoAlpha: 0, rotation: -90, transformOrigin: "50% 50%" });
      gsap.set(".pl-dot", { scale: 0, svgOrigin: "24 24" });
      gsap.set(".pl-ring", { scale: 0.4, opacity: 0, svgOrigin: "24 24" });
      gsap.set(letters, { opacity: 0, x: 20, filter: "blur(8px)" });
      gsap.set(".pl-curtain", { clipPath: "inset(100% 0% 0% 0%)" });

      const tl = gsap.timeline({ delay: 0.25, onComplete: finish });
      tl.to(".pl-dot", { scale: 1, duration: 0.5, ease: "back.out(2.2)" })
        .to(".pl-ring", { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }, "-=0.25")
        .to(".pl-radio", { rotation: 90, autoAlpha: 0, duration: 0.45, ease: "power3.inOut", transformOrigin: "50% 50%" }, "+=0.15")
        .to(".pl-g", { rotation: 0, autoAlpha: 1, duration: 0.5, ease: "power3.inOut" }, "<0.05")
        .to(logo, { x: 0, duration: 0.7, ease: "power3.inOut" }, "+=0.05")
        .to(letters, { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.08, ease: "power3.out" }, "<0.1")
        .to(".pl-stage", { scale: 1.6, duration: 0.7, ease: "power3.inOut" }, "-=0.2")
        .to(".pl-curtain", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" }, "-=0.25")
        .to(el, { autoAlpha: 0, duration: 0.35, ease: "power1.out" });
    },
    { scope: root },
  );

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pl-stage">
        <div className="pl-logo">
          <div className="pl-markwrap">
            <svg className="pl-radio" viewBox="0 0 48 48">
              <circle className="pl-ring" cx="24" cy="24" r="17" fill="none" stroke="#fff" strokeWidth="4" />
              <circle className="pl-dot" cx="24" cy="24" r="8" fill="#fff" />
            </svg>
            <GMark className="pl-g" />
          </div>
          <div className="pl-word">
            {CONFIG.BRAND.split("").map((l, i) => (
              <span className="pl-letter" key={i}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="pl-curtain" />
    </div>
  );
}
