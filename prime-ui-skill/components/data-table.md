# DataTable

## Что это

Компонент `DataTable.Root` — таблица на нативной разметке `table` с опциональной сортировкой по колонкам, пагинацией или режимом прокрутки с догрузкой, закрепляемой шапкой и первой колонкой.

## Для чего нужен

- **Склад и отгрузки** — список партий, маршрутов и окон прибытия с сортировкой по объёму и постраничным просмотром длинного реестра.
- **Финансы и биллинг** — сводка счетов и статусов оплаты с выравниванием сумм по правому краю и визуальными метками в ячейках.
- **Планирование и отчёты** — широкая сетка кварталов и итогов с горизонтальной прокруткой, закреплённой первой колонкой показателя и шапкой.
- **Поддержка и контакты** — каталог обращений с кастомными ячейками (ссылки, действия) и кликом по строке для открытия карточки.
- **Журнал активности** — длинная лента событий с бесконечной прокруткой и запросом следующих порций с сервера.
- **Внутренние панели** — компактная таблица в узкой колонке карточки или формы, где важно занять всю ширину контейнера.

## Юзкейсы

Импорт из пакета `prime-ui-kit`. Примеры разделены по смыслу экрана и набору пропсов.

### Базовый

Реестр медицинских кабинетов: четыре колонки, сортировка по названию, без внешнего состояния.

```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Room = { code: string; name: string; floor: number; seats: number };

const rows: Room[] = [
  { code: "A-12", name: "Терапия", floor: 2, seats: 3 },
  { code: "B-04", name: "Лаборатория", floor: 1, seats: 2 },
  { code: "C-21", name: "Рентген", floor: 3, seats: 1 },
];

const columns: DataTableColumn<Room>[] = [
  { id: "code", header: "Код", accessor: "code", sortable: true, minWidth: "5rem" },
  { id: "name", header: "Кабинет", accessor: "name", sortable: true, minWidth: "10rem" },
  {
    id: "floor",
    header: "Этаж",
    accessor: "floor",
    sortable: true,
    align: "end",
    minWidth: "5rem",
  },
  {
    id: "seats",
    header: "Мест",
    accessor: "seats",
    sortable: true,
    align: "end",
    minWidth: "5rem",
  },
];

export function ClinicRoomsTable() {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      pageSize={5}
      showPagination={rows.length > 5}
    />
  );
}
```

### С вариантами/размерами

Витрина курсов: размер `l`, пунктирные разделители и зебра для длинного списка слушателей.

```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Enrollee = { id: string; name: string; track: string; progress: number };

const columns: DataTableColumn<Enrollee>[] = [
  { id: "name", header: "Участник", accessor: "name", sortable: true, minWidth: "11rem" },
  { id: "track", header: "Трек", accessor: "track", sortable: true, minWidth: "9rem" },
  {
    id: "progress",
    header: "Прогресс, %",
    accessor: "progress",
    sortable: true,
    align: "end",
    minWidth: "7rem",
    cell: (row) => `${row.progress}%`,
  },
];

export function CourseRosterTable({ rows }: { rows: Enrollee[] }) {
  return (
    <DataTable.Root
      size="l"
      dividerStyle="dashed"
      striped
      columns={columns}
      rows={rows}
      defaultSort={{ columnId: "progress", order: "desc" }}
      pageSize={6}
    />
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Боковая панель согласования договора: узкая ширина, таблица тянется на 100%, липкая шапка при прокрутке внутри панели.

```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Clause = { id: string; title: string; owner: string; risk: "low" | "med" | "high" };

const columns: DataTableColumn<Clause>[] = [
  { id: "title", header: "Пункт", accessor: "title", sortable: true, minWidth: "10rem" },
  { id: "owner", header: "Юрист", accessor: "owner", sortable: true, minWidth: "8rem" },
  {
    id: "risk",
    header: "Риск",
    accessor: "risk",
    sortable: true,
    minWidth: "6rem",
    cell: (row) => (row.risk === "high" ? "Высокий" : row.risk === "med" ? "Средний" : "Низкий"),
  },
];

