import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import TabsControlledSnippet from "../snippets/tabs/controlled";
import tabsControlledSource from "../snippets/tabs/controlled.tsx?raw";
import TabsFullWidthSnippet from "../snippets/tabs/full-width";
import tabsFullWidthSource from "../snippets/tabs/full-width.tsx?raw";
import TabsHorizontalDisabledSnippet from "../snippets/tabs/horizontal-disabled";
import tabsHorizontalDisabledSource from "../snippets/tabs/horizontal-disabled.tsx?raw";
import TabsLongLabelsSnippet from "../snippets/tabs/long-labels";
import tabsLongLabelsSource from "../snippets/tabs/long-labels.tsx?raw";
import TabsSizesSnippet from "../snippets/tabs/sizes";
import tabsSizesSource from "../snippets/tabs/sizes.tsx?raw";
import TabsVerticalSnippet from "../snippets/tabs/vertical";
import tabsVerticalSource from "../snippets/tabs/vertical.tsx?raw";
import TabsWithIconsSnippet from "../snippets/tabs/with-icons";
import tabsWithIconsSource from "../snippets/tabs/with-icons.tsx?raw";

const tabsRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Активная вкладка в контролируемом режиме; должен совпадать с value у одной из Tabs.Tab.",
  },
  {
    prop: "defaultValue",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description: "Начальная вкладка при неконтролируемом режиме (без value).",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при смене вкладки пользователем или с клавиатуры.",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    required: "Нет",
    description: "Ось списка вкладок и направление стрелок на клавиатуре.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Высота триггера, кегль, отступы и размер иконки из одного яруса токенов.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Tabs.List, Tabs.Tab, Tabs.Panel и вложенная разметка.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс обёртки (например w-full у карточки).",
  },
];

const tabsListApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Триггеры Tabs.Tab; внутри также рисуется индикатор активной вкладки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс для role=tablist (например растягивание на ширину).",
  },
];

const tabsTabApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Уникальный идентификатор вкладки; связывает триггер с Tabs.Panel того же value.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Вкладка не выбирается и выпадает из цикла клавиатурной навигации.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Содержимое кнопки: Tabs.Icon, Tabs.Label, произвольная разметка.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс кнопки-триггера (flex-1, выравнивание и т.д.).",
  },
];

const tabsIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Иконка (например компонент из prime-ui-kit/icons); корень с aria-hidden.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс span.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты span.",
  },
];

const tabsLabelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст подписи вкладки; в узкой колонке может обрезаться многоточием.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс span.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты span.",
  },
];

const tabsPanelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Совпадает с value активной Tabs.Tab; иначе панель не рендерится (null).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Содержимое role=tabpanel под списком вкладок.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс панели.",
  },
];

export default function TabsSection() {
  return (
    <PlaygroundDocPage
      title="Tabs"
      description={
        <>
          Переключение между разделами на одной странице: сверху или сбоку список вкладок, ниже или
          рядом — содержимое выбранного раздела. Можно задать размер, вертикальный режим, отключить
          отдельные пункты и управлять активной вкладкой из кода.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре ряда с <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code>. В каждом — иконка и подпись в одной вкладке, остальные только с{" "}
            <code>Tabs.Label</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tabsSizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <TabsSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Обычные вкладки и <code>disabled</code> на <code>Tabs.Tab</code>: пункт не нажимается,
            не получает фокус в цикле стрелок, панель для него недоступна, пока вкладка неактивна по
            смыслу данных.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={tabsHorizontalDisabledSource.trim()}
            previewLayout="stack"
          >
            <PlaygroundExampleFrame.Stage>
              <TabsHorizontalDisabledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Ориентация</DemoSectionTitle>
          <DemoDescription>
            <code>orientation=&quot;vertical&quot;</code>: список слева, полоса-индикатор справа у
            активной строки, стрелки вверх/вниз на клавиатуре. Горизонтальный список — значение по
            умолчанию (см. блоки выше).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tabsVerticalSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TabsVerticalSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Пара <code>value</code> и <code>onValueChange</code> на <code>Tabs.Root</code>: активная
            вкладка хранится в состоянии родителя (синхронизация с маршрутом, фильтром, шагом
            мастера).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tabsControlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TabsControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Несколько <code>Tabs.Icon</code> в одном триггере (слева и справа от{" "}
            <code>Tabs.Label</code>), в третьей вкладке — две иконки подряд; первая иконка при
            выборе вкладки подсвечивается акцентным цветом.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tabsWithIconsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TabsWithIconsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Отдельного пропа нет: корень и <code>Tabs.List</code> получают <code>className</code> с{" "}
            <code>w-full</code> / <code>min-w-0</code>, у <code>Tabs.Tab</code> —{" "}
            <code>flex-1</code>, чтобы триггеры делили ширину карточки или колонки.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tabsFullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TabsFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            Длинный текст в <code>Tabs.Label</code> в узком контейнере: обрезка с многоточием без
            переноса всего ряда вкладок на вторую строку.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tabsLongLabelsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TabsLongLabelsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Tabs.Root</DemoApiTitle>
          <DemoDescription>
            Обёртка с контекстом: хранит активный <code>value</code>, размер и ориентацию для списка
            и панелей.
          </DemoDescription>
          <PlaygroundApiTable rows={tabsRootApiRows} />
          <DemoApiTitle>Tabs.List</DemoApiTitle>
          <DemoDescription>
            Контейнер <code>role=&quot;tablist&quot;</code> с клавиатурной навигацией и плавающим
            индикатором под активной вкладкой.
          </DemoDescription>
          <PlaygroundApiTable rows={tabsListApiRows} />
          <DemoApiTitle>Tabs.Tab</DemoApiTitle>
          <DemoDescription>
            Кнопка <code>role=&quot;tab&quot;</code>, связанная с панелью через общий{" "}
            <code>value</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={tabsTabApiRows} />
          <DemoApiTitle>Tabs.Icon</DemoApiTitle>
          <DemoDescription>
            Слот иконки в триггере; размер задаётся токенами от <code>size</code> у корня.
          </DemoDescription>
          <PlaygroundApiTable rows={tabsIconApiRows} />
          <DemoApiTitle>Tabs.Label</DemoApiTitle>
          <DemoDescription>
            Подпись вкладки с предсказуемым кеглем и поведением при нехватке места.
          </DemoDescription>
          <PlaygroundApiTable rows={tabsLabelApiRows} />
          <DemoApiTitle>Tabs.Panel</DemoApiTitle>
          <DemoDescription>
            <code>role=&quot;tabpanel&quot;</code>; неактивные панели не монтируются в DOM.
          </DemoDescription>
          <PlaygroundApiTable rows={tabsPanelApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
