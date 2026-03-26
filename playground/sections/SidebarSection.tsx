import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import SidebarAsChildSnippet from "../snippets/sidebar/as-child";
import asChildSource from "../snippets/sidebar/as-child.tsx?raw";
import SidebarCompositionSnippet from "../snippets/sidebar/composition";
import compositionSource from "../snippets/sidebar/composition.tsx?raw";
import SidebarControlledSnippet from "../snippets/sidebar/controlled";
import controlledSource from "../snippets/sidebar/controlled.tsx?raw";
import SidebarFullWidthSnippet from "../snippets/sidebar/full-width";
import fullWidthSource from "../snippets/sidebar/full-width.tsx?raw";
import SidebarLayoutOptionsSnippet from "../snippets/sidebar/layout-options";
import layoutOptionsSource from "../snippets/sidebar/layout-options.tsx?raw";
import SidebarNavToSnippet from "../snippets/sidebar/nav-to";
import navToSource from "../snippets/sidebar/nav-to.tsx?raw";
import SidebarResponsiveSnippet from "../snippets/sidebar/responsive";
import responsiveSource from "../snippets/sidebar/responsive.tsx?raw";
import SidebarSizesSnippet from "../snippets/sidebar/sizes";
import sidebarSizesSource from "../snippets/sidebar/sizes.tsx?raw";
import SidebarStatesSnippet from "../snippets/sidebar/states";
import statesSource from "../snippets/sidebar/states.tsx?raw";
import SidebarVariantsSnippet from "../snippets/sidebar/variants";
import variantsSource from "../snippets/sidebar/variants.tsx?raw";
import {
  sidebarContentApiRows,
  sidebarContextBarApiRows,
  sidebarContextBarBodyApiRows,
  sidebarContextBarFooterApiRows,
  sidebarContextBarHeaderApiRows,
  sidebarContextItemButtonApiRows,
  sidebarFooterApiRows,
  sidebarGroupApiRows,
  sidebarGroupLabelApiRows,
  sidebarHeaderApiRows,
  sidebarHeaderMainApiRows,
  sidebarHeaderRowApiRows,
  sidebarIdentityButtonApiRows,
  sidebarMenuActionApiRows,
  sidebarMenuApiRows,
  sidebarMenuButtonApiRows,
  sidebarMenuIconApiRows,
  sidebarMenuItemApiRows,
  sidebarMenuLabelApiRows,
  sidebarMenuLinkApiRows,
  sidebarMenuRouterLinkApiRows,
  sidebarMenuTrailingApiRows,
  sidebarNavCategoryApiRows,
  sidebarNavCategoryCountApiRows,
  sidebarNavCategoryLabelApiRows,
  sidebarNavCategoryPanelApiRows,
  sidebarNavCategoryTriggerApiRows,
  sidebarNavDocTreeApiRows,
  sidebarNavPanelApiRows,
  sidebarNavPanelBodyApiRows,
  sidebarNavPanelHeadingApiRows,
  sidebarPanelSwitchApiRows,
  sidebarRootApiRows,
  sidebarTextApiRows,
  sidebarToggleButtonApiRows,
  sidebarUseSidebarContextApiRows,
  sidebarUseSidebarNavToApiRows,
} from "./sidebarApiRows";

