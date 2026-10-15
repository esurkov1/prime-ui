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
          en: "The source: `**bold**`, `_italic_`, `~~strike~~`, `||spoiler||`, inline and fenced code, links (`[label]` then the address in parentheses), bare URLs, `> ` quotes; line breaks are kept.",
          ru: "Исходник: `**bold**`, `_italic_`, `~~strike~~`, `||spoiler||`, код в строке и блоком, ссылки (`[label]`, затем адрес в скобках), голые ссылки, цитаты `> `; переносы строк сохраняются.",
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
