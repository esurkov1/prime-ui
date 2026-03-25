import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import DividerCompositionSnippet from "../snippets/divider/composition";
import compositionSource from "../snippets/divider/composition.tsx?raw";
import DividerFeaturesSnippet from "../snippets/divider/features";
import featuresSource from "../snippets/divider/features.tsx?raw";
import DividerFullWidthSnippet from "../snippets/divider/full-width";
import fullWidthSource from "../snippets/divider/full-width.tsx?raw";
import DividerOrientationSnippet from "../snippets/divider/orientation";
import orientationSource from "../snippets/divider/orientation.tsx?raw";
import DividerSizesSnippet from "../snippets/divider/sizes";
import sizesSource from "../snippets/divider/sizes.tsx?raw";
import DividerVariantsSnippet from "../snippets/divider/variants";
import variantsSource from "../snippets/divider/variants.tsx?raw";

const dividerRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    required: "Нет",
    description:
      "Горизонтальная линия на всю ширину ряда или вертикальная между соседями в flex-ряду.",
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    defaultValue: "center для variant default, start для variant text",
    required: "Нет",
    description:
      "Где оставить короткую «заглушку» линии относительно подписи (псевдоэлементы до/после контента).",
  },
  {
    prop: "variant",
    type: '"default" | "line-spacing" | "text"',
    defaultValue: '"default"',
    required: "Нет",
    description:
      "default — подпись между линиями или пустая линия; line-spacing — маркер в колонке с gap; text — стиль заголовка секции.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус токенов контрола: зазор, кегль подписи (variant text), отступы и размер иконки в children.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Подпись или разметка с иконкой; без children — сплошная линия (пустой разделитель).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корня.",
  },
  {
    prop: "role",
    type: "string",
    defaultValue: '"separator"',
    required: "Нет",
    description: "Роль в DOM; для декоративной линии часто задают presentation и aria-hidden.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "aria-*, data-*, on* и прочие атрибуты корневого div.",
  },
];

export default function DividerSection() {
  return (
    <PlaygroundDocPage
      title="Divider"
      description={
        <>
          Линия-разделитель и подпись между блоками контента: горизонтально или вертикально, три
          варианта оформления (<code>default</code>, <code>line-spacing</code>, <code>text</code>),
          размеры <code>s</code>–<code>xl</code>. По умолчанию роль <code>separator</code>; при
          необходимости можно сделать линию чисто визуальной через <code>role</code> и{" "}
          <code>aria-hidden</code>.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре размера <code>s</code>–<code>xl</code> в контексте иерархии секций настроек:
            крупные заголовки для основных разделов, компактные — для вложенных блоков и метаданных.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DividerSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            Три варианта в реальных сценариях: <code>default</code> в карточке заказа для разделения
            секций и итоговой суммы, <code>line-spacing</code> между элементами списка настроек,{" "}
            <code>text</code> как заголовки секций формы регистрации.
          </p>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DividerVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Ориентация</h4>
          <p className="demoBlockDescription">
            Вертикальные разделители в типичных UI-паттернах: тулбар текстового редактора с
            группировкой действий форматирования, панель управления таблицей с фильтрами и
            экспортом, горизонтальная навигация с разделением пунктов меню.
          </p>
          <PlaygroundExampleFrame.Root code={orientationSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DividerOrientationSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            Разделители с иконками в контексте: профиль пользователя с секциями контактов и
            местоположения, карточка продукта с характеристиками и рейтингом. Размер иконок
            автоматически согласуется с <code>size</code> корня.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DividerCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            Полноширинные разделители в реальных компонентах: карточка статьи с метаданными, виджет
            уведомлений со списком событий, история финансовых транзакций. Линия автоматически
            занимает всю ширину контейнера.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DividerFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Выравнивание и декоративная линия</h4>
          <p className="demoBlockDescription">
            Выравнивание в реальных сценариях: временная шкала с{" "}
            <code>align=&quot;start&quot;</code> для дат, форма входа с{" "}
            <code>align=&quot;center&quot;</code> для разделителя «или», статистика с декоративной
            линией (<code>role=&quot;presentation&quot;</code>) для визуального разделения метрик.
          </p>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DividerFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Divider.Root</h5>
          <p className="demoBlockDescription">
            Единственный публичный узел: контейнер с псевдоэлементами-линиями и опциональным{" "}
            <code>span</code> для children.
          </p>
          <PlaygroundApiTable rows={dividerRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
