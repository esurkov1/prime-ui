import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import CardCoverSnippet from "../snippets/card/cover";
import coverSource from "../snippets/card/cover.tsx?raw";
import CardCtaSnippet from "../snippets/card/cta";
import ctaSource from "../snippets/card/cta.tsx?raw";
import CardFlatSnippet from "../snippets/card/flat";
import flatSource from "../snippets/card/flat.tsx?raw";
import CardListSnippet from "../snippets/card/list";
import listSource from "../snippets/card/list.tsx?raw";
import CardMetricSnippet from "../snippets/card/metric";
import metricSource from "../snippets/card/metric.tsx?raw";
import CardMiniSnippet from "../snippets/card/mini";
import miniSource from "../snippets/card/mini.tsx?raw";
import CardMiniMediaSnippet from "../snippets/card/mini-media";
import miniMediaSource from "../snippets/card/mini-media.tsx?raw";
import CardRowSnippet from "../snippets/card/row";
import rowSource from "../snippets/card/row.tsx?raw";
import CardSectionSnippet from "../snippets/card/section";
import sectionSource from "../snippets/card/section.tsx?raw";
import CardSectionContentAndChartSnippet from "../snippets/card/section-content-and-chart";
import sectionContentAndChartSource from "../snippets/card/section-content-and-chart.tsx?raw";
import CardSplitSnippet from "../snippets/card/split";
import splitSource from "../snippets/card/split.tsx?raw";
import CardStatTrendSnippet from "../snippets/card/stat-trend";
import statTrendSource from "../snippets/card/stat-trend.tsx?raw";

const cardRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"mini" | "mini-media" | "metric" | "section" | "stat-trend" | "cta" | "list" | "split" | "cover"',
    defaultValue: "—",
    required: "Да",
    description:
      "Макет: KPI, mini+media, metric, section, KPI+дельта (stat-trend), CTA, список (list), две метрики (split), обложка+cover.",
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
          Карточки для дашборда: KPI, тренды, CTA, списки событий, split-метрики, обложки и секции с
          графиками. Стили на семантических токенах; графики подключаются снаружи (слоты Media,
          Body, Chart).
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
          <DemoSectionTitle>Mini + media</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;mini-media&quot;</code>: как у mini — <code>IconBox</code>,{" "}
            <code>Stack</code> с <code>Label</code> и <code>Value</code>, плюс нижний слот{" "}
            <code>Media</code> (спарклайн, <code>ProgressBar</code>).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={miniMediaSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardMiniMediaSnippet />
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
          <DemoSectionTitle>Stat + trend</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;stat-trend&quot;</code>: крупное значение и <code>Delta</code> с{" "}
            <code>trend</code> (рост / падение / нейтрально).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statTrendSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardStatTrendSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>CTA</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;cta&quot;</code>: <code>Title</code>, <code>CtaBody</code>, внизу{" "}
            <code>Actions</code> (кнопки и ссылки).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={ctaSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardCtaSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>List</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;list&quot;</code>: <code>ListHeader</code> и <code>List</code> из{" "}
            <code>ListItem</code> — лента событий или алерты.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={listSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardListSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Split</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;split&quot;</code>: <code>Split</code> с двумя{" "}
            <code>SplitCell</code> — две связанные метрики в одной плитке.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={splitSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardSplitSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Cover</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;cover&quot;</code>: верхний слот <code>Cover</code> (медиа или
            градиент), затем <code>Stack</code> и <code>Actions</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={coverSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CardCoverSnippet />
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
