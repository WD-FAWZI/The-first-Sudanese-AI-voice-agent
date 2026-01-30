## 2024-05-22 - Voice Orb Interaction Gap
**Learning:** The central interaction element (Voice Orb) was completely inaccessible due to `pointer-events: none` and missing semantic roles, rendering the core feature unusable for keyboard and mouse users.
**Action:** Always verify that decorative wrappers around interactive elements don't block pointer events and ensure key interactions have explicit keyboard handlers and ARIA labels.
