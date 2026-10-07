import type { ComponentApi } from "../../../scripts/docs/componentApi";

const PALETTE =
  '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"';

const SPAN_REST = {
  name: "…rest",
  type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
  en: "`className` and the other span attributes.",
  ru: "`className` и остальные атрибуты span.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "SegmentedControl.Root",
      en: 'No ref. `<div role="radiogroup">`: the track with the sliding thumb, keyboard handling and a horizontally scrolling `ScrollContainer` row.',
      ru: '`<div role="radiogroup">`: дорожка со скользящим бегунком, клавиатура и горизонтальная прокрутка ряда.',
      props: [
        {
          name: "value",
          type: "string",
          en: "Selected value (controlled).",
          ru: "Выбранное значение (управляемый режим).",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '""',
          en: 'Initial value (uncontrolled); `""` — nothing selected.',
          ru: 'Начальное значение (неуправляемый режим); `""` — ничего не выбрано.',
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the new value on click or arrow keys.",
          ru: "Вызывается с новым значением при клике или стрелках.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables the whole group.",
          ru: "Отключает всю группу.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Control tier; the outer height equals the control height 28 · 32 · 36 · 40 · 48.",
          ru: "Ярус; внешняя высота равна высоте контрола 28 · 32 · 36 · 40 · 48.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          en: "Fills the container; single-line segments share the width equally and truncate.",
          ru: "Заполнить контейнер; однострочные сегменты делят ширину поровну и обрезаются.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`SegmentedControl.Item`s (may be wrapped, e.g. in `Tooltip.Trigger`).",
          ru: "Пункты `SegmentedControl.Item` (можно обернуть, например в `Tooltip.Trigger`).",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">',
          en: "`aria-label` / `aria-labelledby` (name the group), `className` and the other div attributes.",
          ru: "`aria-label` / `aria-labelledby` (имя группы), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "SegmentedControl.Item",
      en: '`forwardRef` → `HTMLButtonElement`. One option, a `<button role="radio">` with roving `tabIndex`; plain text is wrapped to truncate.',
      ru: 'Один вариант — `<button role="radio">` с перемещаемым `tabIndex`.',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Option value compared with the root value.",
          ru: "Значение варианта.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables this option; arrow keys skip it.",
          ru: "Отключает вариант; стрелки его пропускают.",
        },
        {
          name: "color",
          type: PALETTE,
          en: "Palette hue: a dot before the content; while selected the thumb takes a soft fill of the hue with a ring of it.",
          ru: "Оттенок: точка перед содержимым; выбранный бегунок получает мягкую заливку оттенка.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Text, `Icon`, `Label`, `Count`, `Description`. Only an icon → square segment; give it `aria-label`.",
          ru: "Текст, `Icon`, `Label`, `Count`, `Description`. Только иконка — квадратный сегмент с `aria-label`.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type" | "role">',
          en: "`aria-label`, `onClick` (runs first and can `preventDefault()` the selection), `className` and the other button attributes.",
          ru: "`aria-label`, `onClick` (выполняется первым и может отменить выбор), `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "SegmentedControl.Icon",
      en: "No ref. Decorative icon (`aria-hidden`) sized to the tier.",
      ru: "Декоративная иконка размера яруса.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="theme.light" />`.',
          ru: 'Иконка, например `<Icon name="theme.light" />`.',
        },
        SPAN_REST,
      ],
    },
    {
      name: "SegmentedControl.Label",
      en: "No ref. Segment title; truncates with an ellipsis. Plain text is wrapped automatically.",
      ru: "Подпись сегмента; обрезается многоточием. Простой текст оборачивается сам.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Title text.",
          ru: "Текст подписи.",
        },
        SPAN_REST,
      ],
    },
    {
      name: "SegmentedControl.Count",
      en: "No ref. Counter `Badge` after the label, one tier below the control, tabular numbers.",
      ru: "Счётчик `Badge` после подписи, на ярус меньше.",
      props: [
        {
          name: "color",
          type: PALETTE,
          default: '"gray"',
          en: "Badge hue.",
          ru: "Оттенок бейджа.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The number.",
          ru: "Число.",
        },
        {
          name: "className",
          type: "string",
          en: "Extra class.",
          ru: "Дополнительный класс.",
        },
      ],
    },
    {
      name: "SegmentedControl.Description",
      en: "No ref. Muted second line; makes the segment two-line and becomes its `aria-describedby`.",
      ru: "Приглушённая вторая строка; делает сегмент двухстрочным и становится `aria-describedby`.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Second-line text; wrap a key value in `<strong>`.",
          ru: "Текст второй строки; ключевое значение оберните в `<strong>`.",
        },
        SPAN_REST,
      ],
    },
  ],
  labels: [],
};
