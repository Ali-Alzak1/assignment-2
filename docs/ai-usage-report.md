# AI Usage Report

## Tools Used
- **ChatGPT 5 Pro** — feature ideation and planning (the features themselves are *my ideas*; I used ChatGPT to pressure-test and refine them).
- **ChatGPT 5** and **GitHub Copilot** — fixing errors, refactoring small pieces, and explaining warnings.
- **Lovable** — quick CSS suggestions (spacing, contrast, hover states).
- *(Optional, in-app)* OpenAI-compatible API — the AI Helper panel can generate UX microcopy if a user pastes an API key in the browser. Without a key, it falls back to local, safe copy.

## Prompts (representative)
- “Propose Assignment 2 features that demonstrate dynamic content, data handling, animations, and robust error handling for a portfolio.”
- “Write accessible inline error messages for a contact form with a toast on success.”
- “Create a GitHub fetch demo with loading / empty / error states and a retry button.”
- “Suggest CSS improvements for hover/active states and reduced-motion support.”
- “Explain why my dialog focus is escaping and how to fix it.”

## Outputs and My Edits
- **HTML structure**: I kept the basic layout and semantics but streamlined markup. I added ARIA where needed (live regions, button labels), and ensured dialogs have proper titles and close buttons.
- **CSS**: I adopted color tokens and spacing ideas. With Lovable’s nudge, I improved contrast, consistent focus rings, and hover/active feedback. I added `prefers-reduced-motion` handling.
- **JS**: I retained the overall structure but split logic into small utilities (search, filter, sort, form validation, API demo, toasts). I added comments, early returns, and guard clauses. When ChatGPT/Copilot suggested code, I rewrote it to match my style and removed unnecessary complexity.
- **AI Helper**: Original concept suggested a fixed provider. I changed it to be key-based and optional (no key = local fallback), so the app stays functional without secrets.

## Understanding & Modifications
I can explain and modify all core paths:
- Project **filtering/sorting/live search**
- **IntersectionObserver** reveal on scroll
- **Theme toggle** with LocalStorage
- **Form validation** with inline errors and a success toast
- **API demo** (GitHub): loading → error + retry → empty
- **Modals** with accessible titles/close buttons
- **Quote widget** with a retry path and error state

## Ethics
- No private data is sent anywhere by default. Any optional AI request runs in the user’s browser with their key.
- The UI clearly explains that AI is optional and how the fallback works.
- I used AI as a helper, not a replacement: I verified suggestions, rewrote code, and ensured I understand how it works.

## Learning Outcomes
- Clean DOM utilities and accessible patterns (ARIA roles, labels, live regions).
- Robust user feedback: loading, error, retry, empty, and success states.
- Safer optional AI: key-in-browser with graceful degradation.
- Practical debugging: tracing event listeners, dialog focus, and fetch failures.

