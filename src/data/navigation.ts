/**
 * All header / navigation content. Edit text and links here; components read everything from this file.
 */
export const NAV = {
  topBar: {
    show: true,
    text: "Free website audit for new clients this month!",
    href: "/contact",
    right: [
      { label: "WhatsApp us", href: "WA" },
      { label: "Client login", href: "/login" },
    ],
  },
  whatsapp: { number: "91XXXXXXXXXX", message: "Hi ArshX Web Studio, I'd like to discuss a project." },
  links: ["Services", "Work", "Industries", "About", "Blog"],
  categories: [
    {
      id: "development", label: "Development", icon: "Code2",
      headline: ["Build", "digital products", "that scale"], allLink: "/services/development",
      services: [
        { title: "Website Development", desc: "Business, e-commerce, landing pages, CMS", icon: "Globe", preview: "browser",
          tag: "WEBSITES", long: "Fast, beautiful websites that turn visitors into customers, from simple business sites to full online stores.",
          chips: ["Next.js", "WordPress", "Shopify", "Webflow"], badges: ["Mobile-first", "SEO-ready"] },
        { title: "Web App Development", desc: "SaaS, dashboards, portals & custom software", icon: "AppWindow", preview: "dashboard",
          tag: "WEB APPS", long: "Custom dashboards, SaaS platforms and client portals: fast, secure and built to grow with your business.",
          chips: ["React", "Next.js", "Node.js", "Laravel", "Cloud"], badges: ["⚡ Fast & secure", "Built to scale"] },
        { title: "Android App Development", desc: "Native & cross-platform Android apps", icon: "Smartphone", preview: "phoneAndroid",
          tag: "ANDROID", long: "Smooth, reliable Android apps your users will love, ready for the Play Store.",
          chips: ["Kotlin", "Flutter", "React Native", "Firebase"], badges: ["Play Store ready", "Offline support"] },
        { title: "iOS App Development", desc: "iPhone & iPad apps for the App Store", icon: "TabletSmartphone", preview: "phoneIos",
          tag: "iOS", long: "Polished iPhone and iPad apps built to Apple's standards and launched on the App Store.",
          chips: ["Swift", "SwiftUI", "Flutter", "React Native"], badges: ["App Store ready", "Smooth UI"] },
        { title: "Game Development", desc: "Mobile, web & casual games", icon: "Gamepad2", preview: "game",
          tag: "GAMES", long: "Fun, engaging games for mobile and web, from casual hits to branded experiences.",
          chips: ["Unity", "Godot", "WebGL"], badges: ["Mobile & web", "Cross-platform"] },
      ],
    },
    {
      id: "advertising", label: "Advertising", icon: "Megaphone",
      headline: ["Ads that bring", "real customers", ""], allLink: "/services/advertising",
      services: [
        { title: "Search Ads (Google PPC)", desc: "Show up when customers search", icon: "Search", preview: "searchResults",
          tag: "SEARCH ADS", long: "Appear at the top of Google exactly when customers search for what you sell.",
          chips: ["Google Ads", "Keyword research", "Conversion tracking"], badges: ["Top of Google", "Pay per click"] },
        { title: "Social Media Ads", desc: "Facebook, Instagram, LinkedIn campaigns", icon: "Share2", preview: "socialPost",
          tag: "SOCIAL ADS", long: "Targeted campaigns that reach the right people on the platforms they use every day.",
          chips: ["Meta Ads", "Instagram", "LinkedIn Ads", "Targeting"], badges: ["Precise targeting", "More leads"] },
        { title: "Video & YouTube Ads", desc: "Video campaigns that get watched", icon: "Youtube", preview: "videoPlayer",
          tag: "VIDEO ADS", long: "Video ads people actually watch, on YouTube, Reels and beyond.",
          chips: ["YouTube Ads", "Reels Ads", "Scripting"], badges: ["High recall", "Brand reach"] },
        { title: "Display & Retargeting", desc: "Bring back visitors who didn't convert", icon: "Target", preview: "targetRings",
          tag: "RETARGETING", long: "Win back visitors who left without buying, with smart ads that follow up.",
          chips: ["Google Display", "Meta Pixel", "Remarketing"], badges: ["Win back visitors", "Lower cost"] },
        { title: "Influencer Marketing", desc: "Creator collabs that build trust", icon: "Users", preview: "creatorCards",
          tag: "INFLUENCERS", long: "Partner with the right creators to build trust and reach new audiences.",
          chips: ["Creator outreach", "UGC", "Campaign tracking"], badges: ["Real voices", "Authentic reach"] },
      ],
    },
    {
      id: "seo", label: "SEO", icon: "TrendingUp",
      headline: ["Get found", "on Google", ""], allLink: "/services/seo",
      services: [
        { title: "Local SEO", desc: "Rank on Google Maps in your city", icon: "MapPin", preview: "mapPins",
          tag: "LOCAL SEO", long: "Get found by nearby customers on Google Maps and local search.",
          chips: ["Google Business Profile", "Citations", "Reviews"], badges: ["Map pack", "Near me searches"] },
        { title: "On-Page & Content SEO", desc: "Keywords, content & blog strategy", icon: "FileText", preview: "docKeywords",
          tag: "CONTENT SEO", long: "Content and on-page optimisation that ranks and answers what customers search.",
          chips: ["Keyword research", "Blogs", "Meta tags"], badges: ["Rank higher", "Quality content"] },
        { title: "Technical SEO", desc: "Site speed, audits & Core Web Vitals", icon: "Settings", preview: "speedGauge",
          tag: "TECHNICAL SEO", long: "Fix the technical issues that hold your site back: speed, crawling and structure.",
          chips: ["Site audit", "Core Web Vitals", "Schema"], badges: ["Faster site", "Clean code"] },
        { title: "E-commerce SEO", desc: "Rank product & category pages", icon: "ShoppingCart", preview: "productGrid",
          tag: "E-COMMERCE SEO", long: "Get your products and categories in front of ready-to-buy shoppers.",
          chips: ["Product SEO", "Shopify SEO", "WooCommerce"], badges: ["More sales", "Product visibility"] },
        { title: "App Store Optimization", desc: "Grow downloads on Play Store & App Store", icon: "BarChart3", preview: "appListing",
          tag: "ASO", long: "Rank higher in app stores and turn listing views into downloads.",
          chips: ["Play Store", "App Store", "Keywords", "Screenshots"], badges: ["More downloads", "Better ranking"] },
      ],
    },
    {
      id: "creative", label: "Creative", icon: "Palette",
      headline: ["Designs that", "stop the scroll", ""], allLink: "/services/creative",
      services: [
        { title: "AI Video Editing", desc: "Reels, ads & YouTube edits powered by AI", icon: "Clapperboard", preview: "videoTimeline",
          tag: "AI VIDEO", long: "Fast, high-quality video edits for Reels, ads and YouTube, powered by AI tools.",
          chips: ["Reels", "YouTube", "AI tools", "Subtitles"], badges: ["Quick turnaround", "Scroll-stopping"] },
        { title: "Graphic Designing", desc: "Posters, brochures, banners & print", icon: "PenTool", preview: "poster",
          tag: "GRAPHIC DESIGN", long: "Eye-catching posters, brochures and banners, ready for print or online.",
          chips: ["Photoshop", "Illustrator", "Print-ready"], badges: ["Print & digital", "On-brand"] },
        { title: "Logo & Brand Identity", desc: "Logos, colours & brand guidelines", icon: "Layers", preview: "brandKit",
          tag: "BRANDING", long: "A memorable logo and a complete brand identity that sets you apart.",
          chips: ["Logo", "Color palette", "Brand book"], badges: ["Unique identity", "Brand guidelines"] },
        { title: "Social Media Creatives", desc: "Post designs, carousels & thumbnails", icon: "Instagram", preview: "carousel",
          tag: "SOCIAL CREATIVES", long: "Consistent, on-brand posts, carousels and thumbnails that grow your audience.",
          chips: ["Carousels", "Thumbnails", "Templates"], badges: ["Consistent feed", "More engagement"] },
        { title: "Ad Creatives", desc: "Scroll-stopping static & video ads", icon: "Sparkles", preview: "adVariants",
          tag: "AD CREATIVES", long: "Static and video ad designs built to grab attention and convert.",
          chips: ["Static ads", "Video ads", "A/B variants"], badges: ["Grab attention", "Test & improve"] },
      ],
    },
  ],
  about: [
    { title: "Company", desc: "Who we are & what drives us", href: "/about", icon: "Building2" },
    { title: "Our Process", desc: "How we take ideas to launch", href: "/process", icon: "Workflow" },
    { title: "Careers", desc: "Join the ArshX team", href: "/careers", icon: "Briefcase" },
    { title: "Contact", desc: "Talk to us about your project", href: "/contact", icon: "Mail" },
  ],
} as const;

