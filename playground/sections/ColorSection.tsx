import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import RefColorPalette from "../snippets/color/palette";
import paletteSource from "../snippets/color/palette.tsx?raw";
import SemanticColorSwatches from "../snippets/color/semantic";
import semanticSource from "../snippets/color/semantic.tsx?raw";

export default function ColorSection() {
  return (
    <PlaygroundDocPage
      title="Color"
      description={
        <>
          Семантические токены <code>--prime-sys-color-*</code> переключаются вместе с темой
          документа (<code>data-theme</code> на <code>document.documentElement</code>). Палитра{" "}
          <code>--prime-ref-color-*</code> задаёт примитивы в <code>tokens.css</code> и обычно не
          меняется между light/dark — к ней обращаются через sys-слой.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Semantic (system)</h4>
          <p className="demoBlockDescription">
            Ниже — интерактивное превью и вкладка с кодом этого примера.
          </p>
          <PlaygroundExampleFrame.Root code={semanticSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SemanticColorSwatches />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Primitives (reference palette)</h4>
          <p className="demoBlockDescription">
            Ниже — интерактивное превью и вкладка с кодом этого примера.
          </p>
          <PlaygroundExampleFrame.Root code={paletteSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <RefColorPalette />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