export function ContractClausesDrawer({ rows }: { rows: Clause[] }) {
  return (
    <aside style={{ width: 360, maxHeight: 420, display: "flex", flexDirection: "column" }}>
      <DataTable.Root
        className="contract-clauses-table"
        columns={columns}
        rows={rows}
        infiniteScroll
        stickyHeader
        scrollHeight={300}
        initialVisibleRows={8}
        infiniteBatchSize={10}
        showPagination={false}
        pageSize={8}
      />
    </aside>
  );
}
```

### Контролируемый режим

Диспетчерская такси: родитель держит сортировку по времени подачи и страницу; при смене колонки страница сбрасывается вручную.

```tsx
import * as React from "react";
import { DataTable, type DataTableColumn, type DataTableSortState } from "prime-ui-kit";

type Ride = { id: string; district: string; etaMin: number; driver: string };

const columns: DataTableColumn<Ride>[] = [
  { id: "id", header: "Заказ", accessor: "id", sortable: true, minWidth: "6rem" },
  { id: "district", header: "Район", accessor: "district", sortable: true, minWidth: "9rem" },
  {
    id: "etaMin",
    header: "Мин до подачи",
    accessor: "etaMin",
    sortable: true,
    align: "end",
    minWidth: "8rem",
  },
  { id: "driver", header: "Водитель", accessor: "driver", sortable: true, minWidth: "10rem" },
];

