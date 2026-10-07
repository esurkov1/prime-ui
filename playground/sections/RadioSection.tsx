import { PageContent } from "@/components/page-content/PageContent";
import RadioHintErrorExample from "@/components/radio/examples/hint-error";
import hintErrorSource from "@/components/radio/examples/hint-error.tsx?raw";
import RadioHorizontalExample from "@/components/radio/examples/horizontal";
import horizontalSource from "@/components/radio/examples/horizontal.tsx?raw";
import RadioPlanPickerExample from "@/components/radio/examples/plan-picker";
import planPickerSource from "@/components/radio/examples/plan-picker.tsx?raw";
import RadioSizesExample from "@/components/radio/examples/sizes";
import sizesSource from "@/components/radio/examples/sizes.tsx?raw";
import RadioStatesExample from "@/components/radio/examples/states";
import statesSource from "@/components/radio/examples/states.tsx?raw";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const radioGroupApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value / defaultValue",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Выбранный пункт: контролируемый или начальный.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается с value выбранного пункта (клик, пробел, стрелки).",
  },
  {
    prop: "name",
    type: "string",
    defaultValue: "useId()",
    required: "Нет",
    description: "Общее нативное name пунктов для отправки формы.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус для всех пунктов: круг 14 · 16 · 18 · 20 · 24 px, подпись, hint и error из одного яруса токенов.",
  },
  {
    prop: "orientation",
    type: '"vertical" | "horizontal"',
    defaultValue: '"vertical"',
    required: "Нет",
    description: "Столбец или ряд с переносом.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Красное кольцо у невыбранных кругов и aria-invalid на группе и пунктах.",
  },
  {
    prop: "required",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Нативный required на пунктах и aria-required на группе.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Блокирует все пункты.",
  },
  {
    prop: "fullWidth",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Растянуть каждый пункт на ширину контейнера.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir">',
    defaultValue: "—",
    required: "Нет",
    description:
      'aria-label / aria-labelledby (или fieldset + legend снаружи), className. role="radiogroup".',
  },
];

const radioRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Значение пункта, которое получит Radio.Group.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Ошибка только у этого пункта; Radio.Error включает её сам.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Блокировка пункта.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на обёртке пункта (div.field), не на input.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "id нативного input; при отсутствии генерируется через useId.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Radio.Label, Radio.Hint, Radio.Error.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "checked" | "defaultChecked" | "onChange" | "name" | "value" | "children">',
    defaultValue: "—",
    required: "Нет",
    description:
      'aria-describedby, autoFocus и прочие атрибуты input type="radio"; ref — на input.',
  },
];

const radioLabelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст подписи; при отсутствии задайте доступное имя через aria-label на корне.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс для строки подписи (Label.Root).",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLLabelElement>, "htmlFor" | "size">',
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты label; htmlFor и size задаются из контекста Radio.",
  },
];

const radioHintApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст подсказки под группой поля.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс; слот с отступом под маркером.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">',
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты абзаца; id фиксирован для связи с input.",
  },
];

const radioErrorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст ошибки; регистрирует невалидность контекста (aria-invalid на input).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс слота сообщения.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">',
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты абзаца; id фиксирован для aria-describedby.",
  },
];

export default function RadioSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Radio</PageContent.Title>
        <PageContent.Description measure="full">
          Выбор одного варианта из 2–7 видимых: тариф, способ оплаты, слот доставки. Пункты
          собираются в <code>Radio.Group</code> с <code>value</code> / <code>onValueChange</code>,
          подпись группы — <code>fieldset</code> с <code>legend</code> или <code>aria-label</code>.
          Для 2–4 коротких режимов отображения удобнее SegmentedControl, для длинных списков —
          Select.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> ·{" "}
              <code>xl</code> — тот же ярус, что у Checkbox, полей и кнопок. По умолчанию{" "}
              <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <RadioSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Не выбран, выбран, <code>invalid</code> и <code>disabled</code> — на холсте, в
              карточке и на всплывающей панели. Hover видно при наведении; Tab переводит фокус в
              группу, стрелки двигают выбор, кольцо фокуса рисуется вокруг круга.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery surfaces={["canvas", "surface", "raised"]}>
                  <RadioStatesExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Описание и ошибка</DemoSectionTitle>
            <DemoDescription>
              <code>Radio.Hint</code> и <code>Radio.Error</code> стоят под колонкой текста и
              попадают в <code>aria-describedby</code>. Ошибку группы показывайте один раз — под
              последним пунктом, а всю группу помечайте <code>invalid</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={hintErrorSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <RadioHintErrorExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>В строку</DemoSectionTitle>
            <DemoDescription>
              Короткие подписи без описаний выстраиваются в ряд через{" "}
              <code>orientation=&quot;horizontal&quot;</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={horizontalSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <RadioHorizontalExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция: выбор тарифа</DemoSectionTitle>
            <DemoDescription>
              Контролируемая группа (<code>value</code> + <code>onValueChange</code>) в карточке
              настроек: у каждого плана описание, недоступный вариант объясняет причину в подсказке.
              Размер <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={planPickerSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <RadioPlanPickerExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Radio.Group</DemoApiTitle>
            <DemoDescription>
              Значение, имя, размер и общие флаги для пунктов;{" "}
              <code>role=&quot;radiogroup&quot;</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={radioGroupApiRows} />
            <DemoApiTitle>Radio.Root</DemoApiTitle>
            <DemoDescription>
              Пункт группы. Ref и input-атрибуты уходят на скрытый нативный{" "}
              <code>input type=&quot;radio&quot;</code>; на корне — <code>data-size</code>,{" "}
              <code>data-state</code>, <code>data-invalid</code>, <code>data-disabled</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={radioRootApiRows} />
            <DemoApiTitle>Radio.Label</DemoApiTitle>
            <DemoDescription>
              Кликабельная строка «круг + текст»: рендерит input и связывает его через{" "}
              <code>htmlFor</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={radioLabelApiRows} />
            <DemoApiTitle>Radio.Hint</DemoApiTitle>
            <DemoDescription>
              Описание под текстом (<code>text-muted</code>), добавляется в{" "}
              <code>aria-describedby</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={radioHintApiRows} />
            <DemoApiTitle>Radio.Error</DemoApiTitle>
            <DemoDescription>
              Текст ошибки (<code>danger-text</code>); пока смонтирован, пункт invalid.
            </DemoDescription>
            <PlaygroundApiTable rows={radioErrorApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
