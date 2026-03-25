import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import HintA11yDescribedbySnippet from "../snippets/hint/a11y-describedby";
import hintA11yDescribedbySource from "../snippets/hint/a11y-describedby.tsx?raw";
import HintCompositionIconSnippet from "../snippets/hint/composition-icon";
import hintCompositionIconSource from "../snippets/hint/composition-icon.tsx?raw";
import HintControlledVariantSnippet from "../snippets/hint/controlled-variant";
import hintControlledVariantSource from "../snippets/hint/controlled-variant.tsx?raw";
import HintFieldStatesSnippet from "../snippets/hint/field-states";
import hintFieldStatesSource from "../snippets/hint/field-states.tsx?raw";
import HintSizesSnippet from "../snippets/hint/sizes";
import hintSizesSource from "../snippets/hint/sizes.tsx?raw";
import HintVariantsSnippet from "../snippets/hint/variants";
import hintVariantsSource from "../snippets/hint/variants.tsx?raw";

export default function HintSection() {
  return (
    <PlaygroundDocPage
      title="Hint"
      description={
        <>
          Второстепенный текст под полем ввода: пояснение формата, ограничение или сообщение об
          ошибке. Размер <code>size</code> задаёт кегль относительно поля; <code>variant</code>{" "}
          переключает нейтральный, ошибочный и «приглушённый» вид. Рядом с текстом можно поставить
          иконку через <code>Hint.Icon</code>.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре значения <code>size</code> на корне: <code>s</code>, <code>m</code>,{" "}
            <code>l</code>, <code>xl</code>. Номинальный размер совпадает с размером поля;
            фактический кегль подсказки на ступень меньше (см. стили).
          </p>
          <PlaygroundExampleFrame.Root code={hintSizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <HintSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            Проп <code>variant</code>: <code>default</code> (вторичный цвет текста),{" "}
            <code>error</code> (акцент опасности), <code>disabled</code> (цвет отключённого
            контента).
          </p>
          <PlaygroundExampleFrame.Root code={hintVariantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <HintVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Те же варианты в типичной верстке «лейбл — поле — подсказка»: обычное поле, невалидное
            значение и отключённый ввод с согласованным <code>Label</code>.
          </p>
          <PlaygroundExampleFrame.Root code={hintFieldStatesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <HintFieldStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Текст и семантика подсказки меняются из состояния родителя: здесь переключается только{" "}
            <code>variant</code> между <code>default</code> и <code>error</code> после действий
            пользователя.
          </p>
          <PlaygroundExampleFrame.Root
            code={hintControlledVariantSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <HintControlledVariantSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция с иконкой</h4>
          <p className="demoBlockDescription">
            Дочерний слот <code>Hint.Icon</code> оборачивает SVG; размер иконки берётся из контекста
            размера корня.
          </p>
          <PlaygroundExampleFrame.Root
            code={hintCompositionIconSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <HintCompositionIconSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Связь с полем для вспомогательных технологий</h4>
          <p className="demoBlockDescription">
            Уникальный <code>id</code> на <code>Hint.Root</code> и <code>aria-describedby</code> на
            элементе ввода — экранные дикторы озвучивают подсказку вместе с полем.
          </p>
          <PlaygroundExampleFrame.Root
            code={hintA11yDescribedbySource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <HintA11yDescribedbySnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Hint.Root</h5>
          <p className="demoBlockDescription">
            Корень подсказки: рендерится как <code>&lt;p&gt;</code>, задаёт <code>data-size</code> и{" "}
            <code>data-variant</code> для стилей и оборачивает детей в{" "}
            <code>ControlSizeProvider</code>.
          </p>
          <PlaygroundApiTable
            rows={[
              {
                prop: "size",
                type: '"s" | "m" | "l" | "xl"',
                defaultValue: '"m"',
                required: "Нет",
                description:
                  "Номинальный размер в паре с полем; кегль и отступы подсказки из согласованного яруса.",
              },
              {
                prop: "variant",
                type: '"default" | "error" | "disabled"',
                defaultValue: '"default"',
                required: "Нет",
                description:
                  "Визуальный режим: обычный текст, ошибка или стиль отключённого контента.",
              },
              {
                prop: "className",
                type: "string",
                defaultValue: "—",
                required: "Нет",
                description: "Дополнительный CSS-класс на корне.",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                defaultValue: "—",
                required: "Нет",
                description: "Текст подсказки; при необходимости соседствует с Hint.Icon.",
              },
              {
                prop: "…rest",
                type: "React.HTMLAttributes<HTMLParagraphElement>",
                defaultValue: "—",
                required: "Нет",
                description:
                  "Остальные атрибуты нативного параграфа: id, role, aria-*, data-* и т.д.",
              },
            ]}
          />
          <h5>Hint.Icon</h5>
          <p className="demoBlockDescription">
            Слот для иконки слева от текста: <code>span</code> с фиксированным квадратом под размер
            из контекста и <code>aria-hidden</code>.
          </p>
          <PlaygroundApiTable
            rows={[
              {
                prop: "children",
                type: "React.ReactNode",
                defaultValue: "—",
                required: "Да",
                description: "Содержимое (обычно SVG из набора иконок).",
              },
              {
                prop: "className",
                type: "string",
                defaultValue: "—",
                required: "Нет",
                description: "Дополнительный CSS-класс обёртки.",
              },
              {
                prop: "…rest",
                type: "React.HTMLAttributes<HTMLSpanElement>",
                defaultValue: "—",
                required: "Нет",
                description: "Прочие атрибуты span (кроме дублирования aria-hidden на корне).",
              },
            ]}
          />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
