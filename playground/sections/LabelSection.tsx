import { api } from "@/components/label/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "label",
  title: "Label",
  kind: "primitive",
  description:
    "Название поля — нативный `<label>` с пометками обязательного и необязательного. Поля с пропом `label` рисуют его сами; отдельный Label нужен над контролами без него.",
  examples: [
    {
      slot: "overview",
      description:
        "Отдельная подпись над контролом без своего `label`, связанная через `aria-labelledby`.",
    },
    { slot: "sizes", description: "Все размеры; подпись берёт размер поля под ней — `size`." },
    {
      slot: "states",
      description:
        "Обычная подпись рядом с неактивной; пометки тускнеют вместе с текстом — `disabled`.",
    },
    {
      slot: "with-icon",
      description: "Приглушённая иконка перед текстом в размере подписи — `Label.Icon`.",
    },
    {
      slot: "structure",
      description:
        "Звёздочка обязательного поля, пометка необязательного и уточнение в строке — `required`, `optional`, `Label.Description`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Свяжите подпись с нативным контролом через `htmlFor`, с кастомным — через `id` и `aria-labelledby` на контроле.",
      "`*` скрыта (`aria-hidden`): обязательность сообщает сам контрол (`required`).",
      "Пометка «необязательно» и `Label.Description` — видимый текст и входят в имя поля; `Label.Icon` скрыт.",
    ],
  },
};

export default function LabelSection() {
  return <ComponentPage page={page} />;
}
