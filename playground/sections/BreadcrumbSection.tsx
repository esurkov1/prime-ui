import type * as React from "react";
import BreadcrumbCollapseExample from "@/components/breadcrumb/examples/collapse";
import collapseSource from "@/components/breadcrumb/examples/collapse.tsx?raw";
import BreadcrumbPageHeaderExample from "@/components/breadcrumb/examples/page-header";
import pageHeaderSource from "@/components/breadcrumb/examples/page-header.tsx?raw";
import BreadcrumbSizesExample from "@/components/breadcrumb/examples/sizes";
import sizesSource from "@/components/breadcrumb/examples/sizes.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const apiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Breadcrumb.Root · size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер текста и шеврона.",
  },
  {
    prop: "Breadcrumb.Root · labels",
    type: "Partial<{ nav: string; ellipsis: string }>",
    defaultValue: "русские строки",
    required: "Нет",
    description: "`aria-label` навигации и скрытый текст многоточия.",
  },
  {
    prop: "Breadcrumb.Root · …rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className и атрибуты `nav`; свой `aria-label` перекрывает `labels.nav`.",
  },
  {
    prop: "Breadcrumb.Item · href",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Ссылка (LinkButton). Без `href` — текст.",
  },
  {
    prop: "Breadcrumb.Item · current",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: 'Текущая страница: `aria-current="page"`, `text-primary`, `title` для обрезки.',
  },
  {
    prop: "Breadcrumb.Item · aria-label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Имя ссылки без видимого текста (иконка «дом»).",
  },
  {
    prop: "Breadcrumb.Item · className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс элемента `li`.",
  },
  {
    prop: "Breadcrumb.Separator",
    type: "children?, className?",
    defaultValue: "шеврон",
    required: "Нет",
    description: "Разделитель (`aria-hidden`).",
  },
  {
    prop: "Breadcrumb.Ellipsis",
    type: "className?",
    defaultValue: "—",
    required: "Нет",
    description: "Ручное «…» вместо скрытых сегментов.",
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

export default function BreadcrumbSection() {
  return (
    <PageContent.Section aria-labelledby="breadcrumb-heading">
      <PageContent.Header>
        <PageContent.Title id="breadcrumb-heading">Breadcrumb</PageContent.Title>
        <PageContent.Description measure="full">
          Путь к текущей странице. Предыдущие уровни — приглушённые ссылки, текущий — основной цвет.
          Список никогда не переносится: сегменты обрезаются, а на узкой ширине середина
          сворачивается в «…».
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Шапка страницы"
            description={
              <>
                Путь размера <code>s</code> над заголовком и действиями. Первая ссылка — иконка с{" "}
                <code>aria-label</code>.
              </>
            }
            code={pageHeaderSource}
          >
            <BreadcrumbPageHeaderExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code> — текст и шеврон по ярусу контролов.
              </>
            }
            code={sizesSource}
          >
            <BreadcrumbSizesExample />
          </Demo>

          <Demo
            title="Длинный путь и узкая ширина"
            description={
              <>
                Сегменты обрезаются многоточием; от пяти детей уже 30rem средние уровни
                сворачиваются, но остаются в дереве доступности.
              </>
            }
            code={collapseSource}
          >
            <BreadcrumbCollapseExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Breadcrumb</DemoApiTitle>
            <PlaygroundApiTable rows={apiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
