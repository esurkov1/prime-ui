import { useNavigate } from "react-router-dom";

import { Card } from "@/components/card/Card";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { LinkButton } from "@/components/link-button/LinkButton";
import { Typography } from "@/components/typography/Typography";

import { renderInlineCode } from "../components/PlaygroundApiTable";
import {
  FoundationPage,
  FoundationSection,
  RuleList,
  TokenTable,
} from "../foundation/FoundationKit";
import { COMPOSITION_PATTERNS } from "./patterns";

const SKILL_COMPOSITION = "https://github.com/esurkov1/prime-ui/blob/main/SKILL/composition.md";

type Row = { what: string; value: string; how: string };

const cell = (text: string, tone?: "secondary") => (
  <Typography as="span" variant="body-m" tone={tone}>
    {renderInlineCode(text)}
  </Typography>
);

const COLUMNS: DataTableColumn<Row>[] = [
  { id: "what", header: "Между", minWidth: "14rem", cell: (row) => cell(row.what) },
  { id: "value", header: "px", numeric: true, cell: (row) => cell(row.value) },
  {
    id: "how",
    header: "Как",
    grow: true,
    minWidth: "16rem",
    cell: (row) => cell(row.how, "secondary"),
  },
];

const RHYTHM: Row[] = [
  {
    what: "подпись → поле, поле → подсказка",
    value: "4–8",
    how: "встроено в `label` / `hint` поля",
  },
  { what: "кнопки и фильтры в ряд", value: "8", how: "`--prime-space-2`" },
  { what: "заголовок группы → её поля", value: "16", how: "`--prime-space-4`" },
  { what: "плитка → плитка в сетке", value: "16", how: "`--prime-space-4`" },
  { what: "поле → поле, переключатель → переключатель", value: "20", how: "`--prime-space-5`" },
  { what: "группа → группа в форме", value: "32", how: "`--prime-space-8`" },
  { what: "шапка страницы → содержимое", value: "32", how: "даёт `PageContent`" },
  { what: "блок → блок страницы", value: "40", how: "даёт `PageContent.Body`" },
];

const TYPE: Row[] = [
  {
    what: "заголовок страницы (один, `h1`)",
    value: "24",
    how: "`PageContent.Title` — `heading-m`",
  },
  {
    what: "раздел страницы без карточки",
    value: "16",
    how: '`Typography as="h2" variant="title-m"`',
  },
  { what: "заголовок карточки, группы полей", value: "14", how: "`Card.SectionTitle` / `title-s`" },
  { what: "основной текст, ячейки", value: "14", how: "`body-m`" },
  { what: "пояснение под заголовком", value: "14", how: '`body-m` + `tone="secondary"`' },
  { what: "мета, даты, подписи значений", value: "12", how: '`caption` + `tone="muted"`' },
  { what: "главное число KPI", value: "—", how: "`Card.Value` (сам подстраивает размер)" },
];

