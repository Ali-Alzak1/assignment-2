# Technical Documentation

## Overview
This project builds directly on Assignment 1, turning the static portfolio into a fully interactive one.  
All new features were designed to improve user experience, add interactivity, and make the site more dynamic while keeping it simple and accessible.

## Key Enhancements from Assignment 1
- **Dynamic greeting** that changes based on user input.
- **Dark/light theme toggle** with a visual notification and local storage to save preference.
- **Filter, search, and sort** functions in the project section.
- **Expanded “About Me”** section with hidden content users can reveal.
- **Project modals** showing design or documentation files (Figma link or PowerPoint/PDF download).
- **Scroll-based animations** using Intersection Observer for a smooth reveal effect.
- **API demonstration** that handles loading, error, retry, and empty states.
- **Accessible form validation** with inline errors and success feedback.

## Data Handling
- Uses **LocalStorage** to remember theme preference and user name.
- Fetches from **GitHub’s public API** to demonstrate loading and error states.
- Displays fallback messages if data fails to load.

## Accessibility and Feedback
- Semantic HTML structure (`header`, `main`, `section`, `footer`).
- ARIA labels, roles, and live regions.
- Inline validation for form fields.
- Toast messages and polite live updates for user feedback.
- Respects reduced-motion preferences in animations.

## Tools and AI Integration
- **ChatGPT 5 Pro** for feature ideation and planning.
- **ChatGPT 5** and **GitHub Copilot** for debugging and cleanup.
- **Lovable** for complete dark mode design and style refinements.

## Summary
Assignment 2 focuses on improving interactivity, accessibility, and user feedback.  
All features are lightweight, responsive, and built with plain HTML, CSS, and JavaScript — no frameworks or external dependencies.
