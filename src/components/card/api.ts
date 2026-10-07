import type { ApiProp, ComponentApi } from "../../../scripts/docs/componentApi";

const divRest: ApiProp = {
  name: "…rest",
  type: "HTMLAttributes<HTMLElement>",
  en: "`children`, `className` and the other attributes of the element.",
  ru: "`children`, `className` и остальные атрибуты элемента.",
};

const headingAs: ApiProp = {
  name: "as",
  type: '"h2" | "h3" | "h4"',
  default: '"h3"',
  en: "Heading level that fits the page outline; the look does not change.",
  ru: "Уровень заголовка по структуре страницы; вид не меняется.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "Card.Root",
      en: "`ref` → `HTMLDivElement`. The filled surface (card fill, radius 12, raised shadow, no border) and a size container; `variant` picks the template layout of its parts.",
      ru: "Поверхность (заливка карточки, радиус 12, лёгкая тень, без обводки) и контейнер размера; `variant` выбирает раскладку частей.",
      props: [
        {
          name: "variant",
          type: '"panel" | "mini" | "mini-media" | "metric" | "stat-trend" | "split" | "cta" | "list" | "cover"',
          default: '"panel"',
          en: "Structural template: titled block with zones (`panel`), KPI tiles, a call to action, a list or a cover tile.",
          ru: "Шаблон: блок с зонами (`panel`), плитки KPI, призыв к действию, список или плитка с обложкой.",
        },
        {
          name: "flat",
          type: "boolean",
          default: "false",
          en: "No raised shadow: a flat tile for dense grids.",
          ru: "Без тени: плоская плитка для плотных сеток.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `role` + `aria-labelledby` for a landmark block, and the other div attributes.",
          ru: "`className`, `role` + `aria-labelledby` для блока-ориентира и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Card.SectionHeader · Card.SectionTitle · Card.SectionTrailing",
      en: "`panel` header: a row with a faint hairline below, the title (`<h3>`) and a trailing slot for controls.",
      ru: "Шапка `panel`: ряд с тонкой линией снизу, заголовок (`<h3>`) и слот справа для контролов.",
      props: [
        { ...headingAs, en: `SectionTitle: ${headingAs.en}`, ru: `SectionTitle: ${headingAs.ru}` },
        divRest,
      ],
    },
    {
      name: "Card.Body · Card.Actions · Card.Chart",
      en: "`panel` zones: the padded body (gap 16), the right-aligned footer row of buttons with a hairline above, and an edge-to-edge chart slot.",
      ru: "Зоны `panel`: тело с отступами (gap 16), ряд кнопок справа с линией сверху и слот графика от края до края.",
      props: [divRest],
    },
    {
      name: "Card.Title",
      en: "The title of the `cta`, `list` and `cover` templates (`<h3>`, title-m).",
      ru: "Заголовок шаблонов `cta`, `list` и `cover` (`<h3>`, title-m).",
      props: [headingAs, divRest],
    },
    {
      name: "Card.Label · Card.Value · Card.Description · Card.Delta",
      en: "Metric text: the label (body-s), the value (sized by the template and the card width), a description and the change.",
      ru: "Текст метрики: подпись (body-s), значение (размер по шаблону и ширине карточки), описание и изменение.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "success" | "warning" | "danger"',
          default: '"neutral"',
          en: "Delta: color by meaning, not by sign (churn up is `danger`).",
          ru: "Delta: цвет по смыслу, а не по знаку (рост оттока — `danger`).",
        },
        divRest,
      ],
    },
    {
      name: "Card.IconBox · Card.Stack · Card.HeaderRow · Card.Lead · Card.Media",
      en: "Template layout parts: the 40px accent icon tile, the label + value column, the `metric` header row with its leading slot, and the bottom media slot of `mini-media`.",
      ru: "Части раскладки шаблонов: плашка иконки 40px, колонка подписи и значения, ряд шапки `metric` с левым слотом и нижний слот `mini-media`.",
      props: [divRest],
    },
    {
      name: "Card.CtaBody · Card.Cover · Card.Split · Card.SplitCell · Card.ListHeader · Card.List · Card.ListItem",
      en: "Template parts: the `cta` text, the `cover` media, the two `split` cells (stacked below 22rem), and the `list` header and `<ul>` / `<li>` items with faint hairlines.",
      ru: "Части шаблонов: текст `cta`, обложка `cover`, две ячейки `split` (столбиком уже 22rem), шапка `list` и пункты `<ul>` / `<li>` с тонкими линиями.",
      props: [divRest],
    },
  ],
  labels: [],
};
