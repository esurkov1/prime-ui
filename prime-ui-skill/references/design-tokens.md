# Дизайн-токены prime-ui-kit

Полная карта токен-системы для использования в responsive-макетах.
Все визуальные значения берутся **только** из semantic-слоя (`--prime-sys-*`).
Прямые ссылки на примитивы (`--prime-ref-*`) в компонентах **запрещены** (RULES.md §3).

---

## Архитектура

```
tokens/primitives.ts  →  src/styles/tokens.css        (--prime-ref-*)
tokens/semantic.ts    →  src/styles/theme-light.css    (--prime-sys-*)
tokens/themes/light.ts    src/styles/theme-dark.css
tokens/themes/dark.ts
```

- **Примитивы** (`--prime-ref-*`): raw-значения палитры, размеров, теней. Не используются в компонентах напрямую.
- **Семантика** (`--prime-sys-*`): роли, привязанные к контексту (action, surface, content, border, field…). Переключаются темой.
- **Тема**: `data-theme="light"` / `data-theme="dark"` на `:root` или контейнере. Компонент не знает о теме — только о semantic roles.

---

## Цвета

### Палитра (примитивы, `--prime-ref-color-*`)

| Группа | Шкала | Пример |
|--------|-------|--------|
| gray | 0–950 + alpha10/16/24 | `--prime-ref-color-gray-400` = `#c7ced9` |
| red | 50–950 | `--prime-ref-color-red-500` |
| blue | 50–950 | `--prime-ref-color-blue-600` |
| green | 50–950 | `--prime-ref-color-green-500` |
| orange | 50–950 | `--prime-ref-color-orange-500` |
| yellow | 50–950 | `--prime-ref-color-yellow-500` |
| purple | 50–950 | `--prime-ref-color-purple-500` |
| sky | 50–950 | `--prime-ref-color-sky-500` |
| pink | 50–950 | `--prime-ref-color-pink-500` |
| teal | 50–950 | `--prime-ref-color-teal-500` |
| black / white | — | `#0f1115` / `#f8f7f4` |
| overlay | scrimLight / scrimDark | `rgba(15, 17, 21, 0.58)` |

### Семантические цвета (`--prime-sys-color-*`)

Используй **только эти** в стилях макета:

| Группа | Токены | Назначение |
|--------|--------|------------|
| **action** | `primaryBackground`, `primaryBackgroundHover`, `primaryForeground`, `primarySoftBackground`, `primarySoftForeground`, `neutralBackground`, `neutralBackgroundHover`, `neutralForeground`, `errorBackground`, `errorBackgroundHover`, `errorForeground` | Кнопки, ссылки, интерактивные элементы |
| **surface** | `default`, `raised`, `elevated`, `overlay`, `accentSoft`, `dangerSoft` | Фоны страниц, карточек, панелей, overlay |
| **content** | `primary`, `secondary`, `muted`, `disabled`, `inverse`, `accent`, `danger` | Цвет текста и иконок |
| **border** | `subtle`, `separator`, `strong`, `emphasis`, `muted`, `accent`, `danger`, `disabled`, `inverse` | Обводки, разделители |
| **field** | `bg`, `text`, `placeholder`, `border`, `borderHover`, `borderFocus`, `borderError` | Поля ввода |
| **focus** | `ring` | Кольцо фокуса |
| **status** | `information-*`, `warning-*`, `success-*`, `error-*`, `away-*`, `feature-*`, `verified-*` | Статусные цвета (background, backgroundEmphasis, foreground, border) |
| **badge** | `grayFilled-*`, `pink-*`, `teal-*` и др. | Бейджи (soft, emphasis, border, foregroundOnSoft) |
| **dataTable** | `dividerHorizontal`, `dividerVertical`, `headBackground`, `rowBackground` | Таблица |
| **tooltip** | `background`, `foreground`, `border` | Тултипы |

**Правило для layout:** фон страницы — `surface-default`; карточки — `surface-raised`;
overlay (Drawer, Modal) — `surface-overlay`; бордер между секциями — `border-separator`.

---

## Типографика

### Семейства шрифтов

| Токен | Значение |
|-------|----------|
| `--prime-ref-font-family-base` | `"Roboto Flex", "Roboto", ui-sans-serif, system-ui, sans-serif` |
| `--prime-ref-font-family-mono` | `"Roboto Mono", ui-monospace, monospace` |

