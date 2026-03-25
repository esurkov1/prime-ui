# Источники: responsive-дизайн и Flexbox-раскладка

15 источников для построения адаптивных макетов на Flexbox с акцентом на mobile-first.

---

## 1. A Complete Guide to CSS Flexbox — CSS-Tricks

**URL:** https://css-tricks.com/snippets/css/a-guide-to-flexbox/
**Тип:** документация / справочник
**Чем полезен:** Исчерпывающий визуальный справочник по всем свойствам flex-контейнера и flex-элементов с диаграммами осей и примерами значений.

---

## 2. Learn Responsive Design — web.dev

**URL:** https://web.dev/learn/design/
**Тип:** курс / гайд
**Чем полезен:** Полный курс от Google: media queries, macro/micro layouts, fluid typography, responsive images, accessibility, touch-взаимодействие.

---

## 3. Responsive Web Design Basics — web.dev

**URL:** https://web.dev/responsive-web-design-basics
**Тип:** статья
**Чем полезен:** Короткое введение в основы RWD: viewport meta, fluid grids, media queries, mobile-first подход.

---

## 4. Solved by Flexbox: Holy Grail Layout — Philip Walton

**URL:** https://philipwalton.github.io/solved-by-flexbox/demos/holy-grail/
**Тип:** демо / статья
**Чем полезен:** Классическая реализация Holy Grail layout на чистом Flexbox: sticky footer, равновысокие колонки, mobile-first collapse в одну колонку.

---

## 5. Modern Fluid Typography Using CSS Clamp — Smashing Magazine

**URL:** https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
**Тип:** статья
**Чем полезен:** Подробное объяснение `clamp()` для масштабирования шрифтов без breakpoints; формулы, accessibility-нюансы, интеграция с дизайн-системами.

---

## 6. Accessible Target Sizes Cheatsheet — Smashing Magazine

**URL:** https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/
**Тип:** cheat-sheet
**Чем полезен:** Практическая шпаргалка по WCAG 2.5.5 / 2.5.8: минимальные размеры touch-target (24 px AA, 44 px AAA), исключения, способы увеличения через padding.

---

## 7. Every Layout: The Sidebar

**URL:** https://every-layout.dev/layouts/sidebar/
**Тип:** гайд / паттерн
**Чем полезен:** Intrinsic-подход к sidebar + content на Flexbox без media queries; использование `flex-basis` и `clamp()` для автоматического перехода в одноколоночный вид.

---

## 8. Every Layout: Composition

**URL:** https://every-layout.dev/rudiments/composition
**Тип:** гайд / теория
**Чем полезен:** Принцип композиции layout-примитивов (Stack, Sidebar, Cluster) вместо монолитного CSS; применимо к построению страниц из компонентов UI-кита.

---

## 9. Sticky Footers — MDN Web Docs

**URL:** https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Sticky_footers
**Тип:** документация
**Чем полезен:** Рецепт sticky footer на Flexbox и CSS Grid от MDN; `min-height: 100vh` + `flex: 1` на main.

---

## 10. Building Responsive Equal-Height Cards with Flexbox — DEV Community

**URL:** https://dev.to/jennavisions/building-responsive-equal-height-cards-with-modern-css-magic-of-flexbox-no-media-queries-2h0b
**Тип:** статья
**Чем полезен:** Flex-wrap карточная сетка без media queries: `flex: 1 1 <basis>`, `align-items: stretch` для равной высоты.

---

## 11. Flexbox: The Ultimate CSS Flex Cheatsheet — freeCodeCamp

**URL:** https://www.freecodecamp.org/news/flexbox-the-ultimate-css-flex-cheatsheet
**Тип:** cheat-sheet
**Чем полезен:** Визуальная шпаргалка с анимированными диаграммами для каждого свойства Flexbox; удобна как быстрый справочник.

---

## 12. User Interface Patterns — web.dev

**URL:** https://web.dev/learn/design/ui-patterns
**Тип:** гайд
**Чем полезен:** Responsive-паттерны UI-элементов: навигация (overflow, hamburger, bottom bar), формы, медиа-объекты — с акцентом на progressive disclosure.

---

## 13. Responsive Web Design: A Complete Guide 2026 — Scrimba

**URL:** https://scrimba.com/articles/responsive-web-design-a-complete-guide-2026-2/
**Тип:** гайд
**Чем полезен:** Актуальный обзор RWD: container queries, fluid typography через `clamp()`, mobile-first стратегия, performance-оптимизация.

---

## 14. Accessible Navigation for Complex Websites: A 2026 UX Guide — Brand Vision

**URL:** https://www.brandvm.com/post/accessible-navigation-websites-ux-guide-2026
**Тип:** гайд
**Чем полезен:** Паттерны accessible responsive-навигации: hamburger, bottom bar, megamenu; ARIA-роли, keyboard-навигация, focus management при collapse.

---

## 15. Getting To The Bottom Of Minimum WCAG-Conformant Interactive Element Size — Smashing Magazine

**URL:** https://www.smashingmagazine.com/2024/07/getting-bottom-minimum-wcag-conformant-interactive-element-size
**Тип:** статья
**Чем полезен:** Глубокий разбор WCAG 2.5.8 (Level AA, 24 px) vs 2.5.5 (Level AAA, 44 px): точные правила, исключения, стратегии реализации для responsive-интерфейсов.
