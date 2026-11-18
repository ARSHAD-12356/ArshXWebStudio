"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { B } from "@/lib/config";
import Reveal from "./Reveal";

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is AI inference?",
    a: "It’s particularly useful for AI apps that need immediate processing and minimal delay, like generative AI and real-time object detection. It’s particularly useful for AI apps that need immediate processing and minimal delay, like generative AI and real-time object detection.",
  },
  {
    q: "What is the difference between AI inference at the edge and in the cloud?",
    a: "Cloud inference runs your model in a centralised data centre, so every request travels to that region and back. Edge inference runs the model on servers close to your users, which cuts round-trip latency, reduces bandwidth costs and keeps data nearer to where it is produced.",
  },
  {
    q: `What are the key benefits of ${B} Inference at the Edge for end users?`,
    a: "End users get faster, more consistent responses from AI features wherever they are, thanks to 160+ points of presence, Smart Routing to the nearest node, and NVIDIA L40S GPUs tuned for generative AI workloads.",
  },
  {
    q: `Is ${B} Inference at the Edge suitable for AIoT systems?`,
    a: "Yes. AIoT devices often need real-time decisions with limited on-device compute. Offloading inference to a nearby edge node gives them low-latency access to large models without shipping data to a distant cloud region.",
  },
  {
    q: "Why is the NVIDIA L40S GPU good for AI inference?",
    a: "The L40S combines 48GB of GDDR6 memory with fourth-generation Tensor Cores and FP8 support, giving high throughput for LLM and image-generation inference at a lower cost per request than training-class GPUs.",
  },
];

function Item({ q, a, open, onToggle, id }: { q: string; a: string; open: boolean; onToggle: () => void; id: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const el = panel.current!;
      if (first.current) {
        first.current = false;
        gsap.set(el, { height: open ? "auto" : 0 });
        gsap.set(el.firstElementChild, { opacity: open ? 1 : 0 });
        return;
      }
      const d = prefersReducedMotion() ? 0 : 0.5;
      gsap.to(el, { height: open ? "auto" : 0, duration: d, ease: "power2.inOut" });
      gsap.to(el.firstElementChild, { opacity: open ? 1 : 0, y: open ? 0 : -6, duration: d, ease: "power2.out" });
    },
    { dependencies: [open] },
  );

  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-panel`} id={`${id}-btn`} onClick={onToggle}>
          <ChevronDown size={18} className="chev" />
          <span>{q}</span>
        </button>
      </h3>
      <div className="faq-panel" ref={panel} id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`}>
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".faq-item", {
        opacity: 0,
        y: 40,
        stagger: 0.08,
        duration: 0.9,
        scrollTrigger: { trigger: ".faq-list", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section className="section dark faq" data-theme="dark" ref={root} id="faq">
      <div className="container">
        <Reveal className="h2 center" text="Frequently asked questions" />
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <Item key={f.q} id={`faq-${i}`} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
