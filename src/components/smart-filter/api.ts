import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { SMART_FILTER_LABELS } from "./SmartFilter";

export const api: ComponentApi = {
  parts: [
    {
      name: "SmartFilter.Root",
      en: "No DOM, no ref. The value, the search and the panel state shared by its parts; the host places the parts.",
      ru: "Значение, поиск и состояние панели, общие для частей; своего DOM нет, части расставляет контейнер.",
      props: [
        {
          name: "fields",
          type: "readonly SmartFilterField[]",
          required: true,
          en: "Fields of this screen, in display order; empty — only the search. Pass a stable reference.",
          ru: "Поля экрана в порядке показа; пусто — остаётся только поиск. Передавайте стабильную ссылку.",
        },
        {
          name: "value",
          type: "SmartFilterValue",
          en: "Value per field key, controlled: `{ include, exclude }` for an options field, `{ from, to }` (numbers or dates, `null` — open) for a range field.",
          ru: "Значение по ключам полей, управляемо: `{ include, exclude }` у поля значений, `{ from, to }` (числа или даты, `null` — без границы) у поля диапазона.",
        },
        {
          name: "defaultValue",
          type: "SmartFilterValue",
          default: "{}",
          en: "Initial selection, uncontrolled.",
          ru: "Начальный выбор без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: SmartFilterValue) => void",
          en: "The whole next value; keys of fields this root does not show are kept.",
          ru: "Всё новое значение; ключи полей, которых нет в этом корне, сохраняются.",
        },
        {
          name: "search",
          type: "string",
          en: "The query the list is searched by, controlled: the field's text while typing, then the pinned query of the search chip.",
          ru: "Запрос, по которому ищется список, управляемо: текст поля при вводе, затем закреплённый запрос тега поиска.",
        },
        {
          name: "defaultSearch",
          type: "string",
          default: '""',
          en: "Initial query, uncontrolled; a non-empty one starts pinned as the search chip.",
          ru: "Начальный запрос без контроля; непустой сразу закреплён тегом поиска.",
        },
        {
          name: "onSearchChange",
          type: "(search: string) => void",
          en: "Every keystroke while no query is pinned, then on Enter only when the query changes, and on the chip's ×; debounce in the owner when it asks a server.",
          ru: "Каждое нажатие, пока запрос не закреплён, затем по Enter — только при новом запросе, и по × тега; при запросах к серверу ставьте задержку у владельца.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the filter button, the search, the tags and the panel. Without it the tier of its host, else `m`.",
          ru: "Ярус кнопки фильтра, поиска, тегов и панели. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "collapsedLimit",
          type: "number",
          default: "12",
          en: "Values of one field shown before «Ещё N» (not while searching).",
          ru: "Сколько значений поля видно до «Ещё N» (кроме поиска).",
        },
        {
          name: "labels",
          type: "Partial<SmartFilterLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "`SmartFilter.Toolbar` and `SmartFilter.Chips`, anywhere inside — in a page bar the Root wraps `Page.Root`.",
          ru: "`SmartFilter.Toolbar` и `SmartFilter.Chips` в любом месте внутри — в полосе страницы Root оборачивает `Page.Root`.",
        },
      ],
    },
    {
      name: "SmartFilter.Toolbar",
      en: "`ref` → `HTMLDivElement`. A `<div>`: the search Input, then the filter — a Button beside it or a section at the field's end — with a count Badge; only its icon and count when narrow. Empty `fields` — the search alone. The anchor of the panel, a flush Popover.",
      ru: "`<div>`: поле поиска, затем фильтр — кнопка рядом или секция в конце поля — с Badge-счётчиком; в узкой ширине только иконка и счётчик. Пустые `fields` — только поиск. Якорь панели — Popover без внутренних отступов.",
      props: [
        {
          name: "searchable",
          type: "boolean",
          default: "true",
          en: "The search input. `false` — the filter button alone; the panel opens at its own width (24rem at most) and lists every field.",
          ru: "Поле поиска. `false` — только кнопка фильтра; панель открывается своей ширины (не шире 24rem) и показывает все поля.",
        },
        {
          name: "layout",
          type: '"split" | "combined"',
          default: '"split"',
          en: "Where the filter stands: `split` — a Button beside the search; `combined` — a section at the end of the search field, after a faint line, always shown. Needs `searchable`: without it, the plain button.",
          ru: "Где стоит фильтр: `split` — кнопка рядом с поиском; `combined` — секция в конце поля поиска после тонкого разделителя, видна всегда. Нужен `searchable`: без него — обычная кнопка.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the toolbar.",
          ru: "`className` и остальные атрибуты панели инструментов.",
        },
      ],
    },
    {
      name: "SmartFilter.Chips",
      en: "`ref` → `HTMLDivElement`. A `<div>`: the pinned search first, then the applied filters, as removable Badges, with «+ Фильтр» and «Сбросить все»; renders nothing without either.",
      ru: "`<div>`: сначала закреплённый поиск, затем применённые фильтры — удаляемые Badge — и кнопки «+ Фильтр», «Сбросить все»; без них ничего не рендерит.",
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the chips row.",
          ru: "`className` и остальные атрибуты ряда тегов.",
        },
      ],
    },
  ],
  types: [
    {
      name: "SmartFilterField",
      en: "One entry of `fields`: data, not a part. Selected values missing from `options` stay visible so they can be removed.",
      ru: "Один элемент `fields`: данные, а не часть. Выбранные значения, которых нет в `options`, остаются видны, чтобы их можно было убрать.",
      fields: [
        {
          name: "key",
          type: "string",
          required: true,
          en: "Key of the field in the value.",
          ru: "Ключ поля в значении.",
        },
        {
          name: "label",
          type: "string",
          required: true,
          en: "Field name in the panel and the chips.",
          ru: "Название поля в панели и тегах.",
        },
        {
          name: "kind",
          type: '"options" | "range" | "date-range"',
          default: '"options"',
          en: "`options` — values to show or hide; `range` — a number range in two Inputs; `date-range` — a period in the kit Datepicker. A range is one filter and one chip.",
          ru: "`options` — значения, которые показывают или скрывают; `range` — числовой диапазон в двух Input; `date-range` — период в Datepicker набора. Диапазон — один фильтр и один тег.",
        },
        {
          name: "options",
          type: "{ value: string; label: string; icon?: ReactNode; group?: string }[]",
          required: true,
          en: "`options` fields: values; `icon` is a decorative kit Icon before the label; values with one `group` stay together under that heading, groups in the order they first appear.",
          ru: "Поля `options`: значения; `icon` — декоративная иконка набора перед подписью; значения одной `group` стоят вместе под её заголовком, группы — в порядке первого появления.",
        },
        {
          name: "finite",
          type: "boolean",
          default: "true",
          en: "`options` fields: a fixed set — hiding every value is refused. `false` for an open set (services, users).",
          ru: "Поля `options`: фиксированный набор — скрыть все значения нельзя. `false` — для открытого набора (сервисы, пользователи).",
        },
        {
          name: "multiple",
          type: "boolean",
          default: "true",
          en: "`options` fields: many values at once. `false` — one value and no hiding: a press picks only that value, a second press clears it (an API that takes one value per field).",
          ru: "Поля `options`: несколько значений сразу. `false` — одно значение и без скрытия: нажатие выбирает только его, повторное — снимает (API принимает одно значение на поле).",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          defaultNote: { en: "Russian digit groups", ru: "русские группы разрядов" },
          en: "`range` fields: a bound in the chip («1 000 ₽»).",
          ru: "Поля `range`: граница в теге («1 000 ₽»).",
        },
        {
          name: "calendar",
          type: 'Pick<DatepickerPanelProps, "months" | "presets" | "prompt" | "footer" | "withTime" | "isDayDisabled" | "disableFuture" | "today" | "locale" | "weekStartsOn" | "labels">',
          en: "`date-range` fields: the calendar of the period, as on a report's own Datepicker — `presets`, `months`, `prompt`, `footer`, `withTime`; the chip names a matching preset («Период: Этот месяц»). Without it the panel opens one month with no presets.",
          ru: "Поля `date-range`: календарь периода, как у Datepicker самого отчёта — `presets`, `months`, `prompt`, `footer`, `withTime`; тег называет совпавший пресет («Период: Этот месяц»). Без него панель открывает один месяц без пресетов.",
        },
      ],
    },
  ],
  functions: [
    {
      name: "matchesSmartFilter(entry, item)",
      type: "(entry: SmartFilterFieldValue | undefined, item: string | number | Date | null | undefined) => boolean",
      en: "Checks one item's value against a field's entry on the client; an empty entry matches everything.",
      ru: "Проверяет значение одной записи по условию поля на клиенте; пустое условие пропускает всё.",
    },
    {
      name: "resolveSmartFilterValues(entry, all)",
      type: "(entry: SmartFilterFieldValue | undefined, all: readonly string[]) => string[]",
      en: "Turns a fixed field's entry into the list of values to ask a server for.",
      ru: "Превращает условие фиксированного поля в список значений для запроса к серверу.",
    },
    {
      name: "isSmartFilterRange(entry)",
      type: "(entry: SmartFilterFieldValue | undefined) => entry is SmartFilterRange<number> | SmartFilterRange<Date>",
      en: "Tells a range entry from a selection.",
      ru: "Отличает условие-диапазон от выбора.",
    },
  ],
  labels: labelRows(SMART_FILTER_LABELS, {
    filter: { en: "Filter button and panel name.", ru: "Кнопка фильтра и имя панели." },
    searchPlaceholder: {
      en: "Placeholder and name of the search.",
      ru: "Плейсхолдер и имя поиска.",
    },
    clearSearch: { en: "Name of the search clear button.", ru: "Имя кнопки очистки поиска." },
    searchChip: {
      en: "Text of the search chip, the pinned query.",
      ru: "Текст тега поиска — закреплённый запрос.",
      part: "SmartFilter.Chips",
    },
    removeSearch: {
      en: "Name of the search chip's remove button.",
      ru: "Имя кнопки удаления тега поиска.",
      part: "SmartFilter.Chips",
    },
    searchCommitted: {
      en: "Announced when Enter pins a query.",
      ru: "Объявляется, когда Enter закрепляет запрос.",
    },
    searchText: {
      en: "The text search row while typing.",
      ru: "Строка текстового поиска при вводе.",
    },
    noMatches: {
      en: "Fields with nothing found while typing (compact EmptyPage).",
      ru: "Поля без совпадений при вводе (компактный EmptyPage).",
    },
    reset: {
      en: "Panel footer reset, shown while a filter is set.",
      ru: "Сброс в подвале панели, пока задан фильтр.",
    },
    more: { en: "Collapsed values of a field.", ru: "Свёрнутые значения поля." },
    add: { en: "Chips row: opens the panel.", ru: "Ряд тегов: открывает панель." },
    clearAll: {
      en: "Chips row: clears every field and the search.",
      ru: "Ряд тегов: сбрасывает все поля и поиск.",
    },
    showValue: { en: "Title of a value.", ru: "Подсказка значения." },
    hideValue: { en: "Name of the «−» of a value.", ru: "Имя «−» у значения." },
    unhideValue: { en: "Name of the «−» of a hidden value.", ru: "Имя «−» у скрытого значения." },
    not: { en: "Prefix of a hidden value.", ru: "Префикс скрытого значения." },
    chipInclude: { en: "Text of a «show» tag.", ru: "Текст тега «показать»." },
    chipExclude: { en: "Text of a «hide» tag.", ru: "Текст тега «скрыть»." },
    remove: { en: "Name of a tag's remove button.", ru: "Имя кнопки удаления тега." },
    from: {
      en: "Placeholder of a range's lower bound.",
      ru: "Плейсхолдер нижней границы диапазона.",
    },
    to: {
      en: "Placeholder of a range's upper bound.",
      ru: "Плейсхолдер верхней границы диапазона.",
    },
    fromLabel: {
      en: "Accessible name of the lower bound input.",
      ru: "Доступное имя поля нижней границы.",
    },
    toLabel: {
      en: "Accessible name of the upper bound input.",
      ru: "Доступное имя поля верхней границы.",
    },
    rangeFrom: {
      en: "Chip value of a range with only the lower bound.",
      ru: "Значение тега диапазона только с нижней границей.",
    },
    rangeTo: {
      en: "Chip value of a range with only the upper bound.",
      ru: "Значение тега диапазона только с верхней границей.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "From the search to the filter control — the button beside it, or the section at the field's end (`combined`).",
        ru: "Из поиска к фильтру — кнопке рядом или секции в конце поля (`combined`).",
        native: true,
      },
      {
        keys: "Enter · Space",
        en: "On the filter control, opens or closes the panel.",
        ru: "На фильтре открывают или закрывают панель.",
        native: true,
      },
      {
        keys: "Escape",
        en: "In the panel, closes it and returns focus to the filter control.",
        ru: "В панели закрывает её и возвращает фокус на фильтр.",
      },
      {
        keys: "Tab",
        en: "Moves through the panel values and their «−» (shown on focus).",
        ru: "Переходит по значениям панели и их «−» (появляется при фокусе).",
      },
      {
        keys: "Enter · Space",
        en: "Shows only this value; pressing again clears it.",
        ru: "Показывает только это значение; повтор снимает выбор.",
      },
      { keys: "Shift + Enter", en: "Hides the value.", ru: "Скрывает значение." },
      {
        keys: "Enter",
        en: "In the search, pins the typed query as the search chip and empties the field (the panel stays for the filters); in an empty field, closes the panel.",
        ru: "В поле поиска закрепляет запрос тегом поиска и очищает поле (панель остаётся для фильтров); в пустом поле закрывает панель.",
      },
      {
        keys: "Escape",
        en: "In the search, clears the typed text (never the pinned query); in an empty field, closes the panel.",
        ru: "В поле поиска стирает набранный текст (не закреплённый запрос); в пустом поле закрывает панель.",
      },
    ],
    aria: [
      {
        en: "A pinned query is said by a polite live region (`labels.searchCommitted`); the search chip's × is named by `labels.removeSearch` («Убрать поиск «Евгений»»).",
        ru: "Закреплённый запрос объявляется вежливой live-областью (`labels.searchCommitted`); × тега поиска называется `labels.removeSearch` («Убрать поиск «Евгений»»).",
      },
      {
        en: 'The filter control — the button, or the field\'s section (a `<button>` after the search input, never inside it) — has `aria-expanded` and `aria-haspopup="dialog"` and is named by `labels.filter` and the count; the panel is a non-modal `role="dialog"` named by a visually hidden `labels.filter` title.',
        ru: 'Фильтр — кнопка или секция поля (`<button>` после поля ввода, не внутри него) — `aria-expanded`, `aria-haspopup="dialog"`, имя из `labels.filter` и счётчика; панель — немодальный `role="dialog"` со скрытым заголовком `labels.filter`.',
      },
      {
        en: "Values are toggle buttons with `aria-pressed`; the «−» has its own name (`labels.hideValue` / `labels.unhideValue`); a hidden value carries the «НЕ» text, so meaning is never in color alone.",
        ru: "Значения — переключатели с `aria-pressed`; у «−» своё имя (`labels.hideValue` / `labels.unhideValue`); скрытое значение несёт текст «НЕ», смысл не только в цвете.",
      },
      {
        en: 'Fields with nothing found are announced through `role="status"`.',
        ru: 'Поля без совпадений при поиске объявляются через `role="status"`.',
      },
      {
        en: "Range bounds are inputs named by `labels.fromLabel` / `labels.toLabel` («Сумма, от»); an inverted range marks both `aria-invalid`. A date range is the Datepicker field named by the field label.",
        ru: "Границы диапазона — поля ввода с именами `labels.fromLabel` / `labels.toLabel` («Сумма, от»); перевёрнутый диапазон помечает оба `aria-invalid`.",
      },
      {
        en: 'An option group is a `role="group"` named by its `group`.',
        ru: 'Группа значений — `role="group"` с именем из `group`.',
      },
      {
        en: "Every filter tag has a remove button named by `labels.remove`.",
        ru: "Каждый тег фильтра удаляется кнопкой с именем `labels.remove`.",
      },
    ],
  },
};
