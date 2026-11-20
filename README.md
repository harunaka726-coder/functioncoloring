# Function Coloring (Web)

Browser version of **Function Coloring** — paint regions between math function graphs.

Production URL: `https://functioncoloring.harunakajima.com`

## Setup

```bash
cd webapp
npm install
```

## Development

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/`).

## Production build

```bash
npm run build
```

Output is written to `dist/`. Preview locally with `npm run preview`.

`vite.config.ts` uses `base: '/'` for root hosting on a subdomain.

## Deploy to Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages** → create a Pages project
2. Connect this repo (or upload `dist/`)
3. Build settings:
   - **Root directory:** `webapp`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Custom domains** → add `functioncoloring.harunakajima.com`

## Features

- SVG graph with pan (drag) and zoom (Ctrl/Cmd + scroll wheel)
- Function editor, palette painting, undo/redo
- Album stored in `localStorage` (thumbnails + editable project JSON)
- Import/export album JSON from Album or Settings
