import { api } from "@/components/crossfade/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Blend } from "../icons";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "crossfade",
    label: "Crossfade",
    summary: "Плавная смена состояний области: загрузка, данные, пусто, ошибка",
    keywords: ["переход", "состояние", "загрузка", "смена", "transition", "loading", "state"],
    icon: Blend,
    order: 8,
  },
  dir: "crossfade",
  title: "Crossfade",
  kind: "layout",
  description:
    "Плавная смена состояний области: загрузка → данные → пусто → ошибка. Старое содержимое растворяется, новое проявляется, высота подстраивается без скачка; загрузку показывает Skeleton. Так в ките меняется состояние любой области.",
  examples: [
    {
      slot: "overview",
      description:
        "Блок карточки переходит между загрузкой, данными, пустым состоянием и ошибкой и мягко меняет высоту — `state`.",
    },
    {
      scenario: "record-switch",
      title: "Смена записи",
      description:
        "Панель деталей с ключом по id записи: другой клиент — переход к деталям другой высоты — `state`.",
    },
    {
      scenario: "fill",
      title: "На всю высоту",
      description:
        "Доска сделок занимает высоту панели, пока меняет загрузку на данные, а место для уведомления над ней не занимает места, пока пусто — `fill`, `state`.",
    },
    {
      slot: "screen",
      description:
        "Состояния экрана: заголовок и дата выписки в шапке приложения, ошибка страницы в баннере с повтором, загрузка регионов скелетоном их строк, ошибка таблицы на месте и пустой первый запуск; каждый регион плавно сменяет свои состояния — `state`.",
    },
  ],
  api,
};
