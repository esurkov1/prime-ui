import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import CardFlatSnippet from "../snippets/card/flat";
import flatSource from "../snippets/card/flat.tsx?raw";
import CardMetricSnippet from "../snippets/card/metric";
import metricSource from "../snippets/card/metric.tsx?raw";
import CardMediaSnippet from "../snippets/card/metric-media";
import metricMediaSource from "../snippets/card/metric-media.tsx?raw";
import CardMiniSnippet from "../snippets/card/mini";
import miniSource from "../snippets/card/mini.tsx?raw";
import CardRowSnippet from "../snippets/card/row";
import rowSource from "../snippets/card/row.tsx?raw";
import CardSectionSnippet from "../snippets/card/section";
import sectionSource from "../snippets/card/section.tsx?raw";
import CardSectionContentAndChartSnippet from "../snippets/card/section-content-and-chart";
import sectionContentAndChartSource from "../snippets/card/section-content-and-chart.tsx?raw";

const cardRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"mini" | "metric" | "metric-media" | "section"',
    defaultValue: "—",
    required: "Да",
    description:
      "Макет: компактная KPI-полоса, метрика с подписью, метрика с нижним медиа-слотом, секция с заголовком и телом.",
  },
  {
    prop: "flat",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Убрать тень поверхности (остаётся бордер и фон).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс корневого div.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Слоты Card.* в соответствии с variant.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты корневого div (id, role, aria-*, data-*).",
  },
];

export default function CardSection() {
  return (
    <PlaygroundDocPage
      title="Card"
      headingId="card-heading"
      description={
        <>
          Карточки для дашборда: компактные KPI, метрики с бейджем или иконкой, вариант с полосой
          для мини-графика или прогресса, и крупная секция под полноразмерные графики. Стили на
          семантических токенах; графики подключаются снаружи (слоты Media, Body, Chart).
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Mini</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;mini&quot;</code>: <code>IconBox</code> + вертикальный{" "}
            <code>Stack</code> с <code>Label</code> и <code>Value</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={miniSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardMiniSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Metric</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;metric&quot;</code>: верхний ряд <code>HeaderRow</code> —{" "}
            <code>Lead</code> (бейдж или иконка) и <code>Value</code>, ниже <code>Description</code>
            .
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={metricSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardMetricSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Metric + media</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;metric-media&quot;</code>: как метрика, плюс <code>Media</code> —
            здесь SVG-спарклайн и <code>ProgressBar</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={metricMediaSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardMediaSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Section</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;section&quot;</code>: <code>SectionHeader</code> и область{" "}
            <code>Chart</code> без внутренних полей — корень библиотеки графиков на всю ширину и
            высоту под заголовком.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sectionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardSectionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Section: контент и график</DemoSectionTitle>
          <DemoDescription>
            <code>Body</code> — текст или таблица с отступами; ниже <code>Chart</code> — график без
            полей, занимает оставшуюся высоту.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={sectionContentAndChartSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <CardSectionContentAndChartSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Плоская поверхность</DemoSectionTitle>
          <DemoDescription>
            Проп <code>flat</code> убирает тень — удобно для плотных сеток, когда достаточно
            бордера.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={flatSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardFlatSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Сетка KPI</DemoSectionTitle>
          <DemoDescription>
            Пример с классом <code>introFeatureGrid</code> из плейграунда: несколько mini-карточек в
            адаптивной сетке.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={rowSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardRowSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Card.Root</DemoApiTitle>
          <DemoDescription>
            Остальные части (<code>IconBox</code>, <code>HeaderRow</code>, <code>Media</code>,{" "}
            <code>Body</code>, <code>Chart</code> и др.) — в <code>COMPONENT.md</code> компонента.
          </DemoDescription>
          <PlaygroundApiTable rows={cardRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
