import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Thumbnail.Root",
      en: "`ref` → `HTMLDivElement` (the `<button>` of a selectable tile, the child with `asChild`). The frame: height of the tier, width from `ratio`, radius, palette fill; tracks the image load for the Fallback.",
      ru: "Рамка: высота яруса, ширина по `ratio`, скругление и заливка палитры; следит за загрузкой картинки для Fallback.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Height 24 · 32 · 40 · 48 · 64 px, radius 4 · 6 · 8 · 8 · 12; width follows `ratio`. Without it the tile takes the tier of its host, else `m`.",
          ru: "Высота 24 · 32 · 40 · 48 · 64 px, скругление 4 · 6 · 8 · 8 · 12; ширина по `ratio`. Без него плитка берёт ярус контейнера, иначе `m`.",
        },
        {
          name: "ratio",
          type: '"1:1" | "4:3" | "3:2" | "16:10" | "16:9" | "3:4"',
          default: '"1:1"',
          en: "Aspect ratio, width ÷ height.",
          ru: "Соотношение сторон, ширина ÷ высота.",
        },
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"gray"',
          en: "Fallback fill and icon hue; a color that means something (category, vehicle color).",
          ru: "Оттенок заливки и иконки подложки; цвет со смыслом (категория, цвет машины).",
        },
        {
          name: "variant",
          type: '"soft" | "solid"',
          default: '"soft"',
          en: "Fallback fill: a soft tint with a hue icon, or a solid hue with a contrasting icon.",
          ru: "Заливка подложки: мягкий оттенок с цветной иконкой или насыщенный цвет с контрастной.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          en: "Fills the container width (cards, galleries); the height follows `ratio`.",
          ru: "Во всю ширину контейнера (карточки, галереи); высота по `ratio`.",
        },
        {
          name: "ring",
          type: "boolean",
          default: "false",
          en: "A faint inner ring, for photos with a white background on a light surface.",
          ru: "Тонкое внутреннее кольцо — для фото на белом фоне на светлой поверхности.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Puts the frame, with hover, press and focus ring, on its one child — a `<button>` that opens a viewer or an `<a>` to the object. Name the child (`aria-label`) when the picture is all it shows.",
          ru: "Ставит рамку с наведением, нажатием и кольцом фокуса на единственного потомка — `<button>`, открывающую просмотр, или `<a>` на объект. Назовите потомка (`aria-label`), если на нём только картинка.",
        },
        {
          name: "checked",
          type: "boolean",
          en: 'Selected (controlled). Any of the checked triad makes a selectable tile — a `<button role="checkbox">` with a check in the corner. Name it with `aria-label` or the image `alt`.',
          ru: 'Выбрано (управляемое). Любой из тройки делает плитку выбираемой — `<button role="checkbox">` с галочкой в углу. Имя — `aria-label` или `alt` картинки.',
        },
        {
          name: "defaultChecked",
          type: "boolean",
          en: "Initially selected (uncontrolled); makes the tile selectable.",
          ru: "Выбрано изначально (неуправляемое); делает плитку выбираемой.",
        },
        {
          name: "onCheckedChange",
          type: "(checked: boolean) => void",
          en: "Selection changed by click, Space or Enter; makes the tile selectable.",
          ru: "Выбор изменён кликом, Space или Enter; делает плитку выбираемой.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "color" | "defaultChecked" | "onChange">',
          en: "`className`, `aria-label` + `role` for a fallback-only thumbnail, and the other attributes of the frame.",
          ru: "`className`, `aria-label` + `role` для превью без картинки и остальные атрибуты рамки.",
        },
      ],
    },
    {
      name: "Thumbnail.Image",
      en: '`ref` → `HTMLImageElement`. The picture; hidden while it loads and after an error, so the Fallback shows through. A new `src` fades in over the last one. Loads lazily and decodes off the main thread (`loading="lazy"`, `decoding="async"`; pass either to override).',
      ru: 'Картинка; скрыта, пока грузится и после ошибки, — видна подложка. Новый `src` проявляется поверх прежнего. Грузится лениво и декодируется вне главного потока (`loading="lazy"`, `decoding="async"`; оба можно переопределить).',
      props: [
        {
          name: "src",
          type: "string",
          required: true,
          en: "Image URL.",
          ru: "Адрес картинки.",
        },
        {
          name: "alt",
          type: "string",
          default: '""',
          en: "Empty when the text next to the thumbnail names the object, otherwise a description.",
          ru: "Пустой, когда объект назван текстом рядом, иначе — описание.",
        },
        {
          name: "fit",
          type: '"cover" | "contain"',
          default: '"cover"',
          en: "`cover` crops to fill; `contain` shows the whole image on the fallback fill (logos).",
          ru: "`cover` обрезает по рамке; `contain` показывает картинку целиком на заливке (логотипы).",
        },
        {
          name: "…rest",
          type: 'Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">',
          en: "`className`, `onLoad`, `onError` and the other img attributes.",
          ru: "`className`, `onLoad`, `onError` и остальные атрибуты img.",
        },
      ],
    },
    {
      name: "Thumbnail.Video",
      en: '`ref` → `HTMLVideoElement`. A video in the frame (`preload="metadata"`, `playsInline`); the Fallback shows until its first frame (with a `poster`, its metadata). Without `controls`: the duration pill and a play mark that fades while it plays.',
      ru: 'Видео в рамке (`preload="metadata"`, `playsInline`); подложка видна до первого кадра (с `poster` — до метаданных). Без `controls`: плашка длительности и знак воспроизведения, гаснущий во время игры.',
      props: [
        {
          name: "src",
          type: "string",
          required: true,
          en: "Video URL. Without a `poster` the first frame is asked for (`#t=0.001` is added when the URL has no fragment).",
          ru: "Адрес видео. Без `poster` запрашивается первый кадр (к адресу без фрагмента добавляется `#t=0.001`).",
        },
        {
          name: "poster",
          type: "string",
          en: "A still shown before playing; with it the video counts as loaded once its metadata is in.",
          ru: "Кадр-обложка до воспроизведения; с ней видео считается загруженным, когда пришли метаданные.",
        },
        {
          name: "controls",
          type: "boolean",
          default: "false",
          en: "Native controls: a video message or a clip to watch in place; no play mark or duration of the kit.",
          ru: "Нативные контролы: видеосообщение или ролик для просмотра на месте; без знака и длительности кита.",
        },
        {
          name: "autoPlay",
          type: "boolean",
          default: "false",
          en: "A GIF-like clip: plays muted, in a loop, inline. Off under `prefers-reduced-motion` (read once): the first frame stands still with the play mark.",
          ru: "Ролик как GIF: без звука, по кругу, на месте. При `prefers-reduced-motion` (читается один раз) выключено: стоит первый кадр со знаком воспроизведения.",
        },
        {
          name: "fit",
          type: '"cover" | "contain"',
          default: '"cover"',
          en: "`cover` crops to fill; `contain` letterboxes on the fallback fill.",
          ru: "`cover` обрезает по рамке; `contain` вписывает на заливку подложки.",
        },
        {
          name: "formatDuration",
          type: "(seconds: number) => string",
          defaultNote: { en: "`m:ss` (`h:mm:ss` from an hour)", ru: "`m:ss` (`h:mm:ss` от часа)" },
          en: "Display of the duration badge.",
          ru: "Показ длительности.",
        },
        {
          name: "…rest",
          type: 'Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster" | "controls" | "autoPlay" | "muted" | "loop" | "children">',
          en: "`className`, `aria-label`, `onLoadedData`, `onError` and the other video attributes.",
          ru: "`className`, `aria-label`, `onLoadedData`, `onError` и остальные атрибуты video.",
        },
      ],
    },
    {
      name: "Thumbnail.Fallback",
      en: "`ref` → `HTMLSpanElement`. A `<span>` with an icon (sized to the tier) or a short label on the fill; `aria-hidden` once the image has loaded.",
      ru: "`<span>` с иконкой (размер по ярусу) или короткой подписью на заливке; `aria-hidden`, когда картинка загрузилась.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses a pressable (`asChild`) or selectable tile; a plain thumbnail takes no focus.",
        ru: "Фокус на превью-кнопке (`asChild`) или выбираемой плитке; простое превью не фокусируется.",
      },
      {
        keys: "Enter · Space",
        en: "Opens the object (`asChild`) or toggles a selectable tile.",
        ru: "Открывает объект (`asChild`) или переключает выбор плитки.",
      },
    ],
    aria: [
      {
        en: 'Next to a name the thumbnail is decorative: keep `alt=""` (default) and mark fallback icons `aria-hidden`.',
        ru: 'Рядом с названием превью декоративно: `alt=""` (по умолчанию), иконки подложки — `aria-hidden`.',
      },
      {
        en: 'Alone: give `Thumbnail.Image` a descriptive `alt`, or `role="img"` + `aria-label` on Root for a fallback-only thumbnail.',
        ru: 'Без названия рядом: осмысленный `alt` у `Thumbnail.Image` или `role="img"` + `aria-label` на корне для превью без картинки.',
      },
      {
        en: "A preview that opens the object is `asChild` on a `<button>` or `<a>`; name it (`aria-label`) when the picture is all it shows.",
        ru: "Превью, открывающее объект, — `asChild` на `<button>` или `<a>` с именем (`aria-label`, если на нём только картинка).",
      },
      {
        en: 'A selectable tile is a `<button role="checkbox">` with `aria-checked`, named by `aria-label` or the image `alt`; its indicator is `aria-hidden`, and the state is not only color (the check).',
        ru: 'Выбираемая плитка — `<button role="checkbox">` с `aria-checked`, названная `aria-label` или `alt` изображения; её индикатор — `aria-hidden`, а состояние передаётся не только цветом (галочка).',
      },
      {
        en: "Name a `Thumbnail.Video` with `aria-label`; the play mark is decorative, the duration is text. Under `prefers-reduced-motion` an `autoPlay` clip stands still.",
        ru: "`Thumbnail.Video` назовите `aria-label`; знак воспроизведения декоративен, длительность — текст. При `prefers-reduced-motion` ролик с `autoPlay` стоит на первом кадре.",
      },
    ],
  },
};
