import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import BadgeContextSizeSnippet from "../snippets/badge/context-size";
import badgeContextSizeSource from "../snippets/badge/context-size.tsx?raw";
import BadgeDisabledSnippet from "../snippets/badge/disabled";
import badgeDisabledSource from "../snippets/badge/disabled.tsx?raw";
import BadgeDotIconSnippet from "../snippets/badge/dot-icon";
import badgeDotIconSource from "../snippets/badge/dot-icon.tsx?raw";
import BadgeIconsSnippet from "../snippets/badge/icons";
import badgeIconsSource from "../snippets/badge/icons.tsx?raw";
import BadgeSemanticColorsSnippet from "../snippets/badge/semantic-colors";
import badgeSemanticColorsSource from "../snippets/badge/semantic-colors.tsx?raw";
import BadgeSizesSnippet from "../snippets/badge/sizes";
import badgeSizesSource from "../snippets/badge/sizes.tsx?raw";
import BadgeVariantsSnippet from "../snippets/badge/variants";
import badgeVariantsSource from "../snippets/badge/variants.tsx?raw";

const badgeRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "color",
    type: '"gray" | "red" | "blue" | "green" | "orange" | "yellow" | "purple" | "sky" | "pink" | "teal"',
    defaultValue: '"gray"',
    required: "Нет",
    description: 'Семантический цвет заливки и текста; не используется при variant="status".',
  },
  {
    prop: "variant",
    type: '"filled" | "light" | "lighter" | "stroke" | "status"',
    defaultValue: '"light"',
    required: "Нет",
    description: "Визуальный стиль: заливка, мягкий фон, обводка или статус с точкой.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: 'из контекста или "m"',
    required: "Нет",
    description:
      'Размер бейджа; если не задан, берётся из ControlSizeContext (контрольная поверхность → размер поля ввода), иначе "m".',
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Приглушённый вид (data-disabled).",
  },
  {
    prop: "status",
    type: '"online" | "offline" | "away" | "busy"',
    defaultValue: '"online"',
    required: "Нет",
    description: 'Цвет индикаторной точки; только при variant="status".',
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: 'aria-label на корне при variant="status" (role="status").',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст и слоты (<Badge.Dot />, <Badge.Icon />, иконки).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корневого div.",
  },
  {
    prop: "…htmlProps",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты div: id, style, data-*, обработчики.",
  },
];

const badgeIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Иконка (например <Icon />); оборачивается в span с выравниванием в ряду бейджа.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс обёртки иконки.",
  },
  {
    prop: "…htmlProps",
    type: 'Omit<React.HTMLAttributes<HTMLDivElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты для span-обёртки (кроме children).",
  },
];

const badgeDotApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс декоративной точки.",
  },
  {
    prop: "…htmlProps",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты span; точка помечена aria-hidden.",
  },
];

export default function BadgeSection() {
  return (
    <PlaygroundDocPage
      title="Badge"
      description={
        <>
          Небольшая метка рядом с текстом или в списке: статус, категория, счётчик. Набор частей{" "}
          <code>Badge.Root</code>, опционально <code>Badge.Dot</code> и <code>Badge.Icon</code>.
          Цвета и варианты оформления задаются пропами.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Явный проп <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code> при <code>variant=&quot;light&quot;</code> и{" "}
            <code>color=&quot;gray&quot;</code>.
          </p>
          <PlaygroundExampleFrame.Root code={badgeSizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <BadgeSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            Проп <code>variant</code>: <code>filled</code>, <code>light</code>, <code>lighter</code>
            , <code>stroke</code> с одним <code>color</code>; отдельно{" "}
            <code>variant=&quot;status&quot;</code> с <code>status</code> и подписями для экранных
            читалок через <code>label</code>.
          </p>
          <PlaygroundExampleFrame.Root code={badgeVariantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BadgeVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Проп <code>disabled</code>: приглушение на <code>filled</code>, <code>stroke</code> и{" "}
            <code>status</code>.
          </p>
          <PlaygroundExampleFrame.Root code={badgeDisabledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BadgeDisabledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            <code>Badge.Dot</code> — маркер перед текстом; <code>Badge.Icon</code> — иконка в строке
            метки (проп <code>children</code> обязателен).
          </p>
          <PlaygroundExampleFrame.Root code={badgeDotIconSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BadgeDotIconSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Иконки</h4>
          <p className="demoBlockDescription">
            Примеры <code>Badge</code> с иконками: иконка слева от текста, иконка справа, только
            иконка без текста, комбинация с <code>Badge.Dot</code>. Иконки автоматически
            масштабируются в зависимости от размера бейджа.
          </p>
          <PlaygroundExampleFrame.Root code={badgeIconsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BadgeIconsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Семантические цвета</h4>
          <p className="demoBlockDescription">
            Все значения <code>color</code> на одном <code>variant=&quot;light&quot;</code> и
            размере <code>m</code> — чтобы сравнить палитру подписей.
          </p>
          <PlaygroundExampleFrame.Root
            code={badgeSemanticColorsSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <BadgeSemanticColorsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Размер из контекста</h4>
          <p className="demoBlockDescription">
            Без <code>size</code> на <code>Badge.Root</code> используется ближайший{" "}
            <code>ControlSizeProvider</code>: размер контрольной поверхности маппится как у полей
            ввода; значение <code>xs</code> с контекста даёт визуальный размер <code>s</code>.
          </p>
          <PlaygroundExampleFrame.Root code={badgeContextSizeSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BadgeContextSizeSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Badge.Root</h5>
          <p className="demoBlockDescription">
            Корневой контейнер метки; выставляет <code>data-*</code> для стилей и оборачивает детей
            в <code>ControlSizeProvider</code> для согласованных вложенных иконок.
          </p>
          <PlaygroundApiTable rows={badgeRootApiRows} />

          <h5>Badge.Icon</h5>
          <p className="demoBlockDescription">
            Выравнивает иконку в ряду с текстом бейджа; дочерний элемент обязателен.
          </p>
          <PlaygroundApiTable rows={badgeIconApiRows} />

          <h5>Badge.Dot</h5>
          <p className="demoBlockDescription">
            Декоративная круглая отметка внутри метки (не путать с точкой варианта{" "}
            <code>status</code>).
          </p>
          <PlaygroundApiTable rows={badgeDotApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
