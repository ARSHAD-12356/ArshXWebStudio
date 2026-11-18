/**
 * Brand configuration. Change these to re-brand the whole page:
 * the preloader wordmark, nav, footer and every piece of copy that names the brand.
 */
export const CONFIG = {
  /** Wordmark letters (shown in the preloader, nav and footer). */
  BRAND: "GCORE",
  /** Brand name as used inside sentences. */
  BRAND_NAME: "Gcore",
  /** Legal line in the footer. */
  LEGAL:
    "PG-Core Labs S.A. © 2015–2024 All rights reserved. Principal place of business and postal address: 2-4, Rue Edmond Reuter, L-5326 Contern, Luxembourg",
} as const;

export const B = CONFIG.BRAND_NAME;
