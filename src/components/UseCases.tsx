"use client";

import { useRef, type ReactNode } from "react";
import { Code2, MapPin, Plus, Send, Sparkles } from "lucide-react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { badgeIn, cardsIn } from "@/lib/hooks";
import Reveal from "./Reveal";

const ItIllo = () => (
  <div className="uc-it">
    <span className="uc-plus">
      <Plus size={12} />
    </span>
    <div className="uc-win">
      <div className="uc-msg uc-msg-l">
        <Sparkles size={11} /> How can I help?
      </div>
      <div className="uc-msg uc-msg-r">Generate a REST client</div>
      <div className="uc-msg uc-msg-l">
        <Code2 size={11} /> <span className="uc-typing" />
      </div>
    </div>
    <span className="uc-send">
      <Send size={12} />
    </span>
  </div>
);

const RetailIllo = () => (
  <div className="uc-retail">
    <div className="uc-card uc-card-1">
      <span className="uc-brand">CARD</span>
      <i />
    </div>
    <div className="uc-card uc-card-2">
      <span className="uc-circles">
        <i />
        <i />
      </span>
    </div>
    <div className="uc-card uc-card-3">
      <span className="uc-brand uc-brand-p">PAY</span>
    </div>
  </div>
);

const AutoIllo = () => (
  <div className="uc-auto">
    <svg viewBox="0 0 300 140" preserveAspectRatio="none" className="uc-roads">
      <path d="M0 110 C80 90 120 120 180 80 S260 30 300 40" />
      <path d="M40 0 C60 50 90 70 150 90 S240 130 260 140" />
    </svg>
    {[
      [22, 42],
      [52, 70],
      [78, 28],
    ].map(([x, y], i) => (
      <span className="uc-pin" key={i} style={{ left: `${x}%`, top: `${y}%` }}>
        <MapPin size={26} fill="#FF4F12" stroke="#fff" strokeWidth={1.5} />
      </span>
    ))}
  </div>
);

const GamingIllo = () => (
  <div className="uc-gaming">
    {[
      ["W", 46, 18],
      ["A", 36, 48],
      ["S", 52, 48],
      ["D", 68, 48],
      ["⌘", 62, 80],
    ].map(([k, x, y]) => (
      <span className="uc-key" key={k as string} style={{ left: `${x}%`, top: `${y}%` }}>
        {k}
      </span>
    ))}
  </div>
);

const HospIllo = () => (
  <div className="uc-hosp">
    <span className="uc-ring r1" />
    <span className="uc-ring r2" />
    <span className="uc-ring r3" />
    <span className="uc-core" />
  </div>
);

const MfgIllo = () => (
  <div className="uc-mfg">
    <span className="uc-br tl" />
    <span className="uc-br tr" />
    <span className="uc-br bl" />
    <span className="uc-br br" />
    <span className="uc-part" />
    <span className="uc-scan" />
  </div>
);

const CASES: { title: string; items: string[]; illo: ReactNode; key: string }[] = [
  {
    key: "it",
    title: "IT / Technology",
    items: ["Generative AI applications", "Chatbots and virtual assistants", "AI tools for software engineers", "Data augmentation"],
    illo: <ItIllo />,
  },
  {
    key: "retail",
    title: "Retail",
    items: [
      "Smart grocery with self-checkout and merchandising",
      "Real-time user behavior analysis and active feedback: content generation, predictions, recommendations",
    ],
    illo: <RetailIllo />,
  },
  {
    key: "auto",
    title: "Automotive",
    items: [
      "Fast response to changes in road conditions and incidents in self-driving vehicles",
      "Advanced driver assistants",
      "Vehicle personalization",
    ],
    illo: <AutoIllo />,
  },
  {
    key: "gaming",
    title: "Gaming",
    items: ["AI content and map generation", "AI bot real-time customization and conversation", "Real-time player analytics"],
    illo: <GamingIllo />,
  },
  {
    key: "hosp",
    title: "Hospitality",
    items: [
      "Personalized destination and accommodation recommendations",
      "Smart inventory management",
      "Efficiency improvements in areas like waste reduction and energy management",
    ],
    illo: <HospIllo />,
  },
  {
    key: "mfg",
    title: "Manufacturing",
    items: ["Real-time defect detection in production pipelines", "Rapid response feedback", "Quality control"],
    illo: <MfgIllo />,
  },
];

export default function UseCases() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      badgeIn(root.current!.querySelector(".badge"));
      cardsIn(root.current!, ".uc-cardbox", { y: 40, stagger: 0.12 });
      if (prefersReducedMotion()) return;

      const onEnter = (sel: string, fn: (el: HTMLElement) => void) => {
        const el = root.current!.querySelector<HTMLElement>(sel);
        if (el) ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => fn(el) });
      };

      onEnter(".uc-auto", (el) =>
        gsap.from(el.querySelectorAll(".uc-pin"), { y: -60, opacity: 0, duration: 0.9, ease: "bounce.out", stagger: 0.18 }),
      );
      onEnter(".uc-retail", (el) =>
        gsap.from(el.querySelectorAll(".uc-card"), { y: 40, rotation: -8, opacity: 0, duration: 0.9, stagger: 0.12, ease: "back.out(1.6)" }),
      );
      onEnter(".uc-gaming", (el) =>
        gsap.from(el.querySelectorAll(".uc-key"), { scale: 0, opacity: 0, duration: 0.6, stagger: 0.08, ease: "back.out(2)" }),
      );
      onEnter(".uc-it", (el) =>
        gsap.from(el.querySelectorAll(".uc-msg"), { x: -16, opacity: 0, duration: 0.6, stagger: 0.25 }),
      );
      onEnter(".uc-hosp", (el) => el.classList.add("play"));
      onEnter(".uc-mfg", (el) => el.classList.add("play"));
      gsap.to(".uc-key", { y: -5, duration: 1.6, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.2 });
    },
    { scope: root },
  );

  return (
    <section className="section light usecases" data-theme="light" data-sheet-under ref={root} id="use-cases">
      <div className="sheet-dim" aria-hidden="true" />
      <div className="container">
        <div className="center-col">
          <span className="badge badge-dark">
            <Sparkles size={12} className="badge-icon" /> Model Serving, Your Way
          </span>
          <Reveal className="h2 center" text={"A flexible solution\nfor diverse use cases"} />
        </div>
        <div className="uc-grid">
          {CASES.map((c) => (
            <article className="uc-cardbox" key={c.key}>
              <div className="uc-illo" aria-hidden="true">
                {c.illo}
              </div>
              <h3>{c.title}</h3>
              <ul>
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
