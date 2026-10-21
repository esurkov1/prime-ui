# UX — what to show and how to arrange it

The rest of the skill says how a screen looks. This file says what goes on it: which shape the data
takes on screen, how many words it needs, how much friction an action deserves, what a person must
never have to guess. Read it before the layout, and again when you change a screen someone already
built.

## 1. Brief before code

Before the first line of JSX, write five lines (in your reply, not in a file):

1. **Who and what for** — the person and the decision this screen helps them make («менеджер
   выставляет счёт клиенту»).
2. **The data** — every entity on the screen and its shape: one record, a collection, a value with
   variants, a base value with overrides (§2).
3. **The main action** — one per area; everything else is secondary.
4. **States** — which of loading, empty, error, disabled, read-only, saving, saved this screen
   really has.
5. **The narrow screen** — what stacks, what scrolls, what moves to a menu.

The layout follows from the brief. A screen laid out without it repeats labels, splits records and
adds text that explains what the layout failed to show.

## 2. The shape of the data decides the layout

| The data | On screen | With |
|---|---|---|
| One record, read | label · value pairs | `DescriptionList` |
| One record, edited | a form: fields 20 apart, groups 32 apart | `Fieldset`, fields |
| One record of 2–4 short fields in a form | one row of fields | an [intrinsic grid](responsive.md#intrinsic-grids) |
| Records of one shape a person adds, edits, removes | one row per record, the headings once above | `FieldList` |
| Records of one shape a person reads, sorts, filters | a table | `DataTable` |
| One value in several units or currencies (a deposit in ₽, $, ฿) | the fields side by side in one row under one heading, the unit in each field | `Input.InlineAffix` |
| A base value and its overrides (a price and its changes by month) | one list: the base is the first, pinned row | `FieldList` `getLocked` |
| Small attributes of a record (an icon, a color, a flag) | compact controls in the record's row, not fields of their own | icon-only `Select`, `ColorPresets`, `Switch` |
| Short texts in an order the person sets | one column, a handle per row | `FieldList` `reorderable` |
| Records of one kind, some fixed by the system (funnel stages, default roles) | one list in their real order, the fixed rows pinned in place | `List` `locked`, `FieldList` `getLocked` |
| Settings that most people never touch | behind a disclosure, after the common ones | `Accordion`, a «Дополнительно» section |
| One of a few options, sent with a form | all visible | `Radio.Group` |
| One of a few modes of what the screen shows | all visible | `SegmentedControl` |
| One of many options | a list that opens | `Select` |
| Many values picked from options | tags | `TagSelect` |
| A section named after a set of records (sessions, devices, API keys, members) | the records themselves, each with its own actions | `List` with `List.ItemActions` |

How many options count as «a few» and the other selection cases: [choosing.md](choosing.md#2-inside-a-category).

One record is one row or one block, never half a record per line. If a record does not fit one
row, it is not a row: open it in a `Drawer`.

**A section is what its name says.** A heading that names a set of records — «Сеансы», «Устройства»,
«Ключи API», «Участники» — promises those records: show them, one row each (where, when, which one is
this one), with the action on one record in its row and the action on all of them in the section's
actions. One button standing for the set («Выйти на других устройствах») leaves the person to act on
records they cannot see. A set that can be empty shows its empty state, never a missing section.

```tsx partial
// bad — «Сеансы» with nothing but a button
<Drawer.Section label="Сеансы">
  <Button.Root variant="soft" tone="neutral">Выйти на других устройствах</Button.Root>
</Drawer.Section>
```

```tsx good
// good — the sessions themselves, an end per row, the end of all of them beside the heading
<Drawer.Section label="Сеансы">
  <Drawer.Actions>
    <Button.Root variant="soft" tone="neutral">Завершить остальные</Button.Root>
  </Drawer.Actions>
  <List.Root aria-label="Сеансы">
    <List.Item value="mac">
      <List.ItemText>Chrome · macOS</List.ItemText>
      <List.ItemDescription>Москва · это устройство</List.ItemDescription>
    </List.Item>
    <List.Item value="iphone">
      <List.ItemText>Safari · iPhone</List.ItemText>
      <List.ItemDescription>Казань · вчера в 21:40</List.ItemDescription>
      <List.ItemActions>
        <Button.Root size="s" variant="soft" tone="neutral">Завершить</Button.Root>
      </List.ItemActions>
    </List.Item>
  </List.Root>
</Drawer.Section>
```

**One kind, one list.** Records of one kind stay one list in the order they really have, whoever made
them: the stages of a funnel, the team's and the system's alike, read top to bottom as the board shows
them. What some rows cannot do (move, be removed) is a mark on those rows — the lock in the grip's
place — never a second section. Two lists split one order in two, and their columns no longer line up.
The test: does the board, the report or the process read these records as one sequence? Then they are
one list.

```tsx partial
// bad — the system stages in a section of their own under the team's; one order, two lists
<Drawer.Section label="Свои этапы">
  <List.Root aria-label="Свои этапы" onReorder={reorder}>…</List.Root>
</Drawer.Section>
<Drawer.Section label="Системные этапы">
  <List.Root aria-label="Системные этапы">…</List.Root>
</Drawer.Section>
```

```tsx good
// good — one list in board order; the system stages hold their places with a lock
// declare: const stages: { id: string; name: string; system: boolean }[]
// declare: const reorder: (id: string, beforeId: string | null) => void
<List.Root aria-label="Этапы воронки" onReorder={reorder}>
  {stages.map((stage) => (
    <List.Item key={stage.id} value={stage.id} locked={stage.system}>
      <List.ItemText>{stage.name}</List.ItemText>
    </List.Item>
  ))}
</List.Root>
```

## 3. Label economy

Every word on screen must carry something the person does not see already.

- **A label once per column, not per row.** Records in rows have their headings above the first
  row only (`FieldList` draws them and names every field by its heading for screen readers).
  Rows whose values name themselves («Аренда: 20 окт → 2 нояб», «1 200 ₽») take
  `FieldList stackedLabels={false}`, so a phone does not repeat the headings over every stacked row.
- **No numbered labels.** «Преимущество 1», «Преимущество 2» repeat the heading and count what the
  list already counts. The list label names the rows.
- **No label that repeats its heading.** A field «Цена» inside the section «Цена» needs no label of
  its own beyond what the section says; a group of one field is the field.
- **A heading only where it names what nothing else names.** A block that names itself — a chart or a
  card with its own title, a table with its toolbar — gets no section heading over it, and the first
  block of a tab never repeats the tab («Характеристики» under the tab «Характеристики»). A section
  heading stands where several blocks share a topic that none of them names. The test: delete the
  heading and read the screen; if nothing is lost, it goes. Blocks without a heading stand one under
  another with the section step between them (a `Tabs.Panel` in a dialog body spaces them by itself;
  no wrapper of your own).

```tsx partial
// bad — a section over a chart that has its own title, under a tab of the same name
<Tabs.Panel value="analytics">
  <Drawer.Section label="Аналитика" description="За 30 дней">
    <ChartFrame.Root>
      <ChartFrame.Header>
        <ChartFrame.Title>Продажи</ChartFrame.Title>
      </ChartFrame.Header>
      …
    </ChartFrame.Root>
  </Drawer.Section>
</Tabs.Panel>
```

```tsx good
// good — the charts name themselves; the tab names the topic, the period is the tab's switcher
// declare: const sales: Parameters<typeof ChartFrame.Root>[0]["rows"]
// declare: const refunds: Parameters<typeof ChartFrame.Root>[0]["rows"]
<Tabs.Panel value="analytics">
  <ChartFrame.Root rows={sales}>
    <ChartFrame.Header>
      <ChartFrame.Title>Продажи</ChartFrame.Title>
    </ChartFrame.Header>
  </ChartFrame.Root>
  <ChartFrame.Root rows={refunds}>
    <ChartFrame.Header>
      <ChartFrame.Title>Возвраты</ChartFrame.Title>
    </ChartFrame.Header>
  </ChartFrame.Root>
</Tabs.Panel>
```

- **A unit lives in one place.** In the field (`Input.InlineAffix`) or in the heading, never both;
  never in the field's own label («Бюджет», not «Бюджет, ₽»). Prefer the field: the unit stays
  beside the number when the row stacks, and a screen reader hears it with the field (the affix
  describes the input; `aria-label="рублей"` on it when the sign reads badly).
- **No text that explains the layout.** «Двигатель, места и скорость всегда первыми» — the lock on
  those rows says it.
- **A hint is the few words the label and the control leave out** — two to five: a format («ДД.ММ.ГГГГ»),
  a limit («До 10 МБ»), a consequence nobody would expect («Увидит клиент»). Never what the control
  already shows («Применяется сразу» under a Switch, «Время в CRM показывается в этом поясе» under
  «Часовой пояс»), never the obvious outcome of the action or what stays unchanged («пароль
  останется прежним», «история его действий останется»), never the label again in other words. A
  field that needs no hint has none; a hint that needs a sentence is a missing label or a missing
  control.

| bad hint | good |
|---|---|
| «Часовой пояс» — «Время в CRM показывается в этом поясе» | no hint |
| «Звук» (Switch) — «Применяется сразу, без сохранения» | no hint |
| «Отключить доступ» — «Сотрудник не сможет войти, история его действий останется» | «Входы прекратятся» |
| «Почта для входа» — «На эту почту придёт ссылка для входа в систему» | «Для входа и уведомлений» |
- **Helper text is opt-in.** A hint, a limit, a counter, a range line («Показано 1–20 из 240») or a
  description shows only where it tells this person something they need for this task; the kit
  draws none of its own unless asked — DataTable shows its range with `showRange`, and FieldList and
  FileUpload at `max` close up their add control without a word, so a limit worth knowing goes in
  `hint` («До 10 фото»). Turn one on for a reason you can name, never because the prop exists.
- **One name per thing.** The same action, entity and status keep one word on the whole screen
  (and across screens): «Счёт», not «Счёт» in the title and «Инвойс» in the button.
- **Count the labels.** On a form of repeating rows, labels on screen ≤ number of columns + the
  list label. More means a layout bug.

## 4. Words

The kit's UI language is Russian; these are the rules of its copy.

- **An icon on a button is its verb; the text names the object.** `action.add` says add, create
  and new; `action.delete` delete; `action.download`, `action.upload`, `action.copy`, `action.send`,
  `action.edit`, `action.refresh`, `action.search`, `action.filter` say theirs. The text never
  repeats that verb: «+ Оплата», «+ Заказ», «⬇ Отчёт CSV» — not «+ Добавить оплату», «+ Новый
  заказ», «+ Создать заказ», «⬇ Скачать отчёт». When nothing is left without the verb (the object
  is plain from where the button stands: a row, a card, a selection), the button is icon-only —
  `aria-label` with the verb and the object («Удалить выбранные») and a `Tooltip` with the same
  words. The whole action belongs in the name and the tooltip, where it helps a person who did not
  read the icon: a labelled button takes `aria-label` with the action that contains its visible word
  («+ Заказ» → `aria-label="Новый заказ"`, «+ Канал» → «Подключить канал»), so a screen reader says
  the action and `Page.Actions` shows it as the tooltip once the button folds to its icon; an
  icon-only button's `aria-label` and `Tooltip` say «Новый заказ», «Создать счёт» freely.
- **A button without an icon says the verb and the object:** «Выставить счёт», «Сохранить
  изменения». Never «ОК», «Да», «Подтвердить», «Отправить» without an object when the object is not
  obvious. The confirm of a destructive action keeps its verb and takes no icon («Удалить проект»).
  Either the icon or the verb says the action, never both. Menu rows (`Dropdown.Item`,
  `Select.Action`, `CommandMenu.Item`) keep the verb beside their icon: a row has no icon-only form.

```tsx partial
// bad — the «+» and the text both say «add»
<Page.Actions>
  <Button.Root>
    <Button.Icon>
      <Icon name="action.add" />
    </Button.Icon>
    Добавить оплату
  </Button.Root>
</Page.Actions>
```

```tsx good
// good — the icon is the verb, the text the object; a bare verb is an icon-only button
<Page.Actions>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Button.Root variant="soft" tone="neutral" aria-label="Обновить платежи">
        <Button.Icon>
          <Icon name="action.refresh" />
        </Button.Icon>
      </Button.Root>
    </Tooltip.Trigger>
    <Tooltip.Content>Обновить платежи</Tooltip.Content>
  </Tooltip.Root>
  <Button.Root variant="soft" tone="neutral">
    <Button.Icon>
      <Icon name="action.download" />
    </Button.Icon>
    Отчёт CSV
  </Button.Root>
  <Button.Root aria-label="Новая оплата">
    <Button.Icon>
      <Icon name="action.add" />
    </Button.Icon>
    Оплата
  </Button.Root>
</Page.Actions>
```

- **A confirm names the thing and the consequence:** «Удалить проект «Север»? Задачи и файлы
  удалятся без возможности восстановления.», «Выставить счёт на 48 000 ₽ ООО «Север»? Счёт уйдёт
  клиенту на почту.» — not «Вы уверены?».
- **An error says how to fix it:** «Формат: +7 912 404-18-20», «Не больше 2 000 символов» — not
  «Неверное значение», «Ошибка».
- **An empty state says what to do next** and offers it: «Счетов пока нет» + «Выставить счёт». A
  filtered empty state offers to reset the filter.
- **Sentence case** everywhere: «Счета к оплате», not «Счета К Оплате».
- **Numbers as digits:** «3 файла», not «три файла».
- **Typography:** quotes «ёлочки» (inner „лапки“), a dash — with spaces, ranges with an en dash
  without spaces (10–20), `…` as one character, a non-breaking space before units and after short
  words in a heading (`50 ГБ`, `2 000 ₽`).
- **Numbers, money and dates through `Intl`**, never by hand: `Intl.NumberFormat("ru-RU", { style:
  "currency", currency: "RUB" })`, `Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" })`,
  `date-fns` with the `ru` locale for relative dates.
- **Loading text ends with `…`:** «Сохраняем…». The kit's own labels already do.

## 5. Friction matches the cost of a mistake

Pick the lightest step that keeps the person safe ([choosing.md](choosing.md) has the components):

| The action | The step |
|---|---|
| Reversible, frequent (remove a row, archive, move) | do it at once, «Отменить» in a `Notification` (`action`, commit in `onDismiss`) |
| Reversible, started from a button that stays in place (mark done, archive from a record's header) | `Button.Root countdown={5}`: the action runs at once, the button turns into «Отменить», fills and counts down; the press undoes it |
| Outward but worth a moment to take back (send a message, notify a client) | `Button.Root countdown={5} countdownMode="delay"`: it leaves in `onConfirm` when the window closes; the press cancels |
| One standalone action that is easy to redo by hand | `Button.Root holdToConfirm` |
| Irreversible loss of work, or an outward action that cannot be called back once it leaves the product (an invoice or a message sent to a client, a payment) | `ConfirmDialog` that names the thing and the consequence |
| Bulk destructive | `ConfirmDialog` that names the count («Удалить 12 счетов?») |
| Leaving a form with changes | `Modal.Guard` / `Drawer.Guard dirty`; a form that is the page — `Page.Guard dirty` |

The countdown keeps the undo where the eye already is; the notification is for an item that leaves the
screen (a removed row). Never both for one action, never a countdown on an irreversible step.

A confirm on every action trains people to click through it; the one that mattered is then missed.
Which button starts each step and how the confirm behaves:
[api-contract.md](api-contract.md#destructive-actions).

## 6. Nothing to guess

- **A disabled control says why** when the reason is not on screen: a `hint` under the field, a
  line beside the button, or the disabled control itself in `Tooltip.Trigger`. A control that
  leaves at a limit (the add button of `FieldList` or `FileUpload` at `max`) says it ahead, in the
  list's `hint`. An action a person may never take (no permission) is hidden, not
  disabled.
- **The screen answers the latest question.** A request a value starts (a search, a filter, a page,
  a period) is cancelled when the value changes again — abort it (`AbortController`) or drop its
  answer — so a slow answer never replaces a newer one. A simulated request (a `setTimeout` standing
  in for the server) is cancelled the same way, in the effect's cleanup.
- **The state of a screen is in the URL:** the tab, the filters, the search, the page, the open
  record. A link copied from the address bar opens the same view; Back undoes the last navigation.
- **Visible status for every action** (the kit does it when you use it): `loading` on the button,
  «Сохранено» on a form that stays, a `Notification` for one that goes away, `aria-busy` rows while
  a save runs.
- **Recognition over recall:** options are listed, not typed; the current value is shown in the
  control, not in a hint.

## 7. Ask less

- **Defaults:** prefill what the system knows or can guess — the current period, today's date, the
  person's own company, the last used currency. An empty required field the person always fills the
  same way is a missing default.
- **The right control for the data:** `inputMode="numeric" | "decimal" | "tel" | "email"`,
  `Datepicker` for a date, `Select` for a closed list. A free text field for a closed set of values
  is a bug.
- **Autofill only where a person signs in:** `autoComplete` tokens go on sign-in and sign-up fields
  (`email`, `current-password`, `new-password`, `one-time-code`) and on a new password; everywhere
  else the kit keeps autofill off, so a saved login never drops over a search or a record field.
- **Safari decides by words, not by attributes:** it ignores `autocomplete="off"` on a field it
  takes for a login, and it takes a text field for one when its placeholder, label, `name` or `id`
  speaks of a login: «username», «user», «login», «email», «e-mail», «логин», «почта», «имя
  пользователя». The kit's opt-outs stop Chrome, Firefox and the password-manager extensions, not
  Safari; on a field that is not a sign-in only the words do. So a search, a filter or a record
  field never names itself with those words — it says what is searched in the domain's words:
  - bad: a search `placeholder="Название или @username"`, `name="login"` on a filter, «Поиск по
    email» → Safari offers the saved login over the table;
  - good: `placeholder="Название или @ник"`, «Имя или контакт», «Клиент, телефон или ИНН»; no
    `name` / `id` on a search at all.
  A record's own e-mail field (a client's, an employee's) keeps its label «Почта» and
  `type="email"`: Safari may offer a contact card there, which is right for e-mail. Never fight the
  browser with tricks — a readonly-until-focus field, a hidden decoy, a made-up `autoComplete`
  token: they break the field for assistive tech and stop working with the next Safari.
- **Progressive disclosure:** the common 80% first; rare settings behind an `Accordion` item or a
  «Дополнительно» section; a long create flow in steps (`Stepper`).
- **Group by meaning, order by use:** fields in the order a person has the information (company →
  contact → payment), the most used first in every list.

## 8. Changing a screen someone built

1. **Audit before editing.** Go through [checklist.md](checklist.md), [anti-slop.md](anti-slop.md)
   and §2–§7 of this file for the whole screen, and list what breaks the rules.
2. **Fix the shape first:** repeated labels, split records, wrong control for the data, text that
   explains the layout — these come before spacing and color.
3. **Keep what works:** the screen's skeleton, its data flow and its names, unless they are the
   problem.
4. Then make the requested change on the cleaned screen.

## 9. Look at it before handing it over

Code that passes every check can still read badly. Open the screen in a browser and look:

- **Both themes**, every width of [the responsive checklist](responsive.md#checklist-before-handing-a-screen-over),
  and the narrow container of every panel.
- **Count:** labels on a form of rows (§3), primary buttons per area (one), sizes per row (one).
- **Read every text aloud:** a word that repeats its neighbour, a hint that explains the layout, a
  button without an object — remove or rewrite it.
- **Fill it badly:** the longest real name, an empty list, an error on every field, the slowest
  load. Nothing overflows, jumps or flips.

## 10. Where a setting lives

A setting lives with what it governs, as a field of the form that already holds its neighbours.

- **Group by what it changes, not by how it looks.** A signal (a sound, a desktop banner, an e-mail
  digest) changes how the person is told — it goes to the notifications; the theme, the language and
  the time zone change how the app reads — profile preferences; what one record does goes to that
  record. Ask «what would a person open to change this?» and put it there.
- **No section for one setting.** A section with a single field joins the closest section; a new
  section starts at three related fields.
- **A stored preference is a field.** A setting with options (the theme: «Системная», «Светлая»,
  «Тёмная») is a `Select` beside its related fields in the profile form — never a `SegmentedControl`,
  which switches what a screen shows right now ([a flag, a level, a set](choosing.md#a-flag-a-level-a-set)).

```tsx partial
// bad — a section «Оформление» for the theme as a switch, and the dialog sounds next to it
<Drawer.Section label="Оформление">
  <SegmentedControl.Root label="Тема" defaultValue="system">…</SegmentedControl.Root>
  <Switch.Root><Switch.Label>Звуки диалогов</Switch.Label></Switch.Root>
</Drawer.Section>
```

```tsx good
// good — the theme is one field of the profile, the sounds live with the notifications
<>
  <Drawer.Section label="Профиль">
    <Select.Root label="Тема" defaultValue="system">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="system">Системная</Select.Item>
        <Select.Item value="light">Светлая</Select.Item>
        <Select.Item value="dark">Тёмная</Select.Item>
      </Select.Content>
    </Select.Root>
  </Drawer.Section>
  <Drawer.Section label="Уведомления">
    <Switch.Root name="dialogSounds">
      <Switch.Label>Звуки диалогов</Switch.Label>
    </Switch.Root>
  </Drawer.Section>
</>
```
