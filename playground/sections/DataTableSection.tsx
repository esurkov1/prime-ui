import { api } from "@/components/data-table/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Table } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "data-table",
    label: "Data Table",
    summary: "Таблица данных: сортировка, выбор строк",
    keywords: ["таблица", "данные", "сортировка", "columns", "rows", "selection"],
    icon: Table,
    order: 6,
  },
  dir: "data-table",
  title: "DataTable",
  kind: "composite",
  description:
    "Таблица записей: сортировка, страницы или бесконечная прокрутка, выбор и группы строк, строки-ссылки, выбор колонок, вложенные строки и состояния загрузки, пустоты и ошибки. Колонки — данные, не разметка.",
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
        "Отчёт по складу: числа по правому краю табличными цифрами, длинное название в одну строку с подсказкой, форматированные ячейки сортируются по исходному числу, а артикулы — в естественном порядке — `numeric`, `truncate`, `maxWidth`, `sortAccessor`, `sortComparator`.",
    },
    {
      scenario: "heatmap",
      title: "Тепловая карта",
      description:
        "Сделки менеджеров по месяцам тепловой картой: каждое число закрашивает свою ячейку по шкале графиков и остаётся читаемым в ней — `scale`, `numeric`.",
    },
    {
      scenario: "trend",
      title: "Тренд в ячейке",
      description:
        "Клиенты с выручкой по месяцам: компактный Sparkline в ячейке каждой строки рядом с суммой за полгода — `cell`, `width`.",
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
        "Детали заказа в строке на всю ширину под раскрытым заказом, по краю первой колонки; у отменённого заказа показывать нечего, и переключателя нет — `renderExpanded`, `defaultExpanded`, `isRowExpandable`.",
    },
    {
      scenario: "sticky",
      title: "Закреплённые шапка и колонка",
      description:
        "Продажи по регионам в окне 280 px: шапка и колонка регионов остаются на месте при прокрутке в обе стороны — `stickyHeader`, `stickyFirstColumn`, `scrollHeight`.",
    },
    {
      scenario: "row-link",
      title: "Строка-ссылка",
      description:
        "Счета, строки которых — ссылки: ⌘-клик или средняя кнопка открывают новую вкладку, обычный клик переходит внутри приложения, итоговая строка и меню ⋯ строку не открывают — `getRowHref`, `onRowClick`, `isRowClickable`.",
    },
    {
      scenario: "row-open",
      title: "Открытие на месте",
      description:
        "Сделки открываются в боковой панели: клик, Enter или Space на строке в фокусе; панель держит последнюю сделку, пока уезжает — `onRowClick`.",
    },
    {
      scenario: "reorder",
      title: "Перестановка строк",
      description:
        "Этапы воронки расставляются за ручку или Alt + ↑ / ↓; каждый ход сохраняется со спиннером в ручке, а сортировка по колонке выключает ручки — `onReorder`, `getRowLabel`.",
    },
    {
      scenario: "groups",
      title: "Группы строк",
      description:
        "Платежи по месяцам с итогом месяца в строке-заголовке; заголовки остаются сверху, пока прокручиваются их строки, прошлый месяц свёрнут — `getRowGroup`, `renderGroupHeader`, `stickyGroupHeaders`, `defaultCollapsedGroups`.",
    },
    {
      scenario: "columns-visibility",
      title: "Выбор колонок",
      description:
        "Заказы с выбором колонок на панели; выбор переживает перезагрузку в local storage, номер заказа остаётся всегда — `DataTable.ColumnsMenu`, `hiddenColumns`, `onHiddenColumnsChange`, `hideable`.",
    },
    {
      scenario: "infinite-scroll",
      title: "Бесконечная прокрутка",
      description:
        "Журнал действий: загруженные строки появляются порциями, затем таблица просит сервер о новых — `paging`, `infiniteBatchSize`, `hasMore`, `loadingMore`, `onLoadMore`.",
    },
    {
      scenario: "server",
      title: "Данные с сервера",
      description:
        "Сделки CRM сортирует, делит на страницы и ищет сервер; новый поиск возвращает на первую страницу — `source`, `rowCount`, `sort`, `page`, `loading`.",
    },
    {
      scenario: "fill-height",
      title: "На всю высоту",
      description:
        "Журнал занимает высоту своей панели и догружает старые записи при прокрутке; статус виден, пока запрос не завершён — `scrollHeight`, `paging`, `onLoadMore`.",
    },
    {
      slot: "states",
      description:
        "Скелетон загрузки, пустой период и ошибка с повтором: шапка остаётся, меняется только тело — `loading`, `loadingRows`, `empty`, `loadError`.",
    },
    {
      slot: "controlled",
      description:
        "Сортировка, страница и выбор колонок у родителя (URL или стор): клик по заголовку — по возрастанию → по убыванию → без сортировки, новая сортировка возвращает на первую страницу — `sort`, `onSortChange`, `page`, `onPageChange`, `hiddenColumns`, `onHiddenColumnsChange`.",
    },
    {
      slot: "narrow",
      description:
        "Очередь поддержки шириной 320 px: колонки прокручиваются внутри, первая закреплена, панель и подвал перестраиваются, пагинация становится компактной — `stickyFirstColumn`, `size`.",
    },
    {
      slot: "screen",
      description:
        "Страница списка: заголовок, строка с цифрами, поиск, фильтры и одно главное действие в верхней полосе страницы, таблица счетов со статусами, действиями со строкой, страницами и пустым результатом фильтра — `empty`, `pageSize`, `stickyFirstColumn`.",
    },
  ],
  api,
};
