import { Blend } from "lucide-react";
import { api } from "@/components/crossfade/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "feedback",
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
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Обычный `<div>`: передайте `aria-busy` на время загрузки и `aria-live` или `role`, если смену нужно озвучить.",
      "Уходящий слой — `aria-hidden` и `inert`: скринридер и Tab не попадают в исчезающее содержимое.",
      "Если фокус был в старом состоянии (кнопка «Повторить» у ошибки), переведите его сами.",
    ],
  },
};
