# Inference at the Edge: video analysis (Phase 1 + 2)

Source: 720×720 screen recording, 46.5 s, 23.98 fps. The browser viewport sits inside an orange-glow frame (crop `652×388 @ 34,166`).
Frames were extracted with ffmpeg (the imageio-ffmpeg build) at 1 fps contact sheets, plus full-res crops at 2.5, 7, 10.5, 14.5, 17.5, 19.5, 25, 26.5, 30.5, 32.5, 35.5, 37.3, 40.5 and 44.5 s.

## Corrections to the reference analysis (what the video actually shows)

| Item | Reference said | Video shows (used in the build) |
|---|---|---|
| Section 4 toggle | "toggle pill" | Two-tab pill: **"What is?"** (black, active, icon) · **"How It Works?"** |
| Section 4 chips | 6 chips | Three right-aligned rows of chips, fading out on the left edge (a marquee wall) |
| Data privacy copy | – | "Use pre-trained foundational models from the Gcore ML Model Hub or your own trained models." |
| Storage copy | "Unlimited storage with S3-compatible…" | "Use scalable **S3-compatible** cloud storage that grows with your needs." |
| Pre-trained card | toggle dots | Pills "Gcore ML Model Hub" (orange AI dot) → "Data collection and…" joined by a glowing connector |
| Globe sub copy | "small grey sub-paragraph" | "Gcore global network consists of more than 160 locations, allowing you to reach your users anywhere in the world" |
| Playground options | Audio Generate | **Avatar Generate** (blue). Footnote: "Free Research Preview. May produce inaccurate information about people, places, or facts." |
| Use-case bullets | Reference list | Real copy differs (Retail, Automotive, Gaming, Hospitality, Manufacturing). The video copy is used. Gaming illustration = floating W/A/S/D keys; Manufacturing = scanner brackets |
| Pricing toggle | segmented | **€ / $** currency toggle. Beta note under the cards: "During the early beta period, Inference at the Edge is free until general availability…" |
| Pricing icons | – | Each spec row has a small line icon (cpu, gauge, memory, sparkle) |
| CTA panel | orange→red→yellow | Black top → deep orange band → **white** at the bottom edge; shrinks into a rounded card |
| Footer | – | Two "Contact" columns, 3 certification badges, newsletter field with a round white arrow button, reCAPTCHA line + address |

## Section map

| # | Time | Section | Theme | Layout | Entrance | Scroll | Transition out |
|---|---|---|---|---|---|---|---|
| 0 | 0–2.7 s | Preloader | #1C1C1E | Centred mark | dot → radio → G mark → wordmark G-C-O-R-E → scale 1.6 | – | Dark curtain clip-path from the bottom |
| 1 | 2.7 s | Topbar + nav A | dark | Full-width bar 36 px, nav row | fade down, staggered | morphs to pill B at 100 px | – |
| 2 | 3–8 s | Hero | dark | Badge, H1, para, 2 buttons, circuit | word blur reveal on load, then fade-ups | content parallax 0.5×, pulses loop | pinned, scales 0.95, light sheet slides over |
| 3 | 8–11 s | Use AI faster | light | Toggle, H2, 5/7 two-column | scrubbed words, chips pop | promo image inner parallax | pinned + dimmed, dark sheet slides over |
| 4 | 11–17 s | Key benefits bento | dark | 7/5 · 4/4/4 · 7/5 | cards y60 + scale .96, staggered | heading slower than grid | normal |
| 5 | 18–23 s | Global network | dark, pinned | Badge, H2, sub, globe | words | pin 150 %: globe y60 %→0, scale .8→1.3, heading out | light sheet over |
| 6 | 23–27 s | Experience it now | light | H2, sub, icon marquee, big card | icons stagger | card y150→0, scale .9→1 | normal |
| 7 | 27–31 s | Use cases | light | 3×2 cards | cards stagger, illustrations play | – | pinned, dark sheet over |
| 8 | 31–33 s | Pricing | dark | toggle, H2, 3 cards | cards rise, prices count up | – | normal |
| 9 | 33–36 s | FAQ | dark | H2, 5 accordion rows | rows stagger | heading scrub | normal |
| 10 | 36–39 s | CTA | dark, pinned | glow panel | scrub brighten | glow rises, panel → card scale .85, radius 32 | products follow |
| 11 | 39–42 s | Other products | dark | 3×2 cards | rows stagger | – | footer curtain |
| 12 | 42–46 s | Footer | dark | 4 columns + bottom bar | columns stagger | sticky reveal | – |

## Motion spec

