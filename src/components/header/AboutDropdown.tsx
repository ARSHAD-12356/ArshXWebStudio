"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { NAV } from "@/data/navigation";
import { ICONS } from "./icons";

export type AboutHandle = { focusFirst: () => void; el: HTMLDivElement | null };

type Props = {
  open: boolean;
  top: number;
  left: number;
  notchX: number;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

/** Compact glass card under "About" (same style as the mega menu, static gradient border). */
const AboutDropdown = forwardRef<AboutHandle, Props>(function AboutDropdown({ open, top, left, notchX, onPointerEnter, onPointerLeave }, ref) {
  const root = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    focusFirst: () => root.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
    get el() {
      return root.current;
    },
  }));

  useGSAP(
    () => {
      const el = root.current!;
      const shell = el.querySelector(".ab-shell");
      const reduced = prefersReducedMotion();
      gsap.killTweensOf([el, shell]);
      if (open) {
        gsap.set(el, { autoAlpha: 1 });
        if (reduced) {
          gsap.fromTo(shell, { opacity: 0 }, { opacity: 1, duration: 0.15 });
          return;
        }
        gsap.fromTo(
          shell,
          { opacity: 0, y: -12, scale: 0.98, clipPath: "inset(0% 0% 100% 0% round 22px)" },
          { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 22px)", duration: 0.4, ease: "power3.out", clearProps: "clipPath" },
        );
        gsap.fromTo(".ab-item", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, delay: 0.12, ease: "power3.out" });
      } else {
        if (reduced) {
          gsap.to(el, { autoAlpha: 0, duration: 0.15 });
          return;
        }
        gsap.to(shell, { opacity: 0, y: -8, duration: 0.25, ease: "power2.in" });
        gsap.to(el, { autoAlpha: 0, duration: 0.01, delay: 0.25 });
      }
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <div
      ref={root}
      id="menu-about"
      className="ab"
      role="region"
      aria-label="About menu"
      style={{ top, left, visibility: "hidden", opacity: 0 }}
      inert={!open}
      onPointerEnter={(e) => e.pointerType === "mouse" && onPointerEnter()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onPointerLeave()}
    >
      <div className="ab-shell">
        <span className="mm-notch" style={{ left: notchX }} aria-hidden="true" />
        <ul className="ab-inner">
          {NAV.about.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.title}>
                <a href={item.href} className="ab-item">
                  <span className="mm-card-ico">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <span>
                    <b>{item.title}</b>
                    <small>{item.desc}</small>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

export default AboutDropdown;
