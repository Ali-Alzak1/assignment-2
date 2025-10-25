# Technical Documentation

## Overview
This is a single-page portfolio (HTML/CSS/JS, no build step) that extends Assignment 1. It adds interactive features, strong error handling, subtle animations, and an optional AI Helper panel. All features are client-side.

## Key Features (maps to Assignment 2 requirements)
- **Dynamic content**
  - Project grid with **live search**, **filter by tag**, and **sort** (newest/oldest/A–Z/Z–A).
  - Expandable details via accessible dialogs (per-project “More info”).
  - Personalized greeting with a **“Personalize”** action (local name).
- **Data handling**
  - **LocalStorage** for theme and optional user name.
  - **GitHub API** demo with loading, error + retry, and empty states.
  - **Contact form** with inline validation and a success toast.
- **Animation & transitions**
  - Reveal-on-scroll via **IntersectionObserver**.
  - Smooth hover/focus states and section transitions.
  - Respects `prefers-reduced-motion`.
- **Error handling & user feedback**
  - Inline errors for invalid form fields.
  - API demo has loading → error + retry → empty states.
  - Clear empty state for project filtering.
  - Toasts for success; polite live regions for updates.
- **AI enhancement**
  - Optional **AI Helper** panel (OpenAI-compatible). If no key is provided, it falls back to local, safe copy so the site works without secrets.

## Data Handling
- **LocalStorage keys**
  - `prefers-dark`: boolean for theme preference.
  - `username`: optional, for the personalized greeting.
  - `ai_key`: optional key used only in the browser for the AI Helper.
- **API**
  - `https://api.github.com/users/{user}/repos`
  - UI elements: `#ghStatus` (loading), `#ghError` (error), `#ghRetry` (retry button), and an empty state message when needed.
- **Forms**
  - Required fields with inline errors (`aria-live="polite"`).
  - Submit → spinner → success toast (no server persistence in this assignment).

## Accessibility
- Semantic HTML: `header`, `main`, `section`, `footer`.
- ARIA: labels for interactive controls, live regions for updates.
- Dialogs: titled `<dialog>` with a close button and focus management hints.
- Color/contrast checked; clear focus rings.
- Respects `prefers-reduced-motion`.

## Performance
- Zero dependencies; small JS.
- IntersectionObserver defers animations until elements are visible.
- `loading="lazy"` on images; lightweight transitions.

## How to Extend
- Add more projects via JSON or a small data file.
- Connect a backend to persist contact messages.
- Extend the AI Helper to additional providers or add simple prompt templates.
- Add tag multi-select or saved filters.
