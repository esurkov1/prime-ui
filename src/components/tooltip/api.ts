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
      ru: "Группа подсказок без своего DOM: открыта одна; после первой соседние открываются сразу и без анимации, пока не пройдёт `skipDelayDuration` без открытой подсказки.",
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
      en: "No DOM of its own: clones the single child and links it to the tooltip with `aria-describedby`. A `disabled` child — by its own prop or a disabled `Fieldset` around it — is wrapped in a focusable `<span>`; a child that is no tab stop becomes one.",
      ru: "Без своего DOM: клонирует дочерний элемент и связывает его с подсказкой через `aria-describedby`. Контрол в состоянии `disabled` — своим пропом или внутри выключенного `Fieldset` — оборачивает в фокусируемый `<span>`; нефокусируемый элемент делает точкой Tab.",
      props: [
        {
          name: "children",
          type: "ReactElement",
          required: true,
          en: "One element: a control, a disabled control or a non-interactive element such as a Badge.",
          ru: "Один элемент: контрол, неактивный контрол или неинтерактивный элемент вроде Badge.",
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
          type: '"auto" | "start" | "center" | "end"',
          default: '"center"',
          en: "Alignment along the trigger: centred by default; `auto` lines the chip up with the trigger edge that has more room beyond it; `start` or `end` fix the edge. The arrow keeps pointing at the trigger.",
          ru: "Выравнивание по триггеру: по умолчанию по центру; `auto` выравнивает чип по краю триггера, за которым больше места; `start` или `end` задают край явно. Стрелка всё равно указывает на триггер.",
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
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focus on the trigger opens the tooltip after the delay.",
        ru: "Фокус на триггере открывает подсказку после задержки.",
      },
      {
        keys: "Escape",
        en: "Hides the tooltip; focus stays on the trigger.",
        ru: "Скрывает подсказку; фокус остаётся на триггере.",
      },
    ],
    aria: [
      {
        en: 'The chip is `role="tooltip"`; while open the trigger points at it with `aria-describedby` (appended to the child\'s own).',
        ru: 'Чип — `role="tooltip"`; пока он открыт, триггер ссылается на него через `aria-describedby`.',
      },
      {
        en: "`Tooltip.Trigger` composes the child's `ref`, sets `data-state` and chains the child's `onPointerEnter`, `onPointerLeave`, `onPointerDown`, `onFocus` and `onBlur`.",
        ru: "`Tooltip.Trigger` соединяет `ref` ребёнка, ставит `data-state` и сцепляет его `onPointerEnter`, `onPointerLeave`, `onPointerDown`, `onFocus` и `onBlur`.",
      },
      {
        en: "The tooltip is a description, not the name: an icon-only button needs its own `aria-label`.",
        ru: "Подсказка — описание, а не имя: иконке-кнопке нужен свой `aria-label`.",
      },
      {
        en: "The pointer may move onto the chip without closing it (WCAG 1.4.13); a touch does not open it, focus does.",
        ru: "Указатель может перейти на чип — подсказка не закроется (WCAG 1.4.13); касание не открывает её, фокус — открывает.",
      },
      {
        en: "Tooltip has no `closeOnEscape` / `closeOnOutsideClick` (foundation §8): it closes on pointer-leave, blur, a press on the trigger and Escape, and Escape cannot be turned off — WCAG 1.4.13 requires the chip to be dismissable without moving the pointer or focus.",
        ru: "У подсказки нет `closeOnEscape` / `closeOnOutsideClick`: она закрывается при уходе указателя, потере фокуса, нажатии на триггер и по Escape, а Escape не отключается — WCAG 1.4.13 требует закрывать чип, не двигая указатель и фокус.",
      },
      {
        en: 'A `disabled` control (its own prop or a disabled `Fieldset`) is wrapped by the kit in a focusable `<span>`: the host takes hover and Tab, the focus ring is drawn on the control. Around a button the host is that button for assistive tech — `role="button"`, `aria-disabled`, named by the control through `aria-labelledby` — and the control itself leaves the tree.',
        ru: 'Контрол в состоянии `disabled` (свой проп или выключенный `Fieldset`) кит оборачивает в фокусируемый `<span>`: наведение и Tab получает обёртка, кольцо фокуса рисуется на контроле. Вокруг кнопки обёртка и есть эта кнопка для скринридера — `role="button"`, `aria-disabled`, имя от контрола через `aria-labelledby`, — а сам контрол из дерева уходит.',
      },
      {
        en: "A trigger that is no tab stop (Badge, Avatar, ProgressCircle, `Icon` with `label`) gets `tabIndex={0}` and the focus ring; its name comes from `aria-label` or the icon `label`.",
        ru: "Нефокусируемый триггер (Badge, Avatar, ProgressCircle, `Icon` с `label`) получает `tabIndex={0}` и кольцо фокуса; его имя — `aria-label` или `label` у иконки.",
      },
    ],
  },
};
