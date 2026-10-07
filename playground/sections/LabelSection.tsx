import LabelInFormExample from "@/components/label/examples/in-form";
import labelCompositionSource from "@/components/label/examples/in-form.tsx?raw";
import LabelMarkersExample from "@/components/label/examples/markers";
import labelMarkersSource from "@/components/label/examples/markers.tsx?raw";
import LabelSizesExample from "@/components/label/examples/sizes";
import labelSizesSource from "@/components/label/examples/sizes.tsx?raw";
import LabelStatesExample from "@/components/label/examples/states";
import labelStatesSource from "@/components/label/examples/states.tsx?raw";
import LabelWithIconExample from "@/components/label/examples/with-icon";
import labelWithIconSource from "@/components/label/examples/with-icon.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const labelRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер парного поля. Кегль: xs/s 12/16 · m 13/20 · l/xl 14/20, вес 500.",
  },
  {
    prop: "htmlFor",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "id связанного контрола. Для кастомных контролов — id лейбла + aria-labelledby.",
  },
  {
    prop: "required",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description:
      "Добавляет красную звёздочку (aria-hidden). Нативный required ставьте на сам контрол.",
  },
  {
    prop: "optional",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Приглушённая пометка после текста из labels.optional.",
  },
  {
    prop: "labels",
    type: "Partial<LabelLabels>",
    defaultValue: '{ optional: "необязательно" }',
    required: "Нет",
    description: "Системные строки: текст пометки optional.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Цвет text-disabled для текста и маркеров, aria-disabled.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "size">',
    defaultValue: "—",
    required: "Нет",
    description: "id, className и прочие атрибуты label; ref передаётся на <label>.",
  },
];

const labelPartsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Label.Sub",
    type: "HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "—",
    description: "Приглушённое уточнение в той же строке: единицы, контекст.",
  },
  {
    prop: "Label.Icon",
    type: "HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "—",
    description: "Слот ведущей иконки; передаёт size лейбла в Icon через контекст.",
  },
];

export default function LabelSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Label</PageContent.Title>
        <PageContent.Description measure="full">
          Название поля формы — нативный <code>&lt;label&gt;</code>. Input, Textarea и Slider рисуют
          его сами через проп <code>label</code>; отдельный <code>Label</code> нужен над Select,
          DigitInput и кастомными контролами. Плейсхолдер лейбл не заменяет.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Берите тот же <code>size</code>, что у поля. Пары <code>xs</code>/<code>s</code> и{" "}
              <code>l</code>/<code>xl</code> совпадают по кеглю — различие в высоте самого поля.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={labelSizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <LabelSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Обязательные и необязательные</DemoSectionTitle>
            <DemoDescription>
              <code>required</code> добавляет красную <code>*</code>, <code>optional</code> —
              пометку «необязательно» (текст меняется через <code>labels.optional</code>).{" "}
              <code>Label.Sub</code> — уточнение в той же строке. В форме отмечайте меньшинство:
              если почти всё обязательно — помечайте необязательные, и наоборот.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={labelMarkersSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <LabelMarkersExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Лейбл не реагирует на наведение и фокус сам — клик по нему фокусирует связанное поле.{" "}
              <code>disabled</code> приглушает текст вместе со звёздочкой и пометкой.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={labelStatesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <LabelStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>С иконкой</DemoSectionTitle>
            <DemoDescription>
              <code>Label.Icon</code> — приглушённая иконка перед текстом в размере лейбла.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={labelWithIconSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <LabelWithIconExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция: форма приглашения</DemoSectionTitle>
            <DemoDescription>
              Встроенные лейблы Input рядом с отдельным <code>Label</code> над Select выглядят
              одинаково: тот же кегль, отступ до поля <code>--prime-control-m-label-gap</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={labelCompositionSource.trim()}
              previewLayout="stack-center"
              surface="canvas"
            >
              <PlaygroundExampleFrame.Stage>
                <LabelInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Label.Root</DemoApiTitle>
            <PlaygroundApiTable rows={labelRootApiRows} />
            <DemoApiTitle>Части</DemoApiTitle>
            <PlaygroundApiTable rows={labelPartsApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
