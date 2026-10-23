import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { BADGE_GROUP_LABELS } from "../badge/Badge";
import { LIST_LABELS } from "./List";

const REST_SPAN = {
  name: "…rest",
  type: "HTMLAttributes<HTMLSpanElement>",
  en: "`children`, `className` and the other span attributes.",
  ru: "`children`, `className` и остальные атрибуты span.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "List.Root",
      en: "`ref` → `HTMLUListElement`. A list of records or places built of the kit's one list row, rows 2 apart, no box of its own. With a value it is a choice; with `onReorder` its rows move. The same row stands in Sidebar, menus, Select, Timeline.",
      ru: "Список записей или мест из единой строки кита, строки на 2 друг от друга, без своей коробки. Со значением — выбор; с `onReorder` строки переставляются. Та же строка — в Sidebar, меню, Select, Timeline.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Row tier: a row 28 · 32 · 36 · 40 · 48 tall, with a description 44 · 48 · 56 · 60 · 68; text, mark and controls follow.",
          ru: "Ярус строк: строка 28 · 32 · 36 · 40 · 48, с описанием 44 · 48 · 56 · 60 · 68; текст, метка и контролы следуют за ним.",
        },
        {
          name: "value",
          type: "string | string[] | null",
          en: 'The chosen row\'s `value` (an array with `multiple`); makes the list a choice (`role="listbox"`). Controlled with `onValueChange`.',
          ru: '`value` выбранной строки (массив при `multiple`); делает список выбором (`role="listbox"`). Управляется вместе с `onValueChange`.',
        },
        {
          name: "defaultValue",
          type: "string | string[] | null",
          en: "The first choice of an uncontrolled choice.",
          ru: "Начальный выбор неуправляемого списка.",
        },
        {
          name: "onValueChange",
          type: "(value: string | string[] | null) => void",
          en: "Called with the new choice when a row is chosen or unchecked.",
          ru: "Вызывается с новым выбором, когда строку выбирают или снимают.",
        },
        {
          name: "multiple",
          type: "boolean",
          default: "false",
          en: "Several rows: a checkbox column, a checked row in the accent's soft tone. Without it one row: a check at the end, its place held on every row.",
          ru: "Несколько строк: колонка флажков, отмеченная строка — мягкий тон акцента. Без него одна строка: галочка в конце, место под неё у каждой строки.",
        },
        {
          name: "indicator",
          type: '"start" | "end"',
          default: '"start"',
          en: "Where the checkboxes of a `multiple` choice stand: before the mark or at the row's end.",
          ru: "Где стоят флажки выбора `multiple`: перед меткой или в конце строки.",
        },
        {
          name: "onReorder",
          type: "(value: string, beforeValue: string | null) => void | Promise<void>",
          en: "Rows move by their grips and Alt+arrows (each row needs a `value`); a returned promise keeps the row busy until it settles, a rejection moves it back.",
          ru: "Строки переставляются ручками и Alt+стрелками (каждой нужен `value`); возвращённый промис держит строку занятой до ответа, отказ возвращает её.",
        },
        {
          name: "handle",
          type: '"end" | "start" | "row"',
          default: '"end"',
          en: "The grip of a reorderable list: at the row's end in the controls' place, at its start, or none — the whole row is dragged.",
          ru: "Ручка списка с перестановкой: в конце строки на месте контролов, в начале или без ручки — тянется вся строка.",
        },
        {
          name: "actions",
          type: '"always" | "hover"',
          default: '"always"',
          en: "When `List.ItemActions` show: always, or on hover and keyboard focus in the row (on touch always).",
          ru: "Когда видны `List.ItemActions`: всегда или при наведении и фокусе в строке (на касании — всегда).",
        },
        {
          name: "labels",
          type: "Partial<ListLabels>",
          en: "Overrides of the grip's and the lock's names (see Labels).",
          ru: "Замена имён ручки и замка (см. «Системные строки»).",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Names the list (or `aria-labelledby` to a visible heading).",
          ru: "Имя списка (или `aria-labelledby` на видимый заголовок).",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`List.Item` and `List.Group`.",
          ru: "`List.Item` и `List.Group`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLUListElement>, "children" | "defaultValue" | "onChange">',
          en: "`className` and the other `ul` attributes.",
          ru: "`className` и остальные атрибуты `ul`.",
        },
      ],
    },
    {
      name: "List.Group",
      en: "`ref` → `HTMLLIElement`. Rows under a heading 28 tall (the caption role, muted, as in Sidebar and menus); the next group starts right after.",
      ru: "Строки под подписью высотой 28 (подпись, приглушённая, как в Sidebar и меню); следующая группа начинается сразу после.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "The heading; it names the group of rows.",
          ru: "Подпись; называет группу строк.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "The group's `List.Item`s.",
          ru: "`List.Item` группы.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLLIElement>, "children">',
          en: "`className` and the other `li` attributes.",
          ru: "`className` и остальные атрибуты `li`.",
        },
      ],
    },
    {
      name: "List.Item",
      en: "`ref` → the row element (`button`, `a`, `div` or the `asChild` element). One row: one line, or two with `List.ItemDescription`; its own controls stand beside the element, never inside.",
      ru: "Одна строка: в одну строку или в две с `List.ItemDescription`; её контролы стоят рядом с элементом строки, не внутри.",
      props: [
        {
          name: "value",
          type: "string",
          en: "The row's id: needed by a choice and by `onReorder`; also the key of the row's enter and leave.",
          ru: "Идентификатор строки: нужен выбору и `onReorder`; ещё ключ появления и ухода строки.",
        },
        {
          name: "current",
          type: "boolean",
          default: "false",
          en: 'The open record or page: a fill step, `aria-current` (`"page"` on a link, `"true"` on a button).',
          ru: 'Открытая запись или страница: шаг заливки, `aria-current` (`"page"` у ссылки, `"true"` у кнопки).',
        },
        {
          name: "onClick",
          type: "MouseEventHandler",
          en: "Makes the row a button.",
          ru: "Делает строку кнопкой.",
        },
        {
          name: "href",
          type: "string",
          en: "Makes the row a link.",
          ru: "Делает строку ссылкой.",
        },
        {
          name: "target",
          type: "string",
          en: "Link target, with `href`.",
          ru: "Цель ссылки, с `href`.",
        },
        {
          name: "rel",
          type: "string",
          en: "Link relation, with `href`.",
          ru: "Отношение ссылки, с `href`.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Renders the only child (a router link) as the row, with the parts inside it.",
          ru: "Строкой становится единственный ребёнок (ссылка роутера), части — внутри него.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Out of action: title, description, mark and meta in the disabled colour; no click, no Tab stop.",
          ru: "Недоступна: заголовок, описание, метка и мета — цветом «недоступно»; без нажатия и остановки Tab.",
        },
        {
          name: "locked",
          type: "boolean",
          default: "false",
          en: "With `onReorder`: the row holds its place — a lock in the grip's place; others cannot pass it.",
          ru: "С `onReorder`: строка стоит на месте — замок на месте ручки; другие через неё не проходят.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`List.ItemIcon`, `List.ItemText`, `List.ItemBadges`, `List.ItemDescription`, `List.ItemMeta`, `List.ItemCount`, `List.ItemActions`; loose text becomes the title.",
          ru: "`List.ItemIcon`, `List.ItemText`, `List.ItemBadges`, `List.ItemDescription`, `List.ItemMeta`, `List.ItemCount`, `List.ItemActions`; просто текст становится заголовком.",
        },
        {
          name: "…rest",
          type: "ButtonHTMLAttributes<HTMLButtonElement>",
          en: "`className`, `type` and the other attributes of the row element.",
          ru: "`className`, `type` и остальные атрибуты элемента строки.",
        },
      ],
    },
    {
      name: "List.ItemIcon",
      en: "`ref` → `HTMLSpanElement`. The mark: an `Icon` bare beside one line, on a tile beside a description; an `Avatar.Root`, a `ProgressCircle` or a `Thumbnail.Root` sized under the row; a `Badge.Dot`. After the text, a trailing glyph.",
      ru: "Метка: `Icon` голая в строке без описания, на плитке рядом с описанием; `Avatar.Root`, `ProgressCircle` или `Thumbnail.Root` размера строки; `Badge.Dot`. После текста — замыкающий значок.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          en: "The tile's colour beside a description, when it means something; neutral by default.",
          ru: "Цвет плитки рядом с описанием, когда он что-то значит; по умолчанию нейтральная.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "One `Icon`, `Avatar.Root`, `ProgressCircle`, `Thumbnail.Root` or `Badge.Dot`; a mark without its own `size` takes the row's.",
          ru: "Один `Icon`, `Avatar.Root`, `ProgressCircle`, `Thumbnail.Root` или `Badge.Dot`; метка без своего `size` берёт размер строки.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "List.ItemText",
      en: "`ref` → `HTMLSpanElement`. The title: weight 500, one line cut with an ellipsis; beside badges it gives way first, down to its text or 8em.",
      ru: "Заголовок: вес 500, одна строка с многоточием; рядом с бейджами уступает первым — до своего текста или 8em.",
      props: [
        {
          name: "number",
          type: "ReactNode",
          en: "The record's number after the title («#4821»): muted, figures in columns, never cut.",
          ru: "Номер записи после заголовка («#4821»): приглушённый, табличные цифры, не обрезается.",
        },
        REST_SPAN,
      ],
    },
    {
      name: "List.ItemBadges",
      en: "`ref` → `HTMLDivElement`. The record's badges on the title's line, as tall as it, always whole: what does not fit folds into «+N».",
      ru: "Бейджи записи на строке заголовка, высотой в неё, всегда целиком: что не влезло — в «+N».",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "`Badge.Root`s; the meaning is the badge's `tone` or `color`.",
          ru: "`Badge.Root`; смысл — в `tone` или `color` бейджа.",
        },
        {
          name: "labels",
          type: "Partial<BadgeGroupLabels>",
          en: "Overrides of the «+N» texts (see Labels).",
          ru: "Замена текстов «+N» (см. «Системные строки»).",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "List.ItemDescription",
      en: "`ref` → `HTMLSpanElement`. The line under the title, muted, one line; a `StatusDot` first, the rest after «·». Makes the row two lines.",
      ru: "Строка под заголовком, приглушённая, одна; `StatusDot` первым, остальное после «·». Делает строку двухстрочной.",
      props: [REST_SPAN],
    },
    {
      name: "List.ItemMeta",
      en: "`ref` → `HTMLSpanElement`. A time, a date or a value at the end, figures in columns; beside a description it stands over the count.",
      ru: "Время, дата или значение в конце, табличные цифры; рядом с описанием — над счётчиком.",
      props: [REST_SPAN],
    },
    {
      name: "List.ItemCount",
      en: "`ref` → `HTMLSpanElement` (the number or the Badge). A count at the end: a plain muted number; a `Badge` as tall as the title's line when `color` or `variant` asks for attention.",
      ru: "Счётчик в конце: простое приглушённое число; `Badge` высотой в строку заголовка, когда `color` или `variant` просит внимания.",
      props: [
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          en: "Badge hue: something new needs attention.",
          ru: "Цвет бейджа: новое требует внимания.",
        },
        {
          name: "variant",
          type: '"solid" | "soft" | "outline"',
          en: "Badge treatment; `soft` once `color` is set.",
          ru: "Подача бейджа; `soft`, если задан только `color`.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The number.",
          ru: "Число.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "List.ItemActions",
      en: "`ref` → `HTMLDivElement`. The row's own controls beside its element: Buttons as tall as the row minus 8 (a tier down beside a description), soft; ghost beside a Switch, which ends the row.",
      ru: "Контролы строки рядом с её элементом: кнопки высотой «строка минус 8» (рядом с описанием — ярус ниже), soft; рядом с Switch — ghost, Switch последним.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (controls, each with its own name), `className` and the other div attributes.",
          ru: "`children` (контролы, у каждого своё имя), `className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: labelRows(LIST_LABELS, {
    reorderItem: {
      en: "`aria-label` of a row's grip (`onReorder`); `{label}` is the row's title.",
      ru: "`aria-label` ручки строки (`onReorder`); `{label}` — заголовок строки.",
    },
    lockedItem: {
      en: "Name of the lock a `locked` row shows in the grip's place; `{label}` is the row's title.",
      ru: "Имя замка, который строка с `locked` показывает на месте ручки; `{label}` — заголовок строки.",
    },
  }).concat(
    labelRows(BADGE_GROUP_LABELS, {
      more: {
        en: "Visible text of the «+N» badge for the badges that did not fit; `{count}` — how many.",
        ru: "Видимый текст бейджа «+N» для не поместившихся бейджей; `{count}` — сколько их.",
        part: "List.ItemBadges",
      },
      moreCount: {
        en: "What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip.",
        ru: "Что читают ассистивные технологии вместо видимого текста этого бейджа; `{count}` — сколько. Сами значения — в его подсказке.",
        part: "List.ItemBadges",
      },
    }),
  ),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves between rows and their controls as the row reads; a choice is one stop.",
        ru: "Переводит по строкам и их контролам в порядке чтения; выбор — одна остановка.",
        native: true,
      },
      {
        keys: "Enter · Space",
        en: "Opens the record (a link row takes Enter only); in a choice, checks or unchecks the row.",
        ru: "Открывает запись (строка-ссылка — только Enter); в выборе отмечает строку или снимает отметку.",
      },
      {
        keys: "↑ · ↓ · Home · End",
        en: "In a choice, moves between the options; they stop at the ends.",
        ru: "В выборе переводит между вариантами; на концах останавливаются.",
      },
      {
        keys: "Alt + ↑ · Alt + ↓",
        en: "With `onReorder`, moves the row one place (from its grip or the row); a `locked` row does not move, and a step over one is refused aloud.",
        ru: "С `onReorder` переносит строку на место выше или ниже (с ручки или строки); строка с `locked` не двигается, шаг через неё не делается и объявляется.",
      },
    ],
    aria: [
      {
        en: "`<ul>` named by `aria-label`; each row is an `<li>` with a button, a link or a plain box. With a value the list is a `listbox` (`aria-multiselectable` with `multiple`) of `option`s with `aria-selected`.",
        ru: "`<ul>` с именем из `aria-label`; каждая строка — `<li>` с кнопкой, ссылкой или простым блоком. Со значением список — `listbox` (`aria-multiselectable` при `multiple`) из `option` с `aria-selected`.",
      },
      {
        en: 'The open record: `aria-current="page"` on a link, `"true"` on a button. A checked row is never told by its tone alone: the checkbox or the check says it.',
        ru: 'Открытая запись: `aria-current="page"` у ссылки, `"true"` у кнопки. Отмеченная строка не передаётся только цветом: это говорит флажок или галочка.',
      },
      {
        en: "The row's name is its title, number, badges, description, meta and count; a mark is `aria-hidden`, a `ProgressCircle` keeps its name.",
        ru: "Имя строки — заголовок, номер, бейджи, описание, мета и счётчик; метка — `aria-hidden`, `ProgressCircle` сохраняет своё имя.",
      },
      {
        en: "`List.ItemActions` stand beside the row element: the row's name stays its text. A row without its own action toggles its Switch on a click anywhere; the Switch keeps the keyboard and its name.",
        ru: "`List.ItemActions` стоят рядом с элементом строки: имя строки — её текст. Строка без своего действия переключает свой Switch по щелчку в любом месте; клавиатура и имя — у Switch.",
      },
      {
        en: 'With `onReorder` each row gets a grip named «Переместить {label}» (`labels.reorderItem`); a `locked` row a lock `role="img"` named «{label}: закреплено». The new place is announced politely.',
        ru: 'С `onReorder` у каждой строки ручка «Переместить {label}» (`labels.reorderItem`); у строки с `locked` — замок `role="img"` «{label}: закреплено». Новое место объявляется вежливо.',
      },
    ],
  },
};
