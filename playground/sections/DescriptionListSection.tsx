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
        "Необязательные части пары: Badge или ссылка в значении, действие строки — ссылка и пустое значение со своей меткой — `DescriptionList.ItemAction`, `asChild`, `labels`.",
    },
    {
      scenario: "vertical",
      title: "Подписи сверху",
      description:
        "Подписи над значениями при любой ширине — для боковой панели записи — `orientation`.",
    },
    {
      scenario: "totals",
      title: "Итоги",
      description:
        "Итоги счёта: каждая сумма в конце строки табличными цифрами, сумма к оплате на шаг крупнее — `align`.",
    },
    {
      slot: "narrow",
      description:
        "В карточке 320 px список уже 24rem: подпись встаёт над значением, длинные значения переносятся — `DescriptionList.Item`, `label`.",
    },
    {
      slot: "screen",
      description:
        "Вложенная запись: путь, заголовок со статусом и сроком и действия со счётом по весу в шапке приложения, позиции с итогами в основной колонке, сведения о клиенте и история — в боковой — `align`, `orientation`.",
    },
  ],
  api,
};
