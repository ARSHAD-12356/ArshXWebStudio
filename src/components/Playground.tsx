"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, AudioLines, Image as ImageIcon, ScanFace, Type, Zap } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { B } from "@/lib/config";
import Reveal from "./Reveal";
import ProviderIcon, { type ProviderKind } from "./ProviderIcon";

const ICONS: ProviderKind[] = ["s", "swirl", "knot", "m", "grid", "a", "swirl2", "book"];
const HINT = "A white rabbit on a black Harley Davidson riding down a desert road";
const OPTIONS = [
  { title: "Text Generate", Icon: Type, tone: "green" },
  { title: "Generate Image", Icon: ImageIcon, tone: "yellow" },
  { title: "Avatar Generate", Icon: ScanFace, tone: "blue" },
  { title: "Speech recognition", Icon: AudioLines, tone: "pink" },
];
const PROMPTS = [
  HINT,
  "Summarise this support ticket in two sentences",
  "A neon city skyline reflected in a rainy street",
  "Transcribe the attached meeting recording",
];

function useTypewriter(active: boolean) {
  const [text, setText] = useState(HINT);
  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    let i = 0;
    let c = 0;
    let deleting = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const full = PROMPTS[i];
      if (!deleting) {
        c++;
        setText(full.slice(0, c));
        if (c === full.length) {
          deleting = true;
          t = setTimeout(tick, 2200);
          return;
        }
        t = setTimeout(tick, 42);
      } else {
        c--;
        setText(full.slice(0, c));
        if (c === 0) {
          deleting = false;
          i = (i + 1) % PROMPTS.length;
        }
        t = setTimeout(tick, 18);
      }
    };
    c = 0;
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [active]);
  return text;
}

export default function Playground() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [value, setValue] = useState("");
  const [inView, setInView] = useState(false);
  const placeholder = useTypewriter(inView && value === "");

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(root.current!.querySelector(".pg-card")!);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".pg-sub", { opacity: 0, y: 16, duration: 0.8, scrollTrigger: { trigger: ".pg-sub", start: "top 90%", once: true } });
      gsap.from(".pg-icon", {
        opacity: 0,
        y: 20,
        scale: 0.8,
        stagger: 0.06,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".pg-icons", start: "top 90%", once: true },
      });
      gsap.to(".pg-icons-track", { xPercent: -50, duration: 26, ease: "none", repeat: -1 });

      // Big card rises and scales in while the icon row scrolls up past it.
      gsap.fromTo(
        ".pg-card",
        { y: 150, scale: 0.9 },
        { y: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ".pg-card", start: "top 100%", end: "top 30%", scrub: 0.6 } },
      );
      gsap.to(".pg-top", {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: ".pg-card", start: "top 90%", end: "top 10%", scrub: true },
      });
      gsap.from(".pg-option", {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.7,
        scrollTrigger: { trigger: ".pg-options", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section className="section sheet light playground" data-theme="light" ref={root} id="playground">
      <div className="pg-bg" aria-hidden="true" />
      <div className="container">
        <div className="pg-top">
          <Reveal className="h2 center" text="Experience it now" />
          <p className="pg-sub">Try {B} Inference at the Edge’s powerful AI playground</p>
          <div className="pg-icons" aria-hidden="true">
            <div className="pg-icons-track">
              {[...ICONS, ...ICONS, ...ICONS, ...ICONS].map((k, i) => (
                <span className="pg-icon" key={i}>
                  <ProviderIcon kind={k} size={22} />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pg-card">
          <div className="pg-hero">
            <div className="pg-semi" aria-hidden="true" />
            <span className="pg-bolt">
              <Zap size={18} fill="currentColor" />
            </span>
            <h3>Discover the AI Realm</h3>
          </div>
          <div className="pg-options" role="radiogroup" aria-label="Playground mode">
            {OPTIONS.map(({ title, Icon, tone }, i) => (
              <button
                type="button"
                role="radio"
                aria-checked={active === i}
                className={`pg-option ${active === i ? "on" : ""}`}
                key={title}
                onClick={() => setActive(i)}
              >
                <span className={`pg-ico tone-${tone}`}>
                  <Icon size={16} />
                </span>
                <span>
                  <b>{title}</b>
                  <small>{HINT}</small>
                </span>
              </button>
            ))}
          </div>
          <form
            className="pg-input"
            onSubmit={(e) => {
              e.preventDefault();
              setValue("");
            }}
          >
            <label htmlFor="pg-prompt" className="sr-only">
              Prompt
            </label>
            <input id="pg-prompt" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} autoComplete="off" />
            <button type="submit" aria-label="Send prompt">
              <ArrowUp size={18} />
            </button>
          </form>
          <p className="pg-note">Free Research Preview. May produce inaccurate information about people, places, or facts.</p>
        </div>
      </div>
    </section>
  );
}
