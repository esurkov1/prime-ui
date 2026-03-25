import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import SliderCompositionSnippet from "../snippets/slider/composition";
import compositionSource from "../snippets/slider/composition.tsx?raw";
import SliderControlledSnippet from "../snippets/slider/controlled";
import controlledSource from "../snippets/slider/controlled.tsx?raw";
import SliderFeaturesSnippet from "../snippets/slider/features";
import featuresSource from "../snippets/slider/features.tsx?raw";
import SliderFullWidthSnippet from "../snippets/slider/full-width";
import fullWidthSource from "../snippets/slider/full-width.tsx?raw";
import SliderSizesSnippet from "../snippets/slider/sizes";
import sizesSource from "../snippets/slider/sizes.tsx?raw";
import SliderStatesSnippet from "../snippets/slider/states";
import statesSource from "../snippets/slider/states.tsx?raw";

const sliderRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "number",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое значение; вместе с onChange задаёт внешнее состояние.",
  },
  {
    prop: "defaultValue",
    type: "number",
    defaultValue: "min",
    required: "Нет",
    description: "Начальное значение в неконтролируемом режиме; clamp к [min, max].",
  },
  {
    prop: "min",
    type: "number",
    defaultValue: "0",
    required: "Нет",
    description: 'Минимум нативного type="range".',
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "100",
    required: "Нет",
    description: 'Максимум нативного type="range".',
  },
  {
    prop: "step",
    type: "number",
    defaultValue: "1",
    required: "Нет",
    description: "Шаг изменения значения.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Блокировка ввода и снижение непрозрачности трека.",
  },
  {
    prop: "onChange",
    type: "(value: number) => void",
    defaultValue: "—",
    required: "Нет",
    description:
      "Вызывается при смене значения после ввода пользователя (мышь, тач или клавиши на нативном range).",
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Текст над ползунком; создаёт связанный label с htmlFor на input.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Высота трека, размер бегунка и кегль подписи из одного яруса токенов.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корневого контейнера.",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись для доступности, если нет видимого label.",
  },
];

export default function SliderSection() {
  return (
    <PlaygroundDocPage
      title="Slider"
      description={
        <>
          Ползунок для выбора числа в диапазоне: громкость, проценты, температура. Можно задать
          минимум, максимум и шаг, подключить подпись или управлять значением из состояния родителя.
          Работает как нативный элемент диапазона с оформлением кита.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре значения <code>size</code> (<code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code>): высота дорожки, бегунок и размер текста подписи согласованы токенами
            контрола.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SliderSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Обычное состояние и <code>disabled</code>: ползунок не принимает ввод, курсор
            «запрещён».
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SliderStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Пара <code>value</code> + <code>onChange</code>: значение хранится в React-состоянии;
            подпись рядом показывает текущий процент.
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SliderControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            Встроенная подпись через <code>label</code> или ползунок без текста с обязательным для
            смысла <code>aria-label</code> (дробный шаг для «прозрачности»).
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SliderCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            Корень на всю ширину контейнера — в узкой карточке дорожка растягивается вместе с
            колонкой.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SliderFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи</h4>
          <p className="demoBlockDescription">
            Свой диапазон и дискретность: <code>min</code>/<code>max</code>/<code>step</code> —
            целые градусы и крупный шаг по процентам.
          </p>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SliderFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Slider.Root</h5>
          <p className="demoBlockDescription">
            Обёртка с опциональной подписью и нативным <code>input type=&quot;range&quot;</code>.
            Внутри <code>ControlSizeProvider</code> для согласованности с соседними контролами.
          </p>
          <PlaygroundApiTable rows={sliderRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
