import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import DashboardCardFlatSnippet from "../snippets/dashboard-card/flat";
import flatSource from "../snippets/dashboard-card/flat.tsx?raw";
import DashboardCardMetricSnippet from "../snippets/dashboard-card/metric";
import metricSource from "../snippets/dashboard-card/metric.tsx?raw";
import DashboardCardMediaSnippet from "../snippets/dashboard-card/metric-media";
import metricMediaSource from "../snippets/dashboard-card/metric-media.tsx?raw";
import DashboardCardMiniSnippet from "../snippets/dashboard-card/mini";
import miniSource from "../snippets/dashboard-card/mini.tsx?raw";
import DashboardCardRowSnippet from "../snippets/dashboard-card/row";
import rowSource from "../snippets/dashboard-card/row.tsx?raw";
import DashboardCardSectionSnippet from "../snippets/dashboard-card/section";
import sectionSource from "../snippets/dashboard-card/section.tsx?raw";

const dashboardCardRootApiRows: PlaygroundApiPropRow[] = [
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
    description: "Слоты DashboardCard.* в соответствии с variant.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты корневого div (id, role, aria-*, data-*).",
  },
];

export default function DashboardCardSection() {
  return (
    <PlaygroundDocPage
      title="DashboardCard"
      headingId="dashboard-card-heading"
      description={
        <>
          Карточки для дашборда: компактные KPI, метрики с бейджем или иконкой, вариант с полосой
          для мини-графика или прогресса, и крупная секция под полноразмерные графики. Стили на
          семантических токенах; графики подключаются снаружи (слоты Media и Body).
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
              <DashboardCardMiniSnippet />
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
              <DashboardCardMetricSnippet />
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
              <DashboardCardMediaSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Section</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;section&quot;</code>: <code>SectionHeader</code> с{" "}
            <code>SectionTitle</code> и опциональным <code>SectionTrailing</code>, основной контент
            в <code>Body</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sectionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DashboardCardSectionSnippet />
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
              <DashboardCardFlatSnippet />
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
              <DashboardCardRowSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>DashboardCard.Root</DemoApiTitle>
          <DemoDescription>
            Остальные части (<code>IconBox</code>, <code>HeaderRow</code>, <code>Media</code>,{" "}
            <code>Body</code> и др.) — в <code>COMPONENT.md</code> компонента.
          </DemoDescription>
          <PlaygroundApiTable rows={dashboardCardRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
