import { api } from "@/components/fieldset/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Rows3 } from "../icons";

export const page: ComponentPageConfig = {
  category: "inputs",
  nav: {
    segment: "fieldset",
    label: "Fieldset",
    summary: "Группа полей без рамки: заголовок, ритм, общее отключение",
    keywords: [
      "группа полей",
      "fieldset",
      "legend",
      "секция формы",
      "disabled",
      "поля в ряд",
      "два поля",
    ],
    icon: Rows3,
    order: 8,
  },
  dir: "fieldset",
  title: "Fieldset",
  kind: "primitive",
  description:
    "Группа связанных полей формы без рамки: заголовок `title-s` в нативном `<legend>`, поля в ритме формы — в колонку или по два в ряд — и один `disabled` на всю группу, например, пока идёт запрос.",
  examples: [
    {
      slot: "overview",
      description:
        "Поля контактов под заголовком с коротким пояснением, без своей рамки — `label`, `description`.",
    },
    {
      slot: "states",
      description:
        "Обычная группа рядом с выключенной: каждый контрол кита внутри принимает вид неактивного — `disabled`.",
    },
    {
      scenario: "pair",
      title: "Два в ряд",
      description:
        "Реквизиты компании по два в ряд: поле, оставшееся одно в последнем ряду, занимает весь ряд, а в узкой группе поля встают в колонку — `label`, `layout`.",
    },
    {
      slot: "in-form",
      description:
        "Форма клиента из двух групп: пока идёт запрос, все поля внутри выключены разом, а кнопка отправки показывает загрузку — `label`, `disabled`.",
    },
  ],
  api,
};
