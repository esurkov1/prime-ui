import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import DrawerCompositionSnippet from "../snippets/drawer/composition";
import compositionSource from "../snippets/drawer/composition.tsx?raw";
import DrawerControlledSnippet from "../snippets/drawer/controlled";
import controlledSource from "../snippets/drawer/controlled.tsx?raw";
import DrawerFeaturesSnippet from "../snippets/drawer/features";
import featuresSource from "../snippets/drawer/features.tsx?raw";
import DrawerFullWidthSnippet from "../snippets/drawer/full-width";
import fullWidthSource from "../snippets/drawer/full-width.tsx?raw";
import DrawerResponsiveSnippet from "../snippets/drawer/responsive";
import responsiveSource from "../snippets/drawer/responsive.tsx?raw";
import DrawerSizesSnippet from "../snippets/drawer/sizes";
import sizesSource from "../snippets/drawer/sizes.tsx?raw";
import DrawerStatesSnippet from "../snippets/drawer/states";
import statesSource from "../snippets/drawer/states.tsx?raw";
import DrawerTriggerLinkSnippet from "../snippets/drawer/trigger-link";
import triggerLinkSource from "../snippets/drawer/trigger-link.tsx?raw";
import DrawerVariantsSidesSnippet from "../snippets/drawer/variants-sides";
import variantsSidesSource from "../snippets/drawer/variants-sides.tsx?raw";

const drawerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "open",
    type: "boolean",
    defaultValue: "—",
    required: "Да",
    description: "Контролируемое состояние открытия.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    defaultValue: "—",
    required: "Да",
    description: "Вызывается на Esc, клик по overlay, крестик и внешние действия.",
  },
  {
    prop: "title",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Заголовок в шапке.",
  },
  {
    prop: "description",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подзаголовок в шапке.",
  },
  {
    prop: "icon",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка слева в шапке.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Контент body внутри ScrollContainer.",
  },
  {
    prop: "footer",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Нижняя зона действий.",
  },
  {
    prop: "side",
    type: '"left" | "right"',
    defaultValue: '"right"',
    required: "Нет",
    description: "Сторона выезда панели.",
  },
];

export default function DrawerSection() {
  return (
    <PageContent.Section aria-labelledby="drawer-heading">
      <PageContent.Header>
        <PageContent.Title id="drawer-heading">Drawer</PageContent.Title>
        <PageContent.Description measure="full">
          Боковая панель с фиксированной шапкой и футером, прокруткой в body, закрытием по Escape и
          клику на подложку, а также анимацией slide-in и slide-out.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Сторона выезда</DemoSectionTitle>
            <DemoDescription>Проп side поддерживает left и right.</DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsSidesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DrawerVariantsSidesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>Открытие и закрытие полностью управляются снаружи.</DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DrawerControlledSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>Форма в body и кнопки в footer.</DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DrawerCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>С вариантами footer и без footer.</DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DrawerStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Full width</DemoSectionTitle>
            <DemoDescription>Вертикальный стек fullWidth-кнопок в footer.</DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DrawerFullWidthSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Адаптив</DemoSectionTitle>
            <DemoDescription>Ширина панели ограничена значением min(28rem, 90vw).</DemoDescription>
            <PlaygroundExampleFrame.Root code={responsiveSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DrawerResponsiveSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Дополнительно</DemoSectionTitle>
            <DemoDescription>
              Открытие по ссылке, длинный body и альтернативные компоновки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={triggerLinkSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DrawerTriggerLinkSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DrawerFeaturesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DrawerSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Drawer</DemoApiTitle>
            <DemoDescription>Единый компонент вместо compound API.</DemoDescription>
            <PlaygroundApiTable rows={drawerApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