/** Composition principles: how a screen is assembled from the kit; patterns linked below. */
export default function CompositionPage() {
  const navigate = useNavigate();
  return (
    <FoundationPage
      title="Композиция"
      description="Как собрать экран из кита так, будто его неделями шлифовал автор: каркас, ритм, иерархия, поверхности, действия, формы, данные и состояния. Ниже — готовые экраны: каждый пример один и тот же файл для плейграунда и для скилла агентов."
    >
      <FoundationSection title="Каркас экрана">
        <RuleList>
          <li>
            {renderInlineCode(
              "Один раз на приложение — `AppShell.Root` + `Sidebar` в `AppShell.Nav`, страница — в `AppShell.Main`. Экран, который вы отдаёте, рендерит только свою страницу.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Страница — `PageContent.Section` (или `PageContent.Root maxWidth` для узкой колонки): `Header` с `Title`, одной строкой `Description` и `Actions`, затем `Body` с блоками.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Внешних отступов не добавляйте: поля даёт `AppShell.Main`, расстояния между блоками — `PageContent.Body`. Ваш CSS раскладывает только внутренность блока через `gap`.",
            )}
          </li>
        </RuleList>
      </FoundationSection>

      <FoundationSection
        title="Ритм: воздух — это иерархия"
        description={renderInlineCode(
          "Внутри группы — теснее, между группами — шире, между разделами — шире всего. Всё на сетке 4 px, только токены `--prime-space-*`, только `gap` на родителе.",
        )}
      >
        <TokenTable columns={COLUMNS} rows={RHYTHM} getRowKey={(row) => row.what} />
      </FoundationSection>

      <FoundationSection
        title="Иерархия текста"
        description={renderInlineCode(
          "Одна роль на смысл. Своих размеров и жирности нет — только роли `Typography` и части компонентов.",
        )}
      >
        <TokenTable
          columns={COLUMNS.map((column) =>
            column.id === "what" ? { ...column, header: "Что" } : column,
          )}
          rows={TYPE}
          getRowKey={(row) => row.what}
        />
      </FoundationSection>

      <FoundationSection title="Поверхности">
        <RuleList>
          <li>
            {renderInlineCode(
              "Глубина — заливкой, не линиями. Внутри приложения панель контента — поверхность, `Card` на ней — утопленная плитка; кит переключает это сам.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "`Card` — для самостоятельного блока (метрика, панель настроек, сведения сбоку). Раздел, который и так один в своей области, — заголовок и содержимое без карточки.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Не вкладывайте карточку в карточку и не кладите в неё `DataTable`: таблица — уже залитый блок. Разделитель (`Divider`) — только внутри блока.",
            )}
          </li>
        </RuleList>
      </FoundationSection>

      <FoundationSection title="Действия">
        <RuleList>
          <li>
            {renderInlineCode(
              'Одно главное действие на область (`solid`, последним в ряду). Остальные — `soft` / `ghost` / `outline` с `tone="neutral"`, редкие — в `Dropdown` за `action.more`.',
            )}
          </li>
          <li>
            {renderInlineCode(
              'Разрушительное — `tone="danger"`: отдельная кнопка `outline`, в меню — последним пунктом, подтверждение — `Modal` с `closeOnOutsideClick={false}`.',
            )}
          </li>
          <li>
            {renderInlineCode(
              "Переход — ссылка (`LinkButton`, `Button asChild` с `<a>`), действие — `Button`. Одно действие — одна подпись по всему экрану.",
            )}
          </li>
        </RuleList>
      </FoundationSection>

      <FoundationSection title="Формы">
        <RuleList>
          <li>
            {renderInlineCode(
              "Подпись над полем всегда (`label`), плейсхолдер — пример значения. Подсказка — `hint`, ошибка — `error` после ухода с поля или отправки.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Поля 20 px друг от друга, группы 32 px; два коротких связанных поля — в ряд с `align-items: start`. Колонка формы не шире ~65 знаков.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "До четырёх полей — `Modal`, длинная форма — `Drawer` или страница. Отправка: `loading` на кнопке, `disabled` на полях, итог — `Notification`.",
            )}
          </li>
        </RuleList>
      </FoundationSection>

      <FoundationSection title="Данные и состояния">
        <RuleList>
          <li>
            {renderInlineCode(
              "Список — `DataTable` с фильтрами в `toolbar` (`SmartFilter`) и встроенной пагинацией; числа — `numeric`, статусы — `Badge` с одним цветом на смысл.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "У каждого блока данных три состояния: загрузка (`loading` / `Spinner`), пусто (`empty` / `EmptyPage`), ошибка (`error` / `Banner`). Раскладка при этом не прыгает.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Сообщение о странице — `Banner`, итог действия — `Notification`, ошибка поля — `error` поля, пустой раздел — `EmptyPage` с одним действием.",
            )}
          </li>
        </RuleList>
      </FoundationSection>

      <FoundationSection title="Узкий экран и движение">
        <RuleList>
          <li>
            {renderInlineCode(
              "Раскладки — внутренние: `auto-fit` / `minmax(min(100%, …))` и flex-wrap вместо брейкпоинтов. Экран работает с 320 px, страница вбок не прокручивается — широкая таблица скроллится внутри себя.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Анимации уже есть в компонентах. Своё движение — только токены `--prime-motion-*`, `transform` / `opacity`, без `transition: all`.",
            )}
          </li>
        </RuleList>
      </FoundationSection>

      <FoundationSection
        title="Экраны"
        description={renderInlineCode(
          "Каждый экран — один файл в `SKILL/patterns/`: превью и код здесь, ссылка из `SKILL/composition.md` для агентов.",
        )}
      >
        <div className="introFeatureGrid">
          {COMPOSITION_PATTERNS.map((pattern) => (
            <Card.Root key={pattern.file} variant="cta">
              <Card.Title>{pattern.title}</Card.Title>
              <Card.Description>{renderInlineCode(pattern.description)}</Card.Description>
              <Card.Actions>
                <LinkButton
                  href={`/${pattern.segment}`}
                  size="s"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(`/${pattern.segment}`);
                  }}
                >
                  Открыть
                </LinkButton>
              </Card.Actions>
            </Card.Root>
          ))}
        </div>
        <Typography variant="body-m" tone="secondary">
          Те же правила для агентов —{" "}
          <LinkButton href={SKILL_COMPOSITION} rel="noopener noreferrer" target="_blank">
            SKILL/composition.md
          </LinkButton>
          .
        </Typography>
      </FoundationSection>
    </FoundationPage>
  );
}
