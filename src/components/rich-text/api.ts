import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { RICH_TEXT_LABELS } from "./RichText";

export const api: ComponentApi = {
  parts: [
    {
      name: "RichText",
      en: "`ref` → `HTMLDivElement`. Text in the chat's Markdown subset outside a message, rendered as elements in the type of its host.",
      ru: "Текст в подмножестве Markdown чата вне сообщения: элементы в шрифте хоста.",
      props: [
        {
          name: "children",
          type: "string",
          required: true,
          en: "The Markdown subset (`**`, `_`, `__`, `~~`, `||`, code, links, `> ` quotes, `# ` headings, `- ` / `* ` / `1. ` lists; `\\*` escapes a mark), or with `entities` the plain text they format.",
          ru: "Подмножество Markdown (`**`, `_`, `__`, `~~`, `||`, код, ссылки, цитаты `> `, заголовки `# `, списки `- ` / `* ` / `1. `; `\\*` экранирует знак) или с `entities` — простой текст, который они размечают.",
        },
        {
          name: "entities",
          type: "readonly TextEntity[]",
          en: "The formatted ranges of a messenger's text (Telegram, VK): `children` is then plain text, never read as Markdown, and a range may start inside a word. Bare URLs in it still link.",
          ru: "Размеченные диапазоны текста мессенджера (Telegram, VK): `children` тогда простой текст, разметка в нём не читается, и диапазон может начинаться внутри слова. Голые ссылки в нём по-прежнему ссылки.",
        },
        {
          name: "onLinkClick",
          type: "(href: string, event: MouseEvent<HTMLAnchorElement>) => void",
          en: "A press on a link with its address: call `event.preventDefault()` to open a relative one with the app's router. A press with ⌘, Ctrl, Shift, Alt or another button stays the browser's: no call.",
          ru: "Нажатие на ссылку с её адресом: `event.preventDefault()` — и относительный адрес открывает роутер приложения. Нажатие с ⌘, Ctrl, Shift, Alt или другой кнопкой остаётся браузеру: без вызова.",
        },
        {
          name: "labels",
          type: "Partial<RichTextLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className`, `id`, `data-*` and the other div attributes.",
          ru: "`className`, `id`, `data-*` и остальные атрибуты div.",
        },
      ],
    },
  ],
  types: [
    {
      name: "TextEntity",
      en: "One formatted range of a plain text, as messengers send it (Telegram `MessageEntity`, VK `format_data`): map their type names onto these.",
      ru: "Один размеченный диапазон простого текста, как его шлют мессенджеры (Telegram `MessageEntity`, VK `format_data`): их имена типов переводятся в эти.",
      fields: [
        {
          name: "type",
          type: '"bold" | "italic" | "underline" | "strikethrough" | "spoiler" | "code" | "pre" | "link" | "quote"',
          required: true,
          en: "The format; `pre` and `quote` are blocks (the line breaks at their edges are theirs). A type the kit does not know shows its text.",
          ru: "Формат; `pre` и `quote` — блоки (переносы строк на их краях — их собственные). Незнакомый тип показывает свой текст.",
        },
        {
          name: "offset",
          type: "number",
          required: true,
          en: "Start in UTF-16 code units (a JS string index, as in Telegram).",
          ru: "Начало в единицах UTF-16 (индекс строки JS, как в Telegram).",
        },
        {
          name: "length",
          type: "number",
          required: true,
          en: "Length in UTF-16 code units; ranges nest and may cross (a crossing one is cut).",
          ru: "Длина в единицах UTF-16; диапазоны вкладываются и могут пересекаться (пересекающий режется).",
        },
        {
          name: "url",
          type: "string",
          en: "The address of a `link`; without it the range itself is the address. Only http(s), `mailto:`, `tel:` and relative addresses on the same origin (`/path`, `./`, `../`, `?query`, `#hash`) link.",
          ru: "Адрес `link`; без него адрес — сам диапазон. Ссылками становятся только http(s), `mailto:`, `tel:` и относительные адреса того же источника (`/path`, `./`, `../`, `?query`, `#hash`).",
        },
        {
          name: "language",
          type: "string",
          en: "The language of a `pre` block, kept through the conversions.",
          ru: "Язык блока `pre`, сохраняется при преобразованиях.",
        },
      ],
    },
    {
      name: "FormattedText",
      en: "A plain text with its formatted ranges: what a messenger sends and takes.",
      ru: "Простой текст с размеченными диапазонами: то, что мессенджер шлёт и принимает.",
      fields: [
        {
          name: "text",
          type: "string",
          required: true,
          en: "The plain text.",
          ru: "Простой текст.",
        },
        {
          name: "entities",
          type: "TextEntity[]",
          required: true,
          en: "Its formatted ranges.",
          ru: "Его размеченные диапазоны.",
        },
      ],
    },
  ],
  functions: [
    {
      name: "getTextEntities(source)",
      type: "(source: string) => FormattedText",
      en: "The plain `text` and `entities` of a Markdown source — what a messenger's API takes from a Composer message. Bare URLs make no entity (the messenger links them); a heading line is its text in `bold`, a list item keeps its marker as text (`- `, `3. `).",
      ru: "Простой `text` и `entities` исходника Markdown — то, что берёт API мессенджера из сообщения Composer. Голые ссылки сущностей не дают (мессенджер свяжет их сам); строка-заголовок — её текст в `bold`, пункт списка сохраняет маркер текстом (`- `, `3. `).",
    },
    {
      name: "getRichTextSource(value)",
      type: "(value: FormattedText) => string",
      en: "The Markdown source of `{ text, entities }` — to edit a received or stored text in Composer or `Textarea formatting`. Text that would read as markup is escaped (`\\*`, `\\#`, `\\-`, `3\\.` at a line's start); an italic or underline inside a word, which the subset cannot hold, is dropped and its text kept.",
      ru: "Исходник Markdown из `{ text, entities }` — чтобы править полученный или сохранённый текст в Composer или `Textarea formatting`. Текст, который читался бы как разметка, экранируется (`\\*`, `\\#`, `\\-`, `3\\.` в начале строки); курсив или подчёркивание внутри слова подмножество не держит — формат снимается, текст остаётся.",
    },
  ],
  labels: labelRows(RICH_TEXT_LABELS, {
    spoiler: {
      en: "The name of a masked spoiler until it is revealed.",
      ru: "Имя скрытого спойлера, пока его не открыли.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        native: true,
        en: "Moves through the links and the masked spoilers.",
        ru: "Переводит фокус по ссылкам и скрытым спойлерам.",
      },
      {
        keys: "Enter · Space",
        en: "On a masked spoiler: reveals it and moves the focus onto its text.",
        ru: "На скрытом спойлере: открывает его и переводит фокус на текст.",
      },
    ],
    aria: [
      {
        en: 'A masked spoiler is a `role="button"` named `labels.spoiler`; its words are out of the accessibility tree until it is revealed.',
        ru: 'Скрытый спойлер — `role="button"` с именем `labels.spoiler`; его слова скрыты от скринридера, пока его не открыли.',
      },
      {
        en: 'Links take only http(s), `mailto:` and `tel:` addresses, which open in a new tab (`rel="noopener noreferrer"`), and relative ones on the same origin, which open in the same tab (`//host` and `javascript:` stay text); markup is never parsed as HTML.',
        ru: 'Ссылки — только http(s), `mailto:` и `tel:`, они открываются в новой вкладке (`rel="noopener noreferrer"`), и относительные адреса того же источника, они открываются в той же вкладке (`//host` и `javascript:` остаются текстом); разметка никогда не разбирается как HTML.',
      },
      {
        en: "A heading line is a `<p>` holding a `<strong>`, not an `<h*>`: a text is not a section of the page and adds nothing to its outline. Lists are real `<ul>` / `<ol>` (`start` from the first number).",
        ru: "Строка-заголовок — `<p>` со `<strong>`, не `<h*>`: текст — не раздел страницы и не меняет её структуру заголовков. Списки — настоящие `<ul>` / `<ol>` (`start` с первого номера).",
      },
    ],
  },
};
