## 2026-02-02 - Voice Orb Accessibility Block
**Learning:** `pointer-events: none` on wrapper elements can unintentionally block critical interactions for custom controls, making them inaccessible to mouse and touch users, even if visual affordances suggest interactivity.
**Action:** Always verify `pointer-events` on container elements when wrapping interactive components. Ensure custom interactive elements have explicit `role`, `tabIndex`, and keyboard handlers (`onKeyDown`) to support all users.
