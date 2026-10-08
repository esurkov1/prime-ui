import type { ComponentApi } from "../../../scripts/docs/componentApi";
import { FIELD_ROOT_REST } from "../../internal/field.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "ColorSwatches",
      en: '`ref` → `HTMLDivElement` (the field frame). The field frame (label → swatches → hint | error) around a `role="radiogroup"` of swatch buttons with a roving tab stop.',
      ru: "Рамка поля (подпись → образцы → подсказка или ошибка) вокруг `radiogroup` из кнопок-образцов.",
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
          en: "Called with the preset `value` (as written in `presets`) or `null`.",
          ru: "`value` пресета (как в `presets`) или `null`.",
        },
        {
          name: "presets",
          type: "readonly ColorPreset[]",
          default: "COLOR_PRESETS",
          en: "Swatches in order: `{ value, label }`; the label is the swatch's accessible name and tooltip.",
          ru: "Образцы по порядку: `{ value, label }`; label — имя и подсказка образца.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Tier: swatch = control height − 8 (20 · 24 · 28 · 32 · 40), gap = the tier gap; label and hint follow it. Without it the tier of its host, else `m`.",
          ru: "Ярус: образец = высота контрола − 8 (20 · 24 · 28 · 32 · 40), зазор яруса.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Label above the swatches; names the radiogroup (`aria-labelledby`).",
          ru: "Подпись над образцами; называет radiogroup.",
        },
        {
          name: "required",
          type: "boolean",
          en: "Red `*` after the label and `aria-required` on the group.",
          ru: "Красная `*` после подписи и `aria-required` на группе.",
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
          en: "Help text under the swatches. Hidden while `error` is shown.",
          ru: "Подсказка под образцами; скрывается, пока показан `error`.",
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
          en: "Danger selection ring and `aria-invalid`. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо выбора, `aria-invalid`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables every swatch (grey, half transparent).",
          ru: "Отключает все образцы.",
        },
        {
          name: "allowEmpty",
          type: "boolean",
          default: "false",
          en: "Adds the «no color» checkerboard swatch after the presets (value `null`).",
          ru: "Добавляет образец «без цвета» после пресетов (значение `null`).",
        },
        {
          name: "name",
          type: "string",
          en: "Form field name: a hidden input submits the selected color (empty string for no color).",
          ru: "Имя поля формы: скрытый input отправляет цвет (пустая строка — без цвета).",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the radiogroup; hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Id группы; иначе генерируется.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Accessible name when there is no visible `label` (else `labels.group`).",
          ru: "Имя без видимой подписи (иначе `labels.group`).",
        },
        {
          name: "aria-labelledby",
          type: "string",
          en: "Names the group by an outside element.",
          ru: "Имя группы из внешнего элемента.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged before the hint/error ids.",
          ru: "Добавляется перед id подсказки и ошибки.",
        },
        {
          name: "labels",
          type: "Partial<ColorSwatchesLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        FIELD_ROOT_REST,
      ],
    },
  ],
  labels: [
    {
      key: "group",
      default: "Цвет",
      en: "Accessible name of the group without a visible `label` and `aria-label`.",
      ru: "Имя группы без видимой подписи и `aria-label`.",
    },
    {
      key: "empty",
      default: "Без цвета",
      en: "Name of the «no color» swatch (`allowEmpty`).",
      ru: "Имя образца «без цвета» (`allowEmpty`).",
    },
    {
      key: "optional",
      default: "необязательно",
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
  ],
};
