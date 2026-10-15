import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { BREADCRUMB_LABELS } from "./Breadcrumb";

export const api: ComponentApi = {
  parts: [
    {
      name: "Breadcrumb.Root",
      en: "`ref` → `HTMLElement` (the `<nav>`). `<nav aria-label>` with an `<ol>`; draws the chevrons between levels, sets the size and, when the whole path does not fit its width uncut, collapses the middle levels into a «…» menu button that lists them.",
      ru: "`<nav aria-label>` со списком `<ol>`: рисует шевроны между уровнями, задаёт размер и, когда весь путь не помещается в ширину без обрезки, сворачивает средние уровни в кнопку «…» с меню этих уровней.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Text of the links, the current page and the ellipsis; chevrons, icons and the collapse menu take the same tier. Without it the tier of its host, else `m`.",
          ru: "Кегль ссылок, текущей страницы и многоточия; шевроны, иконки и меню свёрнутых уровней — того же яруса. Без него — ярус хоста, иначе `m`.",
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
  labels: labelRows(BREADCRUMB_LABELS, {
    nav: { en: "`aria-label` of the `nav` landmark.", ru: "`aria-label` области `nav`." },
    ellipsis: {
      en: "Name of the collapse menu button and hidden text of `Breadcrumb.Ellipsis`.",
      ru: "Имя кнопки меню свёрнутых уровней и скрытый текст `Breadcrumb.Ellipsis`.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves focus between the level links and the «…» of a collapsed path; the current page is not focusable.",
        ru: "Переводит фокус между ссылками уровней и «…» свёрнутого пути; текущая страница не фокусируется.",
      },
      {
        keys: "Enter",
        en: "Follows the link; on the «…» opens the menu of the hidden levels.",
        ru: "Переходит по ссылке; на «…» открывает меню скрытых уровней.",
      },
      {
        keys: "ArrowDown · ArrowUp · Escape",
        en: "In the menu of hidden levels: move between them, close it and return to the «…».",
        ru: "В меню скрытых уровней: переход между ними, закрытие с возвратом к «…».",
      },
    ],
    aria: [
      {
        en: "`nav` landmark with `aria-label` from `labels.nav`; an ordered list.",
        ru: "Область `nav` с `aria-label` из `labels.nav` и упорядоченный список.",
      },
      {
        en: 'The current page has `aria-current="page"`; the chevrons are `aria-hidden` spans inside the levels, so every list item is a level.',
        ru: 'Текущая страница — `aria-current="page"`; шевроны и знак «…» скрыты (`aria-hidden`).',
      },
      {
        en: 'Collapsed middle levels leave the layout and the tab order (no invisible focus stops); the automatic «…» is a menu button (`aria-haspopup="menu"`) named by `labels.ellipsis`, and its menu lists them as links.',
        ru: 'Свёрнутые средние уровни уходят из раскладки и порядка Tab (без невидимых остановок фокуса); автоматическое «…» — кнопка меню (`aria-haspopup="menu"`) с именем из `labels.ellipsis`, а её меню перечисляет эти уровни ссылками.',
      },
      {
        en: "Icon-only links need `aria-label` on the Item.",
        ru: "Ссылке только с иконкой нужен `aria-label`.",
      },
    ],
  },
};
