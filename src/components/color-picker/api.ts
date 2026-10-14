import { type ApiProp, type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { COLOR_PICKER_LABELS } from "./ColorPicker";
import { COLOR_PRESETS_LABELS } from "./ColorPresets";

const focusRing: ApiProp = {
  name: "focusRing",
  type: "boolean",
  default: "true",
  en: '`false` hides only the visual focus ring of the fields (`data-focus-ring="false"`); focus, keyboard and ARIA stay.',
  ru: "`false` скрывает только кольцо фокуса полей; фокус, клавиатура и ARIA остаются.",
};

const disabled: ApiProp = {
  name: "disabled",
  type: "boolean",
  en: "Shows the color but takes no input (grayscale).",
  ru: "Показывает цвет, но не принимает ввод (в оттенках серого).",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "ColorPicker.Root",
      en: "No DOM. Holds the color (React Aria `ColorPicker`) and the value format for every part inside.",
      ru: "Без DOM. Держит цвет и формат значений для всех частей внутри.",
      props: [
        {
          name: "value",
          type: "string | Color",
          en: "Controlled color: a CSS color string or a `Color` from `parseColor`.",
          ru: "Управляемый цвет: CSS-строка или `Color` из `parseColor`.",
        },
        {
          name: "defaultValue",
          type: "string | Color",
          en: "Initial color when uncontrolled.",
          ru: "Начальный цвет без контроля.",
        },
        {
          name: "onValueChange",
          type: "(color: Color) => void",
          en: 'Called with the new `Color` (`color.toString("hex")` for a string).',
          ru: 'Новый `Color` (`color.toString("hex")` — строка).',
        },
        {
          name: "defaultFormat",
          type: '"hsl" | "rgb" | "hex"',
          default: '"hsl"',
          en: "Initial value format of `FormatSelect` and `ChannelStrip`.",
          ru: "Начальный формат `FormatSelect` и `ChannelStrip`.",
        },
        {
          name: "labels",
          type: "Partial<ColorPickerLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The parts.",
          ru: "Части пикера.",
        },
      ],
    },
    {
      name: "ColorPicker.Panel",
      en: "`ref` → `HTMLDivElement`. Vertical stack of the parts with the standard gap; native `<div>` props.",
      ru: "Вертикальная стопка частей со стандартным зазором; нативные пропсы `<div>`.",
      props: [
        {
          name: "surface",
          type: '"none" | "raised"',
          default: '"none"',
          en: "`none` — layout only (inside a Popover or Card). `raised` — a standalone floating panel: raised background, panel radius and padding, overlay shadow.",
          ru: "`none` — только раскладка; `raised` — самостоятельная панель с фоном, радиусом и тенью.",
        },
      ],
    },
    {
      name: "ColorPicker.HexInput",
      en: "`ref` → `HTMLDivElement` (the field frame). The hex value as a kit Input field (label, hint, error); commits on blur / Enter and reverts invalid text.",
      ru: "Hex-значение в поле Input (подпись, подсказка, ошибка); применяется по blur / Enter, неверный текст откатывается.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Field label; defaults to `labels.hex`.",
          ru: "Подпись поля; по умолчанию `labels.hex`.",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the field. Hidden while `error` is shown.",
          ru: "Подсказка под полем; скрывается при `error`.",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Error message in the hint slot; marks the field invalid.",
          ru: "Текст ошибки на месте подсказки; поле становится ошибочным.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Field tier. Without it the tier of its host (a panel, a popover), else `m`.",
          ru: "Ярус поля.",
        },
        focusRing,
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control).",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля (правило корня поля: `className`, `ref` и остальное → рамка, `id` → контрол).",
        },
      ],
    },
    {
      name: "ColorPicker.TriggerSwatch",
      en: "`ref` → `HTMLSpanElement`. A square of the current color for a trigger button (`aria-hidden`); follows the host icon size, e.g. inside `Button.Icon`.",
      ru: "Квадрат текущего цвета для кнопки-триггера (`aria-hidden`); следует размеру иконки хоста, например внутри `Button.Icon`.",
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
        },
      ],
    },
    {
      name: "ColorPicker.FormatSelect",
      en: "`ref` → `HTMLDivElement` (the wrapper). A kit Select of the value format (HSL · RGB · Hex), named by `labels.format`.",
      ru: "Select кита для формата значений (HSL · RGB · Hex), имя из `labels.format`.",
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the wrapper `<div>`.",
          ru: "`className` и остальные атрибуты обёртки `<div>`.",
        },
      ],
    },
    {
      name: "ColorPicker.ChannelStrip",
      en: "`ref` → `HTMLDivElement`. One row: the eyedropper, then a field per channel of the current format (or one hex field); each field commits on blur / Enter.",
      ru: "Одна строка: пипетка, затем поле на каждый канал текущего формата (или одно hex-поле); поле применяется по blur / Enter.",
      props: [
        focusRing,
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the row `<div>`.",
          ru: "`className` и остальные атрибуты строки `<div>`.",
        },
      ],
    },
    {
      name: "ColorPicker.Area",
      en: "`ref` → `HTMLDivElement`. React Aria `ColorArea`: a two-channel square (e.g. saturation × lightness). Holds `ColorPicker.AreaThumb`.",
      ru: "`ColorArea` из React Aria: квадрат двух каналов (например, насыщенность × яркость). Держит `ColorPicker.AreaThumb`.",
      props: [
        disabled,
        {
          name: "…rest",
          type: "ColorAreaProps (react-aria-components)",
          en: "The other props of the React Aria `ColorArea` (`channel`, `colorSpace`, `aria-label`…).",
          ru: "Остальные пропсы React Aria `ColorArea` (`channel`, `colorSpace`, `aria-label`…).",
        },
      ],
    },
    {
      name: "ColorPicker.AreaThumb · ColorPicker.Thumb",
      en: "`ref` → `HTMLDivElement`. React Aria `ColorThumb` of the area / of a slider track: a thumb-colored ring with the overlay shadow and a focus ring.",
      ru: "`ColorThumb` из React Aria для области или дорожки ползунка: кольцо цвета бегунка с тенью оверлея и кольцом фокуса.",
      props: [
        {
          name: "…rest",
          type: "ColorThumbProps (react-aria-components)",
          en: "The other props of the React Aria `ColorThumb` (`channel`, `colorSpace`, `aria-label`…).",
          ru: "Остальные пропсы React Aria `ColorThumb` (`channel`, `colorSpace`, `aria-label`…).",
        },
      ],
    },
    {
      name: "ColorPicker.Slider",
      en: "`ref` → `HTMLDivElement`. React Aria `ColorSlider` of one channel (hue, alpha…). Holds `SliderMeta` and `SliderTrack`.",
      ru: "`ColorSlider` из React Aria для одного канала (оттенок, прозрачность…). Держит `SliderMeta` и `SliderTrack`.",
      props: [
        disabled,
        {
          name: "…rest",
          type: "ColorSliderProps (react-aria-components)",
          en: "The other props of the React Aria `ColorSlider` (`channel`, `colorSpace`, `aria-label`…).",
          ru: "Остальные пропсы React Aria `ColorSlider` (`channel`, `colorSpace`, `aria-label`…).",
        },
      ],
    },
    {
      name: "ColorPicker.SliderMeta",
      en: "`ref` → `HTMLDivElement`. The slider heading: a label and the current channel value.",
      ru: "Заголовок ползунка: подпись и текущее значение канала.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          required: true,
          en: "Visible label of the slider.",
          ru: "Видимая подпись ползунка.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the heading `<div>`.",
          ru: "`className` и остальные атрибуты заголовка `<div>`.",
        },
      ],
    },
    {
      name: "ColorPicker.SliderTrack",
      en: "`ref` → `HTMLDivElement`. React Aria `SliderTrack` with the channel gradient over a transparency checkerboard. Holds `ColorPicker.Thumb`.",
      ru: "`SliderTrack` из React Aria с градиентом канала поверх шахматки прозрачности. Держит `ColorPicker.Thumb`.",
      props: [
        {
          name: "…rest",
          type: "SliderTrackProps (react-aria-components)",
          en: "The other props of the React Aria `SliderTrack` (`channel`, `colorSpace`, `aria-label`…).",
          ru: "Остальные пропсы React Aria `SliderTrack` (`channel`, `colorSpace`, `aria-label`…).",
        },
      ],
    },
    {
      name: "ColorPicker.Swatches",
      en: "`ref` → `HTMLDivElement` (the ColorSwatches field frame). The kit `ColorSwatches` bound to the picker color: a pick sets the color, editing the color moves the selection. Takes every ColorSwatches prop except the value ones, `allowEmpty` and `name`.",
      ru: "`ColorSwatches`, связанный с цветом пикера: выбор меняет цвет, правка цвета двигает выбор.",
      props: [
        {
          name: "presets",
          type: "readonly ColorPreset[]",
          default: "COLOR_PRESETS",
          en: "Swatches `{ value, label }`; the label names the swatch.",
          ru: "Образцы `{ value, label }`; label — имя образца.",
        },
        {
          name: "…rest",
          type: 'Omit<ColorSwatchesProps, "value" | "defaultValue" | "onValueChange" | "allowEmpty" | "name">',
          en: "`label`, `size`, `aria-label`, `disabled`…",
          ru: "`label`, `size`, `aria-label`, `disabled`…",
        },
      ],
    },
    {
      name: "ColorPicker.EyeDropperButton",
      en: "`ref` → `HTMLButtonElement`. A square soft kit Button that opens the native EyeDropper, named by `labels.eyeDropper`; without browser support it is disabled and hidden from assistive tech.",
      ru: "Квадратная soft-кнопка кита, открывает нативную пипетку EyeDropper, имя из `labels.eyeDropper`; без поддержки браузера неактивна и скрыта от вспомогательных технологий.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "Custom content; default is the pipette icon.",
          ru: "Своё содержимое; по умолчанию иконка пипетки.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonRootProps, "variant" | "tone" | "size" | "aria-label">',
          en: "The other Button props.",
          ru: "Остальные пропсы Button.",
        },
      ],
    },
    {
      name: "ColorPresets.Root",
      en: "No DOM and no ref, except a field frame in a FieldList cell (the column heading as its label). A quick color from a fixed palette: a square trigger and a popover grid of presets.",
      ru: "Быстрый цвет из палитры: квадратный триггер и поповер с сеткой пресетов. Без DOM, кроме рамки поля в ячейке FieldList.",
      props: [
        {
          name: "value",
          type: "string | null",
          en: "Controlled color; `null` — no color.",
          ru: "Управляемый цвет; `null` — без цвета.",
        },
        {
          name: "defaultValue",
          type: "string | null",
          default: "null",
          en: "Initial color when uncontrolled.",
          ru: "Начальный цвет без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: string | null) => void",
          en: "Called with the preset `value` or `null`.",
          ru: "`value` пресета или `null`.",
        },
        {
          name: "open",
          type: "boolean",
          en: "Controlled open state of the panel.",
          ru: "Управляемое открытие панели.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial open state.",
          ru: "Начальное открытие.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Called when the panel opens or closes.",
          ru: "Открытие и закрытие панели.",
        },
        {
          name: "presets",
          type: "readonly ColorPreset[]",
          default: "COLOR_PRESETS",
          en: "Swatches in panel order.",
          ru: "Образцы по порядку.",
        },
        {
          name: "columns",
          type: "number",
          en: "Grid columns; default one row for up to 8 presets (+ «no color»), else 8.",
          ru: "Колонки сетки; по умолчанию одна строка до 8 пресетов, иначе 8.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Tier of the trigger, the swatches and the panel. Without it the tier of its host, else `m`.",
          ru: "Ярус триггера, образцов и панели.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "The trigger is disabled and does not open the panel. A disabled `Fieldset` around it sets it too.",
          ru: "Триггер неактивен и не открывает панель. Неактивный `Fieldset` вокруг включает его тоже.",
        },
        {
          name: "allowEmpty",
          type: "boolean",
          default: "false",
          en: "Adds the «no color» swatch after the presets (value `null`).",
          ru: "Добавляет образец «без цвета» (значение `null`).",
        },
        {
          name: "closeOnSelect",
          type: "boolean",
          default: "true",
          en: "Close the panel after a pick (focus returns to the trigger).",
          ru: "Закрывать панель после выбора (фокус на триггер).",
        },
        {
          name: "labels",
          type: "Partial<ColorPresetsLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
      ],
    },
    {
      name: "ColorPresets.Trigger",
      en: "No DOM: clones the single child into the panel's trigger, merges `ref` and `onClick` (toggles), names it «`labels.trigger`: <color name>», sets `disabled` from the root and opens the panel on ArrowDown / ArrowUp. The child's own `aria-label`, `disabled` and handlers win.",
      ru: "Без DOM: клонирует дочерний элемент в триггер панели, называет его «`labels.trigger`: <цвет>», берёт `disabled` от корня, ArrowDown / ArrowUp открывают панель. Собственные `aria-label`, `disabled` и обработчики элемента главнее.",
      props: [
        {
          name: "children",
          type: "ReactElement",
          required: true,
          en: "One element: `ColorPresets.SwatchButton`, or e.g. `Button.Root` with `ColorPresets.Swatch`.",
          ru: "Один элемент: `ColorPresets.SwatchButton` или, например, `Button.Root` с `ColorPresets.Swatch`.",
        },
      ],
    },
    {
      name: "ColorPresets.SwatchButton",
      en: "`ref` → `HTMLButtonElement`. The kit square swatch button of the root tier: a square of the control height filled with the current color. Put it in `ColorPresets.Trigger`.",
      ru: "Квадратная кнопка-образец кита в ярусе корня: квадрат высотой с контрол, залитый текущим цветом. Кладите в `ColorPresets.Trigger`.",
      props: [
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "value">',
          en: "`aria-label`, `className` and the other button attributes.",
          ru: "`aria-label`, `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "ColorPresets.Swatch",
      en: "`ref` → `HTMLSpanElement`. The current color as a small square for a custom trigger; follows the host icon size, `aria-hidden`.",
      ru: "Текущий цвет маленьким квадратом для своего триггера; следует размеру иконки хоста, `aria-hidden`.",
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
        },
      ],
    },
    {
      name: "ColorPresets.Content",
      en: '`ref` → `HTMLDivElement` (the panel). The floating panel with the swatch grid (`role="listbox"`); focus moves to the selected swatch.',
      ru: 'Плавающая панель с сеткой образцов (`role="listbox"`); фокус переходит на выбранный образец.',
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Heading above the grid; also the list's accessible name (else `labels.list`).",
          ru: "Заголовок над сеткой и имя списка (иначе `labels.list`).",
        },
        {
          name: "side",
          type: '"top" | "right" | "bottom" | "left"',
          default: '"bottom"',
          en: "Side of the trigger.",
          ru: "Сторона от триггера.",
        },
        {
          name: "align",
          type: '"auto" | "start" | "center" | "end"',
          default: '"auto"',
          en: "Alignment along the trigger. `auto` lines the panel up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix it.",
          ru: "Выравнивание вдоль триггера. `auto` выравнивает панель по краю триггера, за которым больше места; `start`, `center` или `end` задают край явно.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children" | "role">',
          en: "`className` and the other attributes of the panel.",
          ru: "`className` и остальные атрибуты панели.",
        },
      ],
    },
  ],
  labels: [
    ...labelRows(COLOR_PICKER_LABELS, {
      format: { en: "Name of `ColorPicker.FormatSelect`.", ru: "Имя `ColorPicker.FormatSelect`." },
      eyeDropper: {
        en: "Name of `ColorPicker.EyeDropperButton`.",
        ru: "Имя `ColorPicker.EyeDropperButton`.",
      },
      hex: {
        en: "Hex field of `ChannelStrip` and the default `HexInput` label.",
        ru: "Hex-поле `ChannelStrip` и подпись `HexInput` по умолчанию.",
      },
      hue: { en: "Hue channel field.", ru: "Поле оттенка." },
      saturation: { en: "Saturation channel field.", ru: "Поле насыщенности." },
      lightness: { en: "Lightness channel field.", ru: "Поле яркости." },
      alpha: { en: "Alpha channel field.", ru: "Поле непрозрачности." },
      red: { en: "Red channel field.", ru: "Поле красного канала." },
      green: { en: "Green channel field.", ru: "Поле зелёного канала." },
      blue: { en: "Blue channel field.", ru: "Поле синего канала." },
    }),
    ...labelRows(COLOR_PRESETS_LABELS, {
      trigger: {
        en: "ColorPresets trigger name prefix: «<trigger>: <color name>»; in a FieldList cell the column heading.",
        ru: "Префикс имени триггера ColorPresets: «<trigger>: <цвет>»; в ячейке FieldList — заголовок столбца.",
        part: "ColorPresets.Root",
      },
      list: {
        en: "ColorPresets swatch list name when `Content` has no `label`.",
        ru: "Имя списка ColorPresets без `label` у `Content`.",
        part: "ColorPresets.Root",
      },
      empty: {
        en: "ColorPresets «no color» swatch and the trigger name for an empty value.",
        ru: "Образец «без цвета» ColorPresets и имя триггера без значения.",
        part: "ColorPresets.Root",
      },
    }),
  ],
  accessibility: {
    keyboard: [
      {
        keys: "ArrowLeft · ArrowRight · ArrowUp · ArrowDown",
        en: "Move the area thumb or a slider; in the ColorPresets grid, move between swatches.",
        ru: "Двигают ползунок области или канала; в сетке ColorPresets — между образцами.",
      },
      {
        keys: "PageUp · PageDown",
        en: "Larger steps on the area and the sliders.",
        ru: "Крупный шаг области и ползунков.",
      },
      {
        keys: "Home · End",
        en: "Slider ends; the first / last swatch in the ColorPresets grid.",
        ru: "Края ползунка; первый / последний образец в сетке ColorPresets.",
      },
      {
        keys: "Enter · Space",
        en: "Commit a field; pick the focused preset swatch and close.",
        ru: "Применяет поле; выбирает образец пресета и закрывает панель.",
      },
      {
        keys: "Tab",
        en: "Moves through the parts; inside the ColorPresets grid returns to the trigger and closes.",
        ru: "Ходит по частям; из сетки ColorPresets возвращает на триггер и закрывает.",
      },
      {
        keys: "Escape",
        en: "Closes the ColorPresets panel.",
        ru: "Закрывает панель ColorPresets.",
      },
    ],
    aria: [
      {
        en: 'Area and sliders are React Aria primitives with their own `role="slider"` names.',
        ru: 'Область и ползунки — примитивы React Aria со своими именами `role="slider"`.',
      },
      {
        en: "`TriggerSwatch` and `ColorPresets.Swatch` are `aria-hidden` — give the trigger button an `aria-label` (ColorPresets.Trigger names its element «`labels.trigger`: <color name>» unless the element has its own `aria-label`).",
        ru: "`TriggerSwatch` и `ColorPresets.Swatch` скрыты (`aria-hidden`) — дайте кнопке-триггеру `aria-label`; `ColorPresets.Trigger` называет свой элемент «`labels.trigger`: <цвет>», если у него нет своего `aria-label`.",
      },
      {
        en: '`ColorPicker.Swatches` is a `role="radiogroup"` (ColorSwatches): name it with `label` or `aria-label`.',
        ru: '`ColorPicker.Swatches` — `role="radiogroup"` (ColorSwatches): назовите через `label` или `aria-label`.',
      },
      {
        en: 'The ColorPresets grid is `role="listbox"` with `role="option"` swatches (roving tabindex), named by the Content `label` or `labels.list`.',
        ru: 'Сетка ColorPresets — `role="listbox"` с образцами `role="option"`, имя из `label` у Content или `labels.list`.',
      },
      {
        en: "Channel fields are named by `labels` (`hue`, `red`…); HexInput by its label (`labels.hex` by default).",
        ru: "Поля каналов названы `labels` (`hue`, `red`…); HexInput — своей подписью (по умолчанию `labels.hex`).",
      },
    ],
  },
};
