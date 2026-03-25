import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import ModalCompositionSnippet from "../snippets/modal/composition";
import compositionSource from "../snippets/modal/composition.tsx?raw";
import ModalControlledSnippet from "../snippets/modal/controlled";
import controlledSource from "../snippets/modal/controlled.tsx?raw";
import ModalFeaturesSnippet from "../snippets/modal/features";
import featuresSource from "../snippets/modal/features.tsx?raw";
import ModalFullWidthSnippet from "../snippets/modal/full-width";
import fullWidthSource from "../snippets/modal/full-width.tsx?raw";
import ModalResponsiveSnippet from "../snippets/modal/responsive";
import responsiveSource from "../snippets/modal/responsive.tsx?raw";
import ModalSizesSnippet from "../snippets/modal/sizes";
import sizesSource from "../snippets/modal/sizes.tsx?raw";
import ModalStatesSnippet from "../snippets/modal/states";
import statesSource from "../snippets/modal/states.tsx?raw";

const modalRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "open",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое открытие; вместе с onOpenChange.",
  },
  {
    prop: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Начальное состояние в неконтролируемом режиме.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при смене открытости (триггер, закрытие, программно).",
  },
  {
    prop: "closeOnEscape",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Закрытие по Escape внутри открытого диалога.",
  },
  {
    prop: "closeOnOverlayClick",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Закрытие по клику на подложку (только если target — сам оверлей).",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Масштаб панели, отступов оверлея и ярус ControlSizeProvider внутри Content.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Триггер, портал и прочая разметка внутри провайдера контекста.",
  },
];

const modalTriggerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactElement<{ onClick?: React.MouseEventHandler }>",
    defaultValue: "—",
    required: "Да",
    description: "Ровно один дочерний элемент; к нему добавляется открытие по клику.",
  },
];

const modalCloseApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactElement<{ onClick?: …; className?: string; size?: ButtonSize }>",
    defaultValue: "—",
    required: "Да",
    description:
      "Ровно один дочерний элемент; по клику закрывает модал. В шапке для Button.Root без size подставляется размер оболочки.",
  },
];

const modalPortalApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое портала; не рендерится, пока модал закрыт.",
  },
  {
    prop: "container",
    type: "HTMLElement | null",
    defaultValue: "document.body",
    required: "Нет",
    description: "Узел для createPortal; по умолчанию document.body.",
  },
];

const modalOverlayApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс подложки.",
  },
  {
    prop: "onClick",
    type: "React.MouseEventHandler<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается до логики закрытия по клику на подложку.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: 'role="presentation", data-size от контекста; остальные атрибуты div.',
  },
];

const modalContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "aria-label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись диалога без видимого заголовка (сочетать с правилами доступности).",
  },
  {
    prop: "aria-labelledby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "id элемента с названием (часто Modal.Title).",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "id элемента с описанием (часто Modal.Description).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс панели диалога.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Шапка, тело, подвал; внутри включается ControlSizeProvider.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description:
      'role="dialog", aria-modal, tabIndex={-1}, фокус-ловушка, блокировка скролла, Escape.',
  },
];

const modalHeaderApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "icon",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Слот иконки слева от текстовой колонки заголовка.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс header.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно Title, Description, Close; контекст для Modal.Close в шапке.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Корень <header>.",
  },
];

const modalTitleApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс заголовка.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст названия; задайте id для aria-labelledby на Content.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLHeadingElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Рендерится как <h2>.",
  },
];

const modalDescriptionApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс описания.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Вторичный текст под заголовком.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLParagraphElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Рендерится как <p>.",
  },
];

const modalBodyApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс области контента.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Основное содержимое диалога.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Корень div тела.",
  },
];

const modalFooterApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс подвала.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Ряд кнопок действий.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Рендерится как <footer>.",
  },
];

