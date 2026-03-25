import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
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
    <PlaygroundDocPage
      title="Button"
      description={
        <>
          Кнопка для явных действий: сохранить, удалить, перейти дальше. Можно менять размер,
          цветовую роль, плотность (заливка или обводка), отключить или показать загрузку. Рядом с
          текстом удобно ставить иконку; при ссылке с тем же видом используется режим слияния с
          дочерним элементом.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Ряд кнопок <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code> при <code>variant=&quot;primary&quot;</code> и{" "}
            <code>mode=&quot;filled&quot;</code>.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <ButtonSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты и режимы</h4>
          <p className="demoBlockDescription">
            Сетка сочетаний <code>variant</code> (<code>primary</code>, <code>neutral</code>,{" "}
            <code>error</code>) и <code>mode</code> (<code>filled</code>, <code>stroke</code>,{" "}
            <code>lighter</code>, <code>ghost</code>), плюс акцентный ряд{" "}
            <code>mode=&quot;fancy&quot;</code> на размере <code>m</code>.
          </p>
          <PlaygroundExampleFrame.Root code={variantsModesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ButtonVariantsModesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Обычная, <code>disabled</code> и <code>loading</code> со вложенным{" "}
            <code>Button.Spinner</code> (индикатор виден только при <code>loading</code>).
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <ButtonStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Проп <code>loading</code> задаётся из состояния родителя (имитация запроса по клику);
            текст подписи можно менять вместе с флагом.
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <ButtonControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            <code>Button.Icon</code> слева и справа от текста; отдельные кнопки только с иконкой — с
            обязательной доступной подписью через <code>aria-label</code> на{" "}
            <code>Button.Root</code>.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ButtonCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            <code>fullWidth</code>: кнопка на всю ширину колонки (карточка, форма, нижняя панель).
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ButtonFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>asChild</h4>
          <p className="demoBlockDescription">
            <code>asChild</code>: стили и поведение кнопки передаются одному дочернему элементу
            (например <code>&lt;a href&gt;</code>). При <code>disabled</code> или{" "}
            <code>loading</code> — <code>aria-disabled</code> и блокировка перехода без нативного{" "}
            <code>disabled</code> на ссылке.
          </p>
          <PlaygroundExampleFrame.Root code={asChildSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ButtonAsChildSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи</h4>
          <p className="demoBlockDescription">
            Нативная форма: <code>type=&quot;submit&quot;</code> и{" "}
            <code>type=&quot;reset&quot;</code> вместе с <code>fullWidth</code> — типичный блок
            поиска или короткой анкеты.
          </p>
          <PlaygroundExampleFrame.Root code={formTypesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ButtonFormTypesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Button.Root</h5>
          <p className="demoBlockDescription">
            Корневая кнопка или слот для одного дочернего элемента при <code>asChild</code>; задаёт
            вариант, режим, размер и общий контекст для спиннера.
          </p>
          <PlaygroundApiTable rows={buttonRootApiRows} />
          <h5>Button.Icon</h5>
          <p className="demoBlockDescription">
            Обёртка для иконки с выравниванием по строке кнопки; помечена <code>aria-hidden</code>,
            так как смысл должен дублироваться текстом или <code>aria-label</code> на корне.
          </p>
          <PlaygroundApiTable rows={buttonIconApiRows} />
          <h5>Button.Spinner</h5>
          <p className="demoBlockDescription">
            Индикатор ожидания: рендерится только если у ближайшего <code>Button.Root</code>{" "}
            <code>loading=true</code>.
          </p>
          <PlaygroundApiTable rows={buttonSpinnerApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
