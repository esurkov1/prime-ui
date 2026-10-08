import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "CommandMenu.Root",
      en: "`ref` → `HTMLDivElement` (the dialog panel). A Modal with a top-aligned palette panel; owns the query (cleared on close) and the active item (a new opening starts empty, focus in the search field).",
      ru: "Палитра на основе Modal: панель сверху; хранит запрос (сбрасывается при закрытии) и активный пункт.",
      props: [
        {
          name: "open",
          type: "boolean",
          en: "Controlled visibility; together with `onOpenChange`.",
          ru: "Управляемое открытие; вместе с `onOpenChange`.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial visibility, uncontrolled.",
          ru: "Начальное открытие без контроля.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Called on every open and close: Escape, scrim click, code.",
          ru: "Вызывается при каждом открытии и закрытии: Escape, клик по подложке, код.",
        },
        {
          name: "value",
          type: "string",
          en: "Controlled query; the list filters by it. Together with `onValueChange`.",
          ru: "Управляемый запрос; список фильтруется по нему. Вместе с `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '""',
          en: "Initial query, uncontrolled.",
          ru: "Начальный запрос без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: 'Called with the new query: typing, and `""` when the palette closes.',
          ru: 'Вызывается с новым запросом: ввод и `""` при закрытии палитры.',
        },
        {
          name: "closeOnOutsideClick",
          type: "boolean",
          default: "true",
          en: "A click on the scrim closes the palette; focus returns to the opener.",
          ru: "Клик по подложке закрывает палитру; фокус возвращается на открывший элемент.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          en: "Escape closes the palette.",
          ru: "Escape закрывает палитру.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of the rows and the search row: item height, text, icon.",
          ru: "Ярус строк и строки поиска: высота пункта, текст, иконка.",
        },
        {
          name: "labels",
          type: "Partial<CommandMenuLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "aria-label · aria-labelledby · aria-describedby",
          type: "string",
          en: "Name and description of the dialog when there is no `CommandMenu.Title` / `Description`.",
          ru: "Имя и описание диалога, если нет `CommandMenu.Title` / `Description`.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Title, Description, Input, List, Footer.",
          ru: "Title, Description, Input, List, Footer.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the dialog panel.",
          ru: "`className` и остальные атрибуты панели диалога.",
        },
      ],
    },
    {
      name: "CommandMenu.Title · CommandMenu.Description",
      en: "`ref` → `HTMLHeadingElement` / `HTMLParagraphElement`. `<h2>` / `<p>` above the search row; they name and describe the dialog. + native props except `id`.",
      ru: "Видимый заголовок и описание над поиском; дают диалогу имя и описание.",
      props: [],
    },
    {
      name: "CommandMenu.Input",
      en: '`ref` → `HTMLInputElement`. The search row: a search icon and `<input role="combobox">` controlling the list; shows `CommandMenu.Root` `value`; takes focus on open; no focus ring (the caret is the indicator). + native input props except `value` / `defaultValue`.',
      ru: 'Строка поиска: иконка и поле `role="combobox"` с запросом из `CommandMenu.Root`; стрелки, Home, End и Enter управляют списком.',
      props: [
        {
          name: "placeholder",
          type: "string",
          default: "labels.search",
          en: "Placeholder; also the default accessible name comes from `labels.search`.",
          ru: "Плейсхолдер; имя поля по умолчанию — `labels.search`.",
        },
      ],
    },
    {
      name: "CommandMenu.List",
      en: '`ref` → `HTMLElement`. The scrolling `role="listbox"` (a ScrollContainer) under the search row. + native props.',
      ru: 'Прокручиваемый список результатов `role="listbox"`.',
      props: [],
    },
    {
      name: "CommandMenu.Group",
      en: '`ref` → `HTMLDivElement`. `<div role="group">` named by its `label`; hidden while none of its items match. + native `<div>` props.',
      ru: "Раздел пунктов с подписью; скрывается, если ни один пункт не подходит.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Heading of the group (caption, muted); also its accessible name.",
          ru: "Подпись раздела (caption, приглушённая) и его доступное имя.",
        },
      ],
    },
    {
      name: "CommandMenu.Item",
      en: '`ref` → `HTMLButtonElement`. `<button role="option">`; the active item has `aria-selected` and the highlight fill. + native button props.',
      ru: 'Пункт `role="option"`; активный выделен заливкой и `aria-selected`.',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Text matched against the query together with `keywords`.",
          ru: "Текст, по которому ищет запрос, вместе с `keywords`.",
        },
        {
          name: "keywords",
          type: "string",
          en: "Extra words for the query (synonyms, English names).",
          ru: "Дополнительные слова для поиска (синонимы, английские названия).",
        },
        {
          name: "onSelect",
          type: "() => void",
          en: "Runs the command: a click, or Enter while the item is active.",
          ru: "Выполняет команду: клик или Enter на активном пункте.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Unavailable right now: shown muted with `aria-disabled`, skipped by the arrows, does not run.",
          ru: "Недоступна сейчас: видна приглушённой с `aria-disabled`, стрелки её пропускают, не выполняется.",
        },
      ],
    },
    {
      name: "CommandMenu.ItemIcon · CommandMenu.ItemShortcut",
      en: "`ref` → `HTMLSpanElement` / `HTMLElement` (the `<kbd>`). An `aria-hidden` `<span>` holding the leading glyph at the tier icon size / a `Kbd` one tier below, pushed to the end of the item — a hint, not a handler. + native props.",
      ru: "Иконка в начале пункта / подсказка клавиш (Kbd) в конце пункта.",
      props: [],
    },
    {
      name: "CommandMenu.ItemText",
      en: "`ref` → `HTMLSpanElement`. A `<span>` column: the title with an ellipsis and an optional description line. + native `<span>` props.",
      ru: "Текст пункта: заголовок с многоточием и необязательная строка описания.",
      props: [
        {
          name: "description",
          type: "ReactNode",
          en: "Second line (path, details): caption, muted.",
          ru: "Вторая строка (путь, детали): caption, приглушённая.",
        },
      ],
    },
    {
      name: "CommandMenu.Empty",
      en: '`ref` → `HTMLDivElement`. A compact EmptyPage with `role="status"`, shown only while nothing matches: `labels.empty`, `labels.emptyHint`, and `children` as an action under them.',
      ru: "Пустой результат (компактный EmptyPage), только когда ничего не найдено; `children` — действие.",
      props: [],
    },
    {
      name: "CommandMenu.Footer · CommandMenu.FooterHint",
      en: "`ref` → `HTMLDivElement` / `HTMLSpanElement`. A bottom row of hints with a hairline above / one hint: every entry of `keys` in its own `Kbd`, then the label (`children`). + native props.",
      ru: "Нижняя строка подсказок / одна подсказка: каждая клавиша в своём Kbd и подпись.",
      props: [
        {
          name: "keys",
          type: "ReactNode[]",
          required: true,
          en: "FooterHint: the keys (text or icons).",
          ru: "FooterHint: клавиши (текст или иконки).",
        },
      ],
    },
  ],
  labels: [
    {
      key: "search",
      default: "Поиск",
      en: "Default placeholder and accessible name of `CommandMenu.Input`.",
      ru: "Плейсхолдер и имя поля поиска по умолчанию.",
    },
    {
      key: "empty",
      default: "Ничего не найдено",
      en: "`CommandMenu.Empty`: nothing matches the query.",
      ru: "Пустой результат: по запросу ничего нет.",
    },
    {
      key: "emptyHint",
      default: "Попробуйте изменить запрос",
      en: 'Second line of `CommandMenu.Empty`; `""` hides it.',
      ru: "Вторая строка пустого результата; пустая строка скрывает её.",
    },
  ],
};
