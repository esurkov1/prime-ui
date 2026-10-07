import { PageContent } from "@/components/page-content/PageContent";
import ScrollContainerBothAxesExample from "@/components/scroll-container/examples/both-axes";
import bothAxesSource from "@/components/scroll-container/examples/both-axes.tsx?raw";
import ScrollContainerEdgeFadeExample from "@/components/scroll-container/examples/edge-fade";
import edgeFadeSource from "@/components/scroll-container/examples/edge-fade.tsx?raw";
import ScrollContainerListExample from "@/components/scroll-container/examples/list";
import listSource from "@/components/scroll-container/examples/list.tsx?raw";
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
    prop: "overscrollBehavior",
    type: '"auto" | "contain" | "none"',
    defaultValue: '"contain"',
    required: "Нет",
    description: "Значение overscroll-behavior (вложенные панели — обычно contain).",
  },
  {
    prop: "fade",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      'Затухание края, за которым скрыто содержимое: по X при `axis="horizontal"`, иначе по Y.',
  },
  {
    prop: "scrollbar",
    type: '"thin" | "hidden"',
    defaultValue: '"thin"',
    required: "Нет",
    description: "`hidden` убирает полосу прокрутки — только вместе с `fade`.",
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
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>ScrollContainer</PageContent.Title>
        <PageContent.Description measure="full">
          Область прокрутки с тонким скроллбаром и едиными правилами: ось,{" "}
          <code>overscroll-behavior</code> и всегда <code>min-width/min-height: 0</code>, чтобы
          сжиматься внутри flex/grid. На ней построены тело Modal и Drawer, панели Select, Dropdown
          и Popover, список CommandMenu и вьюпорт DataTable.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Вертикальная и горизонтальная прокрутка</DemoSectionTitle>
            <DemoDescription>
              Слева список в карточке фиксированной высоты: прокрутка сжимается внутри flex-колонки,{" "}
              <code>overscrollBehavior=&quot;contain&quot;</code> не прокручивает страницу в конце
              списка. Справа — <code>axis=&quot;horizontal&quot;</code> для ленты фильтров.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={listSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ScrollContainerListExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Две оси и передача прокрутки</DemoSectionTitle>
            <DemoDescription>
              <code>axis=&quot;both&quot;</code> — широкая сетка прокручивается по X и Y.{" "}
              <code>overscrollBehavior=&quot;auto&quot;</code> — в конце списка прокрутка переходит
              странице (по умолчанию <code>contain</code> её останавливает).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={bothAxesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ScrollContainerBothAxesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Затухание краёв</DemoSectionTitle>
            <DemoDescription>
              <code>fade</code> растворяет край, за которым есть скрытое содержимое;{" "}
              <code>scrollbar=&quot;hidden&quot;</code> убирает полосу у компактной ленты.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={edgeFadeSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ScrollContainerEdgeFadeExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>ScrollContainer</DemoApiTitle>
            <PlaygroundApiTable rows={rootRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
