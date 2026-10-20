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
    "Ограниченный блок на своей заливке с шаблонами для метрик, графиков, списков, призывов к действию и обложек. Разделы страницы — Page.Section, а не карточки.",
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
      scenario: "person-header",
      title: "Шапка с человеком",
      description:
        "Привязанный Telegram в карточке сотрудника: аватар открывает шапку, логин стоит под именем, кнопка «Отвязать» — в конце — `Card.Icon`, `Avatar.Root`, `Card.Description`.",
    },
    {
      scenario: "interactive",
      title: "Карточка-ссылка",
      description:
        "Карточки целиком ведут в свои отчёты: одна остановка Tab, стрелка перехода в углу, подъём при наведении, нажатие и кольцо фокуса — `asChild`.",
    },
    {
      scenario: "record-link",
      title: "Растянутая ссылка",
      description:
        "Карточка транспорта открывает запись кликом в любом месте, кнопка «Выдан» остаётся своей, линия над рядом действий — во всю ширину, а карточка залога открывает своё окно на месте — `Card.Link`, `asChild`, `Card.Footer`, `divider`.",
    },
    {
      scenario: "record-totals",
      title: "Запись с итогом",
      description:
        "Единица аренды в сделке: кольцо срока открывает шапку рядом со стрелкой, позиции с суммами стоят под линией во всю ширину, а подвал на своей заливке держит действие, следующую задачу и итог с его состоянием у края — `Card.Icon`, `Card.Link`, `divider`, `Card.Description`, `Card.Total`, `Card.Meta`.",
    },
    {
      scenario: "text-values",
      title: "Значение — текст",
      description:
        "Плитки сводки, где значение — строка текста на шаг крупнее подписи, фраза и число одинаково, одна из них в тоне — `variant`, `stat-text`, `valueSize`, `tone`.",
    },
    {
      scenario: "text-action",
      title: "Значение с действием",
      description:
        "Плитки аренды с действием своего шага в конце строки, по центру по вертикали — `stat-text`, `Card.Value`, `Card.Meta`.",
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
      slot: "states",
      description:
        "Плитка KPI, пока грузится отчёт, рядом с загруженной — в шаблонах `stat-trend` и `mini` — `loading`.",
    },
    {
      slot: "narrow",
      description:
        "Карточка — контейнер размера: split складывает ячейки уже 22rem, а значение тренда уменьшается уже 20rem — `variant`.",
    },
    {
      slot: "screen",
      description:
        "Дашборд: заголовок со строкой данных, переключатель периода и отчёт в верхней полосе страницы; одна сетка плиток KPI, которые перетекают к новому периоду, тренд выручки, счета рядом с двумя панелями и последние оплаты со ссылкой на весь список — `Page.TopBar`, `Page.Grid`.",
    },
  ],
  api,
};
