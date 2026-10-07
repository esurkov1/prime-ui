import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import StepperNarrowExample from "@/components/stepper/examples/narrow";
import narrowSource from "@/components/stepper/examples/narrow.tsx?raw";
import StepperOrientationExample from "@/components/stepper/examples/orientation";
import orientationSource from "@/components/stepper/examples/orientation.tsx?raw";
import StepperSizesExample from "@/components/stepper/examples/sizes";
import sizesSource from "@/components/stepper/examples/sizes.tsx?raw";
import StepperStatesExample from "@/components/stepper/examples/states";
import statesSource from "@/components/stepper/examples/states.tsx?raw";
import StepperWizardExample from "@/components/stepper/examples/wizard";
import wizardSource from "@/components/stepper/examples/wizard.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import type { PlaygroundPreviewSurface } from "../components/PlaygroundPreviewTheme";

const rootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"vertical"',
    required: "Нет",
    description: "Раскладка; горизонтальный уже 30rem сам становится вертикальным.",
  },
  {
    prop: "…rest",
    type: "React.OlHTMLAttributes<HTMLOListElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты `<ol>`: aria-label, id, data-* и т.д.",
  },
  {
    prop: "value / defaultValue",
    type: "number",
    defaultValue: "— / 0",
    required: "Нет",
    description: "Индекс текущего шага (с 0); из него считаются статусы по умолчанию.",
  },
  {
    prop: "onValueChange",
    type: "(index: number) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Клик по шагу выбирает его.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус: индикатор 20–36, текст контрола.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс `<ol>`.",
  },
];

const partsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Stepper.Step",
    type: "status?, disabled?, …button",
    defaultValue: "—",
    required: "Да",
    description:
      "Шаг-кнопка, прямой потомок Root (номер — по порядку). `status`: pending | active | completed | error.",
  },
  {
    prop: "Stepper.Indicator",
    type: "children?, className?",
    defaultValue: "номер / галочка",
    required: "Нет",
    description: "Кружок с номером; свой контент — например «!» для ошибки.",
  },
  {
    prop: "Stepper.Content · Title · Description",
    type: "children, className?",
    defaultValue: "—",
    required: "Да",
    description: "Колонка текста: подпись и пояснение (`text-muted`).",
  },
  {
    prop: "Stepper.Arrow",
    type: "className?",
    defaultValue: "шеврон",
    required: "Нет",
    description:
      "Стрелка справа в вертикальной строке. Шевроны между горизонтальными шагами Root рисует сам.",
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

export default function StepperSection() {
  return (
    <PageContent.Section aria-labelledby="stepper-heading">
      <PageContent.Header>
        <PageContent.Title id="stepper-heading">Stepper</PageContent.Title>
        <PageContent.Description measure="full">
          Шаги многоэтапного процесса: оформление, онбординг, мастер настройки. Горизонтальный и
          вертикальный вид, статусы pending / active / completed / error; на узкой ширине
          горизонтальный степпер сам перестраивается в колонку.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Мастер подключения"
            description={
              <>
                Вертикальный степпер в карточке рядом с формой шага. Дальние шаги отключены, пока не
                пройден предыдущий.
              </>
            }
            code={wizardSource}
            surface="canvas"
          >
            <StepperWizardExample />
          </Demo>

          <Demo
            title="Ориентация"
            description={
              <>
                <code>horizontal</code> (шевроны между шагами добавляются сами) и{" "}
                <code>vertical</code> с описаниями и <code>Arrow</code>. Статусы считаются из{" "}
                <code>value</code>, клик по шагу — <code>onValueChange</code>.
              </>
            }
            code={orientationSource}
          >
            <StepperOrientationExample />
          </Demo>

          <Demo
            title="Статусы"
            description={
              <>
                Явный <code>status</code> на шаге: completed — галочка на <code>accent-soft</code>,
                active — акцент с ореолом, error — <code>danger</code>, pending — серый;{" "}
                <code>disabled</code> блокирует шаг.
              </>
            }
            code={statesSource}
          >
            <StepperStatesExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code>: индикатор 20 · 24 · 28 · 32 · 36.
              </>
            }
            code={sizesSource}
          >
            <StepperSizesExample />
          </Demo>

          <Demo
            title="Узкий контейнер (320px)"
            description={
              <>
                Уже 30rem собственной ширины горизонтальный степпер встаёт в колонку, разделители
                скрываются.
              </>
            }
            code={narrowSource}
          >
            <StepperNarrowExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Stepper.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootApiRows} />
            <DemoApiTitle>Части</DemoApiTitle>
            <PlaygroundApiTable rows={partsApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
