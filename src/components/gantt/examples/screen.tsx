/** A team schedule as a work screen: the title with the people shown and a toolbar with search, filters, team sections and the primary action in its top bar over a full-height Gantt; moves saved or refused, new work drawn and named in a Modal, details in a Drawer — `scrollHeight`, `onBarChange`, `onBarCreate`, `onItemOpen`. */
import {
  Avatar,
  Badge,
  Button,
  ConfirmDialog,
  Datepicker,
  DescriptionList,
  Drawer,
  EmptyPage,
  Fieldset,
  Gantt,
  type GanttBar,
  type GanttDates,
  Icon,
  Input,
  Modal,
  matchesSmartFilter,
  Page,
  ProgressBar,
  SegmentedControl,
  Select,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
  Typography,
  useNotifications,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

type Hue = NonNullable<GanttBar["color"]>;
type TeamId = "rollout" | "analytics" | "support";
type ClientId = "tekhnostil" | "granit" | "mostostroy" | "kvartal";
type Kind = "project" | "duty" | "absence" | "milestone";

/** A bar of the chart with the fields the page needs back in its callbacks. */
type Assignment = GanttBar & { kind: Kind; client: ClientId | null };

type Person = {
  id: string;
  name: string;
  initials: string;
  role: string;
  team: TeamId;
  color: Hue;
  bars: Assignment[];
};

/** What the create dialog is for: a range drawn on a row, or the toolbar button. */
type Draft = { personId: string | null; dates: GanttDates | null };

type Errors = Partial<Record<"title" | "client" | "person" | "period", string>>;

const TEAMS: { value: TeamId; label: string }[] = [
  { value: "rollout", label: "Внедрение" },
  { value: "analytics", label: "Аналитика" },
  { value: "support", label: "Поддержка" },
];

/** One hue per client across the product: the bar label says the work, the hue repeats the client. */
const CLIENTS: Record<ClientId, { name: string; color: Hue }> = {
  tekhnostil: { name: "АО «Техностиль»", color: "blue" },
  granit: { name: "ООО «Гранит»", color: "teal" },
  mostostroy: { name: "ООО «Мостострой»", color: "orange" },
  kvartal: { name: "ООО «Зелёный квартал»", color: "pink" },
};

const KIND: Record<Kind, string> = {
  project: "Работа по проекту",
  duty: "Внутренняя задача",
  absence: "Отсутствие",
  milestone: "Веха",
};

const DAY_MS = 86_400_000;

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const TODAY = new Date(new Date().setHours(0, 0, 0, 0));
const WEEK = addDays(TODAY, -((TODAY.getDay() + 6) % 7));
const at = (days: number) => addDays(WEEK, days);

const project = (
  id: string,
  label: string,
  client: ClientId,
  from: number,
  to: number,
  progress?: number,
): Assignment => ({
  id,
  label,
  kind: "project",
  client,
  color: CLIENTS[client].color,
  start: at(from),
  end: at(to),
  progress,
});

const milestone = (id: string, label: string, client: ClientId, day: number): Assignment => ({
  id,
  label,
  kind: "milestone",
  client,
  tone: "accent",
  start: at(day),
  end: at(day),
});

/** Absences are agreed elsewhere: the chart shows them and refuses work on top of them. */
const absence = (id: string, label: string, from: number, to: number): Assignment => ({
  id,
  label,
  kind: "absence",
  client: null,
  color: "purple",
  readOnly: true,
  start: at(from),
  end: at(to),
});

const duty = (id: string, from: number, to: number): Assignment => ({
  id,
  label: "Дежурство",
  kind: "duty",
  client: null,
  tone: "neutral",
  start: at(from),
  end: at(to),
});

const PEOPLE: Person[] = [
  {
    id: "sokolov",
    name: "Пётр Соколов",
    initials: "ПС",
    role: "Руководитель проекта",
    team: "rollout",
    color: "blue",
    bars: [
      project("s-1", "Внедрение CRM", "granit", -3, 12, 0.5),
      project("s-2", "Планирование работ", "mostostroy", 8, 16),
      milestone("s-3", "Запуск у «Техностиля»", "tekhnostil", 9),
    ],
  },
  {
    id: "kotova",
    name: "Анна Котова",
    initials: "АК",
    role: "Аналитик",
    team: "analytics",
    color: "green",
    bars: [
      project("k-1", "Обследование процессов", "granit", -4, 5, 0.8),
      project("k-2", "ТЗ на интеграцию", "mostostroy", 6, 15),
      absence("k-3", "Отпуск", 17, 27),
    ],
  },
  {
    id: "gordeev",
    name: "Илья Гордеев",
    initials: "ИГ",
    role: "Разработчик интеграций",
    team: "rollout",
    color: "orange",
    bars: [
      project("g-1", "Интеграция с 1С", "tekhnostil", -6, 9, 0.6),
      project("g-2", "Обмен с банком", "kvartal", 4, 14),
    ],
  },
  {
    id: "belova",
    name: "Ольга Белова",
    initials: "ОБ",
    role: "Инженер внедрения",
    team: "rollout",
    color: "purple",
    bars: [
      absence("b-1", "Отпуск", -2, 5),
      project("b-2", "Настройка ролей", "tekhnostil", 5, 12),
      project("b-3", "Обучение пользователей", "granit", 14, 19),
    ],
  },
  {
    id: "khasanov",
    name: "Марат Хасанов",
    initials: "МХ",
    role: "Инженер внедрения",
    team: "rollout",
    color: "teal",
    bars: [project("h-1", "Миграция данных", "mostostroy", 0, 18, 0.2)],
  },
  {
    id: "zueva",
    name: "Елена Зуева",
    initials: "ЕЗ",
    role: "Аналитик",
    team: "analytics",
    color: "sky",
    bars: [
      project("z-1", "Отчёты руководителя", "kvartal", 2, 10, 0.4),
      milestone("z-2", "Приёмка отчётов", "kvartal", 10),
    ],
  },
  {
    id: "orlov",
    name: "Денис Орлов",
    initials: "ДО",
    role: "Инженер поддержки",
    team: "support",
    color: "yellow",
    bars: [duty("o-1", 0, 7), project("o-2", "Сопровождение запуска", "tekhnostil", 9, 23)],
  },
  {
    id: "lebedeva",
    name: "Мария Лебедева",
    initials: "МЛ",
    role: "Инженер поддержки",
    team: "support",
    color: "pink",
    bars: [absence("l-1", "Больничный", -1, 2), duty("l-2", 7, 14)],
  },
  {
    id: "morozov",
    name: "Антон Морозов",
    initials: "АМ",
    role: "Разработчик интеграций",
    team: "rollout",
    color: "red",
    bars: [],
  },
];

const ROLES = [...new Set(PEOPLE.map((person) => person.role))];

const FIELDS: SmartFilterField[] = [
  { key: "role", label: "Роль", options: ROLES.map((role) => ({ value: role, label: role })) },
  {
    key: "client",
    label: "Клиент",
    options: (Object.keys(CLIENTS) as ClientId[]).map((value) => ({
      value,
      label: CLIENTS[value].name,
    })),
  },
];

const DAY = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });

