"use client";

import { useEffect, useRef } from "react";
import { Bot, Cpu, Database, Image as ImageIcon, Layers, MessageSquare, Mic, Zap } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { badgeIn, cardsIn, cursorGlow } from "@/lib/hooks";
import { createGlobe } from "@/lib/globe";
import { cssVar } from "@/lib/theme";
import { B } from "@/lib/config";
import Reveal from "./Reveal";

function GlobeVisual() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(
    () =>
      createGlobe(ref.current!, {
        step: 2.4,
        dotColor: cssVar("--globe-dot-dim", "#4f5f80"),
        dotSize: 2.6,
        radius: 0.92,
        speed: 0.12,
        tilt: 0.35,
        rotation: -0.4,
        sphere: [cssVar("--globe-core-dim", "#0c1630"), cssVar("--globe-edge", "#030a1e")],
        cities: 14,
        cityColor: cssVar("--ax-cyan", "#00d8fd"),
      }),
    [],
  );
  return (
    <div className="v-globe" aria-hidden="true">
      <svg className="v-globe-arcs" viewBox="0 0 700 300" preserveAspectRatio="none">
        <ellipse cx="350" cy="260" rx="340" ry="80" />
        <ellipse cx="350" cy="260" rx="300" ry="120" />
        <ellipse cx="350" cy="260" rx="360" ry="40" />
      </svg>
      <canvas ref={ref} />
    </div>
  );
}

function EndpointVisual() {
  return (
    <div className="v-endpoint" aria-hidden="true">
      <svg viewBox="0 0 400 220" className="v-endpoint-svg">
        <path d="M200 80 C150 80 120 60 70 60" />
        <path d="M200 80 C250 80 280 60 330 60" />
        <path d="M200 95 C175 120 160 130 140 130" />
        <path d="M200 95 C225 120 240 130 260 130" />
        <path d="M0 40 H120 L150 70" className="faint" />
        <path d="M400 40 H280 L250 70" className="faint" />
      </svg>
      <span className="v-beam" />
      <span className="v-beam v-beam-2" />
      <div className="v-chip">AI</div>
      {[
        { x: 17.5, y: 27, I: Bot },
        { x: 82.5, y: 27, I: MessageSquare },
        { x: 35, y: 59, I: Mic },
        { x: 65, y: 59, I: ImageIcon },
      ].map(({ x, y, I }, i) => (
        <span className="v-node" key={i} style={{ left: `${x}%`, top: `${y}%` }}>
          <I size={14} />
        </span>
      ))}
    </div>
  );
}

function PrivacyVisual() {
  return (
    <div className="v-privacy" aria-hidden="true">
      <div className="v-sphere">
        <span className="v-orbit">
          <i />
          <i />
        </span>
        <Zap size={34} className="v-zap" />
      </div>
    </div>
  );
}

function StorageVisual() {
  return (
    <div className="v-storage" aria-hidden="true">
      <div className="v-cubes">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="v-cube" />
        ))}
        <span className="v-cube v-cube-hot">
          <Layers size={22} />
        </span>
      </div>
    </div>
  );
}

function ModelsVisual() {
  return (
    <div className="v-models" aria-hidden="true">
      <span className="v-link" />
      <div className="v-pill v-pill-1">
        <span className="v-ai">AI</span> {B} ML Model Hub
      </div>
      <div className="v-pill v-pill-2">
        <span className="v-ico">
          <Database size={13} />
        </span>
        Data collection and training
      </div>
      <div className="v-pill v-pill-3">
        <span className="v-ico">
          <Cpu size={13} />
        </span>
        Your custom model
      </div>
    </div>
  );
}

const AUTOSCALE = [
  "M0 70 H220 L250 100 H520 L540 80 H700",
  "M0 120 H180 L200 140 H470 L500 110 H700",
  "M0 170 H260 L280 150 H560 L590 180 H700",
  "M0 210 H320 L340 190 H700",
];

function AutoscaleVisual() {
  return (
    <div className="v-autoscale" aria-hidden="true">
      <svg viewBox="0 0 700 240" preserveAspectRatio="none">
        {AUTOSCALE.map((d, i) => (
          <path key={i} d={d} className="trace" />
        ))}
        {AUTOSCALE.map((d, i) => (
          <g key={`p${i}`} className="pulse-pair pulse-h">
            <path d={d} className="pulse-glow" pathLength={1000} />
            <path d={d} className="pulse" pathLength={1000} />
          </g>
        ))}
        <g className="v-ticks">
          {Array.from({ length: 18 }).map((_, i) => (
            <rect key={i} x={400 + i * 9} y="62" width="4" height="14" rx="1" />
          ))}
        </g>
      </svg>
    </div>
  );
}

function GpuVisual() {
  return (
    <div className="v-gpu" aria-hidden="true">
      <div className="v-code">
        <div className="v-code-bar">
          <i />
          <i />
          <i />
        </div>
        <pre>
          <span className="c-k">class</span> nvidiaL40S_gpu:{"\n"}
          {"  "}
          <span className="c-o">def</span> __init__(self, model_name, size):{"\n"}
          {"    "}self.model = model_name{"\n"}
          {"    "}self.vram_size = size{"\n"}
          {"    "}self.status = <span className="c-s">&quot;ready&quot;</span>
          {"\n"}
          {"  "}
          <span className="c-o">def</span> infer(self, prompt):{"\n"}
          {"    "}
          <span className="c-k">return</span> self.model(prompt)
        </pre>
      </div>
      <div className="v-gpu-chip">
        <Cpu size={40} strokeWidth={1.6} />
        <span>GPU</span>
      </div>
    </div>
  );
}

