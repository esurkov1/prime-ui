import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import NotificationCompositionSnippet from "../snippets/notification/composition";
import compositionSource from "../snippets/notification/composition.tsx?raw";
import NotificationControlledSnippet from "../snippets/notification/controlled";
import controlledSource from "../snippets/notification/controlled.tsx?raw";
import NotificationFeaturesSnippet from "../snippets/notification/features";
import featuresSource from "../snippets/notification/features.tsx?raw";
import NotificationPositionsSnippet from "../snippets/notification/positions";
import positionsSource from "../snippets/notification/positions.tsx?raw";
import NotificationSizesSnippet from "../snippets/notification/sizes";
import sizesSource from "../snippets/notification/sizes.tsx?raw";
import NotificationStatesSnippet from "../snippets/notification/states";
import statesSource from "../snippets/notification/states.tsx?raw";
import NotificationVariantsSnippet from "../snippets/notification/variants";
import variantsSource from "../snippets/notification/variants.tsx?raw";

const notificationProviderApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Дерево приложения, внутри которого доступны хуки уведомлений.",
  },
  {
    prop: "position",
    type: 'NotificationPosition ("top-left" | "top-center" | …)',
    defaultValue: '"top-right"',
    required: "Нет",
    description: "Позиция по умолчанию, если в notify не передан position.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "5",
    required: "Нет",
    description: "Максимум карточек в одной стопке (одна зона + один type); лишние отбрасываются.",
  },
];

const notifyOptionsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"success" | "error" | "warning" | "info"',
    defaultValue: "—",
    required: "Да",
    description:
      "Семантика и иконка по умолчанию; влияет на role (alert vs status) и группировку стека.",
  },
  {
    prop: "title",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Заголовок карточки.",
  },
  {
    prop: "description",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный текст под заголовком.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Визуальный размер карточки.",
  },
  {
    prop: "position",
    type: "NotificationPosition",
    defaultValue: "из NotificationProvider",
    required: "Нет",
    description: "Угол или край экрана для этой записи.",
  },
  {
    prop: "duration",
    type: "number",
    defaultValue: "5000",
    required: "Нет",
    description:
      "Длительность показа в мс; при persistent игнорируется для автозакрытия. При ≤ 0 таймер не крутится.",
  },
  {
    prop: "persistent",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Не закрывать по таймеру; скрывается полоса прогресса.",
  },
  {
    prop: "icon",
    type: "React.ReactNode",
    defaultValue: "иконка по type",
    required: "Нет",
    description: "Замена стандартной иконки типа.",
  },
  {
    prop: "badge",
    type: "string | number",
    defaultValue: "—",
    required: "Нет",
    description: "Метка рядом с заголовком.",
  },
  {
    prop: "closable",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      "Показать кнопку закрытия; при false тост всё равно исчезнет по таймеру (если не persistent).",
  },
  {
    prop: "action",
    type: "NotificationAction",
    defaultValue: "—",
    required: "Нет",
    description: "Кнопка-действие под текстом: { label, onClick }.",
  },
];

const notificationRecordApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "id",
    type: "string",
    defaultValue: "генерируется",
    required: "Да",
    description: "Стабильный идентификатор для dismiss(id).",
  },
  {
    prop: "createdAt",
    type: "number",
    defaultValue: "Date.now()",
    required: "Да",
    description: "Время создания; сортировка внутри стопки (новые сверху).",
  },
  {
    prop: "type",
    type: '"success" | "error" | "warning" | "info"',
    defaultValue: "—",
    required: "Да",
    description: "Семантика и группировка стека.",
  },
  {
    prop: "title",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Заголовок карточки.",
  },
  {
    prop: "description",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный текст.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l"',
    defaultValue: '"m"',
    required: "Да",
    description: "После merge с дефолтом провайдера.",
  },
  {
    prop: "position",
    type: "NotificationPosition",
    defaultValue: "из провайдера или из options",
    required: "Да",
    description: "Фактическая зона отображения.",
  },
  {
    prop: "duration",
    type: "number",
    defaultValue: "5000",
    required: "Да",
    description:
      "Длительность в мс; при persistent автозакрытие по таймеру не используется, полоса прогресса скрыта.",
  },
  {
    prop: "persistent",
    type: "boolean",
    defaultValue: "false",
    required: "Да",
    description: "Флаг после нормализации.",
  },
  {
    prop: "closable",
    type: "boolean",
    defaultValue: "true",
    required: "Да",
    description: "Показ кнопки закрытия после нормализации.",
  },
  {
    prop: "icon",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Кастомная иконка, если была в options.",
  },
  {
    prop: "badge",
    type: "string | number",
    defaultValue: "—",
    required: "Нет",
    description: "Метка у заголовка.",
  },
  {
    prop: "action",
    type: "NotificationAction",
    defaultValue: "—",
    required: "Нет",
    description: "Кнопка действия: { label, onClick }.",
  },
];

const notificationCardApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "item",
    type: "NotificationRecord",
    defaultValue: "—",
    required: "Да",
    description: "Данные карточки: тип, тексты, размер, таймер и т.д.",
  },
  {
    prop: "paused",
    type: "boolean",
    defaultValue: "—",
    required: "Да",
    description: "Остановка обратного отсчёта (в провайдере — при развёрнутом стеке на hover).",
  },
  {
    prop: "onDismiss",
    type: "(id: string) => void",
    defaultValue: "—",
    required: "Да",
    description: "Закрытие по таймеру или кнопке; id из item.",
  },
  {
    prop: "stackDepth",
    type: "number",
    defaultValue: "0",
    required: "Нет",
    description: "Глубина в стеке для визуала и data-атрибутов.",
  },
  {
    prop: "stackExpanded",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Развёрнут ли стек (влияет на оформление в стопке).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корне article.",
  },
];

const useNotificationsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "notify",
    type: "(options: NotificationOptions) => string",
    defaultValue: "—",
    required: "Да",
    description: "Показать уведомление; возвращает id.",
  },
  {
    prop: "dismiss",
    type: "(id: string) => void",
    defaultValue: "—",
    required: "Да",
    description: "Закрыть одну карточку с exit-анимацией.",
  },
  {
    prop: "dismissAll",
    type: "() => void",
    defaultValue: "—",
    required: "Да",
    description: "Пометить все активные записи на закрытие.",
  },
];

const useNotificationStoreApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "items",
    type: "NotificationRecord[]",
    defaultValue: "[]",
    required: "Да",
    description: "Активные уведомления без внутренних пометок dismissing.",
  },
  ...useNotificationsApiRows,
];

export default function NotificationSection() {
  return (
    <PlaygroundDocPage
      title="Notification"
      description={
        <>
          Всплывающие сообщения поверх интерфейса: оберните приложение в{" "}
          <code>NotificationProvider</code>, вызывайте <code>notify()</code> из экранов и хелперов.
          Есть шесть позиций, размеры <code>s</code> / <code>m</code> / <code>l</code>, таймер с
          полосой прогресса, пауза при наведении на стек, отдельные стопки по типу сообщения и
          опциональная кнопка действия.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Три статичные <code>NotificationCard</code> с <code>size</code> <code>s</code>,{" "}
            <code>m</code> и <code>l</code>; остальные поля записи одинаковые, включая{" "}
            <code>persistent</code> и <code>closable=false</code>, чтобы сравнить только масштаб.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <NotificationSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты (type)</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>type</code>: меняются цвет, иконка по умолчанию и live-роль (
            <code>alert</code> для <code>error</code> и <code>warning</code>, <code>status</code>{" "}
            для остальных).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <NotificationVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Статично: <code>persistent</code> (без полосы таймера) и <code>closable=false</code>{" "}
            (без крестика). Кнопки вызывают <code>notify</code> с коротким <code>duration</code> и с
            подсказкой про паузу при наведении на стек.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <NotificationStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Позиции</DemoSectionTitle>
          <DemoDescription>
            Шесть значений <code>NotificationPosition</code>: каждая кнопка шлёт тост в свой угол
            или в центр края через проп <code>position</code> в <code>notify</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={positionsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <NotificationPositionsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый доступ к очереди</DemoSectionTitle>
          <DemoDescription>
            <code>useNotificationStore()</code>: чтение <code>items</code>, добавление через{" "}
            <code>notify</code> и точечное <code>dismiss(id)</code> по строкам списка.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <NotificationControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Слоты <code>icon</code>, <code>badge</code>, <code>description</code> и{" "}
            <code>action</code>; на статичной карточке — колокол из lucide-react с классом размера
            из стилей кита.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <NotificationCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            Стек из нескольких тостов одного <code>type</code> и <code>position</code>, раздвижение
            по hover,
            <code>dismissAll</code>, а также разная <code>duration</code> для быстрых и длинных
            сообщений.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <NotificationFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>NotificationProvider</DemoApiTitle>
          <DemoDescription>
            Корневой контекст и портал с зонами уведомлений; без него хуки бросают ошибку.
          </DemoDescription>
          <PlaygroundApiTable rows={notificationProviderApiRows} />

          <DemoApiTitle>notify(options)</DemoApiTitle>
          <DemoDescription>
            Поля объекта опций; необязательные при отсутствии подставляются из провайдера или
            дефолтов.
          </DemoDescription>
          <PlaygroundApiTable rows={notifyOptionsApiRows} />

          <DemoApiTitle>NotificationRecord</DemoApiTitle>
          <DemoDescription>
            Форма элемента в <code>items</code> после нормализации внутри провайдера (все поля ниже
            заданы).
          </DemoDescription>
          <PlaygroundApiTable rows={notificationRecordApiRows} />

          <DemoApiTitle>NotificationCard</DemoApiTitle>
          <DemoDescription>
            Карточка для кастомного рендера или превью; в приложении чаще используется только
            провайдер.
          </DemoDescription>
          <PlaygroundApiTable rows={notificationCardApiRows} />

          <DemoApiTitle>useNotifications()</DemoApiTitle>
          <DemoDescription>
            Удобное API без подписки на список: только методы показа и закрытия.
          </DemoDescription>
          <PlaygroundApiTable rows={useNotificationsApiRows} />

          <DemoApiTitle>useNotificationStore()</DemoApiTitle>
          <DemoDescription>
            Полный стор с массивом <code>items</code> для отображения счётчиков, отладки или
            синхронизации с UI.
          </DemoDescription>
          <PlaygroundApiTable rows={useNotificationStoreApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
