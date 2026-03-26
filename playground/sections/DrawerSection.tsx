import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
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
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>size</code> на <code>Drawer.Content</code> (<code>s</code>,{" "}
            <code>m</code>, <code>l</code>, <code>xl</code>): отступы панели, зазоры шапки и
            подвала, кегль заголовка и размер встроенной кнопки закрытия в{" "}
            <code>Drawer.Header</code> берутся из одного яруса.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты и сторона выезда</DemoSectionTitle>
          <DemoDescription>
            Проп <code>side</code> на <code>Drawer.Content</code>: панель справа (по умолчанию),
            слева, снизу или сверху. Для нижнего и верхнего листа в стилях задан предел высоты и
            скругление у края экрана.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSidesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerVariantsSidesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Слева: <code>closeOnEscape=&#123;false&#125;</code> и{" "}
            <code>closeOnOverlayClick=&#123;false&#125;</code> на <code>Drawer.Root</code> —
            закрытие только явными кнопками. Справа: <code>showCloseButton=&#123;false&#125;</code>{" "}
            на <code>Drawer.Header</code> — без крестика в шапке, выход через подвал или программно.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Пара <code>open</code> и <code>onOpenChange</code>: открытие и закрытие с кнопок вне
            панели, синхронизация с маршрутом или стором; <code>Drawer.Trigger</code> не обязателен.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            <code>Drawer.Header</code> с заголовком, поле <code>Input</code> в{" "}
            <code>Drawer.Body</code>, действия в <code>Drawer.Footer</code>; закрытие отмены через{" "}
            <code>Drawer.Close</code> вокруг кнопки.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            В <code>Drawer.Footer</code> вертикальный стек: у <code>Button.Root</code> включён{" "}
            <code>fullWidth</code>, чтобы кнопки занимали всю ширину колонки панели.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Адаптивная ширина</DemoSectionTitle>
          <DemoDescription>
            Боковая панель не шире <code>90vw</code>; у листов сверху/снизу ограничена высота —
            длинный текст уходит в прокрутку в <code>Drawer.Body</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={responsiveSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerResponsiveSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Триггер на ссылке</DemoSectionTitle>
          <DemoDescription>
            <code>Drawer.Trigger</code> с единственным потомком-<code>LinkButton</code>: открытие по
            клику без отдельного пропа <code>asChild</code> (слияние через <code>cloneElement</code>
            ).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={triggerLinkSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DrawerTriggerLinkSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            Проп <code>container</code> у <code>Drawer.Portal</code>; подпись диалога только через{" "}
            <code>aria-label</code> на <code>Drawer.Content</code>; прокрутка длинного списка в{" "}
            <code>Drawer.Body</code> при заблокированном фоне.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DrawerFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Drawer.Root</DemoApiTitle>
          <DemoDescription>
            Контекст открытости и политика закрытия по Escape и клику на подложку.
          </DemoDescription>
          <PlaygroundApiTable rows={drawerRootApiRows} />
          <DemoApiTitle>Drawer.Trigger</DemoApiTitle>
          <DemoDescription>
            Открывает панель по клику, не отменяя существующий <code>onClick</code> потомка.
          </DemoDescription>
          <PlaygroundApiTable rows={drawerTriggerApiRows} />
          <DemoApiTitle>Drawer.Close</DemoApiTitle>
          <DemoDescription>Закрывает панель по клику на обёрнутый элемент.</DemoDescription>
          <PlaygroundApiTable rows={drawerCloseApiRows} />
          <DemoApiTitle>Drawer.Portal</DemoApiTitle>
          <DemoDescription>Рендер содержимого в портал только при открытом drawer.</DemoDescription>
          <PlaygroundApiTable rows={drawerPortalApiRows} />
          <DemoApiTitle>Drawer.Overlay</DemoApiTitle>
          <DemoDescription>
            Полноэкранная подложка; клик по ней закрывает панель при включённом{" "}
            <code>closeOnOverlayClick</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={drawerOverlayApiRows} />
          <DemoApiTitle>Drawer.Content</DemoApiTitle>
          <DemoDescription>
            Панель-диалог: фокус-ловушка, блокировка скролла, скрытие остальной страницы для
            вспомогательных технологий.
          </DemoDescription>
          <PlaygroundApiTable rows={drawerContentApiRows} />
          <DemoApiTitle>Drawer.Header</DemoApiTitle>
          <DemoDescription>
            Шапка с колонкой заголовка и опциональной встроенной кнопкой закрытия.
          </DemoDescription>
          <PlaygroundApiTable rows={drawerHeaderApiRows} />
          <DemoApiTitle>Drawer.Title</DemoApiTitle>
          <DemoDescription>
            Заголовок уровня <code>h2</code> с типографикой панели.
          </DemoDescription>
          <PlaygroundApiTable rows={drawerTitleApiRows} />
          <DemoApiTitle>Drawer.Body</DemoApiTitle>
          <DemoDescription>
            Основная область контента с прокруткой при переполнении.
          </DemoDescription>
          <PlaygroundApiTable rows={drawerBodyApiRows} />
          <DemoApiTitle>Drawer.Footer</DemoApiTitle>
          <DemoDescription>Нижняя зона для кнопок действий.</DemoDescription>
          <PlaygroundApiTable rows={drawerFooterApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
