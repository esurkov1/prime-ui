import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import PaginationControlledSnippet from "../snippets/pagination/controlled";
import paginationControlledSource from "../snippets/pagination/controlled.tsx?raw";
import PaginationFeaturesSnippet from "../snippets/pagination/features";
import paginationFeaturesSource from "../snippets/pagination/features.tsx?raw";
import PaginationFullWidthSnippet from "../snippets/pagination/full-width";
import paginationFullWidthSource from "../snippets/pagination/full-width.tsx?raw";
import PaginationRangeModesSnippet from "../snippets/pagination/range-modes";
import paginationRangeModesSource from "../snippets/pagination/range-modes.tsx?raw";
import PaginationSizesSnippet from "../snippets/pagination/sizes";
import paginationSizesSource from "../snippets/pagination/sizes.tsx?raw";
import PaginationStatesSnippet from "../snippets/pagination/states";
import paginationStatesSource from "../snippets/pagination/states.tsx?raw";

const paginationRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "page",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description:
      "Текущая страница (1 … totalPages); значение ограничивается диапазоном при расчёте.",
  },
  {
    prop: "totalPages",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description: "Число страниц. При значении меньше 1 компонент ничего не рендерит.",
  },
  {
    prop: "onPageChange",
    type: "(page: number) => void",
    defaultValue: "—",
    required: "Да",
    description: "Вызывается при выборе номера страницы или нажатии «назад» / «вперёд».",
  },
  {
    prop: "siblingCount",
    type: "number",
    defaultValue: "1",
    required: "Нет",
    description: "Сколько номеров страниц показывать слева и справа от текущей в сокращённом ряду.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Размер кнопок номеров и стрелок; многоточие подстраивается под тот же ярус токенов.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс для корневого <nav>.",
  },
];

export default function PaginationSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Pagination</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Переключение страниц длинного списка: стрелки «назад» и «вперёд», номера и сокращение
              ряда многоточием, когда страниц много. Текущая страница выделяется; границы списка
              отключают лишние переходы.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Четыре значения <code>size</code> — <code>s</code>, <code>m</code>, <code>l</code>,{" "}
              <code>xl</code>; на длинном диапазоне видны и стрелки, и номера, и ячейка с «…» в
              одном масштабе.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={paginationSizesSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <PaginationSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Диапазон номеров</DemoSectionTitle>
            <DemoDescription>
              При не больше семи страницах показываются все номера подряд; при большем — края (1 и
              последняя) и «окно» вокруг текущей с «…». Отдельного пропа нет: поведение задаёт{" "}
              <code>totalPages</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={paginationRangeModesSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <PaginationRangeModesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              На первой странице отключена кнопка «назад», на последней — «вперёд»; при{" "}
              <code>totalPages=1</code> неактивны обе. Текущая страница помечается{" "}
              <code>aria-current=&quot;page&quot;</code> и визуально выделяется.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={paginationStatesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PaginationStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              Компонент только контролируемый: нужны <code>page</code> и <code>onPageChange</code>.
              Состояние живёт у родителя; можно синхронизировать его с таблицей, запросом или
              другими кнопками.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={paginationControlledSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <PaginationControlledSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Full width</DemoSectionTitle>
            <DemoDescription>
              Растянуть блок на ширину колонки или панели — обёртка с <code>width: 100%</code> и
              выравниванием (например подпись слева, пагинация справа). У{" "}
              <code>Pagination.Root</code> отдельного пропа ширины нет.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={paginationFullWidthSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <PaginationFullWidthSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
            <DemoDescription>
              <code>siblingCount</code> сужает или расширяет окно номеров вокруг активной страницы.
              При <code>totalPages</code> меньше 1 возвращается <code>null</code> (не рендерится
              разметка навигации).
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={paginationFeaturesSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <PaginationFeaturesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Pagination.Root</DemoApiTitle>
            <DemoDescription>
              Обертка-навигация с кнопками страниц и стрелками; внутри используются{" "}
              <code>Button.Root</code> и иконки направления.
            </DemoDescription>
            <PlaygroundApiTable rows={paginationRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
