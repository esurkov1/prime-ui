import DividerCompositionExample from "@/components/divider/examples/composition";
import compositionSource from "@/components/divider/examples/composition.tsx?raw";
import DividerSizesExample from "@/components/divider/examples/sizes";
import sizesSource from "@/components/divider/examples/sizes.tsx?raw";
import DividerVariantsExample from "@/components/divider/examples/variants";
import variantsSource from "@/components/divider/examples/variants.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const dividerRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    required: "Нет",
    description:
      "Горизонтальная линия на всю ширину ряда или вертикальная между соседями в flex-ряду.",
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    defaultValue: '"center"',
    required: "Нет",
    description:
      "Где стоит подпись на линии; start — подпись у начала без линии перед ней (заголовок секции), end — у конца.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Размер окружающего контента; подпись, отступ и иконка берутся из ступени: xs 12/16 · иконка 14, s 12/16 · 16, m 13/20 · 16, l 14/20 · 20, xl 16/24 · 20.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Подпись или иконка с текстом; без children — сплошная линия. Размер Icon внутри задаёт разделитель, а не проп size иконки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корня.",
  },
  {
    prop: "role",
    type: "string",
    defaultValue: '"separator"',
    required: "Нет",
    description:
      "По умолчанию separator (вертикальный получает aria-orientation); для декоративной линии в списке — presentation.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "aria-*, data-*, on* и прочие атрибуты корневого div.",
  },
];

export default function DividerSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Divider</PageContent.Title>
        <PageContent.Description measure="full">
          Тонкая линия цвета <code>border-subtle</code>, горизонтальная или вертикальная, при
          необходимости с подписью или иконкой. Это единственное место, где в системе появляются
          линии: строки списка, группы в панели, «или» между вариантами. Карточки и панели линией не
          отделяются — только заливкой и отступами.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Варианты</DemoSectionTitle>
            <DemoDescription>
              Пустая линия или подпись в линии (<code>align</code> start · center · end;{" "}
              <code>start</code> — заголовок секции), линия в колонке с <code>gap</code>,{" "}
              <code>orientation=&quot;vertical&quot;</code> — между группами в ряду.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DividerVariantsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> · <code>xl</code> —
              размер окружающего контента; подпись, отступ и иконка растут со ступенью:{" "}
              <code>xs</code> и <code>s</code> — 12/16, <code>m</code> — 13/20, <code>l</code> —
              14/20, <code>xl</code> — 16/24.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DividerSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Вход с альтернативой «или», заголовок секции с иконкой и линии между строками списка
              настроек (<code>role=&quot;presentation&quot;</code> — список уже размечен).
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={compositionSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DividerCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Divider.Root</DemoApiTitle>
            <DemoDescription>
              Единственный узел: контейнер с линиями-псевдоэлементами и необязательным{" "}
              <code>span</code> для children.
            </DemoDescription>
            <PlaygroundApiTable rows={dividerRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
