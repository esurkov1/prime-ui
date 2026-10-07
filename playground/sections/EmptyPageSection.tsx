import type * as React from "react";

import EmptyPageDataRegionExample from "@/components/empty-page/examples/data-region";
import regionSource from "@/components/empty-page/examples/data-region.tsx?raw";
import EmptyPageIconTonesExample from "@/components/empty-page/examples/icon-tones";
import tonesSource from "@/components/empty-page/examples/icon-tones.tsx?raw";
import EmptyPageNoResultsExample from "@/components/empty-page/examples/no-results";
import searchSource from "@/components/empty-page/examples/no-results.tsx?raw";
import EmptyPageSizesExample from "@/components/empty-page/examples/sizes";
import sizesSource from "@/components/empty-page/examples/sizes.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
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
    prop: "Root · size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Плитка иконки, кегль и отступы; кнопкам в Actions передайте тот же size.",
  },
  {
    prop: "Root · layout",
    type: '"default" | "fill"',
    defaultValue: '"default"',
    required: "Нет",
    description: "`fill` растягивает блок по высоте flex-родителя и центрирует.",
  },
  {
    prop: "Icon · tone",
    type: '"neutral" | "accent" | "danger"',
    defaultValue: '"neutral"',
    required: "Нет",
    description: "Цвет плитки: нет данных / первый запуск / ошибка.",
  },
  {
    prop: "Title",
    type: "h2",
    defaultValue: "—",
    required: "Да",
    description: "Заголовок; свяжите с Root через `aria-labelledby`.",
  },
  {
    prop: "Description",
    type: "p",
    defaultValue: "—",
    required: "Нет",
    description: "Пояснение `text-secondary`.",
  },
  {
    prop: "Actions",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Ряд кнопок; главное действие последним.",
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

export default function EmptyPageSection() {
  return (
    <PageContent.Section aria-labelledby="empty-page-heading">
      <PageContent.Header>
        <PageContent.Title id="empty-page-heading">EmptyPage</PageContent.Title>
        <PageContent.Description measure="full">
          Пустое состояние с иконкой, заголовком, пояснением и действием: нет результатов, первый
          запуск, ошибка загрузки. Для короткого текста внутри таблицы хватит{" "}
          <code>DataTable empty</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Область данных"
            description={
              <>
                Карточка списка без строк: <code>layout="fill"</code> занимает оставшуюся высоту.
              </>
            }
            code={regionSource}
            surface="canvas"
          >
            <EmptyPageDataRegionExample />
          </Demo>

          <Demo
            title="Нет результатов"
            description={<>Базовый состав: Icon, Title, Description, Actions.</>}
            code={searchSource}
          >
            <EmptyPageNoResultsExample />
          </Demo>

          <Demo
            title="Тон иконки"
            description={
              <>
                <code>neutral</code> — данных нет, <code>accent</code> — первый запуск,{" "}
                <code>danger</code> — ошибка загрузки.
              </>
            }
            code={tonesSource}
          >
            <EmptyPageIconTonesExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code>; кнопкам в <code>Actions</code> передайте тот же{" "}
                <code>size</code>.
              </>
            }
            code={sizesSource}
          >
            <EmptyPageSizesExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>EmptyPage</DemoApiTitle>
            <PlaygroundApiTable rows={apiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
