import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import ProgressCircleGoalsCardExample from "@/components/progress-circle/examples/goals-card";
import circleGoalsSource from "@/components/progress-circle/examples/goals-card.tsx?raw";
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
    required: "Да",
    description: "Текущее значение; при 0 дуга скрыта.",
  },
  { prop: "max", type: "number", defaultValue: "100", required: "Нет", description: "Верх шкалы." },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Диаметр 24 · 32 · 48 · 64 · 80, толщина 3–8.",
  },
  {
    prop: "tone",
    type: '"accent" | "success" | "warning" | "danger"',
    defaultValue: '"accent"',
    required: "Нет",
    description: "Цвет дуги.",
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: '`aria-label` для `role="progressbar"`; обязателен без видимой подписи.',
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
          Круговой прогресс для компактных метрик и целей: трек, дуга со скруглёнными концами и
          содержимое в центре.
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
                0 (только трек), <code>accent</code>, <code>success</code> с иконкой,{" "}
                <code>warning</code>, <code>danger</code> и своя шкала <code>max</code>.
              </>
            }
            code={circleToneSource}
          >
            <ProgressCircleValuesAndTonesExample />
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
