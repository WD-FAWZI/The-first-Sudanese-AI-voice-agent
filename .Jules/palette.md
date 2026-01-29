## 2026-01-29 - [Interaction Blocked by Wrapper]
**Learning:** The main call-to-action (Voice Orb) was wrapped in a container with `pointer-events: none`, rendering the app unusable. This highlights the importance of checking container styles when debugging non-interactive elements.
**Action:** When implementing visual wrappers or overlays, verify they do not unintentionally block user interaction, and always add keyboard handlers (onKeyDown) alongside mouse events.
