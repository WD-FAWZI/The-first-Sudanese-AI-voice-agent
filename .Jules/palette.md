## 2026-02-01 - Critical Accessibility Blockers
**Learning:** Found `pointer-events: none` on the primary interaction element (Voice Orb), rendering it completely inaccessible to mouse and keyboard users despite looking interactive.
**Action:** Always verify `pointer-events` on custom interactive wrappers and ensure `onClick`, `onKeyDown`, and ARIA roles are present on the actual trigger element, not just children or parents.
**Learning:** Project uses Arabic UI/text despite English variable names; reviewers may misidentify this as a localization error. Always check surrounding component text (e.g., navigation links) to confirm locale.
**Action:** When adding ARIA labels, match the existing UI language (Arabic) and explicitly note this in PR descriptions to prevent review confusion.

**Learning:** Repo has `package-lock.json` but mandates `pnpm`. Running `pnpm install` generates `pnpm-lock.yaml`.
**Action:** Delete `pnpm-lock.yaml` before submission to avoid committing untracked lockfiles in a repo that might be mixed-manager or legacy.
