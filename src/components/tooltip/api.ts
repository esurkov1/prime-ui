import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Tooltip.Root",
      en: "No DOM, no ref. State of one tooltip; without a Provider it joins the kit-wide default group (400 / 300).",
      ru: "Состояние одной подсказки; без Provider входит в общую группу кита (400 / 300 мс).",
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
          en: "Called on hover, focus, blur, pointer-leave, press, Escape, and when a neighbour in the group opens.",
          ru: "Вызывается при наведении, фокусе, потере фокуса, уходе указателя, нажатии, Escape и когда открывается соседняя подсказка группы.",
        },
        {
          name: "delayDuration",
          type: "number",
          default: "400",
          en: "Show delay in ms for this tooltip (the Provider's when omitted); hiding never waits for it.",
          ru: "Задержка показа в мс (без пропа — из Provider); скрытие её не ждёт.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Tooltip.Trigger and Tooltip.Content.",
          ru: "Tooltip.Trigger и Tooltip.Content.",
        },
      ],
    },
    {
      name: "Tooltip.Provider",
      en: "No DOM, no ref. Its tooltips form a group: one is open at a time, and once one has been shown the next opens at once and without motion, until `skipDelayDuration` passes with none open.",
      ru: "Группа подсказок: открыта одна; после первой соседние открываются сразу и без анимации.",
      props: [
        {
          name: "delayDuration",
          type: "number",
          default: "400",
          en: "Show delay in ms for every Tooltip.Root inside.",
          ru: "Задержка показа в мс для всех подсказок внутри.",
        },
        {
          name: "skipDelayDuration",
          type: "number",
          default: "300",
          en: "Window in ms after a tooltip closes during which the next one opens instantly.",
          ru: "Окно в мс после закрытия, в которое следующая подсказка открывается сразу.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Subtree.",
          ru: "Поддерево.",
        },
      ],
    },
    {
      name: "Tooltip.Trigger",
      en: "No DOM: clones the single child, composes its `ref`, appends the tooltip id to its `aria-describedby` while open, sets `data-state` and chains `onPointerEnter`, `onPointerLeave`, `onPointerDown`, `onFocus`, `onBlur`.",
      ru: "Без DOM: клонирует дочерний элемент и связывает его с подсказкой.",
      props: [
        {
          name: "children",
          type: "ReactElement",
          required: true,
          en: "One focusable element: a Button, or a `tabIndex={0}` wrapper around a disabled control.",
          ru: "Один фокусируемый элемент: Button или обёртка с `tabIndex={0}` вокруг неактивного контрола.",
        },
      ],
    },
    {
      name: "Tooltip.Content",
      en: '`ref` → `HTMLDivElement`. Portaled `role="tooltip"` chip with an arrow; renders while open and during its exit animation, placed before paint.',
      ru: 'Чип `role="tooltip"` со стрелкой в портале; ставится на место до отрисовки.',
      props: [
        {
          name: "side",
          type: '"top" | "bottom" | "left" | "right"',
          default: '"top"',
          en: "Preferred side; flips to the opposite one when it does not fit, then shifts inside the viewport.",
          ru: "Желаемая сторона; без места переворачивается на противоположную и сдвигается в пределы экрана.",
        },
        {
          name: "align",
          type: '"start" | "center" | "end"',
          default: '"center"',
          en: "Alignment along the trigger: its start edge, centre or end edge; the arrow keeps pointing at the trigger.",
          ru: "Выравнивание по триггеру: начало, центр или конец; стрелка всё равно указывает на триггер.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Text and padding tier; also the size context of controls inside (a Kbd).",
          ru: "Ярус текста и отступов; его же получают контролы внутри (Kbd).",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Hint text, optionally with a Kbd.",
          ru: "Текст подсказки, при необходимости с Kbd.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "role" | "onPointerEnter" | "onPointerLeave">',
          en: "`className`, `style` and the other attributes of the chip.",
          ru: "`className`, `style` и остальные атрибуты чипа.",
        },
      ],
    },
  ],
  labels: [],
};
