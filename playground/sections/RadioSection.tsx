import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import RadioCompositionSnippet from "../snippets/radio/composition";
import compositionSource from "../snippets/radio/composition.tsx?raw";
import RadioControlledSnippet from "../snippets/radio/controlled";
import controlledSource from "../snippets/radio/controlled.tsx?raw";
import RadioFormGroupSnippet from "../snippets/radio/form-group";
import formGroupSource from "../snippets/radio/form-group.tsx?raw";
import RadioFullWidthSnippet from "../snippets/radio/full-width";
import fullWidthSource from "../snippets/radio/full-width.tsx?raw";
import RadioSizesSnippet from "../snippets/radio/sizes";
import sizesSource from "../snippets/radio/sizes.tsx?raw";
import RadioStatesSnippet from "../snippets/radio/states";
import statesSource from "../snippets/radio/states.tsx?raw";
import RadioVariantsSnippet from "../snippets/radio/variants";
import variantsSource from "../snippets/radio/variants.tsx?raw";

const radioRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"default" | "error"',
    defaultValue: '"default"',
    required: "Нет",
    description: "Визуальная семантика: ошибка валидации и data-invalid на корне.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер маркера, подписи, hint и error из одного яруса токенов.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Блокировка выбора; синхронизируется с Label и визуальным состоянием.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "id нативного input; при отсутствии генерируется через useId.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки .field вокруг слотов Label, Hint и Error.",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Дополняется id подсказки и сообщения об ошибке при наличии Radio.Hint / Radio.Error.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Radio.Label, Radio.Hint, Radio.Error и вложенная разметка.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">',
    defaultValue: "—",
    required: "Нет",
    description:
      'name, value, checked, defaultChecked, onChange, required, readOnly и прочие атрибуты input type="radio".',
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
          {
            <>
              Переключатель «один из нескольких»: подходит, когда варианты взаимоисключающие (тариф,
              способ оплаты, слот доставки). У каждого пункта свой маркер и подпись; несколько
              пунктов связываются одинаковым <code>name</code>. Рядом можно показать подсказку или
              текст ошибки проверки.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Четыре значения <code>size</code> — <code>s</code>, <code>m</code>, <code>l</code>,{" "}
              <code>xl</code> — при <code>variant=&quot;default&quot;</code>; у каждого пункта своё{" "}
              <code>name</code>, чтобы превью не мешало другим блокам.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <RadioSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Варианты</DemoSectionTitle>
            <DemoDescription>
              <code>variant=&quot;default&quot;</code> с <code>Radio.Hint</code> и{" "}
              <code>variant=&quot;error&quot;</code> с <code>Radio.Error</code>: ошибка подсвечивает
              обводку маркера и выставляет <code>aria-invalid</code> на input.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <RadioVariantsSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Выбрано и не выбрано, <code>disabled</code> (вкл./выкл.), плюс строка с{" "}
              <code>Radio.Hint</code> для связи по <code>aria-describedby</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <RadioStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              Состояние в родителе: у каждого пункта одинаковый <code>name</code>,{" "}
              <code>checked</code> привязан к значению в <code>useState</code>, в{" "}
              <code>onChange</code> обновляем состояние при <code>e.currentTarget.checked</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <RadioControlledSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Группа из двух пунктов с подписью и <code>Radio.Hint</code> под каждым — типичный блок
              выбора способа оплаты.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <RadioCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Full width</DemoSectionTitle>
            <DemoDescription>
              Корень поля тянется на ширину контейнера (<code>width: 100%</code> у обёртки): в узкой
              колонке подпись занимает оставшееся место в сетке label.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <RadioFullWidthSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
            <DemoDescription>
              Нативная форма: общий <code>name</code>, <code>fieldset</code>/<code>legend</code>,{" "}
              <code>required</code> на пунктах и чтение выбранного значения через{" "}
              <code>FormData</code> при отправке.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={formGroupSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <RadioFormGroupSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Radio.Root</DemoApiTitle>
            <DemoDescription>
              Обёртка поля и провайдер контекста: размер, вариант, связь hint/error с input через
              id.
            </DemoDescription>
            <PlaygroundApiTable rows={radioRootApiRows} />
            <DemoApiTitle>Radio.Label</DemoApiTitle>
            <DemoDescription>
              Подпись и визуальный маркер: рендерит <code>Label.Root</code>, нативный{" "}
              <code>type=&quot;radio&quot;</code> и SVG-кольца.
            </DemoDescription>
            <PlaygroundApiTable rows={radioLabelApiRows} />
            <DemoApiTitle>Radio.Hint</DemoApiTitle>
            <DemoDescription>
              Вторичный текст под пунктом; регистрируется в контексте для{" "}
              <code>aria-describedby</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={radioHintApiRows} />
            <DemoApiTitle>Radio.Error</DemoApiTitle>
            <DemoDescription>
              Сообщение об ошибке (через <code>Hint.Root</code> с вариантом error); влияет на{" "}
              <code>aria-invalid</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={radioErrorApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
