import type { ReactElement } from "react";
import type { PreviewType } from "@/data/navigation";

/*
 * One small illustration per preview type. Pure CSS/SVG, on-theme (navy surfaces, blue/cyan accents).
 * Each has a looping micro-animation defined in header.css (pv-* classes); all loops stop under
 * prefers-reduced-motion.
 */

const Bars = ({ n = 3, w = ["80%", "60%", "70%"] }: { n?: number; w?: string[] }) => (
  <>
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} className="pv-line" style={{ width: w[i % w.length] }} />
    ))}
  </>
);

const Window = ({ children, url = true }: { children: React.ReactNode; url?: boolean }) => (
  <div className="pv-window">
    <div className="pv-winbar">
      <i />
      <i />
      <i />
      {url && <span className="pv-url" />}
    </div>
    <div className="pv-winbody">{children}</div>
  </div>
);

const Phone = ({ ios, children }: { ios?: boolean; children: React.ReactNode }) => (
  <div className={`pv-phone ${ios ? "ios" : ""}`}>
    <span className="pv-notch" />
    <div className="pv-phone-screen">{children}</div>
  </div>
);

function Browser() {
  return (
    <Window>
      <div className="pv-hero-block pv-shimmer">
        <span className="pv-line" style={{ width: "55%" }} />
        <span className="pv-line thin" style={{ width: "40%" }} />
        <span className="pv-btn" />
      </div>
      <div className="pv-row3">
        <span className="pv-tile" />
        <span className="pv-tile" />
        <span className="pv-tile" />
      </div>
    </Window>
  );
}

function Dashboard() {
  return (
    <Window url={false}>
      <div className="pv-dash">
        <div className="pv-side">
          <Bars n={5} w={["70%", "90%", "60%", "80%", "50%"]} />
        </div>
        <div className="pv-dash-main">
          <div className="pv-kpis">
            <span className="pv-kpi hot" />
            <span className="pv-kpi" />
            <span className="pv-kpi" />
          </div>
          <svg className="pv-chart" viewBox="0 0 200 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pvArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--ax-cyan)" stopOpacity="0.35" />
                <stop offset="1" stopColor="var(--ax-cyan)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 70 C20 60 30 64 50 50 S80 58 100 40 S140 44 160 22 S190 18 200 8 V80 H0Z" fill="url(#pvArea)" />
            <path className="pv-draw" d="M0 70 C20 60 30 64 50 50 S80 58 100 40 S140 44 160 22 S190 18 200 8" pathLength={1} />
          </svg>
        </div>
      </div>
    </Window>
  );
}

function PhoneAndroid() {
  return (
    <Phone>
      <div className="pv-appbar" />
      <div className="pv-list">
        {[0, 1, 2, 3].map((i) => (
          <div className="pv-list-item" key={i} style={{ animationDelay: `${i * 0.25}s` }}>
            <span className="pv-dot" />
            <span className="pv-line" style={{ width: `${70 - i * 8}%` }} />
          </div>
        ))}
      </div>
      <span className="pv-fab" />
    </Phone>
  );
}

function PhoneIos() {
  return (
    <Phone ios>
      <span className="pv-line big" style={{ width: "55%" }} />
      <div className="pv-ios-card pv-pulse" />
      <div className="pv-ios-row">
        <span className="pv-ios-mini" />
        <span className="pv-ios-mini" />
      </div>
      <span className="pv-homebar" />
    </Phone>
  );
}

function Game() {
  return (
    <Window url={false}>
      <div className="pv-game">
        <span className="pv-coin" style={{ left: "38%" }} />
        <span className="pv-coin" style={{ left: "56%", animationDelay: ".3s" }} />
        <span className="pv-coin" style={{ left: "74%", animationDelay: ".6s" }} />
        <span className="pv-platform" style={{ left: "52%", bottom: "38%", width: "22%" }} />
        <span className="pv-hero-sprite" />
        <span className="pv-ground" />
      </div>
    </Window>
  );
}

