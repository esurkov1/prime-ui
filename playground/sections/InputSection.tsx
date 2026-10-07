import InputAnatomyExample from "@/components/input/examples/anatomy";
import anatomySource from "@/components/input/examples/anatomy.tsx?raw";
import InputControlAlignmentExample from "@/components/input/examples/control-alignment";
import alignRowSource from "@/components/input/examples/control-alignment.tsx?raw";
import InputControlledExample from "@/components/input/examples/controlled";
import controlledSource from "@/components/input/examples/controlled.tsx?raw";
import InputFullWidthExample from "@/components/input/examples/full-width";
import fullWidthSource from "@/components/input/examples/full-width.tsx?raw";
import InputIconsAndAffixesExample from "@/components/input/examples/icons-and-affixes";
import compositionSource from "@/components/input/examples/icons-and-affixes.tsx?raw";
import InputInFormExample from "@/components/input/examples/in-form";
import formSource from "@/components/input/examples/in-form.tsx?raw";
import InputReservedSupportRowExample from "@/components/input/examples/reserved-support-row";
import featuresSource from "@/components/input/examples/reserved-support-row.tsx?raw";
import InputSearchWithoutFocusRingExample from "@/components/input/examples/search-without-focus-ring";
import searchNoRingSource from "@/components/input/examples/search-without-focus-ring.tsx?raw";
import InputSizesExample from "@/components/input/examples/sizes";
import sizesSource from "@/components/input/examples/sizes.tsx?raw";
import InputStatesExample from "@/components/input/examples/states";
import statesSource from "@/components/input/examples/states.tsx?raw";
import InputSurfacesExample from "@/components/input/examples/surfaces";
import InputWithBadgeExample from "@/components/input/examples/with-badge";
import badgeSource from "@/components/input/examples/with-badge.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const inputRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус --prime-control-<size>-*: высота, отступы, радиус, кегль поля, подписи и подсказки.",
  },
  {
    prop: "label",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись над полем (<label htmlFor>). Без неё задайте aria-label на Input.Field.",
  },
  {
    prop: "required",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Красная * после подписи (aria-hidden) и нативный required на Input.Field.",
  },
  {
    prop: "optional",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Приглушённая пометка сразу после текста подписи (labels.optional).",
  },
  {
    prop: "hint",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подсказка под полем; скрывается, пока показан error.",
  },
  {
    prop: "error",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст ошибки в слоте подсказки; включает invalid и aria-invalid.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Состояние ошибки без текста: красное кольцо, aria-invalid и data-invalid.",
  },
  {
    prop: "focusRing",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      'false скрывает только кольцо фокуса на Input.Wrapper (data-focus-ring="false"); фокус, клавиатура и ARIA не меняются, кольцо ошибки остаётся. Только там, где фокус и так очевиден (одно поле поиска с кареткой); WCAG 2.4.7.',
  },
  {
    prop: "counter",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Правая часть строки поддержки, обычно <Input.Counter current max />.",
  },
  {
    prop: "reserveSupportRow",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Строка поддержки рендерится всегда, поэтому появление ошибки не сдвигает вёрстку.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Явный id поля; иначе генерируется. Связывает подпись, подсказку и ошибку.",
  },
  {
    prop: "labels",
    type: "Partial<InputLabels>",
    defaultValue:
      '{ optional: "необязательно", clear: "Очистить", counter: "{current} из {max} символов" }',
    required: "Нет",
    description:
      "Системные строки: пометка optional, имя Input.ClearButton, озвучка Input.Counter ({current} и {max} подставляются).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Обычно Input.Wrapper с Field и слотами.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс корня.",
  },
];

const inputWrapperApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Field, Icon, Affix, InlineAffix, ClearButton в нужном порядке.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс заливки поля; data-size и data-invalid приходят из контекста.",
  },
];

const inputFieldApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Добавляется к id подсказки и ошибки из контекста.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Новое строковое значение; нативный onChange тоже вызывается.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">',
    defaultValue: "—",
    required: "Нет",
    description:
      "value, onChange, type, disabled, readOnly, maxLength и т. д. HTML size зарезервирован.",
  },
];

const inputIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "side",
    type: '"start" | "end"',
    defaultValue: "—",
    required: "Да",
    description:
      "Сторона иконки. Иконка стоит по центру между краем и текстом: край → иконка = иконка → текст = отступ поля яруса.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Иконка; без явного size берёт размер яруса поля.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс span.",
  },
];

const inputAffixApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "side",
    type: '"start" | "end"',
    defaultValue: "—",
    required: "Да",
    description: "Сторона блочного аффикса с подложкой fill-subtle.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Статичный текст: протокол, домен, код страны.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс контейнера.",
  },
];

const inputInlineAffixApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "side",
    type: '"start" | "end"',
    defaultValue: "—",
    required: "Да",
    description: "Сторона аффикса в строке ввода.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Короткий текст: ₽, %, кг.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс span.",
  },
];

const inputBadgeApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "color",
    type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
    defaultValue: '"gray"',
    required: "Нет",
    description: "Цвет палитры мягкого бейджа (ярус на шаг ниже поля).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Короткий статус: «Проверен», «Новое».",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс бейджа.",
  },
];

const inputClearButtonApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "onClick",
    type: "(event) => void",
    defaultValue: "—",
    required: "Нет",
    description:
      "Очистите значение здесь; затем фокус вернётся в поле (если не вызван preventDefault).",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description:
      "Кроме type, children и aria-label (имя — labels.clear у Input.Root). Рендерите кнопку только при непустом значении.",
  },
];

const inputCounterApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "current",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description: "Текущая длина.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description:
      "Лимит; при current > max счётчик становится красным (data-invalid). Скринридер читает labels.counter.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс span.",
  },
];
export default function InputSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Input</PageContent.Title>
        <PageContent.Description measure="full">
          Однострочное поле и эталон системы полей: подпись сверху, поле на заливке без видимой
          рамки, строка поддержки снизу (подсказка или ошибка слева, счётчик справа). Select,
          Datepicker, TagSelect и Textarea повторяют этот же контракт. Многострочный ввод —
          Textarea.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Анатомия поля</DemoSectionTitle>
            <DemoDescription>
              Подпись, <code>required</code> (красная *), <code>optional</code>, плейсхолдер,
              подсказка, ошибка и <code>Input.Counter</code> на каждом размере. Подпись и подсказка
              берут ярус поля, подсказка всегда мельче текста поля. Строки выровнены по колонкам.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={anatomySource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <InputAnatomyExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Выравнивание с другими контролами</DemoSectionTitle>
            <DemoDescription>
              Button, Input, Select и триггер Datepicker одного <code>size</code> имеют одну высоту
              и радиус, поэтому панель фильтров собирается без подгонки отступов.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={alignRowSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <InputControlAlignmentExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> на <code>Input.Root</code>: <code>xs</code> 28, <code>s</code> 32,{" "}
              <code>m</code> 36 (по умолчанию), <code>l</code> 40, <code>xl</code> 48. Иконка без
              явного <code>size</code> подстраивается под ярус.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <InputSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Пустое, заполненное, <code>disabled</code>, <code>readOnly</code>, ошибка с текстом и
              без (<code>invalid</code>). Наведите курсор — заливка темнеет; нажмите Tab — поле
              светлеет и получает кольцо фокуса (у поля с ошибкой кольцо красное).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <InputStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Поверхности</DemoSectionTitle>
            <DemoDescription>
              Заливка поля приходит из контекста <code>--prime-color-field-bg</code>: белая на
              canvas, серая внутри карточек, модалок и поповеров. Сниппет одинаковый — меняется
              только фон.
            </DemoDescription>
            <SurfaceGallery surfaces={["canvas", "surface", "raised"]}>
              <InputSurfacesExample />
            </SurfaceGallery>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемое значение, очистка и счётчик</DemoSectionTitle>
            <DemoDescription>
              <code>value</code> и <code>onChange</code> на <code>Input.Field</code>.{" "}
              <code>Input.ClearButton</code> показывается только при непустом значении и возвращает
              фокус в поле. <code>Input.Counter</code> краснеет при превышении лимита.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={controlledSource.trim()}
              previewLayout="stack-narrow"
            >
              <PlaygroundExampleFrame.Stage>
                <InputControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Поиск без кольца фокуса</DemoSectionTitle>
            <DemoDescription>
              <code>focusRing={"{false}"}</code> на <code>Input.Root</code> убирает только кольцо:
              фокус, клавиатура и ARIA прежние, поле светлеет, кольцо ошибки остаётся. Используйте
              там, где фокус очевиден и без кольца — одно поле поиска с кареткой (WCAG 2.4.7).
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={searchNoRingSource.trim()}
              previewLayout="stack-narrow"
            >
              <PlaygroundExampleFrame.Stage>
                <InputSearchWithoutFocusRingExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Иконки и аффиксы</DemoSectionTitle>
            <DemoDescription>
              <code>Input.Icon</code>, блочный <code>Input.Affix</code> с подложкой и{" "}
              <code>Input.InlineAffix</code> в строке ввода. Все слоты декоративные (
              <code>aria-hidden</code>), имя поля даёт подпись.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={compositionSource.trim()}
              previewLayout="stack-narrow"
            >
              <PlaygroundExampleFrame.Stage>
                <InputIconsAndAffixesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Бейдж в поле</DemoSectionTitle>
            <DemoDescription>
              <code>Input.Badge</code>, <code>Select.Badge</code> и <code>Datepicker.Badge</code> —
              мягкий бейдж палитры на ярус ниже поля у правого края, перед иконкой или шевроном
              (край → бейдж = отступ поля). Высота поля не меняется, текст обрезается перед бейджем;
              цвет — <code>color</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={badgeSource.trim()} previewLayout="stack-narrow">
              <PlaygroundExampleFrame.Stage>
                <InputWithBadgeExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Форма в карточке</DemoSectionTitle>
            <DemoDescription>
              Реквизиты компании на поверхности: поле → поле 20px, группа → действия 32px.{" "}
              <code>reserveSupportRow</code> у соседних полей держит строку одинаковой высоты, даже
              когда ошибка есть только у одного.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={formSource.trim()}
              previewLayout="stack"
              surface="surface"
            >
              <PlaygroundExampleFrame.Stage>
                <InputInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ошибка без сдвига вёрстки</DemoSectionTitle>
            <DemoDescription>
              С <code>reserveSupportRow</code> строка поддержки занимает место заранее: переключите
              ошибку — кнопка под полем не двигается. <code>labels.optional</code> меняет текст
              пометки, явный <code>id</code> пригодится для тестов.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack-narrow">
              <PlaygroundExampleFrame.Stage>
                <InputReservedSupportRowExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ширина</DemoSectionTitle>
            <DemoDescription>
              Отдельного <code>fullWidth</code> нет: <code>Input.Root</code> занимает ширину
              родителя, ширину задаёт колонка формы.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <InputFullWidthExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Input.Root</DemoApiTitle>
            <DemoDescription>
              Размер, подпись, строка поддержки и контекст для Wrapper и Field.
            </DemoDescription>
            <PlaygroundApiTable rows={inputRootApiRows} />

            <DemoApiTitle>Input.Wrapper</DemoApiTitle>
            <DemoDescription>
              Видимое поле: заливка, наведение, фокус, ошибка и disabled.
            </DemoDescription>
            <PlaygroundApiTable rows={inputWrapperApiRows} />

            <DemoApiTitle>Input.Field</DemoApiTitle>
            <DemoDescription>
              Нативный <code>input</code> с id, aria-связями и <code>aria-invalid</code> из
              контекста.
            </DemoDescription>
            <PlaygroundApiTable rows={inputFieldApiRows} />

            <DemoApiTitle>Input.Icon</DemoApiTitle>
            <PlaygroundApiTable rows={inputIconApiRows} />

            <DemoApiTitle>Input.Affix</DemoApiTitle>
            <PlaygroundApiTable rows={inputAffixApiRows} />

            <DemoApiTitle>Input.InlineAffix</DemoApiTitle>
            <PlaygroundApiTable rows={inputInlineAffixApiRows} />

            <DemoApiTitle>Input.Badge</DemoApiTitle>
            <PlaygroundApiTable rows={inputBadgeApiRows} />

            <DemoApiTitle>Input.ClearButton</DemoApiTitle>
            <PlaygroundApiTable rows={inputClearButtonApiRows} />

            <DemoApiTitle>Input.Counter</DemoApiTitle>
            <PlaygroundApiTable rows={inputCounterApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
