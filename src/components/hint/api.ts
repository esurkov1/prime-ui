import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Hint.Root",
      en: "`ref` → `HTMLParagraphElement`. A `<p>` with the support text; provides its tier to nested icons.",
      ru: "`<p>` с текстом поддержки; передаёт ярус иконкам внутри.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of the paired field: 12/16 for xs–m, 13/20 for l and xl.",
          ru: "Ярус поля над подсказкой: 12/16 для xs–m, 13/20 для l и xl.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "Error styling: danger text that drops in (fade + 4 px from above).",
          ru: "Ошибка: текст в цвете опасности, появляется сверху с затуханием.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disabled text color, next to a disabled control.",
          ru: "Цвет неактивного текста — под неактивным контролом.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Text, optionally with `Hint.Icon` first.",
          ru: "Текст, при необходимости с `Hint.Icon` в начале.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLParagraphElement>",
          en: "`children`, `id`, `role`, `className` and the other paragraph attributes.",
          ru: "`children`, `id`, `role`, `className` и остальные атрибуты абзаца.",
        },
      ],
    },
    {
      name: "Hint.Icon",
      en: "`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` holding a glyph: 14 px for xs–m, 16 px for l and xl, centred on the first line.",
      ru: "`<span>` с глифом, `aria-hidden`: 14 px для xs–m, 16 px для l и xl, по центру первой линии.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (the glyph), `className` and the other span attributes.",
          ru: "`children` (глиф), `className` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: "Give the hint an `id` and put it into the control's `aria-describedby` so screen readers read it with the field.",
        ru: "Дайте подсказке `id` и добавьте его в `aria-describedby` контрола — скринридер прочтёт её вместе с полем.",
      },
      {
        en: 'Add `role="alert"` to an error that appears after a user action.',
        ru: 'Ошибке, которая появляется после действия пользователя, добавьте `role="alert"`.',
      },
      {
        en: "`Hint.Icon` is decorative; the text carries the meaning.",
        ru: "`Hint.Icon` декоративна: смысл несёт текст.",
      },
    ],
  },
};
