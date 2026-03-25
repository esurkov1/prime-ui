import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import ProgressCircleA11yLabelSnippet from "../snippets/progress/circle-a11y-label";
import progressCircleA11yLabelSource from "../snippets/progress/circle-a11y-label.tsx?raw";
import ProgressCircleCompositionSnippet from "../snippets/progress/circle-composition";
import progressCircleCompositionSource from "../snippets/progress/circle-composition.tsx?raw";
import ProgressCircleControlledSnippet from "../snippets/progress/circle-controlled";
import progressCircleControlledSource from "../snippets/progress/circle-controlled.tsx?raw";
import ProgressCircleMaxScaleSnippet from "../snippets/progress/circle-max-scale";
import progressCircleMaxScaleSource from "../snippets/progress/circle-max-scale.tsx?raw";
import ProgressCircleSizesSnippet from "../snippets/progress/circle-sizes";
import progressCircleSizesSource from "../snippets/progress/circle-sizes.tsx?raw";
import ProgressCircleStatesSnippet from "../snippets/progress/circle-states";
import progressCircleStatesSource from "../snippets/progress/circle-states.tsx?raw";

const progressCircleRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description: "Текущее значение; приводится к диапазону от 0 до max.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "100",
    required: "Нет",
    description: "Верхняя граница шкалы; при max ≤ 0 используется 100.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Диаметр кольца и толщина штриха из примитивов progressCircle.",
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Доступное имя индикатора (aria-label на SVG), если в центре нет текста.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое по центру кольца (проценты, подпись, иконка).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корневого контейнера.",
  },
  {
    prop: "ref",
    type: "React.Ref<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Ref на обёртку вокруг SVG и центрального слота.",
  },
];

export default function ProgressCircleSection() {
  return (
    <PlaygroundDocPage
      title="ProgressCircle"
      description={
        <>
          Круговой индикатор прогресса: кольцо на SVG с ролью <code>progressbar</code>, размеры{" "}
          <code>s</code>–<code>xl</code>, настраиваемая шкала через <code>max</code> и опциональный
          центр через <code>children</code> или скрытая подпись через <code>label</code>.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Одинаковое заполнение (<code>value=50</code>) при разных <code>size</code>: меняются
            диаметр и толщина обводки.
          </p>
          <PlaygroundExampleFrame.Root
            code={progressCircleSizesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <ProgressCircleSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты шкалы</h4>
          <p className="demoBlockDescription">
            Одна и та же доля дуги при разных <code>max</code>: проценты, счётчик шагов, крупная
            числовая шкала.
          </p>
          <PlaygroundExampleFrame.Root
            code={progressCircleMaxScaleSource.trim()}
            previewLayout="row"
          >
            <PlaygroundExampleFrame.Stage>
              <ProgressCircleMaxScaleSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния значения</h4>
          <p className="demoBlockDescription">
            Пустое, частичное и полное кольцо; отрицательные и завышенные <code>value</code>{" "}
            усекаются до <code>0</code> и <code>max</code>.
          </p>
          <PlaygroundExampleFrame.Root
            code={progressCircleStatesSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <ProgressCircleStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Значение из состояния</h4>
          <p className="demoBlockDescription">
            Прогресс задаётся снаружи (<code>value</code> из <code>useState</code>); кнопки меняют
            число так же, как при опросе API или таймера.
          </p>
          <PlaygroundExampleFrame.Root
            code={progressCircleControlledSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <ProgressCircleControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция центра</h4>
          <p className="demoBlockDescription">
            В <code>children</code> можно собрать иконку, заголовок и второстепенный текст — контент
            центрируется поверх кольца.
          </p>
          <PlaygroundExampleFrame.Root
            code={progressCircleCompositionSource.trim()}
            previewLayout="row"
          >
            <PlaygroundExampleFrame.Stage>
              <ProgressCircleCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Имя без текста в центре</h4>
          <p className="demoBlockDescription">
            Кольцо без <code>children</code>: смысл для вспомогательных технологий задаётся{" "}
            <code>label</code> (попадает в <code>aria-label</code> SVG).
          </p>
          <PlaygroundExampleFrame.Root
            code={progressCircleA11yLabelSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <ProgressCircleA11yLabelSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>ProgressCircle.Root</h5>
          <p className="demoBlockDescription">
            Единственный публичный узел: SVG-дуга и опциональный слот по центру.
          </p>
          <PlaygroundApiTable rows={progressCircleRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
