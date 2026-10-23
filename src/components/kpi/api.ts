import type { ComponentApi } from "../../../scripts/docs/componentApi";

const REST_DIV = {
  name: "…rest",
  type: "HTMLAttributes<HTMLDivElement>",
  en: "`children`, `className` and the other div attributes.",
  ru: "`children`, `className` и остальные атрибуты div.",
};

const REST_SPAN = {
  name: "…rest",
  type: "HTMLAttributes<HTMLSpanElement>",
  en: "`children`, `className` and the other span attributes.",
  ru: "`children`, `className` и остальные атрибуты span.",
};

const TONE = '"neutral" | "success" | "warning" | "danger"';

export const api: ComponentApi = {
  parts: [
    {
      name: "Kpi.Root",
      en: "`ref` → `HTMLDivElement` (the card). A KPI card: one figure and what it means. Its size decides which parts it holds; a part it does not hold renders nothing. The parts take fixed places whatever their order.",
      ru: "KPI-карточка: одно число и его смысл. Размер решает, какие части она держит; часть, которую размер не держит, не рисуется. Части стоят на своих местах в любом порядке.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "The set of parts and their scale: `s` a strip of 6–8 figures, `m` the default, `l` a figure that needs explaining, `xl` the lead figure of a screen. `xs` takes `s`.",
          ru: "Набор частей и их масштаб: `s` — полоса из 6–8 цифр, `m` — по умолчанию, `l` — цифра, которой нужно объяснение, `xl` — главная цифра экрана. `xs` берёт `s`.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The figure is loading: the value, the change, the period and the note show a Skeleton in their geometry, the legend its rows; the card is `aria-busy`. The head stays.",
          ru: "Число загружается: значение, изменение, период и пояснение показывают Skeleton в своей геометрии, легенда — свои строки; карточка — `aria-busy`. Шапка остаётся.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "The whole card is one link or button: its only child holds the parts; it lifts on hover and presses. No actions inside.",
          ru: "Вся карточка — одна ссылка или кнопка: единственный ребёнок держит части; на наведение приподнимается, на нажатие проседает. Действий внутри нет.",
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
      en: "`ref` → `HTMLDivElement`. L and XL: the accent tile of one icon before the title, 40 on L, 48 on XL (the frame's mark) — as tall as the title with its description.",
      ru: "L и XL: акцентная плитка одной иконки перед названием, 40 на L и 48 на XL (метка рамки) — ровно высотой с названием и описанием.",
      props: [REST_DIV],
    },
    {
      name: "Kpi.Title",
      en: "`ref` → `HTMLDivElement`. What the figure is, required: one line, cut. 13/16 · 13/16 · 14/20 · 16/24 by size (S · M · L · XL), the title role of the frame a step under the Card's.",
      ru: "Что это за число, обязательно: одна строка с обрезкой. 13/16 · 13/16 · 14/20 · 16/24 по размеру (S · M · L · XL), роль заголовка рамки на ступень ниже карточки Card.",
      props: [REST_DIV],
    },
    {
      name: "Kpi.Link",
      en: "`ref` → `HTMLAnchorElement`. Inside `Kpi.Title`: the link that opens the figure's report. It stretches over the card while a chart or a control inside stays its own — the way to open a card with a `Sparkline`.",
      ru: "Внутри `Kpi.Title`: ссылка на отчёт по цифре. Растягивается на всю карточку, а график и контролы внутри остаются своими — так открывается карточка со `Sparkline`.",
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
      name: "Kpi.Description",
      en: "`ref` → `HTMLDivElement`. L and XL: what exactly the figure counts («Оплаченные счета»), 13/20 on L, 14/20 on XL, muted, under the title, one line, a `StatusDot` first allowed; cut before the title.",
      ru: "L и XL: что именно считает число («Оплаченные счета»), 13/20 на L, 14/20 на XL, приглушённо, под названием, одна строка, первым может стоять `StatusDot`; обрезается раньше названия.",
      props: [REST_DIV],
    },
    {
      name: "Kpi.Actions",
      en: "`ref` → `HTMLDivElement`. M, L, XL: the right slot of the head — one badge, menu or button at the top end. The controls take the size of the card's frame, a step under the card's size (M `s` · L `m` · XL `l`).",
      ru: "M, L, XL: правый слот шапки — один бейдж, меню или кнопка у края. Контролы берут размер рамки карточки, на ступень ниже размера карточки (M `s` · L `m` · XL `l`).",
      props: [REST_DIV],
    },
    {
      name: "Kpi.Value",
      en: "`ref` → `HTMLSpanElement`. The figure: tabular, one line; 20/28 · 24/32 · 30/36 · 36/44 by size.",
      ru: "Само число: табличные цифры, одна строка; 20/28 · 24/32 · 30/36 · 36/44 по размеру.",
      props: [REST_SPAN],
    },
    {
      name: "Kpi.Unit",
      en: "`ref` → `HTMLSpanElement`. Inside `Kpi.Value`: the unit after the figure (₽, %, ч, «млн ₽»), about 0.6 of it and muted; it never grows the line.",
      ru: "Внутри `Kpi.Value`: единица после числа (₽, %, ч, «млн ₽»), примерно 0,6 его кегля, приглушённая; высоту строки не меняет.",
      props: [REST_SPAN],
    },
    {
      name: "Kpi.Delta",
      en: "`ref` → `HTMLSpanElement`. The change: a `Badge` right of the value on its line (16 · 20 · 20 · 24). No base to compare with — leave it out.",
      ru: "Изменение: `Badge` справа от числа на его строке (16 · 20 · 20 · 24). Сравнивать не с чем — не пишите его.",
      props: [
        {
          name: "value",
          type: "number | null",
          en: "The signed change: its sign turns the arrow up or down; `0` or none — no arrow. `useSparkline` gives it as `change`.",
          ru: "Изменение со знаком: знак поворачивает стрелку вверх или вниз; `0` или нет — без стрелки. `useSparkline` отдаёт его как `change`.",
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
        REST_SPAN,
      ],
    },
    {
      name: "Kpi.Period",
      en: "`ref` → `HTMLSpanElement`. The time the figure stands for («1–22 окт», «Октябрь», «на 22 окт, 09:40»): at the end of the head on S, the start of the line under the value on M, L and XL. Never cut.",
      ru: "Время числа («1–22 окт», «Октябрь», «на 22 окт, 09:40»): в конце шапки на S, в начале строки под числом на M, L и XL. Не обрезается.",
      props: [REST_SPAN],
    },
    {
      name: "Kpi.Meta",
      en: "`ref` → `HTMLSpanElement`. M, L, XL: the note after the period on the line under the value — new data only (a plan, a threshold, what the figure is made of). Cut first.",
      ru: "M, L, XL: пояснение после периода в строке под числом — только новое (план, порог, из чего состоит). Обрезается первым.",
      props: [REST_SPAN],
    },
    {
      name: "Kpi.Media",
      en: "`ref` → `HTMLDivElement`. M, L, XL: one picture under the value — a `Sparkline` or a `ProgressBar`, the full width, kept to the bottom. The controls inside take the size two steps under the card.",
      ru: "M, L, XL: одна картинка под числом — `Sparkline` или `ProgressBar`, во всю ширину, у низа карточки. Контролы внутри берут размер на две ступени меньше карточки.",
      props: [REST_DIV],
    },
    {
      name: "Kpi.Footer",
      en: "`ref` → `HTMLDivElement`. The last part, the card padding below the rest, no line: one kind of new data. M holds only `Kpi.Legend`; L adds `Kpi.Note` and two `Kpi.Total`; XL four totals and a `DescriptionList` breakdown.",
      ru: "Последняя часть на паддинг ниже остального, без линии: один вид новых данных. M держит только `Kpi.Legend`; L добавляет `Kpi.Note` и два `Kpi.Total`; XL — четыре итога и разбивку `DescriptionList`.",
      props: [REST_DIV],
    },
    {
      name: "Kpi.Note",
      en: "`ref` → `HTMLDivElement`. In `Kpi.Footer`: one phrase about what needs attention after a `StatusDot` of its tone; cut, never wrapped.",
      ru: "В `Kpi.Footer`: одна фраза о том, что требует внимания, после точки `StatusDot` своего тона; обрезается, не переносится.",
      props: [
        {
          name: "tone",
          type: TONE,
          default: '"warning"',
          en: "The color of the dot; the phrase says the meaning.",
          ru: "Цвет точки; смысл говорит фраза.",
        },
        REST_DIV,
      ],
    },
    {
      name: "Kpi.Total",
      en: "`ref` → `HTMLDivElement`. In `Kpi.Footer`: a secondary figure — its label over its value, one column of a row of up to four (two on L).",
      ru: "В `Kpi.Footer`: вторичная цифра — подпись над значением, одна колонка из ряда до четырёх (два на L).",
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          en: "What the figure is («Счетов»).",
          ru: "Что это за цифра («Счетов»).",
        },
        REST_DIV,
      ],
    },
    {
      name: "Kpi.Legend",
      en: "`ref` → `HTMLDivElement`. In `Kpi.Footer`: the rows of the parts — color, name, value, share. With `ring` on XL a 2xl `ProgressCircle` stands left of them; otherwise draw the parts in `Kpi.Media` (a `ProgressBar` of ticks).",
      ru: "В `Kpi.Footer`: строки частей — цвет, название, значение, доля. С `ring` на XL слева встаёт `ProgressCircle` 2xl; иначе части рисуются в `Kpi.Media` (`ProgressBar` штрихами).",
      props: [
        {
          name: "segments",
          type: "ProgressSegment[]",
          required: true,
          en: "The parts, the same as the bar or the ring they explain.",
          ru: "Части — те же, что у полосы или кольца, которые они объясняют.",
        },
        {
          name: "max",
          type: "number",
          defaultNote: { en: "the sum of the parts", ru: "сумма частей" },
          en: "100% of a share.",
          ru: "100% доли.",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          en: "The display of a part's value («8 364»).",
          ru: "Отображение значения части («8 364»).",
        },
        {
          name: "ring",
          type: "boolean",
          default: "false",
          en: "XL: the ring of the parts left of the rows.",
          ru: "XL: кольцо частей слева от строк.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children" | "color">',
          en: "`className` and the other div attributes of the legend (of the ring's root with `ring`).",
          ru: "`className` и остальные атрибуты div легенды (корня кольца при `ring`).",
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
        en: "The title, the value, the change and the line under it read in order. Name the change in words (the `Kpi.Delta` text carries its sign), never by its tone alone; the dot of `Kpi.Note` is decorative.",
        ru: "Название, значение, изменение и строка под ним читаются по порядку. Изменение называйте словами (текст `Kpi.Delta` несёт знак), не одним цветом; точка `Kpi.Note` декоративна.",
      },
      {
        en: "While `loading` the card is `aria-busy` and the Skeletons are hidden from assistive tech.",
        ru: "Пока идёт `loading`, карточка `aria-busy`, а заглушки скрыты от экранных читалок.",
      },
    ],
  },
};
