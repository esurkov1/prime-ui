import { api } from "@/components/description-list/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { LayoutList } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "description-list",
    label: "Description List",
    summary: "Свойства записи: подпись — значение",
    keywords: ["свойства", "реквизиты", "подпись", "значение", "dl", "детали", "карточка записи"],
    icon: LayoutList,
    order: 12,
  },
  dir: "description-list",
  title: "DescriptionList",
  kind: "composite",
  description:
    "Свойства записи только для чтения: пары «подпись — значение» на `<dl>`, которые сами встают столбиком в узком месте; пустое значение — приглушённый прочерк.",
  examples: [
    {
      slot: "overview",
      description:
        "Реквизиты клиента в карточке: подписи рядом со значениями, длинный адрес переносится, менеджер не указан, ИНН можно скопировать — `DescriptionList.Item`, `label`, `DescriptionList.ItemAction`.",
    },
    {
      slot: "sizes",
      description: "Каждый ярус меняет шрифт подписи и значения и зазор между парами — `size`.",
    },
    {
      slot: "structure",
      description:
        "Необязательные части пары: Badge или ссылка в значении, действие строки и пустое значение со своей меткой — `DescriptionList.ItemAction`, `labels`.",
    },
    {
      scenario: "vertical",
      title: "Подписи сверху",
      description:
        "Подписи над значениями при любой ширине — для боковой панели записи — `orientation`.",
    },
    {
      slot: "narrow",
      description:
        "В карточке 320 px список уже 24rem: подпись встаёт над значением, длинные значения переносятся.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action:
          "Переходит к действиям строк (`DescriptionList.ItemAction`); сами пары не в порядке фокуса.",
      },
      { keys: "Enter · Space", action: "Выполняет действие строки." },
    ],
    aria: [
      "Список — `<dl>`: подпись — `<dt>`, значение — `<dd>`; скринридеры читают пары как термин и определение.",
      "Пустое значение показывает приглушённый `labels.empty` (скрыт от скринридеров) и читается как `labels.emptyText`.",
      "У действия строки имя и подсказка из `label`; иконка декоративна.",
    ],
  },
};
