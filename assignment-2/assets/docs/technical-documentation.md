# Technical Documentation

## Overview
This project extends Assignment 1 with interactive features, robust error handling, simple animations, and optional AI assistance. It is a single-page site using plain HTML/CSS/JS with no build step.

## Key Features
- Tabs with accessible roles + aria-selected switching
- Project grid with **search, filter, and sort**
- Expand/collapse details per project
- **Theme toggle** with LocalStorage
- **GitHub API** demo for data fetching
- **Contact form** with inline validation and success toast
- **Reveal-on-scroll** using IntersectionObserver
- **Optional AI Helper** panel that uses an OpenAI-compatible API if the user provides a key, otherwise provides a local fallback

## Data Handling
- LocalStorage keys:
  - `prefers-dark`: stores the user’s theme preference (true/false)
  - `ai_key`: stores an optional API key only in the browser
- API: `https://api.github.com/users/{user}/repos`
  - Loading indicator: `#ghStatus`
  - Error area with retry: `#ghError` and `#ghRetry`
  - Empty state if no repos

## Error Handling & UX
- Inline form errors are only shown when invalid.
- Toast appears on success and hides automatically.
- API: all network failures are caught, and a retry is offered.
- Live regions (`aria-live="polite"`) and polite status labels are used when content updates.

## Accessibility
- Semantic elements (header/main/section/footer)
- Tabs use `role="tablist"`, `role="tab"`, `aria-selected`
- Dialog for AI helper uses `<dialog>` with a close button; page focus remains manageable.
- Respects `prefers-reduced-motion` in CSS.

## Performance
- No external JS frameworks; tiny bundle.
- Uses `IntersectionObserver` to defer animations until visible.
- CSS transitions are lightweight.

## How to Extend
- Replace placeholder name and hero copy.
- Add more projects to the array or fetch from a JSON file.
- Connect a backend to store contact messages.
- Wire the AI helper to other providers if desired.