function SearchResults() {
  return (
    <Window>
      <div className="pv-search">
        <span className="pv-searchbar" />
        <div className="pv-result ad pv-glow">
          <span className="pv-adtag">Ad</span>
          <span className="pv-line" style={{ width: "62%" }} />
          <span className="pv-line thin" style={{ width: "85%" }} />
        </div>
        {[0, 1].map((i) => (
          <div className="pv-result" key={i}>
            <span className="pv-line" style={{ width: "50%" }} />
            <span className="pv-line thin" style={{ width: "78%" }} />
          </div>
        ))}
      </div>
    </Window>
  );
}

function SocialPost() {
  return (
    <div className="pv-card-post">
      <div className="pv-post-head">
        <span className="pv-avatar" />
        <span className="pv-line" style={{ width: "40%" }} />
      </div>
      <div className="pv-post-img" />
      <div className="pv-post-foot">
        <svg className="pv-heart" viewBox="0 0 24 24">
          <path d="M12 21s-7-4.4-9.5-8.6C.7 9.2 2.4 5 6.3 5c2.2 0 3.6 1.3 4.7 2.8C12.1 6.3 13.5 5 15.7 5c3.9 0 5.6 4.2 3.8 7.4C19 16.6 12 21 12 21z" />
        </svg>
        <span className="pv-line thin" style={{ width: "50%" }} />
      </div>
    </div>
  );
}

function VideoPlayer() {
  return (
    <Window url={false}>
      <div className="pv-video">
        <span className="pv-play" />
        <div className="pv-progress">
          <span className="pv-progress-fill" />
        </div>
      </div>
    </Window>
  );
}

function TargetRings() {
  return (
    <div className="pv-target">
      <span className="pv-ring r1" />
      <span className="pv-ring r2" />
      <span className="pv-ring r3" />
      <span className="pv-bull" />
      <span className="pv-orbit-dot" />
    </div>
  );
}

