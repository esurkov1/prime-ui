import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import DrawerCompositionSnippet from "../snippets/drawer/composition";
import compositionSource from "../snippets/drawer/composition.tsx?raw";
import DrawerControlledSnippet from "../snippets/drawer/controlled";
import controlledSource from "../snippets/drawer/controlled.tsx?raw";
import DrawerFeaturesSnippet from "../snippets/drawer/features";
import featuresSource from "../snippets/drawer/features.tsx?raw";
import DrawerFullWidthSnippet from "../snippets/drawer/full-width";
import fullWidthSource from "../snippets/drawer/full-width.tsx?raw";
import DrawerResponsiveSnippet from "../snippets/drawer/responsive";
import responsiveSource from "../snippets/drawer/responsive.tsx?raw";
import DrawerSizesSnippet from "../snippets/drawer/sizes";
import sizesSource from "../snippets/drawer/sizes.tsx?raw";
import DrawerStatesSnippet from "../snippets/drawer/states";
import statesSource from "../snippets/drawer/states.tsx?raw";
import DrawerTriggerLinkSnippet from "../snippets/drawer/trigger-link";
import triggerLinkSource from "../snippets/drawer/trigger-link.tsx?raw";
import DrawerVariantsSidesSnippet from "../snippets/drawer/variants-sides";
import variantsSidesSource from "../snippets/drawer/variants-sides.tsx?raw";

const drawerRootApiRows: PlaygroundApiPropRow[] = [
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
    description: "Закрытие по Escape, пока панель открыта (обрабатывается в Drawer.Content).",
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
    required: "Да",
    description: "Триггер, портал и прочая разметка внутри провайдера контекста.",
  },
];

const drawerTriggerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactElement<{ onClick?: React.MouseEventHandler }>",
    defaultValue: "—",
    required: "Да",
    description: "Ровно один дочерний элемент; к нему добавляется открытие по клику.",
  },
];

const drawerCloseApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactElement<{ onClick?: React.MouseEventHandler; className?: string }>",
    defaultValue: "—",
    required: "Да",
    description:
      "Ровно один дочерний элемент; по клику закрывает панель после существующего onClick.",
  },
];

const drawerPortalApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое портала; не рендерится, пока drawer закрыт.",
  },
  {
    prop: "container",
    type: "HTMLElement | null",
    defaultValue: "document.body",
    required: "Нет",
    description: "Узел для createPortal; по умолчанию document.body.",
  },
];

const drawerOverlayApiRows: PlaygroundApiPropRow[] = [
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

const drawerContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "side",
    type: '"left" | "right" | "bottom" | "top"',
    defaultValue: '"right"',
    required: "Нет",
    description: "Сторона выезда панели.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус отступов drawer и ControlSizeProvider для шапки, подвала и кнопки закрытия.",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Имя диалога без видимого заголовка (соблюдайте требования доступности).",
  },
  {
    prop: "aria-labelledby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "id элемента с названием (часто Drawer.Title).",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "id элемента с описанием содержимого.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс панели.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Шапка, тело, подвал; задаёт контекст размера для Drawer.Header и Drawer.Footer.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description:
      'role="dialog", aria-modal, tabIndex={-1}, фокус-ловушка, блокировка скролла, скрытие фона через inert.',
  },
];

const drawerHeaderApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "showCloseButton",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Показать встроенную кнопку закрытия (ghost neutral) справа в шапке.",
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
    description: "Обычно Drawer.Title; область слева от кнопки закрытия.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Корень <header>.",
  },
];

const drawerTitleApiRows: PlaygroundApiPropRow[] = [
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

const drawerBodyApiRows: PlaygroundApiPropRow[] = [
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
    description: "Основное содержимое панели; вертикальная прокрутка при переполнении.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Корень div тела.",
  },
];

const drawerFooterApiRows: PlaygroundApiPropRow[] = [
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
    description: "Ряд кнопок действий; внутри ControlSizeProvider с размером из Drawer.Content.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Рендерится как <footer>.",
  },
];

