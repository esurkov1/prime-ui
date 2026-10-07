import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Typography",
      en: "`ref` → the element. Any text element styled by one text role (`--prime-text-<role>-*`); state goes to `data-*`.",
      ru: "Любой текстовый элемент в одной текстовой роли (`--prime-text-<role>-*`); состояние — в `data-*`.",
      props: [
        {
          name: "variant",
          type: '"caption" | "body-s" | "body-m" | "body-l" | "title-s" | "title-m" | "title-l" | "heading-s" | "heading-m" | "heading-l" | "display-s" | "display-m" | "display-l" | "code"',
          required: true,
          en: "Text role: size, line height, weight and tracking.",
          ru: "Текстовая роль: кегль, межстрочный интервал, начертание и трекинг.",
        },
        {
          name: "tone",
          type: '"default" | "secondary" | "muted" | "accent" | "success" | "warning" | "danger"',
          default: '"default"',
          en: "Text color by meaning; `default` is primary text.",
          ru: "Цвет текста по смыслу; `default` — основной текст.",
        },
        {
          name: "as",
          type: '"p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "small" | "blockquote" | "article" | "section" | "header" | "footer" | "aside" | "nav" | "main"',
          default: '"p"',
          en: "The element, by the page outline; the role keeps the look.",
          ru: "Элемент по структуре страницы; вид задаёт роль.",
        },
        {
          name: "weight",
          type: '"regular" | "medium" | "semibold"',
          en: "Overrides the role's weight.",
          ru: "Переопределяет начертание роли.",
        },
        {
          name: "tracking",
          type: '"normal" | "tight" | "tighter" | "wide"',
          en: "Overrides the role's tracking.",
          ru: "Переопределяет трекинг роли.",
        },
        {
          name: "italic",
          type: "boolean",
          default: "false",
          en: "Italic, for quotes and titles of works.",
          ru: "Курсив — для цитат и названий.",
        },
        {
          name: "truncate",
          type: "boolean",
          default: "false",
          en: "One line with an ellipsis; set `title` when the full text matters.",
          ru: "Одна строка с многоточием; задайте `title`, если полный текст важен.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className`, `id`, `title` and the other attributes of the element.",
          ru: "`children`, `className`, `id`, `title` и остальные атрибуты элемента.",
        },
      ],
    },
  ],
  labels: [],
};
