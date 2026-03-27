import { PageContent } from "@/components/page-content/PageContent";
import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { DemoApiTitle, DemoSectionTitle } from "../components/PlaygroundDemoTypography";

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
      "Класс на `<section>` (регион без полей к краю колонки — поля задаёт `AppShell.MainInset` в `AppShell.Template`).",
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
      "`readable` — узкая мера (~65ch); `full` — на всю ширину родителя (когда колонку уже inset’ит `AppShell.MainInset` или задан `PageContent.Root` с `maxWidth`).",
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
          {
            <>
              Семантическая разметка контентной колонки: <code>PageContent.Section</code> (регион
              страницы без собственных внешних полей к краю колонки), <code>PageContent.Root</code>{" "}
              (<code>maxWidth</code> и структура шапки/тела; краевые поля колонки даёт{" "}
              <code>AppShell.MainInset</code> внутри <code>AppShell.Template</code>),{" "}
              <code>Title</code> → <code>&lt;h1&gt;</code>, <code>Description</code> с{" "}
              <code>measure=&quot;readable&quot; | &quot;full&quot;</code>, <code>Body</code>. Поля
              у контентной колонки — в ките (<code>AppShell.Template</code>), без дублирующей
              обёртки в плейграунде.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
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
            <DemoApiTitle>PageContent.Body</DemoApiTitle>
            <PlaygroundApiTable rows={bodyRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
