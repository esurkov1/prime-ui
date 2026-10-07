import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import ProgressBarFileUploadExample from "@/components/progress-bar/examples/file-upload";
import barUploadSource from "@/components/progress-bar/examples/file-upload.tsx?raw";
import ProgressSegmentsExample from "@/components/progress-bar/examples/segments";
import barSegmentsSource from "@/components/progress-bar/examples/segments.tsx?raw";
import ProgressBarSizesExample from "@/components/progress-bar/examples/sizes";
import barSizesSource from "@/components/progress-bar/examples/sizes.tsx?raw";
import ProgressBarStorageDistributionExample from "@/components/progress-bar/examples/storage-distribution";
import barStorageSource from "@/components/progress-bar/examples/storage-distribution.tsx?raw";
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
    required: "Да*",
    description:
      "Режим одного значения: текущее значение, ограничивается `0…max`. *Либо value, либо segments.",
  },
  {
    prop: "segments",
    type: "ProgressSegment[]",
    defaultValue: "—",
    required: "Да*",
    description:
      "Режим частей целого: { value, label?, tone? } по порядку; ширина части — её доля от max. *Либо value, либо segments.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "100 / сумма сегментов",
    required: "Нет",
    description:
      "Верх шкалы. С segments по умолчанию — сумма частей (заполняют всю полосу); если больше суммы, остаток остаётся дорожкой.",
  },
  {
    prop: "segmentGap",
    type: '"none" | "hairline"',
    defaultValue: '"none"',
    required: "Нет",
    description: "Только с segments: сплошная полоса или отдельные капсулы с зазором ¾ толщины.",
  },
  {
    prop: "labels",
    type: "Partial<ProgressBarLabels>",
    defaultValue: "—",
    required: "Нет",
    description: "Только с segments: тексты для скринридера — empty, allEmpty.",
  },
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
    type: '"accent" | "neutral" | "success" | "warning" | "danger" | "info"',
    defaultValue: '"accent"',
    required: "Нет",
    description: "Только с value: цвет заполнения. У сегментов tone задаётся в каждом.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Толщина линии --prime-control-<tier>-track (4–8px), та же шкала, что у Slider; подпись по ярусу.",
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
          Линейный прогресс: одно значение (<code>value</code>, нативный <code>progress</code>) или
          части целого (<code>segments</code>). Заполнение — капсула со скруглённым концом поверх
          дорожки; значение плавно переезжает, без анимации при <code>prefers-reduced-motion</code>.
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
                0, частичное и 100; <code>tone</code> neutral / success / warning / danger / info;{" "}
                <code>max</code> для шкалы «3 из 5».
              </>
            }
            code={barToneSource}
          >
            <ProgressBarValuesAndTonesExample />
          </Demo>

          <Demo
            title="Части целого"
            description={
              <>
                <code>segments</code> вместо <code>value</code>: сплошная полоса для этапов одного
                процесса, <code>segmentGap=&quot;hairline&quot;</code> для разных категорий,{" "}
                <code>max</code> — когда части заполняют только долю шкалы.
              </>
            }
            code={barSegmentsSource}
          >
            <ProgressSegmentsExample />
          </Demo>

          <Demo
            title="Хранилище по типам"
            description={
              <>
                Карточка с легендой: части — типы файлов, <code>max</code> — объём диска, свободное
                место остаётся дорожкой.
              </>
            }
            code={barStorageSource}
          >
            <ProgressBarStorageDistributionExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code> с <code>label</code> и <code>showValue</code>:
                толщина линии растёт по ярусу, та же шкала, что у Slider.
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
