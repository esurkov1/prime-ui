import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Card.Root",
      en: "`ref` → `HTMLDivElement` (the `asChild` element). A surface one layer up, no border, a size container. Laid out by its zones: zones under faint lines; a cover when `Card.Media` leads; no zone — the content edge to edge.",
      ru: "Поверхность на слой выше, без обводки, контейнер размера. Раскладку задают зоны: зоны под тонкими линиями; обложка, если первой идёт `Card.Media`; без зон — содержимое от края до края.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "The card's tier: its padding (`--prime-card-padding-s` 16 at `xs` · `s`, `-m` 20, `-l` 24 at `l` · `xl`) and the tier of the controls inside; the type roles stay.",
          ru: "Ярус карточки: её отступы (`--prime-card-padding-s` 16 при `xs` · `s`, `-m` 20, `-l` 24 при `l` · `xl`) и ярус контролов внутри; текстовые роли не меняются.",
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
      name: "Card.Header",
      en: "`ref` → `HTMLDivElement`. The top zone: an optional `Card.Icon`, `Card.Title` with an optional `Card.Description` under it, `Card.Actions` at the end. Wraps below 22rem.",
      ru: "Верхняя зона: необязательная `Card.Icon`, `Card.Title` с необязательным `Card.Description` под ним, `Card.Actions` в конце. Уже 22rem переносится.",
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
      en: "`ref` → `HTMLDivElement`. The mark leading `Card.Header` or a record row: a 40px accent tile of one icon. An `Avatar.Root` or `Thumbnail.Root` inside is the record's picture (no tile, `aria-hidden`); a `ProgressCircle` its state ring (no tile, its own name).",
      ru: "Метка в начале `Card.Header` или строки записи: плашка 40px с акцентом для одной иконки. `Avatar.Root` или `Thumbnail.Root` внутри — изображение записи (без плашки, `aria-hidden`); `ProgressCircle` — кольцо состояния (без плашки, со своим именем).",
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
      en: "`ref` → `HTMLHeadingElement`. The card heading (`<h3>`, title-s). A `Badge.Root` inside stands beside the text, 8 apart, centred on its line.",
      ru: "Заголовок карточки (`<h3>`, title-s). `Badge.Root` внутри стоит рядом с текстом, через 8, по центру строки.",
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
      en: "`ref` → `HTMLDivElement`. Secondary text (body-s): under the title, badges inside (a picker too) in a wrapping row; in `Card.Footer` it is the note: a `Badge.Dot` first, the text cut to one line.",
      ru: "Вторичный текст (body-s): под заголовком, бейджи внутри (и выбор) — переносимым рядом; в `Card.Footer` — заметка: сначала `Badge.Dot`, текст в одну строку.",
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
      name: "Card.Actions",
      en: "`ref` → `HTMLDivElement`. The end of `Card.Header` or of a record row: buttons, a switch, a period switch or a quiet caption, 8 apart, centred on the text. Below 22rem it drops under the text; icon buttons only stay beside it.",
      ru: "Конец `Card.Header` или строки записи: кнопки, переключатель, выбор периода или тихая подпись, через 8, по центру текста. Уже 22rem уходит под текст; одни иконочные кнопки остаются рядом.",
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
      en: "`ref` → `HTMLDivElement`. The padded content zone (gap 16): fields, a chart, a `DescriptionList`.",
      ru: "Зона содержимого с отступами (gap 16): поля, график, `DescriptionList`.",
      props: [
        {
          name: "divider",
          type: '"full"',
          en: "A line above the zone that runs edge to edge, in the `Divider` ink (`border-subtle`) so it reads in both themes (without it: the faint inset zone line).",
          ru: "Линия над зоной во всю ширину, цветом `Divider` (`border-subtle`), чтобы читалась в обеих темах (без него: едва заметная линия зоны с отступом).",
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
      en: "`ref` → `HTMLDivElement`. A picture or a chart, edge to edge: first in the card it is the 128–192px cover on top and the zones under it draw no lines; under the header or the body it is a chart. A chart SVG needs a CSS height.",
      ru: "Картинка или график от края до края: первой в карточке — обложка 128–192px сверху, и зоны под ней без линий; под шапкой или телом — график. SVG графика нужна высота в CSS.",
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
      en: "`ref` → `HTMLUListElement` / `HTMLLIElement`. A `<ul>` of `<li>` rows, faint hairlines between them. A row with `Card.Title` is a record row laid out like `Card.Header`: `Card.Icon`, the title over its description, `Card.Actions` at the end.",
      ru: "`<ul>` из строк `<li>`, между ними тонкие линии. Строка с `Card.Title` — строка записи с раскладкой `Card.Header`: `Card.Icon`, заголовок над описанием, `Card.Actions` в конце.",
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
    {
      name: "Card.Footer",
      en: "`ref` → `HTMLDivElement`. The bottom row of buttons: at the end, under a faint hairline after zones. A record's row: the actions, the note (`Card.Description`), `Card.Total` at the end.",
      ru: "Нижний ряд кнопок: в конце, под тонкой линией после зон. Строка записи: действия, заметка (`Card.Description`), `Card.Total` у края.",
      props: [
        {
          name: "divider",
          type: '"full" | "fill"',
          en: "How the zone stands off the one above: `full` — a line edge to edge in the `Divider` ink; `fill` — no line, the zone on the next layer, its actions from the start (a record's footer). Without it: the faint zone line.",
          ru: "Чем зона отделена от верхней: `full` — линия во всю ширину цветом `Divider`; `fill` — без линии, зона на следующем слое, действия с начала (подвал записи). Без него — тонкая линия зоны.",
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
      en: "`ref` → `HTMLDivElement`. The total of a record at the end of `Card.Footer`: the amount (title-m, tabular) with its state above it.",
      ru: "Итог записи у края `Card.Footer`: сумма (title-m, табличные цифры) и её состояние над ней.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "The total's state above the amount («к оплате 21 000 ₽», «оплачено»): body-s, muted.",
          ru: "Состояние итога над суммой («к оплате 21 000 ₽», «оплачено»): body-s, приглушённое.",
        },
        {
          name: "tone",
          type: '"neutral" | "success" | "warning" | "danger"',
          en: "The ink of the `label` by meaning (an amount due is `warning`, paid `success`).",
          ru: "Цвет `label` по смыслу (к оплате — `warning`, оплачено — `success`).",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the amount), `className` and the other div attributes.",
          ru: "`children` (сумма), `className` и остальные атрибуты div.",
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
        en: "Decorative icons in `Card.Icon` and cover images in `Card.Media` get `aria-hidden`; controls in `Card.Actions` need their own names.",
        ru: "Декоративные иконки в `Card.Icon` и обложки в `Card.Media` — `aria-hidden`; контролам в `Card.Actions` нужны свои имена.",
      },
    ],
  },
};
