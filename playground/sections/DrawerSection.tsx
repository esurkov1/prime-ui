import DrawerCompositionExample from "@/components/drawer/examples/composition";
import compositionSource from "@/components/drawer/examples/composition.tsx?raw";
import DrawerControlledExample from "@/components/drawer/examples/controlled";
import controlledSource from "@/components/drawer/examples/controlled.tsx?raw";
import DrawerFeaturesExample from "@/components/drawer/examples/features";
import featuresSource from "@/components/drawer/examples/features.tsx?raw";
import DrawerSizesExample from "@/components/drawer/examples/sizes";
import sizesSource from "@/components/drawer/examples/sizes.tsx?raw";
import DrawerStatesExample from "@/components/drawer/examples/states";
import statesSource from "@/components/drawer/examples/states.tsx?raw";
import DrawerVariantsSidesExample from "@/components/drawer/examples/variants-sides";
import variantsSidesSource from "@/components/drawer/examples/variants-sides.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import {
  dialogAriaApiRows,
  dialogBodyApiRows,
  dialogFooterApiRows,
  dialogHeaderApiRows,
  dialogIconApiRows,
  dialogRootApiRows,
  dialogSlotApiRows,
  dialogTextApiRows,
} from "./dialogApiRows";

const drawerContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "side",
    type: '"left" | "right"',
    defaultValue: '"right"',
    required: "Нет",
    description: "Край, с которого выезжает панель.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ширина 360 · 480 · 640 · 800 px; уже 640 px экрана — на всю ширину.",
  },
  ...dialogAriaApiRows,
];

export default function DrawerSection() {
  return (
    <PageContent.Section aria-labelledby="drawer-heading">
      <PageContent.Header>
        <PageContent.Title id="drawer-heading">Drawer</PageContent.Title>
        <PageContent.Description measure="full">
          Модальная боковая панель для фильтров, форм и деталей записи. Те же части, что у Modal:
          шапка и подвал закреплены и отделены еле заметными линиями, прокручивается только тело.
          Закрытие по Escape, крестику и клику на подложку. Для подтверждений используйте Modal.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code>: <code>s</code> 360 · <code>m</code> 480 (по умолчанию) ·{" "}
              <code>l</code> 640 · <code>xl</code> 800 px. Уже 640 px панель всегда занимает всю
              ширину экрана и теряет скругления.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DrawerSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Панель настроек с формой</DemoSectionTitle>
            <DemoDescription>
              Поля в теле получают заливку «на поверхности» и размер <code>m</code>, группы полей —
              шаг 20 px. В подвале под линией — «Отмена» и «Сохранить» с <code>loading</code>, по
              умолчанию справа (<code>layout=&quot;end&quot;</code>).
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={compositionSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DrawerCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Сторона выезда</DemoSectionTitle>
            <DemoDescription>
              <code>side=&quot;right&quot;</code> (по умолчанию) — детали и формы,{" "}
              <code>side=&quot;left&quot;</code> — фильтры и навигация.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={variantsSidesSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DrawerVariantsSidesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Без подвала</DemoSectionTitle>
            <DemoDescription>
              Без <code>Drawer.Footer</code> нижней зоны нет — панель только для просмотра. Иконка в
              шапке с <code>tone=&quot;success&quot;</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DrawerStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Длинное содержимое</DemoSectionTitle>
            <DemoDescription>
              Тело прокручивается между закреплёнными шапкой и подвалом; линии отмечают их границы.
              Описание под заголовком — body-s, приглушённым цветом.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DrawerFeaturesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              <code>open</code> и <code>onOpenChange</code> на <code>Drawer.Root</code> — открыть
              можно из любого места, например из ссылки. Фокус после закрытия возвращается к
              открывшему элементу. <code>layout=&quot;fill&quot;</code> растягивает кнопку подвала.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={controlledSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DrawerControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Drawer.Root</DemoApiTitle>
            <PlaygroundApiTable rows={dialogRootApiRows("Drawer")} />
            <DemoApiTitle>Drawer.Content</DemoApiTitle>
            <PlaygroundApiTable rows={drawerContentApiRows} />
            <DemoApiTitle>Drawer.Header</DemoApiTitle>
            <PlaygroundApiTable rows={dialogHeaderApiRows} />
            <DemoApiTitle>Drawer.Icon</DemoApiTitle>
            <PlaygroundApiTable rows={dialogIconApiRows} />
            <DemoApiTitle>Drawer.Title · Drawer.Description</DemoApiTitle>
            <PlaygroundApiTable rows={dialogTextApiRows} />
            <DemoApiTitle>Drawer.Body</DemoApiTitle>
            <PlaygroundApiTable rows={dialogBodyApiRows} />
            <DemoApiTitle>Drawer.Footer</DemoApiTitle>
            <PlaygroundApiTable rows={dialogFooterApiRows('"end"')} />
            <DemoApiTitle>Drawer.Trigger · Drawer.Close</DemoApiTitle>
            <PlaygroundApiTable rows={dialogSlotApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
