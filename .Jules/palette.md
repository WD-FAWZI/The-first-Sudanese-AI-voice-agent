## 2026-01-24 - Accessibility Patterns in React MPAs
**Learning:** In a static site using React via CDN without a router, standard `aria-current="page"` must be manually applied to the active link in each page's specific JS file, as there is no central navigation component that handles active state automatically.
**Action:** When working on similar architectures, check all page-specific JS files for consistent navigation accessibility.
