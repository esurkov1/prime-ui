import { useNavigate } from "react-router-dom";

import { Card } from "@/components/card/Card";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { LinkButton } from "@/components/link-button/LinkButton";
import { Typography } from "@/components/typography/Typography";
import { Page } from "@/layout/page/Page";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { DocBlock, DocList, DocPage, DocTable } from "../components/Doc";
import { renderInlineCode } from "../components/PlaygroundApiTable";

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
  { what: "строки одного элемента (имя над мета)", value: "0–4", how: "`--prime-space-1`" },
  { what: "заголовок группы → её поля", value: "16", how: "`--prime-space-4`" },
  { what: "плитка → плитка, по обеим осям", value: "16", how: "даёт `Page.Grid`" },
  { what: "поле → поле, переключатель → переключатель", value: "20", how: "`--prime-space-5`" },
  { what: "основная колонка → боковая", value: "24", how: "`--prime-space-6`" },
  {
    what: "верхняя полоса страницы → первый блок",
    value: "12 + 24 (32 от 1024)",
    how: "нижний воздух полосы + верхний воздух `Page.Root`",
  },
  { what: "заголовок страницы в потоке → содержимое", value: "24", how: "даёт `Page.Root`" },
  { what: "блок → блок страницы", value: "24", how: "даёт `Page.Body`" },
  { what: "группа → группа в форме", value: "32", how: "`--prime-space-8`" },
  { what: "раздел → раздел (новая тема с h2)", value: "40", how: "даёт `Page.Section`" },
];

const TYPE: Row[] = [
  {
    what: "заголовок страницы (один, `h1`)",
    value: "16",
    how: "`Page.Title` — в `Page.TopBar` `title-m` (16), в потоке страницы `heading-m` (24)",
  },
  {
    what: "раздел страницы без карточки",
    value: "16",
    how: '`Typography as="h2" variant="title-m"`',
  },
  { what: "заголовок карточки, группы полей", value: "14", how: "`Card.Title` / `title-s`" },
  { what: "основной текст, ячейки", value: "14", how: "`body-m`" },
  { what: "пояснение под заголовком", value: "14", how: '`body-m` + `tone="secondary"`' },
  { what: "мета, даты, подписи значений", value: "12", how: '`caption` + `tone="muted"`' },
  { what: "главное число KPI", value: "—", how: "`Card.Value` (сам подстраивает размер)" },
];

/** Every component page with a `screen` example: the screen's page, in the sidebar's spirit. */
const SCREENS = Object.values(
  import.meta.glob<{ page: ComponentPageConfig }>("../sections/*Section.tsx", { eager: true }),
)
  .flatMap(({ page }) => {
    const screen = page.examples.find((example) => "slot" in example && example.slot === "screen");
    return screen && page.nav ? [{ page, nav: page.nav, description: screen.description }] : [];
  })
  .sort((a, b) => a.page.title.localeCompare(b.page.title));

