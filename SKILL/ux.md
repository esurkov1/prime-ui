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
| One record of 2–4 short fields in a form | one row of fields | an `auto-fit` grid |
| Records of one shape a person adds, edits, removes | one row per record, the headings once above | `FieldList` |
| Records of one shape a person reads, sorts, filters | a table | `DataTable` |
| One value in several units or currencies (a deposit in ₽, $, ฿) | the fields side by side in one row under one heading, the unit in each field | `Input.InlineAffix` |
| A base value and its overrides (a price and its changes by month) | one list: the base is the first, pinned row | `FieldList` `getLocked` |
| Small attributes of a record (an icon, a color, a flag) | compact controls in the record's row, not fields of their own | icon-only `Select`, `ColorPresets`, `Checkbox` |
| Short texts in an order the person sets | one column, a handle per row | `FieldList` `reorderable` |
| Settings that most people never touch | behind a disclosure, after the common ones | `Accordion`, a «Дополнительно» section |
| A choice of 2–5 options | all visible | `Radio.Group`, `SegmentedControl` |
| A choice of 6+ options | a list that opens | `Select` |
| Many values picked from options | tags | `TagSelect` |

One record is one row or one block, never half a record per line. If a record does not fit one
row, it is not a row: open it in a `Drawer`.

## 3. Label economy

Every word on screen must carry something the person does not see already.

- **A label once per column, not per row.** Records in rows have their headings above the first
  row only (`FieldList` draws them and names every field by its heading for screen readers).
- **No numbered labels.** «Преимущество 1», «Преимущество 2» repeat the heading and count what the
  list already counts. The list label names the rows.
- **No label that repeats its heading.** A field «Цена» inside the section «Цена» needs no label of
  its own beyond what the section says; a group of one field is the field.
- **A unit lives in one place.** In the field (`Input.InlineAffix`) or in the heading, never both.
  Prefer the field: the unit stays beside the number when the row stacks.
- **No text that explains the layout.** «Двигатель, места и скорость всегда первыми» — the lock on
  those rows says it. A hint says what the person cannot see (a format, a consequence, a limit).
- **One name per thing.** The same action, entity and status keep one word on the whole screen
  (and across screens): «Счёт», not «Счёт» in the title and «Инвойс» in the button.
- **Count the labels.** On a form of repeating rows, labels on screen ≤ number of columns + the
  list label. More means a layout bug.

## 4. Words

The kit's UI language is Russian; these are the rules of its copy.

- **Buttons say the verb and the object:** «Выставить счёт», «Добавить позицию», «Удалить проект».
  Never «ОК», «Да», «Подтвердить», «Отправить» without an object when the object is not obvious.
- **A confirm names the thing and the loss:** «Удалить проект «Север»? Задачи и файлы удалятся
  без возможности восстановления.» — not «Вы уверены?».
- **An error says how to fix it:** «Формат: +7 912 404-18-20», «Не больше 2 000 символов» — not
  «Неверное значение», «Ошибка».
- **An empty state says what to do next** and offers it: «Счетов пока нет» + «Выставить счёт». A
  filtered empty state offers to reset the filter.
- **Sentence case** everywhere: «Новый счёт», not «Новый Счёт».
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
| One standalone action that is easy to redo by hand | `Button.Root holdToConfirm` |
| Irreversible loss of work, or a weighty outward action (send an invoice) | `ConfirmDialog` that names the thing and the loss |
| Bulk destructive | `ConfirmDialog` that names the count («Удалить 12 счетов?») |
| Leaving a form with changes | `Modal.Guard` / `Drawer.Guard dirty` |

A confirm on every action trains people to click through it; the one that mattered is then missed.

## 6. Nothing to guess

- **A disabled control says why** when the reason is not on screen: a `hint` under the field, a
  line beside the button («Не больше 3», as `FieldList` does at `max`), a `Tooltip` on a wrapper.
  An action a person may never take (no permission) is hidden, not disabled.
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
  `autoComplete` for personal data, `Datepicker` for a date, `Select` for a closed list. A free text
  field for a closed set of values is a bug.
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

- **Both themes**, **1280 px and 375 px** wide, and the narrow container of every panel.
- **Count:** labels on a form of rows (§3), primary buttons per area (one), sizes per row (one).
- **Read every text aloud:** a word that repeats its neighbour, a hint that explains the layout, a
  button without an object — remove or rewrite it.
- **Fill it badly:** the longest real name, an empty list, an error on every field, the slowest
  load. Nothing overflows, jumps or flips.
