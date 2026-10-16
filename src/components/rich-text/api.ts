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
          en: "The Markdown subset (`**`, `_`, `__`, `~~`, `||`, code, links, `> ` quotes; `\\*` escapes a mark), or with `entities` the plain text they format.",
          ru: "Подмножество Markdown (`**`, `_`, `__`, `~~`, `||`, код, ссылки, цитаты `> `; `\\*` экранирует знак) или с `entities` — простой текст, который они размечают.",
        },
        {
          name: "entities",
          type: "readonly TextEntity[]",
          en: "The formatted ranges of a messenger's text (Telegram, VK): `children` is then plain text, never read as Markdown, and a range may start inside a word. Bare URLs in it still link.",
          ru: "Размеченные диапазоны текста мессенджера (Telegram, VK): `children` тогда простой текст, разметка в нём не читается, и диапазон может начинаться внутри слова. Голые ссылки в нём по-прежнему ссылки.",
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
          en: "The address of a `link`; without it the range itself is the address. Only http(s), `mailto:` and `tel:` link.",
          ru: "Адрес `link`; без него адрес — сам диапазон. Ссылками становятся только http(s), `mailto:` и `tel:`.",
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
      en: "The plain `text` and `entities` of a Markdown source — what a messenger's API takes from a Composer message. Bare URLs make no entity (the messenger links them).",
      ru: "Простой `text` и `entities` исходника Markdown — то, что берёт API мессенджера из сообщения Composer. Голые ссылки сущностей не дают (мессенджер свяжет их сам).",
    },
    {
      name: "getRichTextSource(value)",
      type: "(value: FormattedText) => string",
      en: "The Markdown source of `{ text, entities }` — to edit a received or stored text in Composer or `Textarea formatting`. Text that would read as markup is escaped (`\\*`); an italic or underline inside a word, which the subset cannot hold, is dropped and its text kept.",
      ru: "Исходник Markdown из `{ text, entities }` — чтобы править полученный или сохранённый текст в Composer или `Textarea formatting`. Текст, который читался бы как разметка, экранируется (`\\*`); курсив или подчёркивание внутри слова подмножество не держит — формат снимается, текст остаётся.",
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
        en: 'Links take only http(s), `mailto:` and `tel:` addresses and open in a new tab (`rel="noopener noreferrer"`); markup is never parsed as HTML.',
        ru: 'Ссылки — только http(s), `mailto:` и `tel:`, открываются в новой вкладке (`rel="noopener noreferrer"`); разметка никогда не разбирается как HTML.',
      },
    ],
  },
};
