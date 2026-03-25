---
name: prime-ui-responsive-app
description: >
  Responsive mobile-first макеты на prime-ui-kit (Flexbox, CSS Modules, --prime-sys-* токены).
  Применяй когда: строишь страницу / макет / шаблон / форму / навигацию / дашборд
  на компонентах prime-ui-kit; переводишь desktop-макет в mobile-first; нужен рецепт
  Flexbox-раскладки (sidebar+content, card grid, holy grail, sticky footer); выбираешь
  компонент кита для зоны макета; проверяешь responsive-поведение (breakpoints,
  touch-target, overlay vs inline). Содержит: layout-рецепты (dashboard, settings,
  catalog, landing, form wizard), responsive-каталог 41 компонента, дизайн-токены,
  anti-patterns.
---

# prime-ui-responsive-app

## Visual Language & Design Tokens

Любой responsive-макет на prime-ui-kit **обязан** соблюдать визуальный язык системы.
Полный справочник токенов: [`references/design-tokens.md`](references/design-tokens.md).

### Обязательные правила

1. **Только semantic-токены.** Все визуальные значения (цвет, отступ, радиус, тень, z-index,
   анимация) берутся из `--prime-sys-*`. Примитивы `--prime-ref-*` в layout запрещены.
2. **Нет хардкода.** Ни одного hex-цвета, px-отступа, числового z-index или кастомной тени
   в стилях макета. Только токены.
3. **Тема через `data-theme`.** Компонент не знает о теме — знает только semantic roles.
   Light и dark поддерживаются в равной степени.
4. **CSS Modules + CSS variables.** Tailwind в prime-ui-kit не используется.
5. **Размер контролов — через `size` prop.** Layout не переопределяет height кнопок и полей.

### Ключевые токены для layout

| Категория | Префикс | Пример |
|-----------|---------|--------|
| Фоны | `--prime-sys-color-surface-*` | `surface-default`, `raised`, `overlay` |
| Текст | `--prime-sys-color-content-*` | `content-primary`, `secondary`, `muted` |
| Бордеры | `--prime-sys-color-border-*` | `border-separator`, `subtle`, `strong` |
| Отступы | `--prime-sys-spacing-*` | `spacing-s` (8px), `spacing-l` (16px), `spacing-4xl` (32px) |
| Радиусы | `--prime-sys-shape-radius-*` | `radius-m` (11px), `radius-4xl` (24px) |
| Тени | `--prime-sys-elevation-shadow-*` | `shadow-surface`, `shadow-modal` |
| Z-index | `--prime-sys-elevation-zIndex-*` | `zIndex-sticky` (100), `zIndex-modal` (2000) |
| Анимации | `--prime-sys-motion-*` | `duration-fast` (200ms), `easing-standard` |

---

## Core Principles

### 1. Mobile-first: column → row

Начинай с `flex-direction: column`. Расширяй через `@media (min-width: …)` в `row`.
Это гарантирует рабочий вид на любом viewport без дополнительных стилей.

### 2. Breakpoints

| Токен | min-width | Типичный контекст |
|-------|-----------|-------------------|
| `sm`  | 640 px    | Крупные телефоны, landscape |
| `md`  | 768 px    | Планшет portrait |
| `lg`  | 1024 px   | Планшет landscape, ноутбук |
| `xl`  | 1280 px   | Desktop |

Контент определяет breakpoints, не устройство. Если макет ломается раньше — добавь промежуточный breakpoint.

### 3. Flexbox-паттерны

- **Sidebar + Content:** контейнер `display: flex; flex-wrap: wrap`, sidebar `flex: 0 0 280px`,
  content `flex: 1 1 0%`. На `< md` — column, sidebar = 100 %.
- **Holy Grail:** body `flex-direction: column; min-height: 100vh`, средняя секция `flex: 1; display: flex`,
  main `flex: 1`, aside `flex: 0 0 <width>`.
