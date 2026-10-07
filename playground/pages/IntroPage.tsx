import { Link } from "react-router-dom";

import { CodeBlock } from "@/components/code-block/CodeBlock";
import { PageContent } from "@/components/page-content/PageContent";
import { Typography } from "@/components/typography/Typography";

import { DemoSectionTitle } from "../components/PlaygroundDemoTypography";

const REPO = "https://github.com/esurkov1/prime-ui";
const README = `${REPO}/blob/main/README.md`;
const FOUNDATION_DOC = `${REPO}/blob/main/docs/foundation.md`;
const SKILL = `${REPO}/blob/main/SKILL/SKILL.md`;
const NPM = "https://www.npmjs.com/package/prime-ui-kit";
const ISSUES = `${REPO}/issues`;

const FOUNDATION_LINKS: { to: string; title: string; text: string }[] = [
  {
    to: "/color",
    title: "Цвет",
    text: "Роли вместо оттенков, светлая и тёмная темы, живая проверка контраста.",
  },
  {
    to: "/typography",
    title: "Типографика",
    text: "Golos Text, 14 текстовых ролей, ширина строки и табличные цифры.",
  },
  {
    to: "/spacing",
    title: "Отступы",
    text: "Шкала с шагом 4 px и правила близости: подпись, поле, группа, секция.",
  },
  {
    to: "/size-tiers",
    title: "Размеры",
    text: "Пять уровней xs–xl. Контролы одного уровня стоят в ряд без подгонки.",
  },
  {
    to: "/radius",
    title: "Радиусы",
    text: "8 у контролов, 12 у карточек, 16 у модалок. Вложенный радиус — внешний минус отступ.",
  },
  {
    to: "/elevation",
    title: "Слои и тени",
    text: "Фон, карточка, плавающий слой, модалка и порядок z-index.",
  },
  {
    to: "/motion",
    title: "Движение",
    text: "Три длительности, три кривые и поведение при reduced motion.",
  },
  {
    to: "/focus",
    title: "Фокус",
    text: "Одно кольцо для всего кита: толщина, отступ, контраст.",
  },
];

const INSTALL_CODE = `// Один раз в корне приложения
import "prime-ui-kit/styles.css";  // шрифты, токены, светлая и тёмная темы
import "prime-ui-kit/bundle.css";  // стили компонентов

import { Button, Input } from "prime-ui-kit";

export function Example() {
  return (
    <form>
      <Input.Root label="Email" id="email">
        <Input.Wrapper>
          <Input.Field type="email" placeholder="you@example.com" />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root>Отправить</Button.Root>
    </form>
  );
}

// Тёмная тема: <html data-theme="dark">`;

export default function IntroPage() {
  return (
    <PageContent.Section aria-labelledby="playground-intro">
      <PageContent.Header>
        <PageContent.Title id="playground-intro">Prime UI</PageContent.Title>
        <PageContent.Description measure="readable">
          Библиотека React-компонентов для рабочих интерфейсов: формы, таблицы, панели, оверлеи. Это
          живая документация. В ней есть примеры, код и API каждого компонента.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="introPage">
          <div className="introPageSection">
            <DemoSectionTitle>Как устроена система</DemoSectionTitle>
            <ul className="introPageList">
              <li>
                <strong>Глубина через заливку.</strong> Фон приложения серый, карточки белые, поля
                на карточке чуть темнее. У контролов нет рамок. Линии остаются только там, где нужен
                разделитель.
              </li>
              <li>
                <strong>Сетка 4 px.</strong> Все отступы, высоты и радиусы кратны четырём. Внутри
                группы элементы стоят ближе, чем группы между собой.
              </li>
              <li>
                <strong>Одна ось размеров.</strong> <code>xs · s · m · l · xl</code>, по умолчанию{" "}
                <code>m</code> (36 px). Кнопка, поле, селект и вкладки одного размера выравниваются
                в ряд.
              </li>
              <li>
                <strong>Только токены.</strong> Компоненты берут значения из семантических
                переменных <code>--prime-*</code>. Светлая и тёмная темы — это два набора значений
                для одних и тех же ролей.
              </li>
            </ul>
          </div>

          <div className="introPageSection">
            <DemoSectionTitle>Основа</DemoSectionTitle>
            <div className="introFeatureGrid">
              {FOUNDATION_LINKS.map((item) => (
                <Link key={item.to} to={item.to} className="introFeatureCard">
                  <Typography.Root as="span" variant="title-s">
                    {item.title}
                  </Typography.Root>
                  <Typography.Root as="span" variant="body-s" tone="secondary">
                    {item.text}
                  </Typography.Root>
                </Link>
              ))}
            </div>
          </div>

          <div className="introPageSection">
            <DemoSectionTitle>Как пользоваться</DemoSectionTitle>
            <ul className="introPageList">
              <li>
                Слева разделы по категориям: от основы до оверлеев. У каждого компонента своя
                страница с превью, кодом примера и таблицей API.
              </li>
              <li>
                Внизу сайдбара можно переключить <strong>тему</strong> и <strong>фон превью</strong>{" "}
                (canvas, surface, raised, accent). Так видно, как компонент выглядит на фоне
                страницы, в карточке и внутри меню.
              </li>
              <li>
                Полный контракт системы описан в{" "}
                <a className="introPageLink" href={FOUNDATION_DOC} rel="noreferrer" target="_blank">
                  docs/foundation.md
                </a>
                . Здесь он показан вживую.
              </li>
            </ul>
          </div>

          <div className="introPageSection">
            <DemoSectionTitle>Подключение</DemoSectionTitle>
            <CodeBlock.Root code={INSTALL_CODE} />
          </div>

          <div className="introPageSection">
            <DemoSectionTitle>Ссылки</DemoSectionTitle>
            <ul className="introPageList">
              <li>
                <a className="introPageLink" href={README} rel="noreferrer" target="_blank">
                  README
                </a>
                : установка, экспорты пакета, провайдеры.
              </li>
              <li>
                <a className="introPageLink" href={SKILL} rel="noreferrer" target="_blank">
                  SKILL/SKILL.md
                </a>
                : правила для AI-агентов, которые собирают интерфейсы на ките.
              </li>
              <li>
                Пакет на{" "}
                <a className="introPageLink" href={NPM} rel="noreferrer" target="_blank">
                  npm
                </a>
                , ошибки и предложения — в{" "}
                <a className="introPageLink" href={ISSUES} rel="noreferrer" target="_blank">
                  Issues
                </a>
                .
              </li>
            </ul>
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
