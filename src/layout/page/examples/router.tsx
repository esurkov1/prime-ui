/** A section with sub-pages: the title is the section, each sub-page is a route of its own, the switch in the bar is their links and the body cross-fades between them; render it inside a router — `Page.Tools`, `asChild`. */
import {
  Button,
  Card,
  Crossfade,
  DataTable,
  type DataTableColumn,
  Icon,
  Page,
  SegmentedControl,
} from "prime-ui-kit";
import { Link, Route, Routes, useLocation } from "react-router-dom";

type Channel = { id: string; name: string; dialogs: number; reply: string };

const SUB_PAGES = [
  { to: "/messengers/channels", label: "Каналы" },
  { to: "/messengers/stats", label: "Статистика" },
];

const CHANNELS: Channel[] = [
  { id: "tg", name: "Telegram · @prime_support", dialogs: 642, reply: "4 мин" },
  { id: "wa", name: "WhatsApp · +7 495 120-44-10", dialogs: 391, reply: "7 мин" },
  { id: "vk", name: "ВКонтакте · Прайм CRM", dialogs: 188, reply: "12 мин" },
  { id: "avito", name: "Авито · Склад на Южной", dialogs: 59, reply: "25 мин" },
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
  const current = SUB_PAGES.find((page) => page.to === location.pathname)?.to ?? SUB_PAGES[0].to;

  return (
    <Page.Root>
      <Page.TopBar sticky={false}>
        <Page.Heading>
          <Page.Title>Мессенджеры</Page.Title>
          <Page.Description>4 канала · 1 280 диалогов за октябрь</Page.Description>
        </Page.Heading>
        <Page.Tools aria-label="Мессенджеры">
          <SegmentedControl.Root value={current} aria-label="Подразделы">
            {SUB_PAGES.map((page) => (
              <SegmentedControl.Item key={page.to} value={page.to} asChild>
                <Link to={page.to}>{page.label}</Link>
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </Page.Tools>
        <Page.Actions>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Подключить канал
          </Button.Root>
        </Page.Actions>
      </Page.TopBar>
      <Page.Body>
        {/* `location` keeps the leaving sub-page on its own route while it fades out. */}
        <Crossfade state={current}>
          <Routes location={location}>
            <Route
              path="/messengers/stats"
              element={
                <Page.Grid>
                  <Page.Cell span={4}>
                    <Card.Root variant="stat-trend">
                      <Card.Label>Диалогов</Card.Label>
                      <Card.Value>1 280</Card.Value>
                      <Card.Delta tone="success">+14% к сентябрю</Card.Delta>
                    </Card.Root>
                  </Page.Cell>
                  <Page.Cell span={4}>
                    <Card.Root variant="stat-trend">
                      <Card.Label>Первый ответ</Card.Label>
                      <Card.Value>6 мин</Card.Value>
                      <Card.Delta tone="success">на 2 мин быстрее</Card.Delta>
                    </Card.Root>
                  </Page.Cell>
                  <Page.Cell span={4}>
                    <Card.Root variant="stat-trend">
                      <Card.Label>Без ответа</Card.Label>
                      <Card.Value>23</Card.Value>
                      <Card.Delta tone="danger">+5 за сутки</Card.Delta>
                    </Card.Root>
                  </Page.Cell>
                </Page.Grid>
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
