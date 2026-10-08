import { api } from "@/components/card/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "card",
  title: "Card",
  kind: "composite",
  description:
    "Ограниченный блок на своей заливке с шаблонами для метрик, графиков, списков, призывов к действию и обложек. Разделы страницы — PageContent, а не карточки.",
  examples: [
    {
      slot: "overview",
      description:
        "Панель настроек компании: шапка, поля на заливке поверхности и кнопки в подвале — `Card.Header`, `Card.Body`, `Card.Footer`.",
    },
    {
      slot: "variants",
      description:
        "Шаблоны KPI: плашка с иконкой и значением, бейдж со значением в строке шапки и крупное значение с изменением — `variant`, `Card.Delta`.",
    },
    {
      scenario: "kpi-media",
      title: "Метрика с графиком",
      description: "KPI со спарклайном или уровнем заполнения в нижнем слоте `mini` — `Card.Media`.",
    },
    {
      scenario: "panel-chart",
      title: "Виджет с графиком",
      description:
        "Шапка с переключателем периода, строка итога и график от края до края — `Card.Header`, `Card.Media`.",
    },
    {
      scenario: "content-templates",
      title: "Контентные шаблоны",
      description:
        "Призыв к действию, список событий и плитка кампании с обложкой — `Card.Footer`, `Card.List`, `Card.Media`.",
    },
    {
      scenario: "flat",
      title: "Без тени",
      description: "Плоская плитка без тени рядом с обычной — для плотных сеток — `flat`.",
    },
    {
      slot: "narrow",
      description:
        "Карточка — контейнер размера: split складывает ячейки уже 22rem, а значение тренда уменьшается уже 20rem.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      '`Card.Root` — обычный `<div>`; `role="region"` и `aria-labelledby` задавайте, только если блок заслуживает ориентира.',
      '`Card.Title` — `<h3>`; прямо под заголовком страницы передайте `as="h2"`, чтобы не пропустить уровень.',
      "Декоративные иконки в `Card.Icon` и обложки в `Card.Media` — `aria-hidden`; контролам в `Card.Header` нужны свои имена.",
    ],
  },
};

export default function CardSection() {
  return <ComponentPage page={page} />;
}
