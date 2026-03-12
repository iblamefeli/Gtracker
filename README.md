# GTracker

A minimal, AMOLED-dark study tracker built with React. Pomodoro timer, per-subject time logging, statistics, and a hierarchical notes editor — all running in the browser with no backend.

---

## Features

- **Pomodoro Timer** — Focus / Short Break / Long Break modes with a live SVG ring. Configurable durations. Whistle on start/pause, bell on completion.
- **Time Tracking** — All time is logged to `sessionLog` (single source of truth). Real-time per-subject tracking while the timer runs.
- **Statistics** — Time breakdown by Hour, Day, and Month. Per-subject bars with peak detection.
- **Daily Goals** — Each subject has a configurable daily goal with a real-time progress bar.
- **Subjects** — Full CRUD with icon picker (55+ Lucide icons + Greek letters), 15 preset colors, and 6 difficulty levels.
- **Notes** — Hierarchical outliner with indent levels, colored punctuation, clickable URLs, and copy/clear actions.
- **Themes** — 9 accent color themes including Matrix mode.
- **Fonts** — 5 font options (Mono, Sans, Helvetica, VSCode, Monaco).
- **Easter Eggs** — ZA WARUDO, confetti on round completion, +1UP animation, Wolfenstein difficulty sounds.
- **No backend** — Everything persists in `localStorage`.

---

## Stack

- React (Create React App)
- Lucide React (icons)
- Web Audio API (all sounds synthesized, no audio files)
- localStorage (persistence)

---

## Getting Started

```bash
git clone https://github.com/iblamefeli/Gtracker.git
cd Gtracker
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
└── App.js    # entire app — single file
```

---

## Keyboard Shortcuts (Notes)

| Key | Action |
|-----|--------|
| `Tab` | Indent line |
| `Shift+Tab` | Dedent line |
| `Enter` | New line at same indent level |
| `Backspace` on empty line | Delete line |

---

## Data & Privacy

All data is stored locally in your browser via `localStorage`. Nothing is sent to any server. Use the **BACKUP** button in Statistics to export a JSON snapshot of your data.

---

## License

MIT
