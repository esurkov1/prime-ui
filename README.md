# prime-ui-kit

[![npm version](https://img.shields.io/npm/v/prime-ui-kit.svg)](https://www.npmjs.com/package/prime-ui-kit)
[![License: MIT](https://img.shields.io/npm/l/prime-ui-kit.svg)](https://github.com/esurkov1/prime-ui/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Библиотека **React 19** UI-компонентов: **CSS Modules**, **дизайн-токены** как CSS-переменные (`--prime-sys-*`), **композиционный API** (`Modal.Root`, `Input.Field`, `Select.Trigger`, …). Работает с **Vite**, **Next.js**, **Remix** и любым бандлером с поддержкой CSS Modules. Доступность ориентирована на **react-aria-components** там, где это уместно.

**Каналы:** [npm](https://www.npmjs.com/package/prime-ui-kit) · [Репозиторий и issues](https://github.com/esurkov1/prime-ui/issues)

---

## Содержание

- [Метаданные (для инструментов и LLM)](#метаданные-для-инструментов-и-llm)
- [Ключевые возможности](#ключевые-возможности)
- [Требования](#требования)
- [Установка](#установка)
- [Стили и темы](#стили-и-темы)
- [Быстрый старт](#быстрый-старт)
- [Импорты: основной вход и «тяжёлые» модули](#импорты-основной-вход-и-тяжёлые-модули)
- [Провайдеры и контекст](#провайдеры-и-контекст)
- [Каталог компонентов](#каталог-компонентов)
- [Экспорты пакета (`package.json` / `exports`)](#экспорты-пакета-packagejson--exports)
- [TypeScript](#typescript)
- [Где лежит документация компонентов](#где-лежит-документация-компонентов)
- [Лицензия](#лицензия)

---

## Метаданные (для инструментов и LLM)

```yaml
name: prime-ui-kit
ecosystem: react
react_version: "^19.0.0"
module_system: ESM
styling: CSS Modules + CSS variables (--prime-sys-*)
a11y_stack: react-aria-components (peer)
documentation_per_component: src/components/<name>/COMPONENT.md
repository: https://github.com/esurkov1/prime-ui
default_control_size: m  # для оси size, если не оговорено иное
```

---

## Ключевые возможности

- **Токены и темы** — семантические переменные, светлая и тёмная тема через `data-theme`.
- **Композиция** — паттерн подкомпонентов (`Root`, `Field`, `Trigger`, …) вместо монолитных пропов.
- **Формы** — поля, выборы, переключатели, загрузка файлов, цвет, OTP-поле, слайдеры.
- **Оверлеи** — модальные окна, drawer, popover, меню, тултипы, command palette.
- **Навигация и раскладка** — sidebar, хлебные крошки, вкладки, аккордеон, степпер, пагинация, оболочка страницы.
- **Данные** — таблица с сортировкой, пагинацией и бесконечной прокруткой.
- **Типы** — публикуемые `.d.ts` вместе с пакетом.
- **Уведомления** — очередь тостов через `NotificationProvider` и `useNotifications()`.

---

## Требования

| Зависимость | Версия |
|-------------|--------|
| `react` / `react-dom` | ^19.0.0 |
| `react-aria-components` | ^1.16.0 |
| `react-day-picker` | ^9.14.0 |
| `date-fns` | ^4.0.0 |

Пакет подтягивает **lucide-react**, **framer-motion** и **react-router-dom** (иконки, анимация уведомлений, навигация в **Sidebar**). Для **Sidebar** с пунктами маршрутизации подключите роутер (например `BrowserRouter`).

---

## Установка

```bash
npm install prime-ui-kit react react-dom react-aria-components react-day-picker date-fns
```

```bash
pnpm add prime-ui-kit react react-dom react-aria-components react-day-picker date-fns
```

```bash
bun add prime-ui-kit react react-dom react-aria-components react-day-picker date-fns
```

---

## Стили и темы

Подключите **глобальные стили** (шрифты, reset, токены, обе темы) и **собранный CSS компонентов** (результат CSS Modules из публикации):

```css
@import "prime-ui-kit/styles.css";
@import "prime-ui-kit/bundle.css";
```

- **`styles.css`** — загрузка шрифтов Google Fonts, CSS reset, дизайн-токены, светлая и тёмная темы.
- **`bundle.css`** — правила классов, согласованные с JS-бандлом (`Button`, `Input`, …).

**Светлая / тёмная тема:** задайте `data-theme="light"` или `data-theme="dark"` на `<html>`, корне лейаута или обёртке.

Тонкая настройка (свой reset, одна тема):

```css
@import "prime-ui-kit/tokens.css";
@import "prime-ui-kit/theme-light.css";
/* @import "prime-ui-kit/theme-dark.css"; */
@import "prime-ui-kit/bundle.css";
```

Если используете только **`prime-ui-kit/components`**, замените `bundle.css` на **`prime-ui-kit/components.css`**.

---

## Быстрый старт

```tsx
import { Button, Input, Modal } from "prime-ui-kit";

export function Example() {
  return (
    <>
      <Input.Root size="m" label="Email" id="email">
        <Input.Wrapper>
          <Input.Field type="email" placeholder="you@example.com" />
        </Input.Wrapper>
      </Input.Root>

      <Button variant="primary" mode="filled" size="l">
        Submit
      </Button>
    </>
  );
}
```

---

## Импорты: основной вход и «тяжёлые» модули

- **`prime-ui-kit`** — основной вход; подходит для большинства сценариев.
- **`prime-ui-kit/components`** — точка входа для tree-shaking «тяжёлых» модулей (например `DataTable`).

```tsx
import { DataTable } from "prime-ui-kit/components";
```

---

## Провайдеры и контекст

| API | Назначение |
|-----|------------|
| **`NotificationProvider`** + **`useNotifications()`** | Очередь тостов: `notify`, `dismiss`, `dismissAll`. Обёрните приложение или поддерево. |
| **`ControlSizeProvider`** | Значение по умолчанию для оси **`s` \| `m` \| `l` \| `xl`** у контролов внутри поддерева. |

---

## Каталог компонентов

Описание — краткая выжимка из раздела **About** в `COMPONENT.md`. Полное API, составные части и примеры — по ссылке.

База URL документации в репозитории: `https://github.com/esurkov1/prime-ui/blob/main/src/components/`

| Категория | Компонент | Описание | Документация |
|-----------|-----------|----------|--------------|
| Формы и ввод | **Checkbox** | Чекбокс с оформлением, подписью, подсказкой и ошибкой. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/checkbox/COMPONENT.md) |
| Формы и ввод | **ColorPicker** | Выбор цвета: плоскость, слайдеры каналов, swatches, hex, пипетка (react-aria). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/color-picker/COMPONENT.md) |
| Формы и ввод | **DigitInput** | OTP-стиль: ячейки на один символ, вставка и переход фокуса. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/digit-input/COMPONENT.md) |
| Формы и ввод | **FileUpload** | Выбор файлов: скрытый `input`, drag-and-drop, строки файлов с прогрессом. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/file-upload/COMPONENT.md) |
| Формы и ввод | **Hint** | Вспомогательный или статусный текст под полем с опциональной иконкой. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/hint/COMPONENT.md) |
| Формы и ввод | **Input** | Однострочное поле с обёрткой, аффиксами и подсказками/ошибкой. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/input/COMPONENT.md) |
| Формы и ввод | **Kbd** | Отображение сочетаний клавиш (`kbd`) в стиле UI. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/kbd/COMPONENT.md) |
| Формы и ввод | **Label** | Подпись к полю: иконка, звёздочка обязательности, вторичный текст. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/label/COMPONENT.md) |
| Формы и ввод | **Radio** | Группа радиокнопок с подписью, подсказкой и ошибкой. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/radio/COMPONENT.md) |
| Формы и ввод | **SegmentedControl** | Горизонтальный `radiogroup` с сегментами и индикатором выбора. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/segmented-control/COMPONENT.md) |
| Формы и ввод | **Select** | Одиночный выбор из списка (комбобокс + listbox в портале). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/select/COMPONENT.md) |
| Формы и ввод | **Slider** | Горизонтальный `input type="range"` в масштабе кита. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/slider/COMPONENT.md) |
| Формы и ввод | **Switch** | Переключатель вкл/выкл с подписью и метаданными. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/switch/COMPONENT.md) |
| Формы и ввод | **Textarea** | Многострочное поле, счётчик символов, подсказки и ошибки. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/textarea/COMPONENT.md) |
| Дата и время | **Datepicker** | Календарь, диапазоны, пресеты, опционально время (react-day-picker + date-fns). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/datepicker/COMPONENT.md) |
| Оверлеи | **CommandMenu** | Модальная палитра команд: поиск и выбор из списка с клавиатуры. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/command-menu/COMPONENT.md) |
| Оверлеи | **Drawer** | Боковая панель в портале с блокировкой прокрутки и фокусом. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/drawer/COMPONENT.md) |
| Оверлеи | **Dropdown** | Меню действий с триггером и порталом (`role="menu"`). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/dropdown/COMPONENT.md) |
| Оверлеи | **Modal** | Центрированный диалог с бэкдропом, ловушкой фокуса и опциональным chrome. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/modal/COMPONENT.md) |
| Оверлеи | **Popover** | Якорь + панель в портале, не модальный диалог рядом с триггером. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/popover/COMPONENT.md) |
| Оверлеи | **Tooltip** | Подсказка с задержкой, триггер и контент в портале. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/tooltip/COMPONENT.md) |
| Навигация и раскладка | **Accordion** | Раскрывающиеся секции (FAQ, группы настроек) с анимацией высоты. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/accordion/COMPONENT.md) |
| Навигация и раскладка | **Breadcrumb** | «Хлебные крошки»: `nav`, ссылки, разделители, многоточие. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/breadcrumb/COMPONENT.md) |
| Навигация и раскладка | **Pagination** | Переход по страницам: prev/next, номера, ellipsis. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/pagination/COMPONENT.md) |
| Навигация и раскладка | **Sidebar** | Боковая навигация: панели, группы, контекстная колонка, переключение секций. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/sidebar/COMPONENT.md) |
| Навигация и раскладка | **Stepper** | Пошаговый процесс на `<ol>` / `<li>` и примитивы горизонтальный/вертикальный. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/stepper/COMPONENT.md) |
| Навигация и раскладка | **Tabs** | Вкладки: список триггеров, индикатор, одна видимая панель. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/tabs/COMPONENT.md) |
| Навигация и раскладка | **PageContent** | Контентная колонка: ограничение ширины (`readable` / `wide`), заголовок и тело. | [Исходники](https://github.com/esurkov1/prime-ui/tree/main/src/components/page-content) |
| Навигация и раскладка | **PageShell** | Оболочка страницы: корень, зона навигации, зона контента, опционально на весь viewport. | [Исходники](https://github.com/esurkov1/prime-ui/tree/main/src/components/page-shell) |
| Данные | **DataTable** | Таблица с прокруткой, сортировкой, пагинацией или infinite scroll, sticky. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/data-table/COMPONENT.md) |
| Отображение и контент | **Avatar** | Круглый аватар: изображение, fallback, группа с overflow. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/avatar/COMPONENT.md) |
| Отображение и контент | **Badge** | Компактный статус или метка; вариант с точкой присутствия. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/badge/COMPONENT.md) |
| Отображение и контент | **Banner** | Встроенная полоса объявления с иконкой, текстом и действиями. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/banner/COMPONENT.md) |
| Отображение и контент | **CodeBlock** | Подсветка TS/TSX в `pre`/`code` (статическая презентация кода). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/code-block/COMPONENT.md) |
| Отображение и контент | **Divider** | Горизонтальный или вертикальный разделитель с опциональной подписью. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/divider/COMPONENT.md) |
| Отображение и контент | **ProgressBar** | Горизонтальный прогресс на нативном `<progress>`. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/progress-bar/COMPONENT.md) |
| Отображение и контент | **ProgressCircle** | Кольцевой индикатор прогресса (SVG + `progressbar`). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/progress-circle/COMPONENT.md) |
| Отображение и контент | **Tag** | Чип: иконка, текст, кнопка снятия при `onRemove`. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/tag/COMPONENT.md) |
| Отображение и контент | **Typography** | Текст с масштабом размеров, весом, трекингом, muted. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/typography/COMPONENT.md) |
| Действия и обратная связь | **Button** | Кнопка действия: `asChild`, иконка, спиннер загрузки. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/button/COMPONENT.md) |
| Действия и обратная связь | **ButtonGroup** | Группа кнопок в общей обводке с разделителями. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/button-group/COMPONENT.md) |
| Действия и обратная связь | **LinkButton** | Текстовая ссылка-кнопка с отступами и подчёркиванием при hover/focus. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/link-button/COMPONENT.md) |
| Действия и обратная связь | **Notification** | Тосты: провайдер, очередь, позиции, типы сообщений. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/notification/COMPONENT.md) |

