import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import KbdCompositionSnippet from "../snippets/kbd/composition";
import compositionSource from "../snippets/kbd/composition.tsx?raw";
import KbdInheritSizeSnippet from "../snippets/kbd/inherit-size";
import inheritSizeSource from "../snippets/kbd/inherit-size.tsx?raw";
import KbdSizesSnippet from "../snippets/kbd/sizes";
import sizesSource from "../snippets/kbd/sizes.tsx?raw";
import KbdStatesSnippet from "../snippets/kbd/states";
import statesSource from "../snippets/kbd/states.tsx?raw";

const kbdRootApiRows = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: "контекст или «m»",
    required: "Нет",
    description:
      "Номинальный размер (ритм как у полей ввода). Без пропа: из ближайшего ControlSizeProvider, иначе «m»; для контекста «xs» используется «s».",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс для элемента kbd.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Подпись клавиши, иконка, сочетание символов или смешанная разметка.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLElement>, "size">',
    defaultValue: "—",
    required: "Нет",
    description: "title, hidden, aria-*, data-*, ref и прочие атрибуты нативного kbd.",
  },
] as const;

export default function KbdSection() {
  return (
    <PlaygroundDocPage
      title="Kbd"
      description={
        <>
          Подпись для одной клавиши или шага сочетания: компактная «плашка» с рамкой и лёгкой тенью.
          Размеры <code>s</code>–<code>xl</code> согласованы с контролами; без <code>size</code>{" "}
          масштаб подхватывается из <code>ControlSizeProvider</code> (как у полей и кнопок). Внутрь
          можно положить текст и иконки из кита.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Ряд <code>Kbd.Root</code> с явным <code>size</code>: <code>s</code>, <code>m</code>,{" "}
            <code>l</code>, <code>xl</code>.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <KbdSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Отдельных пропов вроде <code>disabled</code> нет: это не кнопка, а подсказка по клавише.
            Ниже — обычный элемент и вариант с <code>title</code> (нативная всплывающая подсказка);
            при необходимости можно передать <code>hidden</code>, <code>aria-hidden</code> и другие
            атрибуты через разметку.
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <KbdStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            Несколько <code>Kbd.Root</code> в одной строке для сочетания (между ними — обычный текст
            или <code>span</code> с <code>aria-hidden</code>). Во втором ряду — иконка{" "}
            <code>Icon</code> и подпись внутри одного <code>Kbd.Root</code> при{" "}
            <code>size="m"</code>.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <KbdCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Наследование размера из контекста</h4>
          <p className="demoBlockDescription">
            Если <code>size</code> не задан, используется ближайший <code>ControlSizeProvider</code>{" "}
            (типично внутри поля, кнопки или блока формы). Явный <code>size</code> на{" "}
            <code>Kbd.Root</code> перекрывает контекст. Значение контекста <code>xs</code>{" "}
            приводится к размеру клавиши <code>s</code>.
          </p>
          <PlaygroundExampleFrame.Root code={inheritSizeSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <KbdInheritSizeSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Kbd.Root</h5>
          <p className="demoBlockDescription">
            Семантический элемент <code>kbd</code> с оформлением кита; дочерним элементам доступен
            контекст размера для иконок.
          </p>
          <PlaygroundApiTable rows={[...kbdRootApiRows]} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
