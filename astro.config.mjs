// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://suibari.com",
  redirects: {
    // 旧URL
    "/develop": "/projects",
  },
  integrations: [tailwind({ applyBaseStyles: false })],
});
