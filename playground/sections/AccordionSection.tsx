import type * as React from "react";
import AccordionCheckoutExample from "@/components/accordion/examples/checkout";
import checkoutSource from "@/components/accordion/examples/checkout.tsx?raw";
import AccordionLayoutsExample from "@/components/accordion/examples/layouts";
import layoutsSource from "@/components/accordion/examples/layouts.tsx?raw";
import AccordionSizesExample from "@/components/accordion/examples/sizes";
import sizesSource from "@/components/accordion/examples/sizes.tsx?raw";
import AccordionStatesExample from "@/components/accordion/examples/states";
import statesSource from "@/components/accordion/examples/states.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const rootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"single" | "multiple"',
    defaultValue: '"single"',
    required: "Нет",
    description: "Один открытый пункт или несколько.",
  },
  {
    prop: "value / defaultValue",
    type: "single: string · multiple: string[]",
    defaultValue: "—",
    required: "Нет",
    description: "Открытые пункты (управляемо / начально); тип зависит от `type`.",
  },
  {
    prop: "onValueChange",
    type: "single: (value: string) => void · multiple: (value: string[]) => void",
    defaultValue: "—",
    required: "Нет",
    description: "`single` — строка (пустая, если всё закрыто), `multiple` — массив.",
  },
  {
    prop: "collapsible",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Только `single`: `false` — открытый пункт нельзя закрыть.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Высота заголовка (высота контрола + 8 для xs/s, + 16 для m/l/xl), текст, иконка и отступы.",
  },
  {
    prop: "layout",
    type: '"grouped" | "separate"',
    defaultValue: '"grouped"',
    required: "Нет",
    description: "Один блок с разделителями или отдельные карточки.",
  },
];

const partsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Accordion.Item",
    type: "value: string, disabled?: boolean",
    defaultValue: "—",
    required: "Да",
    description: "Пункт; `disabled` блокирует открытие.",
  },
  {
    prop: "Accordion.Header",
    type: "h3",
    defaultValue: "—",
    required: "Да",
    description: "Заголовок-обёртка триггера.",
  },
  {
    prop: "Accordion.Trigger",
    type: "button",
    defaultValue: "—",
    required: "Да",
    description: "Кнопка с `aria-expanded`.",
  },
  {
    prop: "Accordion.Icon",
    type: "as?: ElementType",
    defaultValue: '"div"',
    required: "Нет",
    description: "Иконка слева; панель выравнивается по подписи.",
  },
  {
    prop: "Accordion.Arrow",
    type: "icon?, openIcon?",
    defaultValue: "шеврон",
    required: "Нет",
    description: "Индикатор справа: `icon` поворачивается; с `openIcon` иконки меняются местами.",
  },
  {
    prop: "Accordion.Content",
    type: "section",
    defaultValue: "—",
    required: "Да",
    description:
      "Панель (`<section>`) с анимацией высоты; `className` ложится на внутренний блок с отступами. Поля внутри получают фон поверхности.",
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

export default function AccordionSection() {
  return (
    <PageContent.Section aria-labelledby="accordion-heading">
      <PageContent.Header>
        <PageContent.Title id="accordion-heading">Accordion</PageContent.Title>
        <PageContent.Description measure="full">
          Раскрывающиеся секции на белой поверхности: FAQ, группы настроек, шаги оформления.
          Разделители — только между пунктами, высота панели анимируется (кроме{" "}
          <code>prefers-reduced-motion</code>).
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Раскладка"
            description={
              <>
                <code>grouped</code> — один блок с тонкими линиями, <code>separate</code> —
                отдельные карточки с зазором 8px.
              </>
            }
            code={layoutsSource}
          >
            <AccordionLayoutsExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code>: заголовок = высота контрола + 8 (xs, s) или + 16
                (m, l, xl; m — 52), текст панели того же кегля, что заголовок (у l — 14 при 16).
              </>
            }
            code={sizesSource}
          >
            <AccordionSizesExample />
          </Demo>

          <Demo
            title="Иконки, multiple, disabled"
            description={
              <>
                <code>Accordion.Icon</code> слева, своя стрелка через <code>icon</code> /{" "}
                <code>openIcon</code>, управляемый <code>type="multiple"</code> и отключённый пункт.
                Фокус с клавиатуры — кольцо внутри заголовка.
              </>
            }
            code={statesSource}
          >
            <AccordionStatesExample />
          </Demo>

          <Demo
            title="Оформление заказа"
            description={
              <>
                Шаги в <code>separate</code> с <code>collapsible=&#123;false&#125;</code>. Поля в
                панели берут фон для поверхности и остаются различимыми на белом.
              </>
            }
            code={checkoutSource}
          >
            <AccordionCheckoutExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Accordion.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootApiRows} />
            <DemoApiTitle>Части</DemoApiTitle>
            <PlaygroundApiTable rows={partsApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
