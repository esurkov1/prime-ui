import AllowEmptyExample from "@/components/color-swatches/examples/allow-empty";
import allowEmptySource from "@/components/color-swatches/examples/allow-empty.tsx?raw";
import InFormExample from "@/components/color-swatches/examples/in-form";
import inFormSource from "@/components/color-swatches/examples/in-form.tsx?raw";
import SizesExample from "@/components/color-swatches/examples/sizes";
import sizesSource from "@/components/color-swatches/examples/sizes.tsx?raw";
import WrappingExample from "@/components/color-swatches/examples/wrapping";
import wrappingSource from "@/components/color-swatches/examples/wrapping.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const rootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value / defaultValue",
    type: "string | null",
    defaultValue: "— / null",
    required: "Нет",
    description: "Выбранный цвет (CSS-строка из presets); null — без цвета.",
  },
  {
    prop: "onValueChange",
    type: "(value: string | null) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при выборе кликом или стрелками.",
  },
  {
    prop: "presets",
    type: "readonly ColorPreset[]",
    defaultValue: "COLOR_PRESETS",
    required: "Нет",
    description: "Образцы по порядку: { value, label }; label — доступное имя и title.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Образец = высота контрола яруса − 8: 20 · 24 · 28 · 32 · 40; зазор — gap яруса.",
  },
  {
    prop: "allowEmpty",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Образец «Без цвета» (шахматка) после пресетов, значение null.",
  },
  {
    prop: "label / required / optional / hint / error",
    type: "ReactNode / boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись, отметки и строка поддержки — как у Input и Select.",
  },
  {
    prop: "invalid / disabled",
    type: "boolean",
    defaultValue: "— / false",
    required: "Нет",
    description: "Ошибка (кольцо выбранного образца — danger) и блокировка всех образцов.",
  },
  {
    prop: "name",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Скрытый input для формы: значение цвета или пустая строка.",
  },
  {
    prop: "id / className / aria-label / aria-labelledby / aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Id и имя группы; без label группу называет aria-label или labels.group.",
  },
  {
    prop: "labels",
    type: "Partial<ColorSwatchesLabels>",
    defaultValue: '{ group: "Цвет", empty: "Без цвета", optional: "необязательно" }',
    required: "Нет",
    description: "Системные строки.",
  },
];

export default function ColorSwatchesSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Color Swatches</PageContent.Title>
        <PageContent.Description measure="full">
          Выбор цвета прямо в форме: сетка образцов без всплывающей панели. Сетка заполняет ширину
          контейнера и сама переносится на новые ряды; клавиатура — стрелки по визуальным рядам,
          Home / End. Подпись, подсказка и ошибка — как у остальных полей.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>В форме</DemoSectionTitle>
            <DemoDescription>
              Название и цвет этапа: <code>label</code> над сеткой, <code>name</code> отправляет
              цвет вместе с формой.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={inFormSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <InFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> · <code>xl</code> —
              образец 20 · 24 · 28 · 32 · 40. По умолчанию <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <SizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Без цвета</DemoSectionTitle>
            <DemoDescription>
              <code>allowEmpty</code> добавляет образец «Без цвета»; управляемое значение через{" "}
              <code>value</code> / <code>onValueChange</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={allowEmptySource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <AllowEmptyExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Перенос по ширине</DemoSectionTitle>
            <DemoDescription>
              Те же 16 цветов в широкой и узкой колонке: число колонок задаёт ширина контейнера.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={wrappingSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <WrappingExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>ColorSwatches.Root</DemoApiTitle>
            <DemoDescription>
              Группа <code>role=&quot;radiogroup&quot;</code>, образцы —{" "}
              <code>role=&quot;radio&quot;</code> с перемещаемым tabindex.
            </DemoDescription>
            <PlaygroundApiTable rows={rootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
