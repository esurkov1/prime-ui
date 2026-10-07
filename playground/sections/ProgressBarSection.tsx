import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import ProgressBarFileUploadExample from "@/components/progress-bar/examples/file-upload";
import barUploadSource from "@/components/progress-bar/examples/file-upload.tsx?raw";
import ProgressBarSizesExample from "@/components/progress-bar/examples/sizes";
import barSizesSource from "@/components/progress-bar/examples/sizes.tsx?raw";
import ProgressBarValuesAndTonesExample from "@/components/progress-bar/examples/values-and-tones";
import barToneSource from "@/components/progress-bar/examples/values-and-tones.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const apiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description: "Текущее значение; ограничивается `0…max`.",
  },
  { prop: "max", type: "number", defaultValue: "100", required: "Нет", description: "Верх шкалы." },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Видимая подпись и доступное имя нативного `progress`.",
  },
  {
    prop: "showValue",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Процент справа от подписи (`tabular-nums`).",
  },
  {
    prop: "tone",
    type: '"accent" | "success" | "warning" | "danger"',
    defaultValue: '"accent"',
    required: "Нет",
    description: "Цвет заполнения.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Трек 4px (xs–m) / 8px (l–xl), подпись по ярусу.",
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

export default function ProgressBarSection() {
  return (
    <PageContent.Section aria-labelledby="progress-bar-heading">
      <PageContent.Header>
        <PageContent.Title id="progress-bar-heading">ProgressBar</PageContent.Title>
        <PageContent.Description measure="full">
          Линейный прогресс на нативном <code>progress</code>: подпись, процент, статусный цвет.
          Ширина заполнения анимируется, без анимации при <code>prefers-reduced-motion</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Загрузка файлов"
            description={<>Живой пример: прогресс растёт, готовые — success, сбой — danger.</>}
            code={barUploadSource}
          >
            <ProgressBarFileUploadExample />
          </Demo>

          <Demo
            title="Значения и тона"
            description={
              <>
                0, частичное и 100; <code>tone</code> success / warning / danger; <code>max</code>{" "}
                для шкалы «3 из 5».
              </>
            }
            code={barToneSource}
          >
            <ProgressBarValuesAndTonesExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code> с <code>label</code> и <code>showValue</code>.
              </>
            }
            code={barSizesSource}
          >
            <ProgressBarSizesExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>ProgressBar.Root</DemoApiTitle>
            <PlaygroundApiTable rows={apiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
