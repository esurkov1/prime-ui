/** The app frame for desktop and phone: the Sidebar rail on a wide screen, the floating BottomNav in the footer on a phone whose More item opens the Sidebar, the page top bar with the menu button it draws by itself, the page title with a line of data, and a simple home page that swaps with the current section — `fillViewport`, `scrollResetKey`, `useAppShellNav`. */
import {
  AppShell,
  BottomNav,
  Card,
  Checkbox,
  Crossfade,
  Icon,
  type IconName,
  Kpi,
  type KpiTone,
  Page,
  Sidebar,
  Typography,
  useAppShellNav,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

type SectionId = "today" | "deals" | "clients" | "tasks" | "reports" | "settings";
type Section = { id: SectionId; label: string; icon: IconName };
type Row = { id: string; title: string; meta: string };
type Figure = {
  label: string;
  value: string;
  change: number | null;
  delta: string;
  meta?: string;
  tone: KpiTone;
};

/** The main sections: the Sidebar's first group on a wide screen, the bar on a phone. */
const MAIN: Section[] = [
  { id: "today", label: "Сегодня", icon: "nav.home" },
  { id: "deals", label: "Сделки", icon: "object.funnel" },
  { id: "clients", label: "Клиенты", icon: "object.users" },
  { id: "tasks", label: "Задачи", icon: "object.tasks" },
];

/** The rest of the map: in the Sidebar footer; on a phone «Ещё» opens the Sidebar panel. */
const MORE: Section[] = [
  { id: "reports", label: "Отчёты", icon: "object.chart" },
  { id: "settings", label: "Настройки", icon: "action.settings" },
];

const SECTIONS = [...MAIN, ...MORE];

/** Open deals: an informational count, plain in the Sidebar. */
const OPEN_DEALS = 12;

const KPIS: Figure[] = [
  {
    label: "Сделки в работе",
    value: "37",
    change: 4,
    delta: "+4",
    meta: "за неделю",
    tone: "success",
  },
  {
    label: "Выручка за октябрь",
    value: "4,8 млн ₽",
    change: 12,
    delta: "+12%",
    meta: "к сентябрю",
    tone: "success",
  },
  {
    label: "Ждут ответа",
    value: "5 клиентов",
    change: null,
    delta: "2 дольше суток",
    tone: "danger",
  },
];

const TASKS: Row[] = [
  { id: "t1", title: "Позвонить в ООО «Север» по договору поставки", meta: "10:30" },
  { id: "t2", title: "Отправить КП для АО «Меридиан»", meta: "12:00" },
  { id: "t3", title: "Согласовать скидку для ИП Котова", meta: "15:00" },
  { id: "t4", title: "Подготовить отчёт по воронке за неделю", meta: "17:30" },
];

/** What every section other than «Сегодня» lists. */
const PAGES: Record<Exclude<SectionId, "today">, { description: string; rows: Row[] }> = {
  deals: {
    description: "12 сделок в работе · 9,6 млн ₽",
    rows: [
      { id: "d1", title: "ООО «Север» · поставка оборудования", meta: "2 400 000 ₽" },
      { id: "d2", title: "АО «Меридиан» · годовой сервис", meta: "1 180 000 ₽" },
      { id: "d3", title: "ООО «Вектор» · внедрение CRM", meta: "860 000 ₽" },
    ],
  },
  clients: {
    description: "248 клиентов · 5 ждут ответа",
    rows: [
      { id: "c1", title: "ООО «Север»", meta: "4 сделки" },
      { id: "c2", title: "АО «Меридиан»", meta: "2 сделки" },
      { id: "c3", title: "ИП Котов", meta: "1 сделка" },
    ],
  },
  tasks: {
    description: "4 задачи на сегодня",
    rows: TASKS.map((task) => ({ ...task, meta: `сегодня, ${task.meta}` })),
  },
  reports: {
    description: "2 отчёта · обновлены сегодня",
    rows: [
      { id: "r1", title: "Воронка продаж", meta: "обновлён сегодня" },
      { id: "r2", title: "План и факт по менеджерам", meta: "октябрь" },
    ],
  },
  settings: {
    description: "8 человек в команде · 2 интеграции",
    rows: [
      { id: "s1", title: "Команда и роли", meta: "8 человек" },
      { id: "s2", title: "Почта и телефония", meta: "подключены" },
    ],
  },
};

const isMore = (id: SectionId) => MORE.some((section) => section.id === id);

/** «Ещё» opens the Sidebar as a panel: it reads the shell's navigation, so it renders inside the shell. */
function MoreItem({ current }: { current: boolean }) {
  const nav = useAppShellNav();
  return (
    <BottomNav.Item
      current={current}
      aria-expanded={nav?.open}
      aria-controls={nav?.navId}
      onClick={() => nav?.setOpen(true)}
    >
      <BottomNav.ItemIcon>
        <Icon name="action.more" />
      </BottomNav.ItemIcon>
      Ещё
    </BottomNav.Item>
  );
}

export default function AppShellScreenExample() {
  const [current, setCurrent] = React.useState<SectionId>("today");
  const [done, setDone] = React.useState<ReadonlySet<string>>(() => new Set(["t1"]));

  const openTasks = TASKS.length - done.size;
  const section = SECTIONS.find((item) => item.id === current) ?? SECTIONS[0];

  // One handler for every way into a section: the Sidebar (an item closes its panel) and the bar.
  const go = (id: SectionId) => setCurrent(id);

  const toggleTask = (id: string, checked: boolean) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  const countOf = (id: SectionId) => {
    if (id === "deals") return <Sidebar.ItemCount>{OPEN_DEALS}</Sidebar.ItemCount>;
    if (id === "tasks" && openTasks > 0) {
      return <Sidebar.ItemCount color="red">{openTasks}</Sidebar.ItemCount>;
    }
    return null;
  };

  const sidebarItem = (item: Section) => (
    <Sidebar.Item key={item.id} current={item.id === current} onClick={() => go(item.id)}>
      <Sidebar.ItemIcon>
        <Icon name={item.icon} />
      </Sidebar.ItemIcon>
      {item.label}
      {countOf(item.id)}
    </Sidebar.Item>
  );

  return (
    <AppShell.Template
      fillViewport
      scrollResetKey={current}
      nav={
        <Sidebar.Root>
          <Sidebar.Header>
            <Sidebar.Brand description="Отдел продаж">
              <Sidebar.BrandLogo>
                <Icon name="object.funnel" />
              </Sidebar.BrandLogo>
              Acme CRM
            </Sidebar.Brand>
            <Sidebar.Toggle variant="header" />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>{MAIN.map(sidebarItem)}</Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>{MORE.map(sidebarItem)}</Sidebar.Footer>
        </Sidebar.Root>
      }
      footer={
        <BottomNav.Root floating>
          {MAIN.map((item) => (
            <BottomNav.Item key={item.id} current={item.id === current} onClick={() => go(item.id)}>
              <BottomNav.ItemIcon>
                <Icon name={item.icon} />
              </BottomNav.ItemIcon>
              {item.id === "tasks" && openTasks > 0 ? (
                <BottomNav.ItemCount>{openTasks}</BottomNav.ItemCount>
              ) : null}
              {item.label}
            </BottomNav.Item>
          ))}
          {/* The rest of the map lives in the Sidebar: «Ещё» opens it as a panel. */}
          <MoreItem current={isMore(current)} />
        </BottomNav.Root>
      }
    >
      <Page.Root>
        {/* On a phone the bar leads with the menu button that opens the Sidebar by itself. */}
        <Page.TopBar>
          {/* Every page titles itself here: the only h1 and a line of data under it. */}
          <Page.Heading>
            <Page.Title>{section.label}</Page.Title>
            <Page.Description>
              {current === "today"
                ? `Среда, 14 октября · открытых задач: ${openTasks}`
                : PAGES[current].description}
            </Page.Description>
          </Page.Heading>
        </Page.TopBar>
        {/* Another section is another page: it cross-fades instead of flipping. */}
        <Crossfade state={current}>
          <Page.Body>
            {current === "today" ? (
              <>
                <Page.Grid>
                  {KPIS.map((kpi) => (
                    <Page.Cell key={kpi.label} span={4}>
                      <Kpi.Root>
                        <Kpi.Title>{kpi.label}</Kpi.Title>
                        <Kpi.Value>{kpi.value}</Kpi.Value>
                        <Kpi.Delta value={kpi.change} tone={kpi.tone}>
                          {kpi.delta}
                        </Kpi.Delta>
                        {kpi.meta ? <Kpi.Meta>{kpi.meta}</Kpi.Meta> : null}
                      </Kpi.Root>
                    </Page.Cell>
                  ))}
                </Page.Grid>
                <Card.Root>
                  <Card.Header>
                    <Card.Title as="h2">Задачи на сегодня</Card.Title>
                  </Card.Header>
                  <Card.List>
                    {TASKS.map((task) => (
                      <Card.ListItem key={task.id}>
                        <span className={styles.row}>
                          <Checkbox.Root
                            checked={done.has(task.id)}
                            onCheckedChange={(checked) => toggleTask(task.id, checked)}
                          >
                            <Checkbox.Label>{task.title}</Checkbox.Label>
                          </Checkbox.Root>
                          <Typography as="span" variant="caption" tone="muted">
                            {task.meta}
                          </Typography>
                        </span>
                      </Card.ListItem>
                    ))}
                  </Card.List>
                </Card.Root>
              </>
            ) : (
              <Card.Root>
                <Card.List>
                  {PAGES[current].rows.map((row) => (
                    <Card.ListItem key={row.id}>
                      <span className={styles.row}>
                        <Typography as="span" variant="body-m" truncate>
                          {row.title}
                        </Typography>
                        <Typography as="span" variant="caption" tone="muted">
                          {row.meta}
                        </Typography>
                      </span>
                    </Card.ListItem>
                  ))}
                </Card.List>
              </Card.Root>
            )}
          </Page.Body>
        </Crossfade>
      </Page.Root>
    </AppShell.Template>
  );
}
