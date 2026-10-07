import type { ComponentApi } from "../../../scripts/docs/componentApi";

const SPAN_REST = {
  name: "…rest",
  type: "HTMLAttributes<HTMLSpanElement>",
  en: "`className` and the other span attributes.",
  ru: "`className` и остальные атрибуты span.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "Stepper.Root",
      en: "`ref` → `HTMLOListElement`. `<ol>` of items; owns the current step, numbers the items and adds chevrons between horizontal ones.",
      ru: "Список `<ol>`: хранит текущий шаг, нумерует пункты и ставит шевроны между горизонтальными.",
      props: [
        {
          name: "value",
          type: "number",
          en: "Current step, 0-based (controlled).",
          ru: "Текущий шаг с нуля (управляемый режим).",
        },
        {
          name: "defaultValue",
          type: "number",
          default: "0",
          en: "Initial step (uncontrolled).",
          ru: "Начальный шаг (неуправляемый режим).",
        },
        {
          name: "onValueChange",
          type: "(index: number) => void",
          en: "Called with the index of the clicked item.",
          ru: "Вызывается с индексом нажатого пункта.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"vertical"',
          en: "Column of rows, or a row with chevrons that stacks below a 480px container.",
          ru: "Столбец строк или ряд с шевронами, который уже 480px встаёт в столбец.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Indicator 20 · 24 · 28 · 32 · 36, title in the control text of the tier.",
          ru: "Индикатор 20 · 24 · 28 · 32 · 36, заголовок кеглем контрола яруса.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Stepper.Item`s as direct children (an array from `map` is fine).",
          ru: "Пункты `Stepper.Item` прямыми детьми (массив из `map` подходит).",
        },
        {
          name: "…rest",
          type: 'Omit<OlHTMLAttributes<HTMLOListElement>, "defaultValue" | "onChange">',
          en: "`aria-label`, `className` and the other list attributes.",
          ru: "`aria-label`, `className` и остальные атрибуты списка.",
        },
      ],
    },
    {
      name: "Stepper.Item",
      en: '`forwardRef` → `HTMLButtonElement`. One step: an `<li>` with a `<button>`; `aria-current="step"` when active.',
      ru: 'Один шаг: `<li>` с кнопкой; у активного — `aria-current="step"`.',
      props: [
        {
          name: "status",
          type: '"pending" | "active" | "completed" | "danger"',
          en: "Overrides the status derived from `value` (before → `completed`, equal → `active`, after → `pending`).",
          ru: "Переопределяет статус из `value` (до — `completed`, равен — `active`, после — `pending`).",
        },
        {
          name: "disabled",
          type: "boolean",
          en: "The item cannot be selected.",
          ru: "Пункт нельзя выбрать.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Stepper.Indicator`, `Stepper.Content`, optional `Stepper.Arrow`.",
          ru: "`Stepper.Indicator`, `Stepper.Content`, необязательная `Stepper.Arrow`.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">',
          en: "`onClick` (runs first; `preventDefault()` stops the selection), `className` and the other button attributes.",
          ru: "`onClick` (выполняется первым; `preventDefault()` отменяет выбор), `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "Stepper.Indicator",
      en: "No ref. The circle (`aria-hidden`): the item number, or a check when completed.",
      ru: "Кружок: номер пункта или галочка у пройденного.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: 'Replaces the default content, e.g. `<Icon name="status.danger" />`.',
          ru: 'Заменяет содержимое по умолчанию, например `<Icon name="status.danger" />`.',
        },
        SPAN_REST,
      ],
    },
    {
      name: "Stepper.Content",
      en: "No ref. Text column for the title and the description.",
      ru: "Колонка текста: заголовок и описание.",
      props: [SPAN_REST],
    },
    {
      name: "Stepper.Title · Stepper.Description",
      en: "No ref. Step title in the control text; muted secondary line in the hint text.",
      ru: "Заголовок шага кеглем контрола; приглушённая вторая строка кеглем подсказки.",
      props: [SPAN_REST],
    },
    {
      name: "Stepper.Arrow",
      en: "No ref. Trailing chevron (`aria-hidden`) for vertical items that open a page or panel.",
      ru: "Шеврон в конце вертикального пункта, который открывает страницу или панель.",
      props: [
        {
          name: "className",
          type: "string",
          en: "Extra class.",
          ru: "Дополнительный класс.",
        },
      ],
    },
  ],
  labels: [],
};