| Element | Trigger | From → To | Duration / ease | Stagger | ScrollTrigger |
|---|---|---|---|---|---|
| Preloader dot | load | scale 0 → 1 | 0.5 s back.out(2) | – | – |
| Preloader ring | load | scale .4, opacity 0 → 1 | 0.5 s back.out | – | – |
| Ring → G mark | load | rotate 0→90 + fade / rotate −90→0 + fade in | 0.5 s power3.inOut | – | – |
| Wordmark letters | load | opacity 0, x 20, blur 8 → 0 | 0.6 s power3.out | 0.08 s | – |
| Logo pop | load | scale 1 → 1.6 | 0.6 s power3.inOut | – | – |
| Curtain | load | clip-path inset(100% 0 0 0) → inset(0) | 0.8 s expo.inOut | – | – |
| Nav items | after curtain | y −16, opacity 0 → 0 | 0.8 s power3.out | 0.06 s | – |
| Nav morph | scroll > 100 px | width, padding, bg, logo | 0.5 s cubic-bezier(.65,0,.35,1) | – | toggle |
| Hero H1 words | after curtain | opacity 0, y 30, blur 10 → 1, 0, 0 | 1.1 s expo.out | 0.12 s | – |
| Section headings | scrub | opacity .15, blur 6, y 12 → 1, 0, 0 | scrub | 0.08 | top 80% → top 35% |
| Cards | enter | y 60, opacity 0, scale .96 → 0, 1, 1 | 1 s power3.out | 0.1 s | top 85% |
| Sheets | scrub | previous: scale 1 → .95, dim 0 → .5 | scrub | – | prev bottom bottom → +100% |
| Circuit pulses | loop | dashoffset 60 → −1000 (pathLength 1000) | 1.6–2.6 s none | random delay | – |
| Hero tiles | loop + mouse | y ±6 sine, mouse parallax 8–24 px | 3–4 s sine.inOut | phase offset | – |
| Globe (section 5) | pin, scrub | y 60%, scale .8 → y 0, scale 1.3 | scrub | – | top top → +150% |
| Playground card | scrub | y 150, scale .9 → 0, 1 | scrub | – | top 95% → top 40% |
| Prices | enter | 0 → value | 1.4 s power2.out | – | top 85% |
| FAQ panel | click | height 0 ↔ auto | 0.5 s power2.inOut | – | – |
| CTA | pin, scrub | glow y 40% → 0, scale .9 → 1.15; panel scale 1 → .85, radius 0 → 32 | scrub | – | top top → +160% |
| Footer columns | enter | y 30, opacity 0 → 0, 1 | 0.9 s power3.out | 0.08 s | top 90% |

## Design tokens

| Token | Value |
|---|---|
| Page black | `#0A0A0A` (sections) / `#060606` (deep) |
| Card dark | `#121212`, `#1A1A1A`, border `rgba(255,255,255,.06)` |
| Light section | `#F6F6F4`, cards `#FFFFFF`, border `rgba(0,0,0,.06)` |
| Brand orange | `#FF4F12` → `#FF7A1A`; hot red `#E8320C` |
| Body grey | `#8A8A8A` on dark, `#6B6B6B` on light |
| Font | Plus Jakarta Sans 400/500/600/700, headings 500–600, letter-spacing −0.02em |
| H1 | clamp(42px, 5.2vw, 76px) / 1.05 |
| H2 | clamp(32px, 3.4vw, 50px) / 1.12 |
| H3 / card title | 18–22px / 600 |
| Body | 15–16px / 1.6 |
| Radii | cards 22px, sheets 32px top, pills 999px |
| Container | 1200px max, 24px gutter (16px mobile) |
| Glows | orange `0 0 24px rgba(255,79,18,.6)`, rim glow radial `#FF5A14 → transparent` |

## Asset manifest

All visuals are recreated in code: the video is 720 px and anything cropped would be blurry.

| Asset | Source | Section |
|---|---|---|
| Brand mark (G) + wordmark | Inline SVG + text from the `CONFIG` object | Preloader, nav, footer |
| Hero beam | CSS linear gradient + blur, shimmer loop | Hero |
| Circuit, chip, pulses | Inline SVG + GSAP dashoffset | Hero |
| App tiles | HTML tiles + Lucide placeholder icons | Hero |
| Promo streak card | CSS gradients + glowing lines | Use AI faster |
| Dotted globes | Canvas orthographic projection, land mask from `world-atlas` land-110m (CDN), procedural fallback offline | Bento, Global network |
| Bento visuals (sphere, cubes, pills, PCB, chip, code) | HTML/CSS/SVG + GSAP | Key benefits |
| Provider icons | Neutral coloured placeholder glyphs | Experience it now, Use AI chips |
| Use-case illustrations | HTML/CSS + GSAP | Use cases |
| CTA sunrise | CSS radial + linear gradients | CTA |
| Social, cert, payment icons | Lucide + neutral shapes | Footer |

## Phase 4 checklist

| Item | Status |
|---|---|
| Preloader: dot → radio → G → wordmark → scale → curtain | ✅ |
| Topbar + nav A → floating pill B, orange icon, white CTA, ring on light | ✅ |
| Word-by-word blur reveals (load + scrub) | ✅ |
| Sheet transitions with 32 px corners and dimmed scale-down | ✅ |
| Hero circuit pulses + floating tiles + beam | ✅ |
| Bento grid with cursor glow and animated visuals | ✅ |
| Globe pin with rim glow, rotation and stars | ✅ |
| Playground card rise, typewriter | ✅ |
| Use cases illustrations | ✅ |
| Pricing count-up, €/$ toggle, hover lift | ✅ |
| FAQ accordion (keyboard accessible) | ✅ |
| CTA sunrise + shrink-to-card | ✅ |
| Products cards + footer curtain | ✅ |
| Third-party logos | ⚠️ Neutral placeholders by design (per brief) |
| Pixel-exact geometry of circuit traces / illustrations | ⚠️ Close approximation; the 720 px source can't resolve fine detail |
