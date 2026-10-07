import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "FileUpload.Root",
      en: "`forwardRef` → `HTMLLabelElement` (the drop zone). The field frame (label → zone → hint | error) around a `<label>` drop zone with a visually hidden file input; native label props go to the zone.",
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
          default: '"m"',
          en: "Tier of the zone padding, icon, title, button, label and hint.",
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
          name: "className",
          type: "string",
          en: "Class on the drop zone `<label>` (e.g. a round avatar zone).",
          ru: "Класс на зоне-`<label>` (например, круглая зона аватара).",
        },
      ],
    },
    {
      name: "FileUpload.Body",
      en: "No ref. A centered column for a custom zone body; it takes no pointer events (no drag flicker), nested buttons and links opt back in. Native `<div>` props.",
      props: [],
    },
    {
      name: "FileUpload.Icon",
      en: "No ref. A round tinted icon slot (`aria-hidden`) that turns accent on drag-over and danger when invalid. Native `<span>` props.",
      props: [],
    },
    {
      name: "FileUpload.Title",
      en: "No ref. The zone title `<p>`. Native `<p>` props.",
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
      en: "No ref. The secondary zone line (formats, size limit), the kit Hint of the zone tier. Native `<p>` props.",
      props: [],
    },
    {
      name: "FileUpload.Item",
      en: "No ref. A file row: format badge · name over description · actions, then the progress bar; children are placed by their part. Native `<div>` props.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of the padding, text and the format badge.",
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
      en: "No ref. The file format as a square kit Badge of the row tier (`aria-hidden`: the name carries the extension).",
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
          name: "className",
          type: "string",
          en: "Class on the badge.",
          ru: "Класс на бейдже.",
        },
      ],
    },
    {
      name: "FileUpload.ItemName · FileUpload.ItemDescription · FileUpload.ItemActions",
      en: "No ref. The file name (one line, truncated), its description (size, progress, error; danger in an invalid row) and the buttons at the end of the row. Native `<div>` props.",
      props: [],
    },
    {
      name: "FileUpload.ItemProgress",
      en: "No ref. Upload progress across the row: the kit ProgressBar.",
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
          name: "className",
          type: "string",
          en: "Class on the wrapper.",
          ru: "Класс на обёртке.",
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
