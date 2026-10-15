import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { BANNER_LABELS } from "./Banner";

export const api: ComponentApi = {
  parts: [
    {
      name: "Banner.Root",
      en: "`ref` → `HTMLDivElement`. The in-flow message block: fill of the tone, tier spacing; renders the close button with `onDismiss`.",
      ru: "Блок сообщения в потоке: заливка тона, отступы яруса; с `onDismiss` рендерит кнопку закрытия.",
      props: [
        {
          name: "variant",
          type: '"solid" | "soft" | "outline"',
          default: '"soft"',
          en: "`soft` tinted fill, `solid` saturated fill for urgent messages, `outline` card fill with a tone ring.",
          ru: "`soft` — мягкая заливка, `solid` — насыщенная для срочного, `outline` — заливка карточки с обводкой тона.",
        },
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          default: '"info"',
          en: "Semantic color of the message.",
          ru: "Смысловой цвет сообщения.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус хоста, иначе `"m"`' },
          en: "Spacing, icon and title follow the control tier; the description is one step smaller. Without it the tier of the host.",
          ru: "Отступы, иконка и заголовок по ярусу контрола; описание на ступень мельче. Без него — ярус хоста.",
        },
        {
          name: "placement",
          type: '"inset" | "page"',
          default: '"inset"',
          en: "`inset` — rounded block in the flow or in a card; `page` — edge-to-edge strip above a page, content aligned to the page column.",
          ru: "`inset` — скруглённый блок в потоке или в карточке; `page` — полоса во всю ширину над страницей, контент по колонке страницы.",
        },
        {
          name: "onDismiss",
          type: "() => void",
          en: "Renders a close button (top-right, or last in `Banner.Actions`) and calls this on click; the parent unmounts the banner, which closes up in place; focus inside it moves to the next tab stop of the page.",
          ru: "Рендерит кнопку закрытия (в углу или последней в `Banner.Actions`) и вызывается по клику; родитель убирает баннер — он схлопывается на месте, а фокус из него переходит к следующему элементу страницы.",
        },
        {
          name: "labels",
          type: "Partial<BannerLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `role` (`alert`, `status`, `region`), `aria-label` and the other div attributes.",
          ru: "`className`, `role` (`alert`, `status`, `region`), `aria-label` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Banner.Content",
      en: "`ref` → `HTMLDivElement`. A `<div>` grid: icon on the first line, title over description, actions on the right (under the text below 36rem).",
      ru: "Сетка `<div>`: иконка на первой строке, заголовок над описанием, действия справа (под текстом уже 36rem).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Banner.Icon",
      en: "`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` holding one `Icon`, one title line high, in the tone color.",
      ru: "`<span>` с `aria-hidden` для одной `Icon` высотой в строку заголовка, цвета тона.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (`Icon`), `className` and the other span attributes.",
          ru: "`children` (`Icon`), `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Banner.Title · Banner.Description",
      en: "`ref` → `HTMLSpanElement`. `<span>` elements: the medium title and the secondary text, both capped at the reading width.",
      ru: "Элементы `<span>`: заголовок и вторичный текст, оба ограничены шириной чтения.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Banner.Actions",
      en: "`ref` → `HTMLDivElement`. A `<div>` row of buttons; with `onDismiss` the close button becomes its last square button (in the corner below 36rem).",
      ru: "Ряд кнопок `<div>`; с `onDismiss` кнопка закрытия становится последней квадратной кнопкой ряда (уже 36rem — в углу).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Buttons in the banner `size`), `className` and the other div attributes.",
          ru: "`children` (Button в `size` баннера), `className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: labelRows(BANNER_LABELS, {
    dismiss: { en: "`aria-label` of the close button.", ru: "`aria-label` кнопки закрытия." },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Actions and the close button are regular buttons in Tab order.",
        ru: "Действия и кнопка закрытия — обычные кнопки в порядке Tab.",
      },
    ],
    aria: [
      {
        en: 'The banner has no role of its own: give an error after an action `role="alert"`, a calm status `role="status"`, a page strip `role="region"` with `aria-label`.',
        ru: 'Сам баннер без роли: ошибкам после действия задайте `role="alert"`, спокойным статусам — `role="status"`, полосе страницы — `role="region"` с `aria-label`.',
      },
      {
        en: "The icon is `aria-hidden`: the title carries the meaning, not the color.",
        ru: "Иконка скрыта (`aria-hidden`): смысл несёт заголовок, а не цвет.",
      },
      {
        en: "The close button is named by `labels.dismiss`. It leaves with the banner, and focus inside the banner moves to the next tab stop of the page (the previous one at its end); inside `Crossfade` it moves to the state that takes the banner's place (see `dismissible.tsx`).",
        ru: "Кнопка закрытия названа `labels.dismiss` и уходит вместе с баннером, а фокус из баннера переходит к следующему элементу страницы (к предыдущему в её конце); внутри `Crossfade` — в состояние, занявшее место баннера (см. `dismissible.tsx`).",
      },
    ],
  },
};
