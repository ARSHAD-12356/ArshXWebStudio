"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { type NavCategory, serviceHref, tagLabel } from "@/data/navigation";
import { PREVIEWS } from "./previews";

type Target = { cat: NavCategory; index: number };

/** Right-hand live preview: crossfades to the hovered service (old out y -6, new in y 8). */
export default function MegaPreview({ cat, index }: { cat: NavCategory; index: number }) {
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<Target>({ cat, index });
  const latest = useRef<Target>({ cat, index });
  const busy = useRef(false);

  // Leave animation, then swap to whatever is the latest target (handles fast hovering).
  useEffect(() => {
    latest.current = { cat, index };
    if (shown.cat.id === cat.id && shown.index === index) return;
    if (busy.current) return;
    const swap = root.current?.querySelector(".mp-swap");
    if (!swap || prefersReducedMotion()) {
      setShown(latest.current);
      return;
    }
    busy.current = true;
    gsap.to(swap, {
      y: -6,
      opacity: 0,
      duration: 0.12,
      ease: "power2.in",
      onComplete: () => {
        busy.current = false;
        setShown(latest.current);
      },
    });
  }, [cat, index, shown]);

  // Enter animation for the newly shown service.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".mp-swap", { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power3.out" });
      gsap.fromTo(".mp-illo", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(".mp-badge", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)", stagger: 0.08, delay: 0.1 });
    },
    { scope: root, dependencies: [shown.cat.id, shown.index] },
  );

  const svc = shown.cat.services[shown.index];
  const Illo = PREVIEWS[svc.preview];
  const num = String(shown.index + 1).padStart(2, "0");

  return (
    <div className="mp" ref={root}>
      <div className="mp-swap">
        <div className="mp-stage">
          <div className="mp-stage-grid" aria-hidden="true" />
          <div className="mp-illo" aria-hidden="true">
            <div className="mp-tilt">
              <Illo />
            </div>
          </div>
          {svc.badges.map((b, i) => (
            <span className={`mp-badge b${i}`} key={b}>
              <span className="mp-badge-in">{b}</span>
            </span>
          ))}
        </div>
        <div className="mp-info">
          <p className="mp-tag">
            {num} — {svc.tag}
          </p>
          <h3 className="mp-title">{svc.title}</h3>
          <p className="mp-desc">{svc.long}</p>
          <ul className="mp-chips">
            {svc.chips.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="mp-foot">
            <a href={serviceHref(shown.cat, svc)} className="mp-explore">
              Explore {tagLabel(svc.tag)} <ArrowRight size={15} />
            </a>
            <span className="mp-note">Free consultation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
