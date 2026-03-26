import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import TooltipCompositionSnippet from "../snippets/tooltip/composition";
import tooltipCompositionSource from "../snippets/tooltip/composition.tsx?raw";
import TooltipControlledSnippet from "../snippets/tooltip/controlled";
import tooltipControlledSource from "../snippets/tooltip/controlled.tsx?raw";
import TooltipDelaySnippet from "../snippets/tooltip/delay";
import tooltipDelaySource from "../snippets/tooltip/delay.tsx?raw";
import TooltipLongContentSnippet from "../snippets/tooltip/long-content";
import tooltipLongContentSource from "../snippets/tooltip/long-content.tsx?raw";
import TooltipSideSnippet from "../snippets/tooltip/side";
import tooltipSideSource from "../snippets/tooltip/side.tsx?raw";
import TooltipSizesSnippet from "../snippets/tooltip/sizes";
import tooltipSizesSource from "../snippets/tooltip/sizes.tsx?raw";
import TooltipStatesSnippet from "../snippets/tooltip/states";
import tooltipStatesSource from "../snippets/tooltip/states.tsx?raw";
import TooltipSurfacesSnippet from "../snippets/tooltip/surfaces";
import tooltipSurfacesSource from "../snippets/tooltip/surfaces.tsx?raw";

const tooltipProviderApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "delayDuration",
    type: "number",
    defaultValue: "400",
    required: "нет",
    description: "Задержка перед показом подсказки после наведения или фокуса (мс).",
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
      "Ровно один дочерний элемент-триггер; ref и обработчики мыши/фокуса накладываются через cloneElement.",
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
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "нет",
    description: "Масштаб оформления; дочерние контролы оборачиваются в ControlSizeProvider.",
  },
  {
    prop: "side",
    type: '"top" | "bottom" | "left" | "right"',
    defaultValue: '"top"',
    required: "нет",
    description: "Сторона относительно якоря; координаты ограничиваются отступом от краёв окна.",
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
    <PlaygroundDocPage
      title="Tooltip"
      description={
        <>
          Короткая подсказка рядом с элементом: появляется после паузы при наведении или фокусе,
          позиционируется относительно триггера и не перекрывает его клики (у слоя выключены события
          указателя). Размер текста и отступы задаются на контенте; задержку показа можно задать
          один раз для области страницы через провайдер.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Проп <code>size</code> на <code>Tooltip.Content</code>: ряд <code>s</code>,{" "}
            <code>m</code>, <code>l</code>, <code>xl</code> при одном и том же триггере.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={tooltipSizesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <TooltipSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты оформления</DemoSectionTitle>
          <DemoDescription>
            Отдельного пропа <code>variant</code> нет: внешний вид задаётся токенами темы. Ниже —
            одна и та же подсказка на разных фонах интерфейса (<code>surface-default</code> и{" "}
            <code>surface-raised</code>).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tooltipSurfacesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <TooltipSurfacesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Обычный триггер открывает подсказку по hover и focus; у нативной <code>disabled</code>{" "}
            кнопки наведение не срабатывает — для пояснения к недоступному действию используйте
            текст рядом или обёртку. Для сокращений и терминов удобна кнопка без визуального
            оформления (нативный фокус и клавиатура).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tooltipStatesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <TooltipStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Расположение</DemoSectionTitle>
          <DemoDescription>
            Проп <code>side</code> на <code>Tooltip.Content</code>: <code>top</code>,{" "}
            <code>bottom</code>, <code>left</code>, <code>right</code>; стрелка и позиция
            подстраиваются под выбранную сторону.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tooltipSideSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <TooltipSideSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            <code>open</code> и <code>onOpenChange</code> на <code>Tooltip.Root</code>; для
            мгновенного отклика в примере провайдер с <code>delayDuration=0</code>. Переключатель и
            наведение на триггер меняют одно и то же состояние.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tooltipControlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TooltipControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Триггер — любой одиночный элемент (ссылка, кнопка только с иконкой); в контенте —
            типографика и вложенная разметка. У иконки задайте доступное имя через{" "}
            <code>aria-label</code> на кнопке.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tooltipCompositionSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <TooltipCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Задержка провайдера</DemoSectionTitle>
          <DemoDescription>
            <code>Tooltip.Provider</code> с <code>delayDuration=800</code> — реже мигающие подсказки
            при быстром движении курсора по плотной сетке контролов.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tooltipDelaySource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TooltipDelaySnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Длинный текст</DemoSectionTitle>
          <DemoDescription>
            Многострочный текст в <code>Tooltip.Content</code> с <code>size=&quot;m&quot;</code>.
            Ширина ограничена стилями компонента (<code>max-width</code>), длинные слова
            переносятся.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tooltipLongContentSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TooltipLongContentSnippet />
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
    </PlaygroundDocPage>
  );
}
