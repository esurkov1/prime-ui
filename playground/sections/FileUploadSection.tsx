import { api } from "@/components/file-upload/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "file-upload",
  title: "FileUpload",
  kind: "composite",
  description:
    "Зона выбора и перетаскивания файлов с подписью, подсказкой и ошибкой поля и строки выбранных файлов: размер, загрузка, удаление, повтор.",
  examples: [
    {
      slot: "overview",
      description:
        "Вложения к заявке: зона с подписью и выбранные файлы строками с кнопкой удаления — `label`, `hint`, `multiple`, `onFilesChange`, `FileUpload.Item`.",
    },
    {
      slot: "variants",
      description:
        "Пунктирная зона рядом с зоной только на заливке — для карточек и модалок — `variant`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы зоны и строки файла: отступы, иконка, кнопка и текст берут ярус — `size`.",
    },
    {
      slot: "structure",
      description:
        "Своё содержимое: приглушённый заголовок со ссылкой выбора и кнопки источников вместо встроенного — `FileUpload.Body`, `FileUpload.Title`.",
    },
    {
      scenario: "upload-progress",
      title: "Загрузка файлов",
      description:
        "Строки файлов при загрузке, после неё и с ошибкой и повтором — `FileUpload.ItemProgress`, `invalid`, `FileUpload.ItemActions`.",
    },
    {
      scenario: "avatar-upload",
      title: "Фото профиля",
      description:
        "Круглая зона вокруг Avatar принимает изображения и показывает превью; кнопки открывают тот же input — `inputRef`, `accept`, `className`.",
    },
    {
      slot: "states",
      description: "Обычная зона рядом с неактивной и с ошибкой под ней — `disabled`, `error`.",
    },
    {
      slot: "narrow",
      description:
        "В колонке шириной с телефон текст зоны переносится, а длинное имя файла обрезается.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action: "Фокус на скрытый input файла (у зоны появляется кольцо), затем на кнопки строк.",
      },
      { keys: "Enter · Space", action: "Открывает системный выбор файлов." },
    ],
    aria: [
      'Зона — `<label>` вокруг визуально скрытого, но фокусируемого `<input type="file">`. С `label` input назван подписью (`aria-labelledby`) и описан подсказкой или ошибкой; без неё имя даёт текст зоны.',
      "`FileUpload.Icon` и `FormatBadge` скрыты (`aria-hidden`): смысл несут имя и описание файла.",
      "Кнопкам-иконкам в `ItemActions` нужен `aria-label` с именем файла.",
    ],
  },
};

export default function FileUploadSection() {
  return <ComponentPage page={page} />;
}
