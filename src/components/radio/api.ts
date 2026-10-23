import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { FIELD_HINT_TONE_PROP } from "../../internal/field.api";
import { RADIO_GROUP_LABELS } from "./Radio";

export const api: ComponentApi = {
  parts: [
    {
      name: "Radio.Group",
      en: '`ref` → `HTMLDivElement` (the field frame). Owns the value, the shared `name` and size; renders the group label and the hint / error. `id` and the `aria-*` naming props go to the `role="radiogroup"` element.',
      ru: 'Держит значение, общий `name` и размер; подпись группы сверху, подсказка или ошибка под вариантами. `id` и пропсы имени `aria-*` уходят на элемент `role="radiogroup"`.',
      props: [
        {
          name: "value",
          type: "string",
          en: "Controlled value (the `value` of the chosen `Radio.Root`).",
          ru: "Управляемое значение (`value` выбранного `Radio.Root`).",
        },
        {
          name: "defaultValue",
          type: "string",
          en: "Initial value when uncontrolled.",
          ru: "Начальное значение без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the value of the newly chosen option.",
          ru: "Значение нового выбранного варианта.",
        },
        {
          name: "name",
          type: "string",
          en: "Native `name` shared by the radios; generated when omitted.",
          ru: "Нативный `name` для всех вариантов; иначе генерируется.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of every circle, text, the label and the hint. Without it the group takes the tier of its host (LoginForm, Popover, a panel with a size), else `m`.",
          ru: "Ярус кружков, текста, подписи и подсказки. Без него группа берёт ярус хоста (LoginForm, Popover, панель с размером), иначе `m`.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Group heading above the options; names the radiogroup through `aria-labelledby`. Without it, pass `aria-label`.",
          ru: "Подпись группы; называет radiogroup через `aria-labelledby`. Без неё — `aria-label`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label, native `required` on the radios and `aria-required` on the group.",
          ru: "Красная `*` после подписи, нативный `required` и `aria-required` на группе.",
        },
        {
          name: "optional",
          type: "boolean",
          default: "false",
          en: "Muted marker right after the label text (`labels.optional`).",
          ru: "Приглушённая пометка после подписи (`labels.optional`).",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the options. Hidden while `error` is shown.",
          ru: "Подсказка под вариантами; скрывается, пока показан `error`.",
        },
        FIELD_HINT_TONE_PROP,
        {
          name: "error",
          type: "ReactNode",
          en: "Error message under the options; implies `invalid`.",
          ru: "Текст ошибки под вариантами; включает `invalid`.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "Danger ring on the unchecked circles and `aria-invalid` on the group and the inputs. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо у невыбранных кружков, `aria-invalid`. Непустой `error` включает его.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables every option.",
          ru: "Отключает все варианты.",
        },
        {
          name: "orientation",
          type: '"vertical" | "horizontal"',
          default: '"vertical"',
          en: "`vertical` stacks the options; `horizontal` lays them out in a wrapping row. Sets `aria-orientation`.",
          ru: "`vertical` — столбец; `horizontal` — ряд с переносом. Ставит `aria-orientation`.",
        },
        {
          name: "labels",
          type: "Partial<RadioGroupLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "id",
          type: "string",
          en: 'Id of the `role="radiogroup"` element (generated when omitted); also the default `name`.',
          ru: 'Id элемента `role="radiogroup"` (иначе генерируется); он же `name` по умолчанию.',
        },
        {
          name: "aria-label / aria-labelledby / aria-describedby",
          type: "string",
          en: "Name and description of the radiogroup (`aria-describedby` is merged before the hint / error ids).",
          ru: "Имя и описание radiogroup (`aria-describedby` — перед id подсказки и ошибки).",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "The `Radio.Root` options.",
          ru: "Варианты `Radio.Root`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange" | "dir">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>`.",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля.",
        },
      ],
    },
    {
      name: "Radio.Root",
      en: "`ref` → `HTMLInputElement` (the native radio). One option inside `Radio.Group`: the `<label>` row with the input and the circle, and its hint; native input props go to the input.",
      ru: "Один вариант внутри `Radio.Group`: строка-`<label>` с input и кружком и его подсказка; нативные пропсы input уходят на input.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Value reported to the group when this option is chosen.",
          ru: "Значение, которое получает группа при выборе варианта.",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Description under the option text, linked through `aria-describedby`.",
          ru: "Описание под текстом варианта, связано через `aria-describedby`.",
        },
        FIELD_HINT_TONE_PROP,
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables this option only.",
          ru: "Отключает только этот вариант.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Radio.Label`. Without it only the circle renders — give the root an `aria-label`.",
          ru: "`Radio.Label`. Без него — только кружок; задайте `aria-label`.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the option `<div>`.",
          ru: "Класс на `<div>` варианта.",
        },
        {
          name: "…rest",
          type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "checked" | "defaultChecked" | "onChange" | "name" | "value">',
          en: "`id`, `aria-label`, `aria-describedby`, `onBlur`… on the native input.",
          ru: "`id`, `aria-label`, `aria-describedby`, `onBlur`… на нативном input.",
        },
      ],
    },
    {
      name: "Radio.Label",
      en: "`ref` → `HTMLSpanElement`. The visible text in the text column of the option row. Native `<span>` props.",
      ru: "Видимый текст варианта в колонке текста. Нативные пропсы `<span>`.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Radio.Indicator",
      en: '`ref` → `HTMLSpanElement`. The circle alone, without an input (`aria-hidden`, no focus or clicks) for elements that carry the state themselves: `role="radio"` + `aria-checked` inside a `role="radiogroup"`, a choice card.',
      ru: 'Кружок без input (`aria-hidden`, без фокуса и кликов) для элементов, которые сами несут состояние: `role="radio"` + `aria-checked` внутри `role="radiogroup"`, карточка выбора.',
      props: [
        {
          name: "checked",
          type: "boolean",
          default: "false",
          en: "Shows the dot.",
          ru: "Показывает точку.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disabled fill.",
          ru: "Неактивная заливка.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          en: "Circle tier; without it the nearest control size, else `m`.",
          ru: "Ярус кружка; без него — ярус ближайшего контрола, иначе `m`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className`, `data-*` and the other span attributes.",
          ru: "`className`, `data-*` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: labelRows(RADIO_GROUP_LABELS, {
    optional: {
      en: "Marker after the group label when `optional`.",
      ru: "Пометка после подписи группы при `optional`.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses the selected option (or the first one when nothing is selected).",
        ru: "Фокус на выбранный вариант (или первый, если ничего не выбрано).",
      },
      {
        keys: "ArrowDown · ArrowRight · ArrowUp · ArrowLeft",
        en: "Selects the next or previous option of the group (native radio behaviour).",
        ru: "Выбирает следующий или предыдущий вариант группы (нативное поведение radio).",
      },
      { keys: "Space", en: "Selects the focused option.", ru: "Выбирает вариант в фокусе." },
    ],
    aria: [
      {
        en: '`Radio.Group` is `role="radiogroup"`, named by its `label` through `aria-labelledby`, or by `aria-label`.',
        ru: '`Radio.Group` — `role="radiogroup"`, названный подписью (`label`) через `aria-labelledby` или `aria-label`.',
      },
      {
        en: "`aria-required`, `aria-invalid` and `aria-orientation` sit on the group; the group hint or error is in its `aria-describedby`.",
        ru: "`aria-required`, `aria-invalid`, `aria-orientation` на группе; подсказка или ошибка группы — в её `aria-describedby`.",
      },
      {
        en: 'Every option is a native `<input type="radio">` with the shared `name`; an option `hint` is linked through `aria-describedby`.',
        ru: 'Каждый вариант — нативный `<input type="radio">` с общим `name`; описание варианта (`hint`) связано через `aria-describedby`.',
      },
      {
        en: '`Radio.Indicator` is `aria-hidden`; the host element carries `role="radio"` and `aria-checked`.',
        ru: '`Radio.Indicator` скрыт (`aria-hidden`); состояние несёт элемент-хозяин (`role="radio"`, `aria-checked`).',
      },
    ],
  },
};