---

## Экспорты пакета (`package.json` / `exports`)

| Путь | Назначение |
|------|------------|
| `prime-ui-kit` | Основной JS/TS API. |
| `prime-ui-kit/components` | Альтернативный вход для tree-shaking тяжёлых частей. |
| `prime-ui-kit/styles.css` | Глобальные стили (шрифты, reset, токены, темы). |
| `prime-ui-kit/tokens.css` | Только токены. |
| `prime-ui-kit/theme-light.css` / `theme-dark.css` | Отдельные темы. |
| `prime-ui-kit/bundle.css` | CSS, согласованный с основным бандлом. |
| `prime-ui-kit/components.css` | CSS для входа `components`. |

---

## TypeScript

Определения типов публикуются вместе с пакетом (`dist/*.d.ts`).

---

## Где лежит документация компонентов

- **В репозитории и на GitHub:** для каждого компонента с таблицы выше — файл `src/components/<имя>/COMPONENT.md`.
- **В установленном пакете:** те же файлы входят в публикацию (`package.json` → `files`), путь вида `node_modules/prime-ui-kit/src/components/<имя>/COMPONENT.md`.

Для **PageShell** и **PageContent** отдельного `COMPONENT.md` нет; ориентируйтесь на типы и реализацию в каталогах `page-shell` и `page-content`.

---

## Лицензия

MIT — см. файл [`LICENSE`](https://github.com/esurkov1/prime-ui/blob/main/LICENSE) в репозитории и в npm-пакете.