/* ---------------- types & helpers (derived from the content above) ---------------- */
export type NavCategory = (typeof NAV.categories)[number];
export type NavService = NavCategory["services"][number];
export type PreviewType = NavService["preview"];
export type NavIconName = NavCategory["icon"] | NavService["icon"] | (typeof NAV.about)[number]["icon"];

/** Hrefs for the plain nav links (Services and About open menus instead). */
export const LINK_HREFS: Record<(typeof NAV.links)[number], string> = {
  Services: "/services",
  Work: "/work",
  Industries: "/industries",
  About: "/about",
  Blog: "/blog",
};

export const QUOTE_HREF = "/contact";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const serviceHref = (cat: NavCategory, svc: NavService) => `/services/${cat.id}/${slugify(svc.title)}`;

export const whatsappHref = () =>
  `https://wa.me/${NAV.whatsapp.number}?text=${encodeURIComponent(NAV.whatsapp.message)}`;

const ACRONYMS = new Set(["SEO", "ASO", "AI", "iOS", "UGC", "CMS"]);
/** "WEB APPS" -> "Web Apps", keeping acronyms ("TECHNICAL SEO" -> "Technical SEO"). */
export const tagLabel = (tag: string) =>
  tag
    .split(" ")
    .map((w) => (ACRONYMS.has(w) || /[a-z]/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase()))
    .join(" ");
