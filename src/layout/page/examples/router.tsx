/** A section with sub-pages: the title is the section, each sub-page is a route of its own with its own actions, the switch in the heading row before the buttons is their links and the body cross-fades between them; render it inside a router — `Page.Tools`, `asChild`. */
import {
  Button,
  Crossfade,
  DataTable,
  type DataTableColumn,
  Icon,
  Kpi,
  Page,
  SegmentedControl,
} from "prime-ui-kit";
import { Link, Route, Routes, useLocation } from "react-router-dom";

type Channel = { id: string; name: string; dialogs: number; reply: string };
type Template = { id: string; name: string; uses: number };

// The action of each sub-page: the object on the button, the whole action in its name (the tooltip
// once the button folds to its icon); none on the statistics.
const SUB_PAGES = [
  {
    to: "/messengers/channels",
    label: "Каналы",
    action: { text: "Канал", name: "Подключить канал" },
  },
  {
    to: "/messengers/templates",
    label: "Шаблоны",
    action: { text: "Шаблон", name: "Новый шаблон" },
  },
  { to: "/messengers/stats", label: "Статистика", action: null },
];

const CHANNELS: Channel[] = [
  { id: "tg", name: "Telegram · @prime_support", dialogs: 642, reply: "4 мин" },
  { id: "wa", name: "WhatsApp · +7 495 120-44-10", dialogs: 391, reply: "7 мин" },
  { id: "vk", name: "ВКонтакте · Прайм CRM", dialogs: 188, reply: "12 мин" },
  { id: "avito", name: "Авито · Склад на Южной", dialogs: 59, reply: "25 мин" },
];

const TEMPLATES: Template[] = [
  { id: "greeting", name: "Приветствие в рабочее время", uses: 812 },
  { id: "night", name: "Ответ ночью", uses: 264 },
  { id: "delivery", name: "Сроки доставки", uses: 151 },
];

const TEMPLATE_COLUMNS: DataTableColumn<Template>[] = [
  { id: "name", header: "Шаблон", cell: (row) => row.name },
  {
    id: "uses",
    header: "Отправок",
    numeric: true,
    headerAlign: "end",
    cell: (row) => row.uses,
  },
];

const COLUMNS: DataTableColumn<Channel>[] = [
  { id: "name", header: "Канал", cell: (row) => row.name },
  {
    id: "dialogs",
    header: "Диалогов",
    numeric: true,
    headerAlign: "end",
    cell: (row) => row.dialogs,
  },
  {
    id: "reply",
    header: "Первый ответ",
    numeric: true,
    headerAlign: "end",
    cell: (row) => row.reply,
  },
];

export default function PageRouterExample() {
  const location = useLocation();
  // The first sub-page answers every other path of the section (here the preview's «/»).
  const current = SUB_PAGES.find((page) => page.to === location.pathname) ?? SUB_PAGES[0];

  return (
    <Page.Root>
      <Page.TopBar sticky={false}>
        <Page.Heading>
          <Page.Title>Мессенджеры</Page.Title>
          <Page.Description>4 канала · 1 280 диалогов за октябрь</Page.Description>
        </Page.Heading>
        <Page.Tools aria-label="Мессенджеры">
          <SegmentedControl.Root value={current.to} aria-label="Подразделы">
            {SUB_PAGES.map((page) => (
              <SegmentedControl.Item key={page.to} value={page.to} asChild>
                <Link to={page.to}>{page.label}</Link>
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </Page.Tools>
        {current.action ? (
          <Page.Actions>
            <Button.Root aria-label={current.action.name}>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              {current.action.text}
            </Button.Root>
          </Page.Actions>
        ) : null}
      </Page.TopBar>
      <Page.Body>
        {/* `location` keeps the leaving sub-page on its own route while it fades out. */}
        <Crossfade state={current.to}>
          <Routes location={location}>
            <Route
              path="/messengers/stats"
              element={
                <Page.Grid>
                  <Page.Cell span={4}>
                    <Kpi.Root>
                      <Kpi.Title>Диалогов</Kpi.Title>
                      <Kpi.Value>1 280</Kpi.Value>
                      <Kpi.Delta value={14} tone="success">
                        +14%
                      </Kpi.Delta>
                      <Kpi.Period>Октябрь</Kpi.Period>
                    </Kpi.Root>
                  </Page.Cell>
                  <Page.Cell span={4}>
                    <Kpi.Root>
                      <Kpi.Title>Первый ответ</Kpi.Title>
                      <Kpi.Value>
                        6<Kpi.Unit>мин</Kpi.Unit>
                      </Kpi.Value>
                      <Kpi.Delta value={-2} tone="success">
                        −2 мин
                      </Kpi.Delta>
                      <Kpi.Period>Октябрь</Kpi.Period>
                    </Kpi.Root>
                  </Page.Cell>
                  <Page.Cell span={4}>
                    <Kpi.Root>
                      <Kpi.Title>Без ответа</Kpi.Title>
                      <Kpi.Value>23</Kpi.Value>
                      <Kpi.Delta value={5} tone="danger">
                        +5
                      </Kpi.Delta>
                      <Kpi.Period>За сутки</Kpi.Period>
                    </Kpi.Root>
                  </Page.Cell>
                </Page.Grid>
              }
            />
            <Route
              path="/messengers/templates"
              element={
                <DataTable
                  columns={TEMPLATE_COLUMNS}
                  rows={TEMPLATES}
                  getRowKey={(row) => row.id}
                  paging="none"
                />
              }
            />
            <Route
              path="*"
              element={
                <DataTable
                  columns={COLUMNS}
                  rows={CHANNELS}
                  getRowKey={(row) => row.id}
                  paging="none"
                />
              }
            />
          </Routes>
        </Crossfade>
      </Page.Body>
    </Page.Root>
  );
}
