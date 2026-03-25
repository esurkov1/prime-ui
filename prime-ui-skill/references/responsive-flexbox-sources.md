# Sources: responsive design and Flexbox layout

Fifteen resources for building adaptive layouts with Flexbox, with a mobile-first emphasis.

---

## 1. A Complete Guide to CSS Flexbox — CSS-Tricks

**URL:** https://css-tricks.com/snippets/css/a-guide-to-flexbox/
**Type:** documentation / reference
**Why it helps:** A thorough visual reference for every flex container and flex item property, with axis diagrams and example values.

---

## 2. Learn Responsive Design — web.dev

**URL:** https://web.dev/learn/design/
**Type:** course / guide
**Why it helps:** A full course from Google: media queries, macro/micro layouts, fluid typography, responsive images, accessibility, and touch interaction.

---

## 3. Responsive Web Design Basics — web.dev

**URL:** https://web.dev/responsive-web-design-basics
**Type:** article
**Why it helps:** A short introduction to RWD fundamentals: viewport meta tag, fluid grids, media queries, and a mobile-first approach.

---

## 4. Solved by Flexbox: Holy Grail Layout — Philip Walton

**URL:** https://philipwalton.github.io/solved-by-flexbox/demos/holy-grail/
**Type:** demo / article
**Why it helps:** A classic Holy Grail layout in pure Flexbox: sticky footer, equal-height columns, and mobile-first collapse to a single column.

---

## 5. Modern Fluid Typography Using CSS Clamp — Smashing Magazine

**URL:** https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
**Type:** article
**Why it helps:** A detailed look at `clamp()` for scaling type without breakpoints: formulas, accessibility considerations, and integration with design systems.

---

## 6. Accessible Target Sizes Cheatsheet — Smashing Magazine

**URL:** https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/
**Type:** cheat sheet
**Why it helps:** A practical WCAG 2.5.5 / 2.5.8 cheat sheet: minimum touch-target sizes (24 px AA, 44 px AAA), exceptions, and ways to enlarge targets with padding.

---

## 7. Every Layout: The Sidebar

**URL:** https://every-layout.dev/layouts/sidebar/
**Type:** guide / pattern
**Why it helps:** An intrinsic approach to sidebar + content in Flexbox without media queries, using `flex-basis` and `clamp()` to switch automatically to a single column.

---

## 8. Every Layout: Composition

**URL:** https://every-layout.dev/rudiments/composition
**Type:** guide / theory
**Why it helps:** How to compose layout primitives (Stack, Sidebar, Cluster) instead of monolithic CSS—useful when building pages from UI kit components.

---

## 9. Sticky Footers — MDN Web Docs

**URL:** https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Sticky_footers
**Type:** documentation
**Why it helps:** MDN’s sticky footer recipes with Flexbox and CSS Grid: `min-height: 100vh` plus `flex: 1` on main.

---

## 10. Building Responsive Equal-Height Cards with Flexbox — DEV Community

**URL:** https://dev.to/jennavisions/building-responsive-equal-height-cards-with-modern-css-magic-of-flexbox-no-media-queries-2h0b
**Type:** article
**Why it helps:** A flex-wrapped card grid without media queries: `flex: 1 1 <basis>` and `align-items: stretch` for equal heights.

---

## 11. Flexbox: The Ultimate CSS Flex Cheatsheet — freeCodeCamp

**URL:** https://www.freecodecamp.org/news/flexbox-the-ultimate-css-flex-cheatsheet
**Type:** cheat sheet
**Why it helps:** A visual cheat sheet with animated diagrams for each Flexbox property—handy as a quick reference.

---

## 12. User Interface Patterns — web.dev

**URL:** https://web.dev/learn/design/ui-patterns
**Type:** guide
**Why it helps:** Responsive UI patterns: navigation (overflow, hamburger, bottom bar), forms, and media objects—with an emphasis on progressive disclosure.

---

## 13. Responsive Web Design: A Complete Guide 2026 — Scrimba

**URL:** https://scrimba.com/articles/responsive-web-design-a-complete-guide-2026-2/
**Type:** guide
**Why it helps:** An up-to-date RWD overview: container queries, fluid typography with `clamp()`, mobile-first strategy, and performance optimization.

---

## 14. Accessible Navigation for Complex Websites: A 2026 UX Guide — Brand Vision

**URL:** https://www.brandvm.com/post/accessible-navigation-websites-ux-guide-2026
**Type:** guide
**Why it helps:** Patterns for accessible responsive navigation: hamburger, bottom bar, megamenu; ARIA roles, keyboard navigation, and focus management when collapsing.

---

## 15. Getting To The Bottom Of Minimum WCAG-Conformant Interactive Element Size — Smashing Magazine

**URL:** https://www.smashingmagazine.com/2024/07/getting-bottom-minimum-wcag-conformant-interactive-element-size
**Type:** article
**Why it helps:** A deep dive into WCAG 2.5.8 (Level AA, 24 px) vs 2.5.5 (Level AAA, 44 px): exact rules, exceptions, and implementation strategies for responsive interfaces.
