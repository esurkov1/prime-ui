import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { BADGE_GROUP_LABELS } from "../badge/Badge";

const REST_DIV = {
  name: "…rest",
  type: "HTMLAttributes<HTMLDivElement>",
  en: "`children`, `className` and the other div attributes.",
  ru: "`children`, `className` и остальные атрибуты div.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "Card.Root",
      en: "`ref` → `HTMLDivElement` (the `asChild` element). A card: one entity on a surface of the depth ladder, parted by air, never by lines. Its zones (`Card.Media`, `Card.Header`, `Card.Body`, `Card.Footer`) stand a zone gap apart; with none it is a pane, content edge to edge.",
      ru: "Карточка: одна сущность на поверхности лестницы глубины, части разделены воздухом, а не линиями. Зоны (`Card.Media`, `Card.Header`, `Card.Body`, `Card.Footer`) стоят на шаг зоны друг от друга; без них это панель, содержимое от края до края.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Five steps of metrics: `xs` (padding 12), `s` (16), `m` (20), `l` (24), `xl` (28) with the type, the mark and the controls; in a container under 30rem (a phone) the padding is 12 · 16 · 16 · 20 · 24.",
          ru: "Одна из пяти ступеней мер: `xs` (отступ 12), `s` (16), `m` (20), `l` (24), `xl` (28) с текстом, меткой и контролами; в компактном контейнере (уже 30rem, телефон) отступ на шаг меньше: 12 · 16 · 16 · 20 · 24.",
        },
        {
          name: "selected",
          type: "boolean",
          en: 'The card is chosen: a 2 px accent ring, `Card.Indicator` checked. With `asChild` the element carries the state: `aria-pressed`, or `aria-checked` when it has `role="radio"` or `role="checkbox"`.',
          ru: 'Карточка выбрана: акцентное кольцо 2 px, `Card.Indicator` отмечен. С `asChild` состояние несёт элемент: `aria-pressed`, а при `role="radio"` или `role="checkbox"` — `aria-checked`.',
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "The whole card is one link or button (a choice card): pass that element as the only child with the parts inside it. Nothing interactive goes inside; for a card with its own controls use `Card.Link`.",
          ru: "Вся карточка — одна ссылка или кнопка (карточка выбора): передайте этот элемент единственным ребёнком с частями внутри. Интерактива внутри нет; для карточки со своими контролами — `Card.Link`.",
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
      name: "Card.Media",
      en: "`ref` → `HTMLDivElement`. The cover: the kit `Carousel` (one photo or several), edge to edge, in its own ratio. Only what belongs to the photo stands on it (dots, arrows, `Carousel.Overlay`); status and number go to the header.",
      ru: "Обложка: `Carousel` кита (одно фото или несколько) от края до края в своём соотношении сторон. На фото стоит только то, что к нему относится (точки, стрелки, `Carousel.Overlay`); статус и номер уходят в шапку.",
      props: [
        {
          name: "placement",
          type: '"top" | "start"',
          default: '"top"',
          en: "`top` — over the zones, full width. `start` — from 30rem a column of 40% at the start, the card's full height; narrower it stands on top.",
          ru: "`top` — над зонами во всю ширину. `start` — от 30rem колонка в 40% в начале на всю высоту карточки; уже — стоит сверху.",
        },
        REST_DIV,
      ],
    },
    {
      name: "Card.Header",
      en: "`ref` → `HTMLDivElement`. The top zone. Its parts take their places whatever the order: `Card.Icon`, the title with `Card.Badges` and `Card.Description` under it, then `Card.Actions` or `Card.Indicator` at the end. Only the title is required.",
      ru: "Верхняя зона. Части стоят на своих местах в любом порядке: `Card.Icon`, название с `Card.Badges` и `Card.Description` под ним, затем `Card.Actions` или `Card.Indicator` в конце. Обязательно только название.",
      props: [REST_DIV],
    },
    {
      name: "Card.Icon",
      en: "`ref` → `HTMLDivElement`. The mark leading `Card.Header` (32 · 32 · 40 · 48 · 56): an accent icon tile, or a picture or ring, no tile. A step smaller beside a `Switch`; under a top cover, on its edge.",
      ru: "Метка в начале `Card.Header` (32 · 32 · 40 · 48 · 56): акцентная плитка одной иконки, картинка записи или кольцо без плитки. Рядом с `Switch` на ступень меньше; под верхней обложкой — аватар на её кромке.",
      props: [REST_DIV],
    },
    {
      name: "Card.Title",
      en: "`ref` → `HTMLHeadingElement`. What the card is about: one line, cut with an ellipsis. Beside `Card.Badges` it gives way first, down to its own text or 8em, before the badges fold into «+N». 13/16 · 13/16 · 14/20 · 16/24 · 18/24 by size.",
      ru: "О чём карточка: одна строка с обрезкой многоточием. Рядом с `Card.Badges` уступает первым, до своего текста или 8em, и только потом бейджи сворачиваются в «+N». 13/16 · 13/16 · 14/20 · 16/24 · 18/24 по размеру.",
      props: [
        {
          name: "as",
          type: '"h2" | "h3" | "h4" | "span"',
          default: '"h3"',
          en: "The element: the heading level that fits the page outline, or `span` when the card is no heading.",
          ru: "Элемент: уровень заголовка по структуре страницы или `span`, когда карточка не заголовок.",
        },
        {
          name: "number",
          type: "ReactNode",
          en: "The record's number after the name («#866»), muted and tabular: the name is cut, the number never is.",
          ru: "Номер записи после имени («#866»), приглушённый и табличный: имя обрезается, номер — никогда.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLHeadingElement>",
          en: "`children`, `className` and the other heading attributes.",
          ru: "`children`, `className` и остальные атрибуты заголовка.",
        },
      ],
    },
    {
      name: "Card.Link",
      en: "`ref` → `HTMLAnchorElement`. Inside `Card.Title`: the link that opens the record. It stretches over the whole card and is the one tab stop, while the card's own controls stay above it. On hover the card lifts and the title is underlined; there is no arrow.",
      ru: "Внутри `Card.Title`: ссылка, открывающая запись. Растягивается на всю карточку и даёт единственную остановку Tab, а контролы карточки остаются над ней. На наведение карточка приподнимается, название подчёркивается; стрелки нет.",
      props: [
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Render the router's link element instead of an `<a>`.",
          ru: "Рендерить элемент-ссылку роутера вместо `<a>`.",
        },
        {
          name: "…rest",
          type: "AnchorHTMLAttributes<HTMLAnchorElement>",
          en: "`href`, `children`, `className` and the other anchor attributes.",
          ru: "`href`, `children`, `className` и остальные атрибуты ссылки.",
        },
      ],
    },
    {
      name: "Card.Badges",
      en: "`ref` → `HTMLDivElement`. A `Badge.Group` after the title, on its line: every badge of the record (status, role, counter). Badges are `xs` · `xs` · `s` · `m` · `m` by card size, as tall as the title's line; what does not fit folds into «+N».",
      ru: "`Badge.Group` после названия, на его строке: все бейджи записи (статус, роль, счётчик). Бейджи `xs` · `xs` · `s` · `m` · `m` по размеру карточки, высотой в строку названия, что не помещается, сворачивается в «+N».",
      props: [
        {
          name: "labels",
          type: "Partial<BadgeGroupLabels>",
          en: "Built-in strings of the «+N» badge, see the `Badge.Group` labels.",
          ru: "Системные строки бейджа «+N», см. подписи `Badge.Group`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the `Badge.Root`s), `className` and the other div attributes.",
          ru: "`children` (`Badge.Root`), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Card.Description",
      en: "`ref` → `HTMLDivElement`. The line under the title: plain text with new data only, one line, cut with an ellipsis; 12/16 · 12/16 · 13/20 · 14/20 · 14/20. A `StatusDot` first states the record's state, and a «·» is put after it by itself.",
      ru: "Строка под названием: простой текст только с новыми данными, одна строка с обрезкой; 12/16 · 12/16 · 13/20 · 14/20 · 14/20. `StatusDot` первым называет состояние записи, «·» после него ставится сам.",
      props: [REST_DIV],
    },
    {
      name: "Card.Actions",
      en: "`ref` → `HTMLDivElement`. The card's controls, the card's tier (xs · s · m · l · xl), as tall as its form fields. In the header: neutral actions (icon buttons, a ⋯ menu from three) and one picker; never an accent button. In the footer: up to two buttons, the accent one last.",
      ru: "Контролы карточки того же яруса, что карточка (xs · s · m · l · xl), вровень с полями формы в ней. В шапке: нейтральные действия (кнопки-иконки, «⋯» с трёх) и не больше одного выбора; акцентной кнопки нет. В подвале: до двух кнопок, акцентная последней.",
      props: [
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          en: "Footer only: the buttons share the footer's width. Use it when there is no start part.",
          ru: "Только в подвале: кнопки делят ширину подвала. Нужен, когда слева ничего нет.",
        },
        REST_DIV,
      ],
    },
    {
      name: "Card.Indicator",
      en: "`ref` → `HTMLSpanElement`. The choice mark at the end of the header: a radio circle or a checkbox, checked while the card is `selected`. It is `aria-hidden`; the card's own element carries the state.",
      ru: "Метка выбора в конце шапки: круг радио или чекбокс, отмечен, пока карточка `selected`. Она `aria-hidden`; состояние несёт сам элемент карточки.",
      props: [
        {
          name: "type",
          type: '"radio" | "checkbox"',
          required: true,
          en: '`radio` — one of several (inside a `role="radiogroup"`), `checkbox` — any of several.',
          ru: '`radio` — один из нескольких (внутри `role="radiogroup"`), `checkbox` — любые из нескольких.',
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Card.Body",
      en: '`ref` → `HTMLDivElement`. The content zone; its rows are parted by air, never lines: label — value rows (`DescriptionList` with `align="end"`), a `List` of records, a form, `Switch.Root` rows with `fullWidth`, a chart, a `ScrollContainer` of a long list, an `EmptyPage`.',
      ru: 'Зона содержимого; строки разделены воздухом, не линиями: строки «подпись — значение» (`DescriptionList` с `align="end"`), `List` записей, форма, строки `Switch.Root` с `fullWidth`, график, `ScrollContainer` длинного списка, `EmptyPage`.',
      props: [REST_DIV],
    },
    {
      name: "Card.Footer",
      en: "`ref` → `HTMLDivElement`. The bottom zone, no line and no fill, kept to the bottom of a stretched card: one thing at the start (`Card.Total`, an assignee picker, `Card.Note`) and `Card.Actions` at the end. On a narrow card the buttons go under and share the width.",
      ru: "Нижняя зона без линии и заливки, прижата к низу растянутой карточки: одно слева (`Card.Total`, выбор ответственного высотой с кнопку, `Card.Note`) и `Card.Actions` справа. На узкой карточке кнопки уходят вниз и делят ширину.",
      props: [REST_DIV],
    },
    {
      name: "Card.Total",
      en: "`ref` → `HTMLDivElement`. At the start of the footer: the amount, tabular, with its state (`label`) above it.",
      ru: "В начале подвала: сумма табличными цифрами, над ней её состояние (`label`).",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "The state of the amount («К оплате»), muted and coloured by `tone`.",
          ru: "Состояние суммы («К оплате»), приглушённое и окрашенное по `tone`.",
        },
        {
          name: "tone",
          type: '"neutral" | "success" | "warning" | "danger"',
          en: "The colour of `label` by meaning; the word says the meaning.",
          ru: "Цвет `label` по смыслу; смысл говорит слово.",
        },
        REST_DIV,
      ],
    },
    {
      name: "Card.Note",
      en: "`ref` → `HTMLDivElement`. At the start of the footer: one line of text (a `StatusDot` first states the state) and, with `progress`, the kit `ProgressBar` under it — a term, a quota, a delivery. It takes the free width beside the buttons; the bar is named by the note's text.",
      ru: "В начале подвала: одна строка текста (`StatusDot` первым говорит состояние) и, с `progress`, `ProgressBar` кита под ней — срок, квота, доставка. Занимает свободную ширину рядом с кнопками; полосу называет текст заметки.",
      props: [
        {
          name: "progress",
          type: "number",
          en: "Draws the progress bar under the line: the value from 0 to `max`. Omit it for a note of text alone.",
          ru: "Рисует полосу прогресса под строкой: значение от 0 до `max`. Без него заметка — только текст.",
        },
        {
          name: "max",
          type: "number",
          default: "100",
          en: "The top of the bar's scale; used with `progress`.",
          ru: "Верх шкалы полосы; вместе с `progress`.",
        },
        {
          name: "progressTone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          en: "The colour of the bar by meaning (an overdue term is `danger`); used with `progress`.",
          ru: "Цвет полосы по смыслу (просроченный срок — `danger`); вместе с `progress`.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "The line: a `StatusDot` first, then the text, cut with an ellipsis.",
          ru: "Строка: `StatusDot` первым, затем текст, обрезается многоточием.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: labelRows(BADGE_GROUP_LABELS, {
    more: {
      en: "Visible text of the «+N» badge for the badges that did not fit; `{count}` — how many.",
      ru: "Видимый текст бейджа «+N» для не поместившихся бейджей; `{count}` — сколько их.",
      part: "Card.Badges",
    },
    moreCount: {
      en: "What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip.",
      ru: "Что читают ассистивные технологии вместо видимого текста этого бейджа; `{count}` — сколько. Сами значения — в его подсказке.",
      part: "Card.Badges",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "A card with `Card.Link` is one stop on the link; a card with `asChild` is one stop on its element; otherwise the stops are the controls in `Card.Actions`.",
        ru: "Карточка с `Card.Link` — одна остановка на ссылке; карточка с `asChild` — одна остановка на её элементе; иначе остановки — контролы в `Card.Actions`.",
        native: true,
      },
      {
        keys: "Enter",
        en: "Opens the card's link, or presses its button (`asChild`).",
        ru: "Открывает ссылку карточки или нажимает её кнопку (`asChild`).",
        native: true,
      },
      {
        keys: "Space",
        en: "Presses the button of a card with `asChild` (a choice card).",
        ru: "Нажимает кнопку карточки с `asChild` (карточка выбора).",
        native: true,
      },
    ],
    aria: [
      {
        en: "`Card.Title` is a heading (`h3` by default, `as` picks the level); with `Card.Link` the link inside it names the card.",
        ru: "`Card.Title` — заголовок (по умолчанию `h3`, уровень задаёт `as`); с `Card.Link` карточку называет ссылка внутри него.",
      },
      {
        en: "`Card.Link` stretches over the card with a pseudo-element, so the card is one link for a pointer and one tab stop for the keyboard; its focus ring is drawn on the card.",
        ru: "`Card.Link` растягивается на карточку псевдоэлементом, поэтому для указателя карточка — одна ссылка, а для клавиатуры — одна остановка; кольцо фокуса рисуется на карточке.",
      },
      {
        en: 'A choice card is `Card.Root` with `asChild` and `selected` around a `<button>`: it gets `aria-pressed`, or `aria-checked` with `role="radio"` (inside a `role="radiogroup"`) or `role="checkbox"`. The `selected` ring never carries the meaning alone.',
        ru: 'Карточка выбора — `Card.Root` с `asChild` и `selected` вокруг `<button>`: он получает `aria-pressed`, а с `role="radio"` (внутри `role="radiogroup"`) или `role="checkbox"` — `aria-checked`. Кольцо `selected` не несёт смысл в одиночку.',
      },
      {
        en: "`Card.Indicator` is `aria-hidden`: it repeats the state the element carries. A picture in `Card.Icon` is `aria-hidden` (it repeats the title), a `ProgressCircle` keeps its name.",
        ru: "`Card.Indicator` — `aria-hidden`: он повторяет состояние, которое несёт элемент. Картинка в `Card.Icon` — `aria-hidden` (повторяет название), `ProgressCircle` сохраняет своё имя.",
      },
      {
        en: "The «·» after a `StatusDot` in `Card.Description` is `aria-hidden`; the state is the dot's word.",
        ru: "«·» после `StatusDot` в `Card.Description` — `aria-hidden`; состояние говорит слово точки.",
      },
    ],
  },
};
