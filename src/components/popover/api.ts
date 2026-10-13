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
      en: "No DOM: clone the single child and merge `ref` and `onClick`. Trigger toggles the panel and sets its ARIA; Anchor only positions the panel (open state comes from `open`); Close closes the panel.",
      ru: "Без DOM: клонируют единственный дочерний элемент и сливают `ref` и `onClick`. Trigger открывает и закрывает панель и ставит ARIA; Anchor только задаёт положение (открытием управляет `open`); Close закрывает панель.",
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
      en: '`ref` → `HTMLDivElement`. Portal + `role="dialog"` floating panel that scrolls inside, named by `Popover.Title`. Below 640px of viewport, opened from a Trigger, it is a bottom sheet.',
      ru: 'Портал и плавающая панель `role="dialog"` с прокруткой внутри, названная `Popover.Title`. Уже 640px экрана, открытая из Trigger, она становится шторкой снизу.',
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
          type: '"auto" | "start" | "center" | "end"',
          default: '"auto"',
          en: "Alignment along the trigger. `auto` lines the panel up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix the edge.",
          ru: "Выравнивание по триггеру. `auto` выравнивает панель по краю триггера, за которым больше места; `start`, `center` или `end` задают край явно.",
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
          en: "Tab cycles inside the panel (forms). Without it Tab past the last (Shift+Tab before the first) stop closes the panel and returns focus to the trigger.",
          ru: "Tab ходит по кругу внутри панели (формы). Без него Tab за последний элемент закрывает панель и возвращает фокус на триггер.",
        },
        {
          name: "initialFocus",
          type: "boolean",
          default: "true with Trigger, false with Anchor",
          en: "Focus moves into the panel on open (`[data-autofocus]`, else the first tab stop, else the panel). Turn it on for an anchored panel opened by a command, such as a Dropdown item, so focus does not stay on the menu trigger.",
          ru: "Фокус переходит в панель при открытии (`[data-autofocus]`, иначе первый фокусируемый, иначе панель). Включите для панели с `Anchor`, открытой командой — пунктом Dropdown, — чтобы фокус не остался на кнопке меню.",
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
      en: "`ref` → the element. `<div>` (title + description with a 4 px step) / `<h2>` (names the dialog) / `<p>` (describes it) / `<div>` (buttons at the end, stacked full width on phones, below 640 px). + native props.",
      ru: "Шапка, заголовок (имя диалога), описание и ряд кнопок; текст следует ярусу панели.",
      props: [],
    },
  ],
  labels: [],
};
