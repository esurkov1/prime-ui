import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Card.Root",
      en: "`ref` → `HTMLDivElement` (the `asChild` element). A surface one layer above the one around it, no border, and a size container; `variant` picks the template layout of its parts.",
      ru: "Поверхность на слой выше окружающей, без обводки, и контейнер размера; `variant` выбирает раскладку частей.",
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
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "The whole card is one link or button: pass that element as the only child with the parts inside it; it gets hover, press and the focus ring. Nothing interactive may sit inside it.",
          ru: "Вся карточка — одна ссылка или кнопка: передайте этот элемент единственным ребёнком с частями внутри; он получает наведение, нажатие и кольцо фокуса. Внутри не должно быть других интерактивных элементов.",
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
      en: "`ref` → `HTMLDivElement`. The top row: `Card.Title` first, anything after it (a control, a quiet caption) at the end. Wraps below 22rem.",
      ru: "Верхний ряд: сначала `Card.Title`, всё после него (контрол, тихая подпись) — в конце. Уже 22rem переносится.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
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
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
    {
      name: "Card.Description",
      en: "`ref` → `HTMLParagraphElement`. Secondary text (`<p>`, body-s): under the title of `cta` and `cover`, under the header of `stat-trend`; inside `Card.Header` it stacks under the title.",
      ru: "Вторичный текст (`<p>`, body-s): под заголовком `cta` и `cover`, под шапкой `stat-trend`; внутри `Card.Header` встаёт под заголовком.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
    {
      name: "Card.Body",
      en: "`ref` → `HTMLDivElement`. The padded content zone (gap 16). In `split` it is the two-cell grid: each child is a cell (stacked below 22rem); in `cover` it holds the title and the description 4 apart.",
      ru: "Зона содержимого с отступами (gap 16). В `split` — сетка из двух ячеек: каждый дочерний элемент — ячейка (столбиком уже 22rem); в `cover` — заголовок и описание через 4.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
    {
      name: "Card.Media",
      en: "`ref` → `HTMLDivElement`. A chart, an image or a gauge: edge to edge under the header or the body in `panel`, the 128–192px cover on top in `cover`, the full-width bottom slot in `mini`. A chart SVG needs a CSS height.",
      ru: "График, картинка или шкала: от края до края под шапкой или телом в `panel`, обложка 128–192px сверху в `cover`, нижний слот на всю ширину в `mini`. SVG графика нужна высота в CSS.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
    {
      name: "Card.Footer",
      en: "`ref` → `HTMLDivElement`. The bottom row of buttons, wrapping: right-aligned under a faint hairline in `panel` and `list`, under a full-width hairline in `cta`.",
      ru: "Нижний ряд кнопок с переносом: справа под тонкой линией в `panel` и `list`, под линией во всю ширину в `cta`.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
    {
      name: "Card.Icon",
      en: "`ref` → `HTMLDivElement`. The 40px accent tile of a KPI holding one icon; it spans the label and the value rows in `mini` and a `split` cell.",
      ru: "Плашка 40px с акцентом для одной иконки KPI; в `mini` и ячейке `split` занимает высоту подписи и значения.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
    {
      name: "Card.Label · Card.Value",
      en: "`ref` → `HTMLSpanElement`. Metric text: the label (body-s; truncates, wraps in a `mini` tile and a `split` cell) and the value (tabular, sized by the template and the card width).",
      ru: "Текст метрики: подпись (body-s; обрезается, в плитке `mini` и ячейке `split` переносится) и значение (табличные цифры, размер по шаблону и ширине карточки).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
    {
      name: "Card.Delta",
      en: "`ref` → `HTMLSpanElement`. The change of a metric beside its value.",
      ru: "Изменение метрики рядом со значением.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "success" | "warning" | "danger"',
          default: '"neutral"',
          en: "Delta: color by meaning, not by sign (churn up is `danger`).",
          ru: "Delta: цвет по смыслу, а не по знаку (рост оттока — `danger`).",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
    {
      name: "Card.Meta",
      en: "`ref` → `HTMLSpanElement`. The reference line of a KPI («Лидов 120 · сделок 18»): caption, muted, tabular; under the value.",
      ru: "Справочная строка KPI («Лидов 120 · сделок 18»): caption, приглушённый, табличные цифры; под значением.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
    {
      name: "Card.List · Card.ListItem",
      en: "`ref` → `HTMLUListElement` / `HTMLLIElement`. The `list` template: a `<ul>` of `<li>` rows with faint hairlines between them; head it with `Card.Header`.",
      ru: "Шаблон `list`: `<ul>` из строк `<li>` с тонкими линиями между ними; шапка — `Card.Header`.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` and the other attributes of the element.",
          ru: "`children`, `className` и остальные атрибуты элемента.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "A card with `asChild` is one stop: focus lands on the whole link or button.",
        ru: "Карточка с `asChild` — одна остановка: фокус на ссылке или кнопке целиком.",
      },
      {
        keys: "Enter · Space",
        en: "Opens the link (`Enter`) or presses the button (`Enter`, `Space`) of a card with `asChild`.",
        ru: "Открывает ссылку (`Enter`) или нажимает кнопку (`Enter`, `Space`) карточки с `asChild`.",
        native: true,
      },
    ],
    aria: [
      {
        en: "With `asChild` the card is the link or button itself; its name is the text of its parts. Nothing interactive may sit inside it — put row actions next to the card instead.",
        ru: "С `asChild` карточка — сама ссылка или кнопка: её имя складывается из текста частей; внутри не должно быть других интерактивных элементов.",
      },
      {
        en: '`Card.Root` is a plain `<div>`; give it `role="region"` + `aria-labelledby` only when it is a landmark-worthy block.',
        ru: '`Card.Root` — обычный `<div>`; `role="region"` и `aria-labelledby` задавайте, только если блок заслуживает ориентира.',
      },
      {
        en: '`Card.Title` renders `<h3>`; directly under the page title pass `as="h2"`.',
        ru: '`Card.Title` — `<h3>`; прямо под заголовком страницы передайте `as="h2"`, чтобы не пропустить уровень.',
      },
      {
        en: "Decorative icons in `Card.Icon` and cover images in `Card.Media` get `aria-hidden`; controls in `Card.Header` need their own names.",
        ru: "Декоративные иконки в `Card.Icon` и обложки в `Card.Media` — `aria-hidden`; контролам в `Card.Header` нужны свои имена.",
      },
    ],
  },
};
