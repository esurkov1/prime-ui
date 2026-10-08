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

const INSTALL_CODE = `// Один раз в корне приложения
import "prime-ui-kit/bundle.css";  // токены, обе темы и стили компонентов
import "prime-ui-kit/fonts.css";   // по желанию: Golos Text и JetBrains Mono из Google Fonts
import "prime-ui-kit/reset.css";   // по желанию: минимальный сброс документа

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
                <Typography as="span" variant="body-m">
                  <Typography as="span" variant="body-m" weight="semibold">
                    Глубина через заливку.
                  </Typography>{" "}
                  Фон приложения серый, карточки белые, поля на карточке чуть темнее. У контролов
                  нет рамок. Линии остаются только там, где нужен разделитель.
                </Typography>
              </li>
              <li>
                <Typography as="span" variant="body-m">
                  <Typography as="span" variant="body-m" weight="semibold">
                    Сетка 4 px.
                  </Typography>{" "}
                  Все отступы, высоты и радиусы кратны четырём. Внутри группы элементы стоят ближе,
                  чем группы между собой.
                </Typography>
              </li>
              <li>
                <Typography as="span" variant="body-m">
                  <Typography as="span" variant="body-m" weight="semibold">
                    Одна ось размеров.
                  </Typography>{" "}
                  <code>xs · s · m · l · xl</code>, по умолчанию <code>m</code> (36 px). Кнопка,
                  поле, селект и вкладки одного размера выравниваются в ряд.
                </Typography>
              </li>
              <li>
                <Typography as="span" variant="body-m">
                  <Typography as="span" variant="body-m" weight="semibold">
                    Только токены.
                  </Typography>{" "}
                  Компоненты берут значения из семантических переменных <code>--prime-*</code>.
                  Светлая и тёмная темы — это два набора значений для одних и тех же ролей.
                </Typography>
              </li>
            </ul>
          </div>

          <div className="introPageSection">
            <DemoSectionTitle>Как пользоваться</DemoSectionTitle>
            <ul className="introPageList">
              <li>
                <Typography as="span" variant="body-m">
                  Слева разделы по категориям: от основы до оверлеев. У каждого компонента своя
                  страница с превью, кодом примера и таблицей API.
                </Typography>
              </li>
              <li>
                <Typography as="span" variant="body-m">
                  Внизу сайдбара можно переключить{" "}
                  <Typography as="span" variant="body-m" weight="semibold">
                    тему
                  </Typography>{" "}
                  и{" "}
                  <Typography as="span" variant="body-m" weight="semibold">
                    фон превью
                  </Typography>{" "}
                  (на странице или в карточке). Так видно, как компонент выглядит на каждом слое.
                </Typography>
              </li>
              <li>
                <Typography as="span" variant="body-m">
                  Полный контракт системы описан в{" "}
                  <LinkButton href={FOUNDATION_DOC} rel="noopener noreferrer" target="_blank">
                    docs/foundation.md
                  </LinkButton>
                  . Здесь он показан вживую.
                </Typography>
              </li>
            </ul>
          </div>

          <div className="introPageSection">
            <DemoSectionTitle>Подключение</DemoSectionTitle>
            <CodeBlock code={INSTALL_CODE} />
          </div>

          <div className="introPageSection">
            <DemoSectionTitle>Ссылки</DemoSectionTitle>
            <ul className="introPageList">
              <li>
                <Typography as="span" variant="body-m">
                  <LinkButton href={README} rel="noopener noreferrer" target="_blank">
                    README
                  </LinkButton>
                  : установка, экспорты пакета, провайдеры.
                </Typography>
              </li>
              <li>
                <Typography as="span" variant="body-m">
                  <LinkButton href={SKILL} rel="noopener noreferrer" target="_blank">
                    SKILL/SKILL.md
                  </LinkButton>
                  : правила для AI-агентов, которые собирают интерфейсы на ките.
                </Typography>
              </li>
              <li>
                <Typography as="span" variant="body-m">
                  Пакет на{" "}
                  <LinkButton href={NPM} rel="noopener noreferrer" target="_blank">
                    npm
                  </LinkButton>
                  , ошибки и предложения — в{" "}
                  <LinkButton href={ISSUES} rel="noopener noreferrer" target="_blank">
                    Issues
                  </LinkButton>
                  .
                </Typography>
              </li>
            </ul>
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
