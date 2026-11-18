// Dev server: Turbopack + its own output folder (.next-dev) so it can run alongside `npm run build`.
process.env.NEXT_DIST_DIR = ".next-dev";
process.argv = [process.argv[0], require.resolve("next/dist/bin/next"), "dev", "--turbopack", ...process.argv.slice(2)];
require("next/dist/bin/next");
