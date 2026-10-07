import type * as React from "react";

import DataTableAppearanceExample from "@/components/data-table/examples/appearance";
import appearanceSource from "@/components/data-table/examples/appearance.tsx?raw";
import DataTableContentWidthExample from "@/components/data-table/examples/content-width";
import contentWidthSource from "@/components/data-table/examples/content-width.tsx?raw";
import DataTableDashboardExample from "@/components/data-table/examples/dashboard";
import dashboardSource from "@/components/data-table/examples/dashboard.tsx?raw";
import DataTableDetailPanelExample from "@/components/data-table/examples/detail-panel";
import detailPanelSource from "@/components/data-table/examples/detail-panel.tsx?raw";
import DataTableInfiniteScrollExample from "@/components/data-table/examples/infinite-scroll";
import infiniteScrollSource from "@/components/data-table/examples/infinite-scroll.tsx?raw";
import DataTableNarrowExample from "@/components/data-table/examples/narrow";
import narrowSource from "@/components/data-table/examples/narrow.tsx?raw";
import DataTableNestedRowsExample from "@/components/data-table/examples/nested-rows";
import nestedRowsSource from "@/components/data-table/examples/nested-rows.tsx?raw";
import DataTableNumericExample from "@/components/data-table/examples/numeric";
import numericSource from "@/components/data-table/examples/numeric.tsx?raw";
import DataTableSelectionExample from "@/components/data-table/examples/selection";
import selectionSource from "@/components/data-table/examples/selection.tsx?raw";
import DataTableSizesExample from "@/components/data-table/examples/sizes";
import sizesSource from "@/components/data-table/examples/sizes.tsx?raw";
import DataTableSortingPaginationExample from "@/components/data-table/examples/sorting-pagination";
import sortingPaginationSource from "@/components/data-table/examples/sorting-pagination.tsx?raw";
import DataTableStatesExample from "@/components/data-table/examples/states";
import statesSource from "@/components/data-table/examples/states.tsx?raw";
import DataTableStickyExample from "@/components/data-table/examples/sticky";
import stickySource from "@/components/data-table/examples/sticky.tsx?raw";
import DataTableToolbarExample from "@/components/data-table/examples/toolbar";
import toolbarSource from "@/components/data-table/examples/toolbar.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const api = (
  prop: string,
  type: string,
  defaultValue: string,
  description: string,
  required = "Нет",
): PlaygroundApiPropRow => ({ prop, type, defaultValue, required, description });

