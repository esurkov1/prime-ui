import { type ApiLabel, type ApiPart, labelRows } from "../../../scripts/docs/componentApi";
import { transferLabelDocs, transferProps } from "../../internal/transfer.api";
import { galleryLabelDocs, galleryProps } from "../gallery/api";
import { GALLERY_LABELS } from "../gallery/Gallery";
import { MESSAGE_LOCATION_LABELS } from "./MessageCards";
import { MESSAGE_FILE_LABELS } from "./MessageFile";

/**
 * The content parts of a message (`Message.Media`, `.File`, `.Location`, `.Contact`,
 * `.LinkPreview`): `api.ts` spreads `contentParts` after its own parts and `contentLabelRows` after
 * its own labels. The players (VoicePlayer, VideoNote) are components of their own.
 */

const COLORS =
  '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"';

const labelsRow = (type: string) => ({
  name: "labels",
  type: `Partial<${type}>`,
  en: "Built-in strings, see Labels.",
  ru: "Системные строки, см. «Доступность».",
});

export const contentParts: ApiPart[] = [
  {
    name: "Message.Media",
    en: "`ref` → `HTMLDivElement`. A photo, a video or an album of up to 10: a `Gallery` the message shapes, with every gallery prop. Alone it is the `media` shell; with a `Message.Text` caption after it, it tops a bubble edge to edge.",
    ru: "Фото, видео или альбом до 10 штук: `Gallery`, которой придаёт форму сообщение, со всеми пропсами галереи. Одно — это оболочка `media`; с подписью (`Message.Text` после) стоит от края до края вверху пузыря.",
    props: [
      ...galleryProps,
      {
        name: "…rest",
        type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
        en: "`className` and the other attributes.",
        ru: "`className` и прочие атрибуты.",
      },
    ],
  },
  {
    name: "Message.File",
    en: "`ref` → `HTMLDivElement`. A document: a round format tile (or `preview`), the name and the size. The tile is the file's one action — download (`href` or `onDownload`), cancel while it transfers, retry after a failure.",
    ru: "Документ: круглая плитка формата (или `preview`), имя и размер. Плитка — единственное действие файла: скачать (`href` или `onDownload`), отменить во время передачи, повторить после ошибки.",
    props: [
      {
        name: "name",
        type: "string",
        required: true,
        en: "The file name with its extension (the format tile reads it).",
        ru: "Имя файла с расширением (по нему формат на плитке).",
      },
      {
        name: "fileSize",
        type: "number",
        en: "Bytes, shown as «1,2 МБ».",
        ru: "Байты, показываются как «1,2 МБ».",
      },
      {
        name: "formatSize",
        type: "(bytes: number) => string",
        defaultNote: {
          en: "Russian digits, Б · КБ · МБ · ГБ",
          ru: "русские цифры, Б · КБ · МБ · ГБ",
        },
        en: "Display of `fileSize`.",
        ru: "Показ `fileSize`.",
      },
      {
        name: "href",
        type: "string",
        en: "Where to get it: the tile becomes the download link «Скачать {name}».",
        ru: "Откуда скачать: плитка становится ссылкой «Скачать {name}».",
      },
      {
        name: "preview",
        type: "string",
        en: "A picture of the file (an image, the first page) in the tile in place of the format.",
        ru: "Картинка файла (изображение, первая страница) в плитке вместо формата.",
      },
      ...transferProps({ en: "the file", ru: "файла" }),
      labelsRow("MessageFileLabels"),
      {
        name: "…rest",
        type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
        en: "`className` and the other attributes.",
        ru: "`className` и прочие атрибуты.",
      },
    ],
  },
  {
    name: "Message.Location",
    en: "`ref` → `HTMLDivElement`. A place in one card width: a 16 : 9 map picture edge to edge at the top of the bubble (its box is final before it loads) with an accent pin, the place and its address under it; `live` makes the pin breathe and adds a «Трансляция» badge.",
    ru: "Место шириной карточки: картинка карты 16 : 9 от края до края вверху пузыря (её рамка известна до загрузки) с акцентной меткой, название и адрес под ней; `live` заставляет метку «дышать» и добавляет значок «Трансляция».",
    props: [
      {
        name: "src",
        type: "string",
        required: true,
        en: "A map picture of the place from your map service (the kit ships no map).",
        ru: "Картинка карты из вашего картографического сервиса (своей карты в ките нет).",
      },
      {
        name: "href",
        type: "string",
        en: "Opens the place in a map, in a new tab.",
        ru: "Открывает место на карте в новой вкладке.",
      },
      { name: "title", type: "string", en: "The place.", ru: "Название места." },
      { name: "address", type: "string", en: "Its address.", ru: "Его адрес." },
      {
        name: "live",
        type: "boolean",
        default: "false",
        en: "A location shared live (still under reduced motion).",
        ru: "Геопозиция в реальном времени (без движения при reduced motion).",
      },
      labelsRow("MessageLocationLabels"),
      {
        name: "…rest",
        type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
        en: "`className` and the other attributes.",
        ru: "`className` и прочие атрибуты.",
      },
    ],
  },
  {
    name: "Message.Contact",
    en: "`ref` → `HTMLDivElement`. A shared contact in one card width: an `Avatar` (`l`, photo or initials), the name and the phone; `children` are the actions in a row under them.",
    ru: "Отправленный контакт шириной карточки: `Avatar` (`l`, фото или инициалы), имя и телефон; `children` — действия строкой под ними.",
    props: [
      { name: "name", type: "string", required: true, en: "The person.", ru: "Имя." },
      { name: "phone", type: "string", en: "The phone, as written.", ru: "Телефон как есть." },
      {
        name: "src",
        type: "string",
        en: "The person's photo; without it the initials.",
        ru: "Фото человека; без него — инициалы.",
      },
      {
        name: "color",
        type: COLORS,
        default: '"blue"',
        en: "Hue of the initials.",
        ru: "Цвет инициалов.",
      },
      {
        name: "children",
        type: "ReactNode",
        en: "`Button.Root` actions in a row under the person («Написать», «Добавить»).",
        ru: "Действия `Button.Root` строкой под контактом («Написать», «Добавить»).",
      },
      {
        name: "…rest",
        type: 'Omit<HTMLAttributes<HTMLDivElement>, "color">',
        en: "`className` and the other div attributes.",
        ru: "`className` и остальные атрибуты div.",
      },
    ],
  },
  {
    name: "Message.LinkPreview",
    en: "`ref` → `HTMLAnchorElement`. The card of a linked page across the bubble's full width (at least the card width): an accent wash with a bar, the site, title, description (3 lines) and a 16 : 9 picture; long words and URLs wrap; the whole card opens the page in a new tab.",
    ru: "Карточка страницы по ссылке на всю ширину пузыря (не уже ширины карточки): акцентная подложка с полосой, сайт, заголовок, описание (3 строки) и картинка 16 : 9; длинные слова и адреса переносятся; вся карточка открывает страницу в новой вкладке.",
    props: [
      { name: "href", type: "string", required: true, en: "The page.", ru: "Страница." },
      {
        name: "site",
        type: "string",
        en: "The site's name, in the accent color.",
        ru: "Название сайта, акцентным цветом.",
      },
      { name: "title", type: "string", en: "The page title.", ru: "Заголовок страницы." },
      {
        name: "description",
        type: "string",
        en: "Its description, up to three lines.",
        ru: "Описание, до трёх строк.",
      },
      {
        name: "image",
        type: "string",
        en: "The page's picture, full width under the text.",
        ru: "Картинка страницы на всю ширину под текстом.",
      },
      {
        name: "…rest",
        type: 'Omit<HTMLAttributes<HTMLElement>, "title">',
        en: "`className` and the other attributes of the link.",
        ru: "`className` и прочие атрибуты ссылки.",
      },
    ],
  },
  {
    name: "Message.Sticker",
    en: '`ref` → `HTMLDivElement` (`role="img"`). A sticker: a square picture with no bubble, the meta on a pill over its corner; a `Skeleton` holds the box until it is ready.',
    ru: "Стикер: квадратная картинка без пузыря, время на плашке в углу; пока он не готов, место держит `Skeleton`.",
    props: [
      {
        name: "aria-label",
        type: "string",
        required: true,
        en: "The sticker's name («Стикер «Класс»», or its emoji); shown in its box when `src` fails.",
        ru: "Имя стикера («Стикер «Класс»» или его эмодзи); показывается в рамке, если `src` не загрузился.",
      },
      {
        name: "src",
        type: "string",
        en: "A still or animated picture (webp, gif, apng), decoded before it shows. Without it the children are the sticker.",
        ru: "Статичная или анимированная картинка (webp, gif, apng), показывается после декодирования. Без неё стикер — дети.",
      },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        en: "Your player in the children is not ready yet: the `Skeleton` stays over the box.",
        ru: "Ваш плеер в детях ещё не готов: `Skeleton` остаётся поверх рамки.",
      },
      {
        name: "…rest",
        type: 'Omit<HTMLAttributes<HTMLDivElement>, "role" | "aria-label">',
        en: "`children` — your player for a Lottie (.tgs) or a video sticker, sized to the box; `className`.",
        ru: "`children` — ваш плеер для Lottie (.tgs) или видеостикера, по размеру рамки; `className`.",
      },
    ],
  },
];

