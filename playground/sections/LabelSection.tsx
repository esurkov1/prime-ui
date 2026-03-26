import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import LabelCompositionSnippet from "../snippets/label/composition";
import compositionSource from "../snippets/label/composition.tsx?raw";
import LabelMixedRequiredOptionalSnippet from "../snippets/label/mixed-required-optional";
import mixedRequiredOptionalSource from "../snippets/label/mixed-required-optional.tsx?raw";
import LabelSizesSnippet from "../snippets/label/sizes";
import labelSizesSource from "../snippets/label/sizes.tsx?raw";
import LabelStatesSnippet from "../snippets/label/states";
import labelStatesSource from "../snippets/label/states.tsx?raw";
import LabelSubLineSnippet from "../snippets/label/sub-line";
import labelSubLineSource from "../snippets/label/sub-line.tsx?raw";

export default function LabelSection() {
  return (
    <PlaygroundDocPage
      title="Label"
      description={
        <>
          Подпись к полю ввода или другому элементу управления: связь через <code>htmlFor</code> и{" "}
          <code>id</code>, четыре размера текста, неактивный вид, опционально иконка, звёздочка для
          обязательных полей и вторая строка пояснения.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Проп <code>size</code> на <code>Label.Root</code>: <code>s</code>, <code>m</code>,{" "}
            <code>l</code>, <code>xl</code> — для текста без иконки и для строки с{" "}
            <code>Label.Icon</code> (иконка подстраивается под тот же размер).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={labelSizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <LabelSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Обычный лейбл с <code>htmlFor</code>, затем <code>disabled</code> (приглушённый цвет и{" "}
            <code>aria-disabled</code>), затем маркер обязательности через{" "}
            <code>Label.Asterisk</code> (отдельный слот, не путать с HTML-атрибутом{" "}
            <code>required</code> на инпуте).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={labelStatesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <LabelStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция с иконкой</DemoSectionTitle>
          <DemoDescription>
            Слот <code>Label.Icon</code> оборачивает глиф; контекст размера передаётся внутрь для
            согласованной типографики и иконки.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <LabelCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Дополнительная строка (Sub)</DemoSectionTitle>
          <DemoDescription>
            <code>Label.Sub</code> — вспомогательный текст под основным названием (единицы,
            контекст, уточнение без отдельного блока подсказки).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={labelSubLineSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <LabelSubLineSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Обязательность и необязательность</DemoSectionTitle>
          <DemoDescription>
            Сочетание <code>Label.Asterisk</code> для обязательного поля и подписи в{" "}
            <code>Label.Sub</code> для необязательного — типичная пара в одной форме.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={mixedRequiredOptionalSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <LabelMixedRequiredOptionalSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Label.Root</DemoApiTitle>
          <DemoDescription>
            Корневой <code>&lt;label&gt;</code>: размер, неактивность и контекст для дочерних
            слотов.
          </DemoDescription>
          <PlaygroundApiTable
            rows={[
              {
                prop: "size",
                type: '"s" | "m" | "l" | "xl"',
                defaultValue: '"m"',
                required: "Нет",
                description: "Масштаб текста и отступов; передаётся в контекст для Label.Icon.",
              },
              {
                prop: "disabled",
                type: "boolean",
                defaultValue: "—",
                required: "Нет",
                description: "Визуально приглушает лейбл; data-disabled и aria-disabled.",
              },
              {
                prop: "htmlFor",
                type: "string",
                defaultValue: "—",
                required: "Нет",
                description: "id связанного элемента управления (нативный for у label).",
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
                description: "Текст и вложенные Label.Icon, Label.Asterisk, Label.Sub.",
              },
              {
                prop: "…rest",
                type: 'Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "size">',
                defaultValue: "—",
                required: "Нет",
                description:
                  "Остальные атрибуты нативного label (id, style, onClick, aria-* и т.д.).",
              },
            ]}
          />
          <DemoApiTitle>Label.Icon</DemoApiTitle>
          <DemoDescription>
            Обёртка для иконки рядом с текстом; размер иконки согласуется с <code>size</code> у{" "}
            <code>Label.Root</code>.
          </DemoDescription>
          <PlaygroundApiTable
            rows={[
              {
                prop: "className",
                type: "string",
                defaultValue: "—",
                required: "Нет",
                description: "Дополнительный CSS-класс слота.",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                defaultValue: "—",
                required: "Нет",
                description: "Обычно компонент Icon; размер берётся из родительского Label.Root.",
              },
              {
                prop: "…rest",
                type: "React.HTMLAttributes<HTMLSpanElement>",
                defaultValue: "—",
                required: "Нет",
                description: "Прочие атрибуты обёртки span.",
              },
            ]}
          />
          <DemoApiTitle>Label.Asterisk</DemoApiTitle>
          <DemoDescription>
            Маркер обязательного поля; по умолчанию символ «*», стиль акцентного цвета.
          </DemoDescription>
          <PlaygroundApiTable
            rows={[
              {
                prop: "className",
                type: "string",
                defaultValue: "—",
                required: "Нет",
                description: "Дополнительный CSS-класс.",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                defaultValue: '"*"',
                required: "Нет",
                description: "Другой символ или текст вместо звёздочки по умолчанию.",
              },
              {
                prop: "…rest",
                type: "React.HTMLAttributes<HTMLSpanElement>",
                defaultValue: "—",
                required: "Нет",
                description: "Прочие атрибуты обёртки span.",
              },
            ]}
          />
          <DemoApiTitle>Label.Sub</DemoApiTitle>
          <DemoDescription>
            Второстепенная строка под основным названием поля (мельче и вторичный цвет).
          </DemoDescription>
          <PlaygroundApiTable
            rows={[
              {
                prop: "className",
                type: "string",
                defaultValue: "—",
                required: "Нет",
                description: "Дополнительный CSS-класс подписи.",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                defaultValue: "—",
                required: "Нет",
                description: "Поясняющий или служебный текст (например «необязательно»).",
              },
              {
                prop: "…rest",
                type: "React.HTMLAttributes<HTMLSpanElement>",
                defaultValue: "—",
                required: "Нет",
                description: "Прочие атрибуты обёртки span.",
              },
            ]}
          />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
