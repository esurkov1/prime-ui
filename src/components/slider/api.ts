import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { SLIDER_LABELS } from "./Slider";

export const api: ComponentApi = {
  parts: [
    {
      name: "Slider",
      en: '`ref` → `HTMLDivElement` (the field frame). A framed field: the label row with the value, a native `<input type="range">` over the visual track, then the hint or the error. `id` and `aria-label` go to the range input.',
      ru: 'Поле в рамке, как остальные: подпись со значением, нативный `<input type="range">` поверх дорожки, заливки и ползунка, под ним подсказка или ошибка. `id` и `aria-label` уходят на input.',
      props: [
        {
          name: "value",
          type: "number",
          en: "Controlled value; clamped to `min`…`max`.",
          ru: "Управляемое значение; ограничивается `min`…`max`.",
        },
        {
          name: "defaultValue",
          type: "number",
          default: "min",
          en: "Initial value when uncontrolled.",
          ru: "Начальное значение без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: number) => void",
          en: "Called with the new number while dragging and on every key step.",
          ru: "Новое число при перетаскивании и каждом шаге с клавиатуры.",
        },
        {
          name: "onCommit",
          type: "(value: number) => void | Promise<void>",
          en: "The value the person settled on, once after a drag or a key step. Save here, not in `onValueChange`. Return the save's promise: the thumb dims until it settles; on reject the value goes back.",
          ru: "Итоговое значение — один раз после перетаскивания или шага клавишей. Сохраняйте здесь, а не в `onValueChange`. Верните промис сохранения: ползунок приглушён до ответа; при reject значение возвращается.",
        },
        {
          name: "name",
          type: "string",
          en: "Name of the range input, submitted with a form.",
          ru: "Имя ползунка для отправки с формой.",
        },
        {
          name: "min",
          type: "number",
          default: "0",
          en: "Lower bound.",
          ru: "Нижняя граница.",
        },
        {
          name: "max",
          type: "number",
          default: "100",
          en: "Upper bound.",
          ru: "Верхняя граница.",
        },
        {
          name: "step",
          type: "number",
          default: "1",
          en: "Step of the keyboard and of the snapping; fractions allowed.",
          ru: "Шаг клавиатуры и привязки; можно дробный.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the track thickness T (thumb 4.5T × 3T), the label, the value and the hint. Without it the tier of its host (a form, a panel), else `m`.",
          ru: "Ярус толщины дорожки T (ползунок 4.5T × 3T), подписи и значения. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          default: '"accent"',
          en: "Color of the filled part of the track.",
          ru: "Цвет заполненной части дорожки.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          en: "`vertical` — the track stands upright, minimum at the bottom: a level beside a button, a mixer column.",
          ru: "`vertical` — дорожка стоит вертикально, минимум внизу: уровень у кнопки, колонка микшера.",
        },
        {
          name: "disabled",
          type: "boolean",
          en: "Muted track and thumb, dimmed label and value, no interaction.",
          ru: "Приглушённые дорожка, ползунок, подпись и значение; без взаимодействия.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Visible label linked to the range input (`<label htmlFor>`). Without it, set `aria-label`.",
          ru: "Видимая подпись, связанная с input (`<label htmlFor>`). Без неё задайте `aria-label`.",
        },
        {
          name: "required",
          type: "boolean",
          en: "Red `*` after the label (`aria-hidden`); a range always has a value, so there is no native `required`.",
          ru: "Красная `*` после подписи (`aria-hidden`); у ползунка всегда есть значение, нативного `required` нет.",
        },
        {
          name: "optional",
          type: "boolean",
          en: "Muted marker right after the label text (`labels.optional`).",
          ru: "Приглушённая пометка после подписи (`labels.optional`).",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the track (`aria-describedby`). Hidden while `error` is shown.",
          ru: "Подсказка под дорожкой (`aria-describedby`); скрывается, пока показан `error`.",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Error message in the hint slot; implies `invalid`.",
          ru: "Текст ошибки на месте подсказки; включает `invalid`.",
        },
        {
          name: "invalid",
          type: "boolean",
          en: "`aria-invalid` on the range input and a danger focus ring on the thumb. A non-empty `error` implies it.",
          ru: "`aria-invalid` на input и красное кольцо фокуса у ползунка. Непустой `error` включает его.",
        },
        {
          name: "showValue",
          type: "boolean",
          default: "false",
          en: "Shows the current value at the end of the label row (tabular numbers, `aria-hidden` — the input announces it).",
          ru: "Текущее значение в конце строки подписи (табличные цифры, `aria-hidden` — его объявляет input).",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          en: "Formats the shown value and `aria-valuetext` (units, currency).",
          ru: "Формат показанного значения и `aria-valuetext` (единицы, валюта).",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the range input (generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Id input; иначе генерируется. Id подсказки — `<id>-hint`, ошибки — `<id>-error`.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Accessible name when there is no visible `label`.",
          ru: "Доступное имя, когда нет видимой `label`.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged before the hint / error ids on the range input.",
          ru: "Добавляется перед id подсказки и ошибки.",
        },
        {
          name: "labels",
          type: "Partial<SliderLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `style` and the other attributes of the field frame `<div>`.",
          ru: "`className`, `style` и остальные атрибуты `<div>` рамки поля.",
        },
      ],
    },
  ],
  labels: labelRows(SLIDER_LABELS, {
    optional: {
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "ArrowRight · ArrowUp",
        en: "Increases the value by `step`.",
        ru: "Увеличивает значение на `step`.",
      },
      {
        keys: "ArrowLeft · ArrowDown",
        en: "Decreases the value by `step`.",
        ru: "Уменьшает значение на `step`.",
      },
      {
        keys: "PageUp · PageDown",
        en: "Changes the value by a larger step.",
        ru: "Меняет значение крупным шагом.",
      },
      { keys: "Home · End", en: "Jumps to `min` / `max`.", ru: "Переход к `min` / `max`." },
    ],
    aria: [
      {
        en: 'A native `<input type="range">` (`role="slider"`) on top of the visual layer.',
        ru: 'Нативный `<input type="range">` (`role="slider"`) поверх визуального слоя.',
      },
      {
        en: "`label` is a `<label htmlFor>`; otherwise `aria-label` is required.",
        ru: "`label` — настоящий `<label htmlFor>`; без него обязателен `aria-label`.",
      },
      {
        en: '`orientation="vertical"` turns the native range with `writing-mode`, so ↑ / ↓ and the pointer work natively; the input has `aria-orientation="vertical"`.',
        ru: '`orientation="vertical"` поворачивает нативный ползунок через `writing-mode`, поэтому ↑ / ↓ и указатель работают нативно; у поля `aria-orientation="vertical"`.',
      },
      {
        en: "`formatValue` sets `aria-valuetext`, so screen readers announce the unit; the visual `<output>` is `aria-hidden`.",
        ru: "`formatValue` задаёт `aria-valuetext`, скринридер читает единицы; видимый `<output>` скрыт (`aria-hidden`).",
      },
      {
        en: "`aria-describedby` on the input: your ids + the hint or the error; `aria-invalid` when invalid.",
        ru: "`aria-describedby` поля — ваши id и подсказка или ошибка; `aria-invalid` при ошибке.",
      },
      {
        en: "While a commit is saved the input has `aria-busy`; say why a refused value went back with `error`.",
        ru: "Пока значение сохраняется, у поля `aria-busy`; почему значение вернулось, покажите через `error`.",
      },
    ],
  },
};
