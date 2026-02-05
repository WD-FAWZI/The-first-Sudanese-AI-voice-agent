## 2025-05-22 - Critical Interactive Element Accessibility
**Learning:** The primary interactive element (Voice Orb) was completely inaccessible: it used `pointer-events: none` preventing clicks, lacked `role="button"`, and had no keyboard handlers. This pattern of visual-only "buttons" that rely on obscure triggers must be avoided.
**Action:** Always ensure custom interactive elements have `role="button"`, `tabIndex={0}`, explicit `onClick` and `onKeyDown` handlers, and proper ARIA labels reflecting their state.
