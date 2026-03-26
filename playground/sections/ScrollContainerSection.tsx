import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";

const rootRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: '"div" | "main" | "aside" | "section" | "nav" | "article"',
    defaultValue: '"div"',
    required: "Нет",
    description: "Корневой элемент (например main для основной колонки страницы).",
  },
  {
    prop: "axis",
    type: '"vertical" | "horizontal" | "both"',
    defaultValue: '"vertical"',
    required: "Нет",
    description: "Ось прокрутки: только по Y, только по X или обе.",
  },
  {
    prop: "touch",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      "Включает -webkit-overflow-scrolling: touch (удобно для вложенных скроллов на iOS).",
  },
  {
    prop: "overscrollBehavior",
    type: '"auto" | "contain" | "none"',
    defaultValue: '"contain"',
    required: "Нет",
    description: "Значение overscroll-behavior (вложенные панели — обычно contain).",
  },
  {
    prop: "flexItem",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      "min-height/min-width: 0 — чтобы скролл работал внутри flex/grid без переполнения.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс (рядом с визуальными стилями компонента-хоста).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое прокручиваемой области.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного элемента, включая ref (forwardRef → HTMLElement).",
  },
];

export default function ScrollContainerSection() {
  return (
    <PlaygroundDocPage
      title="ScrollContainer"
      description={
        <>
          Обёртка с едиными правилами прокрутки: ось, overscroll, touch и flex-item. Используется
          внутри <code>PageShell.ContentArea</code>, панелей Dropdown/Select/Popover, теле Drawer,
          вьюпорте DataTable, списке Command Menu и оверлее Command Menu. Отдельных превью в разделе
          примеров нет — это инфраструктурный узел.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>API</h4>
          <h5>ScrollContainer</h5>
          <PlaygroundApiTable rows={rootRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
