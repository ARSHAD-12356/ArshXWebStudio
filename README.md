# ArshXWebStudio: Inference at the Edge

An "Inference at the Edge" AI landing page rebuilt from a screen recording, made with Next.js 15, TypeScript, GSAP + ScrollTrigger and Lenis.

```bash
npm install
npm run dev      # http://localhost:3000 (Turbopack, output in .next-dev)
npm run build    # production build
npm run start    # serve the production build
```

- Brand name and wordmark: `src/lib/config.ts`
- One component per section: `src/components/`
- Video analysis, motion spec, design tokens, asset manifest: `ANALYSIS.md`
- `scripts/fat32-fs-fix.cjs` works around a `readlink` quirk on FAT32/exFAT drives on Windows, and does nothing on other file systems.
