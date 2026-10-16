import { api } from "@/components/scroll-container/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { ScrollText } from "../icons";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "scroll-container",
    label: "Scroll Container",
    summary: "Область прокрутки с мягкими краями и тонким скроллбаром",
    keywords: ["прокрутка", "скролл", "scroll", "axis", "затухание", "тень", "snap"],
    icon: ScrollText,
    order: 6,
  },
  dir: "scroll-container",
  title: "ScrollContainer",
  kind: "layout",
  description:
    "Единственная область прокрутки кита: тонкий скроллбар, мягкие края там, где скрыто содержимое, правильное сжатие внутри flex и grid — лента, тело панели, полоса фильтров.",
  examples: [
    {
      slot: "overview",
      description:
        "Лента, которая прокручивается сама внутри карточки фиксированной высоты, с тонким скроллбаром кита — `ScrollContainer`.",
    },
    {
      slot: "variants",
      description:
        "Полоса с прокруткой вбок и широкое расписание с прокруткой в обе стороны — `axis`.",
    },
    {
      scenario: "edges",
      title: "Края",
      description:
        "Скрытые края затухают поверх любого фона, ложатся мягкой тенью на залитой поверхности или остаются обычными — `edges`.",
    },
    {
      scenario: "scrollbar",
      title: "Скроллбар",
      description:
        "Тихая тонкая полоса у списка и никакой у полосы фильтров, где переполнение показывают затухающие края — `scrollbar`.",
    },
    {
      scenario: "snap",
      title: "Остановка на карточке",
      description:
        "Полоса карточек складов всегда останавливается на начале карточки, прокручивается касанием, трекпадом и колесом мыши — `snap`, `axis`.",
    },
    {
      scenario: "lock",
      title: "Блокировка",
      description:
        "Пока заказ открыт на проверку, очередь за ним стоит на месте: её не сдвинуть ни колесом, ни касанием, ни клавишами, ни перетаскиванием — `lock`.",
    },
    {
      scenario: "auto-scroll",
      title: "Автопрокрутка",
      description:
        "Задача, которую тянут к верхнему или нижнему краю прокручиваемого списка, прокручивает его — тем быстрее, чем ближе к краю — `ScrollContainer`, `Dnd.Sortable`.",
    },
    {
      scenario: "overscroll",
      title: "Передача прокрутки",
      description:
        "Панель, которая держит прокрутку: в конце списка страница за ней стоит на месте — `overscrollBehavior`.",
    },
    {
      scenario: "log",
      title: "Лента, прижатая к концу",
      description:
        "Живой журнал обмена держится у последней записи: новая оставляет его в конце, прокрутка вверх подгружает старые, не сдвигая видимое — `anchor`, `onReachStart`.",
    },
    {
      scenario: "load-more",
      title: "Подгрузка в конце",
      description:
        "Журнал заказов подгружает следующую порцию, когда прокрутка подходит к концу, а на месте строк пока стоят линии загрузки — `onReachEnd`.",
    },
  ],
  api,
};
