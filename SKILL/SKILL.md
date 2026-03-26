---
name: prime-ui-responsive-app
description: >
  Строит адаптивные mobile-first экраны на prime-ui-kit: Flexbox, CSS Modules, токены --prime-sys-*.
  Использовать при вёрстке страниц, шаблонов, форм, навигации, дашбордов; при переводе desktop-макета
  в mobile-first; при выборе компонента региона; при проверке брейкпоинтов, touch targets, Drawer vs inline.
  Включает рецепты (дашборд, настройки, каталог, лендинг, мастер формы), каталог из 41 компонента, антипаттерны.
  Негласуемо: без кастомных оболочек и перекраски kit-компонентов — только примитивы, дефолтные стили и публичный API.
---

# prime-ui-responsive-app

**Роль агента:** внедрять UI строго через документированные компоненты prime-ui-kit и семантические токены; не «улучшать» внешний вид обёртками и переопределением стилей kit.

## Когда применять

- Верстка/рефакторинг layout под разные ширины, touch, overlay.
- Вопросы «чем закрыть регион», «как сложить сетку/сайдбар/футер» в экосистеме kit.
- Проверка соответствия дизайн-системе (токены, размеры, доступность).

## Документация (где смотреть)

| Что | В репозитории | После `npm install prime-ui-kit` |
|-----|----------------|-----------------------------------|
| API, props, примеры компонента | `../src/components/<kebab>/COMPONENT.md` | `node_modules/prime-ui-kit/src/components/<kebab>/COMPONENT.md` |
| Токены | [`design-tokens.md`](./design-tokens.md) | `node_modules/prime-ui-kit/SKILL/design-tokens.md` |
| Все 41 компонент, роли в layout | [`component-catalog.md`](./component-catalog.md) | рядом с `SKILL.md` в пакете |

Установка skill в Cursor: каталог `SKILL/` целиком (чтобы `SKILL.md`, `design-tokens.md`, `component-catalog.md` остались рядом).

---

## Негласуемые правила

1. **Только семантические токены** — цвет, отступы, радиусы, тени, z-index, motion из `--prime-sys-*`. В layout не использовать сырые `--prime-ref-*`.
2. **Без литералов визуала** — не hex, не «голые» px для spacing/radius/shadow/z-index в стилях layout.
3. **Тема через `data-theme`** — компонент не зашивает light/dark; роли семантические.
4. **CSS Modules + переменные** — в kit нет Tailwind.
5. **Размер контролов через `size`** — высоты кнопок/полей layout не переопределяет.
6. **Базовый размер `m`** — для любого компонента с осью `size`, если сценарий не требует иного явно.

### Сырой kit, без кастомных оболочек

| Запрещено | Обязательно |
|-----------|-------------|
| Оборачивать kit-компоненты, чтобы изменить вид/поведение; подменять разметку; переопределять CSS kit (ad-hoc `className`, inline «чужая» система, клоны на `div`/`span`) | Только стандартная композиция и **публичный API**: props (`size`, `variant`, `mode`, `fullWidth`, …), документированные субкомпоненты, `ControlSizeProvider`, `data-theme`, `--prime-sys-*` на **поверхностях страницы**, не на «перекрашенных» внутренностях |

Нарушение: дрейф от DS, потеря a11y-гарантий, небезопасные апгрейды.

### Шпаргалка по токенам (layout)

| Категория | Префикс | Примеры |
|-----------|---------|---------|
| Фон | `--prime-sys-color-surface-*` | default, raised, overlay |
| Текст | `--prime-sys-color-content-*` | primary, secondary, muted |
| Бордер | `--prime-sys-color-border-*` | separator, subtle, strong |
| Отступы | `--prime-sys-spacing-*` | s, l, 2xl, 4xl |
| Радиусы | `--prime-sys-shape-radius-*` | m, 4xl |
| Тени | `--prime-sys-elevation-shadow-*` | surface, modal |
| Z-index | `--prime-sys-elevation-zIndex-*` | sticky, modal |
| Motion | `--prime-sys-motion-*` | duration-fast, easing-standard |

Полный справочник: [`design-tokens.md`](./design-tokens.md).

---

## Принципы вёрстки

