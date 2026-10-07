import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import PaginationCompactExample from "@/components/pagination/examples/compact";
import compactSource from "@/components/pagination/examples/compact.tsx?raw";
import PaginationListFooterExample from "@/components/pagination/examples/list-footer";
import listFooterSource from "@/components/pagination/examples/list-footer.tsx?raw";
import PaginationSizesExample from "@/components/pagination/examples/sizes";
import sizesSource from "@/components/pagination/examples/sizes.tsx?raw";
import PaginationStatesExample from "@/components/pagination/examples/states";
import statesSource from "@/components/pagination/examples/states.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const paginationRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value / defaultValue",
    type: "number",
    defaultValue: "— / 1",
    required: "Нет",
    description: "Текущая страница (с 1), управляемо / начально; ограничивается `1…totalPages`.",
  },
  {
    prop: "totalPages",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description: "Число страниц; при значении меньше 1 ничего не рендерится.",
  },
  {
    prop: "onValueChange",
    type: "(page: number) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Выбор страницы или стрелки.",
  },
  {
    prop: "siblingCount",
    type: "number",
    defaultValue: "1",
    required: "Нет",
    description: "Сколько номеров по бокам от текущей при `totalPages > 7`.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус контролов: высота как у Button / Input того же размера.",
  },
  {
    prop: "compact",
    type: 'boolean | "auto"',
    defaultValue: "false",
    required: "Нет",
    description: '«Текущая / всего» вместо номеров; `"auto"` — по ширине контейнера.',
  },
  {
    prop: "labels",
    type: "Partial<PaginationLabels>",
    defaultValue: "русские строки",
    required: "Нет",
    description:
      "Тексты для скринридеров: nav, previous, next, page(n), of. `labels.nav` задаёт `aria-label` навигации.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс корневого `nav`.",
  },
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

export default function PaginationSection() {
  return (
    <PageContent.Section aria-labelledby="pagination-heading">
      <PageContent.Header>
        <PageContent.Title id="pagination-heading">Pagination</PageContent.Title>
        <PageContent.Description measure="full">
          Навигация по страницам: стрелки, номера с многоточием и компактный вид «3 / 12» для узких
          мест. Кнопки — ghost, текущая страница — <code>accent-soft</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Подвал списка"
            description={
              <>
                Диапазон записей, выбор количества на странице и пагинация одного размера{" "}
                <code>s</code> в одном ряду; на узкой ширине ряд переносится.
              </>
            }
            code={listFooterSource}
          >
            <PaginationListFooterExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code>. Рядом — Button того же размера: высоты совпадают
                (28 · 32 · 36 · 40 · 48).
              </>
            }
            code={sizesSource}
          >
            <PaginationSizesExample />
          </Demo>

          <Demo
            title="Состояния и диапазон"
            description={
              <>
                Отключённые стрелки на краях, без многоточия до 7 страниц, окно вокруг текущей —{" "}
                <code>siblingCount</code>.
              </>
            }
            code={statesSource}
          >
            <PaginationStatesExample />
          </Demo>

          <Demo
            title="Компактный вид"
            description={
              <>
                <code>compact</code> всегда показывает «текущая / всего»;{" "}
                <code>compact="auto"</code> переключается сам по ширине контейнера — так работает
                подвал DataTable на мобильных.
              </>
            }
            code={compactSource}
          >
            <PaginationCompactExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Pagination.Root</DemoApiTitle>
            <PlaygroundApiTable rows={paginationRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
