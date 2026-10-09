import type { ApiLabel, ApiPart } from "../../../scripts/docs/componentApi";
import {
  TRANSFER_INDEX_HANDLER_PROPS,
  transferLabels,
  transferProps,
} from "../../internal/transfer.api";

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
  en: "System strings, see Labels.",
  ru: "Системные строки, см. Labels.",
});

export const contentParts: ApiPart[] = [
  {
    name: "Message.Media",
    en: "`ref` → `HTMLDivElement`. A photo, a video or an album of up to 10 as a tiled grid with thin gaps; every box is final before anything loads (rows from the items' ratios, nothing measured), pictures load lazily and decode async, a video mounts its first frame once it nears the view. Alone in a message it is the shell itself — rounded, no backing, the meta on a dark pill over it; with a caption (`Message.Text` after it) it sits edge to edge at the top of the bubble. The gaps of an album show the neutral surface of an incoming message in both directions. A video tile shows its first frame, a play mark and its length; a tile on its way, either way, dims under the shared transfer disk on the media shade in its middle with the progress ring along the disk's edge — pressing the disk cancels, once done it fades and shrinks away; a failed one's disk turns danger with a retry arrow; a `remote` one carries the download arrow.",
    ru: "Фото, видео или альбом до 10 штук — плиточная сетка с тонкими зазорами; каждая рамка известна до загрузки (ряды по пропорциям из данных, ничего не измеряется), картинки грузятся лениво и декодируются асинхронно, видео подгружает первый кадр, когда плитка подходит к экрану. Одно в сообщении — это и есть оболочка: скруглённое, без подложки, мета на тёмной плашке поверх; с подписью (`Message.Text` после) стоит от края до края вверху пузыря. Зазоры альбома — нейтральная поверхность входящего сообщения в обе стороны. Видео-плитка — первый кадр, метка воспроизведения и длительность; плитка в пути, в любую сторону, приглушена под общим диском передачи на тени в центре с кольцом прогресса по его краю — нажатие на диск отменяет, по готовности он растворяется и уменьшается; у неудачной диск красный со стрелкой повтора; у `remote` — стрелка загрузки.",
    props: [
      {
        name: "items",
        type: "MessageMediaItem[]",
        required: true,
        en: '`{ type?: "image" | "video", src, poster?, alt?, width?, height?, duration?, transfer?, transferProgress?, transferDirection? }` — `width` / `height` give the ratio (default 4 : 3) and reserve the box before load; `duration` is a video\'s length before its metadata; `transfer`, `transferProgress` and `transferDirection` are the transfer of the tile, the same shape as every message part (`transfer={item.status}`, `transferProgress={item.progress}` of a `useUploadQueue` item; a share left out in flight turns an indeterminate arc; the direction changes only the words). Items after the 10th are not shown.',
        ru: '`{ type?: "image" | "video", src, poster?, alt?, width?, height?, duration?, transfer?, transferProgress?, transferDirection? }` — `width` / `height` задают пропорции (по умолчанию 4 : 3) и резервируют рамку до загрузки; `duration` — длительность видео до метаданных; `transfer`, `transferProgress` и `transferDirection` — передача плитки в той же форме, что у всех частей сообщения (`transfer={item.status}`, `transferProgress={item.progress}` элемента `useUploadQueue`; без доли в пути — неопределённая дуга; направление меняет только слова). Элементы после 10-го не показываются.',
      },
      {
        name: "onItemOpen",
        type: "(index: number) => void",
        en: "A tile was activated: open your viewer. Makes the tiles buttons named «Открыть: {alt}».",
        ru: "Плитку активировали: откройте свой просмотрщик. Делает плитки кнопками «Открыть: {alt}».",
      },
      ...TRANSFER_INDEX_HANDLER_PROPS,
      labelsRow("MessageMediaLabels"),
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
    en: "`ref` → `HTMLDivElement`. A document: a round tile with the format (from the name's extension, in its hue) or the file's picture, the name on one line and the size. The tile is the file's one action, in one spot: download (with `href`, a link; or `transfer=\"remote\"` with `onDownload`, fetched in the app), cancel while it transfers, retry after a failure. A transfer either way is the shared transfer disk (`xl`) over the tile — the cross on the media shade with the progress ring along its edge, always shown, and «{done} из {total}» under the name; a failure turns it into the danger retry with the reason under the name. The name and the size line never move.",
    ru: 'Документ: круглая плитка с форматом (по расширению имени, в его оттенке) или картинкой файла, имя в одну строку и размер. Плитка — единственное действие файла, в одном месте: скачать (с `href` — ссылкой; или `transfer="remote"` с `onDownload` — загрузкой в приложении), отменить во время передачи, повторить после ошибки. Передача в любую сторону — общий диск передачи (`xl`) поверх плитки: крестик на тени media с кольцом прогресса по краю, виден всегда, и «{done} из {total}» под именем; ошибка превращает его в красный повтор с причиной под именем. Имя и строка размера никогда не сдвигаются.',
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
        default: "Russian digits, Б · КБ · МБ · ГБ",
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
      ...transferProps({
        en: "the file — the transfer disk (`xl`) over its tile, the transferred share under the name",
        ru: "файла — диск передачи (`xl`) поверх плитки, переданная доля под именем",
      }),
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
        name: "…rest",
        type: 'Omit<HTMLAttributes<HTMLDivElement>, "color">',
        en: "`children` — `Button.Root` actions («Написать», «Добавить»); `className`.",
        ru: "`children` — действия `Button.Root` («Написать», «Добавить»); `className`.",
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
];

export const contentLabelRows: ApiLabel[] = [
  {
    key: "open",
    default: "Открыть: {name}",
    en: "`Message.Media`: the name of a tile that opens the viewer; `{name}` is `alt`, else `photo` / `video`.",
    ru: "`Message.Media`: имя плитки, открывающей просмотр; `{name}` — `alt`, иначе `photo` / `video`.",
  },
  {
    key: "photo",
    default: "фото",
    en: "`Message.Media`: `{name}` of a photo without `alt`.",
    ru: "`Message.Media`: `{name}` фото без `alt`.",
  },
  {
    key: "video",
    default: "видео",
    en: "`Message.Media`: `{name}` of a video without `alt`.",
    ru: "`Message.Media`: `{name}` видео без `alt`.",
  },
  ...transferLabels("`Message.Media` / `Message.File`", "Скачать {name}").map((row) =>
    row.key === "download"
      ? {
          ...row,
          en: "`Message.Media` / `Message.File`: the download arrow of a `remote` tile or file, and a file's `href` link; `{name}` is the file name, a tile's `alt` or `photo` / `video`.",
          ru: "`Message.Media` / `Message.File`: стрелка загрузки у плитки или файла в состоянии `remote` и ссылка `href` файла; `{name}` — имя файла, `alt` плитки или `photo` / `video`.",
        }
      : row,
  ),
  {
    key: "transferred",
    default: "{done} из {total}",
    en: "`Message.File`: the line under the name while it transfers.",
    ru: "`Message.File`: строка под именем во время передачи.",
  },
  {
    key: "openMap",
    default: "Открыть на карте: {place}",
    en: "`Message.Location`: the name of the map link.",
    ru: "`Message.Location`: имя ссылки на карту.",
  },
  {
    key: "live",
    default: "Трансляция",
    en: "`Message.Location`: the mark of a live location.",
    ru: "`Message.Location`: отметка геопозиции в реальном времени.",
  },
];