export default function SidebarSection() {
  return (
    <PlaygroundDocPage
      title="Sidebar"
      description={
        <>
          Боковая навигация приложения: одна колонка или две (узкая полоса разделов и основная
          панель). Единый размер масштабирует кнопки и текст; на узком окне панель можно свернуть, а
          затем открыть снова с подложкой.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>size</code> на <code>Sidebar.Root</code> (<code>s</code>,{" "}
            <code>m</code>, <code>l</code>, <code>xl</code>): одна и та же простая панель, чтобы
            сравнить высоту контролов, кегль и ширину колонки. Здесь{" "}
            <code>responsive=&#123;false&#125;</code> — иначе при сужении окна каждый экземпляр
            включал бы полноэкранный оверлей и подложку одновременно.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sidebarSizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;simple&quot;</code> — только <code>NavPanel</code>.{" "}
            <code>variant=&quot;double&quot;</code> — рядом <code>ContextBar</code> (переключение
            разделов) и панель с <code>PanelSwitch</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Пункт контекстной колонки с <code>disabled</code> и подсказкой, отключённый{" "}
            <code>MenuButton</code>, футер с <code>Footer variant=&quot;inset&quot;</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <div className="examplePreviewBleed">
                <SidebarStatesSnippet />
              </div>
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Расположение в макете</DemoSectionTitle>
          <DemoDescription>
            <code>sidebarSlot=&quot;page-nav&quot;</code> задаёт отступы и высоту для колонки рядом
            с контентом (как в каркасе страницы).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={layoutOptionsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarLayoutOptionsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Снаружи задаются <code>open</code>, <code>onOpenChange</code>, <code>variant</code>,{" "}
            <code>onVariantChange</code> и при двойном режиме <code>activeSection</code> /{" "}
            <code>onActiveSectionChange</code>; кнопки над превью переключают эти значения.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            <code>IdentityButton</code> в шапке, сворачиваемая <code>NavCategory</code> с{" "}
            <code>NavDocTree</code>, группы <code>Group</code> / <code>Menu</code>, вторичная кнопка{" "}
            <code>MenuAction</code> в строке пункта, <code>PanelSwitch</code> по разделам.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <div className="examplePreviewBleed">
                <SidebarCompositionSnippet />
              </div>
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>На всю ширину слота</DemoSectionTitle>
          <DemoDescription>
            Родитель на всю ширину превью; <code>className</code> и{" "}
            <code>sidebarSlot=&quot;page-nav&quot;</code> помогают вписать сайдбар в гибкий ряд с
            основной колонкой.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Адаптивное поведение</DemoSectionTitle>
          <DemoDescription>
            Порог привязан к ширине окна <code>(max-width: 64rem)</code>. При{" "}
            <code>responsive=&#123;false&#125;</code> автоматическое скрытие и оверлей отключаются;
            при <code>true</code> (по умолчанию) на узком окне панель уезжает, остаётся подложка и
            кнопка открытия.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={responsiveSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarResponsiveSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>asChild</DemoSectionTitle>
          <DemoDescription>
            <code>ContextItemButton asChild</code> с нативной <code>button</code> и{" "}
            <code>MenuButton asChild</code> с внешней ссылкой: стили остаются на дочернем элементе.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={asChildSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarAsChildSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Пути с префиксом раздела</DemoSectionTitle>
          <DemoDescription>
            Хук <code>useSidebarNavTo</code> и <code>MenuRouterLink</code> внутри{" "}
            <code>MemoryRouter</code>: при активном разделе контекстной колонки путь собирается как{" "}
            <code>{"/{section}/…"}</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={navToSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarNavToSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>

          <DemoApiTitle>Sidebar.Root</DemoApiTitle>
          <DemoDescription>Корень: контекст, размеры, открытость, адаптив.</DemoDescription>
          <PlaygroundApiTable rows={sidebarRootApiRows} />

          <DemoApiTitle>Sidebar.ContextBar</DemoApiTitle>
          <DemoDescription>
            Узкая колонка разделов; с <code>items</code> подключаются подсказки и автоселект первого
            раздела.
          </DemoDescription>
          <PlaygroundApiTable rows={sidebarContextBarApiRows} />

          <DemoApiTitle>Sidebar.ContextBarHeader</DemoApiTitle>
          <DemoDescription>Область логотипа над списком контекста.</DemoDescription>
          <PlaygroundApiTable rows={sidebarContextBarHeaderApiRows} />

          <DemoApiTitle>Sidebar.ContextBarBody</DemoApiTitle>
          <DemoDescription>Тело списка при ручной разметке контекста.</DemoDescription>
          <PlaygroundApiTable rows={sidebarContextBarBodyApiRows} />

          <DemoApiTitle>Sidebar.ContextBarFooter</DemoApiTitle>
          <DemoDescription>Низ контекстной колонки.</DemoDescription>
          <PlaygroundApiTable rows={sidebarContextBarFooterApiRows} />

          <DemoApiTitle>Sidebar.ContextItemButton</DemoApiTitle>
          <DemoDescription>
            Кнопка пункта контекстной колонки; поддерживает asChild.
          </DemoDescription>
          <PlaygroundApiTable rows={sidebarContextItemButtonApiRows} />

          <DemoApiTitle>Sidebar.NavPanel</DemoApiTitle>
          <DemoDescription>Основная панель навигации.</DemoDescription>
          <PlaygroundApiTable rows={sidebarNavPanelApiRows} />

          <DemoApiTitle>Sidebar.NavPanelBody</DemoApiTitle>
          <DemoDescription>Прокручиваемое содержимое панели.</DemoDescription>
          <PlaygroundApiTable rows={sidebarNavPanelBodyApiRows} />

          <DemoApiTitle>Sidebar.NavDocTree</DemoApiTitle>
          <DemoDescription>Контейнер для дерева документации или оглавления.</DemoDescription>
          <PlaygroundApiTable rows={sidebarNavDocTreeApiRows} />

          <DemoApiTitle>Sidebar.NavPanelHeading</DemoApiTitle>
          <DemoDescription>Заголовок уровня панели.</DemoDescription>
          <PlaygroundApiTable rows={sidebarNavPanelHeadingApiRows} />

          <DemoApiTitle>Sidebar.NavCategory</DemoApiTitle>
          <DemoDescription>Группа с раскрываемым блоком (состояние снаружи).</DemoDescription>
          <PlaygroundApiTable rows={sidebarNavCategoryApiRows} />

          <DemoApiTitle>Sidebar.NavCategoryTrigger</DemoApiTitle>
          <DemoDescription>Кнопка раскрытия группы.</DemoDescription>
          <PlaygroundApiTable rows={sidebarNavCategoryTriggerApiRows} />

          <DemoApiTitle>Sidebar.NavCategoryLabel</DemoApiTitle>
          <DemoDescription>Подпись группы.</DemoDescription>
          <PlaygroundApiTable rows={sidebarNavCategoryLabelApiRows} />

          <DemoApiTitle>Sidebar.NavCategoryCount</DemoApiTitle>
          <DemoDescription>Счётчик в строке группы.</DemoDescription>
          <PlaygroundApiTable rows={sidebarNavCategoryCountApiRows} />

          <DemoApiTitle>Sidebar.NavCategoryPanel</DemoApiTitle>
          <DemoDescription>Содержимое раскрытой группы.</DemoDescription>
          <PlaygroundApiTable rows={sidebarNavCategoryPanelApiRows} />

          <DemoApiTitle>Sidebar.PanelSwitch</DemoApiTitle>
          <DemoDescription>Переключение контента панели по активному разделу.</DemoDescription>
          <PlaygroundApiTable rows={sidebarPanelSwitchApiRows} />

          <DemoApiTitle>Sidebar.Header</DemoApiTitle>
          <DemoDescription>Верхняя зона панели.</DemoDescription>
          <PlaygroundApiTable rows={sidebarHeaderApiRows} />

          <DemoApiTitle>Sidebar.HeaderRow</DemoApiTitle>
          <DemoDescription>Строка шапки: основной блок и переключатель.</DemoDescription>
          <PlaygroundApiTable rows={sidebarHeaderRowApiRows} />

          <DemoApiTitle>Sidebar.HeaderMain</DemoApiTitle>
          <DemoDescription>Левая часть шапки (логотип, селектор).</DemoDescription>
          <PlaygroundApiTable rows={sidebarHeaderMainApiRows} />

          <DemoApiTitle>Sidebar.Content</DemoApiTitle>
          <DemoDescription>Средняя часть между шапкой и подвалом.</DemoDescription>
          <PlaygroundApiTable rows={sidebarContentApiRows} />

          <DemoApiTitle>Sidebar.Footer</DemoApiTitle>
          <DemoDescription>Подвал панели; вариант inset для внутренних отступов.</DemoDescription>
          <PlaygroundApiTable rows={sidebarFooterApiRows} />

          <DemoApiTitle>Sidebar.IdentityButton</DemoApiTitle>
          <DemoDescription>Карточка рабочей области или пользователя.</DemoDescription>
          <PlaygroundApiTable rows={sidebarIdentityButtonApiRows} />

          <DemoApiTitle>Sidebar.ToggleButton</DemoApiTitle>
          <DemoDescription>Сворачивание и разворачивание панели из контекста.</DemoDescription>
          <PlaygroundApiTable rows={sidebarToggleButtonApiRows} />

          <DemoApiTitle>Sidebar.Group</DemoApiTitle>
          <DemoDescription>Секция меню с подписью.</DemoDescription>
          <PlaygroundApiTable rows={sidebarGroupApiRows} />

          <DemoApiTitle>Sidebar.GroupLabel</DemoApiTitle>
          <DemoDescription>Заголовок секции пунктов.</DemoDescription>
          <PlaygroundApiTable rows={sidebarGroupLabelApiRows} />

          <DemoApiTitle>Sidebar.Menu</DemoApiTitle>
          <DemoDescription>Список пунктов навигации.</DemoDescription>
          <PlaygroundApiTable rows={sidebarMenuApiRows} />

          <DemoApiTitle>Sidebar.MenuItem</DemoApiTitle>
          <DemoDescription>Элемент списка: кнопка ссылки и опционально действие.</DemoDescription>
          <PlaygroundApiTable rows={sidebarMenuItemApiRows} />

          <DemoApiTitle>Sidebar.MenuButton</DemoApiTitle>
          <DemoDescription>Интерактивный пункт; поддерживает asChild.</DemoDescription>
          <PlaygroundApiTable rows={sidebarMenuButtonApiRows} />

          <DemoApiTitle>Sidebar.MenuLink</DemoApiTitle>
          <DemoDescription>Обычная ссылка с тем же видом, что у кнопки меню.</DemoDescription>
          <PlaygroundApiTable rows={sidebarMenuLinkApiRows} />

          <DemoApiTitle>Sidebar.MenuRouterLink</DemoApiTitle>
          <DemoDescription>
            Пункт на базе <code>NavLink</code> (react-router); активность по URL.
          </DemoDescription>
          <PlaygroundApiTable rows={sidebarMenuRouterLinkApiRows} />

          <DemoApiTitle>Sidebar.MenuAction</DemoApiTitle>
          <DemoDescription>Компактная кнопка в строке пункта (меню «ещё»).</DemoDescription>
          <PlaygroundApiTable rows={sidebarMenuActionApiRows} />

          <DemoApiTitle>Sidebar.MenuIcon</DemoApiTitle>
          <DemoDescription>Слот иконки слева в пункте.</DemoDescription>
          <PlaygroundApiTable rows={sidebarMenuIconApiRows} />

          <DemoApiTitle>Sidebar.MenuLabel</DemoApiTitle>
          <DemoDescription>Текст пункта.</DemoDescription>
          <PlaygroundApiTable rows={sidebarMenuLabelApiRows} />

          <DemoApiTitle>Sidebar.MenuTrailing</DemoApiTitle>
          <DemoDescription>Хвост строки (счётчик, бейдж).</DemoDescription>
          <PlaygroundApiTable rows={sidebarMenuTrailingApiRows} />

          <DemoApiTitle>Sidebar.Text</DemoApiTitle>
          <DemoDescription>Вторичный текст внутри панели.</DemoDescription>
          <PlaygroundApiTable rows={sidebarTextApiRows} />

          <DemoApiTitle>useSidebarContext</DemoApiTitle>
          <DemoDescription>Доступ к состоянию сайдбара внутри дерева под Root.</DemoDescription>
          <PlaygroundApiTable rows={sidebarUseSidebarContextApiRows} />

          <DemoApiTitle>useSidebarNavTo</DemoApiTitle>
          <DemoDescription>
            Сборка пути для вложенных маршрутов при <code>variant=&quot;double&quot;</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={sidebarUseSidebarNavToApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
