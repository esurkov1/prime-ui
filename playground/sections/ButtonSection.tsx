import ButtonAsChildExample from "@/components/button/examples/as-child";
import asChildSource from "@/components/button/examples/as-child.tsx?raw";
import ButtonCompositionExample from "@/components/button/examples/composition";
import compositionSource from "@/components/button/examples/composition.tsx?raw";
import ButtonControlledExample from "@/components/button/examples/controlled";
import controlledSource from "@/components/button/examples/controlled.tsx?raw";
import ButtonFullWidthExample from "@/components/button/examples/full-width";
import fullWidthSource from "@/components/button/examples/full-width.tsx?raw";
import ButtonIconOnlyExample from "@/components/button/examples/icon-only";
import iconOnlySource from "@/components/button/examples/icon-only.tsx?raw";
import ButtonInFormExample from "@/components/button/examples/in-form";
import inFormSource from "@/components/button/examples/in-form.tsx?raw";
import ButtonSizesExample from "@/components/button/examples/sizes";
import sizesSource from "@/components/button/examples/sizes.tsx?raw";
import ButtonStatesExample from "@/components/button/examples/states";
import statesSource from "@/components/button/examples/states.tsx?raw";
import ButtonSurfacesExample from "@/components/button/examples/surfaces";
import surfacesSource from "@/components/button/examples/surfaces.tsx?raw";
import ButtonVariantsTonesExample from "@/components/button/examples/variants-tones";
import variantsTonesSource from "@/components/button/examples/variants-tones.tsx?raw";
import ButtonWithIconExample from "@/components/button/examples/with-icon";
import withIconSource from "@/components/button/examples/with-icon.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const buttonRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"solid" | "soft" | "outline" | "ghost"',
    defaultValue: '"solid"',
    required: "Нет",
    description: "Подача: заливка, мягкая заливка, линия или прозрачная.",
  },
  {
    prop: "tone",
    type: '"accent" | "neutral" | "danger"',
    defaultValue: '"accent"',
    required: "Нет",
    description: "Смысл цвета: главное действие, второстепенное или разрушительное.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус контрола: высота 28 · 32 · 36 · 40 · 48, отступы, кегль, иконка. Совпадает с Input и Select того же размера.",
  },
  {
    prop: "fullWidth",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Растянуть кнопку на ширину контейнера (data-full-width).",
  },
  {
    prop: "loading",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Загрузка: aria-busy, блокировка клика и автоматический спиннер (по центру над подписью или вместо ведущей иконки). Ширина не меняется.",
  },
  {
    prop: "asChild",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Слить стили и пропсы с единственным дочерним элементом вместо <button>.",
  },
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип нативной кнопки; при asChild не пробрасывается.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Неактивное состояние; вместе с loading даёт единый запрет клика.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корня.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Подпись и Button.Icon. Только Button.Icon — квадратная icon-only кнопка (нужен aria-label).",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement> (без size)",
    defaultValue: "—",
    required: "Нет",
    description: "onClick, aria-*, data-* и остальные атрибуты кнопки.",
  },
];

const buttonIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Иконка (например Icon из prime-ui-kit).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс span.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Корень с aria-hidden; остальные атрибуты span.",
  },
];

const buttonSpinnerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс индикатора.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description:
      "Необязателен: нужен, только если спиннер должен стоять в определённом месте. Без loading на Root ничего не рендерит.",
  },
];