const rootApiRows: PlaygroundApiPropRow[] = [
  api("columns", "DataTableColumn<Row>[]", "—", "Описание колонок.", "Да"),
  api("rows", "Row[]", "—", "Строки данных; сортируются в памяти, если задана сортировка.", "Да"),
  api(
    "size",
    '"xs" | "s" | "m" | "l" | "xl"',
    '"m"',
    "Плотность: xs/s — строка 36, m — 44, l/xl — 52. Пробрасывается вложенным контролам и пагинации.",
  ),
  api("getRowKey", "(row, index) => React.Key", "индекс", "Стабильный ключ строки."),
  api("toolbar", "React.ReactNode", "—", "Слот над таблицей: поиск, фильтры, массовые действия."),
  api("getRowLabel", "(row) => string", "—", "Имя строки для aria-label чекбокса и шеврона."),
  api(
    "selectable",
    "boolean",
    "false",
    "Колонка чекбоксов: «выбрать все» (indeterminate), Shift+клик — диапазон, протягивание по чекбоксам, Space, объявление «Выбрано: N».",
  ),
  api(
    "selected / defaultSelected / onSelectedChange",
    "React.Key[]",
    "— / [] / —",
    "Выбранные id строк (из `getRowKey`).",
  ),
  api(
    "getRowChildren",
    "(row) => Row[] | undefined",
    "—",
    "Вложенные строки под родителем, с отступом `--dt-indent` на уровень.",
  ),
  api(
    "renderExpanded",
    "(row) => React.ReactNode",
    "—",
    "Панель деталей на всю ширину под раскрытой строкой.",
  ),
  api(
    "isRowExpandable",
    "(row) => boolean",
    "есть подстроки или renderExpanded",
    "Какие строки получают шеврон.",
  ),
  api(
    "expanded / defaultExpanded / onExpandedChange",
    "React.Key[]",
    "— / [] / —",
    "Раскрытые id строк.",
  ),
  api("onRowClick", "(row, index, event) => void", "—", "Клик по строке."),
  api(
    "loading / loadingRows",
    "boolean / number",
    "false / min(pageSize, 5)",
    "Скелетон, пока строк нет; с данными — только `aria-busy`.",
  ),
  api(
    "empty",
    "React.ReactNode",
    "labels.empty",
    "Содержимое пустого состояния (например, EmptyPage).",
  ),
  api(
    "labels",
    "Partial<DataTableLabels>",
    "русские строки",
    "loading, empty, range(from, to, total), loadingMore, scrollForMore, selectAll, selectRow(label), selectedCount(n), expand(label), collapse(label).",
  ),
  api("error", "React.ReactNode", "—", 'Заменяет тело таблицы сообщением с `role="alert"`.'),
  api(
    "sort / defaultSort / onSortChange",
    "DataTableSortState",
    "— / null / —",
    "Сортировка: `{ columnId, order }` или `null`.",
  ),
  api("page / defaultPage / onPageChange", "number", "— / 1 / —", "Текущая страница (с 1)."),
  api(
    "pageSize / showPagination / siblingCount",
    "number / boolean / number",
    "10 / true / 1",
    "Пагинация в подвале; компактна на узкой ширине.",
  ),
  api("paginationSize", "ControlSize", "= size", "Размер пагинации отдельно от таблицы."),
  api(
    "stickyHeader / stickyFirstColumn",
    "boolean",
    "false",
    "Прилипающие шапка и первая колонка.",
  ),
  api("showHeader", "boolean", "true", "Показывать `<thead>`."),
  api(
    "infiniteScroll / initialVisibleRows / infiniteBatchSize",
    "boolean / number / number",
    "false / pageSize / 20",
    "Бесконечная прокрутка вместо страниц.",
  ),
  api(
    "hasMore / loadingMore / onLoadMore",
    "boolean / boolean / () => void | Promise<void>",
    "false / false / —",
    "Подгрузка следующей порции с сервера.",
  ),
  api(
    "scrollHeight",
    "number | string",
    "360 при infiniteScroll, иначе —",
    "Макс. высота окна прокрутки (число — px). Без `infiniteScroll` задаётся только явно.",
  ),
  api("className", "string", "—", "Класс корневого элемента."),
  api(
    "dividerStyle",
    '"standard" | "dashed" | "dotted" | "none"',
    '"standard"',
    "Линии между строками.",
  ),
  api("columnDividers", "boolean", "false", "Вертикальные линии между колонками."),
  api("striped", "boolean", "false", "Зебра."),
  api(
    "highlightRowOnHover / highlightColumnOnHover",
    "boolean",
    "true / false",
    "Подсветка строки / колонки при наведении.",
  ),
  api(
    "fillWidth",
    "boolean",
    "true",
    "Таблица на всю ширину контейнера; `false` — по содержимому.",
  ),
];

