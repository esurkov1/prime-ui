import { PageContent } from "@/components/page-content/PageContent";
import { DemoDescription, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import SwitchSizesSnippet from "../snippets/switch/sizes";
import sizesSource from "../snippets/switch/sizes.tsx?raw";
import SwitchStatesSnippet from "../snippets/switch/states";
import statesSource from "../snippets/switch/states.tsx?raw";

export default function SwitchSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Switch</PageContent.Title>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Ниже — интерактивное превью и вкладка с кодом этого примера.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <SwitchSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Ниже — интерактивное превью и вкладка с кодом этого примера.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SwitchStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
