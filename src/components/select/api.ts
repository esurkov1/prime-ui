import { type ApiProp, type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { SELECT_LABELS } from "./Select";

const spanRest: ApiProp = {
  name: "…rest",
  type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
  en: "`className` and the other span attributes.",
  ru: "`className` и остальные атрибуты span.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "Select.Root",
      en: "`ref` → `HTMLDivElement`. The field frame (label row · control · support row) holding the value, the open state and the search query.",
      ru: "Поле целиком: подпись, контрол, строка поддержки; хранит значение, открытие и поиск.",
      props: [
        {
          name: "value",
          type: "string | string[]",
          en: "Controlled value; `string[]` with `multiple`.",
          ru: "Управляемое значение; `string[]` при `multiple`.",
        },
        {
          name: "defaultValue",
          type: "string | string[]",
          en: "Initial value, uncontrolled.",
          ru: "Начальное значение без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void | Promise<void> · (value: string[]) => void | Promise<void>",
          en: 'The picked value (`""` after clearing) or, with `multiple`, the new list. A promise: the value shows at once with a trigger Spinner, picks wait; reject rolls back and announces `labels.changeFailed`.',
          ru: 'Выбранное значение (`""` после очистки) или новый список при `multiple`. Обещание: значение встаёт сразу со спиннером, выборы ждут; отказ возвращает прежнее и объявляет `labels.changeFailed`.',
        },
        {
          name: "multiple",
          type: "boolean",
          default: "false",
          en: "Several values: checkboxes in the list, the list stays open on a pick, labels joined in the trigger.",
          ru: "Несколько значений: чекбоксы в списке, список не закрывается, подписи через запятую.",
        },
        {
          name: "open",
          type: "boolean",
          en: "Controlled open state of the list.",
          ru: "Открытие списка, управляемо.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial open state, uncontrolled.",
          ru: "Начальное открытие без контроля.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Called on every open and close: trigger, pick, Escape, an outside press.",
          ru: "Вызывается при каждом открытии и закрытии: триггер, выбор, Escape, нажатие снаружи.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Field label above; names the trigger.",
          ru: "Подпись над полем; даёт имя триггеру.",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Support text under the field; linked by `aria-describedby`.",
          ru: "Подсказка под полем; связана через `aria-describedby`.",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Error message; replaces the hint and implies `invalid`.",
          ru: "Ошибка; заменяет подсказку и включает `invalid`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label and `aria-required` on the trigger.",
          ru: "Красная `*` после подписи и `aria-required` на триггере.",
        },
        {
          name: "optional",
          type: "boolean",
          en: "Muted `labels.optional` after the label.",
          ru: "Приглушённое `labels.optional` после подписи.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "Danger inset ring and `aria-invalid`.",
          ru: "Красное внутреннее кольцо и `aria-invalid`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disabled field; the list never opens.",
          ru: "Неактивное поле; список не открывается.",
        },
        {
          name: "search",
          type: "string",
          en: "Controlled search query (`Select.Content searchable`); together with `onSearchChange`. Cleared when the list closes.",
          ru: "Управляемый поисковый запрос (`Select.Content searchable`); вместе с `onSearchChange`. Сбрасывается при закрытии списка.",
        },
        {
          name: "defaultSearch",
          type: "string",
          default: '""',
          en: "Initial query, uncontrolled.",
          ru: "Начальный запрос без контроля.",
        },
        {
          name: "onSearchChange",
          type: "(search: string) => void",
          en: 'Called with the new query: typing, and `""` when the list closes. Load the matching options here for a server search.',
          ru: 'Вызывается с новым запросом: ввод и `""` при закрытии. Здесь загружайте подходящие пункты для поиска на сервере.',
        },
        {
          name: "filter",
          type: "boolean",
          default: "true",
          en: "The list filters its items by the query. `false` when the options come from a server: every item shows, the query is still marked in the labels.",
          ru: "Список сам фильтрует пункты по запросу. `false`, когда пункты приходят с сервера: показываются все, совпадение в подписи всё равно выделяется.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "Options are loading: a Spinner instead of the chevron, `aria-busy`, skeleton rows in the list while no item matches; items already on screen stay.",
          ru: "Пункты загружаются: спиннер вместо шеврона, `aria-busy`, строки-скелеты в списке, пока нет ни одного пункта; уже показанные пункты остаются.",
        },
        {
          name: "loadingMore",
          type: "boolean",
          default: "false",
          en: "More options are loading at the end: skeleton rows after the items.",
          ru: "Догружаются следующие пункты: строки-скелеты после пунктов.",
        },
        {
          name: "hasMore",
          type: "boolean",
          default: "false",
          en: "More options exist: reaching the end of the list calls `onLoadMore`.",
          ru: "Есть ещё пункты: конец списка вызывает `onLoadMore`.",
        },
        {
          name: "onLoadMore",
          type: "() => void | Promise<void>",
          en: "Called once per round with `hasMore` when the end of the list scrolls into view or the highlight reaches the last option; set `loadingMore` while it runs.",
          ru: "Вызывается один раз за порцию при `hasMore`, когда конец списка прокручен в видимую область или подсветка дошла до последнего пункта; на время загрузки ставьте `loadingMore`.",
        },
        {
          name: "loadError",
          type: "ReactNode",
          en: 'The options failed to load: the message replaces the list in `role="alert"`. Not the field `error` (validation).',
          ru: 'Пункты не загрузились: сообщение вместо списка с `role="alert"`. Не путать с `error` поля (проверка).',
        },
        {
          name: "onRetry",
          type: "() => void",
          en: "A retry button (`labels.retry`) under `loadError`; Enter in the open list runs it too.",
          ru: "Кнопка «Повторить» (`labels.retry`) под `loadError`; Enter в открытом списке тоже её вызывает.",
        },
        {
          name: "clearable",
          type: "boolean",
          default: "false",
          en: "A clear segment before the chevron while a value is set; `Delete` / `Backspace` on the trigger clear too.",
          ru: "Сегмент очистки перед шевроном, пока есть значение; `Delete` / `Backspace` на триггере тоже очищают.",
        },
        {
          name: "name",
          type: "string",
          en: 'Form field name: hidden inputs submit the value (`""` while empty; one input per value with `multiple`).',
          ru: "Имя поля формы: скрытые input отправляют значение (пустая строка без выбора; по одному на значение при `multiple`).",
        },
        {
          name: "placeholder",
          type: "string",
          en: "Text in the trigger while nothing is picked.",
          ru: "Текст в триггере, пока ничего не выбрано.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Field tier: trigger height, padding, text; the list rows, the label and the hint follow it.",
          ru: "Ярус поля: высота, отступы, текст; строки списка, подпись и подсказка следуют ему.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides the visual focus ring (`data-focus-ring="false"`), never focus or the error ring.',
          ru: "`false` скрывает кольцо фокуса, но не фокус и не кольцо ошибки.",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the trigger; generated when omitted.",
          ru: "Id триггера; без него генерируется.",
        },
        {
          name: "labels",
          type: "Partial<SelectLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Trigger and Content.",
          ru: "Trigger и Content.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control).",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля (правило корня поля: `className`, `ref` и остальное → рамка, `id` → контрол).",
        },
      ],
    },
    {
      name: "Select.Trigger",
      en: '`ref` → `HTMLButtonElement`. `<button role="combobox">` with the value, the clear segment and the chevron (a Spinner while `loading`). + native button props (`onFocus`, `onBlur`, `onKeyDown`… reach the button).',
      ru: 'Кнопка `role="combobox"`: значение, сегмент очистки и шеврон (спиннер при загрузке).',
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "`Select.TriggerIcon`, `Select.Value`, optionally a Badge after it. A `Select.TriggerIcon` alone makes an icon-only trigger (the value read, not shown).",
          ru: "`Select.TriggerIcon`, `Select.Value`, при необходимости Badge после него. Один `Select.TriggerIcon` — триггер только с иконкой (значение читается, но не видно).",
        },
      ],
    },
    {
      name: "Select.Value",
      en: "`ref` → `HTMLSpanElement`. The picked label (labels joined with `multiple`) with an ellipsis, or the placeholder.",
      ru: "Выбранная подпись (через запятую при `multiple`) или плейсхолдер.",
      props: [
        {
          name: "renderValue",
          type: "(item: { value: string; label: string }) => ReactNode",
          en: "Single mode: draws the picked option in the trigger with the same parts as the row (Avatar, ItemText, Badge…); not called while empty.",
          ru: "Одиночный выбор: рисует выбранный пункт в триггере теми же частями, что и строку (Avatar, ItemText, Badge…); без значения не вызывается.",
        },
        spanRest,
      ],
    },
    {
      name: "Select.TriggerIcon · Select.ItemIcon",
      en: "`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` with a leading glyph at the tier icon size: before the value / before the option label. + native `<span>` props.",
      ru: "Иконка в начале триггера / пункта по размеру яруса; скрыта от скринридеров.",
      props: [],
    },
    {
      name: "Select.Content",
      en: '`ref` → `HTMLDivElement` (the panel). Portal + the floating list panel with the search row, the `role="listbox"`, the empty and load states. Closed, the items render hidden so the trigger knows their labels. Below 640px it is a bottom sheet.',
      ru: "Портал и панель списка; смонтирована и в закрытом виде, чтобы триггер знал подписи. Уже 640px экрана панель становится шторкой снизу: подложка, ручка, закрытие свайпом вниз, прокрутка страницы заблокирована.",
      props: [
        {
          name: "searchable",
          type: "boolean",
          default: "false",
          en: "A search field on top; items filter by label, description and `keywords` — or the owner loads them by the query (`search`, `filter={false}` on Root).",
          ru: "Поле поиска сверху; пункты фильтруются по подписи, описанию и `keywords` — или владелец загружает их по запросу (`search`, `filter={false}` на Root).",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Items, groups, separators; `Select.Action` children stand under the list.",
          ru: "Пункты, группы, разделители; `Select.Action` встаёт под списком.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children" | "hidden" | "onKeyDown" | "onAnimationEnd">',
          en: "`className` and the other attributes of the panel.",
          ru: "`className` и остальные атрибуты панели.",
        },
      ],
    },
    {
      name: "Select.Item",
      en: '`ref` → `HTMLDivElement`. `role="option"` with `aria-selected`; a check on the end (single) or a Checkbox.Indicator in front (`multiple`).',
      ru: 'Пункт `role="option"`: галочка справа или чекбокс слева при `multiple`.',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Value of the option.",
          ru: "Значение пункта.",
        },
        {
          name: "label",
          type: "string",
          en: "Text in the trigger and for typeahead; defaults to `Select.ItemText`, then the plain text.",
          ru: "Текст в триггере и для набора с клавиатуры; по умолчанию — `Select.ItemText` или текст пункта.",
        },
        {
          name: "keywords",
          type: "string",
          en: "Extra words for the search.",
          ru: "Дополнительные слова для поиска.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Muted, skipped by the keyboard, not selectable.",
          ru: "Приглушён, клавиатура пропускает, выбрать нельзя.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Text, or `Select.ItemIcon`, `Avatar.Root`, `Thumbnail.Root`, `Select.ItemText`, `Select.ItemDescription`, `Select.ItemMeta`, `Badge.Root` as direct children.",
          ru: "Текст или части пункта прямыми детьми: иконка, Avatar, Thumbnail, текст, описание, мета, Badge.",
        },
      ],
    },
    {
      name: "Select.ItemText · Select.ItemDescription · Select.ItemMeta",
      en: "`ref` → `HTMLSpanElement`. Rich option parts: the title (its text is the label) / a muted second line / a trailing muted value. Leading media is an `Avatar.Root` or `Thumbnail.Root` child, a trailing status a `Badge.Root`.",
      ru: "Части богатого пункта: заголовок, вторая строка, значение справа; Avatar или Thumbnail слева по ярусу, Badge после текста.",
      props: [],
    },
    {
      name: "Select.Group",
      en: '`ref` → `HTMLDivElement`. `<div role="group">` named by its `label`; hidden while the search leaves none of its options. + native `<div>` props.',
      ru: "Группа пунктов с подписью; скрывается, если поиск не оставил в ней пунктов.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Heading of the group (caption, muted); also its accessible name.",
          ru: "Подпись группы (caption, приглушённая) и её доступное имя.",
        },
      ],
    },
    {
      name: "Select.Separator",
      en: "`ref` → `HTMLDivElement`. A full-bleed Divider between groups; hidden while searching.",
      ru: "Разделитель на всю ширину; скрыт во время поиска.",
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the divider.",
          ru: "`className` и остальные атрибуты разделителя.",
        },
      ],
    },
    {
      name: "Select.Action",
      en: '`ref` → `HTMLDivElement`. A list-level action («Новый клиент»), a direct child of `Select.Content`: a `role="option"` row pinned under the list, never filtered, the last stop of the arrows; highlighted while the search finds nothing.',
      ru: "Действие уровня списка («Новый клиент»), прямой ребёнок `Select.Content`: строка под прокруткой (и под пустым состоянием), поиск её не фильтрует, стрелки доходят до неё после последнего пункта. Когда поиск ничего не нашёл, подсветка встаёт на неё — Enter запускает действие.",
      props: [
        {
          name: "onSelect",
          type: "() => void",
          required: true,
          en: "Runs the action: a click, or Enter / Space while it is highlighted; the list then closes and the value stays.",
          ru: "Запускает действие: клик или Enter / Space на подсвеченной строке; затем список закрывается, значение не меняется.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Muted, skipped by the keyboard, not runnable.",
          ru: "Приглушено, клавиатура пропускает, не запускается.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The action text; an optional `Select.ItemIcon` in front.",
          ru: "Текст действия; при необходимости `Select.ItemIcon` перед ним.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "onSelect" | "role" | "id" | "children">',
          en: "`className` and the other attributes of the row.",
          ru: "`className` и остальные атрибуты строки.",
        },
      ],
    },
  ],
  labels: labelRows(SELECT_LABELS, {
    search: {
      en: "Placeholder and accessible name of the search field.",
      ru: "Плейсхолдер и имя поля поиска.",
    },
    empty: {
      en: "Empty state: no items or nothing matches.",
      ru: "Пустое состояние: пунктов нет или ничего не найдено.",
    },
    emptyHint: {
      en: 'Second line of the empty state while searching; `""` hides it.',
      ru: "Вторая строка пустого состояния при поиске; пустая строка скрывает её.",
    },
    loading: {
      en: "Announced while `loading` or `loadingMore`.",
      ru: "Объявляется скринридером при `loading` или `loadingMore`.",
    },
    retry: {
      en: "The retry button under `loadError` (`onRetry`).",
      ru: "Кнопка повтора под `loadError` (`onRetry`).",
    },
    clear: { en: "Tooltip of the clear segment.", ru: "Всплывающая подпись сегмента очистки." },
    optional: {
      en: "Muted marker after the label when `optional`.",
      ru: "Приглушённая пометка после подписи при `optional`.",
    },
    changeFailed: {
      en: "Announced when the `onValueChange` promise rejects and the value rolls back.",
      ru: "Объявляется, когда обещание из `onValueChange` отклонено и значение вернулось.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space · ArrowDown · ArrowUp",
        en: "On the trigger open the list; focus moves into the search or the list.",
        ru: "На триггере открывают список; фокус уходит в поиск или список.",
      },
      {
        keys: "ArrowDown · ArrowUp · Home · End",
        en: "In the list move the highlight over the enabled options, wrapping; a `Select.Action` is the last stop after the options.",
        ru: "В списке двигают подсветку по доступным пунктам по кругу; `Select.Action` — последняя остановка после пунктов.",
      },
      {
        keys: "Enter · Space",
        en: "Pick the highlighted option; a single pick closes the list and returns focus to the trigger. On a `Select.Action`, run it and close the list.",
        ru: "Выбирают подсвеченный пункт; одиночный выбор закрывает список и возвращает фокус на триггер. На `Select.Action` запускают действие и закрывают список.",
      },
      {
        keys: "A–Я",
        en: "Typeahead: the highlight jumps to the option starting with the letter or the typed prefix.",
        ru: "Набор с клавиатуры: подсветка уходит на пункт с этой буквы или префикса.",
      },
      {
        keys: "Delete · Backspace",
        en: "On the trigger with `clearable` clear the value.",
        ru: "На триггере с `clearable` очищают значение.",
      },
      {
        keys: "Enter",
        en: "With a load error in the open list, retries (`onRetry`).",
        ru: "При ошибке загрузки в открытом списке повторяет загрузку (`onRetry`).",
      },
      {
        keys: "Escape",
        en: "Closes the list; focus returns to the trigger.",
        ru: "Закрывает список; фокус возвращается на триггер.",
      },
      {
        keys: "Tab",
        en: "Returns focus to the trigger, closes the list and moves on from the trigger.",
        ru: "Возвращает фокус на триггер, закрывает список и переходит дальше от триггера.",
      },
    ],
    aria: [
      {
        en: 'The trigger is `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`; `label` names it.',
        ru: 'Триггер — `role="combobox"` с `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`; имя — `label`.',
      },
      {
        en: 'The list is `role="listbox"` (`aria-multiselectable` with `multiple`); options are `role="option"` with `aria-selected`; the highlight goes through `aria-activedescendant`.',
        ru: 'Список — `role="listbox"` (`aria-multiselectable` при `multiple`); пункты — `role="option"` с `aria-selected`; подсветка — через `aria-activedescendant`.',
      },
      {
        en: "The hint and the error are linked by `aria-describedby`; the error sets `aria-invalid`; loading sets `aria-busy`.",
        ru: "Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid`; при загрузке — `aria-busy`.",
      },
      {
        en: 'While loading the list is `aria-busy` and `labels.loading` is announced politely; skeleton rows are hidden from screen readers; a load error is `role="alert"`.',
        ru: 'При загрузке список — `aria-busy`, а `labels.loading` объявляется вежливо; строки-скелеты скрыты от скринридеров; ошибка загрузки — `role="alert"`.',
      },
      {
        en: "The highlight reaching the last option asks for the next batch the same way scrolling does.",
        ru: "Подсветка, дошедшая до последнего пункта, запрашивает следующую порцию так же, как прокрутка.",
      },
      {
        en: '`Select.Action` rows are `role="option"` in a `role="group"` under the scroller; the listbox owns the group through `aria-owns`, and the highlight reaches them through `aria-activedescendant`.',
        ru: '`Select.Action` — `role="option"` в группе под прокруткой; список владеет группой через `aria-owns`, подсветка доходит до действия через `aria-activedescendant`.',
      },
      {
        en: 'While an `onValueChange` promise is pending the trigger is `aria-busy`; a rejection announces `labels.changeFailed` in a polite `role="status"` region.',
        ru: "Пока сохраняется обещание из `onValueChange`, триггер — `aria-busy`, а отказ объявляет `labels.changeFailed` вежливо.",
      },
      {
        en: "With `name`, hidden inputs carry the value into a native form submit; native trigger events (`onFocus`, `onBlur`, `onKeyDown`) reach the button.",
        ru: "С `name` скрытые поля несут значение в нативную отправку формы; нативные события триггера (`onFocus`, `onBlur`, `onKeyDown`) доходят до кнопки.",
      },
      {
        en: "An outside press closes the list without moving focus back: focus follows the pointer (foundation §8).",
        ru: "Клик снаружи закрывает список без возврата фокуса: фокус остаётся там, куда нажали.",
      },
    ],
  },
};