- **Card grid:** контейнер `display: flex; flex-wrap: wrap; gap: var(--prime-sys-spacing-l)`,
  карточка `flex: 1 1 calc(33.33% - var(--prime-sys-spacing-l))`, min-width для перестройки.
- **Sticky footer:** body `display: flex; flex-direction: column; min-height: 100vh`,
  main `flex: 1 0 auto`, footer `flex-shrink: 0`.

### 4. Spacing

Используй `--prime-sys-spacing-*` для gap, padding, margin. Для fluid spacing — `clamp()`:
`gap: clamp(var(--prime-sys-spacing-s), 2vw, var(--prime-sys-spacing-xl))`.
Не смешивай px-литералы с токенами в одном контексте.

### 5. Touch targets

Минимум 44 × 44 px (WCAG 2.5.5 AAA). На мобильных:
- Button, Select, Input — `size="l"`.
- Checkbox, Radio, Switch — увеличивать padding зоны клика.
- LinkButton — `size="m"` минимум.

### 6. Accessible responsive навигация

- Desktop: Sidebar фиксирован, `flex-shrink: 0`.
- Mobile (`< md`): Sidebar → Drawer (`position="left"`), триггер — кнопка-гамбургер.
- Breadcrumb сокращается автоматически через `maxItems`.
- Tabs: горизонтальная прокрутка или замена на Accordion.
- CommandMenu: доступен на всех viewport через кнопку.

### 7. Контент → breakpoint

Не привязывайся к устройствам. Breakpoint ставится там, где макет перестаёт выглядеть хорошо.
Используй DevTools Responsive Mode для проверки промежуточных ширин.

---

## Layout Recipes

### Dashboard

**Зоны:** Sidebar (навигация) + Header (Breadcrumb, Avatar, CommandMenu) + Content (Tabs, DataTable, ProgressBar, Badge).

**Flexbox-структура:**
- Root: `flex-direction: row` на `≥ lg`, `column` на `< lg`.
- Sidebar: `flex: 0 0 260px`, на `< lg` → Drawer.
- Main: `flex: 1; display: flex; flex-direction: column`.
- Content area: Tabs переключают DataTable / карточки с ProgressBar.
- Footer content: Pagination.

**Responsive-переходы:**
- `< lg`: Sidebar скрыт → Drawer; Tabs прокручиваются горизонтально.
- `< md`: DataTable → горизонтальная прокрутка с закреплённой первой колонкой.
- `< sm`: Stepper (если есть) → вертикальный; Badge может терять текст.

---

### Settings Page

**Зоны:** Sidebar (вертикальная навигация разделов) + Content (форма: Label, Input, Select, Switch, Textarea, Button).

**Flexbox-структура:**
- Root: `flex-direction: row` на `≥ md`, `column` ниже.
- Sidebar: `flex: 0 0 220px`, содержит Sidebar с группами.
- Form area: `flex: 1`, поля в `flex-direction: column`, `gap: var(--prime-sys-spacing-2xl)`.
- Группы полей разделены Divider.
- Footer формы: ButtonGroup (Save + Cancel), `justify-content: flex-end`.

**Responsive-переходы:**
- `< md`: Sidebar → Tabs или Accordion; форма на 100 % ширины.
- Все Input, Select, Textarea — `fullWidth`.
- Button — `fullWidth` на `< sm`.

---

### Catalog / E-commerce

**Зоны:** Header (Input поиска, SegmentedControl вид) + Filters (Checkbox, Radio, Slider, Tag) + Grid (карточки с Avatar, Badge, Button).

**Flexbox-структура:**
- Toolbar: `flex-direction: row; flex-wrap: wrap; gap`.
- Body: `flex-direction: row` на `≥ md`.
- Filters sidebar: `flex: 0 0 260px`.
- Grid: `flex: 1; display: flex; flex-wrap: wrap; gap`.
- Карточка: `flex: 1 1 calc(33.33% - gap)`, `min-width: 280px`.

