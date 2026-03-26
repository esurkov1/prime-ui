import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import SegmentedCompositionSnippet from "../snippets/progress/segmented-composition";
import segmentedCompositionSource from "../snippets/progress/segmented-composition.tsx?raw";
import SegmentedSizesSnippet from "../snippets/progress/segmented-sizes";
import segmentedSizesSource from "../snippets/progress/segmented-sizes.tsx?raw";

const segmentedProgressBarRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "segments",
    type: "SegmentedProgressSegment[]",
    defaultValue: "—",
    required: "Да",
    description:
      "Массив сегментов: value (вес ≥ 0), опционально label и tone; доли считаются от суммы value.",
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись над полосой; добавляется к автоматическому aria-label группы.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Высота трека и кегль подписи (как у ProgressBar).",
  },
  {
    prop: "ariaLabel",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: 'Имя для role="img"; перекрывает строку по умолчанию из сегментов.',
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на внешней обёртке.",
  },
  {
    prop: "ref",
    type: "React.Ref<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Ref на корневой div.",
  },
];

export default function SegmentedProgressBarSection() {
  return (
    <PlaygroundDocPage
      title="SegmentedProgressBar"
      description={
        <>
          Горизонтальная полоса из цветных сегментов: ширина сегментов пропорциональна значениям{" "}
          <code>value</code> (сумма может быть любой — отображаются доли). Для одного числа
          завершения используйте <code>ProgressBar</code> или <code>ProgressCircle</code>.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Одинаковые доли при <code>s</code>–<code>xl</code>: меняется только высота трека.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={segmentedSizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SegmentedSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состав и тона</DemoSectionTitle>
          <DemoDescription>
            Пример 30% / 25% / 35% / 10% с подписью и семантическими тонами <code>danger</code>,{" "}
            <code>pending</code>, <code>success</code>, <code>neutral</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={segmentedCompositionSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <SegmentedCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoApiTitle>SegmentedProgressBar.Root</DemoApiTitle>
          <PlaygroundApiTable rows={segmentedProgressBarRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