### Шкала размеров (`--prime-ref-font-size-*`)

| Токен | Размер | Line-height |
|-------|--------|-------------|
| `3xs` | 0.625rem (10px) | 0.875rem |
| `2xs` | 0.6875rem (11px) | 1rem |
| `xs` | 0.75rem (12px) | 1rem |
| `s` | 0.8125rem (13px) | 1.125rem |
| `m` | 0.875rem (14px) | 1.25rem |
| `l` | 1rem (16px) | 1.375rem |
| `xl` | 1.125rem (18px) | 1.5rem |
| `2xl` | 1.25rem (20px) | 1.625rem |
| `3xl` | 1.375rem (22px) | 1.75rem |
| `4xl` | 1.5rem (24px) | 1.875rem |
| `5xl` | 1.75rem (28px) | 2rem |
| `6xl` | 2rem (32px) | 2.25rem |

### Веса (`--prime-ref-font-weight-*`)

| Токен | Значение |
|-------|----------|
| `regular` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |

### Трекинг (`--prime-ref-font-letterSpacing-*`)

| Токен | Значение |
|-------|----------|
| `tighter` | -0.02em |
| `tight` | -0.01em |
| `normal` | 0 |
| `wide` | 0.04em |
| `wider` | 0.06em |

### Семантическая типографика (`--prime-sys-typography-*`)

- `body-size`, `body-lineHeight`, `body-letterSpacing` — базовый текст.
- `title-size`, `title-weight` — заголовки.
- `control-s|m|l` — текст внутри контролов (размер + line-height).
- `support-3xs|2xs|xs|s` — вспомогательный мелкий текст.
- `lineHeight-tight` (1.25), `normal` (1.5), `relaxed` (1.65).

**Правило для layout:** используй `--prime-sys-typography-*` для текста в макете.
Для заголовков страниц — Typography `variant` из шкалы компонента.
Для fluid typography между breakpoints — `clamp()` с `--prime-ref-font-size-*` как min/max.

---

## Отступы и spacing

### Layout spacing (`--prime-sys-spacing-*`)

| Токен | Значение | Типичное применение |
|-------|----------|---------------------|
| `xs` | 0.25rem (4px) | Минимальный gap, inline-отступ |
| `s` | 0.5rem (8px) | Gap в плотных списках |
| `m` | 0.75rem (12px) | Gap между элементами формы |
| `l` | 1rem (16px) | Padding карточки, секционный gap |
| `xl` | 1.25rem (20px) | Padding контейнера |
| `2xl` | 1.5rem (24px) | Секционный отступ |
| `3xl` | 1.75rem (28px) | Отступ между блоками |
| `4xl` | 2rem (32px) | Отступ между секциями страницы |
| `5xl` | 2.5rem (40px) | Крупный секционный разрыв |
| `6xl` | 3.5rem (56px) | Hero / landing-секция |

### Числовая шкала (`--prime-sys-spacing-x*`)

`x0` (0) … `x14` — маппинг на layout-токены для программной итерации.

### Control spacing (`--prime-ref-spaces-control-*`)

Внутренние отступы контролов (Input, Button, Select); управляются через `size` prop, не задаются вручную в layout.

**Правило для layout:** для `gap`, `padding`, `margin` в обёртках — **только** `--prime-sys-spacing-*`.
Не использовать px-литералы. Для fluid spacing: `gap: clamp(var(--prime-sys-spacing-s), 2vw, var(--prime-sys-spacing-xl))`.

---

## Радиусы (`--prime-sys-shape-radius-*`)

| Токен | Значение | Применение |
|-------|----------|------------|
| `xs` | 8px | Мелкие элементы, Badge, Tag |
| `s` | 10px | Input, Select, Button (s) |
| `m` | 11px | Button (m), карточки |
| `l` | 12px | Button (l), секции |
| `4xl` | 24px | Modal, Drawer, крупные карточки |
| `round` | 9999px | Avatar, круглые кнопки |

**Правило для layout:** радиус карточки = `--prime-sys-shape-radius-l` или `4xl` для крупных блоков.
Не хардкодить `border-radius` в px.

---

## Тени (`--prime-sys-elevation-shadow-*`)

