# Life in Weeks

A minimalistic web app that visualizes your life as a grid of weeks. Each square represents one week — filled squares are weeks you've lived, empty squares are weeks remaining.

![Life in Weeks](https://img.shields.io/badge/Next.js-14-black?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square)

## Features

- **Life Grid** — 52 columns × life expectancy rows
- **Custom Date Picker** — Monochrome calendar UI for DOB entry
- **Theme Toggle** — Dark (default) and light modes
- **Stats Display** — Age, weeks lived, weeks remaining, percentage, life expectancy
- **Animated Counting** — Stats animate on load
- **Year Labels** — Decade markers on the left side
- **Week Tooltip** — Hover to see week number, date, and age
- **Current Week** — Subtle pulse animation
- **Export as PNG** — Download your life grid as an image
- **Fullscreen Mode** — Distraction-free viewing
- **Settings Modal** — Grid size (tiny/small/medium), life expectancy slider, reset
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

| Location | Control | Action |
|----------|---------|--------|
| Top left | ✏️ | Edit date of birth |
| Top right | ☀️ / 🌙 | Toggle theme |
| Top right | ⚙️ | Open settings |
| Top right | ⬇️ | Download as image |
| Top right | ⛶ | Toggle fullscreen |

## Settings

| Option | Description |
|--------|-------------|
| Grid Size | Tiny, Small, or Medium squares |
| Life Expectancy | Slider from 50-100 years |
| Reset | Clear all saved data |

## License

MIT
