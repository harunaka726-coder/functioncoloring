# Function Coloring (Web)

Browser version of **Function Coloring** — paint regions between math function graphs.

## Setup

```bash
cd webapp
npm install
```

## Development

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/functioncoloring/`).

## Production build

```bash
npm run build
```

Output is written to `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Deploy to GitHub Pages

This app is configured with `base: '/functioncoloring/'` in `vite.config.ts` for a project site at:

`https://<username>.github.io/functioncoloring/`

1. Build: `npm run build`
2. Deploy the contents of `dist/` to the `gh-pages` branch (or use GitHub Actions).

Example with `gh-pages` npm package:

```bash
npm install -D gh-pages
npx gh-pages -d dist
```

Ensure the repository is named `functioncoloring` (or update `base` in `vite.config.ts` to match your repo name).

## Features

- SVG graph with pan (drag) and zoom (Ctrl/Cmd + scroll wheel)
- Function editor, palette painting, undo/redo
- Album stored in `localStorage` (thumbnails + editable project JSON)
- Import/export album JSON from Album or Settings