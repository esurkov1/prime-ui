import type { ApiLabel, ApiPart, ComponentApi } from "../../../scripts/docs/componentApi";
import { TRANSFER_INDEX_HANDLER_PROPS, transferLabels } from "../../internal/transfer.api";

/** The props of a gallery, shared with `Message.Media` (which is a gallery its message shapes). */
export const galleryProps: ApiPart["props"] = [
  {
    name: "items",
    type: "GalleryItem[]",
    required: true,
    en: '`{ type?: "image" | "video", src, poster?, alt?, width?, height?, duration?, transfer?, transferProgress?, transferDirection? }` — `width` / `height` give the ratio (default 4 : 3) that lays the album out and reserves every box before load; `duration` is a video\'s length before its metadata; `transfer`, `transferProgress` and `transferDirection` are the transfer of the tile, the same shape as every transferring part (`transfer={item.status}`, `transferProgress={item.progress}` of a `useUploadQueue` item; a share left out in flight turns an indeterminate arc; the direction changes only the words). Items after the 10th are not shown.',
    ru: '`{ type?: "image" | "video", src, poster?, alt?, width?, height?, duration?, transfer?, transferProgress?, transferDirection? }` — `width` / `height` задают пропорции (по умолчанию 4 : 3), по которым раскладывается альбом и резервируется каждая рамка до загрузки; `duration` — длительность видео до метаданных; `transfer`, `transferProgress` и `transferDirection` — передача плитки в той же форме, что у всех передающих частей (`transfer={item.status}`, `transferProgress={item.progress}` элемента `useUploadQueue`; без доли в пути — неопределённая дуга; направление меняет только слова). Элементы после 10-го не показываются.',
  },
  {
    name: "viewer",
    type: "boolean",
    default: "true",
    en: "The album opens in the kit's `MediaViewer`: a tile (a press or Enter) opens it at that item with the whole album as its set — arrows and swipes page, a video plays inside, pictures zoom, Escape closes — growing out of the tile and closing back into it, the focus returning to the tile. `false` — no viewer of the kit: open your own from `onOpenChange` and `onIndexChange`.",
    ru: "Альбом открывается в `MediaViewer` кита: плитка (нажатие или Enter) открывает его на этом элементе со всем альбомом — стрелки и свайпы листают, видео играет внутри, фото увеличиваются, Escape закрывает, — вырастая из плитки и уходя обратно в неё, фокус возвращается на плитку. `false` — без просмотрщика кита: откройте свой по `onOpenChange` и `onIndexChange`.",
  },
  {
    name: "open",
    type: "boolean",
    en: "The viewer is open (controlled).",
    ru: "Просмотрщик открыт (управляемое).",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    default: "false",
    en: "Initially open (uncontrolled).",
    ru: "Открыт сначала (неуправляемое).",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    en: "A tile opened the viewer (`true`), or the viewer closed (`false`).",
    ru: "Плитка открыла просмотрщик (`true`) или он закрылся (`false`).",
  },
  {
    name: "index",
    type: "number",
    en: "The item the viewer shows (controlled); a tile sets it to its own.",
    ru: "Элемент, который показывает просмотрщик (управляемое); плитка ставит свой.",
  },
  {
    name: "defaultIndex",
    type: "number",
    default: "0",
    en: "The item shown first (uncontrolled).",
    ru: "Элемент, показанный первым (неуправляемое).",
  },
  {
    name: "onIndexChange",
    type: "(index: number) => void",
    en: "A tile was activated, or the viewer turned its page: the item now shown.",
    ru: "Активирована плитка или просмотрщик перелистнул: элемент, который сейчас показан.",
  },
  ...TRANSFER_INDEX_HANDLER_PROPS,
  {
    name: "labels",
    type: "Partial<GalleryLabels>",
    en: "System strings, see Labels.",
    ru: "Системные строки, см. Labels.",
  },
];

export const galleryLabels = (scope: string): ApiLabel[] => [
  {
    key: "open",
    default: "Открыть: {name}",
    en: `${scope}: the name of a tile that opens the viewer; \`{name}\` is \`alt\`, else \`photo\` / \`video\`.`,
    ru: `${scope}: имя плитки, открывающей просмотр; \`{name}\` — \`alt\`, иначе \`photo\` / \`video\`.`,
  },
  {
    key: "photo",
    default: "фото",
    en: `${scope}: \`{name}\` of a photo without \`alt\`.`,
    ru: `${scope}: \`{name}\` фото без \`alt\`.`,
  },
  {
    key: "video",
    default: "видео",
    en: `${scope}: \`{name}\` of a video without \`alt\`.`,
    ru: `${scope}: \`{name}\` видео без \`alt\`.`,
  },
];

export const api: ComponentApi = {
  parts: [
    {
      name: "Gallery",
      en: "`ref` → `HTMLDivElement`. Photos and videos as a messenger album: one, or 2–10 laid out from their aspect ratios alone — two side by side or stacked, a tall first one beside a column, a wide first one over a row, larger albums in rows chosen to come close to a square with fewer items above more. Every box is final before anything loads (nothing is measured): the gallery is as wide as its host allows up to `--prime-gallery-max-size` (a lone portrait is narrower, its height reaching the cap), the tiles stand at fractions of its box with `--prime-gallery-gap` between them, the outer corners rounded. Pictures load lazily and decode async; a video tile mounts its first frame once it nears the view and shows a play mark and its length. A tile opens the album in `MediaViewer` at that item, out of the tile and back into it. A tile on its way, either way, dims under the shared transfer disk in its middle — pressing it cancels, a failure turns it danger with a retry, a `remote` one carries the download arrow, and once done it fades and shrinks away.",
      ru: "Фото и видео как альбом мессенджера: одно или 2–10, разложенные только по пропорциям — два рядом или друг под другом, высокое первое рядом со столбцом, широкое первое над рядом, большие альбомы рядами, выбранными так, чтобы альбом был ближе к квадрату, а вверху стояло меньше, чем внизу. Каждая рамка известна до загрузки (ничего не измеряется): галерея шириной с то, что даёт контейнер, до `--prime-gallery-max-size` (одиночный портрет уже — его высота достигает предела), плитки стоят в долях её рамки с зазором `--prime-gallery-gap`, внешние углы скруглены. Картинки грузятся лениво и декодируются асинхронно; видео-плитка подгружает первый кадр у края экрана и показывает метку воспроизведения и длительность. Плитка открывает альбом в `MediaViewer` на этом элементе — из плитки и обратно в неё. Плитка в пути, в любую сторону, приглушена под общим диском передачи — нажатие отменяет, ошибка делает его красным с повтором, у `remote` — стрелка загрузки, по готовности диск растворяется.",
      props: [
        ...galleryProps,
        {
          name: "children",
          type: "ReactNode",
          en: "Laid over the gallery, above every tile (a caption pill, a message's time).",
          ru: "Поверх галереи, над всеми плитками (плашка подписи, время сообщения).",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other attributes.",
          ru: "`className` и прочие атрибуты.",
        },
      ],
    },
  ],
  labels: [
    ...galleryLabels("Gallery"),
    ...transferLabels("Gallery", "Скачать {name}").map((row) =>
      row.key === "download"
        ? {
            ...row,
            en: "Gallery: the download arrow of a `remote` tile; `{name}` is its `alt` or `photo` / `video`.",
            ru: "Gallery: стрелка загрузки у плитки в состоянии `remote`; `{name}` — её `alt` или `photo` / `video`.",
          }
        : row,
    ),
  ],
};
