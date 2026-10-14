import { api } from "@/components/card/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { LayoutDashboard } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "card",
    label: "Card",
    summary: "Карточка: шаблоны, метрика, действия",
    keywords: ["карточка", "панель", "kpi", "variant"],
    icon: LayoutDashboard,
    order: 5,
  },
  dir: "card",
  title: "Card",
  kind: "composite",
  description:
    "Ограниченный блок на своей заливке с шаблонами для метрик, графиков, списков, призывов к действию и обложек. Разделы страницы — PageContent, а не карточки.",
  examples: [
    {
      slot: "overview",
      description:
        "Форма настроек компании на карточке: шапка, поля на заливке поверхности и кнопка отправки в подвале — `Card.Header`, `Card.Body`, `Card.Footer`.",
    },
    {
      slot: "variants",
      description:
        "Шаблоны KPI: плашка с иконкой и значением, бейдж со значением в строке шапки и крупное значение с изменением во всех тонах и справочной строкой — `variant`, `Card.Delta`, `tone`, `Card.Meta`.",
    },
    {
      scenario: "kpi-media",
      title: "Метрика с графиком",
      description:
        "KPI со спарклайном или уровнем заполнения в нижнем слоте `mini` — `Card.Media`.",
    },
    {
      scenario: "panel-chart",
      title: "Виджет с графиком",
      description:
        "Шапка с коротким описанием и переключателем периода, под ней Sparkline с итогом за период над графиком — `Card.Header`, `Card.Description`, `Card.Body`.",
    },
    {
      scenario: "interactive",
      title: "Карточка-ссылка",
      description:
        "Карточки целиком ведут в свои отчёты: одна остановка Tab, подъём при наведении, нажатие и кольцо фокуса — `asChild`.",
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
        "Карточка — контейнер размера: split складывает ячейки уже 22rem, а значение тренда уменьшается уже 20rem — `variant`.",
    },
    {
      slot: "screen",
      description:
        "Дашборд: заголовок, строка данных, переключатель периода и отчёт в шапке приложения; одна сетка плиток KPI, которые перетекают к новому периоду, тренд выручки, счета рядом с двумя панелями и последние оплаты со ссылкой на весь список — `AppHeader.Tools`, `PageContent.Grid`.",
    },
  ],
  api,
};
