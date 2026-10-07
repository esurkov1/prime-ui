import type { ComponentApi } from "../../../scripts/docs/componentApi";

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
          default: '"m"',
          en: "Spacing, icon and title follow the control tier; the description is one step smaller.",
          ru: "Отступы, иконка и заголовок по ярусу контрола; описание на ступень мельче.",
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
          en: "Renders a close button (top-right, or last in `Banner.Actions`) and calls this on click; the parent unmounts the banner.",
          ru: "Рендерит кнопку закрытия (в углу или последней в `Banner.Actions`) и вызывается по клику; родитель убирает баннер.",
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
      en: "A `<div>` grid: icon on the first line, title over description, actions on the right (under the text below 36rem).",
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
      en: "An `aria-hidden` `<span>` holding one `Icon`, one title line high, in the tone color.",
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
      en: "`<span>` elements: the medium title and the secondary text, both capped at the reading width.",
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
      en: "A `<div>` row of buttons; with `onDismiss` the close button becomes its last square button.",
      ru: "Ряд кнопок `<div>`; с `onDismiss` кнопка закрытия становится последней квадратной кнопкой ряда.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Buttons in the banner `size`), `className` and the other div attributes.",
          ru: "`children` (Button размера баннера), `className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "dismiss",
      default: "Закрыть",
      en: "`aria-label` of the close button.",
      ru: "`aria-label` кнопки закрытия.",
    },
  ],
};
