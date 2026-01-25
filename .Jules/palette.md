# Palette's Journal

## 2024-05-22 - [Initial Setup]
**Learning:** This is a new journal for the project. The project is a Sudanese AI Voice Agent with a focus on premium visuals and accessibility.
**Action:** I will document critical UX/a11y learnings here.

## 2024-05-22 - [Accessibility: Navigation Semantics]
**Learning:** Visual indicators for active pages (like `.active` classes) are often missing their semantic counterpart `aria-current="page"`. This is common in multi-page applications where the state is hardcoded.
**Action:** Whenever I see an `.active` class on a navigation link, I must ensure `aria-current="page"` is also present.