const columnApiRows: PlaygroundApiPropRow[] = [
  api("id", "string", "—", "Уникальный id (сортировка, data-атрибуты).", "Да"),
  api("header", "React.ReactNode", "—", "Содержимое заголовка.", "Да"),
  api(
    "accessor",
    "keyof Row | (row) => unknown",
    "—",
    "Значение ячейки и сортировки по умолчанию.",
  ),
  api("cell", "(row) => React.ReactNode", "—", "Своя отрисовка ячейки."),
  api("numeric", "boolean", "false", "Числа: вправо и `tabular-nums`."),
  api(
    "truncate",
    "boolean",
    "false",
    "Одна строка с многоточием и `title`; ширина из `maxWidth` / `width`.",
  ),
  api(
    "sortable / sortAccessor / sortComparator",
    "boolean / (row) => unknown / (a, b, order) => number",
    "false / — / —",
    "Сортировка колонки.",
  ),
  api("align", '"start" | "center" | "end"', '"start"', "Выравнивание (у `numeric` — `end`)."),
  api("width / minWidth / maxWidth", "string", "—", "Размеры колонки."),
  api(
    "onHeaderClick / onCellClick",
    "(…) => void",
    "—",
    "Клик по заголовку / ячейке (ячейка становится кнопкой).",
  ),
];

function Demo({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: React.ReactNode;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <div className="demoBlock">
      <DemoSectionTitle>{title}</DemoSectionTitle>
      <DemoDescription>{description}</DemoDescription>
      <PlaygroundExampleFrame.Root code={code.trim()} previewLayout="stack">
        <PlaygroundExampleFrame.Stage>{children}</PlaygroundExampleFrame.Stage>
      </PlaygroundExampleFrame.Root>
    </div>
  );
}

