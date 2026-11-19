"use client";

/**
 * Dotted-earth globe rendered on a 2D canvas with an orthographic projection.
 * Land dots are sampled from the Natural Earth 110m land mask (world-atlas),
 * with a procedural fallback if the data can't be loaded.
 */

type LatLon = { lat: number; lon: number };

export type GlobeOptions = {
  /** Degrees between dot rows. */
  step: number;
  dotColor: string;
  /** Dot size in CSS px at the centre of the globe. */
  dotSize: number;
  /** Radius as a fraction of min(width, height) / 2. */
  radius: number;
  /** Radians per second. */
  speed: number;
  /** Axial tilt in radians (positive tilts the north pole towards the viewer). */
  tilt: number;
  /** Starting longitude rotation in radians. */
  rotation?: number;
  /** Fill colours for the sphere [centre, edge]; null for transparent. */
  sphere?: [string, string] | null;
  /** Number of glowing "city" lights. */
  cities?: number;
  cityColor?: string;
  /** Vertical centre as a fraction of the height (default 0.5). */
  centerY?: number;
};

const maskCache = new Map<number, Promise<LatLon[]>>();

async function buildLandMask(): Promise<(lat: number, lon: number) => boolean> {
  try {
    const [{ feature }, topoModule] = await Promise.all([
      import("topojson-client"),
      import("world-atlas/land-110m.json"),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topo = (topoModule as any).default ?? topoModule;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const land = feature(topo, topo.objects.land) as any;
    const W = 720;
    const H = 360;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    ctx.fillStyle = "#fff";
    const features = land.type === "FeatureCollection" ? land.features : [land];
    for (const f of features) {
      const g = f.geometry;
      const polys: number[][][][] = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
      for (const poly of polys) {
        ctx.beginPath();
        for (const ring of poly) {
          ring.forEach(([lon, lat], i) => {
            const x = ((lon + 180) / 360) * W;
            const y = ((90 - lat) / 180) * H;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
        }
        ctx.fill("evenodd");
      }
    }
    const data = ctx.getImageData(0, 0, W, H).data;
    return (lat, lon) => {
      const x = Math.min(W - 1, Math.max(0, Math.floor(((lon + 180) / 360) * W)));
      const y = Math.min(H - 1, Math.max(0, Math.floor(((90 - lat) / 180) * H)));
      return data[(y * W + x) * 4 + 3] > 128;
    };
  } catch {
    // Procedural fallback: a handful of continent-ish blobs.
    const blobs: [number, number, number, number][] = [
      [45, -100, 22, 30], [-15, -60, 25, 14], [50, 15, 14, 25], [5, 20, 28, 18],
      [55, 90, 18, 45], [25, 80, 10, 12], [-25, 135, 11, 16], [72, -40, 8, 14],
    ];
    return (lat, lon) =>
      blobs.some(([la, lo, rLa, rLo]) => ((lat - la) / rLa) ** 2 + ((lon - lo) / rLo) ** 2 < 1);
  }
}

function getPoints(step: number): Promise<LatLon[]> {
  const cached = maskCache.get(step);
  if (cached) return cached;
  const p = buildLandMask().then((isLand) => {
    const pts: LatLon[] = [];
    for (let lat = -58; lat <= 80; lat += step) {
      const lonStep = step / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
      for (let lon = -180; lon < 180; lon += lonStep) {
        if (isLand(lat, lon)) pts.push({ lat, lon });
      }
    }
    return pts;
  });
  maskCache.set(step, p);
  return p;
}

export function createGlobe(canvas: HTMLCanvasElement, opts: GlobeOptions): () => void {
  const ctx = canvas.getContext("2d")!;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let pts: { x: number; y: number; z: number }[] = [];
  let cities: { x: number; y: number; z: number; phase: number }[] = [];
  let w = 0;
  let h = 0;
  let dpr = 1;
  let rot = opts.rotation ?? 0;
  let raf = 0;
  let visible = true;
  let last = performance.now();
  let alive = true;

  const toVec = ({ lat, lon }: LatLon) => {
    const la = (lat * Math.PI) / 180;
    const lo = (lon * Math.PI) / 180;
    return { x: Math.cos(la) * Math.sin(lo), y: Math.sin(la), z: Math.cos(la) * Math.cos(lo) };
  };

  getPoints(opts.step).then((list) => {
    if (!alive) return;
    pts = list.map(toVec);
    const n = opts.cities ?? 0;
    // Deterministic pseudo-random city picks.
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    cities = Array.from({ length: n }, () => ({ ...pts[Math.floor(rnd() * pts.length)], phase: rnd() * Math.PI * 2 }));
    draw(0);
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(0);
  };

  function draw(t: number) {
    ctx.clearRect(0, 0, w, h);
    if (!w || !h) return;
    const r = (Math.min(w, h) / 2) * opts.radius;
    const cx = w / 2;
    const cy = h * (opts.centerY ?? 0.5);
    if (opts.sphere) {
      const g = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.3, r * 0.1, cx, cy, r);
      g.addColorStop(0, opts.sphere[0]);
      g.addColorStop(1, opts.sphere[1]);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    const ct = Math.cos(opts.tilt);
    const st = Math.sin(opts.tilt);
    const project = (p: { x: number; y: number; z: number }) => {
      const x = p.x * cr + p.z * sr;
      const z0 = -p.x * sr + p.z * cr;
      const y = p.y * ct - z0 * st;
      const z = p.y * st + z0 * ct;
      return { x, y, z };
    };
    ctx.fillStyle = opts.dotColor;
    for (const p of pts) {
      const q = project(p);
      if (q.z <= 0.02) continue;
      const s = opts.dotSize * (0.35 + 0.65 * q.z);
      ctx.globalAlpha = 0.2 + 0.8 * q.z;
      ctx.fillRect(cx + q.x * r - s / 2, cy - q.y * r - s / 2, s, s);
    }
    if (cities.length) {
      for (const c of cities) {
        const q = project(c);
        if (q.z <= 0.1) continue;
        const px = cx + q.x * r;
        const py = cy - q.y * r;
        const pulse = 0.6 + 0.4 * Math.sin(t / 500 + c.phase);
        ctx.globalAlpha = 0.25 * pulse * q.z;
        ctx.fillStyle = opts.cityColor ?? "#ff5a14";
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = q.z;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    rot += opts.speed * dt;
    draw(now);
    raf = visible ? requestAnimationFrame(loop) : 0;
  };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf && !reduced) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });
  io.observe(canvas);
  resize();

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
  };
}
