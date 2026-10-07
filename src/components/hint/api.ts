import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Hint.Root",
      en: "`ref` → `HTMLParagraphElement`. A `<p>` with the support text; provides its tier to nested icons. + native `<p>` props (`id`, `role`, `className`, …).",
      ru: "Строка поддержки под полем; ярус передаётся иконкам внутри.",
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
      ],
    },
    {
      name: "Hint.Icon",
      en: "No ref. An `aria-hidden` `<span>` holding a glyph: 14 px for xs–m, 16 px for l and xl, centred on the first line. + native `<span>` props.",
      ru: "Иконка в начале строки по центру первой линии; скрыта от скринридеров.",
      props: [],
    },
  ],
  labels: [],
};
