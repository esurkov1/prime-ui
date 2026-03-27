# Kbd

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## Canonical

`Kbd` — примитив из одной части: **`Kbd.Root`** рендерит семантический **`kbd`** с оформлением кита (поднятая поверхность, рамка, лёгкая тень). Только **отображение** подписи клавиши; события клавиатуры и фокус не обрабатывает.

- **API:** `size?: "s" | "m" | "l" | "xl"`; без пропа размер берётся из ближайшего **`ControlSizeProvider`**, иначе **`"m"`**; на поверхности контрола **`xs`** маппится в **`s`** для `kbd`.
- **Импорт:** `import { Kbd } from "prime-ui-kit"` → **`Kbd.Root`**.

```tsx
import { Kbd } from "prime-ui-kit";

export function Example() {
  return <Kbd.Root>Esc</Kbd.Root>;
}
```

Секция Kbd в плейграунде (`playground/sections/KbdSection.tsx`) рендерит сниппеты из **`playground/snippets/kbd/*.tsx`**. Файлы в **`examples/`** с пометкой parity повторяют те же сценарии с импортом **`"prime-ui-kit"`** для копирования в приложение. Остальные примеры — продуктовые сценарии. Подробности — в **Extended**.

## Extended

### About

`Kbd.Root` помечает имена клавиш и фрагменты шорткатов как UI-хром, а не как основной текст абзаца.

- **When to use** — горячие клавиши у пунктов меню, действий тулбара, подписей в [Command menu](../command-menu/COMPONENT.md).
- **When to use** — одна или несколько клавиш во вспомогательном тексте, подсказках полей, футерах модалок, где шорткат — часть инструкции.
- **When to use** — согласовать **`size`** с соседними контролами ([Input](../input/COMPONENT.md), [Button](../button/COMPONENT.md)), чтобы вложенные иконки и кегль совпадали с рядом стоящими контролами.
- **When not to use** — как единственный интерактивный элемент; нужна настоящая [Button](../button/COMPONENT.md), [Link button](../link-button/COMPONENT.md) или другой фокусируемый target.
- **When not to use** — для зеркалирования или перехвата реального ввода с клавиатуры; компонент только показывает подпись.
- **When not to use** — в длинной документации, где обычный текст или моноширинный шрифт читабельнее «чипов» клавиш.

### Examples (`examples/`)

| Файл | Сценарий |
|------|----------|
| [`examples/sizes-ladder.tsx`](examples/sizes-ladder.tsx) | Ряд **`Kbd.Root`** с **`size`** `s`–`xl` (`snippets/kbd/sizes.tsx`). |
| [`examples/states-title.tsx`](examples/states-title.tsx) | Без отдельных пропов состояния; **`title`** для нативной подсказки (`snippets/kbd/states.tsx`). |
| [`examples/composition-chord-icon.tsx`](examples/composition-chord-icon.tsx) | Аккорд **`⌘` + `K`** и ряд с **`Icon`** внутри одного **`Kbd.Root`** (`snippets/kbd/composition.tsx`). |
| [`examples/context-inherit-size.tsx`](examples/context-inherit-size.tsx) | Размер без пропа из **`ControlSizeProvider`**, **`xs`→`s`**, явный **`size`** перекрывает контекст (`snippets/kbd/inherit-size.tsx`). |
| [`examples/shortcut-row.tsx`](examples/shortcut-row.tsx) | Строка списка/меню: подпись действия и шорткат справа. |
| [`examples/docs-legend.tsx`](examples/docs-legend.tsx) | Легенда в документации: сетка «действие → комбинация». |
| [`examples/toolbar-hints.tsx`](examples/toolbar-hints.tsx) | Тулбар: кнопка и рядом компактная подсказка-клавиши. |
| [`examples/combination-keys.tsx`](examples/combination-keys.tsx) | Аккорд: несколько **`Kbd.Root`** и разделители вне ключей. |
| [`examples/inline-doc-hint.tsx`](examples/inline-doc-hint.tsx) | Встроенная в абзац подсказка с **`Kbd`** в потоке текста. |

### Composition

- **`Kbd`** экспортирует только **`Root`** — плоский API; внутрь передаётся подпись (текст, иконки, смешанный **`ReactNode`**).
- **`Root`** выставляет **`data-size`**, оборачивает **`children`** в **`ControlSizeProvider`**, чтобы вложенные **`Icon`** наследовали контекст размера контрола.

### Rules

- **Sizing:** см. Canonical; явный **`size`** перекрывает контекст.
- **Presentation only:** нет обработки клавиш, фокуса и состояния ОС.
- **Semantics:** полиморфизма **`asChild`** нет — корень всегда **`kbd`**.
- **Accessibility:** для аккордов — несколько **`Kbd.Root`**; **`+`** / «или» выносить **вне** ключей или помечать **`aria-hidden`**, чтобы скринридер не зачитывал их как часть каждой клавиши. Для пояснения — **`title`** или видимый текст; смысл не только цветом.
- **Platform copy:** **⌘** vs **Ctrl** и т.п. — решение продукта/i18n, кит не нормализует.
- **Styling:** один встроенный вид; расширение через **`className`** / стили проекта, отдельного **`variant`** нет.

## API

### Kbd.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `KbdSize` (`"s" \| "m" \| "l" \| "xl"`) | from context or `"m"` | No | Номинальный размер; без пропа — из `ControlSizeProvider` или `"m"`; контекст `xs` → `s` на `kbd`. |
| children | `React.ReactNode` | — | Yes | Подпись клавиши, иконки или смешанный контент. |
| className | `string` | — | No | Дополнительный класс на `kbd`. |
| …rest | `Omit<React.HTMLAttributes<HTMLElement>, "size">` | — | No | Нативные атрибуты (`title`, `hidden`, `aria-*`, `data-*`, …). |

## Related

- [Button](../button/COMPONENT.md) — действие, на которое часто ссылается шорткат.
- [Link button](../link-button/COMPONENT.md) — текстовые действия с подсказкой клавиши рядом.
- [Input](../input/COMPONENT.md) — поля, где в `hint` или у подписи уместен `Kbd`.
- [Textarea](../textarea/COMPONENT.md) — многострочные поля с тем же паттерном подсказок.
- [Select](../select/COMPONENT.md) — триггеры и списки с документированием шорткатов.
- [Tooltip](../tooltip/COMPONENT.md) — развёрнутые пояснения с повтором клавиш через `Kbd`.
- [Command menu](../command-menu/COMPONENT.md) — списки с пер-элементными шорткатами.

## LLM note

- Публичный API: **`Kbd.Root`** только; импорт **`{ Kbd } from "prime-ui-kit"`**.
- Нет **`variant`**, **`disabled`**, **`asChild`**; для подсказок используй нативные атрибуты (**`title`**, **`aria-*`**).
- Аккорд: **не** клади строку `"⌘+K"` в один **`Kbd.Root`**, если нужна семантика «отдельные клавиши» — делай **`Kbd.Root` на каждую клавишу**, плюс **`span aria-hidden`** между ними для **`+`**.
- Размер без пропа: **`useOptionalControlSize`** → **`controlSurfaceToInputSize`**; **`xs`** контекста → эффективный **`s`** на компоненте.
- Не подменяй кнопку или ссылку одним **`Kbd`**; не ожидай событий клавиатуры от этого компонента.
- Сценарии копирования: **`playground/snippets/kbd/*.tsx`** (демо) и зеркала в **`src/components/kbd/examples/*.tsx`** (импорт **`"prime-ui-kit"`**); parity-файлы названы в таблице выше.
