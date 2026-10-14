import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { STEPPER_LABELS } from "./Stepper";

export const api: ComponentApi = {
  parts: [
    {
      name: "Stepper.Root",
      en: "`ref` → `HTMLOListElement`. `<ol>` of items; owns the current step, numbers the items and draws the chevrons between horizontal ones and, with `arrows`, at the end of vertical rows.",
      ru: "Список `<ol>`: хранит текущий шаг, нумерует пункты и рисует шевроны между горизонтальными, а с `arrows` — в конце вертикальных строк.",
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
          en: "Column of rows, or one row with chevrons (steps shrink and wrap their titles) that stacks below a 480px container.",
          ru: "Столбец строк или один ряд с шевронами (шаги сжимаются и переносят заголовки), который уже 480px встаёт в столбец.",
        },
        {
          name: "arrows",
          type: "boolean",
          default: "false",
          en: "Every vertical row ends with a chevron: each step opens a page or panel. Horizontal steps already have their chevrons.",
          ru: "Каждая вертикальная строка заканчивается шевроном: шаг открывает страницу или панель. У горизонтальных шагов шевроны уже есть.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Indicator 20 · 24 · 28 · 32 · 36, title in the control text of the tier. Without it the tier of its host, else `m`.",
          ru: "Индикатор 20 · 24 · 28 · 32 · 36, заголовок кеглем контрола яруса. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "labels",
          type: "Partial<StepperLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
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
      en: '`ref` → `HTMLButtonElement`. One step: an `<li>` with a `<button>` (and, between horizontal steps, the decorative chevron in front of it); `aria-current="step"` on the current one; a completed or danger step adds its status to its name.',
      ru: 'Один шаг: `<li>` с `<button>` (между горизонтальными шагами перед ней — декоративный шеврон); у текущего — `aria-current="step"`; пройденный шаг и шаг с ошибкой добавляют статус к имени.',
      props: [
        {
          name: "status",
          type: '"pending" | "current" | "completed" | "danger"',
          en: "Overrides the status derived from `value` (before → `completed`, equal → `current`, after → `pending`).",
          ru: "Переопределяет статус из `value` (до — `completed`, равен — `current`, после — `pending`).",
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
          en: "`Stepper.Indicator` and `Stepper.Content`.",
          ru: "`Stepper.Indicator` и `Stepper.Content`.",
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
      en: "`ref` → `HTMLSpanElement`. The circle (`aria-hidden`): the item number, a check when completed, the danger mark on a danger step; a status change cross-fades the glyph.",
      ru: "Кружок (`aria-hidden`): номер пункта, галочка у пройденного, значок ошибки у шага с ошибкой; при смене статуса значок сменяется плавно.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: 'Replaces the default content, e.g. `<Icon name="status.info" />`.',
          ru: 'Заменяет содержимое по умолчанию, например `<Icon name="status.info" />`.',
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Stepper.Content",
      en: "`ref` → `HTMLSpanElement`. Text column for the title and the description.",
      ru: "Колонка текста: заголовок и описание.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Stepper.Title · Stepper.Description",
      en: "`ref` → `HTMLSpanElement`. Step title in the control text; muted secondary line in the hint text.",
      ru: "Заголовок шага кеглем контрола; приглушённая вторая строка кеглем подсказки.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: labelRows(STEPPER_LABELS, {
    completed: {
      en: "Spoken after the name of a completed step; the check is only seen.",
      ru: "Произносится после имени пройденного шага; галочку видно только глазами.",
    },
    danger: {
      en: "Spoken after the name of a step that needs attention; its colour and glyph are only seen.",
      ru: "Произносится после имени шага, требующего внимания; цвет и значок видно только глазами.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves focus between items; a disabled one is skipped.",
        ru: "Переводит фокус между шагами; неактивный пропускается.",
      },
      { keys: "Enter · Space", en: "Selects the item.", ru: "Выбирает шаг." },
    ],
    aria: [
      {
        en: 'Semantic `<ol>`; each item is a `<button>` inside an `<li>`; the current one has `aria-current="step"`.',
        ru: 'Семантический `<ol>`; каждый шаг — `<button>` внутри `<li>`, у текущего — `aria-current="step"`.',
      },
      {
        en: "Separators, indicator and arrows are `aria-hidden`; the name comes from Title and Description, and a completed or danger step adds `labels.completed` or `labels.danger` to it.",
        ru: "Разделители, индикатор и стрелки скрыты (`aria-hidden`); имя шага — заголовок и описание, а пройденный шаг и шаг с ошибкой добавляют к нему `labels.completed` или `labels.danger`.",
      },
      {
        en: "Give the `<ol>` an `aria-label` when there are several steppers on a page.",
        ru: "Если степперов на странице несколько, дайте `<ol>` `aria-label`.",
      },
    ],
  },
};