**Responsive-переходы:**
- `< md`: Filters → Drawer (bottom); активные фильтры — строка Tag в flex-wrap.
- `< sm`: Карточки → `flex: 1 1 100%`, одна колонка.
- SegmentedControl → Select на `< sm` при > 3 сегментах.
- Pagination → компактный режим (стрелки + номер).

---

### Landing / Marketing

**Зоны:** Header (навигация LinkButton, Button CTA) + Hero (Typography, Button) + Features (карточки) + FAQ (Accordion) + Footer.

**Flexbox-структура:**
- Секции: `flex-direction: column; align-items: center; max-width: 1200px; margin: 0 auto`.
- Hero: `flex-direction: column` на `< md`, `row` на `≥ md` (текст + изображение).
- Features: flex-wrap карточки, аналогично Catalog Grid.
- FAQ: Accordion на 100 % max-width.
- Banner: полная ширина, над/под hero.
- Footer: `flex-wrap` колонки ссылок.

**Responsive-переходы:**
- `< md`: навигация → Drawer; Hero stacks вертикально.
- `< sm`: ButtonGroup CTA → `vertical`; Typography уменьшает `variant`.
- Banner занимает 100 % ширины на всех viewport.

---

### Form Wizard

**Зоны:** Stepper (прогресс) + Step content (Input, Checkbox, Select, Datepicker, FileUpload, DigitInput) + Actions (Button prev/next).

**Flexbox-структура:**
- Stepper: горизонтальный на `≥ md`, вертикальный на `< md`.
- Step body: `flex-direction: column; gap; max-width: 600px; margin: 0 auto`.
- Actions: `display: flex; justify-content: space-between`.
- Каждый шаг — Modal или Drawer на мобильных, inline на desktop.

**Responsive-переходы:**
- `< md`: Stepper вертикальный; шаг может быть в Drawer (bottom).
- `< sm`: Button actions — `fullWidth`, стек вертикально.
- DigitInput — крупный `size` для пальцевого ввода.
- ProgressBar под Stepper для визуализации общего прогресса.

---

## Component Quick-Reference

15 ключевых компонентов для responsive-раскладок:

| Компонент | Роль в responsive-макете | Типичная зона | Документация |
|-----------|-------------------------|---------------|-------------|
| Sidebar | Навигация; desktop inline → mobile Drawer | sidebar | `components/sidebar.md` |
| Drawer | Overlay-панель; замена модалок и сайдбаров на mobile | overlay | `components/drawer.md` |
| Tabs | Переключение контента; scroll на mobile | content | `components/tabs.md` |
| DataTable | Таблица с горизонтальной прокруткой на mobile | content | `components/data-table.md` |
| Button | CTA; `size="l"` + `fullWidth` на mobile | form, footer | `components/button.md` |
| Input | Поле ввода; `fullWidth` в мобильных формах | form | `components/input.md` |
| Select | Выбор; портальное меню, `fullWidth` | form | `components/select.md` |
| Modal | Диалог; на mobile → Drawer (bottom) | overlay | `components/modal.md` |
| Accordion | Раскрытие; замена Tabs на узких viewport | content | `components/accordion.md` |
| Breadcrumb | Путь; auto-collapse через `maxItems` | header | `components/breadcrumb.md` |
| Stepper | Прогресс; horizontal → vertical на mobile | content | `components/stepper.md` |
| Pagination | Страницы; compact-режим на mobile | footer | `components/pagination.md` |
| Typography | Текст; менять `variant` по breakpoint или fluid | content | `components/typography.md` |
| SegmentedControl | Переключатель; → Select при > 4 сегментов на mobile | header | `components/segmented-control.md` |
| Notification | Тосты; fullWidth внизу на mobile | overlay | `components/notification.md` |

Полная таблица всех 41 компонентов: [`references/component-catalog.md`](references/component-catalog.md).

---

## Sources

