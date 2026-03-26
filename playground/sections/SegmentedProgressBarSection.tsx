import { DemoDescription, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import SegmentedDistributionSnippet from "../snippets/progress/segmented-distribution";
import segmentedDistributionSource from "../snippets/progress/segmented-distribution.tsx?raw";
import SegmentedGapSnippet from "../snippets/progress/segmented-gap";
import segmentedGapSource from "../snippets/progress/segmented-gap.tsx?raw";
import SegmentedSizesSnippet from "../snippets/progress/segmented-sizes";
import segmentedSizesSource from "../snippets/progress/segmented-sizes.tsx?raw";

export default function SegmentedProgressBarSection() {
  return (
    <PlaygroundDocPage title="SegmentedProgressBar">
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Распределение</DemoSectionTitle>
          <DemoDescription>
            Веса сегментов задают доли от суммы — как проценты, если сумма 100.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={segmentedDistributionSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <SegmentedDistributionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>Та же шкала высоты трека, что у ProgressBar.</DemoDescription>
          <PlaygroundExampleFrame.Root
            code={segmentedSizesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <SegmentedSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Зазор между сегментами</DemoSectionTitle>
          <DemoDescription>
            По умолчанию <code>none</code> — сплошная полоса; <code>hairline</code> — тонкий
            разделитель 1px между сегментами.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={segmentedGapSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SegmentedGapSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