/** The label rows of the content parts, each on the part whose `labels` prop takes it. */
export const contentLabelRows: ApiLabel[] = [
  ...labelRows(GALLERY_LABELS, {
    ...galleryLabelDocs("`Message.Media`", "Message.Media"),
    ...transferLabelDocs("`Message.Media`", "Message.Media"),
    download: {
      en: "`Message.Media`: the download arrow of a `remote` tile; `{name}` is its `alt` or `photo` / `video`.",
      ru: "`Message.Media`: стрелка загрузки у плитки в состоянии `remote`; `{name}` — её `alt` или `photo` / `video`.",
      part: "Message.Media",
    },
  }),
  ...labelRows(MESSAGE_FILE_LABELS, {
    transferred: {
      en: "`Message.File`: the line under the name while it transfers.",
      ru: "`Message.File`: строка под именем во время передачи.",
      part: "Message.File",
    },
    ...transferLabelDocs("`Message.File`", "Message.File"),
    download: {
      en: "`Message.File`: the download arrow of a `remote` file and the `href` link; `{name}` is the file name.",
      ru: "`Message.File`: стрелка загрузки у файла в состоянии `remote` и ссылка `href`; `{name}` — имя файла.",
      part: "Message.File",
    },
  }),
  ...labelRows(MESSAGE_LOCATION_LABELS, {
    openMap: {
      en: "`Message.Location`: the name of the map link.",
      ru: "`Message.Location`: имя ссылки на карту.",
      part: "Message.Location",
    },
    live: {
      en: "`Message.Location`: the mark of a live location.",
      ru: "`Message.Location`: отметка геопозиции в реальном времени.",
      part: "Message.Location",
    },
  }),
];
