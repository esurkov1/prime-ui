import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { DemoApiTitle, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";

const rootRows: PlaygroundApiPropRow[] = [
  {
    prop: "fillViewport",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Если true, корневой слой растягивается на высоту вьюпорта (типично для shell приложения с фиксированным сайдбаром и прокручиваемым main).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корневой `<div>`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно `PageShell.NavArea` + `PageShell.ContentArea`.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного div, включая `ref` (forwardRef).",
  },
];

const navAreaRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на `<aside>` области навигации.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Сайдбар, дерево меню и т.п.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного aside.",
  },
];

const contentAreaRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на `<main>`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Основной контент страницы.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного main, включая `ref` (forwardRef).",
  },
];

export default function PageShellSection() {
  return (
    <PlaygroundDocPage
      title="PageShell"
      description={
        <>
          Каркас страницы приложения: корневой контейнер и две области — боковая навигация (
          <code>NavArea</code>) и основная колонка (<code>ContentArea</code> как{" "}
          <code>&lt;main&gt;</code>). В этом плейграунде оболочка используется в{" "}
          <code>PlaygroundLayout</code>. Отдельных интерактивных примеров нет: это чисто структурная
          разметка и токены отступов из CSS Modules.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>PageShell.Root</DemoApiTitle>
          <PlaygroundApiTable rows={rootRows} />
          <DemoApiTitle>PageShell.NavArea</DemoApiTitle>
          <PlaygroundApiTable rows={navAreaRows} />
          <DemoApiTitle>PageShell.ContentArea</DemoApiTitle>
          <PlaygroundApiTable rows={contentAreaRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
