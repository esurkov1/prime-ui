# prime-ui-kit

**prime-ui-kit** — UI-кит для **React 19** с упором на предсказуемый рантайм, **CSS Modules** и **дизайн-токены** в виде обычных **CSS variables** (`--prime-sys-*`). Без Tailwind в обязательном стеке, без «монолита» Radix на каждый виджет: оверлеи, выпадающие списки, фокус и позиционирование опираются на **собственные хуки и разметку**, а тяжёлые peer-зависимости сведены к узкой зоне (даты и доступность календаря).

Репозиторий: [github.com/esurkov1/prime-ui](https://github.com/esurkov1/prime-ui). Пакет в npm: **`prime-ui-kit`**.

---

## Зачем такой подход

### Почти без зависимостей (в смысле рантайма)

- **Сборка не вшивает peer-пакеты** в бандл библиотеки (`tsup` с `external` для React, React Aria, react-day-picker, date-fns) — в приложении одна версия, без дублирования.
- **Мало прямых зависимостей пакета:** иконки (`lucide-react`), анимации уведомлений (`framer-motion`), навигационные ссылки в сайдбаре (`react-router-dom`). Ядро форм, модалок, селектов, тултипов и т.д. не тянет десятки `@radix-ui/*`.
- **Нет Tailwind** как обязательного слоя: потребителю не нужно подключать utility-first CSS, чтобы кит выглядел согласованно — достаточно импортировать сгенерированные **токены и темы** плюс `styles.css`.

### Подходит под разные «фреймворки» вокруг React

Компоненты написаны на **React** — это не Vue/Svelte-виджеты. Зато кит **не привязан** к Next.js, Remix или чистому Vite: это обычные ESM-модули и CSS, которые работают в любом React-приложении, где есть поддержка **CSS Modules** (как у большинства сборщиков). Отдельно: **слой токенов** — чистый CSS; его можно использовать для визуального согласования даже вне React (например, обвязка на другом стеке с теми же переменными), а композиция остаётся в React.

### Предсказуемая архитектура

- **Дизайн-система из кода:** палитра, размеры контролов, семантика цветов и темы **генерируются** из TypeScript (`tokens/` → `bun run tokens:build` → `src/styles/*.css`). В компонентах — **`--prime-sys-*`**, а не разрозненные литералы.
- **Внутренний слой** (`src/internal/`): `cx`, контексты, Portal, **Slot** (аналог паттерна `asChild` без Radix), хуки вроде `useFocusTrap`, `useScrollLock`, `usePosition`.
- **Состояния и размеры** централизованы (`src/internal/states.ts` — например `componentSizes`: `s` | `m` | `l` | `xl`).
- **Сложные виджеты** — composable API: `Modal.Root`, `Select.Trigger`, `Input.Field`, … с типизированным контекстом.
- **Темы:** `data-theme="light" | "dark"` на корне или изолированном контейнере.

---

## Архитектура репозитория

```text
tokens/primitives.ts
    → tokens/semantic.ts
    → tokens/themes/light.ts | dark.ts
         ↓
scripts/build-tokens.ts
         ↓
src/styles/tokens.css
src/styles/theme-light.css      (AUTO-GENERATED)
src/styles/theme-dark.css

src/components/*/*.tsx + *.module.css   — публичные компоненты
src/internal/*                        — инфраструктура кита
src/hooks/*                           — хуки (например поля форм)
src/icons/*                           — обвязка иконок
src/index.ts                          — публичный entry + globals.css

dist/                                 — ESM + типы после tsup
```

**Публикация в npm** (`package.json` → `files`): `dist`, `src/styles`, `LICENSE`. Явные **`exports`**: основной entry, `prime-ui-kit/components`, отдельные пути к `styles.css`, `tokens.css`, `theme-light.css`, `theme-dark.css`.

---

## Что входит в кит (обзор возможностей)

Формы и ввод: **Input**, **Textarea**, **Checkbox**, **Radio**, **Switch**, **Select**, **Slider**, **DigitInput**, **FileUpload**, **ColorPicker**, **Hint**, **Label**, **Kbd**.

Оверлеи и навигация по слоям: **Modal**, **Drawer**, **Popover**, **Dropdown**, **Tooltip**, **CommandMenu**.

Компоновка и продукт: **PageShell**, **PageContent**, **Sidebar**, **Breadcrumb**, **Tabs**, **Accordion**, **Stepper** (горизонтальный/вертикальный), **SegmentedControl**, **Pagination**, **DataTable**.

Обратная связь и контент: **Button**, **ButtonGroup**, **LinkButton**, **Badge**, **Banner**, **Notification** (+ провайдер/store), **ProgressBar**, **ProgressCircle**, **Typography**, **Divider**, **Tag**, **Avatar**, **CodeBlock**, **Datepicker** (с пресетами и временем).

Дополнительно: **ControlSizeProvider** для согласованного размера контролов в поддереве, **ExampleFrame** (для доков/playground).

Полный список экспортов — `src/components/index.ts`. Живые примеры — `playground/` (`bun run playground:dev`).

---

## Зависимости: честная таблица

| Слой | Пакеты |
|------|--------|
| **Peer (обязательно в приложении)** | `react`, `react-dom`, `react-aria-components`, `react-day-picker`, `date-fns` |
| **Идёт с китом (dependencies)** | `lucide-react`, `framer-motion`, `react-router-dom` |

**React Aria** и **react-day-picker** подключены там, где нужна проверенная доступность и поведение календаря; остальная интерактивность реализована локально. **React Router** нужен для ссылок в **Sidebar**; без роутера можно не использовать эти части API или обернуть приложение в `Router`.

В исходниках **нет** `@radix-ui/*`; полиморфные триггеры — через внутренний **Slot** (`src/internal/slot.tsx`).

---

## Установка

```bash
npm install prime-ui-kit
npm install react react-dom react-aria-components react-day-picker date-fns
```

Версии peer — см. `package.json`.

---

## Подключение стилей

Рекомендуемый порядок в точке входа:

```css
@import "prime-ui-kit/tokens.css";
@import "prime-ui-kit/theme-light.css";
/* или theme-dark.css / переключение через data-theme */
@import "prime-ui-kit/styles.css";
```

---

## Импорт компонентов

```tsx
import { Button, Input, Modal } from "prime-ui-kit";

import { DataTable } from "prime-ui-kit/components";
```

---

## Примеры API

```tsx
<Input.Root size="m" label="Email" id="email">
  <Input.Wrapper>
    <Input.Field type="email" placeholder="name@company.com" />
  </Input.Wrapper>
</Input.Root>

<Button variant="primary" mode="filled" size="l">
  Отправить
</Button>
```

---

## Разработка и проверка

| Команда | Назначение |
|---------|------------|
| `bun run verify` | lint + типы + тесты + сборка |
| `bun run build` | токены + `tsup` |
| `bun run tokens:build` | пересборка CSS токенов |
| `bun run playground:dev` | Vite playground |
| `bun run test` | Vitest |
| `bun run check` / `check:fix` | Biome |

Контракт для контрибьюторов — **`RULES.md`**. Материалы для ассистентов и чеклисты — каталог **`prime-ui-skill/`** (в npm-пакет не входит).

---

## CI и публикация в npm

В GitHub Secrets нужен **`NPM_TOKEN`**.

- На push в `main` и в PR — проверка `bun run verify`.
- Релиз через **GitHub Release**: workflow собирает пакет и выполняет `npm publish`.

Перед релизом обновите **`version`** в `package.json` и создайте релиз с тегом вида `v0.2.0`, совпадающим с версией пакета.

---

## Лицензия

MIT — см. файл `LICENSE`.