| # | Название | URL |
|---|---------|-----|
| 1 | A Complete Guide to CSS Flexbox — CSS-Tricks | https://css-tricks.com/snippets/css/a-guide-to-flexbox/ |
| 2 | Learn Responsive Design — web.dev | https://web.dev/learn/design/ |
| 3 | Responsive Web Design Basics — web.dev | https://web.dev/responsive-web-design-basics |
| 4 | Solved by Flexbox: Holy Grail — Philip Walton | https://philipwalton.github.io/solved-by-flexbox/demos/holy-grail/ |
| 5 | Modern Fluid Typography Using CSS Clamp — Smashing Magazine | https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/ |
| 6 | Accessible Target Sizes Cheatsheet — Smashing Magazine | https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/ |
| 7 | Every Layout: The Sidebar | https://every-layout.dev/layouts/sidebar/ |
| 8 | Every Layout: Composition | https://every-layout.dev/rudiments/composition |
| 9 | Sticky Footers — MDN | https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Sticky_footers |
| 10 | Equal-Height Cards with Flexbox — DEV Community | https://dev.to/jennavisions/building-responsive-equal-height-cards-with-modern-css-magic-of-flexbox-no-media-queries-2h0b |
| 11 | Flexbox Cheatsheet — freeCodeCamp | https://www.freecodecamp.org/news/flexbox-the-ultimate-css-flex-cheatsheet |
| 12 | User Interface Patterns — web.dev | https://web.dev/learn/design/ui-patterns |
| 13 | Responsive Web Design Guide 2026 — Scrimba | https://scrimba.com/articles/responsive-web-design-a-complete-guide-2026-2/ |
| 14 | Accessible Navigation Guide 2026 — Brand Vision | https://www.brandvm.com/post/accessible-navigation-websites-ux-guide-2026 |
| 15 | Minimum WCAG-Conformant Element Size — Smashing Magazine | https://www.smashingmagazine.com/2024/07/getting-bottom-minimum-wcag-conformant-interactive-element-size |

Развёрнутые аннотации: [`references/responsive-flexbox-sources.md`](references/responsive-flexbox-sources.md).

---

## Anti-Patterns

### 1. `width: 100vw` вместо `width: 100%`

`100vw` включает ширину скроллбара → горизонтальный overflow. Используй `100%` или не задавай `width` вовсе (блочные элементы и так занимают 100 %).

### 2. `height: 100vh` на мобильных

Safari считает `100vh` без учёта URL bar → контент обрезается. Используй `min-height: 100dvh` (dynamic viewport) или fallback `min-height: 100vh` + `-webkit-fill-available`.

### 3. Sidebar без `flex-shrink: 0`

Без `flex-shrink: 0` sidebar сжимается при переполнении content-зоны. Всегда ставь `flex: 0 0 <width>` для фиксированной боковой колонки.

### 4. Нативный `<table>` без обёртки прокрутки

Широкие таблицы ломают layout. Используй DataTable, который оборачивает содержимое в `overflow-x: auto` и закрепляет первую колонку.

### 5. Modal вместо Drawer на мобильных

Modal по центру viewport неудобен для touch-взаимодействия: нижняя часть экрана недоступна одной рукой. На `< md` заменяй Modal на Drawer с `position="bottom"`.

### 6. Мелкие touch-targets

Интерактивные элементы < 44 px на мобильных. Используй `size="l"` для Button, Input, Select. Для Checkbox и Radio увеличивай padding контейнера.

### 7. Фиксированные px-ширины в flex-элементах

`width: 300px` не адаптируется. Используй `flex-basis` + `min-width` / `max-width` или процентные значения с `clamp()`.

### 8. Хардкод визуальных значений вместо токенов

`background: #f3f4f7`, `gap: 16px`, `border-radius: 12px`, `z-index: 999` — всё это ломает темизацию и консистентность. Используй `--prime-sys-*` токены. Подробнее: [`references/design-tokens.md`](references/design-tokens.md).
