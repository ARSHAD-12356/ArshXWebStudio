"use client";

import { createElement, Fragment, useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3" | "p";

type Props = {
  as?: Tag;
  /** Use "\n" for a forced line break. */
  text: string;
  className?: string;
  /**
   * scrub: words light up with scroll (the default for section headings)
   * load:  words are left for the parent to animate (e.g. the hero after the preloader)
   * none:  split only
   */
  mode?: "scrub" | "load" | "none";
  start?: string;
  end?: string;
  id?: string;
};

/** Splits text into word spans (`.w > .wi`) and plays the signature blur/opacity word reveal. */
export default function Reveal({
  as = "h2",
  text,
  className = "",
  mode = "scrub",
  start = "top 80%",
  end = "top 35%",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (mode !== "scrub" || !ref.current || prefersReducedMotion()) return;
      const words = ref.current.querySelectorAll(".wi");
      gsap.fromTo(
        words,
        { opacity: 0.15, filter: "blur(6px)", y: 12 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start, end, scrub: 0.6 },
        },
      );
    },
    { scope: ref, dependencies: [mode, text] },
  );

  const lines = text.split("\n");
  const children = lines.map((line, li) => (
    <Fragment key={li}>
      {line.split(" ").map((word, wi) => (
        <Fragment key={wi}>
          <span className="w">
            <span className="wi">{word}</span>
          </span>
          {wi < line.split(" ").length - 1 ? " " : null}
        </Fragment>
      ))}
      {li < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));

  return createElement(as, { ref, className: `reveal ${className}`, id, "aria-label": text.replace(/\n/g, " ") }, children);
}
