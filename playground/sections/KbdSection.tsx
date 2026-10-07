import KbdInControlsExample from "@/components/kbd/examples/in-controls";
import inControlsSource from "@/components/kbd/examples/in-controls.tsx?raw";
import KbdModifierKeysExample from "@/components/kbd/examples/modifier-keys";
import modifierKeysSource from "@/components/kbd/examples/modifier-keys.tsx?raw";
import KbdShortcutListExample from "@/components/kbd/examples/shortcut-list";
import shortcutListSource from "@/components/kbd/examples/shortcut-list.tsx?raw";
import KbdSizesExample from "@/components/kbd/examples/sizes";
import sizesSource from "@/components/kbd/examples/sizes.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { SurfaceGallery } from "../components/ExampleSurface";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const kbdRootApiRows = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: "контекст или «m»",
    required: "Нет",
    description:
      "Ярус бейджа: высота 16 · 20 · 24 · 28 · 32. Без пропа внутри контрола — на ступень ниже его размера (m → s), вне контрола — «m». data-size — размер контрола, data-tier — визуальный ярус.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс для элемента kbd.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Подпись клавиши или иконка (размер иконки — по ярусу клавиши).",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLElement>, "size">',
    defaultValue: "—",
    required: "Нет",
    description: "title, hidden, aria-*, data-*, ref и прочие атрибуты нативного kbd.",
  },
] as const;

export default function KbdSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Kbd</PageContent.Title>
        <PageContent.Description measure="full">
          Подпись клавиши: нативный <code>&lt;kbd&gt;</code>, моноширинный шрифт на полупрозрачной
          утопленной подложке без обводки. Размеры <code>xs</code>–<code>xl</code> — ярусы бейджа;
          внутри кнопки, поля или пункта меню клавиша сама берёт ярус на ступень ниже контрола.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> · <code>xl</code> —
              высота 16 · 20 · 24 · 28 · 32, по умолчанию <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <KbdSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Внутри кнопки и поля</DemoSectionTitle>
            <DemoDescription>
              Без <code>size</code> клавиша следует ярусу контрола на ступень ниже: в кнопке{" "}
              <code>s</code> — <code>xs</code>, в <code>m</code> — <code>s</code>, в <code>l</code>{" "}
              — <code>m</code>. Явный <code>size</code> перекрывает контекст.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={inControlsSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <KbdInControlsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния и поверхности</DemoSectionTitle>
            <DemoDescription>
              Пропов <code>disabled</code> или <code>loading</code> нет — это подпись, а не контрол.
              Для символов ⌘ ⌥ ⇧ добавьте <code>aria-label</code> или <code>title</code>. Подложка
              полупрозрачная и читается на любой поверхности.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={modifierKeysSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery>
                  <KbdModifierKeysExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Справка по горячим клавишам: сочетание — по одному <code>Kbd.Root</code> на клавишу,
              иконка и текст могут стоять в одной клавише.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={shortcutListSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <KbdShortcutListExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Kbd.Root</DemoApiTitle>
            <DemoDescription>
              Семантический <code>kbd</code>; передаёт ярус вложенным иконкам.
            </DemoDescription>
            <PlaygroundApiTable rows={[...kbdRootApiRows]} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
