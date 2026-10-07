import { api } from "@/components/data-table/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "data-table",
  title: "DataTable",
  kind: "composite",
  description:
    "Таблица записей: сортировка, страницы или бесконечная прокрутка, выбор строк, вложенные строки и состояния загрузки, пустоты и ошибки. Колонки — данные, не разметка.",
  examples: [
    {
      slot: "overview",
      description:
        "Последние заказы: сортируемые колонки, Badge статуса, суммы и пять строк на странице — `columns`, `getRowKey`, `pageSize`.",
    },
    {
      slot: "sizes",
      description: "Все плотности: строки от 36 до 52 px, шапка — высота контрола яруса — `size`.",
    },
    {
      scenario: "numeric",
      title: "Числа и длинный текст",
      description:
        "Отчёт по складу: числа по правому краю табличными цифрами, длинное название в одну строку с подсказкой — `numeric`, `truncate`, `maxWidth`.",
    },
    {
      scenario: "content-width",
      title: "Ширина таблицы и колонок",
      description:
        "Короткий справочник по ширине содержимого с колонкой по центру и колонка `grow`, которая забирает свободную ширину и переносит текст — `fullWidth`, `align`, `grow`.",
    },
    {
      scenario: "appearance",
      title: "Оформление строк",
      description:
        "Зебра без линий, подсветка колонки под курсором, список «ключ — значение» без шапки — `striped`, `rowDividers`, `highlightColumnOnHover`, `columnDividers`, `showHeader`.",
    },
    {
      scenario: "toolbar",
      title: "Панель над таблицей",
      description:
        "Кампании с поиском, фильтром статуса и экспортом над таблицей; текст, когда ничего не найдено — `toolbar`, `empty`.",
    },
    {
      scenario: "selection",
      title: "Выбор строк",
      description:
        "Участники с флажками: диапазон с Shift, протяжка, «выбрать все» и массовые действия на панели — `selectable`, `selected`, `onSelectedChange`, `getRowLabel`.",
    },
    {
      scenario: "nested-rows",
      title: "Вложенные строки",
      description:
        "Партнёры и их статьи расходов: вложенные строки с отступом под именем, переключатель-шеврон, вместе с выбором и сортировкой — `getRowChildren`, `expanded`, `onExpandedChange`.",
    },
    {
      scenario: "detail-panel",
      title: "Панель деталей",
      description:
        "Детали заказа в строке на всю ширину под раскрытым заказом, по краю первой колонки — `renderExpanded`, `defaultExpanded`.",
    },
    {
      scenario: "sticky",
      title: "Закреплённые шапка и колонка",
      description:
        "Продажи по регионам в окне 280 px: шапка и колонка регионов остаются на месте при прокрутке в обе стороны — `stickyHeader`, `stickyFirstColumn`, `scrollHeight`.",
    },
    {
      scenario: "infinite-scroll",
      title: "Бесконечная прокрутка",
      description:
        "Журнал действий: загруженные строки появляются порциями, затем таблица просит сервер о новых — `paging`, `infiniteBatchSize`, `hasMore`, `loadingMore`, `onLoadMore`.",
    },
    {
      slot: "states",
      description:
        "Скелетон загрузки, пустой период и ошибка с повтором: шапка остаётся, меняется только тело — `loading`, `loadingRows`, `empty`, `error`.",
    },
    {
      slot: "controlled",
      description:
        "Сортировка и страница у родителя (URL или стор): клик по заголовку — по возрастанию → по убыванию → без сортировки, новая сортировка возвращает на первую страницу — `sort`, `onSortChange`, `page`, `onPageChange`.",
    },
    {
      slot: "narrow",
      description:
        "Очередь поддержки шириной 320 px: колонки прокручиваются внутри, первая закреплена, панель и подвал перестраиваются, пагинация становится компактной — `stickyFirstColumn`, `size`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action: "Переходит по кнопкам сортировки, флажкам, переключателям и кликабельным ячейкам.",
      },
      {
        keys: "Enter · Space",
        action: "Сортирует по колонке, раскрывает строку или нажимает кликабельную ячейку.",
      },
      { keys: "Space", action: "Отмечает строку на флажке под фокусом." },
      { keys: "Shift + Space", action: "Отмечает диапазон от последней отмеченной строки." },
    ],
    aria: [
      'Нативная `<table>`; заголовки — `scope="col"`, у сортируемых — `<button>` и `aria-sort`.',
      "Флажки строк названы `labels.selectRow` с `{label}` из `getRowLabel`; флажок в шапке — `labels.selectAll`, частичный выбор — `indeterminate`.",
      "После смены выбора вежливая область объявляет `labels.selectedCount`; выбранные строки — `aria-selected`.",
      "Переключатель раскрытия — кнопка с `aria-expanded`, `aria-controls` (детали или вложенные строки) и `labels.expand` / `labels.collapse`.",
      'Загрузка: `aria-busy` на таблице и статус `labels.loading`; ошибка — `role="alert"`; пустое состояние — `role="status"`.',
    ],
  },
};

export default function DataTableSection() {
  return <ComponentPage page={page} />;
}
