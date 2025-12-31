# Life in Weeks

A minimalistic web app that visualizes your life as a grid of weeks. Each square represents one week — filled squares are weeks you've lived, empty squares are weeks remaining.

![Life in Weeks](https://img.shields.io/badge/Next.js-14-black?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square)

## Features

- **Life Grid** — 52 columns × 80 rows (4,160 weeks for 80 years)
- **Custom Date Picker** — Monochrome calendar UI for DOB entry
- **Zoom Controls** — Tiny, small, medium square sizes
- **Theme Toggle** — Dark (default) and light modes
- **Stats Display** — Minimal or detailed (weeks lived, remaining, percentage)
- **Milestones** — Optional markers at ages 18, 30, 50, 65
- **Year Labels** — Decade markers on the left side
- **Week Tooltip** — Hover to see week number, date, and age
- **Current Week** — Subtle pulse animation
- **Export as PNG** — Download your life grid as an image
- **Fullscreen Mode** — Distraction-free viewing
- **Keyboard Shortcuts** — `+`/`-` for zoom, `Esc` to close modals
- **Mobile Support** — Scroll and pinch-to-zoom
- **Persistence** — Settings saved in localStorage

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Export**: html-to-image

## Controls

| Control | Action |
|---------|--------|
| `-` / `+` | Zoom out / in |
| 📊 | Toggle detailed stats |
| 🚩 | Toggle milestone markers |
| ☀️ / 🌙 | Toggle theme |
| ⚙️ | Open settings |
| ⬇️ | Download as image |
| ⛶ | Toggle fullscreen |
| ✏️ | Edit date of birth |

## License

MIT
