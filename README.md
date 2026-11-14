# Devart portfolio

A white-first portfolio for software, embedded systems and web work, with small light-blue accents, technical typography and interactive code examples. Static HTML, CSS and JavaScript, bundled with Vite. Fonts and supplied brand SVGs are hosted locally.

## Run

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

Deploy the generated `dist` directory to any static hosting service. Contact links open an email draft to `akelmendi029@gmail.com`; no backend or form service is required.

## Check

With the development server on port 5173:

```sh
npx playwright install chromium
npm run check
npm run check:thought
npm run check:hero
```

The browser check covers responsive overflow, local font loading, navigation, service disclosure controls, motion preferences, clipboard feedback and browser errors.

The thought experiment after the project showcase opens three browser-style tabs as the visitor scrolls. Its clarity slider removes visual noise from an illustrative network. Mobile, short viewports and reduced-motion preferences use normal document flow with directly accessible tabs. The focused check covers scroll stages, slider input, keyboard tabs and these fallbacks. Implementation lives in `src/thought.js` and `src/thought.css`.

The hero runs a 19-second, one-shot particle formation using the exact supplied symbol paths. It settles into the solid SVG and a final blue signal, with an explicit replay button. Canvas work pauses offscreen and in background tabs; reduced motion shows the finished mark immediately. The static SVG remains visible if initialization fails. `check:hero` verifies the sequence, replay, pause behavior and mobile fallback with a controlled browser clock.

Edit page content in `index.html`, design tokens and responsive styles in `src/style.css`, and interactions in `src/main.js`. The four project previews are captures of the sites supplied by Art. Aureberries links to its working GitHub Pages deployment. Refresh screenshots with `node scripts/capture-work.mjs`. Capture source records accompany each image. No unverified social profiles are included.
