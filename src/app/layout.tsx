import type { Metadata, Viewport } from "next";
import { DM_Sans, Montserrat, Plus_Jakarta_Sans } from "next/font/google";
import { CONFIG } from "@/lib/config";
import Preloader from "@/components/Preloader";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Preloader fonts: name (Montserrat) + tagline (DM Sans)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Inference at the Edge | ${CONFIG.BRAND_NAME}`,
  description:
    "Boost your AI application’s speed and efficiency globally by bringing inference closer to your users. Enjoy customization and cost-efficiency for a best-in-class inference experience.",
};

export const viewport: Viewport = {
  themeColor: "#01040C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${montserrat.variable} ${dmSans.variable} is-locked`}>
      <body>
        <noscript>
          <style>{`html.is-locked,html.is-locked body{overflow:auto!important}.axl{display:none!important}`}</style>
        </noscript>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