export default function DrawerSection() {
  return (
    <PlaygroundDocPage
      headingId="drawer-heading"
      title="Drawer"
      description={
        <>
          Боковая панель или лист снизу/сверху поверх страницы: удобно для фильтров, деталей записи
          и коротких форм без смены маршрута. При открытии блокируется прокрутка фона, фокус
          остаётся внутри панели, остальная страница отключается для вспомогательных технологий.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре значения <code>size</code> на <code>Drawer.Content</code> (<code>s</code>,{" "}
            <code>m</code>, <code>l</code>, <code>xl</code>): отступы панели, зазоры шапки и
            подвала, кегль заголовка и размер встроенной кнопки закрытия в{" "}
            <code>Drawer.Header</code> берутся из одного яруса.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты и сторона выезда</h4>
          <p className="demoBlockDescription">
            Проп <code>side</code> на <code>Drawer.Content</code>: панель справа (по умолчанию),
            слева, снизу или сверху. Для нижнего и верхнего листа в стилях задан предел высоты и
            скругление у края экрана.
          </p>
          <PlaygroundExampleFrame.Root code={variantsSidesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerVariantsSidesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Слева: <code>closeOnEscape=&#123;false&#125;</code> и{" "}
            <code>closeOnOverlayClick=&#123;false&#125;</code> на <code>Drawer.Root</code> —
            закрытие только явными кнопками. Справа: <code>showCloseButton=&#123;false&#125;</code>{" "}
            на <code>Drawer.Header</code> — без крестика в шапке, выход через подвал или программно.
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Пара <code>open</code> и <code>onOpenChange</code>: открытие и закрытие с кнопок вне
            панели, синхронизация с маршрутом или стором; <code>Drawer.Trigger</code> не обязателен.
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            <code>Drawer.Header</code> с заголовком, поле <code>Input</code> в{" "}
            <code>Drawer.Body</code>, действия в <code>Drawer.Footer</code>; закрытие отмены через{" "}
            <code>Drawer.Close</code> вокруг кнопки.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            В <code>Drawer.Footer</code> вертикальный стек: у <code>Button.Root</code> включён{" "}
            <code>fullWidth</code>, чтобы кнопки занимали всю ширину колонки панели.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Адаптивная ширина</h4>
          <p className="demoBlockDescription">
            Боковая панель не шире <code>90vw</code>; у листов сверху/снизу ограничена высота —
            длинный текст уходит в прокрутку в <code>Drawer.Body</code>.
          </p>
          <PlaygroundExampleFrame.Root code={responsiveSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerResponsiveSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Триггер на ссылке</h4>
          <p className="demoBlockDescription">
            <code>Drawer.Trigger</code> с единственным потомком-<code>LinkButton</code>: открытие по
            клику без отдельного пропа <code>asChild</code> (слияние через <code>cloneElement</code>
            ).
          </p>
          <PlaygroundExampleFrame.Root code={triggerLinkSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerTriggerLinkSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи</h4>
          <p className="demoBlockDescription">
            Проп <code>container</code> у <code>Drawer.Portal</code>; подпись диалога только через{" "}
            <code>aria-label</code> на <code>Drawer.Content</code>; прокрутка длинного списка в{" "}
            <code>Drawer.Body</code> при заблокированном фоне.
          </p>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DrawerFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Drawer.Root</h5>
          <p className="demoBlockDescription">
            Контекст открытости и политика закрытия по Escape и клику на подложку.
          </p>
          <PlaygroundApiTable rows={drawerRootApiRows} />
          <h5>Drawer.Trigger</h5>
          <p className="demoBlockDescription">
            Открывает панель по клику, не отменяя существующий <code>onClick</code> потомка.
          </p>
          <PlaygroundApiTable rows={drawerTriggerApiRows} />
          <h5>Drawer.Close</h5>
          <p className="demoBlockDescription">Закрывает панель по клику на обёрнутый элемент.</p>
          <PlaygroundApiTable rows={drawerCloseApiRows} />
          <h5>Drawer.Portal</h5>
          <p className="demoBlockDescription">
            Рендер содержимого в портал только при открытом drawer.
          </p>
          <PlaygroundApiTable rows={drawerPortalApiRows} />
          <h5>Drawer.Overlay</h5>
          <p className="demoBlockDescription">
            Полноэкранная подложка; клик по ней закрывает панель при включённом{" "}
            <code>closeOnOverlayClick</code>.
          </p>
          <PlaygroundApiTable rows={drawerOverlayApiRows} />
          <h5>Drawer.Content</h5>
          <p className="demoBlockDescription">
            Панель-диалог: фокус-ловушка, блокировка скролла, скрытие остальной страницы для
            вспомогательных технологий.
          </p>
          <PlaygroundApiTable rows={drawerContentApiRows} />
          <h5>Drawer.Header</h5>
          <p className="demoBlockDescription">
            Шапка с колонкой заголовка и опциональной встроенной кнопкой закрытия.
          </p>
          <PlaygroundApiTable rows={drawerHeaderApiRows} />
          <h5>Drawer.Title</h5>
          <p className="demoBlockDescription">
            Заголовок уровня <code>h2</code> с типографикой панели.
          </p>
          <PlaygroundApiTable rows={drawerTitleApiRows} />
          <h5>Drawer.Body</h5>
          <p className="demoBlockDescription">
            Основная область контента с прокруткой при переполнении.
          </p>
          <PlaygroundApiTable rows={drawerBodyApiRows} />
          <h5>Drawer.Footer</h5>
          <p className="demoBlockDescription">Нижняя зона для кнопок действий.</p>
          <PlaygroundApiTable rows={drawerFooterApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
