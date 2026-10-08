import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Breadcrumb.Root",
      en: "`ref` → `HTMLElement` (the `<nav>`). `<nav aria-label>` with an `<ol>`; draws the chevrons between levels, sets the size and collapses the middle levels on narrow containers.",
      ru: "`<nav>` со списком `<ol>`: рисует шевроны между уровнями, задаёт размер и сворачивает средние уровни в узком контейнере.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Text of the links, the current page and the ellipsis; chevrons and icons take the same tier.",
          ru: "Кегль ссылок, текущей страницы и многоточия; шевроны и иконки — того же яруса.",
        },
        {
          name: "labels",
          type: "Partial<BreadcrumbLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Breadcrumb.Item`s and `Breadcrumb.Ellipsis`, in order; no separators by hand.",
          ru: "`Breadcrumb.Item` и `Breadcrumb.Ellipsis` по порядку; разделители не нужны.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`className` and the other `nav` attributes; an `aria-label` here overrides `labels.nav`.",
          ru: "`className` и остальные атрибуты `nav`; `aria-label` здесь заменяет `labels.nav`.",
        },
      ],
    },
    {
      name: "Breadcrumb.Item",
      en: "`ref` → `HTMLLIElement`. `<li>`: a muted `LinkButton` (`href`), plain text, or the current page (`current`).",
      ru: "`<li>`: приглушённая ссылка `LinkButton` (`href`), текст или текущая страница (`current`).",
      props: [
        {
          name: "href",
          type: "string",
          en: "Renders a link; without it the item is text.",
          ru: "Делает уровень ссылкой; без него — текст.",
        },
        {
          name: "current",
          type: "boolean",
          en: 'Current page: `aria-current="page"` (on the link when `href` is set), primary text, medium weight. Usually the last item, without `href`.',
          ru: 'Текущая страница: `aria-current="page"` (на ссылке, если есть `href`), основной текст. Обычно последний уровень, без `href`.',
        },
        {
          name: "aria-label",
          type: "string",
          en: "Name of a link without visible text (e.g. a home icon); set on the link, not the `li`.",
          ru: "Имя ссылки без видимого текста (например, иконки «дом»); ставится на ссылку, а не на `li`.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Text or an `Icon`. A string also becomes the `title` of a text item (full text when truncated).",
          ru: "Текст или `Icon`. Строка становится `title` текстового уровня (полный текст при обрезке).",
        },
        {
          name: "…rest",
          type: 'Omit<LiHTMLAttributes<HTMLLIElement>, "aria-label">',
          en: "`className` and the other `li` attributes.",
          ru: "`className` и остальные атрибуты `li`.",
        },
      ],
    },
    {
      name: "Breadcrumb.Ellipsis",
      en: "`ref` → `HTMLLIElement`. `<li>` with «…» for levels skipped on purpose, with visually hidden `labels.ellipsis`.",
      ru: "`<li>` с «…» для намеренно пропущенных уровней и скрытым текстом `labels.ellipsis`.",
      props: [
        {
          name: "…rest",
          type: 'Omit<LiHTMLAttributes<HTMLLIElement>, "children">',
          en: "`className` and the other `li` attributes.",
          ru: "`className` и остальные атрибуты `li`.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "nav",
      default: "Навигационная цепочка",
      en: "`aria-label` of the `nav` landmark.",
      ru: "`aria-label` области `nav`.",
    },
    {
      key: "ellipsis",
      default: "Скрытые разделы",
      en: "Hidden text of `Breadcrumb.Ellipsis`.",
      ru: "Скрытый текст `Breadcrumb.Ellipsis`.",
    },
  ],
};
