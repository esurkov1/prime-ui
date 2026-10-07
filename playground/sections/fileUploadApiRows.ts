import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";

const divSlotRows = (element: string): PlaygroundApiPropRow[] => [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корня слота.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Вложенная разметка.",
  },
  {
    prop: "…rest",
    type: `React.HTMLAttributes<${element}>`,
    defaultValue: "—",
    required: "Нет",
    description: "Стандартные атрибуты DOM-элемента.",
  },
];

export const fileUploadRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус: поля и радиус зоны, круг иконки и кнопка «Browse» высотой контрола, кегль заголовка и Hint.",
  },
  {
    prop: "variant",
    type: '"dashed" | "solid"',
    defaultValue: '"dashed"',
    required: "Нет",
    description:
      "dashed — заливка поля и пунктир border-default; solid — только заливка (встраивание в карточки и модалки).",
  },
  {
    prop: "inputRef",
    type: "React.Ref<HTMLInputElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Ссылка на скрытый input: программный вызов выбора файла.",
  },
  {
    prop: "accept",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибут accept нативного input.",
  },
  {
    prop: "multiple",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Разрешить выбор нескольких файлов.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Блокирует клик по зоне и drag-and-drop; disabled на input, data-disabled на зоне.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Ошибка (например, отклонённый файл): линия danger-border, aria-invalid на input.",
  },
  {
    prop: "name",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Имя скрытого input внутри формы.",
  },
  {
    prop: "labels",
    type: "Partial<FileUploadLabels>",
    defaultValue:
      '{ title: "Выберите файл или перетащите его сюда", hint: "JPEG, PNG, PDF, MP4 до 50 МБ", browse: "Выбрать файл" }',
    required: "Нет",
    description: "Тексты встроенного тела зоны (без children); пустой hint скрывает подсказку.",
  },
  {
    prop: "onFilesChange",
    type: "(files: File[]) => void",
    defaultValue: "—",
    required: "Нет",
    description:
      "После выбора или drop; значение input сбрасывается для повторного выбора того же файла.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Своё тело зоны (обычно DropBody с Icon, Title, Hint, BrowseLabel). Без children — встроенные тексты из labels и иконка загрузки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс для label-корня.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description:
      "id, aria-*, data-* и прочие атрибуты label. onDragOver, onDragLeave и onDrop заняты зоной.",
  },
];

export const fileUploadIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки иконки.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно компонент Icon.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Корень с aria-hidden; остальные атрибуты span.",
  },
];

export const fileUploadTitleApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "tone",
    type: '"default" | "muted"',
    defaultValue: '"default"',
    required: "Нет",
    description: "Основной или приглушённый цвет текста.",
  },
  ...divSlotRows("HTMLParagraphElement"),
];

export const fileUploadHintApiRows: PlaygroundApiPropRow[] = [
  ...divSlotRows("HTMLParagraphElement").map((row) =>
    row.prop === "…rest"
      ? {
          ...row,
          description:
            "Прокидывается в Hint.Root; размер подставляется из ControlSizeProvider корня зоны.",
        }
      : row,
  ),
];

export const fileUploadBrowseLabelApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLSpanElement");

export const fileUploadBrowseLinkApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки; клик останавливает всплытие к label.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс.",
  },
  {
    prop: "onClick",
    type: "React.MouseEventHandler<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Часто вызывает inputRef.current.click() для открытия диалога.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст ссылки «browse».",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты кнопки.",
  },
];

export const fileUploadDropBodyApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");
export const fileUploadActionsRowApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");

export const fileUploadChipApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки; клик не открывает файловый диалог через label.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс чипа.",
  },
  {
    prop: "onClick",
    type: "React.MouseEventHandler<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Обработчик источника импорта.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка и ChipLabel.",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты кнопки.",
  },
];

export const fileUploadChipLabelApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLSpanElement");

export const fileUploadFormatBadgeApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "format",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Подпись расширения; в UI обрезается и приводится к верхнему регистру.",
  },
  {
    prop: "color",
    type: "PaletteColor",
    defaultValue: '"gray"',
    required: "Нет",
    description:
      "Цвет палитры: текст --prime-color-palette-<hue>-text на полупрозрачной подложке того же оттенка; gray — fill-strong.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс.",
  },
];

export const fileUploadItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Ошибка загрузки: заливка danger-soft, внутреннее кольцо danger-border и мета цвета danger-text.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Отступы, кегль имени и меты, бейдж формата высотой контрола яруса.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты контейнера карточки.",
  },
];

export const fileUploadItemRowApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");
export const fileUploadItemMainApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");
export const fileUploadItemStackApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");
export const fileUploadItemTextGroupApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");

export const fileUploadItemTryAgainApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки повторной попытки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись кнопки.",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты кнопки.",
  },
];

export const fileUploadItemNameApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");
export const fileUploadItemMetaApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");

export const fileUploadItemMetaSepApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс разделителя «·».",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Не отображается — компонент всегда рендерит среднюю точку.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты span; aria-hidden стоит по умолчанию.",
  },
];

export const fileUploadItemActionsApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");
export const fileUploadItemFooterApiRows: PlaygroundApiPropRow[] = divSlotRows("HTMLDivElement");

export const fileUploadItemProgressApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "number",
    defaultValue: "—",
    required: "Нет",
    description: "Значение для встроенного ProgressBar.Root.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "—",
    required: "Нет",
    description: "Максимум для ProgressBar.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки прогресса.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Кастомный индикатор вместо ProgressBar при передаче.",
  },
];
