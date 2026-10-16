import { type ApiProp, type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { FIELD_HINT_TONE_PROP, FIELD_REQUIRED_LABEL_DOCS } from "../../internal/field.api";
import { DATEPICKER_LABELS } from "./DatepickerPanel";

/** The value of both parts: the mode and the value triad. */
const VALUE_PROPS: ApiProp[] = [
  {
    name: "mode",
    type: '"single" | "range"',
    required: true,
    en: "One date or a period; sets the value type.",
    ru: "Одна дата или период; задаёт тип значения.",
  },
  {
    name: "value",
    type: "Date | null  ·  DatepickerRange",
    en: "Controlled value: a date (`single`) or `{ from, to }` in wall-clock time (`range`); `null` — not set.",
    ru: "Значение, управляемо: дата (`single`) или `{ from, to }` в «настенном» времени (`range`); `null` — не задано.",
  },
  {
    name: "defaultValue",
    type: "Date | null  ·  DatepickerRange",
    defaultNote: {
      en: "`null` · `{ from: null, to: null }`",
      ru: "`null` · `{ from: null, to: null }`",
    },
    en: "Initial value, uncontrolled.",
    ru: "Начальное значение без контроля.",
  },
  {
    name: "onValueChange",
    type: "(value) => void",
    en: "Called when a pick, a preset, Apply or Reset changes the value.",
    ru: "Выбор дня, пресет, «Применить» или «Сбросить» меняют значение.",
  },
];

/** The calendar options both parts take. */
const CALENDAR_OPTIONS: ApiProp[] = [
  {
    name: "months",
    type: "1 | 2",
    default: "1",
    en: "Months side by side; one when there is no room.",
    ru: "Сколько месяцев рядом; если места мало — один.",
  },
  {
    name: "presets",
    type: "DatepickerPreset[] | false",
    default: "false",
    en: "Preset column (`range` only): `DEFAULT_DATEPICKER_PRESETS` (ends with «Всё время») or picks from `datepickerPresets`; a row above the calendar when narrow.",
    ru: "Колонка периодов (только `range`): `DEFAULT_DATEPICKER_PRESETS` (последний — «Всё время») или выборка из `datepickerPresets`; на узком — строкой над календарём.",
  },
  {
    name: "prompt",
    type: "boolean",
    default: "false",
    en: "Step prompt under the calendar (`labels.pickStart` / `pickEnd` / `pickDate`).",
    ru: "Подсказка шага под календарём (`labels.pickStart` / `pickEnd` / `pickDate`).",
  },
  {
    name: "footer",
    type: "boolean",
    default: "false",
    en: "Footer with date fields and Reset / Apply; without it a pick applies at once.",
    ru: "Нижняя строка с датами и «Сбросить» / «Применить»; без неё выбор применяется сразу.",
  },
  {
    name: "withTime",
    type: "boolean",
    default: "false",
    en: "Time fields in the footer (00:00 — 23:59 by default).",
    ru: "Поля времени в нижней строке (по умолчанию 00:00 — 23:59).",
  },
  {
    name: "isDayDisabled",
    type: "(day: Date) => boolean",
    en: "Days that cannot be picked.",
    ru: "Дни, которые нельзя выбрать.",
  },
  {
    name: "disableFuture",
    type: "boolean",
    default: "false",
    en: "Future days are muted and cannot be picked.",
    ru: "Будущие дни приглушены и недоступны.",
  },
  {
    name: "yearless",
    type: "boolean",
    default: "false",
    en: "An annual day + month: no year, months wrap around inside `YEARLESS_YEAR`.",
    ru: "Ежегодная дата «день + месяц»: без года, листание по кругу в `YEARLESS_YEAR`.",
  },
  {
    name: "resetValue",
    type: "Date | null  ·  DatepickerRange",
    defaultNote: {
      en: "`null` · `{ from: null, to: null }`",
      ru: "`null` · `{ from: null, to: null }`",
    },
    en: "Value applied by Reset.",
    ru: "Значение, которое ставит «Сбросить».",
  },
  {
    name: "today",
    type: "Date",
    defaultNote: { en: "today", ru: "сегодня" },
    en: "«Today» for highlighting, presets and `disableFuture`.",
    ru: "«Сегодня» для подсветки, пресетов и `disableFuture`.",
  },
  {
    name: "locale",
    type: "Locale",
    default: "ru",
    en: "date-fns locale of titles, weekdays and day names.",
    ru: "Локаль date-fns для заголовков, дней недели и имён дней.",
  },
  {
    name: "weekStartsOn",
    type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
    default: "1",
    en: "First day of the week (1 — Monday).",
    ru: "Первый день недели (1 — понедельник).",
  },
  {
    name: "labels",
    type: "Partial<DatepickerLabels>",
    en: "Built-in strings, see Labels.",
    ru: "Системные строки, см. «Доступность».",
  },
];

export const api: ComponentApi = {
  parts: [
    {
      name: "Datepicker.Root",
      en: "`ref` → `HTMLDivElement` (the field frame). A field (label, hint / error, the field button with a calendar icon, the value and a chevron) that opens the calendar panel in a Popover. Takes every calendar option.",
      ru: "Поле (подпись, подсказка или ошибка, кнопка поля с иконкой календаря, значение и шеврон), которое открывает панель календаря в Popover. Принимает все параметры календаря.",
      props: [
        ...VALUE_PROPS,
        {
          name: "open",
          type: "boolean",
          en: "Controlled visibility of the panel.",
          ru: "Видимость панели, управляемо.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial visibility, uncontrolled.",
          ru: "Начальная видимость без контроля.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Field click, Escape, an outside press or an applied value.",
          ru: "Клик по полю, Escape, нажатие снаружи или применённое значение.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          en: "Escape closes the calendar and returns focus to the field.",
          ru: "Escape закрывает календарь и возвращает фокус на поле.",
        },
        {
          name: "closeOnOutsideClick",
          type: "boolean",
          default: "true",
          en: "A press outside the calendar and the field closes it; focus follows the pointer.",
          ru: "Нажатие вне календаря и поля закрывает его; фокус остаётся там, куда нажали.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Field tier (height 28 · 32 · 36 · 40 · 48) and panel tier (day cell 24 · 28 · 32 · 36 · 40). Without it the tier of its host, else `m`.",
          ru: "Ярус поля (высота 28 · 32 · 36 · 40 · 48) и панели (клетка дня 24 · 28 · 32 · 36 · 40). Без него — ярус контейнера, иначе `m`.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Field label; part of the button's accessible name together with the value.",
          ru: "Подпись поля; вместе со значением — доступное имя кнопки.",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Support text under the field (`aria-describedby`).",
          ru: "Подсказка под полем (`aria-describedby`).",
        },
        FIELD_HINT_TONE_PROP,
        {
          name: "error",
          type: "ReactNode",
          en: "Error message in place of the hint; implies `invalid`.",
          ru: "Ошибка на месте подсказки; включает `invalid`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label; the field button is described by `labels.required` (a button takes no `aria-required`).",
          ru: "Красная `*` после подписи; кнопку поля описывает `labels.required` (у кнопки нет `aria-required`).",
        },
        {
          name: "optional",
          type: "boolean",
          en: "Muted `labels.optional` after the label.",
          ru: "Приглушённое `labels.optional` после подписи.",
        },
        {
          name: "invalid",
          type: "boolean",
          en: "Danger ring and `aria-invalid` without a message.",
          ru: "Красное кольцо и `aria-invalid` без текста ошибки.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "The field cannot be opened.",
          ru: "Поле нельзя открыть.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          en: "The field stretches to its container; otherwise it fits the text.",
          ru: "Поле на всю ширину контейнера; иначе — по тексту.",
        },
        {
          name: "align",
          type: '"auto" | "start" | "center" | "end"',
          default: '"auto"',
          en: "Popover alignment to the field. `auto` lines the panel up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix it.",
          ru: "Выравнивание поповера относительно поля. `auto` выравнивает панель по краю триггера, за которым больше места; `start`, `center` или `end` задают край явно.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides only the visual focus ring (`data-focus-ring="false"`).',
          ru: '`false` скрывает только видимое кольцо фокуса (`data-focus-ring="false"`).',
        },
        {
          name: "placeholder",
          type: "string",
          default: "labels.placeholder",
          en: "Field text without a value for this field.",
          ru: "Текст поля без значения для этого поля.",
        },
        {
          name: "valuePrefix",
          type: "string",
          en: "Text before the value, e.g. «С».",
          ru: "Текст перед значением, например «С».",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the field button; generated when omitted.",
          ru: "Id кнопки поля; без него генерируется.",
        },
        {
          name: "name",
          type: "string",
          en: "Submits the value with a form through hidden inputs: `yyyy-MM-dd` (`yyyy-MM-ddTHH:mm` with `withTime`); a range submits two values under the name, `from` then `to` (empty for an open bound).",
          ru: "Отправляет значение с формой через скрытые поля: `yyyy-MM-dd` (`yyyy-MM-ddTHH:mm` с `withTime`); период — два значения под этим именем, `from`, затем `to` (пусто для открытой границы).",
        },
        {
          name: "aria-label · aria-labelledby · aria-describedby",
          type: "string",
          en: "Name without a `label` (the value is appended) and extra description ids.",
          ru: "Имя без `label` (значение добавляется) и дополнительные id описания.",
        },
        ...CALENDAR_OPTIONS,
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control).",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля (правило корня поля: `className`, `ref` и остальное → рамка, `id` → контрол).",
        },
      ],
    },
    {
      name: "Datepicker.Panel",
      en: "`ref` → `HTMLDivElement`. The calendar without a field, as the host's own content (a Drawer sheet, a Card); 1–2 months by the host's width. Takes `mode`, the value triad and every calendar option.",
      ru: "Календарь без поля как собственный контент хоста (шторка Drawer, Card); 1–2 месяца по ширине хоста. Принимает `mode`, тройку значения и все параметры календаря.",
      props: [
        ...VALUE_PROPS,
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Panel tier (day cell 24 · 28 · 32 · 36 · 40). Without it the tier of its host, else `m`.",
          ru: "Ярус панели (клетка дня 24 · 28 · 32 · 36 · 40). Без него — ярус контейнера, иначе `m`.",
        },
        ...CALENDAR_OPTIONS,
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className` and the other attributes of the panel.",
          ru: "`className` и остальные атрибуты панели.",
        },
      ],
    },
  ],
  functions: [
    {
      name: "formatDateValue(date, { withTime })",
      type: "(date: Date, options?: { withTime?: boolean }) => string",
      en: "A date as a form submits it, in local time: `yyyy-MM-dd`, with `withTime` `yyyy-MM-ddTHH:mm` (the value of a `name`d field) — never `toISOString()`, which shifts the day to UTC.",
      ru: "Дата так, как её отправляет форма, по местному времени: `yyyy-MM-dd`, с `withTime` — `yyyy-MM-ddTHH:mm` (значение поля с `name`); не `toISOString()`, который сдвигает день в UTC.",
    },
  ],
  labels: labelRows(DATEPICKER_LABELS, {
    placeholder: { en: "Field text without a value.", ru: "Текст поля без значения." },
    pickStart: {
      en: "Step prompt before the start of a range.",
      ru: "Подсказка до выбора начала периода.",
    },
    pickEnd: {
      en: "Step prompt before the end of a range.",
      ru: "Подсказка до выбора конца периода.",
    },
    pickDate: { en: "Step prompt of a single date.", ru: "Подсказка для одной даты." },
    reset: { en: "Footer reset button.", ru: "Кнопка сброса." },
    apply: { en: "Footer apply button.", ru: "Кнопка применения." },
    prevMonth: { en: "Name of the previous-month arrow.", ru: "Имя стрелки к предыдущему месяцу." },
    nextMonth: { en: "Name of the next-month arrow.", ru: "Имя стрелки к следующему месяцу." },
    rangeStart: { en: "Name of the footer start field.", ru: "Имя поля начала в нижней строке." },
    rangeEnd: { en: "Name of the footer end field.", ru: "Имя поля конца в нижней строке." },
    date: {
      en: "Name of the footer field of a single date.",
      ru: "Имя поля одной даты в нижней строке.",
    },
    timeStart: { en: "Name of the start time input.", ru: "Имя поля времени начала." },
    timeEnd: { en: "Name of the end time input.", ru: "Имя поля времени конца." },
    time: { en: "Name of the time input of a single date.", ru: "Имя поля времени одной даты." },
    until: {
      en: "Prefix of a range without a start: «до 6 окт».",
      ru: "Префикс периода без начала: «до 6 окт».",
    },
    presetsTitle: {
      en: "Heading and group name of the presets column.",
      ru: "Заголовок и имя группы колонки периодов.",
    },
    optional: {
      en: "Muted marker after the label when `optional`.",
      ru: "Приглушённая пометка после подписи при `optional`.",
    },
    ...FIELD_REQUIRED_LABEL_DOCS,
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        en: "On the field opens the calendar; on a day picks it.",
        ru: "На поле открывает календарь; на дне выбирает его.",
      },
      { keys: "← · →", en: "The neighbouring day.", ru: "Соседний день." },
      {
        keys: "↑ · ↓",
        en: "The same day of the neighbouring week.",
        ru: "Тот же день соседней недели.",
      },
      { keys: "Home · End", en: "Start and end of the week.", ru: "Начало и конец недели." },
      {
        keys: "PageUp · PageDown",
        en: "The same day of the neighbouring month; with Shift — of the year.",
        ru: "Тот же день соседнего месяца; с Shift — года.",
      },
      {
        keys: "Escape",
        en: "Closes the calendar and returns focus to the field.",
        ru: "Закрывает календарь и возвращает фокус на поле.",
      },
    ],
    aria: [
      {
        en: "The field is a `<button>` named by the label and the value (or `aria-label` + value); hint and error in `aria-describedby`, an error sets `aria-invalid`.",
        ru: "Поле — `<button>` с именем из подписи и значения (или `aria-label` и значения); подсказка и ошибка — в `aria-describedby`, ошибка ставит `aria-invalid`.",
      },
      {
        en: 'The popover is a `role="dialog"` with a focus trap; focus lands on the picked or today\'s day.',
        ru: 'Календарь — `role="dialog"` с ловушкой фокуса; при открытии фокус на выбранном или сегодняшнем дне.',
      },
      {
        en: 'Every month is a table named by the month; days are buttons with the full date as name, picked ones `aria-pressed`, today `aria-current="date"`.',
        ru: 'Каждый месяц — таблица с именем месяца; дни — кнопки с полной датой в имени, выбранные — `aria-pressed`, сегодня — `aria-current="date"`.',
      },
      {
        en: "One polite live region announces the visible months («Сентябрь 2026 — Октябрь 2026») when they change; the step prompt is a polite live region too; on open the popover focuses the picked (or today's) day (`data-autofocus`); presets are a named group of buttons with `aria-pressed`.",
        ru: "Одна вежливая live-область объявляет видимые месяцы («Сентябрь 2026 — Октябрь 2026») при смене; подсказка шага — тоже вежливая live-область; при открытии поповер ставит фокус на выбранный (или сегодняшний) день (`data-autofocus`); пресеты — именованная группа кнопок с `aria-pressed`.",
      },
    ],
  },
};
