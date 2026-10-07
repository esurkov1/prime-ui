import { PageContent } from "@/components/page-content/PageContent";
import SidebarModesExample from "@/layout/sidebar/examples/modes";
import modesSource from "@/layout/sidebar/examples/modes.tsx?raw";
import SidebarResponsiveExample from "@/layout/sidebar/examples/responsive";
import responsiveSource from "@/layout/sidebar/examples/responsive.tsx?raw";
import SidebarRouterExample from "@/layout/sidebar/examples/router";
import routerSource from "@/layout/sidebar/examples/router.tsx?raw";
import SidebarSizesExample from "@/layout/sidebar/examples/sizes";
import sizesSource from "@/layout/sidebar/examples/sizes.tsx?raw";
import SidebarStatesExample from "@/layout/sidebar/examples/states";
import statesSource from "@/layout/sidebar/examples/states.tsx?raw";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import {
  sidebarGroupApiRows,
  sidebarItemApiRows,
  sidebarRegionApiRows,
  sidebarRootApiRows,
  sidebarToggleApiRows,
  sidebarUseSidebarApiRows,
} from "./sidebarApiRows";

export default function SidebarSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Sidebar</PageContent.Title>
        <PageContent.Description measure="full">
          Боковая навигация приложения: рельс на холсте, текущий пункт поднят на поверхность. Три
          режима — развёрнут, компактный, скрыт — с одинаково плавными переходами; на экранах уже
          768 px — выезжающая панель.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Режимы</DemoSectionTitle>
            <DemoDescription>
              <code>mode</code> / <code>onModeChange</code>: <code>expanded</code> — 248 px,{" "}
              <code>compact</code> — 56 px, иконки по центру и подсказки справа, <code>hidden</code>{" "}
              — 0. Анимируется только ширина рельса (<code>--prime-motion-duration-base</code>):
              иконки не сдвигаются, подписи гаснут, контент рядом сжимается синхронно.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={modesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SidebarModesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Пункты</DemoSectionTitle>
            <DemoDescription>
              Текущий пункт (<code>active</code>) — поверхность с мягкой тенью; наведение —{" "}
              <code>fill-subtle</code>. <code>badge</code> — счётчик (в компактном режиме точка),{" "}
              <code>shortcut</code> — подсказка клавиш, <code>disabled</code> — приглушённый текст.
              Группы с <code>label</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SidebarStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> — <code>xs</code>–<code>xl</code>: высота пункта 28 · 32 · 36 · 40 ·
              48, текст и иконка того же яруса. Ширина рельса от размера не зависит. По умолчанию —{" "}
              <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SidebarSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Роутер</DemoSectionTitle>
            <DemoDescription>
              <code>asChild</code> рендерит <code>NavLink</code> как пункт: роутер ставит{" "}
              <code>aria-current="page"</code>, и пункт становится текущим. Для обычных ссылок —{" "}
              <code>href</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={routerSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SidebarRouterExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Узкий экран</DemoSectionTitle>
            <DemoDescription>
              С <code>responsive</code> (по умолчанию) ниже 768 px рельс уходит из раскладки и
              открывается поверх затемнения: ловушка фокуса, Escape, закрытие после перехода.
              Управление — <code>open</code> / <code>onOpenChange</code> с кнопки меню в шапке.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={responsiveSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SidebarResponsiveExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Sidebar.Root</DemoApiTitle>
            <PlaygroundApiTable rows={sidebarRootApiRows} />
            <DemoApiTitle>Sidebar.Header · Sidebar.Content · Sidebar.Footer</DemoApiTitle>
            <PlaygroundApiTable rows={sidebarRegionApiRows} />
            <DemoApiTitle>Sidebar.Group</DemoApiTitle>
            <PlaygroundApiTable rows={sidebarGroupApiRows} />
            <DemoApiTitle>Sidebar.Item</DemoApiTitle>
            <PlaygroundApiTable rows={sidebarItemApiRows} />
            <DemoApiTitle>Sidebar.Toggle</DemoApiTitle>
            <DemoDescription>
              Пункт-переключатель: expanded ↔ compact (из hidden — expanded), в выезжающей панели —
              закрыть. Подпись, иконка и <code>aria-expanded</code> берутся из состояния и{" "}
              <code>labels</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={sidebarToggleApiRows} />
            <DemoApiTitle>useSidebar()</DemoApiTitle>
            <DemoDescription>Состояние сайдбара для частей внутри Root.</DemoDescription>
            <PlaygroundApiTable rows={sidebarUseSidebarApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
