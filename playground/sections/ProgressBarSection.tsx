import { DemoDescription, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import ProgressBarLabelSnippet from "../snippets/progress/bar-label";
import progressBarLabelSource from "../snippets/progress/bar-label.tsx?raw";
import ProgressBarSizesSnippet from "../snippets/progress/bar-sizes";
import progressBarSizesSource from "../snippets/progress/bar-sizes.tsx?raw";
import ProgressBarValuesSnippet from "../snippets/progress/bar-values";
import progressBarValuesSource from "../snippets/progress/bar-values.tsx?raw";

export default function ProgressBarSection() {
  return (
    <PlaygroundDocPage title="ProgressBar">
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Ниже — интерактивное превью и вкладка с кодом этого примера.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={progressBarSizesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <ProgressBarSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Values</DemoSectionTitle>
          <DemoDescription>
            Ниже — интерактивное превью и вкладка с кодом этого примера.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={progressBarValuesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ProgressBarValuesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>With label</DemoSectionTitle>
          <DemoDescription>
            Ниже — интерактивное превью и вкладка с кодом этого примера.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={progressBarLabelSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ProgressBarLabelSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