function CreatorCards() {
  return (
    <div className="pv-creators">
      {[-12, 0, 12].map((r, i) => (
        <div className="pv-creator-tilt" key={i} style={{ transform: `rotate(${r}deg) translateY(${i === 1 ? -10 : 0}px)` }}>
          <div className="pv-creator" style={{ animationDelay: `${i * 0.4}s` }}>
            <span className="pv-avatar lg" />
            <span className="pv-line" style={{ width: "70%" }} />
            <span className="pv-line thin" style={{ width: "50%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MapPins() {
  return (
    <div className="pv-map">
      <svg viewBox="0 0 200 130" preserveAspectRatio="none" className="pv-roads">
        <path d="M0 95 C50 80 70 110 120 70 S180 30 200 35" />
        <path d="M40 0 C55 40 80 60 130 75 S185 115 200 125" />
      </svg>
      {[
        [26, 40],
        [55, 62],
        [76, 26],
      ].map(([x, y], i) => (
        <span className="pv-pin" key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.35}s` }} />
      ))}
    </div>
  );
}

function DocKeywords() {
  return (
    <div className="pv-doc">
      <span className="pv-line big" style={{ width: "60%" }} />
      <div className="pv-doc-lines">
        <span className="pv-line" style={{ width: "92%" }} />
        <span className="pv-kw">keyword</span>
        <span className="pv-line" style={{ width: "70%" }} />
        <span className="pv-line" style={{ width: "84%" }} />
        <span className="pv-kw" style={{ animationDelay: ".8s" }}>
          local intent
        </span>
        <span className="pv-line" style={{ width: "60%" }} />
      </div>
    </div>
  );
}

function SpeedGauge() {
  return (
    <div className="pv-gauge">
      <svg viewBox="0 0 200 120">
        <path className="pv-gauge-track" d="M20 110 A80 80 0 0 1 180 110" pathLength={1} />
        <path className="pv-gauge-fill" d="M20 110 A80 80 0 0 1 180 110" pathLength={1} />
        <g className="pv-needle">
          <line x1="100" y1="110" x2="100" y2="46" />
          <circle cx="100" cy="110" r="7" />
        </g>
      </svg>
    </div>
  );
}

function ProductGrid() {
  return (
    <div className="pv-products">
      {[0, 1, 2, 3].map((i) => (
        <div className={`pv-product ${i === 0 ? "top" : ""}`} key={i}>
          <span className="pv-product-img" />
          <span className="pv-line" style={{ width: "70%" }} />
          <span className="pv-price" />
        </div>
      ))}
    </div>
  );
}

function AppListing() {
  return (
    <div className="pv-listing">
      <div className="pv-listing-head">
        <span className="pv-app-icon" />
        <div className="pv-listing-meta">
          <span className="pv-line" style={{ width: "80%" }} />
          <span className="pv-stars">★★★★★</span>
        </div>
        <span className="pv-install" />
      </div>
      <div className="pv-shots">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function VideoTimeline() {
  return (
    <Window url={false}>
      <div className="pv-editor">
        <div className="pv-editor-frame" />
        <div className="pv-tracks">
          <div className="pv-track">
            <span style={{ width: "38%" }} />
            <span style={{ width: "26%" }} />
            <span style={{ width: "24%" }} />
          </div>
          <div className="pv-track alt">
            <span style={{ width: "55%" }} />
            <span style={{ width: "30%" }} />
          </div>
          <span className="pv-playhead" />
        </div>
      </div>
    </Window>
  );
}

function Poster() {
  return (
    <div className="pv-poster">
      <span className="pv-poster-shape" />
      <span className="pv-poster-shape b" />
      <div className="pv-poster-text">
        <span className="pv-line big" style={{ width: "75%" }} />
        <span className="pv-line" style={{ width: "50%" }} />
      </div>
    </div>
  );
}

function BrandKit() {
  return (
    <div className="pv-brand">
      <div className="pv-brand-logo">
        <span />
      </div>
      <div className="pv-swatches">
        {["var(--ax-blue)", "var(--ax-cyan)", "var(--ax-deep)", "var(--ax-silver)"].map((c, i) => (
          <span key={i} style={{ background: c, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <div className="pv-type">Aa</div>
    </div>
  );
}

function Carousel() {
  return (
    <div className="pv-carousel">
      <div className="pv-carousel-track">
        {[0, 1, 2, 3].map((i) => (
          <div className="pv-slide" key={i}>
            <span className="pv-line" style={{ width: "60%" }} />
          </div>
        ))}
      </div>
      <div className="pv-dots">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function AdVariants() {
  return (
    <div className="pv-ab">
      {["A", "B"].map((v) => (
        <div className={`pv-ad ${v === "B" ? "win" : ""}`} key={v}>
          <span className="pv-ad-label">{v}</span>
          <span className="pv-ad-img" />
          <span className="pv-line" style={{ width: "75%" }} />
          <span className="pv-btn" />
        </div>
      ))}
    </div>
  );
}

export const PREVIEWS: Record<PreviewType, () => ReactElement> = {
  browser: Browser,
  dashboard: Dashboard,
  phoneAndroid: PhoneAndroid,
  phoneIos: PhoneIos,
  game: Game,
  searchResults: SearchResults,
  socialPost: SocialPost,
  videoPlayer: VideoPlayer,
  targetRings: TargetRings,
  creatorCards: CreatorCards,
  mapPins: MapPins,
  docKeywords: DocKeywords,
  speedGauge: SpeedGauge,
  productGrid: ProductGrid,
  appListing: AppListing,
  videoTimeline: VideoTimeline,
  poster: Poster,
  brandKit: BrandKit,
  carousel: Carousel,
  adVariants: AdVariants,
};
