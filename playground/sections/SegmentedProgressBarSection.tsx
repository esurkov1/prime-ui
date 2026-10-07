import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import SegmentedProgressBarSegmentGapExample from "@/components/segmented-progress-bar/examples/segment-gap";
import segmentedGapSource from "@/components/segmented-progress-bar/examples/segment-gap.tsx?raw";
import SegmentedProgressBarSizesExample from "@/components/segmented-progress-bar/examples/sizes";
import segmentedSizesSource from "@/components/segmented-progress-bar/examples/sizes.tsx?raw";
import SegmentedProgressBarStorageDistributionExample from "@/components/segmented-progress-bar/examples/storage-distribution";
import segmentedDistributionSource from "@/components/segmented-progress-bar/examples/storage-distribution.tsx?raw";
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
    prop: "segments",
    type: "{ value: number; label?: string; tone?: Tone }[]",
    defaultValue: "—",
    required: "Да",
    description:
      "Веса сегментов (доли от суммы). Tone: accent (по умолчанию) | success | warning | danger | neutral.",
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Видимая подпись; распределение озвучивается текстом.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Как у ProgressBar.",
  },
  {
    prop: "segmentGap",
    type: '"none" | "hairline"',
    defaultValue: '"none"',
    required: "Нет",
    description: "Зазор между сегментами: none — сплошная полоса, hairline — зазор 4px.",
  },
  {
    prop: "labels",
    type: "Partial<{ empty: string; allEmpty: string }>",
    defaultValue: "русские строки",
    required: "Нет",
    description: "Доступное описание пустого распределения.",
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

export default function SegmentedProgressBarSection() {
  return (
    <PageContent.Section aria-labelledby="segmented-progress-heading">
      <PageContent.Header>
        <PageContent.Title id="segmented-progress-heading">SegmentedProgressBar</PageContent.Title>
        <PageContent.Description measure="full">
          Одна полоса из нескольких долей: занятое место по типам, статусы задач, воронка. Цвет
          дополняйте легендой — скринридер получает распределение текстом.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Хранилище"
            description={<>Распределение с легендой в карточке.</>}
            code={segmentedDistributionSource}
            surface="canvas"
          >
            <SegmentedProgressBarStorageDistributionExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code> — та же шкала, что у ProgressBar.
              </>
            }
            code={segmentedSizesSource}
          >
            <SegmentedProgressBarSizesExample />
          </Demo>

          <Demo
            title="Зазор и пустое состояние"
            description={
              <>
                <code>segmentGap</code> <code>none</code> / <code>hairline</code>; пустой массив —
                только трек.
              </>
            }
            code={segmentedGapSource}
          >
            <SegmentedProgressBarSegmentGapExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>SegmentedProgressBar.Root</DemoApiTitle>
            <PlaygroundApiTable rows={apiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
