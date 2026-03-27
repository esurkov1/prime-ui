import { PageContent } from "@/components/page-content/PageContent";
import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import EmptyPageCanonicalSnippet from "../snippets/empty-page/canonical";
import canonicalSource from "../snippets/empty-page/canonical.tsx?raw";
import EmptyPageSizesSnippet from "../snippets/empty-page/sizes";
import sizesSource from "../snippets/empty-page/sizes.tsx?raw";
import EmptyPageTableRegionSnippet from "../snippets/empty-page/table-region";
import tableRegionSource from "../snippets/empty-page/table-region.tsx?raw";

const rootRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Шкала иконки, кегля и отступов; пробрасывается в ControlSizeProvider для дочерних контролов.",
  },
  {
    prop: "layout",
    type: '"default" | "fill"',
    defaultValue: '"default"',
    required: "Нет",
    description:
      "fill — растянуть по высоте flex-родителя (область таблицы / панели с min-height).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс корневой обёртки.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Icon, Title, Description, Actions.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "В т.ч. ref (forwardRef), aria-labelledby.",
  },
];

const iconRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс круглой подложки под иконку.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Глиф (lucide-react и т.д.).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты обёртки; для декора — aria-hidden.",
  },
];

const titleRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на h2.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Заголовок пустого состояния (не h1 страницы).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLHeadingElement>",
    defaultValue: "—",
    required: "Нет",
    description: "В т.ч. id для связи с aria-labelledby на Root.",
  },
];

const descriptionRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на p.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Поясняющий текст.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLParagraphElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты абзаца.",
  },
];

const actionsRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс flex-контейнера действий.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Button, ButtonGroup, LinkButton.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты div.",
  },
];

export default function EmptyPageSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>EmptyPage</PageContent.Title>
        <PageContent.Description measure="full">
          Центрированное пустое состояние: иконка, заголовок (<code>h2</code>), описание и действия.
          Размер <code>size</code> согласует иконку и типографику;{" "}
          <code>layout=&quot;fill&quot;</code> — для области с минимальной высотой (как тело
          таблицы).
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Канонический пример</DemoSectionTitle>
            <DemoDescription>
              Иконка, текст и одна первичная кнопка; корень с <code>aria-labelledby</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={canonicalSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <EmptyPageCanonicalSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Лестница <code>s</code>–<code>xl</code>: одна структура, разная шкала токенов.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <EmptyPageSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Область как у таблицы</DemoSectionTitle>
            <DemoDescription>
              Родитель с рамкой и <code>min-height</code>; <code>layout=&quot;fill&quot;</code>{" "}
              центрирует блок по вертикали внутри области.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={tableRegionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <EmptyPageTableRegionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>EmptyPage.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootRows} />
            <DemoApiTitle>EmptyPage.Icon</DemoApiTitle>
            <PlaygroundApiTable rows={iconRows} />
            <DemoApiTitle>EmptyPage.Title</DemoApiTitle>
            <PlaygroundApiTable rows={titleRows} />
            <DemoApiTitle>EmptyPage.Description</DemoApiTitle>
            <PlaygroundApiTable rows={descriptionRows} />
            <DemoApiTitle>EmptyPage.Actions</DemoApiTitle>
            <PlaygroundApiTable rows={actionsRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
