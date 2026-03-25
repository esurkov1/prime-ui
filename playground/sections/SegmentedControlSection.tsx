import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import SegmentedCompositionSnippet from "../snippets/segmented/composition";
import segmentedCompositionSource from "../snippets/segmented/composition.tsx?raw";
import SegmentedControlledSnippet from "../snippets/segmented/controlled";
import segmentedControlledSource from "../snippets/segmented/controlled.tsx?raw";
import SegmentedFeaturesSnippet from "../snippets/segmented/features";
import segmentedFeaturesSource from "../snippets/segmented/features.tsx?raw";
import SegmentedFullWidthSnippet from "../snippets/segmented/full-width";
import segmentedFullWidthSource from "../snippets/segmented/full-width.tsx?raw";
import SegmentedSizesSnippet from "../snippets/segmented/sizes";
import segmentedSizesSource from "../snippets/segmented/sizes.tsx?raw";
import SegmentedStatesSnippet from "../snippets/segmented/states";
import segmentedStatesSource from "../snippets/segmented/states.tsx?raw";

const segmentedRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Выбранное значение в контролируемом режиме (должно совпадать с value одного из Item).",
  },
  {
    prop: "defaultValue",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description:
      "Начальное значение при неконтролируемом режиме; пустая строка — ни один сегмент не выбран.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при смене выбранного сегмента (клик или клавиатура на группе).",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Блокирует всю группу: aria-disabled на radiogroup, все сегменты неактивны.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Высота сегментов, отступы, кегль и размер иконки из одного яруса токенов контрола.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description:
      "Сегменты (SegmentedControl.Item) и опционально плавающий индикатор рендерится корнем.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Дополнительный CSS-класс на контейнере radiogroup (например width: 100% для полной ширины).",
  },
];

const segmentedItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Идентификатор сегмента; сравнивается с value/defaultValue корня.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Отключает один сегмент; при навигации стрелками пропускается.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Подпись, SegmentedControl.Icon и прочая разметка внутри кнопки role=radio.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс на кнопке сегмента.",
  },
];

const segmentedIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Иконка (например из prime-ui-kit/icons); обёртка помечена aria-hidden.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс на span.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "data-*, style и прочие атрибуты span (кроме children).",
  },
];

export default function SegmentedControlSection() {
  return (
    <PlaygroundDocPage
      title="SegmentedControl"
      description={
        <>
          Переключатель из нескольких взаимоисключающих сегментов: один выбран, остальные нет.
          Удобно для фильтров периода, вида списка или режима без отдельного выпадающего списка.
          Подсветка выбранного сегмента анимируется; с клавиатуры можно листать стрелками, пока
          фокус на группе.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре ряда с <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code> — одинаковые подписи сегментов, меняются высота, отступы и кегль.
          </p>
          <PlaygroundExampleFrame.Root
            code={segmentedSizesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <SegmentedSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Рабочая группа; затем <code>disabled</code> на одном <code>Item</code>; затем{" "}
            <code>disabled</code> на <code>Root</code> — весь контроль неактивен (
            <code>aria-disabled</code> на radiogroup).
          </p>
          <PlaygroundExampleFrame.Root
            code={segmentedStatesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <SegmentedStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Состояние выбора хранится в React: <code>value</code> и <code>onValueChange</code> на{" "}
            <code>Root</code> (без <code>defaultValue</code>).
          </p>
          <PlaygroundExampleFrame.Root
            code={segmentedControlledSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <SegmentedControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            <code>SegmentedControl.Icon</code> рядом с текстом; отдельный ряд «только иконки» —
            внутри сегмента остаётся скрытый текст, чтобы у кнопки было доступное имя (иконка с{" "}
            <code>aria-hidden</code> не озвучивается).
          </p>
          <PlaygroundExampleFrame.Root
            code={segmentedCompositionSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <SegmentedCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            Корень по умолчанию сужается по содержимому (<code>width: fit-content</code>); через{" "}
            <code>className</code> задаётся <code>width: 100%</code> в узком контейнере — колонки
            сетки делят ширину поровну.
          </p>
          <PlaygroundExampleFrame.Root code={segmentedFullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SegmentedFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи</h4>
          <p className="demoBlockDescription">
            Два, три и четыре сегмента в одной сетке; плавающий индикатор подстраивается под
            активный пункт. На сфокусированной группе <code>role=&quot;radiogroup&quot;</code>{" "}
            стрелки влево/вправо переносят выбор (и фокус) между включёнными сегментами.
          </p>
          <PlaygroundExampleFrame.Root
            code={segmentedFeaturesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <SegmentedFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>SegmentedControl.Root</h5>
          <p className="demoBlockDescription">
            Контейнер <code>radiogroup</code>: хранит выбранное значение, раздаёт контекст
            сегментам, обрабатывает клавиши-стрелки и позиционирует визуальный индикатор.
          </p>
          <PlaygroundApiTable rows={segmentedRootApiRows} />
          <h5>SegmentedControl.Item</h5>
          <p className="demoBlockDescription">
            Один сегмент как <code>button</code> с <code>role=&quot;radio&quot;</code>, связанный с
            группой через контекст.
          </p>
          <PlaygroundApiTable rows={segmentedItemApiRows} />
          <h5>SegmentedControl.Icon</h5>
          <p className="demoBlockDescription">
            Выравнивает иконку по строке сегмента; размер SVG задаётся стилями от{" "}
            <code>data-size</code> корня.
          </p>
          <PlaygroundApiTable rows={segmentedIconApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
