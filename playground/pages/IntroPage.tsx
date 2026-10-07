import { useNavigate } from "react-router-dom";

import { Card } from "@/components/card/Card";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { LinkButton } from "@/components/link-button/LinkButton";
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
  const navigate = useNavigate();
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
                <Typography.Root as="span" variant="body-m">
                  <Typography.Root as="span" variant="body-m" weight="semibold">
                    Глубина через заливку.
                  </Typography.Root>{" "}
                  Фон приложения серый, карточки белые, поля на карточке чуть темнее. У контролов
                  нет рамок. Линии остаются только там, где нужен разделитель.
                </Typography.Root>
              </li>
              <li>
                <Typography.Root as="span" variant="body-m">
                  <Typography.Root as="span" variant="body-m" weight="semibold">
                    Сетка 4 px.
                  </Typography.Root>{" "}
                  Все отступы, высоты и радиусы кратны четырём. Внутри группы элементы стоят ближе,
                  чем группы между собой.
                </Typography.Root>
              </li>
              <li>
                <Typography.Root as="span" variant="body-m">
                  <Typography.Root as="span" variant="body-m" weight="semibold">
                    Одна ось размеров.
                  </Typography.Root>{" "}
                  <code>xs · s · m · l · xl</code>, по умолчанию <code>m</code> (36 px). Кнопка,
                  поле, селект и вкладки одного размера выравниваются в ряд.
                </Typography.Root>
              </li>
              <li>
                <Typography.Root as="span" variant="body-m">
                  <Typography.Root as="span" variant="body-m" weight="semibold">
                    Только токены.
                  </Typography.Root>{" "}
                  Компоненты берут значения из семантических переменных <code>--prime-*</code>.
                  Светлая и тёмная темы — это два набора значений для одних и тех же ролей.
                </Typography.Root>
              </li>
            </ul>
          </div>

          <div className="introPageSection">
            <DemoSectionTitle>Основа</DemoSectionTitle>
            <div className="introFeatureGrid">
              {FOUNDATION_LINKS.map((item) => (
                <Card.Root key={item.to} variant="cta">
                  <Card.Title>{item.title}</Card.Title>
                  <Card.CtaBody>{item.text}</Card.CtaBody>
                  <Card.Actions>
                    <LinkButton
                      href={item.to}
                      size="s"
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(item.to);
                      }}
                    >
                      Открыть
                    </LinkButton>
                  </Card.Actions>
                </Card.Root>
              ))}
            </div>
          </div>

          <div className="introPageSection">
            <DemoSectionTitle>Как пользоваться</DemoSectionTitle>
            <ul className="introPageList">
              <li>
                <Typography.Root as="span" variant="body-m">
                  Слева разделы по категориям: от основы до оверлеев. У каждого компонента своя
                  страница с превью, кодом примера и таблицей API.
                </Typography.Root>
              </li>
              <li>
                <Typography.Root as="span" variant="body-m">
                  Внизу сайдбара можно переключить{" "}
                  <Typography.Root as="span" variant="body-m" weight="semibold">
                    тему
                  </Typography.Root>{" "}
                  и{" "}
                  <Typography.Root as="span" variant="body-m" weight="semibold">
                    фон превью
                  </Typography.Root>{" "}
                  (canvas, surface, raised, accent). Так видно, как компонент выглядит на фоне
                  страницы, в карточке и внутри меню.
                </Typography.Root>
              </li>
              <li>
                <Typography.Root as="span" variant="body-m">
                  Полный контракт системы описан в{" "}
                  <LinkButton href={FOUNDATION_DOC} rel="noopener noreferrer" target="_blank">
                    docs/foundation.md
                  </LinkButton>
                  . Здесь он показан вживую.
                </Typography.Root>
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
                <Typography.Root as="span" variant="body-m">
                  <LinkButton href={README} rel="noopener noreferrer" target="_blank">
                    README
                  </LinkButton>
                  : установка, экспорты пакета, провайдеры.
                </Typography.Root>
              </li>
              <li>
                <Typography.Root as="span" variant="body-m">
                  <LinkButton href={SKILL} rel="noopener noreferrer" target="_blank">
                    SKILL/SKILL.md
                  </LinkButton>
                  : правила для AI-агентов, которые собирают интерфейсы на ките.
                </Typography.Root>
              </li>
              <li>
                <Typography.Root as="span" variant="body-m">
                  Пакет на{" "}
                  <LinkButton href={NPM} rel="noopener noreferrer" target="_blank">
                    npm
                  </LinkButton>
                  , ошибки и предложения — в{" "}
                  <LinkButton href={ISSUES} rel="noopener noreferrer" target="_blank">
                    Issues
                  </LinkButton>
                  .
                </Typography.Root>
              </li>
            </ul>
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
