import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import TabsControlledExample from "@/components/tabs/examples/controlled";
import controlledSource from "@/components/tabs/examples/controlled.tsx?raw";
import TabsHorizontalExample from "@/components/tabs/examples/horizontal";
import horizontalSource from "@/components/tabs/examples/horizontal.tsx?raw";
import TabsSizesExample from "@/components/tabs/examples/sizes";
import sizesSource from "@/components/tabs/examples/sizes.tsx?raw";
import TabsStatesExample from "@/components/tabs/examples/states";
import statesSource from "@/components/tabs/examples/states.tsx?raw";
import TabsTwoLineExample from "@/components/tabs/examples/two-line";
import twoLineSource from "@/components/tabs/examples/two-line.tsx?raw";
import TabsVerticalExample from "@/components/tabs/examples/vertical";
import verticalSource from "@/components/tabs/examples/vertical.tsx?raw";
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
    prop: "value / defaultValue",
    type: "string",
    defaultValue: '— / ""',
    required: "Нет",
    description: "Активная вкладка (управляемо / начально).",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Смена вкладки.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус: высота как у Button / Input того же размера.",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    required: "Нет",
    description:
      "Направление списка и стрелок. Вертикальный список уже 600px контейнера встаёт над панелью рядом.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс корня.",
  },
];

const partsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Tabs.List",
    type: "children, className, aria-label",
    defaultValue: "—",
    required: "Да",
    description: '`role="tablist"`; не переносится — прокручивается с затуханием края.',
  },
  {
    prop: "Tabs.Trigger",
    type: "value, disabled?, children",
    defaultValue: "—",
    required: "Да",
    description: 'Вкладка (`role="tab"`, roving tabindex).',
  },
  {
    prop: "Tabs.Icon / Tabs.Label",
    type: "children, className",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка (у активной — `accent-text`) и подпись.",
  },
  {
    prop: "Tabs.Count",
    type: "color?: PaletteColor, children, className",
    defaultValue: '"gray"',
    required: "Нет",
    description: "Счётчик — мягкий бейдж на ярус ниже, цифры моноширинные.",
  },
  {
    prop: "Tabs.Description",
    type: "children, className",
    defaultValue: "—",
    required: "Нет",
    description:
      "Вторая строка (body-s, приглушённая); делает вкладку двухстрочной и становится `aria-describedby`.",
  },
  {
    prop: "Tabs.Panel",
    type: "value, children, className",
    defaultValue: "—",
    required: "Нет",
    description: 'Содержимое вкладки (`role="tabpanel"`).',
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

export default function TabsSection() {
  return (
    <PageContent.Section aria-labelledby="tabs-heading">
      <PageContent.Header>
        <PageContent.Title id="tabs-heading">Tabs</PageContent.Title>
        <PageContent.Description measure="full">
          Навигация между панелями содержимого одного экрана. Горизонтальные вкладки — текст на
          тонкой линии с акцентной полосой под активной, вертикальные — «таблетки» сбоку от панели.
          Чтобы выбрать значение или режим (период, вид списка), используйте SegmentedControl.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Подчёркивание"
            description={
              <>
                Полоса под текстом активной вкладки скользит к выбранной; её толщина растёт с
                размером (2–4px, половина линии ProgressBar). Наведение — шаг цвета текста, активная
                — <code>text-primary</code> и medium; ширина вкладки при этом не меняется.
              </>
            }
            code={horizontalSource}
          >
            <TabsHorizontalExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code>. В каждой строке — вкладки и Button одного размера:
                высота вкладки равна высоте контрола яруса.
              </>
            }
            code={sizesSource}
          >
            <TabsSizesExample />
          </Demo>

          <Demo
            title="Иконки, disabled, переполнение"
            description={
              <>
                <code>Tabs.Icon</code> + <code>Tabs.Label</code>; отключённая вкладка пропускается
                стрелками. В контейнере 375px список прокручивается с затуханием краёв, выбранная
                вкладка прокручивается в поле зрения.
              </>
            }
            code={statesSource}
          >
            <TabsStatesExample />
          </Demo>

          <Demo
            title="Управляемые со счётчиками"
            description={
              <>
                <code>value</code> + <code>onValueChange</code>; бейдж внутри вкладки задаёт
                количество.
              </>
            }
            code={controlledSource}
          >
            <TabsControlledExample />
          </Demo>

          <Demo
            title="Двухстрочные"
            description={
              <>
                <code>Tabs.Label</code> + <code>Tabs.Count</code> + <code>Tabs.Description</code>:
                вкладки по содержимому, полоса под текстом активной; на узком экране ряд
                прокручивается. Выбор режима или фильтра с такими же строками — в SegmentedControl.
              </>
            }
            code={twoLineSource}
          >
            <TabsTwoLineExample />
          </Demo>

          <Demo
            title="Вертикальные: настройки"
            description={
              <>
                <code>orientation="vertical"</code> в карточке: вкладки-«таблетки» без линии,
                навигация ↑ ↓, заголовок раздела на одной линии с первой вкладкой. Уже 600px
                контейнера вкладки встают сверху.
              </>
            }
            code={verticalSource}
            surface="canvas"
          >
            <TabsVerticalExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Tabs.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootApiRows} />
            <DemoApiTitle>Части</DemoApiTitle>
            <PlaygroundApiTable rows={partsApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
