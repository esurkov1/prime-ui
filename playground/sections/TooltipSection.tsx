import { PageContent } from "@/components/page-content/PageContent";
import TooltipAlignExample from "@/components/tooltip/examples/align";
import tooltipAlignSource from "@/components/tooltip/examples/align.tsx?raw";
import TooltipCompositionExample from "@/components/tooltip/examples/composition";
import tooltipCompositionSource from "@/components/tooltip/examples/composition.tsx?raw";
import TooltipControlledExample from "@/components/tooltip/examples/controlled";
import tooltipControlledSource from "@/components/tooltip/examples/controlled.tsx?raw";
import TooltipDelayExample from "@/components/tooltip/examples/delay";
import tooltipDelaySource from "@/components/tooltip/examples/delay.tsx?raw";
import TooltipLongContentExample from "@/components/tooltip/examples/long-content";
import tooltipLongContentSource from "@/components/tooltip/examples/long-content.tsx?raw";
import TooltipSideExample from "@/components/tooltip/examples/side";
import tooltipSideSource from "@/components/tooltip/examples/side.tsx?raw";
import TooltipSizesExample from "@/components/tooltip/examples/sizes";
import tooltipSizesSource from "@/components/tooltip/examples/sizes.tsx?raw";
import TooltipStatesExample from "@/components/tooltip/examples/states";
import tooltipStatesSource from "@/components/tooltip/examples/states.tsx?raw";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const tooltipProviderApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "delayDuration",
    type: "number",
    defaultValue: "400",
    required: "нет",
    description: "Задержка перед показом подсказки после наведения или фокуса (мс).",
  },
  {
    prop: "skipDelayDuration",
    type: "number",
    defaultValue: "300",
    required: "нет",
    description:
      "Окно (мс) после закрытия подсказки, в которое соседняя открывается сразу и без анимации.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "да",
    description: "Дерево с экземплярами Tooltip.Root внутри.",
  },
];

const tooltipRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "да",
    description: "Внутри — Tooltip.Trigger и Tooltip.Content одного экземпляра.",
  },
  {
    prop: "open",
    type: "boolean",
    defaultValue: "—",
    required: "нет",
    description: "Контролируемое открытие; вместе с onOpenChange.",
  },
  {
    prop: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    required: "нет",
    description: "Начальное состояние в неконтролируемом режиме.",
  },
  {
    prop: "delayDuration",
    type: "number",
    defaultValue: "из Provider (400)",
    required: "Нет",
    description: "Задержка показа в мс для одной подсказки.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    defaultValue: "—",
    required: "нет",
    description: "Вызывается при смене видимости (наведение, фокус, программное управление).",
  },
];

const tooltipTriggerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactElement",
    defaultValue: "—",
    required: "да",
    description:
      "Ровно один фокусируемый элемент; его ref сохраняется, обработчики указателя и фокуса добавляются через cloneElement.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "нет",
    description: "Дополнительный класс на триггере (сливается с className ребёнка).",
  },
];

const tooltipContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "да",
    description: 'Текст или разметка; рендер в портале с role="tooltip" и id из контекста Root.',
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "нет",
    description: "Масштаб оформления; дочерние контролы оборачиваются в ControlSizeProvider.",
  },
  {
    prop: "side",
    type: '"top" | "bottom" | "left" | "right"',
    defaultValue: '"top"',
    required: "нет",
    description:
      "Предпочитаемая сторона; без места — противоположная, затем сдвиг внутрь окна. Стрелка всегда смотрит на центр триггера.",
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    defaultValue: '"center"',
    required: "нет",
    description: "Выравнивание вдоль триггера: по его началу, центру или концу.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "нет",
    description: "Дополнительный CSS-класс на контейнере подсказки.",
  },
];

