"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/events";
import { lockScroll } from "@/lib/lenis";
import { QUOTE_HREF, whatsappHref } from "@/data/navigation";
import AxMark from "../AxMark";
import TopBar from "./TopBar";
import NavLinks, { type MenuId } from "./NavLinks";
import MegaMenu, { type MegaHandle } from "./MegaMenu";
import AboutDropdown, { type AboutHandle } from "./AboutDropdown";
import MobileMenu from "./MobileMenu";
import "./header.css";

const OPEN_DELAY = 120;
const CLOSE_DELAY = 200;
const COMPACT_AT = 80;
const ABOUT_W = 460;

/** Site header: top bar, navbar (full ↔ floating pill), Services mega menu, About dropdown, mobile sheet. */
export default function Header() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const servicesBtn = useRef<HTMLButtonElement>(null);
  const aboutBtn = useRef<HTMLButtonElement>(null);
  const mega = useRef<MegaHandle>(null);
  const about = useRef<AboutHandle>(null);

  const [open, setOpen] = useState<MenuId | null>(null);
  const [everOpened, setEverOpened] = useState(false);
  const [compact, setCompact] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pos, setPos] = useState({ top: 104, megaNotch: 400, aboutLeft: 0, aboutNotch: ABOUT_W / 2 });

  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pathname = usePathname();

  /* ---------------- positions (menu top, notch x) ---------------- */
  const measure = useCallback(() => {
    const b = bar.current?.getBoundingClientRect();
    const vw = window.innerWidth;
    const shellW = Math.min(1602, vw - 80);
    const shellLeft = (vw - shellW) / 2;
    const s = servicesBtn.current?.getBoundingClientRect();
    const a = aboutBtn.current?.getBoundingClientRect();
    const aboutCenter = a ? a.left + a.width / 2 : vw / 2;
    const aboutLeft = Math.max(16, Math.min(vw - ABOUT_W - 16, aboutCenter - ABOUT_W / 2));
    setPos({
      top: (b ? b.bottom : 80) + 22,
      megaNotch: s ? s.left + s.width / 2 - shellLeft : 400,
      aboutLeft,
      aboutNotch: aboutCenter - aboutLeft,
    });
  }, []);

  const openMenu = useCallback(
    (id: MenuId) => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      measure();
      setOpen(id);
      if (id === "services") setEverOpened(true);
    },
    [measure],
  );
  const closeMenu = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    setOpen(null);
  }, []);

  /* ---------------- hover intent ---------------- */
  const onTriggerEnter = (id: MenuId) => {
    clearTimeout(closeTimer.current);
    clearTimeout(openTimer.current);
    if (open && open !== id) openMenu(id); // already open: switch instantly
    else if (!open) openTimer.current = setTimeout(() => openMenu(id), OPEN_DELAY);
  };
  const scheduleClose = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), CLOSE_DELAY);
  };
  const cancelClose = () => clearTimeout(closeTimer.current);
  const toggle = (id: MenuId) => (open === id ? closeMenu() : openMenu(id));
  const keyOpen = (id: MenuId) => {
    openMenu(id);
    setTimeout(() => (id === "services" ? mega.current?.focusFirst() : about.current?.focusFirst()), 60);
  };

  /* ---------------- Esc, outside click, route change ---------------- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = open === "services" ? servicesBtn.current : aboutBtn.current;
      closeMenu();
      trigger?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    closeMenu();
    setMobileOpen(false);
  }, [pathname, closeMenu]);

  useEffect(() => () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  /* ---------------- scroll: full bar <-> floating pill ---------------- */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setCompact(window.scrollY > COMPACT_AT));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Re-measure open menus after the pill morph (0.5 s) and on resize.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(measure, 520);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [open, compact, measure]);

  /* ---------------- light sections under the header ---------------- */
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main [data-theme="light"]'));
    if (!sections.length) return;
    const hits = new Set<Element>();
    const line = 40; // y position of the pill's centre line
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? hits.add(e.target) : hits.delete(e.target)));
        setOnLight(hits.size > 0);
      },
      { rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px` },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* ---------------- backdrop ---------------- */
  useGSAP(
    () => {
      const d = prefersReducedMotion() ? 0.15 : 0.3;
      gsap.to(backdrop.current, { autoAlpha: open ? 1 : 0, duration: d, ease: "power2.out" });
    },
    { dependencies: [open] },
  );

  /* ---------------- intro after the preloader ---------------- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = root.current!.querySelectorAll(".hd-top > *, .hd-logo, .hd-link, .hd-actions > *");
      gsap.set(items, { opacity: 0, y: -14 });
      return onPreloaderDone(() => {
        gsap.to(items, { opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: "power3.out", delay: 0.05, clearProps: "transform" });
      });
    },
    { scope: root },
  );

  /* ---------------- mobile ---------------- */
  const setMobile = (v: boolean) => {
    setMobileOpen(v);
    lockScroll(v);
    if (!v) burger.current?.focus();
  };
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    lockScroll(false);
    burger.current?.focus();
  }, []);

  const light = compact && onLight && !open;

  return (
    <>
      <div className="hd-backdrop" ref={backdrop} aria-hidden="true" />
      <header
        ref={root}
        className={`hd ${compact ? "is-compact" : ""} ${light ? "is-light" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}
      >
        <TopBar />
        <div className="hd-bar" ref={bar}>
          <div className="hd-bar-bg" aria-hidden="true" />
          <a href="/" className="hd-logo" aria-label="ArshX Web Studio home">
            <span className="hd-logo-mark">
              <AxMark idPrefix="axHeader" />
            </span>
            <span className="hd-logo-word">
              <b>ArshX</b>
              <span className="hd-logo-rest"> Web Studio</span>
            </span>
          </a>

          <NavLinks
            open={open}
            triggerRefs={{ services: servicesBtn, about: aboutBtn }}
            onEnter={onTriggerEnter}
            onLeave={scheduleClose}
            onToggle={toggle}
            onKeyOpen={keyOpen}
            panels={{
              services: (
                <MegaMenu
                  ref={mega}
                  open={open === "services"}
                  everOpened={everOpened}
                  top={pos.top}
                  notchX={pos.megaNotch}
                  onPointerEnter={cancelClose}
                  onPointerLeave={scheduleClose}
                />
              ),
              about: (
                <AboutDropdown
                  ref={about}
                  open={open === "about"}
                  top={pos.top}
                  left={pos.aboutLeft}
                  notchX={pos.aboutNotch}
                  onPointerEnter={cancelClose}
                  onPointerLeave={scheduleClose}
                />
              ),
            }}
          />

          <div className="hd-actions">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="hd-btn hd-wa" aria-label="Chat on WhatsApp">
              <span className="hd-wa-ico">
                <MessageCircle size={15} />
              </span>
              <span className="hd-wa-txt">Chat on WhatsApp</span>
            </a>
            <a href={QUOTE_HREF} className="hd-btn hd-quote">
              <span className="hd-quote-txt">Get a Free Quote</span> <ArrowRight size={18} className="hd-arrow" />
            </a>
            <button
              ref={burger}
              type="button"
              className="hd-burger"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobile(!mobileOpen)}
            >
              <i />
              <i />
            </button>
          </div>
        </div>
        <MobileMenu open={mobileOpen} onClose={closeMobile} />
      </header>
    </>
  );
}
