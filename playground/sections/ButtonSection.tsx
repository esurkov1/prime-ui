import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import ButtonAsChildSnippet from "../snippets/button/as-child";
import asChildSource from "../snippets/button/as-child.tsx?raw";
import ButtonCompositionSnippet from "../snippets/button/composition";
import compositionSource from "../snippets/button/composition.tsx?raw";
import ButtonControlledSnippet from "../snippets/button/controlled";
import controlledSource from "../snippets/button/controlled.tsx?raw";
import ButtonFormTypesSnippet from "../snippets/button/form-types";
import formTypesSource from "../snippets/button/form-types.tsx?raw";
import ButtonFullWidthSnippet from "../snippets/button/full-width";
import fullWidthSource from "../snippets/button/full-width.tsx?raw";
import ButtonSizesSnippet from "../snippets/button/sizes";
import sizesSource from "../snippets/button/sizes.tsx?raw";
import ButtonStatesSnippet from "../snippets/button/states";
import statesSource from "../snippets/button/states.tsx?raw";
import ButtonVariantsModesSnippet from "../snippets/button/variants-modes";
import variantsModesSource from "../snippets/button/variants-modes.tsx?raw";

const buttonRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"primary" | "neutral" | "error"',
    defaultValue: '"primary"',
    required: "Нет",
    description: "Семантика цвета кнопки.",
  },
  {
    prop: "mode",
    type: '"filled" | "stroke" | "lighter" | "ghost" | "fancy"',
    defaultValue: '"filled"',
    required: "Нет",
    description: "Плотность заливки и обводки.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Высота, радиус, кегль и размер иконки из одного яруса токенов.",
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
    description: "Загрузка: aria-busy, блокировка действия, контекст для Button.Spinner.",
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
    description: "Подпись, Button.Icon, Button.Spinner и прочая разметка внутри кнопки.",
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
    description: "Иконка (например компонент из prime-ui-kit/icons).",
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
    description: "Если loading на Root ложно, компонент ничего не рендерит.",
  },
];

export default function ButtonSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Button</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Кнопка для явных действий: сохранить, удалить, перейти дальше. Можно менять размер,
              цветовую роль, плотность (заливка или обводка), отключить или показать загрузку. Рядом
              с текстом удобно ставить иконку; при ссылке с тем же видом используется режим слияния
              с дочерним элементом.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Ряд кнопок <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
              <code>xl</code> при <code>variant=&quot;primary&quot;</code> и{" "}
              <code>mode=&quot;filled&quot;</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <ButtonSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Варианты и режимы</DemoSectionTitle>
            <DemoDescription>
              Сетка сочетаний <code>variant</code> (<code>primary</code>, <code>neutral</code>,{" "}
              <code>error</code>) и <code>mode</code> (<code>filled</code>, <code>stroke</code>,{" "}
              <code>lighter</code>, <code>ghost</code>), плюс акцентный ряд{" "}
              <code>mode=&quot;fancy&quot;</code> на размере <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsModesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonVariantsModesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Обычная, <code>disabled</code> и <code>loading</code> со вложенным{" "}
              <code>Button.Spinner</code> (индикатор виден только при <code>loading</code>).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <ButtonStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              Проп <code>loading</code> задаётся из состояния родителя (имитация запроса по клику);
              текст подписи можно менять вместе с флагом.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <ButtonControlledSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              <code>Button.Icon</code> слева и справа от текста; отдельные кнопки только с иконкой —
              с обязательной доступной подписью через <code>aria-label</code> на{" "}
              <code>Button.Root</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Full width</DemoSectionTitle>
            <DemoDescription>
              <code>fullWidth</code>: кнопка на всю ширину колонки (карточка, форма, нижняя панель).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonFullWidthSnippet />
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
                <ButtonAsChildSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
            <DemoDescription>
              Нативная форма: <code>type=&quot;submit&quot;</code> и{" "}
              <code>type=&quot;reset&quot;</code> вместе с <code>fullWidth</code> — типичный блок
              поиска или короткой анкеты.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={formTypesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonFormTypesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Button.Root</DemoApiTitle>
            <DemoDescription>
              Корневая кнопка или слот для одного дочернего элемента при <code>asChild</code>
              {";"} задаёт вариант, режим, размер и общий контекст для спиннера.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonRootApiRows} />
            <DemoApiTitle>Button.Icon</DemoApiTitle>
            <DemoDescription>
              Обёртка для иконки с выравниванием по строке кнопки; помечена <code>aria-hidden</code>
              , так как смысл должен дублироваться текстом или <code>aria-label</code> на корне.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonIconApiRows} />
            <DemoApiTitle>Button.Spinner</DemoApiTitle>
            <DemoDescription>
              Индикатор ожидания: рендерится только если у ближайшего <code>Button.Root</code>{" "}
              <code>loading=true</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonSpinnerApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
