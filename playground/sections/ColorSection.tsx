import { PageContent } from "@/components/page-content/PageContent";
import { DemoDescription, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import RefColorPalette from "../snippets/color/palette";
import paletteSource from "../snippets/color/palette.tsx?raw";
import SemanticColorSwatches from "../snippets/color/semantic";
import semanticSource from "../snippets/color/semantic.tsx?raw";

export default function ColorSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Color</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Семантические токены <code>--prime-sys-color-*</code> переключаются вместе с темой
              документа (<code>data-theme</code> на <code>document.documentElement</code>). Палитра{" "}
              <code>--prime-ref-color-*</code> задаёт примитивы в <code>tokens.css</code> и обычно
              не меняется между light/dark — к ней обращаются через sys-слой.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Semantic (system)</DemoSectionTitle>
            <DemoDescription>
              Ниже — интерактивное превью и вкладка с кодом этого примера.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={semanticSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SemanticColorSwatches />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Primitives (reference palette)</DemoSectionTitle>
            <DemoDescription>
              Ниже — интерактивное превью и вкладка с кодом этого примера.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={paletteSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <RefColorPalette />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
