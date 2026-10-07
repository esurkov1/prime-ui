import type { ApiProp, ComponentApi } from "../../../scripts/docs/componentApi";
import { FIELD_ROOT_REST } from "../../internal/field.api";

const DIV_REST = 'Omit<HTMLAttributes<HTMLDivElement>, "children">';
const SPAN_REST = 'Omit<HTMLAttributes<HTMLSpanElement>, "children">';

const rest = (element: string, type: string): ApiProp => ({
  name: "…rest",
  type,
  en: `\`className\` and the other attributes of the ${element}.`,
  ru: "`className` и остальные атрибуты элемента.",
});

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

const reactAria = (component: string): ApiProp => ({
  name: "…rest",
  type: `${component}Props (react-aria-components)`,
  en: `The other props of the React Aria \`${component}\` (\`channel\`, \`colorSpace\`, \`aria-label\`…).`,
  ru: `Остальные пропсы \`${component}\` из React Aria.`,
});

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
      en: "`forwardRef` → `HTMLDivElement`. Vertical stack of the parts with the standard gap; native `<div>` props.",
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
          default: '"m"',
          en: "Field tier.",
          ru: "Ярус поля.",
        },
        focusRing,
        FIELD_ROOT_REST,
      ],
    },
    {
      name: "ColorPicker.TriggerSwatch",
      en: "`ref` → `HTMLSpanElement`. A square of the current color for a trigger button (`aria-hidden`); follows the host icon size, e.g. inside `Button.Icon`.",
      props: [rest("`<span>`", SPAN_REST)],
    },
    {
      name: "ColorPicker.FormatSelect",
      en: "`ref` → `HTMLDivElement` (the wrapper). A kit Select of the value format (HSL · RGB · Hex), named by `labels.format`.",
      props: [rest("wrapper `<div>`", DIV_REST)],
    },
    {
      name: "ColorPicker.ChannelStrip",
      en: "`ref` → `HTMLDivElement`. One row: the eyedropper, then a field per channel of the current format (or one hex field); each field commits on blur / Enter.",
      props: [focusRing, rest("row `<div>`", DIV_REST)],
    },
    {
      name: "ColorPicker.Area",
      en: "`ref` → `HTMLDivElement`. React Aria `ColorArea`: a two-channel square (e.g. saturation × lightness). Holds `ColorPicker.AreaThumb`.",
      props: [disabled, reactAria("ColorArea")],
    },
    {
      name: "ColorPicker.AreaThumb · ColorPicker.Thumb",
      en: "`ref` → `HTMLDivElement`. React Aria `ColorThumb` of the area / of a slider track: a thumb-colored ring with the overlay shadow and a focus ring.",
      props: [reactAria("ColorThumb")],
    },
    {
      name: "ColorPicker.Slider",
      en: "`ref` → `HTMLDivElement`. React Aria `ColorSlider` of one channel (hue, alpha…). Holds `SliderMeta` and `SliderTrack`.",
      props: [disabled, reactAria("ColorSlider")],
    },
    {
      name: "ColorPicker.SliderMeta",
      en: "`ref` → `HTMLDivElement`. The slider heading: a label and the current channel value.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          required: true,
          en: "Visible label of the slider.",
          ru: "Видимая подпись ползунка.",
        },
        rest("heading `<div>`", DIV_REST),
      ],
    },
    {
      name: "ColorPicker.SliderTrack",
      en: "`ref` → `HTMLDivElement`. React Aria `SliderTrack` with the channel gradient over a transparency checkerboard. Holds `ColorPicker.Thumb`.",
      props: [reactAria("SliderTrack")],
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
      en: "`forwardRef` → `HTMLButtonElement`. A square soft kit Button that opens the native EyeDropper, named by `labels.eyeDropper`; without browser support it is disabled and hidden from assistive tech.",
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
      en: "No DOM. A quick color from a fixed palette: a square trigger and a popover grid of presets (Popover overlay contract).",
      ru: "Быстрый цвет из палитры: квадратный триггер и поповер с сеткой пресетов.",
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
          default: '"m"',
          en: "Tier of the trigger, the swatches and the panel.",
          ru: "Ярус триггера, образцов и панели.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "The trigger does not open the panel.",
          ru: "Триггер не открывает панель.",
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
      en: "`forwardRef` → `HTMLButtonElement`. The kit square swatch button of the root tier, named «`labels.trigger`: <color name>»; ArrowDown / ArrowUp open the panel.",
      props: [
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Use the one child element (e.g. `Button.Root` with `ColorPresets.Swatch`) as the trigger.",
          ru: "Сделать триггером единственный дочерний элемент (например, `Button.Root`).",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled" | "value">',
          en: "`aria-label`, `className` and the other button attributes.",
          ru: "`aria-label`, `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "ColorPresets.Swatch",
      en: "`ref` → `HTMLSpanElement`. The current color as a small square for a custom trigger; follows the host icon size, `aria-hidden`.",
      props: [rest("`<span>`", SPAN_REST)],
    },
    {
      name: "ColorPresets.Content",
      en: '`ref` → `HTMLDivElement` (the panel). The floating panel with the swatch grid (`role="listbox"`); focus moves to the selected swatch.',
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
          type: '"start" | "center" | "end"',
          default: '"start"',
          en: "Alignment along the trigger.",
          ru: "Выравнивание вдоль триггера.",
        },
        rest("panel", 'Omit<HTMLAttributes<HTMLDivElement>, "children" | "role">'),
      ],
    },
  ],
  labels: [
    {
      key: "format",
      default: "Формат значений цвета",
      en: "Name of `ColorPicker.FormatSelect`.",
      ru: "Имя `ColorPicker.FormatSelect`.",
    },
    {
      key: "eyeDropper",
      default: "Пипетка",
      en: "Name of `ColorPicker.EyeDropperButton`.",
      ru: "Имя `ColorPicker.EyeDropperButton`.",
    },
    {
      key: "hex",
      default: "Hex",
      en: "Hex field of `ChannelStrip` and the default `HexInput` label.",
      ru: "Hex-поле `ChannelStrip` и подпись `HexInput` по умолчанию.",
    },
    {
      key: "hue",
      default: "Оттенок, градусы",
      en: "Hue channel field.",
      ru: "Поле оттенка.",
    },
    {
      key: "saturation",
      default: "Насыщенность, проценты",
      en: "Saturation channel field.",
      ru: "Поле насыщенности.",
    },
    {
      key: "lightness",
      default: "Яркость, проценты",
      en: "Lightness channel field.",
      ru: "Поле яркости.",
    },
    {
      key: "alpha",
      default: "Непрозрачность, проценты",
      en: "Alpha channel field.",
      ru: "Поле непрозрачности.",
    },
    {
      key: "red",
      default: "Красный, 0–255",
      en: "Red channel field.",
      ru: "Поле красного канала.",
    },
    {
      key: "green",
      default: "Зелёный, 0–255",
      en: "Green channel field.",
      ru: "Поле зелёного канала.",
    },
    {
      key: "blue",
      default: "Синий, 0–255",
      en: "Blue channel field.",
      ru: "Поле синего канала.",
    },
    {
      key: "trigger",
      default: "Цвет",
      en: "ColorPresets trigger name prefix: «<trigger>: <color name>».",
      ru: "Префикс имени триггера ColorPresets: «<trigger>: <цвет>».",
    },
    {
      key: "list",
      default: "Цвета",
      en: "ColorPresets swatch list name when `Content` has no `label`.",
      ru: "Имя списка ColorPresets без `label` у `Content`.",
    },
    {
      key: "empty",
      default: "Без цвета",
      en: "ColorPresets «no color» swatch and the trigger name for an empty value.",
      ru: "Образец «без цвета» ColorPresets и имя триггера без значения.",
    },
  ],
};
