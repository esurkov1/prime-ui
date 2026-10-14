import { type ApiProp, type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import {
  UPLOAD_QUEUE_OPTIONS_TYPE,
  USE_UPLOAD_QUEUE_FUNCTION,
} from "../../hooks/useUploadQueue.api";
import { FILE_UPLOAD_LABELS } from "./FileUpload";

const FILE_TYPE = "readonly FileUploadFile[]";

/** The set of files: the same props on `FileUpload.Root` and `FileUpload.Queue`. */
const SET_PROPS: ApiProp[] = [
  {
    name: "value",
    type: FILE_TYPE,
    en: "Files in their order (controlled): `{ id, name, size?, type?, src?, alt?, href? }` — on the server or uploads of `queue` by id. `src`: picture or video; `alt` spoken for the name; `href` links name or tile to the file.",
    ru: "Файлы по порядку (управляемое): `{ id, name, size?, type?, src?, alt?, href? }` — на сервере или загрузки `queue` по id. `src` — картинка или видео; `alt` — вместо имени; `href` — имя или плитка ведут к файлу.",
  },
  {
    name: "defaultValue",
    type: FILE_TYPE,
    default: "[]",
    en: "Initial files (uncontrolled).",
    ru: "Начальные файлы (неуправляемое).",
  },
  {
    name: "onValueChange",
    type: `(value: ${FILE_TYPE}) => void | Promise<void>`,
    en: "The set changed (a reorder, a removal, files added to `queue`), with the whole new list. Return the save's promise: the touched files wait busy, a rejection puts the set back and is announced.",
    ru: "Набор изменился (перестановка, удаление, файлы в `queue`), с полным новым списком. Верните промис сохранения: затронутые файлы ждут занятыми, отказ возвращает набор и объявляется.",
  },
  {
    name: "queue",
    type: 'Pick<UploadQueue, "items" | "retry" | "remove"> & Partial<Pick<UploadQueue, "add" | "move">>',
    en: "The uploads: `useUploadQueue(…)` or an object of that shape. Each file on its way shows its upload; removing a file aborts it. With `add`, picked and dropped files go into the queue.",
    ru: "Загрузки: `useUploadQueue(…)` или объект такой формы. Каждый файл в пути показывает свою загрузку; удаление файла прерывает её. С `add` выбранные и брошенные файлы уходят в очередь.",
  },
  {
    name: "layout",
    type: '"list" | "grid" | "strip"',
    default: '"list"',
    en: "`list`: a row per file. `grid`: square tiles that wrap to the set's width and reorder. `strip`: one sideways-scrolling row of tiles (an attachment tray).",
    ru: "`list`: строка на файл. `grid`: квадратные плитки по ширине набора с перестановкой. `strip`: одна строка плиток с прокруткой вбок (лоток вложений).",
  },
  {
    name: "cover",
    type: "boolean",
    default: "false",
    en: "Tiles only: the first file is the cover («Обложка», 2 × 2 in a `grid`). Reordering a file to the first place makes it the cover.",
    ru: "Только плитки: первый файл — обложка («Обложка», 2 × 2 в `grid`). Перестановка файла на первое место делает его обложкой.",
  },
  {
    name: "formatSize",
    type: "(bytes: number) => string",
    defaultNote: { en: "Russian digits, Б · КБ · МБ · ГБ", ru: "русские цифры, Б · КБ · МБ · ГБ" },
    en: "Display of a file size («820 КБ», «1,2 МБ»).",
    ru: "Показ размера файла («820 КБ», «1,2 МБ»).",
  },
];

export const api: ComponentApi = {
  parts: [
    {
      name: "FileUpload.Root",
      en: "`ref` → `HTMLDivElement` (the field frame). The field: label → trigger (a drop zone, a picker button or an add tile) → the files of `value` and `queue` as rows or tiles → hint | error. `className` and native attributes go to the frame, `id` to the file input.",
      ru: "Поле: подпись → способ добавления (зона, кнопка выбора или плитка добавления) → файлы `value` и `queue` строками или плитками → подсказка или ошибка. `className` и нативные атрибуты — на рамку, `id` — на input файла.",
      props: [
        {
          name: "trigger",
          type: '"dropzone" | "button" | "tile"',
          default: '"dropzone"',
          en: "`dropzone`: the drop area. `button`: a compact picker button, no zone and no drop (a composer paperclip). `tile`: an add tile as the last cell of the files.",
          ru: "`dropzone`: зона перетаскивания. `button`: компактная кнопка выбора без зоны и сброса (скрепка в поле сообщения). `tile`: плитка добавления последней ячейкой файлов.",
        },
        {
          name: "variant",
          type: '"dashed" | "solid"',
          default: '"dashed"',
          en: "The look of the drop zone: `dashed` shows the drop line; `solid` keeps only the fill (cards, modals).",
          ru: "Вид зоны: `dashed` — пунктир; `solid` — только заливка (карточки, модалки).",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the zone padding, icon, title, button, label, hint and the rows. Without it the tier of its host (a form, a panel), else `m`. Tiles keep their own size.",
          ru: "Ярус отступов зоны, иконки, заголовка, кнопки, подписи, подсказки и строк. Без него — ярус хоста (форма, панель), иначе `m`. Плитки держат свой размер.",
        },
        ...SET_PROPS,
        {
          name: "label",
          type: "ReactNode",
          en: "Field label above the trigger; names the file input and the list of files.",
          ru: "Подпись над полем; называет input файла и список файлов.",
        },
        {
          name: "required",
          type: "boolean",
          en: "Red `*` after the label and native `required` on the input.",
          ru: "Красная `*` после подписи и нативный `required`.",
        },
        {
          name: "optional",
          type: "boolean",
          en: "Muted marker right after the label text (`labels.optional`).",
          ru: "Приглушённая пометка после подписи (`labels.optional`).",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the field. Hidden while `error` is shown.",
          ru: "Подсказка под полем; скрывается при `error`.",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Error message under the field (a rejected file, too few files); implies `invalid`.",
          ru: "Ошибка под полем (файл не подошёл, файлов мало); включает `invalid`.",
        },
        {
          name: "invalid",
          type: "boolean",
          en: "Danger line and icon of the zone, `aria-invalid` on the input. A non-empty `error` implies it.",
          ru: "Красная линия и иконка зоны, `aria-invalid` на input. Непустой `error` включает его.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Blocks picking and drag-and-drop; the files are read-only: no add tile, no reorder, no remove.",
          ru: "Блокирует выбор и перетаскивание; файлы только для чтения: без плитки добавления, перестановки и удаления.",
        },
        {
          name: "accept",
          type: "string",
          en: "Native `accept` of the file input; dropped files outside it are not taken (MIME type, `type/*` or `.ext`; a file with no MIME type by its extension).",
          ru: "Нативный `accept` input файла; брошенные файлы вне него не берутся (MIME-тип, `type/*` или `.ext`; файл без MIME-типа — по расширению).",
        },
        {
          name: "multiple",
          type: "boolean",
          en: "Allows several files at once in the picker.",
          ru: "Разрешает несколько файлов в окне выбора.",
        },
        {
          name: "max",
          type: "number",
          en: "Most files in the set: picked and dropped files are cut to the room left; the add tile counts `count из max` (the digits roll) and at the limit says «Лимит файлов» and takes nothing.",
          ru: "Наибольшее число файлов: выбранные и брошенные файлы урезаются до оставшегося места; плитка добавления считает `count из max` (цифры прокручиваются), на пределе пишет «Лимит файлов» и ничего не принимает.",
        },
        {
          name: "name",
          type: "string",
          en: "Name of the file input inside a form.",
          ru: "Имя input файла в форме.",
        },
        {
          name: "onFilesChange",
          type: "(files: File[]) => void",
          en: "Called with the picked or dropped files (of `accept`, cut to `max`); the input is reset, so the same file can be picked again. Not called when `queue.add` takes them.",
          ru: "Выбранные или брошенные файлы (из `accept`, не больше `max`); input сбрасывается, тот же файл можно выбрать снова. Не вызывается, когда их берёт `queue.add`.",
        },
        {
          name: "inputRef",
          type: "Ref<HTMLInputElement>",
          en: "The hidden file input, e.g. to open the picker from a button.",
          ru: "Скрытый input файла, например чтобы открыть выбор с кнопки.",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the file input (generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Id input файла (иначе генерируется); id подсказки — `<id>-hint`, ошибки — `<id>-error`.",
        },
        {
          name: "labels",
          type: "Partial<FileUploadLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          en: 'A zone: a custom body (`FileUpload.Body`) instead of the built-in one. `trigger="button"`: the button\'s content, `Button.Icon` and text (default: the paperclip and `labels.browse`).',
          ru: 'Зона: своё содержимое (`FileUpload.Body`) вместо встроенного. `trigger="button"`: содержимое кнопки, `Button.Icon` и текст (по умолчанию скрепка и `labels.browse`).',
        },
        {
          name: "aria-label",
          type: "string",
          en: 'Name of the file input and the list of files when there is no `label`; with `trigger="button"` the name of the button (required for an icon-only one).',
          ru: 'Имя input файла и списка файлов, когда нет `label`; при `trigger="button"` — имя кнопки (обязательно для кнопки-иконки).',
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>`. The zone reads `--file-upload-padding` and `--file-upload-radius` from that class (a round zone around an avatar).",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля. Зона берёт из этого класса `--file-upload-padding` и `--file-upload-radius` (круглая зона аватара).",
        },
      ],
    },
    {
      name: "FileUpload.Body",
      en: "`ref` → `HTMLDivElement`. A centered column for a custom zone body; nested buttons and links stay interactive (drag-over follows enter / leave depth, so crossing children never flickers it).",
      ru: "Колонка по центру для своего содержимого зоны; вложенные кнопки и ссылки остаются интерактивными (перетаскивание учитывает глубину входа и выхода, поэтому дети не дают мерцания).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "FileUpload.Icon",
      en: "`ref` → `HTMLSpanElement`. A round tinted icon slot (`aria-hidden`) that turns accent on drag-over and danger when invalid.",
      ru: "Круглый подкрашенный слот иконки (`aria-hidden`): акцентный при перетаскивании, danger при ошибке.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (the `Icon`), `className` and the other span attributes.",
          ru: "`children` (`Icon`), `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "FileUpload.Title",
      en: "`ref` → `HTMLParagraphElement`. The zone title `<p>`.",
      ru: "Заголовок зоны `<p>`.",
      props: [
        {
          name: "tone",
          type: '"default" | "muted"',
          default: '"default"',
          en: "`muted` — secondary color, regular weight (an instruction line in custom bodies).",
          ru: "`muted` — вторичный цвет, обычное начертание (строка-инструкция в своём содержимом зоны).",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLParagraphElement>",
          en: "`children`, `className` and the other paragraph attributes.",
          ru: "`children`, `className` и остальные атрибуты абзаца.",
        },
      ],
    },
    {
      name: "FileUpload.Description",
      en: "`ref` → `HTMLParagraphElement`. The secondary zone line (formats, size limit), the kit Hint of the zone tier.",
      ru: "Вторая строка зоны (форматы, лимит размера) — Hint кита в ярусе зоны.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLParagraphElement>",
          en: "`children`, `className` and the other paragraph attributes.",
          ru: "`children`, `className` и остальные атрибуты абзаца.",
        },
      ],
    },
    {
      name: "FileUpload.Queue",
      en: "`ref` → `HTMLUListElement`. The files of a set with no picker of its own — a tray whose paperclip lives elsewhere: the same rows or tiles `FileUpload.Root` draws, in a `<ul>` (nothing while empty).",
      ru: "Файлы набора без своего способа добавления — лоток, чья скрепка в другом месте: те же строки или плитки, что рисует `FileUpload.Root`, в `<ul>` (пока пусто — ничего).",
      props: [
        ...SET_PROPS,
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Read-only files: no reorder, no remove.",
          ru: "Файлы только для чтения: без перестановки и удаления.",
        },
        {
          name: "labels",
          type: "Partial<FileUploadLabels>",
          en: "Row and tile strings, see Labels.",
          ru: "Строки рядов и плиток, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLUListElement>, "children" | "defaultValue">',
          en: "`className`, `aria-label` (name the list) and the other attributes of the `<ul>`.",
          ru: "`className`, `aria-label` (имя списка) и остальные атрибуты `<ul>`.",
        },
      ],
    },
    {
      name: "FileUpload.Item",
      en: "`ref` → `HTMLDivElement`. A file row: format badge · name over description · actions, then the progress bar; children are placed by their part.",
      ru: "Строка файла: бейдж формата · имя над описанием · действия, затем полоса прогресса; дети встают по своим частям.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the padding, text and the format badge. Without it the tier of its host, else `m`.",
          ru: "Ярус отступов, текста и бейджа формата. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "A failed upload: danger wash and ring, danger description.",
          ru: "Неудачная загрузка: красная подложка и кольцо, красное описание.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the item parts), `className` and the other div attributes.",
          ru: "`children` (части элемента), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "FileUpload.FormatBadge",
      en: "`ref` → `HTMLSpanElement`. The file format as a square kit Badge of the row tier (`aria-hidden`: the row's name is trimmed of the extension and the accessible name carries it whole).",
      ru: "Формат файла — квадратный Badge кита в ярусе строки (`aria-hidden`: имя в строке без расширения, доступное имя содержит его целиком).",
      props: [
        {
          name: "format",
          type: "string",
          required: true,
          en: "File extension; shown upper-case, cut to 8 characters.",
          ru: "Расширение файла; заглавными, до 8 символов.",
        },
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"gray"',
          en: "Palette hue of the badge.",
          ru: "Цвет палитры бейджа.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color">',
          en: "`className` and the other attributes of the badge.",
          ru: "`className` и остальные атрибуты бейджа.",
        },
      ],
    },
    {
      name: "FileUpload.ItemPreview",
      en: "`ref` → `HTMLDivElement`. An image file's picture in place of the format badge: a square kit Thumbnail of the row tier (`aria-hidden`: the name names the file), the image icon while it loads or if it fails.",
      ru: "Картинка файла-изображения вместо бейджа формата: квадратный Thumbnail яруса строки (`aria-hidden`: файл называет имя), иконка, пока картинка грузится или если не загрузилась.",
      props: [
        {
          name: "src",
          type: "string",
          required: true,
          en: "The picture: a URL, or the local `preview` of a queued file.",
          ru: "Картинка: адрес или локальное `preview` файла из очереди.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children" | "color">',
          en: "`className` and the other attributes of the thumbnail frame.",
          ru: "`className` и остальные атрибуты рамки превью.",
        },
      ],
    },
    {
      name: "FileUpload.ItemName · FileUpload.ItemDescription · FileUpload.ItemActions",
      en: "`ref` → `HTMLDivElement`. The file name (one line, truncated), its description (size, progress, error; danger in an invalid row) and the buttons at the end of the row.",
      ru: "Имя файла (одна строка с обрезкой), его описание (размер, прогресс, ошибка; danger в строке с ошибкой) и кнопки в конце строки.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "FileUpload.ItemProgress",
      en: "`ref` → `HTMLDivElement` (the wrapper). Upload progress across the row: the kit ProgressBar.",
      ru: "Прогресс загрузки поперёк строки: ProgressBar кита.",
      props: [
        {
          name: "value",
          type: "number",
          required: true,
          en: "Uploaded amount.",
          ru: "Загруженная часть.",
        },
        {
          name: "max",
          type: "number",
          en: "Total amount (ProgressBar default).",
          ru: "Полный объём (по умолчанию ProgressBar).",
        },
        {
          name: "tone",
          type: '"accent" | "neutral" | "success" | "warning" | "danger" | "info"',
          default: '"accent"',
          en: "Fill color: `success` for a finished file, `danger` where a failed one stopped.",
          ru: "Цвет заполнения: `success` — файл загружен, `danger` — где остановилась неудачная загрузка.",
        },
        {
          name: "aria-label",
          type: "string",
          default: '"Загрузка файла"',
          en: "Accessible name of the bar (not the wrapper); name the file.",
          ru: "Доступное имя полосы (не обёртки); назовите файл.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the wrapper.",
          ru: "`className` и остальные атрибуты обёртки.",
        },
      ],
    },
  ],
  types: [UPLOAD_QUEUE_OPTIONS_TYPE],
  functions: [USE_UPLOAD_QUEUE_FUNCTION],
  labels: labelRows(FILE_UPLOAD_LABELS, {
    title: { en: "Title of the built-in zone body.", ru: "Заголовок встроенной зоны." },
    description: {
      en: "Description of the built-in body; an empty string hides it.",
      ru: "Описание встроенной зоны; пустая строка скрывает его.",
    },
    browse: {
      en: 'Text of the browse button: decorative in the built-in zone body, the control itself with `trigger="button"`.',
      ru: 'Текст кнопки выбора: декоративной во встроенной зоне, самой кнопки при `trigger="button"`.',
    },
    optional: {
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
    add: {
      en: 'Text of the add tile (`trigger="tile"`).',
      ru: 'Текст плитки добавления (`trigger="tile"`).',
    },
    addLabel: {
      en: "Accessible name of the add tile's file input.",
      ru: "Имя поля выбора файлов в плитке добавления.",
    },
    empty: {
      en: "Text of the add tile of an empty set (it spans the row).",
      ru: "Текст плитки добавления в пустом наборе (она во всю строку).",
    },
    emptyHint: {
      en: "Second line of the empty add tile without `max` (with it the counter stands there).",
      ru: "Вторая строка пустой плитки добавления без `max` (с ним там счётчик).",
    },
    full: {
      en: "Text of the add tile when `max` is reached.",
      ru: "Текст плитки добавления, когда достигнут `max`.",
    },
    count: {
      en: "Counter on the add tile (with `max`).",
      ru: "Счётчик на плитке добавления (при `max`).",
    },
    cover: { en: "Pill of the first tile with `cover`.", ru: "Плашка первой плитки при `cover`." },
    queued: {
      en: "A file waiting for a free slot (a row's status, a tile's name and its empty ring).",
      ru: "Файл ждёт свободного места (статус строки, имя плитки и её пустого кольца).",
    },
    uploading: { en: "A file in flight.", ru: "Файл загружается." },
    failed: { en: "A failed file whose upload gave no reason.", ru: "Загрузка упала без причины." },
    progress: { en: "Name of a row's progress bar.", ru: "Имя полосы прогресса строки." },
    cancel: {
      en: "Name of the disk that cancels a tile's upload in flight.",
      ru: "Имя диска, отменяющего идущую загрузку плитки.",
    },
    retry: {
      en: "Name of the retry button of a failed row (the retry disk of a failed tile).",
      ru: "Имя кнопки повтора у неудачной строки (диска повтора у неудачной плитки).",
    },
    remove: {
      en: "Name of the remove button of a file (it also stops an upload).",
      ru: "Имя кнопки «Убрать» у файла (она же прерывает загрузку).",
    },
    open: {
      en: "Name of a tile's link to the file (`href`); a row's link is named by the file name.",
      ru: "Имя ссылки плитки на файл (`href`); ссылку строки называет имя файла.",
    },
    removed: { en: "Live region: a file was removed.", ru: "Live-область: файл убран." },
    coverChanged: {
      en: "Live region: a reorder put another file first, the new cover (`cover`).",
      ru: "Live-область: перестановка поставила первым другой файл — новую обложку (`cover`).",
    },
    changeFailed: {
      en: "Live region: the `onValueChange` promise of a change rejected and the set is as it was.",
      ru: "Live-область: промис `onValueChange` отклонён, набор вернулся.",
    },
    uploaded: { en: "Live region: a file finished uploading.", ru: "Live-область: файл загружен." },
    uploadFailed: {
      en: "Live region: a file failed to upload; `{reason}` is its error or `failed`.",
      ru: "Live-область: файл не загрузился; `{reason}` — его ошибка или `failed`.",
    },
    tileImage: {
      en: "Name of an image tile; `{name}` is the file's `alt` or name, `{status}` is ` · state` while it uploads.",
      ru: "Имя плитки изображения; `{name}` — `alt` или имя файла, `{status}` — ` · state`, пока файл грузится.",
    },
    tileVideo: {
      en: "Name of a video tile; the tokens of `tileImage`.",
      ru: "Имя плитки видео; токены как у `tileImage`.",
    },
    tileFile: { en: "Name of the tile of any other file.", ru: "Имя плитки любого другого файла." },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses the hidden file input (the zone or the add tile shows the ring), then the files and their buttons.",
        ru: "Фокус на скрытый input файла (у зоны или плитки добавления появляется кольцо), затем на файлы и их кнопки.",
      },
      {
        keys: "Enter · Space",
        en: "Opens the system file dialog (on the zone, the button or the add tile).",
        ru: "Открывает системный выбор файлов (на зоне, кнопке или плитке добавления).",
      },
      {
        keys: "Alt + ← · Alt + →",
        en: 'On a tile (`layout="grid" | "strip"`): moves the file one place; with `cover`, moving it first makes it the cover, and that is announced.',
        ru: 'На плитке (`layout="grid" | "strip"`) сдвигает файл на одно место; при `cover` сдвиг на первое место делает его обложкой, и это объявляется.',
      },
      {
        keys: "Delete · Backspace",
        en: "On a tile: removes the file; focus moves to its neighbour.",
        ru: "На плитке убирает файл; фокус переходит на соседнюю плитку.",
      },
      {
        keys: "Escape",
        en: "Cancels a tile drag in flight.",
        ru: "Отменяет перетаскивание плитки в процессе.",
      },
    ],
    aria: [
      {
        en: 'The zone is a `<label>` around a visually hidden but focusable `<input type="file">`. With `label` the input is named by it (`aria-labelledby`) and described by the hint or error; without it the zone text names the input — give a custom body without text an `aria-label` on Root.',
        ru: 'Зона — `<label>` вокруг визуально скрытого, но фокусируемого `<input type="file">`. С `label` input назван подписью (`aria-labelledby`) и описан подсказкой или ошибкой; без неё имя даёт текст зоны — своему телу без текста дайте `aria-label` на Root.',
      },
      {
        en: '`trigger="button"`: the kit Button takes the focus, named by the field label and its own text (or `aria-label`, required when it is an icon alone) and described by the hint or error; the input leaves the tab order.',
        ru: 'При `trigger="button"` в фокусе кнопка кита: её называют подпись поля и текст (или `aria-label`), описывают подсказка и ошибка; скрытый input вне порядка Tab.',
      },
      {
        en: '`trigger="tile"`: the frame is a group named by the label; the add tile is the label of a hidden input («Добавить файлы») with the hint, the error and `aria-invalid` wired to it.',
        ru: 'При `trigger="tile"` поле — группа, названная подписью; плитка добавления — подпись к скрытому input («Добавить файлы»), с ним связаны подсказка, ошибка и `aria-invalid`.',
      },
      {
        en: "The files are a `<ul>` named by the field label (or `aria-label`). `FileUpload.Icon`, `FormatBadge` and `ItemPreview` are `aria-hidden`: the file name and description carry the meaning.",
        ru: "Список файлов — `<ul>`, названный подписью поля (или `aria-label`); `FileUpload.Icon`, `FormatBadge` и `ItemPreview` скрыты (`aria-hidden`): смысл несут имя и описание файла.",
      },
      {
        en: "Icon-only buttons in `ItemActions` need an `aria-label` with the file name; the set names its own («Убрать …», «Повторить загрузку: …»).",
        ru: "Кнопкам-иконкам в `ItemActions` нужен `aria-label` с именем файла; набор называет свои сам («Убрать …», «Повторить загрузку: …»).",
      },
      {
        en: "A row in flight has its progress bar named by the file; a polite live region speaks a file that finished, the reason of one that failed, a removed file, the new cover after a reorder («Обложка: name», `labels.coverChanged`) and a refused change (`labels.changeFailed`); a file whose change is saved has `aria-busy`.",
        ru: "У строки в пути полоса прогресса, названная именем файла; вежливая live-область объявляет загруженный файл, причину ошибки, убранный файл, новую обложку после перестановки («Обложка: name», `labels.coverChanged`) и отклонённое изменение (`labels.changeFailed`); у файла, изменение которого сохраняется, — `aria-busy`.",
      },
      {
        en: "Tiles are `<li>` of a Dnd.Sortable `<ul>`, named «Фото 2: склад.jpg · Загрузка 45%» («Видео …», «Файл …»; the file's `alt` in place of its name), with `aria-roledescription` and `aria-keyshortcuts`; the position and format on a tile are hidden (the name says them); the disk is a circle button («Отменить загрузку: …» described by the state, «В очереди» / «Загрузка 45%», `aria-busy`, its ring `aria-hidden`; on a failure «Повторить загрузку: …» described by the reason); without a remove handler the disk is no button but a `progressbar` (`aria-valuenow`) while the file is queued or uploading; Dnd's live region announces moves.",
        ru: "Плитки — `<li>` в `<ul>` от Dnd.Sortable с именем «Фото 2: склад.jpg · Загрузка 45%» («Видео …», «Файл …»; `alt` файла вместо имени), с `aria-roledescription` и `aria-keyshortcuts`; номер и формат на плитке скрыты (их говорит имя); диск — круглая кнопка («Отменить загрузку: …» с описанием состояния «В очереди» / «Загрузка 45%», `aria-busy`, кольцо `aria-hidden`; после ошибки — «Повторить загрузку: …» с описанием причины); без обработчика удаления диск не кнопка, а `progressbar` (`aria-valuenow`), пока файл в очереди или грузится; перенос объявляет live-область Dnd.",
      },
      {
        en: 'A file with `href`: in a row its name is a link (`<a target="_blank">`, named by the name); a tile holds a link over its middle named «Открыть name» (`labels.open`), a Tab stop after the tile itself.',
        ru: 'Файл с `href`: в строке его имя — ссылка (`<a target="_blank">` с именем файла); у плитки ссылка поверх середины «Открыть name» (`labels.open`) — остановка Tab после самой плитки.',
      },
      {
        en: "Touch: a tile drag starts after a hold; the buttons on a tile are always shown, never hover-only.",
        ru: "Касание: перенос плитки начинается после удержания; кнопки на плитке видны всегда, без наведения.",
      },
    ],
  },
};
