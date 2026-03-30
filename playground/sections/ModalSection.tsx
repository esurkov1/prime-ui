import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import ModalCompositionSnippet from "../snippets/modal/composition";
import compositionSource from "../snippets/modal/composition.tsx?raw";
import ModalControlledSnippet from "../snippets/modal/controlled";
import controlledSource from "../snippets/modal/controlled.tsx?raw";
import ModalFeaturesSnippet from "../snippets/modal/features";
import featuresSource from "../snippets/modal/features.tsx?raw";
import ModalFullWidthSnippet from "../snippets/modal/full-width";
import fullWidthSource from "../snippets/modal/full-width.tsx?raw";
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
    prop: "confirmOnEnter",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Enter имитирует клик по `Modal.Footer` `primary` (см. также `onEnterConfirm`).",
  },
  {
    prop: "onEnterConfirm",
    type: "(event: KeyboardEvent) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Свой обработчик вместо программного клика по primary.",
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

const modalPanelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "title",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Заголовок шапки; если задан, показывается шапка с `h2`, тело — с разделителем.",
  },
  {
    prop: "description",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подзаголовок под заголовком.",
  },
  {
    prop: "icon",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка слева от текста в шапке.",
  },
  {
    prop: "showClose",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Встроенная кнопка закрытия в шапке (если есть `title`).",
  },
  {
    prop: "closeAriaLabel",
    type: "string",
    defaultValue: '"Close"',
    required: "Нет",
    description: "`aria-label` для кнопки закрытия в шапке.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Основной контент; при наличии `title` оформляется как тело панели.",
  },
  {
    prop: "footer",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Нижняя зона; предпочтительно `Modal.Footer` (`secondary` / `extra` / `primary`).",
  },
  {
    prop: "footerClassName",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на `<footer>` (сливается с `Modal.Footer`, если `footer` — он).",
  },
  {
    prop: "bodyClassName",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на области тела (если есть `title` и `children`).",
  },
  {
    prop: "bodyStyle",
    type: "React.CSSProperties",
    defaultValue: "—",
    required: "Нет",
    description: "Инлайн-стили тела (например maxHeight + overflow для прокрутки).",
  },
  {
    prop: "container",
    type: "HTMLElement | null",
    defaultValue: "document.body",
    required: "Нет",
    description: "Узел для портала.",
  },
  {
    prop: "overlayClassName",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на полноэкранной подложке.",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Имя диалога без шапки (например headless); иначе связывание через `title`.",
  },
  {
    prop: "aria-labelledby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Переопределение id заголовка для `role=dialog`.",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Переопределение id описания.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на панели диалога (белая карточка).",
  },
  {
    prop: "style",
    type: "React.CSSProperties",
    defaultValue: "—",
    required: "Нет",
    description: "Инлайн-стили панели.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты корня панели (фокус, a11y, data-*).",
  },
];

export default function ModalSection() {
  return (
    <PageContent.Section aria-labelledby="modal-heading">
      <PageContent.Header>
        <PageContent.Title id="modal-heading">Modal</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Окно поверх страницы для важного текста, подтверждений и коротких форм. Открывается по
              клику на триггер или из кода, блокирует прокрутку фона и удерживает фокус внутри
              панели, пока пользователь не закроет диалог.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Структура и композиция</DemoSectionTitle>
            <DemoDescription>
              Публичный API: <code>Modal.Root</code> → <code>Modal.Panel</code> с пропами{" "}
              <code>title</code>, <code>description</code>, <code>children</code>,{" "}
              <code>footer</code>. Ниже — варианты: только шапка+футер, шапка+текст, только шапка,
              форма, юртекст.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ModalCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              По умолчанию закрытие по Escape и клику на подложку; с{" "}
              <code>closeOnEscape=&#123;false&#125;</code> и{" "}
              <code>closeOnOverlayClick=&#123;false&#125;</code> — только явные кнопки (например
              опасное действие или пошаговый сценарий).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <ModalStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              Пара <code>open</code> и <code>onOpenChange</code>: открытие и закрытие с кнопок вне
              модала, синхронизация с маршрутом или стором; <code>Modal.Trigger</code> не
              обязателен.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <ModalControlledSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Full width</DemoSectionTitle>
            <DemoDescription>
              В <code>footer</code> — вертикальный стек: у <code>Button.Root</code> включён{" "}
              <code>fullWidth</code>, чтобы кнопки занимали всю ширину колонки панели (удобно на
              узком макете).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <ModalFullWidthSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
            <DemoDescription>
              Проп <code>container</code> у <code>Modal.Panel</code> для монтирования в заданный
              узел; прокрутка длинного списка — через <code>bodyStyle</code> (например maxHeight)
              при заблокированном фоне.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ModalFeaturesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Modal.Root</DemoApiTitle>
            <DemoDescription>
              Контекст открытости и политика закрытия для вложенных частей.
            </DemoDescription>
            <PlaygroundApiTable rows={modalRootApiRows} />
            <DemoApiTitle>Modal.Trigger</DemoApiTitle>
            <DemoDescription>
              Открывает модал по клику, не отменяя существующий <code>onClick</code> потомка.
            </DemoDescription>
            <PlaygroundApiTable rows={modalTriggerApiRows} />
            <DemoApiTitle>Modal.Close</DemoApiTitle>
            <DemoDescription>
              Оборачивает кнопку действия, которая должна закрыть модал (чаще в подвале: «Отмена»,
              «Готово»).
            </DemoDescription>
            <PlaygroundApiTable rows={modalCloseApiRows} />
            <DemoApiTitle>Modal.Panel</DemoApiTitle>
            <DemoDescription>
              Единственная оболочка панели: портал, подложка, белая карточка, фокус-ловушка, Escape,
              скролл-лок, шапка/тело/подвал из пропсов. Ширина панели по умолчанию ограничена
              вьюпортом в стилях (<code>min(100%, …)</code>) — отдельного режима «адаптивной ширины»
              не нужно. Без <code>title</code> — только <code>children</code> (например Command Menu
              с <code>aria-labelledby</code>).
            </DemoDescription>
            <PlaygroundApiTable rows={modalPanelApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
