"use client";

import { useRef, useState } from "react";
import { ArrowRight, Facebook, Github, Instagram, Linkedin, Music2, Send, Twitter, Youtube, Rss, MessageCircle } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { B, CONFIG } from "@/lib/config";
import { Logo } from "./BrandMark";

const COLS = [
  {
    h: "Products",
    l: ["CDN", "Hosting", "Streaming Platform", "Storage", "DDoS Protection", "Software Development", "Cloud", "IT Infrastructure Managment"],
  },
  { h: "Company", l: ["About", "Customers", "Case studies", "Careers", "Blog", "Press", "Legal information", "Site map"] },
  {
    h: "Resources",
    l: ["Status page", "API Documentation", "Internet peering points", "Product Documentation", "Looking Glass", "Developer Tools"],
  },
];

const SOCIAL = [
  { I: Linkedin, n: "LinkedIn" },
  { I: Facebook, n: "Facebook" },
  { I: Instagram, n: "Instagram" },
  { I: Youtube, n: "YouTube" },
  { I: Music2, n: "TikTok" },
  { I: Twitter, n: "X" },
  { I: MessageCircle, n: "Forum" },
  { I: Rss, n: "Blog feed" },
  { I: Github, n: "GitHub" },
  { I: Send, n: "Telegram" },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".f-col, .f-brand", {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.9,
        scrollTrigger: { trigger: root.current, start: "top 90%", once: true },
      });
      gsap.from(".f-bottom > *", {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.8,
        scrollTrigger: { trigger: ".f-bottom", start: "top 98%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <footer className="footer" ref={root} data-theme="dark">
      <div className="f-glow" aria-hidden="true" />
      <div className="container">
        <div className="f-top">
          <div className="f-brand">
            <Logo />
            <p>Powerful solutions to help your business grow globally. Experience our superior performance, proven by the largest online businesses.</p>
            <ul className="f-social">
              {SOCIAL.map(({ I, n }) => (
                <li key={n}>
                  <a href="#" aria-label={n}>
                    <I size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {COLS.map((c) => (
            <nav className="f-col" key={c.h} aria-label={c.h}>
              <h4>{c.h}</h4>
              <ul>
                {c.l.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="f-col">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="tel:+35220880507">+ 352 208 80 507</a>
              </li>
              <li>
                <a href="#">sales@{B.toLowerCase()}labs.com</a>
              </li>
            </ul>
            <h4 className="f-h-gap">Contact</h4>
            <ul>
              <li>
                <a href="#">support@{B.toLowerCase()}labs.com</a>
              </li>
              <li>
                <a href="#">info@{B.toLowerCase()}labs.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="f-bottom">
          <div className="f-certs" aria-label="Certifications">
            <span className="cert cert-1" title="Certified">
              ♛
            </span>
            <span className="cert cert-2" title="eco">
              eco
            </span>
            <span className="cert cert-3" title="Record">
              ★
            </span>
          </div>
          <p className="f-news">Subscribe to discover the latest updates, news, and features</p>
          <form
            className="f-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSent(true);
            }}
          >
            <label htmlFor="f-email" className="sr-only">
              E-mail
            </label>
            <input id="f-email" type="email" required placeholder={sent ? "Thanks for subscribing!" : "Enter your E-mail"} value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" aria-label="Subscribe">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="f-legal">
          <div>
            <p>
              This site is protected by reCAPTCHA. Google’s <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.
            </p>
            <p>{CONFIG.LEGAL}</p>
          </div>
          <div className="f-pay" aria-label="Accepted payment methods">
            <span className="pay pay-circles">
              <i />
              <i />
              <b>card</b>
            </span>
            <span className="pay">
              <b className="pay-p">Pay</b>
            </span>
            <span className="pay">
              <b className="pay-r">Secure</b>
            </span>
            <span className="pay">
              <b className="pay-b">bank</b>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
