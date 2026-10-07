import { api } from "@/components/crossfade/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "crossfade",
  title: "Crossfade",
  kind: "layout",
  description:
    "Плавная смена состояний области: загрузка → данные → пусто → ошибка. Старое содержимое растворяется, новое проявляется, высота подстраивается без скачка.",
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

export default function CrossfadeSection() {
  return <ComponentPage page={page} />;
}
