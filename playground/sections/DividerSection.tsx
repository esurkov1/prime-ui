import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import DividerCompositionSnippet from "../snippets/divider/composition";
import compositionSource from "../snippets/divider/composition.tsx?raw";
import DividerSizesSnippet from "../snippets/divider/sizes";
import sizesSource from "../snippets/divider/sizes.tsx?raw";
import DividerVariantsSnippet from "../snippets/divider/variants";
import variantsSource from "../snippets/divider/variants.tsx?raw";

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
    defaultValue: "center для variant default, start для variant text",
    required: "Нет",
    description:
      "Где оставить короткую «заглушку» линии относительно подписи (псевдоэлементы до/после контента).",
  },
  {
    prop: "variant",
    type: '"default" | "line-spacing" | "text"',
    defaultValue: '"default"',
    required: "Нет",
    description:
      "default — подпись между линиями или пустая линия; line-spacing — маркер в колонке с gap; text — стиль заголовка секции.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус токенов контрола: зазор, кегль подписи (variant text), отступы и размер иконки в children.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Подпись или разметка с иконкой; без children — сплошная линия. У Icon внутри не задаётся size-класс — габариты из токена разделителя (`--prime-divider-icon`).",
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
    description: "Роль в DOM; для декоративной линии часто задают presentation и aria-hidden.",
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
    <PlaygroundDocPage
      title="Divider"
      description={
        <>
          Линия и подпись между блоками: <code>default</code>, <code>line-spacing</code>,{" "}
          <code>text</code>, размеры <code>s</code>–<code>xl</code>. У каждого примера внизу есть
          короткая подсказка — на неё и смотрите. Роль по умолчанию <code>separator</code>.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Варианты</DemoSectionTitle>
          <DemoDescription>
            Один блок: пустая линия, подпись по центру, заголовок секции, маркер между строками,
            вертикальный разделитель, линия в списке.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DividerVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>Три ступени — s, m, xl — для сравнения кегля подписи.</DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DividerSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Иконка и текст</DemoSectionTitle>
          <DemoDescription>
            Внутри разделителя иконка и подпись выравниваются в ряд с отступом <code>gap</code> из
            токенов размера.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DividerCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Divider.Root</DemoApiTitle>
          <DemoDescription>
            Единственный публичный узел: контейнер с псевдоэлементами-линиями и опциональным{" "}
            <code>span</code> для children.
          </DemoDescription>
          <PlaygroundApiTable rows={dividerRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
