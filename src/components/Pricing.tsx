"use client";

import { useRef, useState } from "react";
import { CircleGauge, Cpu, Info, MemoryStick, Sparkles } from "lucide-react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Reveal from "./Reveal";

type Plan = { name: string; price: number; specs: string[]; featured?: boolean };

const PLANS: Plan[] = [
  { name: "1× NVIDIA L40S GPU", price: 2.4, specs: ["16vCPU memory", "48GB GPU memory", "232GB RAM", "4B–21B parameters"] },
  { name: "2× NVIDIA L40S GPU", price: 9.3, specs: ["96GB GPU memory", "32vCPU", "464GB RAM", "21B–41B parameters"], featured: true },
  { name: "2× NVIDIA L40S GPU", price: 4.7, specs: ["192GB GPU memory", "64vCPU", "928GB RAM", "41B–70B parameters"] },
];
const ICONS = [Cpu, CircleGauge, MemoryStick, Sparkles];
const USD_RATE = 1.08;

export default function Pricing() {
  const root = useRef<HTMLElement>(null);
  const [cur, setCur] = useState<"EUR" | "USD">("EUR");
  const counted = useRef(false);

  const fmt = (v: number) => `${cur === "EUR" ? "€" : "$"}${(cur === "EUR" ? v : v * USD_RATE).toFixed(2)}`;

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".price-card");
      if (prefersReducedMotion()) {
        counted.current = true;
        root.current!.querySelectorAll<HTMLElement>(".price-num").forEach((el, i) => (el.textContent = fmt(PLANS[i].price)));
        return;
      }
      gsap.from(".cur-toggle", { opacity: 0, y: 16, duration: 0.8, scrollTrigger: { trigger: ".cur-toggle", start: "top 90%", once: true } });
      gsap.set(cards, { opacity: 0, y: 80 });
      ScrollTrigger.create({
        trigger: ".price-grid",
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(cards, { opacity: 1, y: (i) => (i === 2 ? 22 : 0), duration: 1.1, stagger: 0.14, ease: "power3.out" });
          // Prices count up from 0.
          root.current!.querySelectorAll<HTMLElement>(".price-num").forEach((el, i) => {
            const o = { v: 0 };
            gsap.to(o, {
              v: PLANS[i].price,
              duration: 1.4,
              ease: "power2.out",
              delay: 0.2 + i * 0.14,
              onUpdate: () => {
                el.textContent = fmt(o.v);
              },
              onComplete: () => {
                counted.current = true;
              },
            });
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <section className="section sheet dark pricing" data-theme="dark" ref={root} id="pricing">
      <div className="container">
        <div className="center-col">
          <div className="cur-toggle" role="radiogroup" aria-label="Currency">
            {(["EUR", "USD"] as const).map((c) => (
              <button type="button" role="radio" aria-checked={cur === c} key={c} className={cur === c ? "on" : ""} onClick={() => setCur(c)}>
                {c === "EUR" ? "€" : "$"}
              </button>
            ))}
          </div>
          <Reveal className="h2 center" text={"Use dedicated GPUs to scale custom\nmodels and production apps"} />
        </div>

        <div className="price-grid">
          {PLANS.map((p, i) => (
            <article className={`price-card ${p.featured ? "featured" : ""}`} key={i}>
              {p.featured && <span className="price-edge" aria-hidden="true" />}
              <h3>{p.name}</h3>
              <p className="price">
                <span className="price-num">{counted.current ? fmt(p.price) : fmt(0)}</span>
                <span className="price-per"> / month</span>
              </p>
              <ul>
                {p.specs.map((s, j) => {
                  const Icon = ICONS[j];
                  return (
                    <li key={s}>
                      <Icon size={15} /> {s}
                      {j === 3 && (
                        <span className="tip" tabIndex={0} aria-label="Recommended model size">
                          <Info size={13} />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <a href="#contact" className={`btn ${p.featured ? "btn-orange" : "btn-dark"} btn-block`}>
                Order Now
              </a>
            </article>
          ))}
        </div>
        <p className="price-note">
          During the early beta period, Inference at the Edge is free until general availability. We recommend that
          <br />
          you don’t use it for mission-critical tasks or production environments.
        </p>
      </div>
    </section>
  );
}