export default function DataTableSection() {
  return (
    <PageContent.Section aria-labelledby="data-table-heading">
      <PageContent.Header>
        <PageContent.Title id="data-table-heading">Data Table</PageContent.Title>
        <PageContent.Description measure="full">
          Таблица на белой поверхности без внешней рамки: приглушённая шапка, тонкие линии между
          строками, числа вправо. Сортировка, пагинация, выбор, состояния загрузки, пустоты и
          ошибки, тулбар и адаптация до 320px.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Дашборд"
            description={
              <>
                Типичный экран: ряд метрик на <code>Card variant="stat-trend"</code> и таблица
                последних заказов с аватаром, бейджем статуса и суммами в колонке{" "}
                <code>numeric</code>.
              </>
            }
            code={dashboardSource}
          >
            <DataTableDashboardExample />
          </Demo>

          <Demo
            title="Плотность"
            description={
              <>
                Одна ось <code>size</code>: <code>xs</code>/<code>s</code> — компактная (36),{" "}
                <code>m</code> — по умолчанию (44), <code>l</code>/<code>xl</code> — просторная
                (52). Шапка — высота контрола яруса (28–48), её текст на ступень мельче ячеек.
                Чекбоксы берут ярус таблицы, бейджи — на ступень ниже.
              </>
            }
            code={sizesSource}
          >
            <DataTableSizesExample />
          </Demo>

          <Demo
            title="Числа и обрезка"
            description={
              <>
                <code>numeric</code> выравнивает вправо и включает <code>tabular-nums</code> —
                разряды встают столбиком. <code>truncate</code> с <code>maxWidth</code> держит
                длинный текст в одну строку. <code>columnDividers</code> — вертикальные линии.
              </>
            }
            code={numericSource}
          >
            <DataTableNumericExample />
          </Demo>

          <Demo
            title="Сортировка и пагинация"
            description={
              <>
                Управляемые <code>sort</code> и <code>page</code>. Заголовок сортируемой колонки —
                кнопка с <code>aria-sort</code>; в подвале — диапазон строк и{" "}
                <code>Pagination</code>.
              </>
            }
            code={sortingPaginationSource}
          >
            <DataTableSortingPaginationExample />
          </Demo>

          <Demo
            title="Выбор строк"
            description={
              <>
                <code>selectable</code> добавляет колонку чекбоксов. Shift+клик — диапазон от
                последней строки; зажмите чекбокс и ведите по соседним — все пройденные строки
                получат то же состояние. Space с клавиатуры, «выбрать все» в шапке, объявление
                «Выбрано: N». Массовые действия — в <code>toolbar</code>.
              </>
            }
            code={selectionSource}
          >
            <DataTableSelectionExample />
          </Demo>

          <Demo
            title="Вложенные строки"
            description={
              <>
                <code>getRowChildren</code> — подстроки под родителем с отступом на ширину аватара;
                шеврон с <code>aria-expanded</code> и <code>aria-controls</code>, раскрытый родитель
                выделен. <code>expanded</code> / <code>onExpandedChange</code> по id; работает с
                выбором и сортировкой.
              </>
            }
            code={nestedRowsSource}
          >
            <DataTableNestedRowsExample />
          </Demo>

          <Demo
            title="Панель деталей"
            description={
              <>
                <code>renderExpanded</code> — строка на всю ширину под раскрытой, текст по первой
                колонке контента; появление по токенам движения. С <code>stickyFirstColumn</code>{" "}
                шеврон закреплён вместе с первой колонкой.
              </>
            }
            code={detailPanelSource}
          >
            <DataTableDetailPanelExample />
          </Demo>

          <Demo
            title="Тулбар: поиск и фильтр"
            description={
              <>
                <code>toolbar</code> над таблицей: <code>Input</code>, <code>SegmentedControl</code>{" "}
                и кнопка размера <code>s</code>. Поля внутри таблицы автоматически берут фон для
                поверхности. Если фильтр ничего не нашёл — <code>empty</code>.
              </>
            }
            code={toolbarSource}
          >
            <DataTableToolbarExample />
          </Demo>

          <Demo
            title="Загрузка, пусто, ошибка"
            description={
              <>
                <code>loading</code> рисует скелетон (<code>loadingRows</code>) и объявляет{" "}
                <code>labels.loading</code>; <code>empty</code> — приглушённый текст по центру;{" "}
                <code>error</code> — сообщение с <code>role="alert"</code>, можно с кнопкой повтора.
                Для иллюстрированной пустоты используйте <code>EmptyPage</code>.
              </>
            }
            code={statesSource}
          >
            <DataTableStatesExample />
          </Demo>

          <Demo
            title="Прилипающая шапка и первая колонка"
            description={
              <>
                <code>stickyHeader</code> и <code>stickyFirstColumn</code> при прокрутке в обе
                стороны. Высота окна прокрутки — <code>scrollHeight</code>.
              </>
            }
            code={stickySource}
          >
            <DataTableStickyExample />
          </Demo>

          <Demo
            title="Бесконечная прокрутка"
            description={
              <>
                <code>infiniteScroll</code> раскрывает строки порциями, затем вызывает{" "}
                <code>onLoadMore</code>, пока <code>hasMore</code>.
              </>
            }
            code={infiniteScrollSource}
          >
            <DataTableInfiniteScrollExample />
          </Demo>

          <Demo
            title="Оформление строк"
            description={
              <>
                <code>striped</code>, <code>dividerStyle</code> (<code>none</code>,{" "}
                <code>dashed</code>, <code>dotted</code>), <code>columnDividers</code>,{" "}
                <code>highlightColumnOnHover</code> и таблица без шапки.
              </>
            }
            code={appearanceSource}
          >
            <DataTableAppearanceExample />
          </Demo>

          <Demo
            title="Ширина таблицы"
            description={
              <>
                По умолчанию <code>fillWidth</code> растягивает таблицу на всю ширину контейнера;{" "}
                <code>fillWidth=&#123;false&#125;</code> — ширина по содержимому. Колонку можно
                выровнять по центру через <code>align="center"</code>.
              </>
            }
            code={contentWidthSource}
          >
            <DataTableContentWidthExample />
          </Demo>

          <Demo
            title="Узкий контейнер (320px)"
            description={
              <>
                Колонки прокручиваются внутри, первая прилипает. Тулбар и подвал перестраиваются по
                ширине самой таблицы (container query), пагинация сворачивается в «‹ 3 / 8 ›».
              </>
            }
            code={narrowSource}
          >
            <DataTableNarrowExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>DataTable.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootApiRows} />
            <DemoApiTitle>DataTableColumn&lt;Row&gt;</DemoApiTitle>
            <PlaygroundApiTable rows={columnApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