export default function Benefits() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      badgeIn(root.current!.querySelector(".badge"));
      cardsIn(root.current!, ".bento-card");
      const off = cursorGlow(root);
      if (prefersReducedMotion()) return off;

      // Heading drifts down while the grid scrolls past (heading appears to stay behind).
      gsap.to(".benefits-head", {
        y: 120,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Storage: orange cube hops between cells.
      const hot = root.current!.querySelector<HTMLElement>(".v-cube-hot")!;
      const steps = [
        [2, 1],
        [1, 1],
        [1, 0],
        [3, 0],
        [3, 2],
        [2, 1],
      ];
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      steps.forEach(([c, r]) => tl.to(hot, { xPercent: c * 112.5, yPercent: r * 112.5, duration: 0.7, ease: "power3.inOut" }, "+=0.6"));
      gsap.set(hot, { xPercent: 225, yPercent: 112.5 });

      // Models: pills light on in sequence.
      gsap.from(".v-pill", {
        opacity: 0,
        x: 30,
        stagger: 0.25,
        duration: 0.8,
        scrollTrigger: { trigger: ".v-models", start: "top 85%", once: true },
      });
      gsap.fromTo(".v-link", { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: "power2.inOut", scrollTrigger: { trigger: ".v-models", start: "top 80%", once: true } });

      // Endpoint: light beam drops into the chip.
      gsap.fromTo(".v-beam", { y: -60, opacity: 0 }, { y: 30, opacity: 1, duration: 1.6, ease: "power2.in", repeat: -1, repeatDelay: 0.8, stagger: 0.8 });

      // Pulses along PCB lines (left → right) and on the endpoint card.
      root.current!.querySelectorAll<SVGGElement>(".pulse-h").forEach((pair) => {
        gsap.fromTo(
          pair.children,
          { strokeDashoffset: 80 },
          { strokeDashoffset: -1000, duration: gsap.utils.random(1.8, 3), ease: "none", repeat: -1, delay: gsap.utils.random(0, 2) },
        );
      });

      // Code card typing: reveal lines one by one.
      gsap.from(".v-code pre", {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.6,
        ease: "steps(8)",
        scrollTrigger: { trigger: ".v-gpu", start: "top 85%", once: true },
      });
      gsap.to(".v-gpu-chip", { y: -8, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true });
      return off;
    },
    { scope: root },
  );

  return (
    <section className="section sheet dark benefits" data-theme="dark" ref={root} id="benefits">
      <div className="container">
        <div className="benefits-head">
          <span className="badge">
            <Zap size={12} className="badge-icon" /> Key benefits
          </span>
          <Reveal className="h2 center" text={"Unleash your AI\napplication’s full potential"} />
        </div>

        <div className="bento">
          <article className="bento-card glow-card span-7 tall">
            <div className="bento-text">
              <h3>Low-latency global network</h3>
              <p>
                Minimize model response time with our <b>160+ location CDN</b>, providing an average global latency of 30 ms.
              </p>
            </div>
            <GlobeVisual />
          </article>
          <article className="bento-card glow-card span-5 tall text-bottom">
            <EndpointVisual />
            <div className="bento-text">
              <h3>Single end-point for all AI tasks</h3>
              <p>{B} offers automated infrastructure management for AI applications while offering real-time inference.</p>
            </div>
          </article>

          <article className="bento-card glow-card span-4">
            <div className="bento-text">
              <h3>Data privacy and security</h3>
              <p>Use pre-trained foundational models from the {B} ML Model Hub or your own trained models.</p>
            </div>
            <PrivacyVisual />
          </article>
          <article className="bento-card glow-card span-4">
            <div className="bento-text">
              <h3>Unlimited object storage</h3>
              <p>
                Use scalable <b>S3-compatible</b> cloud storage that grows with your needs.
              </p>
            </div>
            <StorageVisual />
          </article>
          <article className="bento-card glow-card span-4">
            <div className="bento-text">
              <h3>Pre-trained and custom ML models</h3>
              <p>
                Use pre-trained foundational models from the <b>{B} ML Model Hub</b> or your own trained models.
              </p>
            </div>
            <ModelsVisual />
          </article>

          <article className="bento-card glow-card span-7">
            <div className="bento-text">
              <h3>Model autoscaling</h3>
              <p>Set up autoscaling to handle load spikes. Use and pay for only the resources your model requires.</p>
            </div>
            <AutoscaleVisual />
          </article>
          <article className="bento-card glow-card span-5">
            <div className="bento-text">
              <h3>NVIDIA L40S GPUs</h3>
              <p>
                Boost model performance with the latest <b>NVIDIA</b> accelerator, perfect for <b>GenAI and LLM</b> inference.
              </p>
            </div>
            <GpuVisual />
          </article>
        </div>
      </div>
    </section>
  );
}
