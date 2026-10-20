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
      "pressed",
      "tone",
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
    "Единственный чип кита: статус в цвете роли, категория в цвете палитры, счётчик, снимаемое значение и переключатель с действием при наведении.",
  examples: [
    {
      slot: "overview",
      description: "Статусы счёта: смысл несёт текст, тон его повторяет — `tone`.",
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
        "Неактивный бейдж, чип-переключатель выключен и включён, снимаемый и ждущий запроса — `disabled`, `pressed`, `onRemove`, `loading`.",
    },
    {
      slot: "with-icon",
      description:
        "Точка в начале цвета текста или своего оттенка, иконка в начале или в конце и квадрат-иконка с именем — `Badge.Dot`, `color`, `Badge.Icon`, `aria-label`.",
    },
    {
      scenario: "in-controls",
      title: "Внутри контрола",
      description: "В кнопке и поле бейдж сам берёт ярус на ступень ниже — `Badge.Root`.",
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
        "Значения как переключатели с действием «скрыть», которое выезжает без изменения ширины — `pressed`, `onPressedChange`, `Badge.Action`, `persistent`.",
    },
    {
      scenario: "trigger",
      title: "Бейдж-выбор",
      description:
        "Этап сделки бейджем, который открывает выбор этапа: шеврон поворачивается, пока меню открыто, бейдж берёт цвет выбранного этапа — `Badge.Root`, `Dropdown.Trigger`, `color`.",
    },
    {
      scenario: "assignee",
      title: "Человек в чипе",
      description:
        "Ответственный за задачу — чипом человека, который открывает команду: аватар перед именем, а без ответственного на его месте контурный «Назначить» — `Badge.Avatar`, `Dropdown.Trigger`, `variant`.",
    },
    {
      scenario: "person-details",
      title: "Человек в две строки",
      description:
        "Люди договора в две строки: имя и под ним должность или почта, аватар на обе строки; согласующий открывает команду, чтобы выбрать другого — `Badge.Description`, `Badge.Avatar`, `Dropdown.Trigger`.",
    },
    {
      scenario: "square",
      title: "Квадратная плитка",
      description:
        "Форматы файлов квадратными плитками текста, достаточно крупными для трёх букв; оттенок разделяет их по виду — `shape`, `size`, `color`.",
    },
    {
      scenario: "full-width",
      title: "На всю ширину",
      description:
        "Следующий шаг по записи плашкой на всю ширину карточки, текст по центру — `fullWidth`, `tone`.",
    },
    {
      scenario: "tag-row",
      title: "Ряд бейджей",
      description:
        "Теги клиента как одно значение: ряд переносится в узкой колонке и держит один зазор между бейджами — `Badge.Group`, `size`.",
    },
    {
      scenario: "overflow-count",
      title: "Одна строка с «+N»",
      description:
        "Разделы каждой роли в одну строку узкой ячейки: что не поместилось, ждёт за «+N» с полным списком в подсказке — `Badge.Group`, `overflow`.",
    },
    {
      slot: "controlled",
      description:
        "Города доставки как чипы-переключатели, состоянием которых владеет экран: сводка считает выбранные — `pressed`, `onPressedChange`.",
    },
  ],
  api,
};
