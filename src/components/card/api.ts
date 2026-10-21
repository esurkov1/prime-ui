import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Card.Root",
      en: "`ref` → `HTMLDivElement` (the `asChild` element). A surface one layer above the one around it, no border, and a size container; `variant` picks the template layout of its parts.",
      ru: "Поверхность на слой выше окружающей, без обводки, и контейнер размера; `variant` выбирает раскладку частей.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "The card's tier: its padding (`--prime-card-padding-s` 16 at `xs` · `s`, `-m` 20, `-l` 24 at `l` · `xl`) and the tier of the controls inside; the type roles stay.",
          ru: "Ярус карточки: её отступы (`--prime-card-padding-s` 16 при `xs` · `s`, `-m` 20, `-l` 24 при `l` · `xl`) и ярус контролов внутри; текстовые роли не меняются.",
        },
        {
          name: "variant",
          type: '"panel" | "mini" | "stat-trend" | "stat-text" | "split" | "cta" | "list" | "cover"',
          default: '"panel"',
          en: "Structural template: titled block with zones (`panel`), KPI tiles (`stat-text` for a value that is a line of text, with an action at the end of the row), a call to action, a list or a cover tile.",
          ru: "Шаблон: блок с зонами (`panel`), плитки KPI (`stat-text` — значение-строка текста, с действием в конце строки), призыв к действию, список или плитка с обложкой.",
        },
        {
          name: "valueSize",
          type: '"m" | "l"',
          defaultNote: {
            en: 'the card width (`stat-trend`) · `"m"` (`stat-text`)',
            ru: 'ширина карточки (`stat-trend`) · `"m"` (`stat-text`)',
          },
          en: "A fixed step of the KPI value, so a row of tiles keeps one size: `stat-trend` — `m` heading-m, `l` heading-l, unset it follows the card width; `stat-text` — `m` body-m medium, `l` title-m, a step above the text.",
          ru: "Фиксированная ступень значения KPI, чтобы ряд плиток держал один размер: `stat-trend` — `m` heading-m, `l` heading-l, без него — по ширине карточки; `stat-text` — `m` body-m medium, `l` title-m, на шаг крупнее текста.",
        },
        {
          name: "flat",
          type: "boolean",
          default: "false",
          en: "No raised shadow: a flat tile for dense grids.",
          ru: "Без тени: плоская плитка для плотных сеток.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The KPI is loading: `Card.Value`, `Card.Delta` and `Card.Meta` show a Skeleton in their own geometry and the root sets `aria-busy`; the data fades in when it arrives. Labels and titles stay.",
          ru: "Метрика загружается: `Card.Value`, `Card.Delta` и `Card.Meta` показывают Skeleton в своей геометрии, корень ставит `aria-busy`; данные проявляются, когда приходят. Подписи и заголовки остаются.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "The whole card is one link or button: pass that element as the only child with the parts inside it; it gets hover, press and the focus ring, a link draws the arrow. No interactive inside: see `Card.Link`.",
          ru: "Вся карточка — одна ссылка или кнопка: передайте этот элемент единственным ребёнком с частями внутри; он получает наведение, нажатие и кольцо фокуса, ссылка рисует стрелку. Интерактива внутри нет: см. `Card.Link`.",
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
      name: "Card.Link",
      en: "`ref` → `HTMLAnchorElement`. The stretched link around the title: a click anywhere on the card opens it, it is the one tab stop, the card's own buttons stay above it. The card draws the arrow: at the end of `Card.Header`, centred on it, or in the top corner.",
      ru: "Растянутая ссылка вокруг заголовка: клик в любом месте карточки открывает её, это единственная остановка Tab, кнопки карточки остаются поверх. Карточка рисует стрелку: в конце `Card.Header` по его центру или в верхнем углу.",
      props: [
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Render the single child element instead of the `<a>`: a router `Link`, or a `<button>` when the record opens in place (a window).",
          ru: "Отрисовать единственный дочерний элемент вместо `<a>`: `Link` роутера или `<button>`, когда запись открывается на месте (в окне).",
        },
        {
          name: "…rest",
          type: "AnchorHTMLAttributes<HTMLAnchorElement>",
          en: "`href`, `className` and the other attributes of the link.",
          ru: "`href`, `className` и остальные атрибуты ссылки.",
        },
      ],
    },
    {
      name: "Card.Header",
      en: "`ref` → `HTMLDivElement`. The top row: an optional `Card.Icon`, `Card.Title` with an optional `Card.Description` under it, anything else (controls, a caption) in one end row, 8 apart. Wraps below 22rem.",
      ru: "Верхний ряд: необязательная `Card.Icon`, `Card.Title` с необязательным `Card.Description` под ним, всё остальное (контролы, подпись) — одним рядом в конце, через 8. Уже 22rem переносится.",
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
      en: "`ref` → `HTMLHeadingElement`. The card heading (`<h3>`, title-s; title-m in `cta`). A `Badge.Root` inside stands beside the text, 8 apart, centred on its line.",
      ru: "Заголовок карточки (`<h3>`, title-s; в `cta` — title-m). `Badge.Root` внутри стоит рядом с текстом, через 8, по центру строки.",
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
      en: "`ref` → `HTMLDivElement`. Secondary text (body-s): under the title of `cta`, `cover` or the head of `stat-trend`; in `Card.Header` under the title, badges inside (a picker too) in a wrapping row; in `Card.Footer` it is the note: a `Badge.Dot` first, the text cut to one line.",
      ru: "Вторичный текст (body-s): под заголовком `cta` и `cover` или шапкой `stat-trend`; в `Card.Header` — под заголовком, бейджи внутри (и выбор) — переносимым рядом; в `Card.Footer` — заметка: сначала `Badge.Dot`, текст в одну строку.",
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
          name: "divider",
          type: '"full"',
          en: "A line above the zone that runs edge to edge, in any template, in the `Divider` ink (`border-subtle`) so it reads in both themes (without it: the faint inset hairline of `panel` / `list` and the full one of `cta`).",
          ru: "Линия над зоной во всю ширину в любом шаблоне, цветом `Divider` (`border-subtle`), чтобы читалась в обеих темах (без неё: едва заметная линия с отступом в `panel` / `list` и во всю ширину в `cta`).",
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
      en: "`ref` → `HTMLDivElement`. The bottom row of buttons: right-aligned under a faint hairline in `panel` and `list`, under a full one in `cta`. A record's row: the actions, the note (`Card.Description`), `Card.Total` at the end.",
      ru: "Нижний ряд кнопок: справа под тонкой линией в `panel` и `list`, под линией во всю ширину в `cta`. Строка записи: действия, заметка (`Card.Description`), `Card.Total` у края.",
      props: [
        {
          name: "divider",
          type: '"full" | "fill"',
          en: "How the zone stands off the one above: `full` — a line edge to edge in the `Divider` ink; `fill` — no line, the zone on the next layer out to the card's edges (a record's footer). Without it: the template's hairline.",
          ru: "Чем зона отделена от верхней: `full` — линия во всю ширину цветом `Divider`; `fill` — без линии, зона на следующем слое лестницы до краёв карточки (подвал записи, счёта). Без него — линия шаблона.",
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
      name: "Card.Total",
      en: "`ref` → `HTMLDivElement`. The total of a record at the end of `Card.Footer`: a `Card.Value` (title-m, tabular) with an optional `Card.Meta` above it, the total's state («к оплате 21 000 ₽», «оплачено») in a `tone`.",
      ru: "Итог записи у края `Card.Footer`: `Card.Value` (title-m, табличные цифры) и необязательная `Card.Meta` над ним — состояние итога («к оплате 21 000 ₽», «оплачено») в тоне `tone`.",
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
      en: "`ref` → `HTMLDivElement`. The 40px accent tile of one icon, first in `Card.Header`. An `Avatar.Root` or `Thumbnail.Root` inside (also in a wrapper) is the record's picture: no tile, 40px, `aria-hidden`; a `ProgressCircle` its state ring: no tile, its own size and name.",
      ru: "Плашка 40px с акцентом для одной иконки, первой в `Card.Header`. `Avatar.Root` или `Thumbnail.Root` внутри (и в обёртке) — изображение записи: без плашки, 40px, `aria-hidden`; `ProgressCircle` — кольцо состояния: без плашки, свой размер и имя.",
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
      name: "Card.Label",
      en: "`ref` → `HTMLSpanElement`. The metric label (body-s; truncates, wraps in a `mini` tile and a `split` cell).",
      ru: "Подпись метрики (body-s; обрезается, в плитке `mini` и ячейке `split` переносится).",
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
      name: "Card.Value",
      en: '`ref` → `HTMLSpanElement`. The metric value: tabular, sized by the template and the card width, or fixed by `valueSize`; body-m medium in `stat-text` (title-m with `valueSize="l"`); title-m in `Card.Total`. A `Badge.Root` inside stands beside the text, 8 apart.',
      ru: 'Значение метрики: табличные цифры, размер по шаблону и ширине карточки или фиксированный через `valueSize`; в `stat-text` — body-m medium (title-m с `valueSize="l"`); в `Card.Total` — title-m. `Badge.Root` внутри стоит рядом с текстом, через 8.',
      props: [
        {
          name: "tone",
          type: '"neutral" | "success" | "warning" | "danger"',
          en: "The ink by meaning (an amount due is `warning`, a payment `success`).",
          ru: "Цвет по смыслу (остаток к оплате — `warning`, оплата — `success`).",
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
      en: "`ref` → `HTMLSpanElement`. The reference line of a KPI («Лидов 120 · сделок 18»): body-s, muted, tabular; under the value; in `Card.Total` the total's state above it.",
      ru: "Справочная строка KPI («Лидов 120 · сделок 18»): body-s, приглушённый, табличные цифры; под значением; в `Card.Total` — состояние итога над ним.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "success" | "warning" | "danger"',
          en: "The ink by meaning (an amount due is `warning`, paid `success`); without it the line is muted.",
          ru: "Цвет по смыслу (к оплате — `warning`, оплачено — `success`); без него строка приглушена.",
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
      name: "Card.List · Card.ListItem",
      en: "`ref` → `HTMLUListElement` / `HTMLLIElement`. A `<ul>` of `<li>` rows, faint hairlines between them. A row with `Card.Title` is a record row laid out like `Card.Header`: its actions at the end.",
      ru: "`<ul>` из строк `<li>`, между ними тонкие линии. Строка с `Card.Title` — строка записи с раскладкой `Card.Header`: её действия в конце.",
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
      name: "Card.ListItemContent",
      en: "`ref` → `HTMLDivElement`. The zone under its `Card.ListItem` (any row) that folds open in place, rendered from anywhere inside the row; a `Card.Footer` holds its buttons at the end.",
      ru: "Зона под своей `Card.ListItem` (любой строкой), раскрывающаяся на месте, откуда бы ни рендерилась внутри строки; `Card.Footer` держит кнопки в конце.",
      props: [
        {
          name: "open",
          type: "boolean",
          required: true,
          en: "Unfolds the zone (height and fade, reduced motion honoured); closed, it folds away.",
          ru: "Раскрывает зону (высота и проявление, с учётом reduced motion); закрытая — сворачивается.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
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
        en: "`Card.Link` is the card's one tab stop: an `<a>` named by the title, or, through `asChild`, a `<button>` (the record opens in a window) with the same name; the arrow is `aria-hidden`.",
        ru: "`Card.Link` — единственная остановка Tab карточки: `<a>` с именем из заголовка или через `asChild` — `<button>` (запись открывается в окне) с тем же именем; стрелка — `aria-hidden`.",
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
      {
        en: "A `loading` card sets `aria-busy` on its root; the Skeletons are decorative (`aria-hidden`).",
        ru: "Карточка с `loading` ставит `aria-busy` на корень; Skeleton декоративны (`aria-hidden`).",
      },
    ],
  },
};
