import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { COMMAND_MENU_LABELS } from "./CommandMenu";

export const api: ComponentApi = {
  parts: [
    {
      name: "CommandMenu.Root",
      en: "`ref` → `HTMLDivElement` (the dialog panel). A Modal with a top-aligned palette panel; owns the query (cleared on close), the active item (a new opening starts empty, focus in the search field) and the load state of server results.",
      ru: "Палитра на основе Modal: панель сверху; хранит запрос (сбрасывается при закрытии), активный пункт и состояние загрузки результатов с сервера.",
      props: [
        {
          name: "open",
          type: "boolean",
          en: "Controlled visibility; together with `onOpenChange`.",
          ru: "Управляемое открытие; вместе с `onOpenChange`.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial visibility, uncontrolled.",
          ru: "Начальное открытие без контроля.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Called on every open and close: Escape, scrim click, code.",
          ru: "Вызывается при каждом открытии и закрытии: Escape, клик по подложке, код.",
        },
        {
          name: "search",
          type: "string",
          en: "Controlled query; the list filters by it. Together with `onSearchChange`.",
          ru: "Управляемый запрос; список фильтруется по нему. Вместе с `onSearchChange`.",
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
          en: 'Called with the new query: typing, and `""` when the palette closes. Load the matching results here for a server search.',
          ru: 'Вызывается с новым запросом: ввод и `""` при закрытии палитры. Здесь загружайте результаты для поиска на сервере.',
        },
        {
          name: "filter",
          type: "boolean",
          default: "true",
          en: "The palette filters its items by the query. `false` when the results come from a server: every item shows, the query is still marked in the labels.",
          ru: "Палитра сама фильтрует пункты по запросу. `false`, когда результаты приходят с сервера: показываются все пункты, совпадение в подписи всё равно выделяется.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "Results are loading: skeleton rows in the list while no item matches (items already on screen stay), `aria-busy`.",
          ru: "Результаты загружаются: строки-скелеты, пока нет ни одного пункта (показанные пункты остаются), `aria-busy`.",
        },
        {
          name: "loadingMore",
          type: "boolean",
          default: "false",
          en: "More results are loading at the end: skeleton rows after the items.",
          ru: "Догружаются следующие результаты: строки-скелеты после пунктов.",
        },
        {
          name: "hasMore",
          type: "boolean",
          default: "false",
          en: "More results exist: reaching the end of the list calls `onLoadMore`.",
          ru: "Есть ещё результаты: конец списка вызывает `onLoadMore`.",
        },
        {
          name: "onLoadMore",
          type: "() => void | Promise<void>",
          en: "Called once per round with `hasMore` when the end of the list scrolls into view or the arrows reach the last item; set `loadingMore` while it runs.",
          ru: "Вызывается один раз за порцию при `hasMore`, когда конец списка прокручен в видимую область или стрелки дошли до последнего пункта; на время загрузки ставьте `loadingMore`.",
        },
        {
          name: "loadError",
          type: "ReactNode",
          en: 'The results failed to load: the message replaces the list in `role="alert"`.',
          ru: 'Результаты не загрузились: сообщение вместо списка с `role="alert"`.',
        },
        {
          name: "onRetry",
          type: "() => void | Promise<void>",
          en: "A retry button (`labels.retry`) under `loadError`; Enter in the search field runs it too. Return the request's promise to keep the button loading until it settles.",
          ru: "Кнопка «Повторить» (`labels.retry`) под `loadError`; Enter в поле поиска тоже её вызывает. Верните промис запроса — кнопка в загрузке, пока он не завершится.",
        },
        {
          name: "closeOnOutsideClick",
          type: "boolean",
          default: "true",
          en: "A click on the scrim closes the palette; focus returns to the opener.",
          ru: "Клик по подложке закрывает палитру; фокус возвращается на открывший элемент.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          en: "Escape closes the palette.",
          ru: "Escape закрывает палитру.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the rows and the search row: item height, text, icon. Without it the tier of the host it opens from, else `m`.",
          ru: "Ярус строк и строки поиска: высота пункта, текст, иконка. Без него — ярус контейнера, из которого палитра открыта, иначе `m`.",
        },
        {
          name: "labels",
          type: "Partial<CommandMenuLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "aria-label · aria-labelledby · aria-describedby",
          type: "string",
          en: "Name and description of the dialog when there is no `CommandMenu.Title` / `Description`.",
          ru: "Имя и описание диалога, если нет `CommandMenu.Title` / `Description`.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Title, Description, Input, List, Footer.",
          ru: "Title, Description, Input, List, Footer.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the dialog panel.",
          ru: "`className` и остальные атрибуты панели диалога.",
        },
      ],
    },
    {
      name: "CommandMenu.Title · CommandMenu.Description",
      en: "`ref` → `HTMLHeadingElement` / `HTMLParagraphElement`. `<h2>` / `<p>` above the search row; they name and describe the dialog.",
      ru: "`<h2>` / `<p>` над строкой поиска; дают диалогу имя и описание.",
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "id">',
          en: "`children`, `className` and the other attributes except `id`.",
          ru: "`children`, `className` и остальные атрибуты, кроме `id`.",
        },
      ],
    },
    {
      name: "CommandMenu.Input",
      en: '`ref` → `HTMLInputElement`. The search row: a search icon and `<input role="combobox">` controlling the list, showing `CommandMenu.Root` `search`; takes focus on open.',
      ru: 'Строка поиска: иконка и `<input role="combobox">`, управляющее списком, с `search` из `CommandMenu.Root`; получает фокус при открытии.',
      props: [
        {
          name: "placeholder",
          type: "string",
          default: "labels.search",
          en: "Placeholder; also the default accessible name comes from `labels.search`.",
          ru: "Плейсхолдер; имя поля по умолчанию — `labels.search`.",
        },
        {
          name: "…rest",
          type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "role" | "value" | "defaultValue">',
          en: "`className` and the other input attributes except `value` / `defaultValue`.",
          ru: "`className` и остальные атрибуты input, кроме `value` / `defaultValue`.",
        },
      ],
    },
    {
      name: "CommandMenu.List",
      en: '`ref` → `HTMLElement`. The scrolling `role="listbox"` under the search row; draws the load states of Root: skeleton rows, more rows loading at the end, the error with a retry.',
      ru: 'Прокручиваемый `role="listbox"` под строкой поиска; рисует состояния загрузки Root: строки-скелеты, догрузку в конце, ошибку с повтором.',
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "role" | "id">',
          en: "`children`, `className` and the other attributes.",
          ru: "`children`, `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "CommandMenu.Group",
      en: '`ref` → `HTMLDivElement`. `<div role="group">` named by its `label`; hidden while none of its items match.',
      ru: '`<div role="group">` с именем из `label`; скрывается, если ни один пункт не подходит.',
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Heading of the group (caption, muted); also its accessible name.",
          ru: "Подпись раздела (caption, приглушённая) и его доступное имя.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "role">',
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "CommandMenu.Item",
      en: '`ref` → `HTMLButtonElement`. `<button role="option">`; the active item has `aria-selected` and the highlight fill.',
      ru: '`<button role="option">`; активный выделен заливкой и `aria-selected`.',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: 'Text matched against the query together with `keywords`. With `""` the item shows only while the query is empty or `keywords` match.',
          ru: 'Текст, по которому ищет запрос, вместе с `keywords`. С `""` пункт виден, только пока запрос пуст или совпали `keywords`.',
        },
        {
          name: "keywords",
          type: "string",
          en: "Extra words for the query (synonyms, English names).",
          ru: "Дополнительные слова для поиска (синонимы, английские названия).",
        },
        {
          name: "onSelect",
          type: "() => void",
          en: "Runs the command: a click, or Enter while the item is active.",
          ru: "Выполняет команду: клик или Enter на активном пункте.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Unavailable right now: shown muted with `aria-disabled`, skipped by the arrows, does not run.",
          ru: "Недоступна сейчас: видна приглушённой с `aria-disabled`, стрелки её пропускают, не выполняется.",
        },
        {
          name: "persistent",
          type: "boolean",
          default: "false",
          en: "Shown whatever the query and never counted as a match (`CommandMenu.Empty` still shows); the arrows reach it after the matches. One «create from the query» item at the end of the list.",
          ru: "Виден при любом запросе и не считается совпадением (`CommandMenu.Empty` всё равно показывается); стрелки доходят до него после совпадений. Один пункт «Создать из запроса» в конце списка.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "role" | "id" | "onSelect">',
          en: "`children`, `className` and the other button attributes.",
          ru: "`children`, `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "CommandMenu.ItemIcon",
      en: "`ref` → `HTMLSpanElement`. The `aria-hidden` leading glyph of the item.",
      ru: "Ведущая иконка пункта (`aria-hidden`).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (the `Icon`), `className` and the other span attributes.",
          ru: "`children` (`Icon`), `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "CommandMenu.ItemShortcut",
      en: "`ref` → `HTMLElement` (the `<kbd>`). A `Kbd` key hint at the end of the item — a hint, not a handler.",
      ru: "Подсказка клавиш `Kbd` в конце пункта — подсказка, не обработчик.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The keys («⌘K»).",
          ru: "Клавиши («⌘K»).",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "children">',
          en: "`className` and the other attributes.",
          ru: "`className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "CommandMenu.ItemText",
      en: "`ref` → `HTMLSpanElement`. A `<span>` column: the title with an ellipsis and an optional description line.",
      ru: "Колонка `<span>`: заголовок с многоточием и необязательная строка описания.",
      props: [
        {
          name: "description",
          type: "ReactNode",
          en: "Second line (path, details): caption, muted.",
          ru: "Вторая строка (путь, детали): caption, приглушённая.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (the title), `className` and the other span attributes.",
          ru: "`children` (заголовок), `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "CommandMenu.Empty",
      en: '`ref` → `HTMLDivElement`. A compact EmptyPage (`role="status"`) shown while nothing matches and nothing loads: `labels.empty` and `labels.emptyHint`, text only. An action for the query is a `persistent` `CommandMenu.Item` at the end of the list.',
      ru: 'Компактный EmptyPage (`role="status"`), пока ничего не найдено и не грузится: `labels.empty` и `labels.emptyHint`, только текст. Действие для запроса — `persistent` `CommandMenu.Item` в конце списка.',
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "role" | "children">',
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "CommandMenu.Footer",
      en: "`ref` → `HTMLDivElement`. A bottom row of `CommandMenu.FooterHint`s with a hairline above.",
      ru: "Нижняя строка из `CommandMenu.FooterHint` с тонкой линией сверху.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "CommandMenu.FooterHint",
      en: "`ref` → `HTMLSpanElement`. One hint: every entry of `keys` in its own `Kbd`, then the label (`children`).",
      ru: "Одна подсказка: каждая клавиша из `keys` в своём `Kbd`, затем подпись (`children`).",
      props: [
        {
          name: "keys",
          type: "ReactNode[]",
          required: true,
          en: "The keys (text or icons).",
          ru: "Клавиши (текст или иконки).",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (the label), `className` and the other span attributes.",
          ru: "`children` (подпись), `className` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: labelRows(COMMAND_MENU_LABELS, {
    search: {
      en: "Default placeholder and accessible name of `CommandMenu.Input`.",
      ru: "Плейсхолдер и имя `CommandMenu.Input` по умолчанию.",
    },
    empty: {
      en: "`CommandMenu.Empty`: nothing matches the query.",
      ru: "`CommandMenu.Empty`: по запросу ничего нет.",
    },
    emptyHint: {
      en: 'Second line of `CommandMenu.Empty`; `""` hides it.',
      ru: 'Вторая строка `CommandMenu.Empty`; `""` скрывает её.',
    },
    loading: {
      en: "Announced while `loading` or `loadingMore`.",
      ru: "Объявляется скринридером при `loading` или `loadingMore`.",
    },
    retry: {
      en: "The retry button under `loadError` (`onRetry`).",
      ru: "Кнопка повтора под `loadError` (`onRetry`).",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "ArrowDown · ArrowUp",
        en: "Move the active item, wrapping; focus stays in the search field.",
        ru: "Переводят активный пункт по кругу; фокус остаётся в поле поиска.",
      },
      {
        keys: "Home · End",
        en: "First / last matching item.",
        ru: "Первый / последний найденный пункт.",
      },
      {
        keys: "Enter",
        en: "Runs the active item; with a load error, retries (`onRetry`).",
        ru: "Выполняет активный пункт; при ошибке загрузки повторяет её (`onRetry`).",
      },
      {
        keys: "Tab",
        en: "With a load error, moves focus to the retry button.",
        ru: "При ошибке загрузки переводит фокус на кнопку «Повторить».",
      },
      {
        keys: "Escape",
        en: "Closes the palette (`closeOnEscape`); focus returns to the opener.",
        ru: "Закрывает палитру (`closeOnEscape`); фокус возвращается на открывший элемент.",
      },
    ],
    aria: [
      {
        en: 'The palette is `role="dialog"` with `aria-modal`, named by `CommandMenu.Title` or `aria-label`.',
        ru: 'Палитра — `role="dialog"` с `aria-modal`; имя — `CommandMenu.Title` или `aria-label`.',
      },
      {
        en: "The search field takes focus on open and has no focus ring: the caret is the indicator. Its `onChange`, `onKeyDown`, `onFocus` and `onBlur` reach the input.",
        ru: "Поле поиска получает фокус при открытии и не рисует кольцо фокуса: индикатор — каретка. Его `onChange`, `onKeyDown`, `onFocus` и `onBlur` доходят до поля.",
      },
      {
        en: 'The field is `role="combobox"` with `aria-controls` on the list and `aria-activedescendant` on the active item; items are `role="option"`, the active one `aria-selected`.',
        ru: 'Поле — `role="combobox"` с `aria-controls` на список и `aria-activedescendant` на активный пункт; пункты — `role="option"`, активный — `aria-selected`.',
      },
      {
        en: '`CommandMenu.Group` is `role="group"` named by its `label`; the empty result is `role="status"`.',
        ru: '`CommandMenu.Group` — `role="group"` с именем из `label`; пустой результат — `role="status"`.',
      },
      {
        en: 'While loading the list and the field are `aria-busy` and `labels.loading` is announced politely; skeleton rows are hidden from screen readers; a load error is `role="alert"`.',
        ru: 'При загрузке список и поле — `aria-busy`, а `labels.loading` объявляется вежливо; строки-скелеты скрыты от скринридеров; ошибка загрузки — `role="alert"`.',
      },
      {
        en: "The arrows reaching the last item ask for the next batch the same way scrolling does.",
        ru: "Стрелки, дошедшие до последнего пункта, запрашивают следующую порцию так же, как прокрутка.",
      },
      {
        en: "The page behind is inert; after closing, focus returns to the opener.",
        ru: "Страница за палитрой неактивна; после закрытия фокус возвращается на открывший элемент.",
      },
    ],
  },
};
