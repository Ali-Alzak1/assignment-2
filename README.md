# Assignment 2 – Interactive Features

Enhanced personal portfolio building on top of Assignment 1.

## 🚀 What’s New in Assignment 2
- Dynamic **project filter/sort + live search**
- **Theme toggle** (saved in LocalStorage)
- Accessible dialogs for per-project details (Figma link vs PowerPoint download)
- **Reveal-on-scroll** animations (reduced-motion friendly)
- **GitHub API** demo with loading/empty/error states + retry
- **Contact form** with inline validation and success toast
- Optional **AI Helper** panel (OpenAI-compatible, key-based) with a local fallback
- Clear empty states and user feedback across features

## 🗂 Project Structure
ASSIGNMENT-2/
├── assets/
│   └── images/
├── css/
├── docs/
├── js/
├── .gitignore
├── index.html
├── README.md
└── SWE216_Presentation.pdf




## 🧰 Running Locally
Just open `index.html` in a browser. No build step required.

For the optional AI Helper: open the helper pane, paste an OpenAI-compatible API key, and try generating microcopy. If no key is provided, the app uses a safe local fallback.

## 🔗 Project Details Links
- **Evaluation Hub** — opens Figma (design/prototype).
- **Student Impact Hub** — offers a direct **.pptx** download (or a proper exported PDF).

> Tip: If a PDF shows blank pages, ensure it’s a *true export* from PowerPoint (**File → Export → PDF**) rather than a renamed file.

## 🤖 AI Summary (High-Level)
- **ChatGPT 5 Pro** — brainstorming features and planning (features are my ideas; ChatGPT helped shape and prioritize).
- **ChatGPT 5 & GitHub Copilot** — fixing errors, clarifying warnings, and suggesting small refactors.
- **Lovable** — CSS suggestions for spacing, contrast, and states.
- Privacy: no secrets are hard-coded; optional AI runs client-side with a user-supplied key. A local fallback keeps the site fully functional.

> Full details are in `docs/ai-usage-report.md`.

## 🧪 Notes for Graders
- All new features are visible in the UI. Open the console to test error/retry flows.
- Reduced-motion is respected if enabled in your OS/browser.
- The API demo is client-side and needs network access.

## 🌐 Optional: Live Deploy
GitHub Pages:
1. Push to GitHub as `assignment-2`.
2. **Settings → Pages →** Deploy from branch (`main` / root).
3. Open the published URL after it builds.


