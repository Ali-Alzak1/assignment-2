# Assignment 2 – Interactive Features

Enhanced personal portfolio built on top of Assignment 1.

## 🚀 What’s new in Assignment 2

- Dynamic project filter/sort + live search
- Theme toggle (saved in LocalStorage)
- Smooth section tabs (About / Projects / Contact)
- Fetch GitHub repos via API (with loading/empty/error states + retry)
- Animated UI (fade/slide/hover, reduced-motion friendly)
- Form validation with inline errors and success toast
- Optional AI copy helper (works if you paste an API key at runtime) — with safe fallback
- Comprehensive error handling and user feedback across features
- Updated docs including an AI usage report

## 🗂 Project structure

```
assignment-2/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/  # copied from Assignment 1
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

## 🧰 Running locally

Just open `index.html` in a browser. No build step required.

> For the optional AI copy helper: open the “AI Helper” pane, paste an API key (OpenAI compatible), and try generating microcopy. If no key is provided, the app uses a safe local fallback.

## 🌐 Live deploy (optional)

You can publish with **GitHub Pages**:
1. Push this repo to GitHub as `assignment-2`
2. Settings → Pages → Deploy from branch → `main` / root
3. Wait for the published URL

## 🧪 Notes for graders

- All new features are visible in the UI. Open the console for extra logs when testing failure cases.
- Reduce-motion is respected if your OS/browser has it enabled.
- API fetching is client-side and works without any server.
