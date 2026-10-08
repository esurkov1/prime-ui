import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "FileUpload.Root",
      en: "`ref` → `HTMLDivElement` (the field frame). The field frame (label → zone → hint | error) around a `<label>` drop zone with a visually hidden file input. Field-root rule: `className`, `ref` and the rest go to the frame; `id` and `aria-label` to the file input.",
      ru: "Рамка поля (подпись → зона → подсказка или ошибка) вокруг зоны-`<label>` со скрытым input файла.",
      props: [
        {
          name: "variant",
          type: '"dashed" | "solid"',
          default: '"dashed"',
          en: "`dashed` shows the drop line; `solid` keeps only the fill (cards, modals).",
          ru: "`dashed` — пунктир; `solid` — только заливка (карточки, модалки).",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Tier of the zone padding, icon, title, button, label and hint. Without it the tier of its host (a form, a panel), else `m`.",
          ru: "Ярус отступов, иконки, заголовка, кнопки, подписи и подсказки.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Field label above the zone; names the file input.",
          ru: "Подпись над зоной; называет input файла.",
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
          en: "Help text under the zone. Hidden while `error` is shown.",
          ru: "Подсказка под зоной; скрывается при `error`.",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Error message under the zone (a rejected file); implies `invalid`.",
          ru: "Ошибка под зоной (файл не подошёл); включает `invalid`.",
        },
        {
          name: "invalid",
          type: "boolean",
          en: "Danger line and icon, `aria-invalid` on the input. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красная линия и иконка, `aria-invalid`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Blocks picking and drag-and-drop.",
          ru: "Блокирует выбор и перетаскивание.",
        },
        {
          name: "accept",
          type: "string",
          en: "Native `accept` of the file input.",
          ru: "Нативный `accept` input файла.",
        },
        {
          name: "multiple",
          type: "boolean",
          en: "Allows several files at once.",
          ru: "Разрешает несколько файлов.",
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
          en: "Called with the picked or dropped files; the input is reset, so the same file can be picked again.",
          ru: "Выбранные или брошенные файлы; input сбрасывается, тот же файл можно выбрать снова.",
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
          en: "Id of the file input; hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Id input файла; иначе генерируется.",
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
          en: "Custom body (`FileUpload.Body`); replaces the built-in icon, title, description and button.",
          ru: "Своё содержимое (`FileUpload.Body`) вместо встроенного.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Name of the file input when there is no `label`.",
          ru: "Имя input файла, когда нет `label`.",
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
      en: "`ref` → `HTMLDivElement`. A centered column for a custom zone body; nested buttons and links stay interactive (drag-over follows enter / leave depth, so crossing children never flickers it). Native `<div>` props.",
      props: [],
    },
    {
      name: "FileUpload.Icon",
      en: "`ref` → `HTMLSpanElement`. A round tinted icon slot (`aria-hidden`) that turns accent on drag-over and danger when invalid. Native `<span>` props.",
      props: [],
    },
    {
      name: "FileUpload.Title",
      en: "`ref` → `HTMLParagraphElement`. The zone title `<p>`. Native `<p>` props.",
      props: [
        {
          name: "tone",
          type: '"default" | "muted"',
          default: '"default"',
          en: "`muted` — secondary color, regular weight (an instruction line in custom bodies).",
          ru: "`muted` — вторичный цвет, обычное начертание.",
        },
      ],
    },
    {
      name: "FileUpload.Description",
      en: "`ref` → `HTMLParagraphElement`. The secondary zone line (formats, size limit), the kit Hint of the zone tier. Native `<p>` props.",
      props: [],
    },
    {
      name: "FileUpload.Item",
      en: "`ref` → `HTMLDivElement`. A file row: format badge · name over description · actions, then the progress bar; children are placed by their part. Native `<div>` props.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Tier of the padding, text and the format badge. Without it the tier of its host, else `m`.",
          ru: "Ярус отступов, текста и бейджа формата.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "A failed upload: danger wash and ring, danger description.",
          ru: "Неудачная загрузка: красная подложка и кольцо, красное описание.",
        },
      ],
    },
    {
      name: "FileUpload.FormatBadge",
      en: "`ref` → `HTMLSpanElement`. The file format as a square kit Badge of the row tier (`aria-hidden`: the name carries the extension).",
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
      name: "FileUpload.ItemName · FileUpload.ItemDescription · FileUpload.ItemActions",
      en: "`ref` → `HTMLDivElement`. The file name (one line, truncated), its description (size, progress, error; danger in an invalid row) and the buttons at the end of the row. Native `<div>` props.",
      props: [],
    },
    {
      name: "FileUpload.ItemProgress",
      en: "`ref` → `HTMLDivElement` (the wrapper). Upload progress across the row: the kit ProgressBar.",
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
          name: "aria-label",
          type: "string",
          default: "«Загрузка файла»",
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
  labels: [
    {
      key: "title",
      default: "Выберите файл или перетащите его сюда",
      en: "Title of the built-in zone body.",
      ru: "Заголовок встроенной зоны.",
    },
    {
      key: "description",
      default: "JPEG, PNG, PDF, MP4 до 50 МБ",
      en: "Description of the built-in body; an empty string hides it.",
      ru: "Описание встроенной зоны; пустая строка скрывает его.",
    },
    {
      key: "browse",
      default: "Выбрать файл",
      en: "Text of the decorative browse button of the built-in body.",
      ru: "Текст декоративной кнопки выбора.",
    },
    {
      key: "optional",
      default: "необязательно",
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
  ],
};
