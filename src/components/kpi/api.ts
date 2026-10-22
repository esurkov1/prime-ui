import type { ComponentApi } from "../../../scripts/docs/componentApi";

const REST = {
  name: "…rest",
  type: "HTMLAttributes<HTMLElement>",
  en: "`children`, `className` and the other attributes of the element.",
  ru: "`children`, `className` и остальные атрибуты элемента.",
};

const TONE = '"neutral" | "success" | "warning" | "danger"';

export const api: ComponentApi = {
  parts: [
    {
      name: "Kpi.Root",
      en: "`ref` → `HTMLDivElement` (the card). A KPI card: the kit's `Card` with one figure inside. The parts take fixed places whatever their order: the head, the value over its change row, the media at the bottom.",
      ru: "KPI-карточка: `Card` кита с одним числом внутри. Части стоят на своих местах в любом порядке: шапка, значение над строкой изменения, медиа внизу.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "The card's tier: its padding and the tier of the controls in `Kpi.Actions`; the type roles stay.",
          ru: "Ярус карточки: её отступы и ярус контролов в `Kpi.Actions`; текстовые роли не меняются.",
        },
        {
          name: "valueSize",
          type: '"s" | "m" | "l"',
          default: '"l"',
          en: "The step of `Kpi.Value`, one for a row: `l` heading-l, `m` heading-m (dense rows, a drawer), `s` body-m medium — a value that is a line of text.",
          ru: "Ступень `Kpi.Value`, одна на ряд: `l` — heading-l, `m` — heading-m (плотные ряды, дровер), `s` — body-m medium, значение-строка текста.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The figure is loading: the value, the change and the reference line show a Skeleton in their geometry, the card is `aria-busy`; the data fades in. The head stays.",
          ru: "Число загружается: значение, изменение и справочная строка показывают Skeleton в своей геометрии, карточка — `aria-busy`; данные проявляются. Шапка остаётся.",
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
          en: "The whole card is one link or button (`Card.Root asChild`): its only child holds the parts; a link draws the corner arrow. No actions inside.",
          ru: "Вся карточка — одна ссылка или кнопка (`Card.Root asChild`): единственный ребёнок держит части; ссылка рисует стрелку в углу. Действий внутри нет.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the parts), `className` and the other div attributes of the card.",
          ru: "`children` (части), `className` и остальные атрибуты div карточки.",
        },
      ],
    },
    {
      name: "Kpi.Icon",
      en: "`ref` → `HTMLDivElement`. The 40px accent tile of one icon, leading the title, centred on its two lines.",
      ru: "Плашка 40px с акцентом для одной иконки перед заголовком, по центру двух его строк.",
      props: [REST],
    },
    {
      name: "Kpi.Title",
      en: "`ref` → `HTMLDivElement`. What the figure is: title-s, semibold, one line, cut.",
      ru: "Что это за число: title-s, полужирный, одна строка с обрезкой.",
      props: [REST],
    },
    {
      name: "Kpi.Description",
      en: "`ref` → `HTMLSpanElement`. What the figure counts («Оплаченные счета»): body-s, muted, on the line under the title, before the period.",
      ru: "Что считает число («Оплаченные счета»): body-s, приглушённый, в строке под заголовком, перед периодом.",
      props: [REST],
    },
    {
      name: "Kpi.Period",
      en: "`ref` → `HTMLSpanElement`. The time the figure stands for: an interval («1–31 окт») or a moment («на 22 окт, 09:40»); always last on the line under the title, in the secondary ink.",
      ru: "Время, за которое число: интервал («1–31 окт») или момент («на 22 окт, 09:40»); всегда последним в строке под заголовком, вторичным цветом.",
      props: [REST],
    },
    {
      name: "Kpi.Actions",
      en: "`ref` → `HTMLDivElement`. The top end of the card: a button, a menu, a period or grain switch, 8 apart, centred on the title.",
      ru: "Правый верхний угол карточки: кнопка, меню, переключатель периода или шага, через 8, по центру заголовка.",
      props: [REST],
    },
    {
      name: "Kpi.Value",
      en: "`ref` → `HTMLSpanElement`. The figure: tabular, the step of `valueSize`. A `Badge.Root` inside stands beside the text, 8 apart.",
      ru: "Само число: табличные цифры, ступень `valueSize`. `Badge.Root` внутри стоит рядом с текстом, через 8.",
      props: [
        {
          name: "tone",
          type: TONE,
          en: "The ink by meaning (an amount due is `warning`).",
          ru: "Цвет по смыслу (остаток к оплате — `warning`).",
        },
        REST,
      ],
    },
    {
      name: "Kpi.Delta",
      en: "`ref` → `HTMLSpanElement`. The change: a `Badge` one step below the card on its own row under the value, so a value that changes width never moves it.",
      ru: "Изменение: `Badge` на ступень меньше карточки, своей строкой под значением, поэтому значение, меняющее ширину, его не сдвигает.",
      props: [
        {
          name: "value",
          type: "number | null",
          en: "The signed change: its sign turns the arrow up or down (half a turn); `0` or none — no arrow. `useSparkline` gives it as `change`.",
          ru: "Изменение со знаком: знак поворачивает стрелку вверх или вниз (на полоборота); `0` или нет — без стрелки. `useSparkline` отдаёт его как `change`.",
        },
        {
          name: "tone",
          type: TONE,
          default: '"neutral"',
          en: "Color by meaning, not by sign (churn up is `danger`); `useSparkline` gives it as `changeTone`.",
          ru: "Цвет по смыслу, а не по знаку (рост оттока — `danger`); `useSparkline` отдаёт его как `changeTone`.",
        },
        {
          name: "reading",
          type: "KpiDeltaReading",
          en: "A series reading (`useSparkline`): its `change`, `changeTone` and `changeText` in place of `value`, `tone` and the text; no change — no part.",
          ru: "Показание ряда (`useSparkline`): его `change`, `changeTone` и `changeText` вместо `value`, `tone` и текста; нет изменения — нет части.",
        },
        REST,
      ],
    },
    {
      name: "Kpi.Meta",
      en: "`ref` → `HTMLSpanElement`. The reference line after the change: what it compares with, what backs the figure («к сентябрю · 3,56 млн ₽»). body-s, muted, tabular.",
      ru: "Справочная строка после изменения: с чем сравнили, чем подтверждается число («к сентябрю · 3,56 млн ₽»). body-s, приглушённая, табличные цифры.",
      props: [
        {
          name: "tone",
          type: TONE,
          en: "The ink by meaning; without it the line is muted.",
          ru: "Цвет по смыслу; без него строка приглушена.",
        },
        REST,
      ],
    },
    {
      name: "Kpi.Media",
      en: "`ref` → `HTMLDivElement`. A `Sparkline`, a `ProgressBar` or a breakdown: the full width, kept to the bottom so the cards of a row line it up.",
      ru: "`Sparkline`, `ProgressBar` или разбивка: во всю ширину, у низа карточки, чтобы в ряду стояли на одной линии.",
      props: [REST],
    },
    {
      name: "Kpi.Group",
      en: "`ref` → `HTMLDivElement` (the card). Related figures in one card: each `Kpi.Root` inside is a cell, equal columns, a faint line between them; stacked below 22rem.",
      ru: "Связанные числа в одной карточке: каждый `Kpi.Root` внутри — ячейка, равные колонки, тонкая линия между ними; уже 22rem — столбиком.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "The tier of the group's card.",
          ru: "Ярус карточки группы.",
        },
        {
          name: "flat",
          type: "boolean",
          default: "false",
          en: "No raised shadow.",
          ru: "Без тени.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the `Kpi.Root` cells), `className` and the other div attributes of the card.",
          ru: "`children` (ячейки `Kpi.Root`), `className` и остальные атрибуты div карточки.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "A card with `asChild` is one stop; otherwise the stops are the controls in `Kpi.Actions` and the chart in `Kpi.Media`.",
        ru: "Карточка с `asChild` — одна остановка; иначе остановки — контролы в `Kpi.Actions` и график в `Kpi.Media`.",
        native: true,
      },
    ],
    aria: [
      {
        en: 'A card with a `Kpi.Title` is `role="group"` named by it (`aria-labelledby`), so a screen reader moving through a grid of cards hears the figure\'s name first; a link or a button card (`asChild`) is named by its own text.',
        ru: 'Карточка с `Kpi.Title` — `role="group"` с именем из него (`aria-labelledby`): в сетке карточек экранная читалка сначала называет показатель; карточка-ссылка или кнопка (`asChild`) названа своим текстом.',
      },
      {
        en: "The title, the period, the value and the change read in order. Name the change in words (the `Kpi.Delta` text carries its sign), never by its tone alone.",
        ru: "Заголовок, период, значение и изменение читаются по порядку. Изменение называйте словами (текст `Kpi.Delta` несёт знак), не одним цветом.",
      },
      {
        en: "A `loading` card is `aria-busy`; its Skeletons are decorative (`aria-hidden`). The dot between the description and the period is `aria-hidden`.",
        ru: "Карточка с `loading` — `aria-busy`; её Skeleton декоративны (`aria-hidden`). Точка между описанием и периодом — `aria-hidden`.",
      },
      {
        en: "The icon in `Kpi.Icon` and the arrow of `Kpi.Delta` are decorative; controls in `Kpi.Actions` need their own names.",
        ru: "Иконка в `Kpi.Icon` и стрелка `Kpi.Delta` декоративны; контролам в `Kpi.Actions` нужны свои имена.",
      },
    ],
  },
};