export default function ModalSection() {
  return (
    <PlaygroundDocPage
      headingId="modal-heading"
      title="Modal"
      description={
        <>
          Окно поверх страницы для важного текста, подтверждений и коротких форм. Открывается по
          клику на триггер или из кода, блокирует прокрутку фона и удерживает фокус внутри панели,
          пока пользователь не закроет диалог.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Структура и композиция</h4>
          <p className="demoBlockDescription">
            Базовый контракт панели: <code>Modal.Header</code> + опциональные{" "}
            <code>Modal.Body</code> и <code>Modal.Footer</code>. В примере в начале собраны
            комбинации: только шапка, шапка+футер (без контента), шапка+контент (без футера), а
            затем полная композиция с полем и действиями.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ModalCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре значения <code>size</code> на <code>Modal.Root</code> (<code>s</code>,{" "}
            <code>m</code>, <code>l</code>, <code>xl</code>): ширина панели, отступы оверлея, сетка
            шапки и размер кнопки закрытия в <code>Modal.Header</code> без собственного{" "}
            <code>size</code>.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <ModalSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            По умолчанию закрытие по Escape и клику на подложку; с{" "}
            <code>closeOnEscape=&#123;false&#125;</code> и{" "}
            <code>closeOnOverlayClick=&#123;false&#125;</code> — только явные кнопки (например
            опасное действие или пошаговый сценарий).
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <ModalStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Пара <code>open</code> и <code>onOpenChange</code>: открытие и закрытие с кнопок вне
            модала, синхронизация с маршрутом или стором; <code>Modal.Trigger</code> не обязателен.
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <ModalControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            В <code>Modal.Footer</code> вертикальный стек: у <code>Button.Root</code> включён{" "}
            <code>fullWidth</code>, чтобы кнопки занимали всю ширину колонки панели (удобно на узком
            макете).
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <ModalFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Адаптивная ширина</h4>
          <p className="demoBlockDescription">
            Ширина панели задаётся стилями как <code>min(100%, …)</code> для каждого{" "}
            <code>size</code>: на узком экране панель заполняет доступную ширину между отступами
            оверлея.
          </p>
          <PlaygroundExampleFrame.Root code={responsiveSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <ModalResponsiveSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи</h4>
          <p className="demoBlockDescription">
            Проп <code>container</code> у <code>Modal.Portal</code> для монтирования в заданный
            узел; прокрутка длинного списка через ограничение высоты на <code>Modal.Body</code> при
            заблокированном фоне.
          </p>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ModalFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Modal.Root</h5>
          <p className="demoBlockDescription">
            Контекст открытости, политика закрытия и масштаб оболочки для вложенных частей.
          </p>
          <PlaygroundApiTable rows={modalRootApiRows} />
          <h5>Modal.Trigger</h5>
          <p className="demoBlockDescription">
            Открывает модал по клику, не отменяя существующий <code>onClick</code> потомка.
          </p>
          <PlaygroundApiTable rows={modalTriggerApiRows} />
          <h5>Modal.Close</h5>
          <p className="demoBlockDescription">
            Закрывает модал по клику; внутри <code>Modal.Header</code> выравнивает{" "}
            <code>Button.Root</code> по размеру оболочки.
          </p>
          <PlaygroundApiTable rows={modalCloseApiRows} />
          <h5>Modal.Portal</h5>
          <p className="demoBlockDescription">
            Рендер содержимого в портал только при открытом модале.
          </p>
          <PlaygroundApiTable rows={modalPortalApiRows} />
          <h5>Modal.Overlay</h5>
          <p className="demoBlockDescription">
            Полноэкранная подложка; клик по ней закрывает модал при включённом{" "}
            <code>closeOnOverlayClick</code>.
          </p>
          <PlaygroundApiTable rows={modalOverlayApiRows} />
          <h5>Modal.Content</h5>
          <p className="demoBlockDescription">
            Панель диалога: фокус-ловушка, блокировка скролла, скрытие остальной страницы для
            вспомогательных технологий.
          </p>
          <PlaygroundApiTable rows={modalContentApiRows} />
          <h5>Modal.Header</h5>
          <p className="demoBlockDescription">
            Шапка с опциональной иконкой и текстовой колонкой; задаёт контекст для кнопки закрытия.
          </p>
          <PlaygroundApiTable rows={modalHeaderApiRows} />
          <h5>Modal.Title</h5>
          <p className="demoBlockDescription">
            Заголовок уровня <code>h2</code> с типографикой модала.
          </p>
          <PlaygroundApiTable rows={modalTitleApiRows} />
          <h5>Modal.Description</h5>
          <p className="demoBlockDescription">Вторичный текст под заголовком.</p>
          <PlaygroundApiTable rows={modalDescriptionApiRows} />
          <h5>Modal.Body</h5>
          <p className="demoBlockDescription">Основная область контента.</p>
          <PlaygroundApiTable rows={modalBodyApiRows} />
          <h5>Modal.Footer</h5>
          <p className="demoBlockDescription">Нижняя зона для кнопок действий.</p>
          <PlaygroundApiTable rows={modalFooterApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
