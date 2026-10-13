/** The app frame for desktop and phone: the Sidebar rail on a wide screen, the floating BottomNav in the footer on a phone, the AppHeader with the menu button, the title and search that opens the CommandMenu, and a simple home page that swaps with the current section. */
import {
  AppHeader,
  AppShell,
  BottomNav,
  Card,
  Checkbox,
  CommandMenu,
  Crossfade,
  Icon,
  type IconName,
  PageContent,
  Sidebar,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./app-shell.module.css";

type SectionId = "today" | "deals" | "clients" | "tasks" | "reports" | "settings";
type Section = { id: SectionId; label: string; icon: IconName };
type Row = { id: string; title: string; meta: string };

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

const KPIS = [
  { label: "Сделки в работе", value: "37", delta: "+4 за неделю", tone: "success" },
  { label: "Выручка за октябрь", value: "4,8 млн ₽", delta: "+12% к сентябрю", tone: "success" },
  { label: "Ждут ответа", value: "5 клиентов", delta: "2 дольше суток", tone: "danger" },
] as const;

const TASKS: Row[] = [
  { id: "t1", title: "Позвонить в ООО «Север» по договору поставки", meta: "10:30" },
  { id: "t2", title: "Отправить КП для АО «Меридиан»", meta: "12:00" },
  { id: "t3", title: "Согласовать скидку для ИП Котова", meta: "15:00" },
  { id: "t4", title: "Подготовить отчёт по воронке за неделю", meta: "17:30" },
];

/** What every section other than «Сегодня» lists. */
const PAGES: Record<Exclude<SectionId, "today">, { description: string; rows: Row[] }> = {
  deals: {
    description: "12 сделок в работе на 9,6 млн ₽.",
    rows: [
      { id: "d1", title: "ООО «Север» · поставка оборудования", meta: "2 400 000 ₽" },
      { id: "d2", title: "АО «Меридиан» · годовой сервис", meta: "1 180 000 ₽" },
      { id: "d3", title: "ООО «Вектор» · внедрение CRM", meta: "860 000 ₽" },
    ],
  },
  clients: {
    description: "248 клиентов, 5 ждут ответа.",
    rows: [
      { id: "c1", title: "ООО «Север»", meta: "4 сделки" },
      { id: "c2", title: "АО «Меридиан»", meta: "2 сделки" },
      { id: "c3", title: "ИП Котов", meta: "1 сделка" },
    ],
  },
  tasks: {
    description: "Все задачи команды по срокам.",
    rows: TASKS.map((task) => ({ ...task, meta: `сегодня, ${task.meta}` })),
  },
  reports: {
    description: "Сводки по продажам и работе менеджеров.",
    rows: [
      { id: "r1", title: "Воронка продаж", meta: "обновлён сегодня" },
      { id: "r2", title: "План и факт по менеджерам", meta: "октябрь" },
    ],
  },
  settings: {
    description: "Компания, команда и интеграции.",
    rows: [
      { id: "s1", title: "Команда и роли", meta: "8 человек" },
      { id: "s2", title: "Почта и телефония", meta: "подключены" },
    ],
  },
};

const isMore = (id: SectionId) => MORE.some((section) => section.id === id);

export default function AppShellPattern() {
  const [current, setCurrent] = React.useState<SectionId>("today");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [done, setDone] = React.useState<ReadonlySet<string>>(() => new Set(["t1"]));

  const openTasks = TASKS.length - done.size;
  const section = SECTIONS.find((item) => item.id === current) ?? SECTIONS[0];

  // One handler for every way into a section: the Sidebar, the bar and the search.
  const go = (id: SectionId) => {
    setCurrent(id);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const toggleTask = (id: string, checked: boolean) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  // ⌘K opens the same search as the header field.
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

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
    <>
      <AppShell.Template
        fillViewport
        scrollResetKey={current}
        nav={
          <Sidebar.Root open={menuOpen} onOpenChange={setMenuOpen}>
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
        header={
          <AppHeader.Root>
            <AppHeader.Start>
              <AppHeader.MenuButton aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} />
              <AppHeader.Title>{section.label}</AppHeader.Title>
            </AppHeader.Start>
            <AppHeader.Search onClick={() => setSearchOpen(true)}>
              Поиск сделок и клиентов
            </AppHeader.Search>
          </AppHeader.Root>
        }
        footer={
          <BottomNav.Root floating>
            {MAIN.map((item) => (
              <BottomNav.Item
                key={item.id}
                current={item.id === current}
                onClick={() => go(item.id)}
              >
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
            <BottomNav.Item
              current={isMore(current)}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <BottomNav.ItemIcon>
                <Icon name="action.more" />
              </BottomNav.ItemIcon>
              Ещё
            </BottomNav.Item>
          </BottomNav.Root>
        }
      >
        {/* Another section is another page: it cross-fades instead of flipping. */}
        <Crossfade state={current}>
          <PageContent.Section aria-labelledby="page-title">
            <PageContent.Header>
              <PageContent.Title id="page-title">{section.label}</PageContent.Title>
              <PageContent.Description>
                {current === "today"
                  ? `Среда, 14 октября · открытых задач: ${openTasks}`
                  : PAGES[current].description}
              </PageContent.Description>
            </PageContent.Header>
            <PageContent.Body>
              {current === "today" ? (
                <>
                  <div className={styles.kpis}>
                    {KPIS.map((kpi) => (
                      <Card.Root key={kpi.label} variant="stat-trend">
                        <Card.Label>{kpi.label}</Card.Label>
                        <Card.Value>{kpi.value}</Card.Value>
                        <Card.Delta tone={kpi.tone}>{kpi.delta}</Card.Delta>
                      </Card.Root>
                    ))}
                  </div>
                  <Card.Root variant="list">
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
                <Card.Root variant="list">
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
            </PageContent.Body>
          </PageContent.Section>
        </Crossfade>
      </AppShell.Template>

      <CommandMenu.Root open={searchOpen} onOpenChange={setSearchOpen} aria-label="Поиск">
        <CommandMenu.Input placeholder="Раздел, сделка или клиент" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Разделы">
            {SECTIONS.map((item) => (
              <CommandMenu.Item key={item.id} value={item.label} onSelect={() => go(item.id)}>
                <CommandMenu.ItemIcon>
                  <Icon name={item.icon} />
                </CommandMenu.ItemIcon>
                {item.label}
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Root>
    </>
  );
}
