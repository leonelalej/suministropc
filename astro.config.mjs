// astro.config.mjs — Mi PC Suministro
// Pure SSG output + React islands + Tailwind v4 via the Vite plugin.
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Static site generator: every route is pre-rendered HTML, hydrated
  // selectively by React islands (SearchBar, CategoryBar, ProductGrid, Cart).
  output: 'static',
  site: 'https://mipcsuministro.example.com',

  integrations: [
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // Ultra-fast delivery defaults
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },

  // The catalog is a read-only SSG (no POST endpoints), so the dev-time
  // CSRF origin check is unnecessary — and it breaks requests that arrive
  // through the preview gateway proxy (Sec-Fetch-Site: cross-site).
  security: {
    checkOrigin: false,
  },
});
