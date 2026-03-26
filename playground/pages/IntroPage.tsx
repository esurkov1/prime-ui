import { Link } from "react-router-dom";

import { Typography } from "@/components/typography/Typography";

import { DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";

const REPO = "https://github.com/esurkov1/prime-ui";
const README = `${REPO}/blob/main/README.md`;
const SKILL = `${REPO}/blob/main/SKILL/SKILL.md`;
const SKILL_TOKENS = `${REPO}/blob/main/SKILL/design-tokens.md`;
const SKILL_CATALOG = `${REPO}/blob/main/SKILL/component-catalog.md`;
const TYPOGRAPHY_DOC = `${REPO}/blob/main/src/components/typography/COMPONENT.md`;
const NPM = "https://www.npmjs.com/package/prime-ui-kit";
const ISSUES = `${REPO}/issues`;

export default function IntroPage() {
  return (
    <PlaygroundDocPage
      headingId="playground-intro"
      title="prime-ui-kit playground"
      description={
        <>
          Интерактивная документация библиотеки: живые примеры, код, тёмная и светлая темы и пресеты
          акцента. Колонка контента использует всю доступную ширину — удобно смотреть таблицы и
          формы.
        </>
      }
    >
      <div className="introPage">
        <Typography.Root as="p" className="introPageLead" variant="body-large">
          <strong>prime-ui-kit</strong> — React 19, CSS Modules и семантические токены{" "}
          <code>--prime-sys-*</code>, композиция через подкомпоненты (<code>Modal.Root</code>,{" "}
          <code>Input.Field</code> и т.д.), ориентация на доступность (react-aria там, где уместно).
          Здесь собраны те же сценарии, что в{" "}
          <a className="introPageLink" href={README} rel="noreferrer" target="_blank">
            README
          </a>{" "}
          и в{" "}
          <a className="introPageLink" href={TYPOGRAPHY_DOC} rel="noreferrer" target="_blank">
            COMPONENT.md
          </a>{" "}
          по каждому компоненту.
        </Typography.Root>

        <div className="introPageSection">
          <DemoSectionTitle>Что умеет кит</DemoSectionTitle>
          <div className="introFeatureGrid">
            <div className="introFeatureCard">
              <Typography.Root
                as="p"
                className="introFeatureCardTitle"
                variant="body-large"
                weight="semibold"
              >
                Токены и темы
              </Typography.Root>
              <Typography.Root
                as="p"
                className="introFeatureCardText"
                tone="muted"
                variant="body-default"
              >
                Светлая и тёмная тема через <code>data-theme</code>; цвета и отступы из переменных,
                без «магических» литералов в разметке плейграунда.
              </Typography.Root>
            </div>
            <div className="introFeatureCard">
              <Typography.Root
                as="p"
                className="introFeatureCardTitle"
                variant="body-large"
                weight="semibold"
              >
                Композиция API
              </Typography.Root>
              <Typography.Root
                as="p"
                className="introFeatureCardText"
                tone="muted"
                variant="body-default"
              >
                Составные части вместо монолитных пропсов: проще читать и сужать бандл через{" "}
                <code>prime-ui-kit/components</code>.
              </Typography.Root>
            </div>
            <div className="introFeatureCard">
              <Typography.Root
                as="p"
                className="introFeatureCardTitle"
                variant="body-large"
                weight="semibold"
              >
                Формы
              </Typography.Root>
              <Typography.Root
                as="p"
                className="introFeatureCardText"
                tone="muted"
                variant="body-default"
              >
                Поля, выбор, переключатели, загрузка файлов, цвет, OTP, слайдеры — с единой шкалой{" "}
                <code>size</code> и <code>ControlSizeProvider</code>.
              </Typography.Root>
            </div>
            <div className="introFeatureCard">
              <Typography.Root
                as="p"
                className="introFeatureCardTitle"
                variant="body-large"
                weight="semibold"
              >
                Оверлеи
              </Typography.Root>
              <Typography.Root
                as="p"
                className="introFeatureCardText"
                tone="muted"
                variant="body-default"
              >
                Модалки, drawer, popover, меню, тултипы, командная палитра — порталы, фокус и скролл
                согласованы с китом.
              </Typography.Root>
            </div>
            <div className="introFeatureCard">
              <Typography.Root
                as="p"
                className="introFeatureCardTitle"
                variant="body-large"
                weight="semibold"
              >
                Навигация и layout
              </Typography.Root>
              <Typography.Root
                as="p"
                className="introFeatureCardText"
                tone="muted"
                variant="body-default"
              >
                Sidebar, хлебные крошки, вкладки, аккордеон, степпер, пагинация, оболочки страницы.
              </Typography.Root>
            </div>
            <div className="introFeatureCard">
              <Typography.Root
                as="p"
                className="introFeatureCardTitle"
                variant="body-large"
                weight="semibold"
              >
                Данные и контент
              </Typography.Root>
              <Typography.Root
                as="p"
                className="introFeatureCardText"
                tone="muted"
                variant="body-default"
              >
                Таблица с сортировкой и прокруткой, баннеры, теги, аватары, прогресс, типографика с
                ролями <code>variant</code> (
                <Link className="introPageRouterLink" to="/typography">
                  страница Typography
                </Link>
                ).
              </Typography.Root>
            </div>
            <div className="introFeatureCard">
              <Typography.Root
                as="p"
                className="introFeatureCardTitle"
                variant="body-large"
                weight="semibold"
              >
                Уведомления
              </Typography.Root>
              <Typography.Root
                as="p"
                className="introFeatureCardText"
                tone="muted"
                variant="body-default"
              >
                Очередь тостов: <code>NotificationProvider</code> и <code>useNotifications()</code>{" "}
                — см. README раздел Providers.
              </Typography.Root>
            </div>
            <div className="introFeatureCard">
              <Typography.Root
                as="p"
                className="introFeatureCardTitle"
                variant="body-large"
                weight="semibold"
              >
                TypeScript и поставка
              </Typography.Root>
              <Typography.Root
                as="p"
                className="introFeatureCardText"
                tone="muted"
                variant="body-default"
              >
                ESM, <code>.d.ts</code> в пакете, экспорты <code>styles.css</code>,{" "}
                <code>bundle.css</code>, отдельные темы — таблица в README «Package exports».
              </Typography.Root>
            </div>
          </div>
        </div>

        <div className="introPageSection">
          <DemoSectionTitle>Как устроен плейграунд</DemoSectionTitle>
          <ul className="introPageList">
            <li>
              <Typography.Root as="span" variant="body-default">
                Слева — дерево разделов по категориям (Foundations → Overlays); внизу панели:{" "}
                <strong>светлая/тёмная тема</strong> и <strong>десять пресетов акцента</strong> (
                <code>data-theme</code>, <code>data-theme-preset</code> на{" "}
                <code>document.documentElement</code>).
              </Typography.Root>
            </li>
            <li>
              <Typography.Root as="span" variant="body-default">
                У каждого компонента — отдельный маршрут: превью, вкладка с исходником примера,
                таблица API там, где она свёрстана в секции.
              </Typography.Root>
            </li>
            <li>
              <Typography.Root as="span" variant="body-default">
                Быстрые переходы:{" "}
                <Link className="introPageRouterLink" to="/color">
                  Color
                </Link>
                ,{" "}
                <Link className="introPageRouterLink" to="/typography">
                  Typography
                </Link>
                ,{" "}
                <Link className="introPageRouterLink" to="/button">
                  Button
                </Link>
                ,{" "}
                <Link className="introPageRouterLink" to="/data-table">
                  DataTable
                </Link>
                .
              </Typography.Root>
            </li>
          </ul>
        </div>

        <div className="introPageSection">
          <DemoSectionTitle>Документация и Cursor Skill</DemoSectionTitle>
          <ul className="introPageList">
            <li>
              <Typography.Root as="span" variant="body-default">
                <a className="introPageLink" href={README} rel="noreferrer" target="_blank">
                  README
                </a>{" "}
                в репозитории — установка, импорт стилей, провайдеры, каталог компонентов со
                ссылками на <code>COMPONENT.md</code>.
              </Typography.Root>
            </li>
            <li>
              <Typography.Root as="span" variant="body-default">
                <a className="introPageLink" href={SKILL} rel="noreferrer" target="_blank">
                  SKILL/SKILL.md
                </a>{" "}
                — правила для агентов: только публичный API кита, семантические токены,
                mobile-first, рецепты layout. Каталог в{" "}
                <a className="introPageLink" href={SKILL_CATALOG} rel="noreferrer" target="_blank">
                  component-catalog.md
                </a>
                , шпаргалка по токенам —{" "}
                <a className="introPageLink" href={SKILL_TOKENS} rel="noreferrer" target="_blank">
                  design-tokens.md
                </a>
                . Папку <code>SKILL/</code> копируют в настройки Cursor; в npm-архив она не входит.
              </Typography.Root>
            </li>
            <li>
              <Typography.Root as="span" variant="body-default">
                Сравнение шкалы типографики с MD3 / Apple / Polaris —{" "}
                <a className="introPageLink" href={TYPOGRAPHY_DOC} rel="noreferrer" target="_blank">
                  Typography COMPONENT.md
                </a>
                .
              </Typography.Root>
            </li>
            <li>
              <Typography.Root as="span" variant="body-default">
                Пакет на{" "}
                <a className="introPageLink" href={NPM} rel="noreferrer" target="_blank">
                  npm
                </a>
                ; баги и обсуждения —{" "}
                <a className="introPageLink" href={ISSUES} rel="noreferrer" target="_blank">
                  Issues
                </a>
                .
              </Typography.Root>
            </li>
          </ul>
        </div>

        <div className="introPageSection">
          <DemoSectionTitle>Минимальный пример в приложении</DemoSectionTitle>
          <Typography.Root as="p" tone="muted" variant="body-default">
            Как в README: глобальные стили и бандл CSS, затем компоненты из{" "}
            <code>prime-ui-kit</code>.
          </Typography.Root>
          <pre className="introPageCode">{`import { Button, Input } from "prime-ui-kit";
// В корне приложения (или layout):
// import "prime-ui-kit/styles.css";
// import "prime-ui-kit/bundle.css";

export function Example() {
  return (
    <>
      <Input.Root size="m" label="Email" id="email">
        <Input.Wrapper>
          <Input.Field type="email" placeholder="you@example.com" />
        </Input.Wrapper>
      </Input.Root>

      <Button variant="primary" mode="filled" size="l">
        Submit
      </Button>
    </>
  );
}`}</pre>
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
