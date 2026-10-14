import { api } from "@/components/badge/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Award } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "badge",
    label: "Badge",
    summary: "Бейдж и тег: статус, счётчик, удаляемое значение, переключатель",
    keywords: [
      "бейдж",
      "метка",
      "счётчик",
      "тег",
      "чип",
      "chip",
      "tag",
      "фильтр",
      "onRemove",
      "onPress",
      "color",
      "variant",
    ],
    icon: Award,
    order: 1,
  },
  dir: "badge",
  title: "Badge",
  kind: "primitive",
  description:
    "Единственный чип кита: статус, категория или счётчик, снимаемое значение и нажимаемый переключатель с действием при наведении — в цвете палитры.",
  examples: [
    {
      slot: "overview",
      description: "Статусы публикации: смысл несёт текст, оттенок его повторяет — `color`.",
    },
    {
      slot: "variants",
      description:
        "Все оттенки палитры во всех подачах; текст читается без цвета — `variant`, `color`.",
    },
    { slot: "sizes", description: "Все ярусы бейджа, высота от 16 до 32 px — `size`." },
    {
      slot: "states",
      description:
        "Неактивный бейдж, переключатель выключен и включён, снимаемый и ждущий запроса — `disabled`, `onPress`, `pressed`, `onRemove`, `loading`.",
    },
    {
      slot: "with-icon",
      description:
        "Точка в начале, иконка в начале или в конце и квадрат-иконка с именем — `Badge.Dot`, `Badge.Icon`, `aria-label`.",
    },
    {
      scenario: "in-controls",
      title: "Внутри контрола",
      description: "В кнопке и поле бейдж без `size` берёт ярус на ступень ниже.",
    },
    {
      scenario: "applied-filters",
      title: "Применённые фильтры",
      description:
        "Каждый бейдж снимает свой фильтр и называет его для скринридеров — `onRemove`, `labels`.",
    },
    {
      scenario: "server-tags",
      title: "Удаление на сервере",
      description:
        "Теги заказа снимаются на сервере: бейдж ждёт приглушённым со спиннером, уходит, когда сервер согласился, и остаётся с объявлением, когда отказал — `onRemove`, `labels`.",
    },
    {
      scenario: "filter-values",
      title: "Значения фильтра",
      description:
        "Значения как переключатели с действием «скрыть», которое выезжает без изменения ширины — `onPress`, `pressed`, `Badge.Action`, `persistent`.",
    },
  ],
  api,
};
