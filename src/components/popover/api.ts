import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Popover.Root",
      en: "No DOM, no ref. Open state and dismiss policy.",
      ru: "Состояние открытия и политика закрытия; своего DOM нет.",
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
          en: "Called on every open and close: trigger, `Popover.Close`, Escape, outside press, code.",
          ru: "Вызывается при каждом открытии и закрытии: триггер, `Popover.Close`, Escape, клик снаружи, код.",
        },
        {
          name: "closeOnOutsideClick",
          type: "boolean",
          default: "true",
          en: "A pointerdown outside the panel and its trigger closes it; focus follows the pointer.",
          ru: "Нажатие вне панели и триггера закрывает её; фокус остаётся там, куда нажали.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          en: "Escape closes the panel and returns focus to the trigger.",
          ru: "Escape закрывает панель и возвращает фокус на триггер.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Trigger (or Anchor) and Content.",
          ru: "Trigger (или Anchor) и Content.",
        },
      ],
    },
    {
      name: "Popover.Trigger · Popover.Anchor · Popover.Close",
      en: "No DOM: clone the single child and merge `ref` and `onClick`. Trigger toggles the panel and adds `aria-haspopup=\"dialog\"`, `aria-expanded`, `aria-controls`, `data-state` (the child's own `id` wins); Anchor only positions the panel and keeps presses on it from dismissing (open state comes from `open`); Close closes the panel unless the child's handler calls `preventDefault()`.",
      ru: "Без DOM: клонируют единственный дочерний элемент. Trigger открывает и закрывает панель и ставит ARIA; Anchor только задаёт якорь положения (открытием управляет `open`); Close закрывает панель.",
      props: [
        {
          name: "children",
          type: "ReactElement",
          required: true,
          en: "One element, usually a Button (Anchor: any element, e.g. a toolbar).",
          ru: "Один элемент, обычно Button (у Anchor — любой, например панель инструментов).",
        },
      ],
    },
    {
      name: "Popover.Content",
      en: '`ref` → `HTMLDivElement`. Portal + `role="dialog"` on the floating surface (a ScrollContainer); renders while open and during its exit animation. Named by `Popover.Title`, else by the trigger.',
      ru: 'Портал и панель `role="dialog"`; прокручивается, если не помещается рядом с триггером.',
      props: [
        {
          name: "side",
          type: '"top" | "right" | "bottom" | "left"',
          default: '"bottom"',
          en: "Preferred side; flips to the opposite side when there is no room.",
          ru: "Желаемая сторона; при нехватке места панель переходит на противоположную.",
        },
        {
          name: "align",
          type: '"start" | "center" | "end"',
          default: '"start"',
          en: "Alignment along the trigger; shifts inside the viewport.",
          ru: "Выравнивание по триггеру; панель сдвигается в пределы экрана.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of the text, padding and gap; also the size context of the controls inside.",
          ru: "Ярус текста, отступов и зазора; его же получают контролы внутри.",
        },
        {
          name: "matchTriggerWidth",
          type: "boolean",
          default: "false",
          en: "The panel is exactly as wide as the trigger and its text wraps.",
          ru: "Ширина панели равна ширине триггера, текст переносится.",
        },
        {
          name: "trapFocus",
          type: "boolean",
          default: "false",
          en: "Tab cycles inside the panel (forms); focus returns to the trigger on close.",
          ru: "Tab ходит по кругу внутри панели (формы); при закрытии фокус возвращается на триггер.",
        },
        {
          name: "flush",
          type: "boolean",
          default: "false",
          en: "No inner padding and no gap: rows and dividers reach the panel edges; the content lays out its own spacing.",
          ru: "Без внутренних полей и зазора: строки и разделители доходят до краёв, отступы задаёт содержимое.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "role">',
          en: "`className` and the other attributes of the panel.",
          ru: "`className` и остальные атрибуты панели.",
        },
      ],
    },
    {
      name: "Popover.Header · Popover.Title · Popover.Description · Popover.Actions",
      en: "No ref. `<div>` (title + description with a 4 px step) / `<h2>` (names the dialog) / `<p>` (describes it) / `<div>` (buttons at the end, stacked full width below 480 px). + native props.",
      ru: "Шапка, заголовок (имя диалога), описание и ряд кнопок; текст следует ярусу панели.",
      props: [],
    },
  ],
  labels: [],
};
