"use client";

import { useRef, useState } from "react";
import { Lightbulb, Workflow } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { B } from "@/lib/config";
import Reveal from "./Reveal";
import ProviderIcon, { type ProviderKind } from "./ProviderIcon";

const ROWS: [ProviderKind, string][][] = [
  [["book", "Text generation"], ["s", "Image generation"], ["knot", "Speech recognition"], ["grid", "Image classification"]],
  [["swirl", "Speech recognition"], ["m", "Text generation"], ["knot", "Speech recognition"], ["a", "Image generation"]],
  [["s", "Image generation"], ["grid", "Image classification"], ["swirl2", "Speech recognition"], ["book", "Text generation"]],
];

export default function UseAiFaster() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<"what" | "how">("what");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".ai-toggle", { opacity: 0, y: 16, duration: 0.8, scrollTrigger: { trigger: ".ai-toggle", start: "top 90%", once: true } });

      // Inner parallax of the promo image.
      gsap.fromTo(
        ".promo-art",
        { yPercent: -10 },
        { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".promo", start: "top bottom", end: "bottom top", scrub: true } },
      );

      gsap.from([".promo", ".info-card"], {
        y: 60,
        opacity: 0,
        scale: 0.96,
        stagger: 0.12,
        duration: 1,
        scrollTrigger: { trigger: ".ai-grid", start: "top 85%", once: true },
      });

      // Body text reveals line by line.
      gsap.from(".info-body .ln", {
        opacity: 0,
        y: 14,
        filter: "blur(4px)",
        stagger: 0.12,
        duration: 0.8,
        scrollTrigger: { trigger: ".info-body", start: "top 85%", once: true },
      });

      gsap.from(".chip-pill", {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.8)",
        stagger: { each: 0.05, from: "end" },
        scrollTrigger: { trigger: ".chips-wall", start: "top 90%", once: true },
      });

      // Each chip row drifts sideways (marquee feel).
      gsap.utils.toArray<HTMLElement>(".chip-row").forEach((row, i) => {
        gsap.to(row, { xPercent: i % 2 ? 6 : -6, duration: 7 + i, ease: "sine.inOut", repeat: -1, yoyo: true });
      });
    },
    { scope: root },
  );

  return (
    <section className="section sheet light about" data-theme="light" data-sheet-under ref={root} id="about">
      <div className="sheet-dim" aria-hidden="true" />
      <div className="container">
        <div className="ai-toggle" role="tablist" aria-label="About">
          <button type="button" role="tab" aria-selected={tab === "what"} className={tab === "what" ? "on" : ""} onClick={() => setTab("what")}>
            <Lightbulb size={14} /> What is?
          </button>
          <button type="button" role="tab" aria-selected={tab === "how"} className={tab === "how" ? "on" : ""} onClick={() => setTab("how")}>
            <Workflow size={14} /> How It Works?
          </button>
        </div>
        <Reveal className="h2 center" text={"Use AI faster and more\nefficiently right on your device!"} />

        <div className="ai-grid">
          <article className="promo">
            <div className="promo-art" aria-hidden="true">
              <span className="streak s1" />
              <span className="streak s2" />
              <span className="vline v1" />
              <span className="vline v2" />
              <span className="vline v3" />
              <span className="hline h1" />
              <span className="hline h2" />
              <span className="dots" />
            </div>
            <p className="promo-cap">
              Try {B} Inference At The Edge:
              <br />
              Speed Up Ai, Reduce Latency.
            </p>
          </article>

          <article className="info-card">
            {tab === "what" ? (
              <>
                <p className="info-lead">
                  {B} Inference at the Edge reduces the latency of your ML model output and improves the performance of
                  AI-enabled applications.
                </p>
                <p className="info-body">
                  <span className="ln">It’s particularly useful for AI apps that need immediate processing </span>
                  <span className="ln">and minimal delay, like generative AI and real-time object </span>
                  <span className="ln">detection.</span>
                </p>
              </>
            ) : (
              <>
                <p className="info-lead">
                  Deploy a pre-trained or custom model, and {B} runs it on the edge node closest to each of your users.
                </p>
                <p className="info-body">
                  <span className="ln">Requests are routed through our Smart Routing to the nearest GPU-powered </span>
                  <span className="ln">inference node, so responses arrive in milliseconds wherever </span>
                  <span className="ln">your users are.</span>
                </p>
              </>
            )}
            <div className="chips-wall" aria-label="Supported model types">
              {ROWS.map((row, i) => (
                <div className="chip-row" key={i}>
                  {row.map(([k, label], j) => (
                    <span className="chip-pill" key={j}>
                      <ProviderIcon kind={k} size={18} /> {label}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
