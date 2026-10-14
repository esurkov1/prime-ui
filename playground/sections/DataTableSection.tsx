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
        "Отчёт по складу: числа по правому краю табличными цифрами, длинное название в одну строку с подсказкой — `numeric`, `truncate`, `maxWidth`.",
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
        "Детали заказа в строке на всю ширину под раскрытым заказом, по краю первой колонки — `renderExpanded`, `defaultExpanded`.",
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
    {
      slot: "screen",
      description:
        "Страница списка: одно главное действие в шапке, фильтры в панели таблицы, статусы, действия со строкой, страницы и пустой результат фильтра — `toolbar`, `empty`, `stickyFirstColumn`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action:
          "Переходит по кнопкам сортировки, флажкам, переключателям, ссылкам строк и строкам, которые открываются на месте.",
      },
      {
        keys: "Enter · Space",
        action:
          "Сортирует по колонке, раскрывает строку или группу, открывает строку в фокусе (`onRowClick`); на ссылке строки Enter переходит по ней.",
      },
      { keys: "Space", action: "Отмечает строку на флажке под фокусом." },
      { keys: "Shift + Space", action: "Отмечает диапазон от последней отмеченной строки." },
      {
        keys: "Alt + ↑ · Alt + ↓",
        action: "На ручке строки (`onReorder`) переставляет строку на место выше или ниже.",
      },
      { keys: "Escape", action: "Отменяет перетаскивание строки, она возвращается на место." },
    ],
    aria: [
      'Нативная `<table>`; заголовки — `scope="col"`, у сортируемых — `<button>` и `aria-sort`.',
      "Строка-ссылка: в ключевой ячейке настоящий `<a>` с именем из её текста; копии ссылки в остальных ячейках скрыты (`aria-hidden`, `tabindex=-1`). Строка, которая открывается на месте, получает фокус; фокус обводит всю строку.",
      'Строка не открывается от контролов внутри неё (ссылки, кнопки, поля, `label`, ARIA-виджеты, `data-row-click-ignore`) и от событий из порталов. Заголовок группы — `<th scope="rowgroup">` в своём `<tbody>`.',
      "`DataTable.ColumnsMenu` — Dropdown: пункты `menuitemcheckbox` с `aria-checked`; ключевая колонка выключена (`aria-disabled`).",
      "Флажки строк названы `labels.selectRow` с `{label}` из `getRowLabel`; флажок в шапке — `labels.selectAll`, частичный выбор — `indeterminate`.",
      "После смены выбора вежливая область объявляет `labels.selectedCount`; выбранные строки — `aria-selected`.",
      "Ручка строки — кнопка с именем `labels.reorderRow` и `aria-keyshortcuts`; взятие, сброс и ход с клавиатуры объявляются вежливой областью («Этап: позиция 2 из 6»). Пока ход сохраняется, строка — `aria-busy`; при сортировке ручки неактивны, подсказка — `labels.reorderSorted`.",
      "Переключатель раскрытия — кнопка с `aria-expanded`, `aria-controls` (детали или вложенные строки) и `labels.expand` / `labels.collapse`.",
      "Переключатель группы (сворачиваемые группы) — кнопка в заголовке группы с `aria-expanded`, `aria-controls` (строки открытой группы) и `labels.expandGroup` / `labels.collapseGroup` с `{group}`.",
      'Загрузка: `aria-busy` на таблице и статус `labels.loading`; ошибка — `role="alert"`; пустое состояние — `role="status"`.',
    ],
  },
};
