import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "ColorField",
      en: "`ref` → `HTMLDivElement` (the field frame). A field (label, hint / error, the field button with the color swatch, its hex and a chevron) that opens the ColorPicker panel in a Popover: area, hue, optional opacity, channels with the eyedropper, optional presets.",
      ru: "Поле (подпись, подсказка или ошибка, кнопка поля с образцом цвета, его hex и шевроном), которое открывает панель ColorPicker в Popover: область, оттенок, по желанию непрозрачность, каналы с пипеткой и готовые цвета.",
      props: [
        {
          name: "value",
          type: "string",
          en: "Controlled color: a CSS color string (hex, `rgb()`, `hsl()`).",
          ru: "Управляемый цвет: CSS-строка (hex, `rgb()`, `hsl()`).",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '"#000000"',
          en: "Initial color when uncontrolled.",
          ru: "Начальный цвет без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the new color as hex: `#RRGGBB`, or `#RRGGBBAA` when `alpha` lowers the opacity. A controlled field that does not take the value keeps its color.",
          ru: "Новый цвет в hex: `#RRGGBB`, или `#RRGGBBAA`, когда `alpha` снижает непрозрачность. Управляемое поле, не принявшее значение, оставляет свой цвет.",
        },
        {
          name: "presets",
          type: "readonly ColorPreset[]",
          en: "Ready colors under the channels (`{ value, label }`), picked in one click; none by default.",
          ru: "Готовые цвета под каналами (`{ value, label }`), выбираются одним нажатием; по умолчанию нет.",
        },
        {
          name: "alpha",
          type: "boolean",
          default: "false",
          en: "Adds the opacity slider; the value then carries alpha.",
          ru: "Добавляет ползунок непрозрачности; значение тогда несёт альфу.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Field tier (height 28 · 32 · 36 · 40 · 48); the panel uses the same tier.",
          ru: "Ярус поля (высота 28 · 32 · 36 · 40 · 48); панель в том же ярусе.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Field label above; with the hex it names the field button.",
          ru: "Подпись над полем; вместе с hex даёт имя кнопке поля.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label.",
          ru: "Красная `*` после подписи.",
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
          en: "Help text under the field. Hidden while `error` is shown.",
          ru: "Подсказка под полем; скрывается, пока показан `error`.",
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
          en: "Danger ring and `aria-invalid` without a message. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо и `aria-invalid`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables the field: it shows the color and does not open.",
          ru: "Отключает поле: цвет виден, панель не открывается.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides only the visual focus ring (`data-focus-ring="false"`); focus, keyboard and ARIA are unchanged.',
          ru: "`false` прячет только видимое кольцо фокуса; фокус, клавиатура и ARIA не меняются.",
        },
        {
          name: "name",
          type: "string",
          en: "Form field name: a hidden input submits the hex value.",
          ru: "Имя поля формы: скрытый input отправляет hex.",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the field button; hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Id кнопки поля; иначе генерируется.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Accessible name without a visible `label`; the current hex is appended.",
          ru: "Имя без видимой подписи; к нему добавляется текущий hex.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          en: "Names the field button by an outside element.",
          ru: "Имя кнопки поля из внешнего элемента.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged before the hint/error ids.",
          ru: "Добавляется перед id подсказки и ошибки.",
        },
        {
          name: "labels",
          type: "Partial<ColorFieldLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control).",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля (правило корня поля: `className`, `ref` и остальное → рамка, `id` → контрол).",
        },
      ],
    },
  ],
  labels: [
    {
      key: "optional",
      default: "необязательно",
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
    {
      key: "presets",
      default: "Готовые цвета",
      en: "Accessible name of the preset swatches in the panel.",
      ru: "Имя группы готовых цветов в панели.",
    },
    {
      key: "hue",
      default: "Оттенок, градусы",
      en: "Hue slider and the hue cell of the channels.",
      ru: "Ползунок и ячейка оттенка.",
    },
    {
      key: "alpha",
      default: "Непрозрачность, проценты",
      en: "Opacity slider (`alpha`) and the opacity cell.",
      ru: "Ползунок и ячейка непрозрачности.",
    },
    {
      key: "hex",
      default: "Hex",
      en: "Hex cell of the channels.",
      ru: "Ячейка hex в строке каналов.",
    },
    {
      key: "eyeDropper",
      default: "Пипетка",
      en: "Eyedropper button of the channels.",
      ru: "Кнопка пипетки.",
    },
    {
      key: "format",
      default: "Формат значений цвета",
      en: "Value format select (the ColorPicker labels are shared).",
      ru: "Выбор формата значений (общие строки ColorPicker).",
    },
    {
      key: "saturation",
      default: "Насыщенность, проценты",
      en: "Saturation cell.",
      ru: "Ячейка насыщенности.",
    },
    {
      key: "lightness",
      default: "Яркость, проценты",
      en: "Lightness cell.",
      ru: "Ячейка яркости.",
    },
    {
      key: "red",
      default: "Красный, 0–255",
      en: "Red cell.",
      ru: "Ячейка красного.",
    },
    {
      key: "green",
      default: "Зелёный, 0–255",
      en: "Green cell.",
      ru: "Ячейка зелёного.",
    },
    {
      key: "blue",
      default: "Синий, 0–255",
      en: "Blue cell.",
      ru: "Ячейка синего.",
    },
  ],
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        en: "Open the panel from the field; in a channel cell, apply the value.",
        ru: "Открывают панель с поля; в ячейке каналов применяют значение.",
      },
      {
        keys: "ArrowLeft · ArrowRight · ArrowUp · ArrowDown",
        en: "Move the area or a channel slider; in the ready colors, move between swatches.",
        ru: "Двигают ползунок области или канала; в готовых цветах — между образцами.",
      },
      {
        keys: "PageUp · PageDown",
        en: "Large step of the area and the sliders.",
        ru: "Крупный шаг области и ползунков.",
      },
      {
        keys: "Tab",
        en: "Cycles through the parts of the panel.",
        ru: "Ходит по частям панели по кругу.",
      },
      {
        keys: "Escape",
        en: "Closes the panel and returns focus to the field.",
        ru: "Закрывает панель и возвращает фокус на поле.",
      },
    ],
    aria: [
      {
        en: 'The field is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`; it is named by the label and the current hex (`aria-labelledby`), or by `aria-label` plus the hex.',
        ru: 'Поле — `<button>` с `aria-haspopup="dialog"` и `aria-expanded`; имя — подпись и текущий hex (`aria-labelledby`), без подписи — `aria-label` и hex.',
      },
      {
        en: 'The panel is `role="dialog"` named by the field; the area and the sliders are React Aria `role="slider"`, the sliders named by `labels.hue` and `labels.alpha`.',
        ru: 'Панель — `role="dialog"` с именем поля; область и ползунки — `role="slider"` React Aria, ползунки названы `labels.hue` и `labels.alpha`.',
      },
      {
        en: 'The ready colors are a `role="radiogroup"` named by `labels.presets`.',
        ru: 'Готовые цвета — `role="radiogroup"` с именем `labels.presets`.',
      },
      {
        en: "The hint and the error are linked by `aria-describedby`; the error sets `aria-invalid`.",
        ru: "Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid`.",
      },
    ],
  },
};
