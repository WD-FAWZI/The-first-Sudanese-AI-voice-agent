## 2024-05-22 - [Critical Accessibility Fix: Voice Orb Interaction]
**Learning:** The central "Voice Orb" component, intended to be the primary interaction point, was implemented as a purely decorative element with `pointer-events: none` and no keyboard handlers. This rendered the core feature inaccessible.
**Action:** When auditing key interactive elements, always verify `pointer-events`, `tabIndex`, and keyboard event handlers (`onKeyDown`), especially for custom `div` implementations of buttons. Ensure `aria-label` dynamically reflects the state (e.g., "Start" vs "End").