const formatPeriod = ({ start, end }: GanttDates) =>
  start.getTime() === end.getTime()
    ? DAY.format(start)
    : `${DAY.format(start)} – ${DAY.format(addDays(end, -1))}`;

const lengthInDays = ({ start, end }: GanttDates) =>
  Math.round((end.getTime() - start.getTime()) / DAY_MS);

const overlapsAbsence = (person: Person, dates: GanttDates, barId?: string) =>
  person.bars.some(
    (bar) =>
      bar.kind === "absence" && bar.id !== barId && dates.start < bar.end && bar.start < dates.end,
  );

/** The stand-in for the schedule service's response time. */
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** `yyyy-MM-dd` from the Datepicker's hidden input → a local calendar day. */
const parseDay = (value: FormDataEntryValue) => new Date(`${value}T00:00`);

export default function GanttScreenExample() {
  const { notify } = useNotifications();
  const formId = React.useId();
  const [people, setPeople] = React.useState(PEOPLE);
  const [loading, setLoading] = React.useState(true);
  const [team, setTeam] = React.useState("all");
  const [filter, setFilter] = React.useState<SmartFilterValue>({});
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<{ bar: Assignment; person: Person } | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [errors, setErrors] = React.useState<Errors>({});
  const [saving, setSaving] = React.useState(false);
  // The chart keeps a busy ghost while the drawn range is being named; the dialog settles it.
  const pendingCreate = React.useRef<{ resolve: () => void; reject: (reason: Error) => void }>(
    null,
  );

  React.useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const query = search.trim().toLowerCase();
  // Absences stay visible under a client filter: whether a person is free matters for any client.
  // `matchesSmartFilter(entry, null)` is true only while that filter is empty.
  const rows = people
    .filter(
      (person) =>
        (team === "all" || person.team === team) &&
        matchesSmartFilter(filter.role, person.role) &&
        person.name.toLowerCase().includes(query),
    )
    .map((person) => ({
      ...person,
      bars: person.bars.filter(
        (bar) => bar.kind === "absence" || matchesSmartFilter(filter.client, bar.client),
      ),
    }))
    .filter(
      (person) =>
        matchesSmartFilter(filter.client, null) ||
        person.bars.some((bar) => bar.kind !== "absence"),
    );

  const findPerson = (id: string) => people.find((person) => person.id === id) as Person;

  const updateBars = (personId: string, change: (bars: Assignment[]) => Assignment[]) =>
    setPeople((current) =>
      current.map((person) =>
        person.id === personId ? { ...person, bars: change(person.bars) } : person,
      ),
    );

  const resetFilters = () => {
    setTeam("all");
    setFilter({});
    setSearch("");
  };

  // The rows change only after the service agrees, so a refused move glides back by itself.
  const moveBar = async (dates: GanttDates, bar: Assignment, row: Person) => {
    const person = findPerson(row.id);
    await wait(700);
    if (overlapsAbsence(person, dates, bar.id)) {
      notify({
        tone: "danger",
        title: "Сроки не изменены",
        description: `${person.name} в эти дни отсутствует`,
      });
      throw new Error("Пересекается с отсутствием");
    }
    updateBars(person.id, (bars) =>
      bars.map((item) => (item.id === bar.id ? { ...item, ...dates } : item)),
    );
  };

  const startCreate = (dates: GanttDates, row: Person) => {
    const person = findPerson(row.id);
    if (overlapsAbsence(person, dates)) {
      notify({
        tone: "warning",
        title: "Задача не назначена",
        description: `${person.name} в эти дни отсутствует`,
      });
      return Promise.reject(new Error("Пересекается с отсутствием"));
    }
    return new Promise<void>((resolve, reject) => {
      pendingCreate.current = { resolve, reject };
      setErrors({});
      setDraft({ personId: person.id, dates });
    });
  };

  const closeDraft = (open: boolean) => {
    if (open) return;
    pendingCreate.current?.reject(new Error("Отменено"));
    pendingCreate.current = null;
    setDraft(null);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const client = String(data.get("client") ?? "") as ClientId | "";
    const personId = draft.personId ?? String(data.get("person") ?? "");
    const [from, to] = data.getAll("period");
    const dates =
      draft.dates ?? (from && to ? { start: parseDay(from), end: addDays(parseDay(to), 1) } : null);

    const found: Errors = {};
    if (!title) found.title = "Назовите задачу";
    if (!client) found.client = "Выберите клиента";
    if (!personId) found.person = "Выберите сотрудника";
    if (!dates) found.period = "Укажите начало и конец работ";
    else if (personId && overlapsAbsence(findPerson(personId), dates))
      found.period = "Сотрудник в эти дни отсутствует";
    setErrors(found);
    const firstInvalid = (["title", "client", "person", "period"] as const).find(
      (key) => found[key],
    );
    if (firstInvalid || !client || !dates) {
      if (firstInvalid) document.getElementById(`${formId}-${firstInvalid}`)?.focus();
      return;
    }

    setSaving(true);
    await wait(700);
    const person = findPerson(personId);
    updateBars(person.id, (bars) => [
      ...bars,
      {
        id: `${person.id}-${Date.now()}`,
        label: title,
        kind: "project",
        client,
        color: CLIENTS[client].color,
        ...dates,
      },
    ]);
    pendingCreate.current?.resolve();
    pendingCreate.current = null;
    setSaving(false);
    setDraft(null);
    notify({
      tone: "success",
      title: "Задача назначена",
      description: `${title} · ${person.name}`,
    });
  };

  const removeSelected = async () => {
    if (!selected) return;
    await wait(700);
    updateBars(selected.person.id, (bars) => bars.filter((bar) => bar.id !== selected.bar.id));
    setDetailOpen(false);
    notify({ tone: "success", title: "Задача снята", description: selected.bar.label });
  };

  const draftPerson = draft?.personId ? findPerson(draft.personId) : null;
  const detail = selected?.bar;

  return (
    <SmartFilter.Root
      fields={FIELDS}
      value={filter}
      onValueChange={setFilter}
      search={search}
      onSearchChange={setSearch}
    >
      <Page.Root fill>
        {/* A work screen titles itself in its top bar: the only h1, the teams, the search and the
          filters, the one primary action. */}
        <Page.TopBar>
          <Page.Heading>
            <Page.Title>Загрузка команды</Page.Title>
            <Page.Description>
              {loading ? "Загружаем график…" : `Сотрудников: ${rows.length} из ${people.length}`}
            </Page.Description>
          </Page.Heading>
          <Page.Tools aria-label="Загрузка команды">
            <SegmentedControl.Root value={team} onValueChange={setTeam} aria-label="Команда">
              <SegmentedControl.Item value="all">
                Все<SegmentedControl.Count>{people.length}</SegmentedControl.Count>
              </SegmentedControl.Item>
              {TEAMS.map((item) => (
                <SegmentedControl.Item key={item.value} value={item.value}>
                  {item.label}
                  <SegmentedControl.Count>
                    {people.filter((person) => person.team === item.value).length}
                  </SegmentedControl.Count>
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
            <SmartFilter.Toolbar />
          </Page.Tools>
          <Page.Actions>
            <Button.Root
              onClick={() => {
                setErrors({});
                setDraft({ personId: null, dates: null });
              }}
            >
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Назначить
            </Button.Root>
          </Page.Actions>
          <Page.Chips>
            <SmartFilter.Chips />
          </Page.Chips>
        </Page.TopBar>
        <Page.Body>
          <Gantt<Person, Assignment>
            aria-label="Загрузка команды внедрения"
            className={styles.chart}
            defaultScale="day"
            scrollHeight="fill"
            loading={loading}
            rows={loading ? [] : rows}
            getRowKey={(person) => person.id}
            getRowLabel={(person) => person.name}
            getRowBars={(person) => person.bars}
            renderRowAvatar={(person) => (
              <Avatar.Root color={person.color}>
                <Avatar.Fallback>{person.initials}</Avatar.Fallback>
              </Avatar.Root>
            )}
            renderRow={(person) => (
              <span className={styles.person}>
                <Typography as="span" variant="body-m">
                  {person.name}
                </Typography>
                <Typography as="span" variant="caption" tone="muted">
                  {person.role}
                </Typography>
              </span>
            )}
            onBarChange={moveBar}
            onBarCreate={startCreate}
            onItemOpen={(bar, row) => {
              setSelected({ bar, person: findPerson(row.id) });
              setDetailOpen(true);
            }}
            renderBarTooltip={(bar) => (bar.client ? CLIENTS[bar.client].name : KIND[bar.kind])}
            toolbar={
              <>
                {/* The legend of client hues: the bar's hue repeats its client, the tooltip names it. */}
                {(Object.keys(CLIENTS) as ClientId[]).map((client) => (
                  <Badge.Root key={client} color={CLIENTS[client].color}>
                    <Badge.Dot />
                    {CLIENTS[client].name}
                  </Badge.Root>
                ))}
              </>
            }
            empty={
              <EmptyPage.Root size="s" role="status" aria-labelledby="schedule-empty">
                <EmptyPage.Icon>
                  <Icon name="action.search" />
                </EmptyPage.Icon>
                <EmptyPage.Title as="p" id="schedule-empty">
                  Никого не нашли
                </EmptyPage.Title>
                <EmptyPage.Description>Измените запрос или сбросьте фильтры.</EmptyPage.Description>
                <EmptyPage.Actions>
                  <Button.Root variant="soft" tone="neutral" onClick={resetFilters}>
                    Сбросить фильтры
                  </Button.Root>
                </EmptyPage.Actions>
              </EmptyPage.Root>
            }
          />

          <Modal.Root open={draft !== null} onOpenChange={closeDraft}>
            <Modal.Content size="s">
              <Modal.Header>
                <Modal.Title>Новая задача</Modal.Title>
                <Modal.Description>
                  {draftPerson && draft?.dates
                    ? `${draftPerson.name} · ${formatPeriod(draft.dates)}`
                    : "Сотрудник увидит задачу в своём графике."}
                </Modal.Description>
              </Modal.Header>
              <Modal.Body>
                <Modal.Guard busy={saving} />
                <form id={formId} noValidate onSubmit={submit}>
                  <Fieldset aria-label="Задача" disabled={saving}>
                    <Input.Root id={`${formId}-title`} label="Задача" required error={errors.title}>
                      <Input.Wrapper>
                        <Input.Field name="title" placeholder="Обучение пользователей" autoFocus />
                      </Input.Wrapper>
                    </Input.Root>
                    <Select.Root
                      name="client"
                      label="Клиент"
                      required
                      placeholder="Выберите клиента"
                      error={errors.client}
                      id={`${formId}-client`}
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {(Object.keys(CLIENTS) as ClientId[]).map((value) => (
                          <Select.Item key={value} value={value}>
                            {CLIENTS[value].name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                    {draft?.personId ? null : (
                      <>
                        <Select.Root
                          name="person"
                          label="Сотрудник"
                          required
                          placeholder="Выберите сотрудника"
                          error={errors.person}
                          id={`${formId}-person`}
                        >
                          <Select.Trigger>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content searchable>
                            {people.map((person) => (
                              <Select.Item key={person.id} value={person.id} keywords={person.role}>
                                {person.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                        <Datepicker.Root
                          mode="range"
                          name="period"
                          label="Период"
                          required
                          fullWidth
                          placeholder="Начало и конец работ"
                          error={errors.period}
                          id={`${formId}-period`}
                        />
                      </>
                    )}
                  </Fieldset>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Modal.Close>
                  <Button.Root variant="soft" tone="neutral">
                    Отмена
                  </Button.Root>
                </Modal.Close>
                <Button.Root type="submit" form={formId} loading={saving}>
                  Назначить
                </Button.Root>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Root>

          <Drawer.Root open={detailOpen} onOpenChange={setDetailOpen}>
            <Drawer.Content size="s">
              <Drawer.Header>
                <Drawer.Title>{detail?.label}</Drawer.Title>
                <Drawer.Description>{detail ? KIND[detail.kind] : null}</Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                {selected && detail ? (
                  <DescriptionList.Root orientation="vertical">
                    <DescriptionList.Item label="Сотрудник">
                      {selected.person.name} · {selected.person.role}
                    </DescriptionList.Item>
                    <DescriptionList.Item label="Клиент">
                      {detail.client ? (
                        <Badge.Root color={CLIENTS[detail.client].color}>
                          {CLIENTS[detail.client].name}
                        </Badge.Root>
                      ) : (
                        "Без клиента"
                      )}
                    </DescriptionList.Item>
                    <DescriptionList.Item label={detail.kind === "milestone" ? "Дата" : "Период"}>
                      {formatPeriod(detail)}
                      {detail.kind === "milestone" ? null : ` · ${lengthInDays(detail)} дн.`}
                    </DescriptionList.Item>
                    {detail.progress === undefined ? null : (
                      <DescriptionList.Item label="Выполнено">
                        <ProgressBar
                          value={Math.round(detail.progress * 100)}
                          showValue
                          aria-label="Выполнено"
                        />
                      </DescriptionList.Item>
                    )}
                  </DescriptionList.Root>
                ) : null}
              </Drawer.Body>
              <Drawer.Footer>
                {detail && !detail.readOnly ? (
                  <ConfirmDialog.Root
                    title={`Снять задачу «${detail.label}»?`}
                    description={`${selected?.person.name} освободится на эти дни. Задачу можно будет назначить заново.`}
                    confirmLabel="Снять задачу"
                    onConfirm={removeSelected}
                  >
                    <ConfirmDialog.Trigger>
                      <Button.Root variant="soft" tone="danger">
                        <Button.Icon>
                          <Icon name="action.delete" />
                        </Button.Icon>
                        Снять задачу
                      </Button.Root>
                    </ConfirmDialog.Trigger>
                  </ConfirmDialog.Root>
                ) : null}
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
        </Page.Body>
      </Page.Root>
    </SmartFilter.Root>
  );
}
