import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import ProgressCircleGoalsCardExample from "@/components/progress-circle/examples/goals-card";
import circleGoalsSource from "@/components/progress-circle/examples/goals-card.tsx?raw";
import ProgressCircleSegmentsExample from "@/components/progress-circle/examples/segments";
import circleSegmentsSource from "@/components/progress-circle/examples/segments.tsx?raw";
import ProgressCircleSizesExample from "@/components/progress-circle/examples/sizes";
import circleSizesSource from "@/components/progress-circle/examples/sizes.tsx?raw";
import ProgressCircleValuesAndTonesExample from "@/components/progress-circle/examples/values-and-tones";
import circleToneSource from "@/components/progress-circle/examples/values-and-tones.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import type { PlaygroundPreviewSurface } from "../components/PlaygroundPreviewTheme";

const apiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "number",
    defaultValue: "—",
    required: "Да*",
    description: "Режим одного значения; при 0 дуга скрыта. *Либо value, либо segments.",
  },
  {
    prop: "segments",
    type: "ProgressSegment[]",
    defaultValue: "—",
    required: "Да*",
    description:
      "Режим частей целого: { value, label?, tone? } по часовой стрелке от 12 часов; длина дуги — доля от max. *Либо value, либо segments.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "100 / сумма сегментов",
    required: "Нет",
    description:
      "Верх шкалы. С segments по умолчанию — сумма частей (кольцо замкнуто); если больше суммы, остаток остаётся треком.",
  },
  {
    prop: "segmentGap",
    type: '"none" | "hairline"',
    defaultValue: '"none"',
    required: "Нет",
    description: "Только с segments: сплошное кольцо или отдельные скруглённые дуги с зазором.",
  },
  {
    prop: "labels",
    type: "Partial<ProgressCircleLabels>",
    defaultValue: "—",
    required: "Нет",
    description: "Только с segments: тексты для скринридера — empty, allEmpty.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Диаметр 24 · 32 · 48 · 64 · 80; толщина всегда 1/12 диаметра (2 · 2.7 · 4 · 5.3 · 6.7).",
  },
  {
    prop: "tone",
    type: '"accent" | "neutral" | "success" | "warning" | "danger" | "info"',
    defaultValue: '"accent"',
    required: "Нет",
    description: "Только с value: цвет дуги. У сегментов tone задаётся в каждом.",
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      'Доступное имя кольца (`role="progressbar"` или `role="group"` у сегментов); передавайте всегда.',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Содержимое в центре: процент, дробь, иконка. На xs и s не рендерится; строка или число уходит в aria-valuetext.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс корня.",
  },
];

function Demo({
  title,
  description,
  code,
  surface,
  children,
}: {
  title: string;
  description: React.ReactNode;
  code: string;
  surface?: PlaygroundPreviewSurface;
  children: React.ReactNode;
}) {
  return (
    <div className="demoBlock">
      <DemoSectionTitle>{title}</DemoSectionTitle>
      <DemoDescription>{description}</DemoDescription>
      <PlaygroundExampleFrame.Root code={code.trim()} previewLayout="stack" surface={surface}>
        <PlaygroundExampleFrame.Stage>{children}</PlaygroundExampleFrame.Stage>
      </PlaygroundExampleFrame.Root>
    </div>
  );
}

export default function ProgressCircleSection() {
  return (
    <PageContent.Section aria-labelledby="progress-circle-heading">
      <PageContent.Header>
        <PageContent.Title id="progress-circle-heading">ProgressCircle</PageContent.Title>
        <PageContent.Description measure="full">
          Круговой прогресс для компактных метрик и целей — кольцевая версия ProgressBar: одно
          значение (<code>value</code>) или части целого (<code>segments</code>), содержимое в
          центре. Толщина кольца всегда 1/12 диаметра.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Цели в карточке"
            description={
              <>
                Кольцо размера <code>m</code> с процентом и подписью рядом.
              </>
            }
            code={circleGoalsSource}
            surface="canvas"
          >
            <ProgressCircleGoalsCardExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code> — диаметры на сетке 4px; у <code>xs</code> и{" "}
                <code>s</code> текст не помещается, оставьте только <code>label</code>.
              </>
            }
            code={circleSizesSource}
          >
            <ProgressCircleSizesExample />
          </Demo>

          <Demo
            title="Значения и тона"
            description={
              <>
                0 (только трек), все тона — <code>success</code> с иконкой — и своя шкала{" "}
                <code>max</code>.
              </>
            }
            code={circleToneSource}
          >
            <ProgressCircleValuesAndTonesExample />
          </Demo>

          <Demo
            title="Части целого"
            description={
              <>
                <code>segments</code> вместо <code>value</code>, как у ProgressBar: замкнутое кольцо
                из частей, <code>max</code> — когда части занимают только долю, и{" "}
                <code>segmentGap=&quot;hairline&quot;</code> для разных категорий.
              </>
            }
            code={circleSegmentsSource}
          >
            <ProgressCircleSegmentsExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>ProgressCircle.Root</DemoApiTitle>
            <PlaygroundApiTable rows={apiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
