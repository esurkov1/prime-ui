import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import DataTableCompositionSnippet from "../snippets/data-table/composition";
import dataTableCompositionSource from "../snippets/data-table/composition.tsx?raw";
import DataTableControlledSnippet from "../snippets/data-table/controlled";
import dataTableControlledSource from "../snippets/data-table/controlled.tsx?raw";
import DataTableDividerStylesSnippet from "../snippets/data-table/divider-styles";
import dataTableDividerStylesSource from "../snippets/data-table/divider-styles.tsx?raw";
import DataTableFullWidthSnippet from "../snippets/data-table/full-width";
import dataTableFullWidthSource from "../snippets/data-table/full-width.tsx?raw";
import DataTableHighlightAndStripedSnippet from "../snippets/data-table/highlight-and-striped";
import dataTableHighlightAndStripedSource from "../snippets/data-table/highlight-and-striped.tsx?raw";
import DataTableInfiniteScrollSnippet from "../snippets/data-table/infinite-scroll";
import dataTableInfiniteScrollSource from "../snippets/data-table/infinite-scroll.tsx?raw";
import DataTableSizesSnippet from "../snippets/data-table/sizes";
import dataTableSizesSource from "../snippets/data-table/sizes.tsx?raw";
import DataTableSortingPaginationSnippet from "../snippets/data-table/sorting-pagination";
import dataTableSortingPaginationSource from "../snippets/data-table/sorting-pagination.tsx?raw";
import DataTableStatesSnippet from "../snippets/data-table/states";
import dataTableStatesSource from "../snippets/data-table/states.tsx?raw";
import DataTableStickyAndHeadersSnippet from "../snippets/data-table/sticky-and-headers";
import dataTableStickyAndHeadersSource from "../snippets/data-table/sticky-and-headers.tsx?raw";

const dataTableRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "columns",
    type: "DataTableColumn<Row>[]",
    defaultValue: "—",
    required: "Да",
    description:
      "Описание колонок: заголовок, доступ к данным, выравнивание, сортировка, кастомная ячейка.",
  },
  {
    prop: "rows",
    type: "Row[]",
    defaultValue: "—",
    required: "Да",
    description: "Массив строк данных; тип строки задаётся дженериком компонента.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Высота строки и токены ячейки; пробрасывается в ControlSizeProvider для вложенных контролов.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс корневого контейнера (обёртка над таблицей и подвалом).",
  },
  {
    prop: "showHeader",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Показывать ли блок thead с заголовками колонок.",
  },
  {
    prop: "stickyHeader",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Закрепить шапку при вертикальной прокрутке области таблицы.",
  },
  {
    prop: "stickyFirstColumn",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Закрепить первую колонку слева при горизонтальной прокрутке.",
  },
  {
    prop: "getRowKey",
    type: "(row: Row, index: number) => React.Key",
    defaultValue: "—",
    required: "Нет",
    description: "Ключ строки для React; по умолчанию используется индекс.",
  },
  {
    prop: "onRowClick",
    type: "(row: Row, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Обработчик клика по строке tr.",
  },
  {
    prop: "loading",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Если нет отображаемых строк, показывается строка с loadingText.",
  },
  {
    prop: "loadingText",
    type: "React.ReactNode",
    defaultValue: '"Загрузка данных…"',
    required: "Нет",
    description: "Содержимое ячейки-состояния при loading и пустом срезе строк.",
  },
  {
    prop: "emptyText",
    type: "React.ReactNode",
    defaultValue: '"Нет данных для отображения."',
    required: "Нет",
    description: "Текст при отсутствии строк и выключенной загрузке.",
  },
  {
    prop: "dividerStyle",
    type: '"standard" | "dashed" | "dotted" | "none"',
    defaultValue: '"standard"',
    required: "Нет",
    description: "Вид линий между ячейками (data-divider на корне).",
  },
  {
    prop: "sort",
    type: "DataTableSortState",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемая сортировка: { columnId, order } или null.",
  },
  {
    prop: "defaultSort",
    type: "DataTableSortState",
    defaultValue: "null",
    required: "Нет",
    description: "Начальная сортировка в неконтролируемом режиме.",
  },
  {
    prop: "onSortChange",
    type: "(sort: DataTableSortState) => void",
    defaultValue: "—",
    required: "Нет",
    description:
      "Уведомление о смене сортировки; при клике по заголовку страница сбрасывается на 1.",
  },
  {
    prop: "page",
    type: "number",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемый номер страницы (с 1).",
  },
  {
    prop: "defaultPage",
    type: "number",
    defaultValue: "1",
    required: "Нет",
    description: "Стартовая страница в неконтролируемом режиме.",
  },
  {
    prop: "onPageChange",
    type: "(page: number) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Уведомление о смене страницы пагинации.",
  },
  {
    prop: "pageSize",
    type: "number",
    defaultValue: "10",
    required: "Нет",
    description:
      "Число строк на страницу; для infiniteScroll задаёт начальный срез, если не задан initialVisibleRows.",
  },
  {
    prop: "showPagination",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      "Показывать Pagination под таблицей (только если не infiniteScroll и страниц больше одной).",
  },
  {
    prop: "siblingCount",
    type: "number",
    defaultValue: "1",
    required: "Нет",
    description: "Сколько номеров страниц показывать вокруг текущей в Pagination.",
  },
  {
    prop: "paginationSize",
    type: "DataTableSize",
    defaultValue: "size корня",
    required: "Нет",
    description: "Размер контролов пагинации; по умолчанию совпадает с size таблицы.",
  },
  {
    prop: "infiniteScroll",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Режим прокрутки внутри viewport с догрузкой порциями и/или onLoadMore.",
  },
  {
    prop: "initialVisibleRows",
    type: "number",
    defaultValue: "pageSize",
    required: "Нет",
    description: "Сколько строк показать сразу в режиме infiniteScroll.",
  },
  {
    prop: "infiniteBatchSize",
    type: "number",
    defaultValue: "20",
    required: "Нет",
    description: "На сколько строк расширять срез при достижении низа, пока есть локальные строки.",
  },
  {
    prop: "hasMore",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Есть ли ещё данные на сервере для вызова onLoadMore.",
  },
  {
    prop: "loadingMore",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Индикатор фоновой подгрузки в подвале при infiniteScroll.",
  },
  {
    prop: "onLoadMore",
    type: "() => void | Promise<void>",
    defaultValue: "—",
    required: "Нет",
    description: "Запрос следующей порции после исчерпания локально видимых строк.",
  },
  {
    prop: "scrollHeight",
    type: "number | string",
    defaultValue: "360",
    required: "Нет",
    description:
      "Максимальная высота прокручиваемой области (px или CSS-строка) при infiniteScroll.",
  },
  {
    prop: "highlightRowOnHover",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Подсветка фона строки при наведении.",
  },
  {
    prop: "highlightColumnOnHover",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Подсветка колонки под курсором (шапка и ячейки).",
  },
  {
    prop: "striped",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Чередование фона строк (зебра).",
  },
];

const dataTableColumnApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Стабильный идентификатор колонки; участвует в сортировке и data-column-id.",
  },
  {
    prop: "header",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Заголовок ячейки th: текст, иконка или разметка.",
  },
  {
    prop: "accessor",
    type: "keyof Row | ((row: Row) => unknown)",
    defaultValue: "—",
    required: "Нет",
    description: "Откуда брать значение для сортировки и дефолтного отображения ячейки.",
  },
  {
    prop: "cell",
    type: "(row: Row) => React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Кастомный рендер ячейки; иначе значение из accessor приводится к строке.",
  },
  {
    prop: "sortable",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Кликабельный заголовок с индикатором порядка сортировки.",
  },
  {
    prop: "sortAccessor",
    type: "(row: Row) => unknown",
    defaultValue: "—",
    required: "Нет",
    description: "Отдельное значение для сравнения при сортировке, если отображаемое поле другое.",
  },
  {
    prop: "sortComparator",
    type: "(a: Row, b: Row, order: DataTableOrder) => number",
    defaultValue: "—",
    required: "Нет",
    description: "Полностью кастомное сравнение двух строк для этой колонки.",
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    defaultValue: '"start"',
    required: "Нет",
    description: "Выравнивание содержимого ячейки и заголовка.",
  },
  {
    prop: "width",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "CSS width на <col> (фиксированная или предпочтительная ширина).",
  },
  {
    prop: "minWidth",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "CSS min-width на <col>.",
  },
  {
    prop: "maxWidth",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "CSS max-width на <col>.",
  },
  {
    prop: "onHeaderClick",
    type: "(event: React.MouseEvent<HTMLTableCellElement>) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный обработчик клика по th (выполняется до логики сортировки).",
  },
  {
    prop: "onCellClick",
    type: "(row: Row, event: MouseEvent | KeyboardEvent) => void",
    defaultValue: "—",
    required: "Нет",
    description: 'Клик или Enter/Пробел по ячейке: role="button" и tabIndex=0.',
  },
];

