import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import SwitchSizesSnippet from "../snippets/switch/sizes";
import sizesSource from "../snippets/switch/sizes.tsx?raw";
import SwitchStatesSnippet from "../snippets/switch/states";
import statesSource from "../snippets/switch/states.tsx?raw";

export default function SwitchSection() {
  return (
    <PlaygroundDocPage title="Switch">
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Ниже — интерактивное превью и вкладка с кодом этого примера.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <SwitchSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Ниже — интерактивное превью и вкладка с кодом этого примера.
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SwitchStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
