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
        "Панель настроек компании: шапка раздела, поля на заливке поверхности и действия в конце — `Card.SectionHeader`, `Card.Body`, `Card.Actions`.",
    },
    {
      slot: "variants",
      description:
        "Шаблоны KPI: плашка с иконкой и значением, бейдж со значением и крупное значение с изменением — `variant`, `Card.Delta`.",
    },
    {
      scenario: "mini-media",
      title: "Метрика с графиком",
      description: "KPI со спарклайном или уровнем заполнения в нижнем слоте — `Card.Media`.",
    },
    {
      scenario: "panel-chart",
      title: "Виджет с графиком",
      description:
        "Шапка с переключателем периода, строка итога и график от края до края — `Card.SectionTrailing`, `Card.Chart`.",
    },
    {
      scenario: "content-templates",
      title: "Контентные шаблоны",
      description:
        "Призыв к действию, список событий и плитка кампании с обложкой — `Card.CtaBody`, `Card.List`, `Card.Cover`.",
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
      '`Card.Title` и `Card.SectionTitle` — `<h3>`; прямо под заголовком страницы передайте `as="h2"`, чтобы не пропустить уровень.',
      "Декоративные иконки в `Card.IconBox` и обложки — `aria-hidden`; контролам в `Card.SectionTrailing` нужны свои имена.",
    ],
  },
};

export default function CardSection() {
  return <ComponentPage page={page} />;
}