export function TaxiDispatchTable({ rows }: { rows: Ride[] }) {
  const [sort, setSort] = React.useState<DataTableSortState>({ columnId: "etaMin", order: "asc" });
  const [page, setPage] = React.useState(1);

  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      sort={sort}
      onSortChange={(next) => {
        setSort(next);
        setPage(1);
      }}
      page={page}
      onPageChange={setPage}
      pageSize={4}
    />
  );
}
```

## Анатомия

- **`DataTable.Root`** — обёртка с `ControlSizeProvider`, `data-*` на корневом `div` (размер, разделители, шапка, липкость, подсветки, зебра).
- **Внутри** — прокручиваемый `div.viewport` с `table`, `colgroup`, опционально `thead` с `th` (кнопка сортировки или текст), `tbody` с `tr`/`td`, внизу сентинел для `IntersectionObserver` в режиме бесконечной прокрутки.
- **Подвал** — счётчик «Показано X–Y из Z», при классической пагинации — `Pagination.Root`, при догрузке — текст состояния.

## API

### DataTable.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| columns | `DataTableColumn<Row>[]` | — | Да | Конфигурация колонок |
| rows | `Row[]` | — | Да | Данные строк |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Размер строки и токены ячеек |
| className | `string` | — | Нет | Класс корневой обёртки |
| showHeader | `boolean` | `true` | Нет | Показывать thead |
| stickyHeader | `boolean` | `false` | Нет | Липкая шапка |
| stickyFirstColumn | `boolean` | `false` | Нет | Липкая первая колонка |
| getRowKey | `(row, index) => React.Key` | индекс | Нет | Ключ строки |
| onRowClick | `(row, index, event) => void` | — | Нет | Клик по строке |
| loading | `boolean` | `false` | Нет | Плейсхолдер загрузки при пустом срезе |
| loadingText | `React.ReactNode` | текст по умолчанию | Нет | Текст загрузки |
| emptyText | `React.ReactNode` | текст по умолчанию | Нет | Текст пустого списка |
| dividerStyle | `"standard" \| "dashed" \| "dotted" \| "none"` | `"standard"` | Нет | Стиль линий сетки |
| sort | `DataTableSortState` | — | Нет | Контролируемая сортировка |
| defaultSort | `DataTableSortState` | `null` | Нет | Неконтролируемая начальная сортировка |
| onSortChange | `(sort) => void` | — | Нет | Смена сортировки |
| page | `number` | — | Нет | Контролируемая страница |
| defaultPage | `number` | `1` | Нет | Начальная страница |
| onPageChange | `(page) => void` | — | Нет | Смена страницы |
| pageSize | `number` | `10` | Нет | Размер страницы / начальный срез |
| showPagination | `boolean` | `true` | Нет | Показывать пагинацию |
| siblingCount | `number` | `1` | Нет | Окно номеров в Pagination |
| paginationSize | `DataTableSize` | как у корня | Нет | Размер контролов пагинации |
| infiniteScroll | `boolean` | `false` | Нет | Режим прокрутки с порциями |
| initialVisibleRows | `number` | `pageSize` | Нет | Стартовое число видимых строк |
| infiniteBatchSize | `number` | `20` | Нет | Шаг наращивания локального среза |
| hasMore | `boolean` | `false` | Нет | Есть ли данные для `onLoadMore` |
| loadingMore | `boolean` | `false` | Нет | Флаг подгрузки |
| onLoadMore | `() => void \| Promise<void>` | — | Нет | Запрос следующей порции |
| scrollHeight | `number \| string` | `360` | Нет | Высота области прокрутки |
| highlightRowOnHover | `boolean` | `true` | Нет | Подсветка строки |
| highlightColumnOnHover | `boolean` | `false` | Нет | Подсветка колонки |
| striped | `boolean` | `false` | Нет | Зебра |

### Поля колонки (`DataTableColumn<Row>`)

| Поле | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| id | `string` | — | Да | Идентификатор колонки |
| header | `React.ReactNode` | — | Да | Заголовок |
| accessor | `keyof Row \| (row) => unknown` | — | Нет | Значение для ячейки и сортировки |
| cell | `(row) => React.ReactNode` | — | Нет | Кастомная ячейка |
| sortable | `boolean` | `false` | Нет | Сортировка по клику |
| sortAccessor | `(row) => unknown` | — | Нет | Значение только для сортировки |
| sortComparator | `(a, b, order) => number` | — | Нет | Свой компаратор |
| align | `"start" \| "center" \| "end"` | `"start"` | Нет | Выравнивание |
| width | `string` | — | Нет | Ширина col |
| minWidth | `string` | — | Нет | Мин. ширина col |
| onHeaderClick | `(event) => void` | — | Нет | Доп. клик по th |
| onCellClick | `(row, event) => void` | — | Нет | Клик/клавиши по ячейке |

Экспортируемые типы: `DataTableSortState`, `DataTableOrder`, `DataTableSize`, `DataTableDividerStyle`, `DataTableCellAlign`, `DataTableRootProps`, `DataTableColumn`.

## Варианты

- **`dividerStyle`** — `standard` (сплошная линия), `dashed`, `dotted`, `none` (без линий между ячейками).
- **`size`** — четыре яруса `s`–`xl` для высоты строки, отступов и текста; влияет на вложенные контролы через контекст размера.

## Состояния

- **Загрузка** — `loading` при отсутствии отображаемых строк: одна строка с `loadingText`.
- **Пусто** — при `loading === false` и нуле строк показывается `emptyText`.
- **Сортировка** — цикл по клику: нет → asc → desc → нет для этой колонки; индикатор стрелок в заголовке.
- **Пагинация** — страница ограничивается диапазоном; при смене данных в обычном режиме страница сбрасывается на 1 при переключении с бесконечного режима.
- **Бесконечная прокрутка** — сначала наращивается локальный срез до длины `rows`, затем при `hasMore` вызывается `onLoadMore`.

## Доступность (a11y)

- Заголовки сортируемых колонок оформлены как интерактивная область внутри `th` с `scope="col"`.
- Ячейки с `onCellClick` получают `role="button"`, `tabIndex={0}`, обработку Enter и пробела.
- Иконки направления сортировки помечены `aria-hidden`.
- Таблица не добавляет роли `grid` или расширенной навигации стрелками — при необходимости сложного поведения это задаётся снаружи.

## Ограничения и заметки

- Нет встроенного изменения ширины колонок перетаскиванием, закрепления произвольной колонки (только первая) и встроенного поиска/фильтрации.
- Оверлей загрузки поверх уже показанных строк не рисуется: `loading` влияет на вид только когда нет строк для показа.
- Для очень больших массивов без порционной подгрузки разумно использовать `infiniteScroll` и подгрузку данных, а не десятки тысяч строк в `rows` сразу.
- Сортировка выполняется в памяти на переданном массиве; серверная сортировка — ответственность потребителя (подставлять уже отсортированные `rows` или управлять ими снаружи).

## Связанные компоненты

- **Pagination** — выводится под таблицей в обычном режиме.
- **Badge**, **Tag** — типичное наполнение ячеек статусов и меток (наследуют размер таблицы, если не переопределён).
- **LinkButton** — ссылки и действия внутри ячеек.
- **ControlSizeProvider** — используется внутри корня; при вложении своих контролов можно опираться на тот же контекст размера.
