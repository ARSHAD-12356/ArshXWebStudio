"use client";

import { useRef } from "react";
import { Aperture, Box, LayoutGrid, Sparkles, Triangle, Waves } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/events";
import AxMark from "./AxMark";

/** Left-side traces, drawn from the outer end towards the chip (viewBox 1440 × 420). Mirrored for the right. */
const LEFT_TRACES = [
  "M196 50 H240 L300 110 H590 L626 146 H660",
  "M70 200 H330 L400 130 H600 L628 158 H660",
  "M0 260 H340 L430 170 H660",
  "M0 300 H330 L448 182 H660",
  "M196 330 H340 L450 220 H630 L656 194 H660",
];
const BOTTOM_TRACES = ["M708 420 V232", "M720 420 V232", "M732 420 V232"];

/** Tiles: [x, y] in viewBox units, depth for parallax. */
const TILES = [
  { x: 140, y: 50, d: 18, Icon: Triangle },
  { x: 40, y: 200, d: 26, Icon: Waves, small: true },
  { x: 140, y: 330, d: 12, Icon: Box },
  { x: 1300, y: 50, d: 20, Icon: Sparkles },
  { x: 1400, y: 200, d: 26, Icon: LayoutGrid, small: true },
  { x: 1300, y: 330, d: 14, Icon: Aperture },
];

export default function HeroCircuit() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Light pulses travelling along the traces towards the chip. Each pulse is a glow + core
      // stroke pair (no SVG blur filter: re-blurring the circuit every frame made the page-open lag).
      // They stay paused while the preloader covers the page and switch on as it opens.
      const pulses = gsap.utils.toArray<SVGGElement>(".pulse-pair", root.current).map((pair) =>
        gsap.fromTo(
          pair.children,
          { strokeDashoffset: 80 },
          {
            strokeDashoffset: -1000,
            duration: gsap.utils.random(1.6, 2.8),
            ease: "none",
            repeat: -1,
            repeatDelay: gsap.utils.random(0.2, 1.6),
            paused: true,
          },
        ),
      );
      const chipIn = gsap.from(root.current!.querySelector(".chip"), {
        scale: 0.85,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        paused: true,
      });
      const stopWaiting = onPreloaderDone(() => {
        chipIn.play();
        pulses.forEach((t) => gsap.delayedCall(gsap.utils.random(0.2, 2.2), () => t.play()));
      });

      // Floating tiles (sine loop, different phases) + mouse parallax per depth.
      const tiles = gsap.utils.toArray<HTMLElement>(".tile");
      tiles.forEach((t, i) => {
        gsap.to(t.querySelector(".tile-in"), {
          y: i % 2 ? 6 : -6,
          duration: 3 + (i % 3) * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        });
      });
      const movers = tiles.map((t) => ({
        x: gsap.quickTo(t, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(t, "y", { duration: 1.2, ease: "power3.out" }),
        d: Number(t.dataset.depth),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * m.d);
          m.y(ny * m.d);
        });
      };
      window.addEventListener("pointermove", onMove);

      // Scroll depth: tiles drift at different speeds.
      tiles.forEach((t) => {
        gsap.to(t, {
          yPercent: -Number(t.dataset.depth) * 4,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom top", scrub: true },
        });
      });

      return () => {
        stopWaiting();
        window.removeEventListener("pointermove", onMove);
      };
    },
    { scope: root },
  );

  const traces = (
    <>
      {LEFT_TRACES.map((d, i) => (
        <path key={`t${i}`} d={d} className="trace" />
      ))}
      {LEFT_TRACES.map((d, i) => (
        <g key={`p${i}`} className="pulse-pair">
          <path d={d} className="pulse-glow" pathLength={1000} />
          <path d={d} className="pulse" pathLength={1000} />
        </g>
      ))}
    </>
  );

  return (
    <div className="circuit" ref={root} aria-hidden="true">
      <svg className="circuit-svg" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMid meet">
        <g>{traces}</g>
        <g transform="translate(1440 0) scale(-1 1)">{traces}</g>
        {BOTTOM_TRACES.map((d, i) => (
          <path key={`b${i}`} d={d} className="trace" />
        ))}
        {BOTTOM_TRACES.map((d, i) => (
          <g key={`bp${i}`} className="pulse-pair">
            <path d={d} className="pulse-glow" pathLength={1000} />
            <path d={d} className="pulse" pathLength={1000} />
          </g>
        ))}
        {/* chip pins */}
        {[146, 158, 170, 182, 194].map((y) => (
          <g key={y}>
            <rect x="648" y={y - 2.5} width="14" height="5" rx="2" className="pin" />
            <rect x="778" y={y - 2.5} width="14" height="5" rx="2" className="pin" />
          </g>
        ))}
        {[708, 720, 732].map((x) => (
          <rect key={x} x={x - 2.5} y="226" width="5" height="14" rx="2" className="pin" />
        ))}
      </svg>
      <div className="chip" style={{ left: "50%", top: `${(170 / 420) * 100}%` }}>
        <AxMark className="chip-mark" idPrefix="axChip" />
      </div>
      {TILES.map(({ x, y, d, Icon, small }, i) => (
        <div
          key={i}
          className={`tile ${small ? "tile-sm" : ""}`}
          data-depth={d}
          style={{ left: `${(x / 1440) * 100}%`, top: `${(y / 420) * 100}%` }}
        >
          <div className="tile-in">
            <Icon size={small ? 18 : 24} strokeWidth={2.2} />
          </div>
        </div>
      ))}
    </div>
  );
}