export default function DataTableSection() {
  return (
    <PlaygroundDocPage
      title="DataTable"
      description={
        <>
          Таблица для списков и отчётов: сортировка по колонкам, постраничный просмотр или длинная
          прокрутка с догрузкой. Можно закрепить шапку и первую колонку, настроить линии сетки и
          подсветку строк. Размер строки задаётся пропом <code>size</code> и наследуется вложенными
          элементами кита, если у них нет своего размера.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре ряда с <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code>; в ячейках — <code>Tag</code> и <code>Badge</code> без собственного{" "}
            <code>size</code>, чтобы показать наследование от <code>ControlSizeProvider</code>.
            Пагинация использует <code>paginationSize</code>, совпадающий с размером таблицы.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={dataTableSizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DataTableSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты (линии сетки)</DemoSectionTitle>
          <DemoDescription>
            Проп <code>dividerStyle</code>: сплошная линия по умолчанию, штрих, точки или отключение
            разделителей (<code>none</code>).
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={dataTableDividerStylesSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <DataTableDividerStylesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Ожидание данных: <code>loading</code> и <code>loadingText</code> при пустом списке
            строк. Пустой результат: <code>emptyText</code> при <code>loading=false</code> и нуле
            строк.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={dataTableStatesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DataTableStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Расположение: шапка и закрепление</DemoSectionTitle>
          <DemoDescription>
            <code>showHeader=false</code> скрывает thead. <code>stickyHeader</code> и{" "}
            <code>stickyFirstColumn</code> удерживают области при прокрутке внутри{" "}
            <code>infiniteScroll</code> (фиксированная <code>scrollHeight</code>).
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={dataTableStickyAndHeadersSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <DataTableStickyAndHeadersSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Сортировка и страница задаются снаружи: <code>sort</code>, <code>onSortChange</code>,{" "}
            <code>page</code>, <code>onPageChange</code>. При смене сортировки родитель сбрасывает
            страницу на первую (как делает внутренняя логика при клике по заголовку).
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={dataTableControlledSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <DataTableControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            <code>header</code> как разметка с иконкой, <code>cell</code> с <code>LinkButton</code>,{" "}
            <code>getRowKey</code> по полю <code>id</code>, <code>onRowClick</code> по строке и{" "}
            <code>onCellClick</code> на колонке действия (клавиатура: Enter и пробел).
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={dataTableCompositionSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <DataTableCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Корень таблицы растягивается на ширину родителя — удобно в узкой колонке макета или
            карточке без отдельного пропа: достаточно ограничить внешний контейнер.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={dataTableFullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DataTableFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные возможности</DemoSectionTitle>
          <DemoDescription>
            Три типичных режима: визуальные опции наведения и зебра; бесконечная прокрутка с
            порционной догрузкой; клиентская сортировка и пагинация с <code>defaultSort</code> без
            внешнего состояния.
          </DemoDescription>
          <DemoApiTitle>Подсветка и зебра</DemoApiTitle>
          <DemoDescription>
            Переключатели для <code>highlightRowOnHover</code>, <code>highlightColumnOnHover</code>{" "}
            и <code>striped</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={dataTableHighlightAndStripedSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <DataTableHighlightAndStripedSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
          <DemoApiTitle>Бесконечная прокрутка</DemoApiTitle>
          <DemoDescription>
            <code>infiniteScroll</code>, <code>initialVisibleRows</code>,{" "}
            <code>infiniteBatchSize</code>, <code>hasMore</code>, <code>loadingMore</code>,{" "}
            <code>onLoadMore</code>, <code>scrollHeight</code>; пагинация отключена.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={dataTableInfiniteScrollSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <DataTableInfiniteScrollSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
          <DemoApiTitle>Сортировка и пагинация по умолчанию</DemoApiTitle>
          <DemoDescription>
            <code>defaultSort</code> и встроенный <code>Pagination</code>; размер страницы{" "}
            <code>pageSize</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={dataTableSortingPaginationSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <DataTableSortingPaginationSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>DataTable.Root</DemoApiTitle>
          <DemoDescription>
            Единственный публичный узел: таблица, область прокрутки, подвал с метаданными и при
            необходимости пагинация.
          </DemoDescription>
          <PlaygroundApiTable rows={dataTableRootApiRows} />
          <DemoApiTitle>Поля колонки (DataTableColumn)</DemoApiTitle>
          <DemoDescription>
            Объект в массиве <code>columns</code>: связь заголовка с данными, сортировка и события
            ячеек.
          </DemoDescription>
          <PlaygroundApiTable rows={dataTableColumnApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
