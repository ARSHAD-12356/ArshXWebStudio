"use client";

import { useRef } from "react";
import { Boxes, ChevronRight, Cpu, Database, Package, Sparkles, Zap } from "lucide-react";
import { useGSAP } from "@/lib/gsap";
import { cardsIn, cursorGlow } from "@/lib/hooks";
import { B } from "@/lib/config";
import Reveal from "./Reveal";

const PRODUCTS = [
  { t: "AI GPU Infrastructure", d: "Virtual Machines and Bare Metal servers with A100 and H100 NVIDIA GPUs for LLM training and high-performance computing", I: Sparkles },
  { t: "AI IPU Infrastructure", d: "Virtual and dedicated instances powered by Graphcore AI processors designed to accelerate ML workloads", I: Cpu },
  { t: "Container as a Service", d: "Serverless solution for running containerized applications and ML models in the cloud", I: Package },
  { t: "FastEdge", d: "Low-latency edge computing for deploying serverless applications", I: Zap },
  { t: "Managed Kubernetes", d: "Fully managed Kubernetes clusters with GPU worker node support for AI/ML workloads", I: Boxes },
  { t: "Object Storage", d: "Scalable S3-compatible cloud storage for storing and retrieving any amount of data", I: Database },
];

export default function Products() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      cardsIn(root.current!, ".prod-card", { stagger: 0.12 });
      return cursorGlow(root);
    },
    { scope: root },
  );

  return (
    <section className="section dark products" data-theme="dark" ref={root} id="products">
      <div className="container">
        <Reveal className="h2 center" text={`Try other ${B} products`} />
        <div className="prod-grid">
          {PRODUCTS.map(({ t, d, I }) => (
            <article className="prod-card glow-card" key={t}>
              <span className="prod-ico">
                <I size={18} />
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
              <a href="#" className="learn">
                Learn More <ChevronRight size={16} className="learn-arrow" />
                <span className="sr-only"> about {t}</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
