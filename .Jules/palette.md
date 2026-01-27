## 2024-05-21 - [Voice Orb Accessibility]
**Learning:** The "Voice Orb" is a custom interactive element that behaves like a toggle button but looks like a decorative element. Standard `<button>` roles are insufficient without dynamic state feedback (`aria-pressed`, dynamic `aria-label`).
**Action:** When creating custom "orb" or "avatar" interactions, always map internal state (`isActive`, `isConnecting`) to ARIA attributes (`aria-pressed`, `aria-busy`) to ensure screen readers perceive the "alive" nature of the component.
