import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { DemoApiTitle, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";

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
    description: "Обычно `PageContent.Title` и `PageContent.Description`.",
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
    <PlaygroundDocPage
      title="PageContent"
      description={
        <>
          Семантическая разметка и типографика контентной колонки: заголовок страницы (
          <code>Title</code> → <code>&lt;h1&gt;</code>), описание, тело. Компонент{" "}
          <code>PlaygroundDocPage</code> в этом репозитории собирает шапку из{" "}
          <code>PageContent.Header</code> / <code>Body</code> без дублирования внешних отступов
          main. Отдельных превью в разделе примеров нет — это вспомогательный layout для экранов и
          документации.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>PageContent.Root</DemoApiTitle>
          <PlaygroundApiTable rows={rootRows} />
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
    </PlaygroundDocPage>
  );
}
