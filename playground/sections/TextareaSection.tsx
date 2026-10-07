import { PageContent } from "@/components/page-content/PageContent";
import TextareaControlledExample from "@/components/textarea/examples/controlled";
import controlledSource from "@/components/textarea/examples/controlled.tsx?raw";
import TextareaHeightAndLimitsExample from "@/components/textarea/examples/height-and-limits";
import featuresSource from "@/components/textarea/examples/height-and-limits.tsx?raw";
import TextareaHintAndErrorExample from "@/components/textarea/examples/hint-and-error";
import variantsSource from "@/components/textarea/examples/hint-and-error.tsx?raw";
import TextareaInFormExample from "@/components/textarea/examples/in-form";
import compositionSource from "@/components/textarea/examples/in-form.tsx?raw";
import TextareaReservedSupportRowExample from "@/components/textarea/examples/reserved-support-row";
import supportRowSource from "@/components/textarea/examples/reserved-support-row.tsx?raw";
import TextareaSizesExample from "@/components/textarea/examples/sizes";
import sizesSource from "@/components/textarea/examples/sizes.tsx?raw";
import TextareaStatesExample from "@/components/textarea/examples/states";
import statesSource from "@/components/textarea/examples/states.tsx?raw";
import TextareaSurfacesExample from "@/components/textarea/examples/surfaces";
import surfacesSource from "@/components/textarea/examples/surfaces.tsx?raw";
import TextareaWithLabelExample from "@/components/textarea/examples/with-label";
import labelSource from "@/components/textarea/examples/with-label.tsx?raw";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const textareaRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус --prime-control-<tier>-*: одна строка стоит как Input того же размера, минимум три строки.",
  },
  {
    prop: "label",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Видимая подпись (Label.Root яруса), связана с textarea через htmlFor.",
  },
  {
    prop: "required",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Нативный required на textarea и красная звёздочка после подписи.",
  },
  {
    prop: "optional",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Приглушённая пометка labels.optional сразу после текста подписи.",
  },
  {
    prop: "hint",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подсказка под полем; скрывается, пока показана ошибка.",
  },
  {
    prop: "error",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст ошибки в месте подсказки; непустое значение включает invalid.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Состояние ошибки без текста (aria-invalid, data-invalid, красное кольцо).",
  },
  {
    prop: "focusRing",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      'false скрывает только кольцо фокуса на коробке поля (data-focus-ring="false"); фокус, клавиатура, ARIA и кольцо ошибки остаются.',
  },
  {
    prop: "counter",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Правая часть строки поддержки, обычно <Textarea.Counter current max />.",
  },
  {
    prop: "reserveSupportRow",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Строка поддержки рендерится всегда, поэтому появление ошибки не сдвигает макет.",
  },
  {
    prop: "autoResize",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Рост высоты по содержимому; при false остаётся нативный resize угла.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Новое строковое значение; нативный onChange тоже вызывается.",
  },
  {
    prop: "labels",
    type: "Partial<TextareaLabels>",
    defaultValue: '{ optional: "необязательно", counter: "{current} из {max} символов" }',
    required: "Нет",
    description: "Встроенные строки: пометка optional и текст счётчика для скринридера.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "useId()",
    required: "Нет",
    description: "id textarea; от него строятся id подсказки и ошибки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Класс видимой коробки поля (data-invalid, data-disabled, data-readonly, data-size).",
  },
  {
    prop: "…rest",
    type: 'Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "children">',
    defaultValue: "—",
    required: "Нет",
    description:
      "value, defaultValue, onChange, placeholder, rows, maxLength, disabled, readOnly, name и прочие атрибуты textarea.",
  },
];

const textareaCounterApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "current",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description: "Текущее число символов (обычно длина строки из состояния).",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description:
      "Лимит «current/max»; при current > max — data-invalid и цвет ошибки. Для жёсткого лимита добавьте maxLength.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс span счётчика.",
  },
];

export default function TextareaSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Textarea</PageContent.Title>
        <PageContent.Description measure="full">
          Многострочное поле системы форм: подпись с пометкой «необязательно», заливка без обводки,
          строка поддержки с подсказкой или ошибкой слева и счётчиком справа. По умолчанию высота
          растёт вместе с текстом, минимум — три строки.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Пять значений <code>size</code>: <code>xs</code>, <code>s</code>, <code>m</code>,{" "}
              <code>l</code>, <code>xl</code>. Первая строка текста стоит так же, как в Input того
              же размера; по умолчанию — <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TextareaSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Подпись</DemoSectionTitle>
            <DemoDescription>
              <code>label</code> рисует подпись яруса; <code>required</code> добавляет звёздочку,{" "}
              <code>optional</code> — пометку «необязательно» (текст меняется через{" "}
              <code>labels.optional</code>). Без видимой подписи задайте <code>aria-label</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={labelSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TextareaWithLabelExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Подсказка и ошибка</DemoSectionTitle>
            <DemoDescription>
              <code>hint</code> под полем; непустой <code>error</code> сам включает{" "}
              <code>invalid</code>, ставит <code>aria-invalid</code> и занимает место подсказки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TextareaHintAndErrorExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Пустое, заполненное, ошибка, <code>readOnly</code> и <code>disabled</code>. Наведите
              курсор — заливка темнеет; нажмите Tab — появится кольцо фокуса. Клик по отступу поля
              тоже ставит фокус в textarea.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TextareaStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Поверхности</DemoSectionTitle>
            <DemoDescription>
              На холсте поле белое, внутри Card, Modal или Popover заливка переключается на{" "}
              <code>field-bg-surface</code>, чтобы поле не сливалось с карточкой.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={surfacesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery className="examplePreviewBleed">
                  <TextareaSurfacesExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим и счётчик</DemoSectionTitle>
            <DemoDescription>
              <code>value</code> и <code>onValueChange</code> у родителя; длина текста передаётся в{" "}
              <code>Textarea.Counter</code> в слоте <code>counter</code> — справа в строке
              поддержки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TextareaControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Резерв строки поддержки</DemoSectionTitle>
            <DemoDescription>
              Включите ошибку переключателем: без <code>reserveSupportRow</code> нижний блок
              сдвигается, с ним строка под ошибку уже занята.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={supportRowSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TextareaReservedSupportRowExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Высота и лимиты</DemoSectionTitle>
            <DemoDescription>
              <code>autoResize</code> по умолчанию и фиксированная высота с нативным resize. Счётчик
              без <code>maxLength</code> показывает переполнение, с <code>maxLength</code> лишний
              ввод блокируется.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TextareaHeightAndLimitsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Форма обращения в карточке: Input и Textarea размера <code>m</code>, обязательное и
              необязательное поле, счётчик и ошибка после отправки без сдвига макета.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TextareaInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Textarea.Root</DemoApiTitle>
            <DemoDescription>
              Владеет нативным <code>textarea</code>: атрибуты textarea передаются прямо на Root.
              Подпись, подсказка, ошибка и счётчик — пропсы Root, как у Input.
            </DemoDescription>
            <PlaygroundApiTable rows={textareaRootApiRows} />
            <DemoApiTitle>Textarea.Counter</DemoApiTitle>
            <DemoDescription>
              Счётчик «текущий/максимум» для слота <code>counter</code>: табличные цифры,{" "}
              <code>aria-live=&quot;polite&quot;</code>, для скринридера —{" "}
              <code>labels.counter</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={textareaCounterApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
