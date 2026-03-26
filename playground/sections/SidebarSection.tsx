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
import SidebarResponsiveSnippet from "../snippets/sidebar/responsive";
import responsiveSource from "../snippets/sidebar/responsive.tsx?raw";
import SidebarSizesSnippet from "../snippets/sidebar/sizes";
import sidebarSizesSource from "../snippets/sidebar/sizes.tsx?raw";
import SidebarStatesSnippet from "../snippets/sidebar/states";
import statesSource from "../snippets/sidebar/states.tsx?raw";
import {
  sidebarContentApiRows,
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
  sidebarRootApiRows,
  sidebarTextApiRows,
  sidebarToggleButtonApiRows,
  sidebarUseSidebarContextApiRows,
} from "./sidebarApiRows";

export default function SidebarSection() {
  return (
    <PlaygroundDocPage
      title="Sidebar"
      description={
        <>
          Боковая навигация: одна колонка <code>NavPanel</code>, масштаб <code>size</code>, на узком
          окне — оверлей и кнопка открытия.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>size</code> на <code>Sidebar.Root</code> (<code>s</code>,{" "}
            <code>m</code>, <code>l</code>, <code>xl</code>). Здесь{" "}
            <code>responsive=&#123;false&#125;</code> — иначе при сужении каждый экземпляр включал
            бы оверлей одновременно.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={sidebarSizesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <SidebarSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Активный и отключённый <code>MenuButton</code>, футер с{" "}
            <code>Footer variant=&quot;inset&quot;</code>.
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
            <code>sidebarSlot=&quot;page-nav&quot;</code> — колонка рядом с контентом (как в каркасе
            страницы).
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
            Снаружи задаются <code>open</code> и <code>onOpenChange</code>; кнопка над превью
            переключает открытость.
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
            <code>IdentityButton</code> в шапке, <code>NavCategory</code> с <code>NavDocTree</code>,
            группы <code>Group</code> / <code>Menu</code>, <code>MenuAction</code> в строке пункта.
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
            Родитель на всю ширину превью; <code>sidebarSlot=&quot;page-nav&quot;</code> вписывает
            сайдбар в гибкий ряд с основной колонкой.
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
            Порог <code>(max-width: 64rem)</code>. При <code>responsive=&#123;false&#125;</code>{" "}
            оверлей отключается; при <code>true</code> (по умолчанию) на узком окне панель уезжает,
            остаётся подложка и кнопка открытия.
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
            <code>MenuButton asChild</code> с внешней ссылкой: стили остаются на дочернем элементе.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={asChildSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <SidebarAsChildSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>

          <DemoApiTitle>Sidebar.Root</DemoApiTitle>
          <DemoDescription>Корень: контекст, размеры, открытость, адаптив.</DemoDescription>
          <PlaygroundApiTable rows={sidebarRootApiRows} />

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
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