/** Composition principles: how a screen is assembled from the kit; the screens linked below. */
export default function CompositionPage() {
  const navigate = useNavigate();
  return (
    <DocPage
      title="Принципы"
      description="Как собрать экран из кита так, будто его неделями шлифовал автор: каркас, ритм, иерархия, поверхности, действия, формы, данные и состояния. Ниже — готовые экраны: каждый живёт на странице своего главного компонента примером «Экран»."
    >
      <DocBlock title="Каркас экрана">
        <DocList>
          <li>
            {renderInlineCode(
              "Приложение — это навигация и страница: один раз на приложение `AppShell.Root` + `Sidebar` в `AppShell.Nav`, страница — `Page.Root` в `AppShell.Main`. Всё, что сверху, принадлежит странице: её `Page.TopBar` несёт только то, что нужно этой странице, — заголовок, её кнопки и инструменты; глобальной шапки и глобального поиска нет.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Рабочий экран (список, доска, чат) называет себя в полосе: `Page.Heading` с `Page.Title` и `Page.Description` со строкой данных («128 в работе · 6 ждут оплаты») и путь `Breadcrumb` перед заголовком у вложенной записи; рядом — `Page.Tools` с инструментами страницы и `Page.Actions` с её кнопками, под ними — `Page.Chips` с активными фильтрами; дальше — `Page.Body`.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Страница-документ (настройки, длинная форма, справка) и обзор ставят `Page.Header` с `Page.Heading` в поток — большой заголовок; полоса с `collapse` повторяет его, когда он уходит под неё. `Page.Title` — всегда `h1`, один на страницу: никогда два заголовка, никогда без `h1`.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Внешних отступов не добавляйте: поля и верхний воздух даёт `Page.Root` (их передаёт `AppShell.Main`), расстояния между блоками — `Page.Body`, между разделами — `Page.Section`, между плитками — `Page.Grid`. Ваш CSS раскладывает только внутренность блока через `gap`.",
            )}
          </li>
        </DocList>
      </DocBlock>

      <DocBlock
        title="Ритм: воздух — это иерархия"
        description={renderInlineCode(
          "Внутри группы — теснее, между группами — шире, между разделами — шире всего. Всё на сетке 4 px, только токены `--prime-space-*`, только `gap` на родителе.",
        )}
      >
        <DocTable columns={COLUMNS} rows={RHYTHM} getRowKey={(row) => row.what} />
      </DocBlock>

      <DocBlock
        title="Иерархия текста"
        description={renderInlineCode(
          "Одна роль на смысл. Своих размеров и жирности нет — только роли `Typography` и части компонентов.",
        )}
      >
        <DocTable
          columns={COLUMNS.map((column) =>
            column.id === "what" ? { ...column, header: "Что" } : column,
          )}
          rows={TYPE}
          getRowKey={(row) => row.what}
        />
      </DocBlock>

      <DocBlock title="Поверхности">
        <DocList>
          <li>
            {renderInlineCode(
              "Глубина — заливкой, не линиями. Внутри приложения панель контента — поверхность, `Card` на ней — утопленная плитка; кит переключает это сам.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "`Card` — для самостоятельного блока (метрика, панель настроек, сведения сбоку). Раздел, который и так один в своей области, — `Page.Section` с заголовком и содержимым без карточки. Все плитки экрана — одна `Page.Grid`, а не сетка на каждый ряд.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Не вкладывайте карточку в карточку и не кладите в неё `DataTable`: таблица — уже залитый блок. Разделитель (`Divider`) — только внутри блока.",
            )}
          </li>
        </DocList>
      </DocBlock>

      <DocBlock title="Действия">
        <DocList>
          <li>
            {renderInlineCode(
              'Одно главное действие на область (`solid`, последним в ряду). Остальные — `soft` / `ghost` / `outline` с `tone="neutral"`, редкие — в `Dropdown` за `action.more` (`soft` в полосе страницы, `ghost` размера `s` в ячейке таблицы).',
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
        </DocList>
      </DocBlock>

      <DocBlock title="Формы">
        <DocList>
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
        </DocList>
      </DocBlock>

      <DocBlock title="Данные и состояния">
        <DocList>
          <li>
            {renderInlineCode(
              "Список — `DataTable` с фильтрами в `toolbar` (`SmartFilter`) и встроенной пагинацией; числа — `numeric`, статусы — `Badge` с одним цветом на смысл.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "У каждого блока данных три состояния: загрузка (`loading` / `Skeleton` в форме данных), пусто (`empty` / `EmptyPage`), ошибка (`error` / `Banner`). Состояния перетекают друг в друга через `Crossfade` — раскладка не прыгает.",
            )}
          </li>
          <li>
            {renderInlineCode(
              "Сообщение о странице — `Banner`, итог действия — `Notification`, ошибка поля — `error` поля, пустой раздел — `EmptyPage` с одним действием.",
            )}
          </li>
        </DocList>
      </DocBlock>

      <DocBlock title="Узкий экран и движение">
        <DocList>
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
        </DocList>
      </DocBlock>

      <DocBlock
        title="Экраны"
        description={renderInlineCode(
          "Каждый экран — пример `screen.tsx` на странице своего главного компонента: превью и код там, указатель для агентов — `SKILL/composition.md`.",
        )}
      >
        <Page.Grid>
          {SCREENS.map(({ page, nav, description }) => (
            <Page.Cell key={page.dir} span={4}>
              <Card.Root variant="cta">
                <Card.Title>{page.title}</Card.Title>
                <Card.Description>{renderInlineCode(description)}</Card.Description>
                <Card.Footer>
                  <LinkButton
                    href={`/${nav.segment}`}
                    size="s"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(`/${nav.segment}`);
                    }}
                  >
                    Открыть
                  </LinkButton>
                </Card.Footer>
              </Card.Root>
            </Page.Cell>
          ))}
        </Page.Grid>
        <Typography variant="body-m" tone="secondary">
          Те же правила для агентов —{" "}
          <LinkButton href={SKILL_COMPOSITION} rel="noopener noreferrer" target="_blank">
            SKILL/composition.md
          </LinkButton>
          .
        </Typography>
      </DocBlock>
    </DocPage>
  );
}
