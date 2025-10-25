# AI Usage Report

## Tools Used
- ChatGPT (GPT-5 Thinking) for:
  - Feature ideation and planning
  - Generating initial scaffolding (HTML/CSS/JS)
  - Improving accessibility microcopy and error messages
  - Reviewing and refactoring code for clarity
  - Drafting parts of this documentation
- (Optional in-app) OpenAI-compatible API: AI Helper panel can generate UX microcopy if a user pastes an API key in the browser.

## Prompts (representative)
- “Propose Assignment 2 features that demonstrate dynamic content, data handling, animations, and robust error handling.”
- “Write accessible error messages for a contact form with inline validation and a toast on success.”
- “Create a GitHub fetch demo with loading/empty/error states and a retry button.”
- “Draft an optional AI helper UI that falls back to local logic when no API key is set.”

## Outputs and My Edits
- **HTML structure**: Adopted but simplified; added ARIA labels, tab roles, and dialog fallbacks.
- **CSS**: Adopted tokens/colors, added reduced-motion support, tweaked contrast, and refined hover/active states.
- **JS**: Kept structure but rewrote to smaller utilities, ensured graceful failure on API, and added comments.
- **AI Helper**: Original suggestion used a fixed provider; I changed it to be API-key based with a local fallback so the page still works without secrets.

## Understanding & Modifications
- I can explain the code paths for: project filtering, sorting, live search, IntersectionObserver reveal, theme persistence, form validation, and API error handling.
- I intentionally kept dependencies at 0 to make review easy and to focus on core JS patterns that I understand.

## Ethics
- No private data is transmitted. Any optional AI requests run client-side from the user’s browser. Clear fallback is provided. The UI explains the privacy and optional nature of the feature.

## Learning Outcomes
- Practiced clean DOM patterns and accessibility (ARIA, roles, live regions).
- Implemented robust user feedback (loading, errors, retry, empty states).
- Understood how to guard optional AI functionality behind user-provided credentials with graceful degradation.