export default function ButtonSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Button</PageContent.Title>
        <PageContent.Description measure="full">
          Кнопка для явных действий: сохранить, удалить, перейти дальше. <code>tone</code> задаёт
          смысл, <code>variant</code> — подачу, <code>size</code> — ярус контрола от <code>xs</code>{" "}
          до <code>xl</code> (по умолчанию <code>m</code>, 36px). Кнопка только с иконкой становится
          квадратной, а <code>loading</code> сам показывает спиннер.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> · <code>xl</code> —
              высота 28 · 32 · 36 · 40 · 48. Кнопка, поле и селект одного размера стоят в ряд без
              подгонки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ButtonSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Только иконка</DemoSectionTitle>
            <DemoDescription>
              Если внутри только <code>Button.Icon</code>, кнопка квадратная: ширина равна высоте.
              Панель инструментов на каждом размере; подпись обязательна через{" "}
              <code>aria-label</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={iconOnlySource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ButtonIconOnlyExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Варианты и тона</DemoSectionTitle>
            <DemoDescription>
              <code>tone</code>: <code>accent</code>, <code>neutral</code>, <code>danger</code>.{" "}
              <code>variant</code>: <code>solid</code>, <code>soft</code>, <code>outline</code>{" "}
              (единственный с линией), <code>ghost</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsTonesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ButtonVariantsTonesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Наведите курсор — фон темнеет, нажатие слегка сжимает кнопку, <kbd>Tab</kbd> — кольцо
              фокуса. <code>disabled</code> гасит кнопку. <code>loading</code> блокирует клик и
              показывает спиннер: по центру поверх подписи или вместо ведущей иконки, ширина не
              прыгает. <code>Button.Spinner</code> для этого не нужен.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ButtonStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Загрузка по клику</DemoSectionTitle>
            <DemoDescription>
              <code>loading</code> из состояния родителя: нажмите кнопку, чтобы имитировать запрос.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <ButtonControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Иконка с подписью</DemoSectionTitle>
            <DemoDescription>
              <code>Button.Icon</code> перед или после текста; со стороны иконки отступ на 4px
              меньше. <code>Icon</code> без <code>size</code> берёт размер кнопки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={withIconSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ButtonWithIconExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Панель редактора и футер формы: вторичные действия — <code>ghost</code> и{" "}
              <code>outline</code>, одно главное — <code>solid accent</code>, опасное —{" "}
              <code>tone="danger"</code> в стороне.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>На поверхностях</DemoSectionTitle>
            <DemoDescription>
              Нейтральные режимы на холсте, карточке, всплывающем слое и акцентной подложке.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={surfacesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery>
                  <ButtonSurfacesExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>На всю ширину</DemoSectionTitle>
            <DemoDescription>
              <code>fullWidth</code>: кнопка на всю ширину колонки — узкая форма, карточка,
              мобильный футер.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack-narrow">
              <PlaygroundExampleFrame.Stage>
                <ButtonFullWidthExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>asChild</DemoSectionTitle>
            <DemoDescription>
              <code>asChild</code>: стили и поведение кнопки передаются одному дочернему элементу
              (например <code>&lt;a href&gt;</code>). При <code>disabled</code> или{" "}
              <code>loading</code> — <code>aria-disabled</code> и блокировка перехода без нативного{" "}
              <code>disabled</code> на ссылке.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={asChildSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonAsChildExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Нативная форма</DemoSectionTitle>
            <DemoDescription>
              <code>type=&quot;submit&quot;</code> и <code>type=&quot;reset&quot;</code> вместе с{" "}
              <code>fullWidth</code>. По умолчанию <code>type=&quot;button&quot;</code>, чтобы
              кнопка случайно не отправляла форму.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={inFormSource.trim()} previewLayout="stack-narrow">
              <PlaygroundExampleFrame.Stage>
                <ButtonInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Button.Root</DemoApiTitle>
            <DemoDescription>
              Корневая кнопка или слот для одного дочернего элемента при <code>asChild</code>
              {"; "}задаёт вариант, режим и размер, передаёт ярус вложенным иконкам.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonRootApiRows} />
            <DemoApiTitle>Button.Icon</DemoApiTitle>
            <DemoDescription>
              Обёртка для иконки с размером яруса кнопки; помечена <code>aria-hidden</code>, смысл
              дублируется текстом или <code>aria-label</code> на корне.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonIconApiRows} />
            <DemoApiTitle>Button.Spinner</DemoApiTitle>
            <DemoDescription>
              Явная позиция спиннера. Обычно не нужен: <code>loading</code> на корне показывает
              спиннер сам.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonSpinnerApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
