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
    description: "Ровно один дочерний элемент (обычно кнопка в подвале); по клику закрывает модал.",
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
    description: 'role="presentation"; остальные атрибуты div.',
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
    description: "id заголовка шапки (тот же, что titleId на Modal.Header).",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "id описания в шапке (тот же, что descriptionId на Modal.Header).",
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
    description: "Шапка, тело, подвал; внутри включается ControlSizeProvider (размер m).",
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
    prop: "title",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Заголовок (внутри фиксированной вёрстки — `h2`).",
  },
  {
    prop: "titleId",
    type: "string",
    defaultValue: "авто (useId)",
    required: "Нет",
    description: "id для `h2`; для `aria-labelledby` на Content задайте то же значение.",
  },
  {
    prop: "description",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подзаголовок (`p` под заголовком).",
  },
  {
    prop: "descriptionId",
    type: "string",
    defaultValue: "авто (useId)",
    required: "Нет",
    description: "id для описания; для `aria-describedby` на Content — то же значение.",
  },
  {
    prop: "icon",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка слева от текстовой колонки.",
  },
  {
    prop: "showClose",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Показать встроенную кнопку закрытия (иконка) в шапке.",
  },
  {
    prop: "closeAriaLabel",
    type: "string",
    defaultValue: '"Close"',
    required: "Нет",
    description: "`aria-label` встроенной кнопки закрытия.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс header.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLElement>, "title">',
    defaultValue: "—",
    required: "Нет",
    description: "Корень <header>.",
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
            Базовый контракт панели: <code>Modal.Header</code> (заголовок и при необходимости
            описание в одном компоненте) + опциональные <code>Modal.Body</code> и{" "}
            <code>Modal.Footer</code>. В примере в начале собраны комбинации: только шапка,
            шапка+футер (без контента), шапка+контент (без футера), а затем полная композиция с
            полем и действиями.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <ModalCompositionSnippet />
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
            Ширина панели задаётся стилями как <code>min(100%, …)</code>: на узком экране панель
            заполняет доступную ширину между отступами оверлея.
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
            Контекст открытости и политика закрытия для вложенных частей.
          </p>
          <PlaygroundApiTable rows={modalRootApiRows} />
          <h5>Modal.Trigger</h5>
          <p className="demoBlockDescription">
            Открывает модал по клику, не отменяя существующий <code>onClick</code> потомка.
          </p>
          <PlaygroundApiTable rows={modalTriggerApiRows} />
          <h5>Modal.Close</h5>
          <p className="demoBlockDescription">
            Оборачивает кнопку действия, которая должна закрыть модал (чаще в подвале: «Отмена»,
            «Готово»).
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
            Единая шапка: заголовок и опциональное описание с фиксированной вёрсткой; опциональная
            иконка; по умолчанию встроенная кнопка закрытия (<code>showClose</code>).
          </p>
          <PlaygroundApiTable rows={modalHeaderApiRows} />
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