- **Mobile-first:** сначала `flex-direction: column`, строка через `@media (min-width: …)`.
- **Брейкпоинты:** `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 — ставить там, где ломается сетка, а не по названию устройства.
- **Flex:** сайдбар + контент — `flex-wrap`, сайдбар `flex: 0 0 280px`, контент `flex: 1 1 0%`; holy grail — колонка body `min-height: 100vh`, середина `flex: 1` + flex-ряд; сетка карточек — `flex-wrap` + `gap` из токенов + `min-width` для reflow; липкий футер — main `flex: 1 0 auto`, footer `flex-shrink: 0`.
- **Отступы:** `gap`/`padding`/`margin` только из `--prime-sys-spacing-*`; при необходимости fluid: `clamp(var(--prime-sys-spacing-s), 2vw, var(--prime-sys-spacing-xl))` — без смешения литералов и токенов в одном правиле без нужды.
- **Touch:** минимум 44×44 px (WCAG 2.5.5); на мобиле Button/Input/Select — `size="l"`; Checkbox/Radio/Switch — увеличить клик-зону; LinkButton ≥ `m`.
- **Навигация:** desktop — фиксированный Sidebar `flex-shrink: 0`; `< md` — Sidebar в Drawer слева; Breadcrumb с `maxItems`; Tabs — скролл или Accordion; CommandMenu доступен с кнопки на всех ширинах.

---

## Рецепты (сжато)

**Дашборд:** Sidebar + Header (Breadcrumb, Avatar, CommandMenu) + контент (Tabs, DataTable, ProgressBar, Badge). `≥ lg` — row; `< lg` — колонка, сайдбар в Drawer; Tabs скролл; `< md` — таблица с горизонтальным скроллом и закреплённой колонкой; `< sm` — Stepper вертикально при необходимости.

**Настройки:** боковая навигация секций + форма (Label, Input, Select, Switch, Textarea, Button). `≥ md` — row; `< md` — сайдбар в Tabs/Accordion; поля `fullWidth`; футер формы — ButtonGroup, `justify-end`; `< sm` — кнопки `fullWidth`.

**Каталог:** поиск + SegmentedControl + фильтры + сетка карточек. Фильтры `flex: 0 0 260px` при `≥ md`; `< md` — фильтры в Drawer снизу; `< sm` — одна колонка; много сегментов — на узкой ширине заменить на Select; Pagination — компактный режим.

**Лендинг:** секции колонкой, `max-width` + центрирование; Hero `< md` колонкой, `≥ md` — текст + медиа в ряд; FAQ — Accordion; `< md` — нав в Drawer; CTA — ButtonGroup, на узкой ширине вертикально.

**Мастер формы:** Stepper (`≥ md` горизонтально, иначе вертикально) + шаг колонкой с `max-width` ~600px; действия `space-between`; на мобиле шаг может быть в Modal/Drawer; ProgressBar под прогрессом; `< sm` — кнопки `fullWidth`, DigitInput крупнее.

Детали компонентов — в соответствующих `COMPONENT.md`; сводка по 41 компоненту — [`component-catalog.md`](./component-catalog.md).

---

## Каталог компонентов

Все экспортируемые компоненты документированы в `../src/components/<kebab-name>/COMPONENT.md`. Полный перечень и сценарии — [`component-catalog.md`](./component-catalog.md) (длинные таблицы не дублировать — progressive disclosure).

---

## Антипаттерны

1. `100vw` вместо `100%` — лишняя ширина скроллбара → горизонтальный overflow.
2. `height: 100vh` на мобиле без учёта динамической панели Safari — предпочтительно `min-height: 100dvh` или fallback + `-webkit-fill-available`.
3. Sidebar без `flex-shrink: 0` / без `flex: 0 0 <width>` — сжимается при переполнении контента.
4. Широкие таблицы без обёртки скролла — использовать DataTable (overflow-x, закрепление колонки).
5. Modal по центру на мобиле для длинных форм — предпочесть Drawer снизу (`< md`).
6. Мелкие зоны тапа на мобиле — см. Touch выше.
7. Фиксированные px на flex-элементах без адаптации — `flex-basis` + min/max или `%`/`clamp`.
8. Любые хардкоды `#…`, `gap: 16px`, `z-index: 999` и т.д. вместо `--prime-sys-*`.
9. Кастомные обёртки и «ресурфейсы» kit-компонентов — см. раздел «Сырой kit».

---

## Чеклист перед ответом пользователю

- [ ] Токены только `--prime-sys-*` на визуале; нет обхода kit через кастомные оболочки.
- [ ] Размеры контролов через props; по умолчанию ось `size` = `m`, если не оговорено иначе.
- [ ] Брейкпоинты по ломке сетки; Sidebar/Drawer учтены для `< md` / `< lg` где уместно.
- [ ] При сомнении — открыть `COMPONENT.md` и [`component-catalog.md`](./component-catalog.md).
