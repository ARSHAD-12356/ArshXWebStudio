import type { Metadata, Viewport } from "next";
import { Montserrat, Plus_Jakarta_Sans } from "next/font/google";
import { CONFIG } from "@/lib/config";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Preloader wordmark font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Inference at the Edge | ${CONFIG.BRAND_NAME}`,
  description:
    "Boost your AI application’s speed and efficiency globally by bringing inference closer to your users. Enjoy customization and cost-efficiency for a best-in-class inference experience.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${montserrat.variable} is-locked`}>
      <body>
        <noscript>
          <style>{`html.is-locked,html.is-locked body{overflow:auto!important}.preloader{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
