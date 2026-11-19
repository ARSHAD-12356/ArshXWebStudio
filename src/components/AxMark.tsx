/**
 * ArshX "AX" logomark, traced from /public/brand/ax-mark-source.png into vector shapes so it
 * stays sharp at any size and has a truly transparent background.
 * The shine streak is clipped to the mark's shapes and animated by the preloader.
 */
const A_CHEVRON = "3,361 257,15 432,233 374,303 256,151 98,361";
const A_LOWER = "330,368 456,211 500,270 419,368";
const A_BAR = "214,275 303,276 253,347 161,347";
const X_MAIN = "306,8 415,8 705,373 575,373";
const X_ARM = "610,8 716,8 570,176 520,115";

export default function AxMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 4 720 372" role="img" aria-label="ArshX logo">
      <defs>
        <linearGradient id="axSilver" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#EEF1F6" />
          <stop offset="0.72" stopColor="#BCC5D4" />
          <stop offset="1" stopColor="#8E9BB2" />
        </linearGradient>
        <linearGradient id="axSilverLow" x1="0.2" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F6FA" />
          <stop offset="0.6" stopColor="#C3CBD8" />
          <stop offset="1" stopColor="#97A3B8" />
        </linearGradient>
        <linearGradient id="axBlueMain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1C9BFF" />
          <stop offset="0.38" stopColor="#0B6EFE" />
          <stop offset="0.72" stopColor="#0048F0" />
          <stop offset="1" stopColor="#0B6EFE" />
        </linearGradient>
        <linearGradient id="axBlueArm" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00E2FF" />
          <stop offset="0.55" stopColor="#0AA8FF" />
          <stop offset="1" stopColor="#0B6EFE" />
        </linearGradient>
        <linearGradient id="axBlueBar" x1="0.6" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#14A6FF" />
          <stop offset="1" stopColor="#0040F0" />
        </linearGradient>
        <linearGradient id="axShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="axClip">
          <polygon points={A_CHEVRON} />
          <polygon points={A_LOWER} />
          <polygon points={A_BAR} />
          <polygon points={X_MAIN} />
          <polygon points={X_ARM} />
        </clipPath>
      </defs>

      <g strokeLinejoin="round">
        <polygon points={X_MAIN} fill="url(#axBlueMain)" stroke="#4CC2FF" strokeWidth="2" />
        <polygon points={X_ARM} fill="url(#axBlueArm)" stroke="#6BE6FF" strokeWidth="2" />
        <polygon points={A_CHEVRON} fill="url(#axSilver)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
        <polygon points={A_LOWER} fill="url(#axSilverLow)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
        <polygon points={A_BAR} fill="url(#axBlueBar)" stroke="#45B8FF" strokeWidth="1.5" />
      </g>

      {/* Shine streak (moved across by the preloader timeline) */}
      <g clipPath="url(#axClip)">
        <g transform="rotate(18 360 190)">
          <rect className="ax-shine" x="-200" y="-120" width="90" height="640" fill="url(#axShine)" opacity="0" />
        </g>
      </g>
    </svg>
  );
}