| Токен | Контекст |
|-------|----------|
| `surface` | Карточки, поднятые поверхности |
| `modal` | Modal, крупные overlay |
| `tooltip` | Tooltip, Popover |
| `buttonFocus` | Фокус кнопки |
| `primaryFocus` | Фокус primary-элемента |
| `errorFocus` | Фокус error-элемента |
| `fancyButtonNeutral` | Декоративная тень нейтральной кнопки |
| `fancyButtonPrimary` | Декоративная тень primary-кнопки |
| `fancyButtonError` | Декоративная тень error-кнопки |

Значения различаются для light / dark тем (автоматически через `data-theme`).

---

## Z-index (`--prime-sys-elevation-zIndex-*`)

| Токен | Значение | Слой |
|-------|----------|------|
| `base` | 10 | Базовый контент |
| `sticky` | 100 | Sticky header, fixed sidebar |
| `popover` | 1000 | Popover |
| `dropdown` | 1100 | Dropdown, Select menu |
| `tooltip` | 1200 | Tooltip |
| `modal` | 2000 | Modal, Drawer |
| `toast` | 3000 | Notification |

**Правило для layout:** для sticky header — `z-index: var(--prime-sys-elevation-zIndex-sticky)`.
Sidebar на desktop — `base`; Drawer на mobile — `modal`. Не изобретать свои z-index.

---

## Анимации (`--prime-sys-motion-*`)

| Токен | Значение | Применение |
|-------|----------|------------|
| `duration-fast` | 200ms | Hover, focus, toggle |
| `duration-medium` | 350ms | Drawer, Accordion, expand/collapse |
| `duration-slow` | 500ms | Page-level transitions |
| `easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Все переходы |

**Правило для layout:** для responsive-переходов (sidebar collapse, drawer appear) —
`transition: transform var(--prime-sys-motion-duration-medium) var(--prime-sys-motion-easing-standard)`.

---

## Размеры контролов (`--prime-sys-size-control-*`)

Контролы (Button, Input, Select и т.д.) имеют предопределённые размеры через `size` prop.
Layout не должен переопределять высоту контролов — использовать `size="s|m|l"`.

| Size | Примерная height | Когда |
|------|------------------|-------|
| `s` | ~32px | Плотный desktop UI, таблицы |
| `m` | ~40px | Стандарт |
| `l` | ~48px | Mobile, touch-friendly |

---

## Бордеры (`--prime-sys-border-*`)

| Токен | Значение |
|-------|----------|
| `width-control` | 1px |
| `width-focusRing` | 2px |

Цвет бордера — из `--prime-sys-color-border-*`.

---

## Чек-лист использования токенов в layout

1. **Фон:** `background: var(--prime-sys-color-surface-default)` — не hex, не rgb.
2. **Текст:** `color: var(--prime-sys-color-content-primary)` — не `#000`, не `black`.
3. **Отступы:** `gap: var(--prime-sys-spacing-l)` — не `16px`.
4. **Радиусы:** `border-radius: var(--prime-sys-shape-radius-m)` — не `12px`.
5. **Тени:** `box-shadow: var(--prime-sys-elevation-shadow-surface)` — не кастомная тень.
6. **Z-index:** `z-index: var(--prime-sys-elevation-zIndex-sticky)` — не магическое число.
7. **Анимации:** `transition-duration: var(--prime-sys-motion-duration-medium)` — не `0.3s`.
8. **Шрифт:** `font-family: var(--prime-sys-typography-family-base)` — не `"Roboto"` напрямую.
9. **Размер текста:** через Typography компонент или `--prime-sys-typography-*`.
10. **Размер контролов:** через `size` prop, не через CSS.

---

## Исходные файлы

| Файл | Роль |
|------|------|
| `tokens/primitives.ts` | Исходник примитивов (TS) |
| `tokens/semantic.ts` | Исходник семантики (TS) |
| `tokens/themes/light.ts` | Переопределения light-темы |
| `tokens/themes/dark.ts` | Переопределения dark-темы |
| `src/styles/tokens.css` | Сгенерированные CSS-примитивы (AUTO-GENERATED) |
| `src/styles/theme-light.css` | Сгенерированная light-тема |
| `src/styles/theme-dark.css` | Сгенерированная dark-тема |
| `src/styles/units.css` | Вспомогательные единицы (`--prime-sys-unit-*`) |
| `src/styles/globals.css` | Глобальные стили, keyframes |
