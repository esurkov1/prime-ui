import PageContentReadableExample from "@/components/page-content/examples/readable";
import readableSource from "@/components/page-content/examples/readable.tsx?raw";
import PageContentSettingsPageExample from "@/components/page-content/examples/settings-page";
import settingsSource from "@/components/page-content/examples/settings-page.tsx?raw";
import PageContentWidthsExample from "@/components/page-content/examples/widths";
import widthsSource from "@/components/page-content/examples/widths.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const rootRows: PlaygroundApiPropRow[] = [
  {
    prop: "maxWidth",
    type: '"full" | "readable" | "wide"',
    defaultValue: '"full"',
    required: "Нет",
    description:
      "Ограничение ширины контентной колонки: на всю ширину, «читаемая» колонка или шире. Управляет data-атрибутом для стилей.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на корневой обёртке.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Шапка страницы, тело, вложенные секции.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного div, включая `ref` (forwardRef).",
  },
];

const sectionRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Класс на `<section>` (регион без полей к краю колонки — поля задаёт `AppShell.Main` в `AppShell.Template`).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно `Header` + `Body` (как на маршрутах плейграунда).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного `section`, включая `ref` (forwardRef).",
  },
];

const headerRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на блоке шапки (заголовок + описание).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Обычно `PageContent.Title` и `PageContent.Description` (`measure` при необходимости).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного div.",
  },
];

const titleRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на `<h1>`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Заголовок страницы.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLHeadingElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного h1, включая `ref` (forwardRef).",
  },
];

const descriptionRows: PlaygroundApiPropRow[] = [
  {
    prop: "measure",
    type: '"readable" | "full"',
    defaultValue: '"readable"',
    required: "Нет",
    description:
      "`readable` — узкая мера (~65ch); `full` — на всю ширину родителя (когда колонку уже ограничивает `AppShell.Main` или задан `PageContent.Root` с `maxWidth`).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на `<p>` описания.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Вводный текст под заголовком.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLParagraphElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного p, включая `ref` (forwardRef).",
  },
];

const actionsRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Кнопки страницы (зазор 8 px). Справа от заголовка, пока ему хватает места; иначе под ним.",
  },
  {
    prop: "className / …rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного div.",
  },
];

const bodyRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на обёртке основного содержимого.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Контент страницы под шапкой.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного div.",
  },
];

export default function PageContentSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>PageContent</PageContent.Title>
        <PageContent.Description measure="full">
          Разметка страницы внутри <code>AppShell.Main</code>: <code>Section</code> или{" "}
          <code>Root</code> (с <code>maxWidth</code>), шапка с <code>Title</code> (
          <code>&lt;h1&gt;</code>, heading-m), <code>Description</code> и <code>Actions</code>,
          затем <code>Body</code>. Шапка → тело — 32 px, блоки тела — 40 px. Своих полей к краю
          колонки у PageContent нет — их задаёт <code>AppShell.Main</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Страница настроек</DemoSectionTitle>
            <DemoDescription>
              <code>PageContent.Actions</code> внутри <code>Header</code> стоят справа от заголовка
              и переносятся под него на узкой колонке (без брейкпоинтов). Карточки в{" "}
              <code>Body</code> идут с шагом 40 px. Фон рамки имитирует <code>AppShell.Main</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={settingsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PageContentSettingsPageExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Колонка для чтения</DemoSectionTitle>
            <DemoDescription>
              <code>PageContent.Root maxWidth=&quot;readable&quot;</code> держит строку около 65
              знаков; <code>Description</code> по умолчанию тоже в мере чтения.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={readableSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PageContentReadableExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ширина колонки</DemoSectionTitle>
            <DemoDescription>
              <code>maxWidth</code> на <code>PageContent.Root</code>: <code>full</code> (по
              умолчанию) — вся ширина <code>main</code>, <code>wide</code> — не шире{" "}
              <code>--prime-layout-content-max-width</code>, <code>readable</code> — мера чтения.
              Разница видна на широком экране.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={widthsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PageContentWidthsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>PageContent.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootRows} />
            <DemoApiTitle>PageContent.Section</DemoApiTitle>
            <PlaygroundApiTable rows={sectionRows} />
            <DemoApiTitle>PageContent.Header</DemoApiTitle>
            <PlaygroundApiTable rows={headerRows} />
            <DemoApiTitle>PageContent.Title</DemoApiTitle>
            <PlaygroundApiTable rows={titleRows} />
            <DemoApiTitle>PageContent.Description</DemoApiTitle>
            <PlaygroundApiTable rows={descriptionRows} />
            <DemoApiTitle>PageContent.Actions</DemoApiTitle>
            <PlaygroundApiTable rows={actionsRows} />
            <DemoApiTitle>PageContent.Body</DemoApiTitle>
            <PlaygroundApiTable rows={bodyRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
