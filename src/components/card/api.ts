import type { ApiProp, ComponentApi } from "../../../scripts/docs/componentApi";

const rest: ApiProp = {
  name: "…rest",
  type: "HTMLAttributes<HTMLElement>",
  en: "`children`, `className` and the other attributes of the element.",
  ru: "`children`, `className` и остальные атрибуты элемента.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "Card.Root",
      en: "`ref` → `HTMLDivElement`. A layer of the surface ladder (`data-depth` one above the surface around it: white on the light page, the next layer when nested; radius 12, the raised whisper only on the page, no border) and a size container; `variant` picks the template layout of its parts.",
      ru: "Слой лестницы поверхностей (`data-depth` на один выше окружающей поверхности: белая на светлой странице, следующий слой во вложении; радиус 12, лёгкая тень только на странице, без обводки) и контейнер размера; `variant` выбирает раскладку частей.",
      props: [
        {
          name: "variant",
          type: '"panel" | "mini" | "stat-trend" | "split" | "cta" | "list" | "cover"',
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
      name: "Card.Header",
      en: "`ref` → `HTMLDivElement`. The top row: `Card.Title` first, anything after it (a control, a quiet caption) at the end. In `panel` and `list` it is a padded zone with a faint hairline below; in `stat-trend` it can pair a leading badge or icon with a compact `Card.Value`. Wraps below 22rem.",
      ru: "Верхний ряд: сначала `Card.Title`, всё после него (контрол, тихая подпись) — в конце. В `panel` и `list` — зона с отступами и тонкой линией снизу; в `stat-trend` может держать бейдж или иконку слева и компактное `Card.Value` справа. Уже 22rem переносится.",
      props: [rest],
    },
    {
      name: "Card.Title",
      en: "`ref` → `HTMLHeadingElement`. The card heading (`<h3>`, title-s; title-m in `cta`).",
      ru: "Заголовок карточки (`<h3>`, title-s; в `cta` — title-m).",
      props: [
        {
          name: "as",
          type: '"h2" | "h3" | "h4"',
          default: '"h3"',
          en: "Heading level that fits the page outline; the look does not change.",
          ru: "Уровень заголовка по структуре страницы; вид не меняется.",
        },
        rest,
      ],
    },
    {
      name: "Card.Description",
      en: "`ref` → `HTMLParagraphElement`. Secondary text (`<p>`, body-s, wraps): under the title of `cta` and `cover`, under the header of `stat-trend`.",
      ru: "Вторичный текст (`<p>`, body-s, переносится): под заголовком `cta` и `cover`, под шапкой `stat-trend`.",
      props: [rest],
    },
    {
      name: "Card.Body",
      en: "`ref` → `HTMLDivElement`. The padded content zone (gap 16). In `split` it is the two-cell grid: each child is a cell (stacked below 22rem); in `cover` it holds the title and the description 4 apart.",
      ru: "Зона содержимого с отступами (gap 16). В `split` — сетка из двух ячеек: каждый дочерний элемент — ячейка (столбиком уже 22rem); в `cover` — заголовок и описание через 4.",
      props: [rest],
    },
    {
      name: "Card.Media",
      en: "`ref` → `HTMLDivElement`. A chart, an image or a gauge: edge to edge under the header or the body in `panel`, the 128–192px cover on top in `cover`, the full-width bottom slot in `mini`. A chart SVG needs a CSS height.",
      ru: "График, картинка или шкала: от края до края под шапкой или телом в `panel`, обложка 128–192px сверху в `cover`, нижний слот на всю ширину в `mini`. SVG графика нужна высота в CSS.",
      props: [rest],
    },
    {
      name: "Card.Footer",
      en: "`ref` → `HTMLDivElement`. The bottom row of buttons, wrapping: right-aligned under a faint hairline in `panel` and `list`, under a full-width hairline in `cta`.",
      ru: "Нижний ряд кнопок с переносом: справа под тонкой линией в `panel` и `list`, под линией во всю ширину в `cta`.",
      props: [rest],
    },
    {
      name: "Card.Icon",
      en: "`ref` → `HTMLDivElement`. The 40px accent tile of a KPI holding one icon; it spans the label and the value rows in `mini` and a `split` cell.",
      ru: "Плашка 40px с акцентом для одной иконки KPI; в `mini` и ячейке `split` занимает высоту подписи и значения.",
      props: [rest],
    },
    {
      name: "Card.Label · Card.Value · Card.Delta",
      en: "`ref` → `HTMLSpanElement`. Metric text: the label (body-s, truncates), the value (tabular, sized by the template and the card width) and the change.",
      ru: "Текст метрики: подпись (body-s, обрезается), значение (табличные цифры, размер по шаблону и ширине карточки) и изменение.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "success" | "warning" | "danger"',
          default: '"neutral"',
          en: "Delta: color by meaning, not by sign (churn up is `danger`).",
          ru: "Delta: цвет по смыслу, а не по знаку (рост оттока — `danger`).",
        },
        rest,
      ],
    },
    {
      name: "Card.List · Card.ListItem",
      en: "`ref` → `HTMLUListElement` / `HTMLLIElement`. The `list` template: a `<ul>` of `<li>` rows with faint hairlines between them; head it with `Card.Header`.",
      ru: "Шаблон `list`: `<ul>` из строк `<li>` с тонкими линиями между ними; шапка — `Card.Header`.",
      props: [rest],
    },
  ],
  labels: [],
};
