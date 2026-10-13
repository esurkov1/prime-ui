import type { ApiLabel, ApiPart, ComponentApi } from "../../../scripts/docs/componentApi";
import { TRANSFER_INDEX_HANDLER_PROPS, transferLabels } from "../../internal/transfer.api";

/** The props of a gallery, shared with `Message.Media` (which is a gallery its message shapes). */
export const galleryProps: ApiPart["props"] = [
  {
    name: "items",
    type: "GalleryItem[]",
    required: true,
    en: "`{ type?, src, poster?, alt?, width?, height?, duration?, transfer?, transferProgress?, transferDirection? }`; `width` / `height` give the ratio (default 4 : 3). The first 10 are shown.",
    ru: "`{ type?, src, poster?, alt?, width?, height?, duration?, transfer?, transferProgress?, transferDirection? }`; `width` / `height` задают пропорции (по умолчанию 4 : 3). Показываются первые 10.",
  },
  {
    name: "viewer",
    type: "boolean",
    default: "true",
    en: "A tile (a press, Enter or Space) opens the album in the kit's `MediaViewer` at that item. `false` — no viewer of the kit: open your own from `onOpenChange` and `onIndexChange`.",
    ru: "Плитка (нажатие, Enter или Space) открывает альбом в `MediaViewer` кита на этом элементе. `false` — без просмотрщика кита: откройте свой по `onOpenChange` и `onIndexChange`.",
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
      en: "`ref` → `HTMLDivElement`. Photos and videos as a messenger album: one, or 2–10 laid out from their aspect ratios alone, every box final before anything loads. A tile opens the album in `MediaViewer`; a tile on its way shows the shared transfer disk.",
      ru: "Фото и видео как альбом мессенджера: одно или 2–10, разложенные только по пропорциям, каждая рамка известна до загрузки. Плитка открывает альбом в `MediaViewer`; плитка в пути показывает общий диск передачи.",
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