export default function TooltipSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Tooltip</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Короткая подсказка рядом с элементом: появляется после паузы при наведении или фокусе,
              позиционируется относительно триггера и не перекрывает его клики (у слоя выключены
              события указателя). Размер текста и отступы задаются на контенте; задержку показа
              можно задать один раз для области страницы через провайдер.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> на <code>Tooltip.Content</code> — <code>xs</code>–<code>xl</code>:
              xs–m набраны caption (12/16), l и xl — body-s (13/20). Берите размер элемента, к
              которому относится подсказка. По умолчанию — <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={tooltipSizesSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <TooltipSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>На разных поверхностях</DemoSectionTitle>
            <DemoDescription>
              Вариантов нет: подсказка — плоская инверсная плашка без тени со стрелкой к центру
              триггера (<code>--prime-color-tooltip-bg</code>), поэтому одинаково читается на
              холсте, в карточке и на плавающем слое.
            </DemoDescription>
            <SurfaceGallery>
              <TooltipLongContentExample />
            </SurfaceGallery>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Подсказка открывается по наведению и по фокусу с клавиатуры, закрывается по Escape и
              уходу фокуса. У нативно отключённой кнопки нет событий указателя — оберните её в
              фокусируемый <code>span</code>, чтобы объяснить, почему действие недоступно. Для
              терминов в тексте подойдёт кнопка без оформления.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={tooltipStatesSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <TooltipStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Расположение</DemoSectionTitle>
            <DemoDescription>
              Проп <code>side</code> на <code>Tooltip.Content</code>: <code>top</code>,{" "}
              <code>bottom</code>, <code>left</code>, <code>right</code>. Если места нет, подсказка
              переворачивается на противоположную сторону и сдвигается на 8 px от края.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={tooltipSideSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <TooltipSideExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Выравнивание</DemoSectionTitle>
            <DemoDescription>
              <code>align</code> на <code>Tooltip.Content</code> — <code>start</code>,{" "}
              <code>center</code>, <code>end</code>: плашка выравнивается по краю или центру
              триггера, стрелка при этом всегда смотрит на его центр.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={tooltipAlignSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <TooltipAlignExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              <code>open</code> и <code>onOpenChange</code> на <code>Tooltip.Root</code>:
              переключатель и наведение на триггер меняют одно и то же состояние.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={tooltipControlledSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <TooltipControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Панель форматирования: квадратные кнопки только с иконкой, у каждой{" "}
              <code>aria-label</code>; подсказка повторяет название и показывает сочетание клавиш в{" "}
              <code>Kbd</code>. Один <code>Tooltip.Provider</code> на всю панель: после первой
              подсказки соседние открываются сразу и без анимации, будто одна подсказка меняет
              текст.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={tooltipCompositionSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <TooltipCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Задержка</DemoSectionTitle>
            <DemoDescription>
              <code>delayDuration</code> на <code>Tooltip.Provider</code> (для всей области) или на
              отдельном <code>Tooltip.Root</code>. По умолчанию — 400 мс.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={tooltipDelaySource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <TooltipDelayExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Длинный текст</DemoSectionTitle>
            <DemoDescription>
              Текст переносится по <code>--prime-tooltip-max-width</code> и никогда не шире окна
              минус 16 px. Для длинных пояснений с действиями используйте Popover.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={tooltipLongContentSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <TooltipLongContentExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Tooltip.Provider</DemoApiTitle>
            <DemoDescription>
              Задаёт задержку появления для всех вложенных <code>Tooltip.Root</code> на этом участке
              дерева.
            </DemoDescription>
            <PlaygroundApiTable rows={tooltipProviderApiRows} />
            <DemoApiTitle>Tooltip.Root</DemoApiTitle>
            <DemoDescription>
              Хранит открытие/закрытие, ссылку на триггер и стабильный <code>id</code> для связи с
              контентом.
            </DemoDescription>
            <PlaygroundApiTable rows={tooltipRootApiRows} />
            <DemoApiTitle>Tooltip.Trigger</DemoApiTitle>
            <DemoDescription>
              Клонирует единственного ребёнка и вешает обработчики показа и снятия подсказки.
            </DemoDescription>
            <PlaygroundApiTable rows={tooltipTriggerApiRows} />
            <DemoApiTitle>Tooltip.Content</DemoApiTitle>
            <DemoDescription>
              Портальный слой с подсказкой, позиционирование от триггера и обновление при скролле и
              ресайзе.
            </DemoDescription>
            <PlaygroundApiTable rows={tooltipContentApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
