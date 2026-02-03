## 2025-02-18 - Voice Orb Interaction Blocked
**Learning:** Decorative wrappers (like `voice-blob-wrapper`) with `pointer-events: none` can silently kill core interactions if not carefully managed.
**Action:** When debugging non-responsive elements, check parent containers for `pointer-events` style overrides first.
