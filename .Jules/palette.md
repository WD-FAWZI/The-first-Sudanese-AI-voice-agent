## 2024-05-22 - Voice Orb Interactivity
**Learning:** The central "Voice Orb" (`voice-blob-wrapper`) was purely visual with `pointerEvents: 'none'`, requiring explicit reactivation and accessibility attributes to function as a control.
**Action:** Always verify that visual centerpieces intended as controls have `role="button"`, `tabIndex="0"`, and proper event handlers, and ensure `pointerEvents` allows interaction.
