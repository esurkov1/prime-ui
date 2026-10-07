import DigitInputControlledExample from "@/components/digit-input/examples/controlled";
import controlledSource from "@/components/digit-input/examples/controlled.tsx?raw";
import DigitInputFullWidthExample from "@/components/digit-input/examples/full-width";
import fullWidthSource from "@/components/digit-input/examples/full-width.tsx?raw";
import DigitInputGroupedExample from "@/components/digit-input/examples/grouped";
import groupedSource from "@/components/digit-input/examples/grouped.tsx?raw";
import DigitInputLengthAndCompleteExample from "@/components/digit-input/examples/length-and-complete";
import featuresSource from "@/components/digit-input/examples/length-and-complete.tsx?raw";
import DigitInputMaskedInFormExample from "@/components/digit-input/examples/masked-in-form";
import maskedSource from "@/components/digit-input/examples/masked-in-form.tsx?raw";
import DigitInputSizesExample from "@/components/digit-input/examples/sizes";
import sizesSource from "@/components/digit-input/examples/sizes.tsx?raw";
import DigitInputStatesExample from "@/components/digit-input/examples/states";
import statesSource from "@/components/digit-input/examples/states.tsx?raw";
import DigitInputSurfacesExample from "@/components/digit-input/examples/surfaces";
import surfacesSource from "@/components/digit-input/examples/surfaces.tsx?raw";
import DigitInputVerificationStepExample from "@/components/digit-input/examples/verification-step";
import compositionSource from "@/components/digit-input/examples/verification-step.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const digitInputRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "length",
    type: "number",
    defaultValue: "4",
    required: "Нет",
    description: "Сколько ячеек с одной цифрой отрисовать.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус --prime-control-<tier>-*: квадратная ячейка высотой контрола (28 · 32 · 36 · 40 · 48) и промежуток яруса.",
  },
  {
    prop: "fullWidth",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Ячейки делят ширину контейнера в одной строке и растут вместе с ним; высота остаётся высотой яруса, поэтому ячейки шире, чем выше. data-full-width на fieldset.",
  },
  {
    prop: "groupSize",
    type: "number",
    defaultValue: "—",
    required: "Нет",
    description: "Группы по N ячеек с увеличенным промежутком между ними (3 → 123 456).",
  },
  {
    prop: "mask",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: 'Скрывает цифры (PIN): ячейки получают type="password".',
  },
  {
    prop: "name",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Имя скрытого input с собранным кодом: код уходит с обычной отправкой формы.",
  },
  {
    prop: "autoFocus",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "При монтировании фокус в первой пустой ячейке.",
  },
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое значение: остаются только цифры, обрезается до length.",
  },
  {
    prop: "defaultValue",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description: "Начальное значение в неконтролируемом режиме (нормализуется до цифр).",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при каждом изменении собранной строки цифр.",
  },
  {
    prop: "onComplete",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Один раз, когда заполнена последняя пустая ячейка.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Блокирует все ячейки: заливка field-bg-disabled, цифры text-disabled.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description:
      "Красное кольцо и цифры, aria-invalid на ячейках. Текст ошибки — в Hint через aria-describedby.",
  },
  {
    prop: "focusRing",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      'false ставит data-focus-ring="false" на fieldset и скрывает только кольцо фокуса ячейки; фокус, клавиатура, ARIA и кольцо ошибки остаются.',
  },
  {
    prop: "labels",
    type: "Partial<DigitInputLabels>",
    defaultValue: '{ group: "Код", cell: "Цифра {index} из {length}" }',
    required: "Нет",
    description:
      "Доступные имена: group — fieldset (например «Код из SMS»), cell — каждой ячейки ({index} с 1).",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "id подсказки или ошибки, описывающей группу.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корневом fieldset.",
  },
];

export default function DigitInputSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>DigitInput</PageContent.Title>
        <PageContent.Description measure="full">
          Ряд квадратных ячеек для кода фиксированной длины: одноразовый код из SMS, PIN, код выдачи
          заказа. Одна ячейка — одна цифра; вставка из буфера заполняет ячейки подряд, буквы
          отбрасываются.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code>, <code>s</code>, <code>m</code>, <code>l</code>, <code>xl</code> в
              одном ряду: сторона ячейки равна высоте Input и Button того же размера, цифры на шаг
              крупнее текста яруса.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DigitInputSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Пустое, частично и полностью заполненное, <code>invalid</code> и <code>disabled</code>
              . Наведите курсор — заливка ячейки темнеет; нажмите Tab — кольцо фокуса, а содержимое
              ячейки выделяется, и новая цифра заменяет старую.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DigitInputStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Поверхности</DemoSectionTitle>
            <DemoDescription>
              Ячейки — поля системы форм: на холсте белые, внутри карточки или поповера заливка
              переключается на <code>field-bg-surface</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={surfacesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery className="examplePreviewBleed">
                  <DigitInputSurfacesExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              Строка кода живёт в состоянии родителя (<code>value</code> +{" "}
              <code>onValueChange</code>), поэтому её можно сбросить кнопкой.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DigitInputControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Во всю ширину</DemoSectionTitle>
            <DemoDescription>
              <code>fullWidth</code>: ячейки делят ширину контейнера и растут вместе с ним, высота
              остаётся высотой яруса. Для карточек, форм и узких колонок телефона, где код стоит над
              кнопкой на всю ширину.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DigitInputFullWidthExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Группы</DemoSectionTitle>
            <DemoDescription>
              <code>groupSize</code> делит длинный код на группы: 123 456 или 1234 5678. Работает с
              квадратными ячейками и с <code>fullWidth</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={groupedSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DigitInputGroupedExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>PIN в форме</DemoSectionTitle>
            <DemoDescription>
              <code>mask</code> прячет цифры, <code>name</code> кладёт собранный код в нативную
              отправку формы, <code>autoFocus</code> ставит курсор в первую пустую ячейку.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={maskedSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DigitInputMaskedInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Клавиатура и длина</DemoSectionTitle>
            <DemoDescription>
              Цифра переводит фокус вперёд, Backspace в пустой ячейке — назад, стрелки ← и → и Home
              / End переходят между ячейками без ввода. Фокус на дальней ячейке уходит в первую
              пустую, поэтому в коде не бывает «дыр»; целый код из автозаполнения или буфера
              раскладывается по ячейкам. <code>onComplete</code> срабатывает один раз, когда
              заполнена последняя ячейка.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DigitInputLengthAndCompleteExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Шаг подтверждения входа: <code>Label.Root</code>, код из шести ячеек и{" "}
              <code>Hint.Root</code>, который при ошибке получает <code>invalid</code>. Проверка
              запускается по <code>onComplete</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DigitInputVerificationStepExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>DigitInput.Root</DemoApiTitle>
            <DemoDescription>
              Корень — <code>fieldset</code> с именем из <code>labels.group</code>; внутри по одному{" "}
              <code>input</code> на цифру (<code>inputMode=&quot;numeric&quot;</code>,{" "}
              <code>autoComplete=&quot;one-time-code&quot;</code>). Подпись и подсказку ставьте
              рядом: Label.Root и Hint.Root.
            </DemoDescription>
            <PlaygroundApiTable rows={digitInputRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
