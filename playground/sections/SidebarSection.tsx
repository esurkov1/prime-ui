import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
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
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре значения <code>size</code> на <code>Sidebar.Root</code> (<code>s</code>,{" "}
            <code>m</code>, <code>l</code>, <code>xl</code>): одна и та же простая панель, чтобы
            сравнить высоту контролов, кегль и ширину колонки.
          </p>
          <PlaygroundExampleFrame.Root code={sidebarSizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            <code>variant=&quot;simple&quot;</code> — только <code>NavPanel</code>.{" "}
            <code>variant=&quot;double&quot;</code> — рядом <code>ContextBar</code> (переключение
            разделов) и панель с <code>PanelSwitch</code>.
          </p>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Пункт контекстной колонки с <code>disabled</code> и подсказкой, отключённый{" "}
            <code>MenuButton</code>, футер с <code>Footer variant=&quot;inset&quot;</code>.
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <div className="examplePreviewBleed">
                <SidebarStatesSnippet />
              </div>
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Расположение в макете</h4>
          <p className="demoBlockDescription">
            <code>panelWidth=&quot;compact&quot;</code> сужает панель;{" "}
            <code>sidebarSlot=&quot;page-nav&quot;</code> задаёт отступы и высоту для колонки рядом
            с контентом (как в каркасе страницы).
          </p>
          <PlaygroundExampleFrame.Root code={layoutOptionsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarLayoutOptionsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Снаружи задаются <code>open</code>, <code>onOpenChange</code>, <code>variant</code>,{" "}
            <code>onVariantChange</code> и при двойном режиме <code>activeSection</code> /{" "}
            <code>onActiveSectionChange</code>; кнопки над превью переключают эти значения.
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            <code>IdentityButton</code> в шапке, сворачиваемая <code>NavCategory</code> с{" "}
            <code>NavDocTree</code>, группы <code>Group</code> / <code>Menu</code>, вторичная кнопка{" "}
            <code>MenuAction</code> в строке пункта, <code>PanelSwitch</code> по разделам.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <div className="examplePreviewBleed">
                <SidebarCompositionSnippet />
              </div>
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>На всю ширину слота</h4>
          <p className="demoBlockDescription">
            Родитель на всю ширину превью; <code>className</code> и{" "}
            <code>sidebarSlot=&quot;page-nav&quot;</code> помогают вписать сайдбар в гибкий ряд с
            основной колонкой.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Адаптивное поведение</h4>
          <p className="demoBlockDescription">
            Порог привязан к ширине окна <code>(max-width: 64rem)</code>. При{" "}
            <code>responsive=&#123;false&#125;</code> автоматическое скрытие и оверлей отключаются;
            при <code>true</code> (по умолчанию) на узком окне панель уезжает, остаётся подложка и
            кнопка открытия.
          </p>
          <PlaygroundExampleFrame.Root code={responsiveSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarResponsiveSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>asChild</h4>
          <p className="demoBlockDescription">
            <code>ContextItemButton asChild</code> с нативной <code>button</code> и{" "}
            <code>MenuButton asChild</code> с внешней ссылкой: стили остаются на дочернем элементе.
          </p>
          <PlaygroundExampleFrame.Root code={asChildSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarAsChildSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Пути с префиксом раздела</h4>
          <p className="demoBlockDescription">
            Хук <code>useSidebarNavTo</code> и <code>MenuRouterLink</code> внутри{" "}
            <code>MemoryRouter</code>: при активном разделе контекстной колонки путь собирается как{" "}
            <code>{"/{section}/…"}</code>.
          </p>
          <PlaygroundExampleFrame.Root code={navToSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarNavToSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>

          <h5>Sidebar.Root</h5>
          <p className="demoBlockDescription">Корень: контекст, размеры, открытость, адаптив.</p>
          <PlaygroundApiTable rows={sidebarRootApiRows} />

          <h5>Sidebar.ContextBar</h5>
          <p className="demoBlockDescription">
            Узкая колонка разделов; с <code>items</code> подключаются подсказки и автоселект первого
            раздела.
          </p>
          <PlaygroundApiTable rows={sidebarContextBarApiRows} />

          <h5>Sidebar.ContextBarHeader</h5>
          <p className="demoBlockDescription">Область логотипа над списком контекста.</p>
          <PlaygroundApiTable rows={sidebarContextBarHeaderApiRows} />

          <h5>Sidebar.ContextBarBody</h5>
          <p className="demoBlockDescription">Тело списка при ручной разметке контекста.</p>
          <PlaygroundApiTable rows={sidebarContextBarBodyApiRows} />

          <h5>Sidebar.ContextBarFooter</h5>
          <p className="demoBlockDescription">Низ контекстной колонки.</p>
          <PlaygroundApiTable rows={sidebarContextBarFooterApiRows} />

          <h5>Sidebar.ContextItemButton</h5>
          <p className="demoBlockDescription">
            Кнопка пункта контекстной колонки; поддерживает asChild.
          </p>
          <PlaygroundApiTable rows={sidebarContextItemButtonApiRows} />

          <h5>Sidebar.NavPanel</h5>
          <p className="demoBlockDescription">Основная панель навигации.</p>
          <PlaygroundApiTable rows={sidebarNavPanelApiRows} />

          <h5>Sidebar.NavPanelBody</h5>
          <p className="demoBlockDescription">Прокручиваемое содержимое панели.</p>
          <PlaygroundApiTable rows={sidebarNavPanelBodyApiRows} />

          <h5>Sidebar.NavDocTree</h5>
          <p className="demoBlockDescription">Контейнер для дерева документации или оглавления.</p>
          <PlaygroundApiTable rows={sidebarNavDocTreeApiRows} />

          <h5>Sidebar.NavPanelHeading</h5>
          <p className="demoBlockDescription">Заголовок уровня панели.</p>
          <PlaygroundApiTable rows={sidebarNavPanelHeadingApiRows} />

          <h5>Sidebar.NavCategory</h5>
          <p className="demoBlockDescription">Группа с раскрываемым блоком (состояние снаружи).</p>
          <PlaygroundApiTable rows={sidebarNavCategoryApiRows} />

          <h5>Sidebar.NavCategoryTrigger</h5>
          <p className="demoBlockDescription">Кнопка раскрытия группы.</p>
          <PlaygroundApiTable rows={sidebarNavCategoryTriggerApiRows} />

          <h5>Sidebar.NavCategoryLabel</h5>
          <p className="demoBlockDescription">Подпись группы.</p>
          <PlaygroundApiTable rows={sidebarNavCategoryLabelApiRows} />

          <h5>Sidebar.NavCategoryCount</h5>
          <p className="demoBlockDescription">Счётчик в строке группы.</p>
          <PlaygroundApiTable rows={sidebarNavCategoryCountApiRows} />

          <h5>Sidebar.NavCategoryPanel</h5>
          <p className="demoBlockDescription">Содержимое раскрытой группы.</p>
          <PlaygroundApiTable rows={sidebarNavCategoryPanelApiRows} />

          <h5>Sidebar.PanelSwitch</h5>
          <p className="demoBlockDescription">Переключение контента панели по активному разделу.</p>
          <PlaygroundApiTable rows={sidebarPanelSwitchApiRows} />

          <h5>Sidebar.Header</h5>
          <p className="demoBlockDescription">Верхняя зона панели.</p>
          <PlaygroundApiTable rows={sidebarHeaderApiRows} />

          <h5>Sidebar.HeaderRow</h5>
          <p className="demoBlockDescription">Строка шапки: основной блок и переключатель.</p>
          <PlaygroundApiTable rows={sidebarHeaderRowApiRows} />

          <h5>Sidebar.HeaderMain</h5>
          <p className="demoBlockDescription">Левая часть шапки (логотип, селектор).</p>
          <PlaygroundApiTable rows={sidebarHeaderMainApiRows} />

          <h5>Sidebar.Content</h5>
          <p className="demoBlockDescription">Средняя часть между шапкой и подвалом.</p>
          <PlaygroundApiTable rows={sidebarContentApiRows} />

          <h5>Sidebar.Footer</h5>
          <p className="demoBlockDescription">
            Подвал панели; вариант inset для внутренних отступов.
          </p>
          <PlaygroundApiTable rows={sidebarFooterApiRows} />

          <h5>Sidebar.IdentityButton</h5>
          <p className="demoBlockDescription">Карточка рабочей области или пользователя.</p>
          <PlaygroundApiTable rows={sidebarIdentityButtonApiRows} />

          <h5>Sidebar.ToggleButton</h5>
          <p className="demoBlockDescription">Сворачивание и разворачивание панели из контекста.</p>
          <PlaygroundApiTable rows={sidebarToggleButtonApiRows} />

          <h5>Sidebar.Group</h5>
          <p className="demoBlockDescription">Секция меню с подписью.</p>
          <PlaygroundApiTable rows={sidebarGroupApiRows} />

          <h5>Sidebar.GroupLabel</h5>
          <p className="demoBlockDescription">Заголовок секции пунктов.</p>
          <PlaygroundApiTable rows={sidebarGroupLabelApiRows} />

          <h5>Sidebar.Menu</h5>
          <p className="demoBlockDescription">Список пунктов навигации.</p>
          <PlaygroundApiTable rows={sidebarMenuApiRows} />

          <h5>Sidebar.MenuItem</h5>
          <p className="demoBlockDescription">
            Элемент списка: кнопка ссылки и опционально действие.
          </p>
          <PlaygroundApiTable rows={sidebarMenuItemApiRows} />

          <h5>Sidebar.MenuButton</h5>
          <p className="demoBlockDescription">Интерактивный пункт; поддерживает asChild.</p>
          <PlaygroundApiTable rows={sidebarMenuButtonApiRows} />

          <h5>Sidebar.MenuLink</h5>
          <p className="demoBlockDescription">Обычная ссылка с тем же видом, что у кнопки меню.</p>
          <PlaygroundApiTable rows={sidebarMenuLinkApiRows} />

          <h5>Sidebar.MenuRouterLink</h5>
          <p className="demoBlockDescription">
            Пункт на базе <code>NavLink</code> (react-router); активность по URL.
          </p>
          <PlaygroundApiTable rows={sidebarMenuRouterLinkApiRows} />

          <h5>Sidebar.MenuAction</h5>
          <p className="demoBlockDescription">Компактная кнопка в строке пункта (меню «ещё»).</p>
          <PlaygroundApiTable rows={sidebarMenuActionApiRows} />

          <h5>Sidebar.MenuIcon</h5>
          <p className="demoBlockDescription">Слот иконки слева в пункте.</p>
          <PlaygroundApiTable rows={sidebarMenuIconApiRows} />

          <h5>Sidebar.MenuLabel</h5>
          <p className="demoBlockDescription">Текст пункта.</p>
          <PlaygroundApiTable rows={sidebarMenuLabelApiRows} />

          <h5>Sidebar.MenuTrailing</h5>
          <p className="demoBlockDescription">Хвост строки (счётчик, бейдж).</p>
          <PlaygroundApiTable rows={sidebarMenuTrailingApiRows} />

          <h5>Sidebar.Text</h5>
          <p className="demoBlockDescription">Вторичный текст внутри панели.</p>
          <PlaygroundApiTable rows={sidebarTextApiRows} />

          <h5>useSidebarContext</h5>
          <p className="demoBlockDescription">
            Доступ к состоянию сайдбара внутри дерева под Root.
          </p>
          <PlaygroundApiTable rows={sidebarUseSidebarContextApiRows} />

          <h5>useSidebarNavTo</h5>
          <p className="demoBlockDescription">
            Сборка пути для вложенных маршрутов при <code>variant=&quot;double&quot;</code>.
          </p>
          <PlaygroundApiTable rows={sidebarUseSidebarNavToApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
