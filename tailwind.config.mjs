/**
 * tailwind.config.mjs — Mi PC Suministro
 * Loaded from src/styles/global.css via the `@config` directive (Tailwind v4).
 * The design system is intentionally tiny: monochrome zinc ramp + ONE accent.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    './public/**/*.svg',
  ],
  theme: {
    extend: {
      colors: {
        // Single purposeful accent — sampled from the Mi PC brand mark (cyan).
        accent: {
          DEFAULT: '#22d3ee', // cyan-400 — used for: live dot, active price cues, WhatsApp CTA
          soft: '#67e8f9', // cyan-300 — hover states
          dim: '#0e7490', // cyan-700 — subtle borders on dark
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'SF Mono',
          'Menlo',
          'Cascadia Code',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
      transitionTimingFunction: {
        tactile: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
