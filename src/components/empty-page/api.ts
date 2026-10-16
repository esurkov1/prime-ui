import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { EMPTY_PAGE_LABELS } from "./EmptyPage";

export const api: ComponentApi = {
  parts: [
    {
      name: "EmptyPage.Root",
      en: "`ref` → `HTMLDivElement`. A centered column: icon tile, title, description, actions; parts rise in one after another when it appears on a page already shown (a search or a filter that came to nothing); one that mounts with its page stands still.",
      ru: "Колонка по центру: плашка с иконкой, заголовок, описание, действия; части появляются по очереди, когда состояние возникает на уже показанной странице (поиск или фильтр ничего не нашли); пустое состояние, открытое вместе со страницей, неподвижно.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Icon tile, title type and padding; given to the controls inside. Without it the tier of its host, else `m`.",
          ru: "Плашка иконки, шрифт заголовка и отступы; передаётся контролам внутри. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "layout",
          type: '"default" | "fill" | "compact"',
          default: '"default"',
          en: "`default` sizes by content; `fill` stretches to the parent's height and centers; `compact` — a quiet state inside a menu or list: smaller text and icon, no entrance motion.",
          ru: "`default` — по содержимому; `fill` — на всю высоту родителя по центру; `compact` — тихое состояние в меню или списке: текст и иконка меньше, без анимации появления.",
        },
        {
          name: "tone",
          type: '"neutral" | "danger"',
          default: '"neutral"',
          en: '`neutral` — nothing here (yet); `danger` — the region failed to load: the icon tile turns danger and the root is `role="alert"` unless you pass a `role`.',
          ru: '`neutral` — здесь (пока) пусто; `danger` — регион не загрузился: плашка иконки становится danger, корень — `role="alert"`, если не передан свой `role`.',
        },
        {
          name: "labels",
          type: "Partial<EmptyPageLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `role` (`status` in a filtered list), `aria-labelledby` and the other div attributes.",
          ru: "`className`, `role` (`status` в фильтруемом списке), `aria-labelledby` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "EmptyPage.Icon",
      en: "`ref` → `HTMLDivElement`. A `<div>` tile holding one icon.",
      ru: "Плашка `<div>` с одной иконкой.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "accent" | "danger"',
          defaultNote: { en: "the root's `tone`", ru: "`tone` корня" },
          en: "`neutral` — no data yet, `accent` — a first run and a call to start, `danger` — a failed load.",
          ru: "`neutral` — данных пока нет, `accent` — первый запуск и призыв начать, `danger` — ошибка загрузки.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the icon), `className` and the other div attributes.",
          ru: "`children` (иконка), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "EmptyPage.Title",
      en: "`ref` → the element. An `<h2>` (or `as`) capped at the reading width.",
      ru: "`<h2>` (или `as`), ограничен шириной чтения.",
      props: [
        {
          name: "as",
          type: '"h2" | "h3" | "h4" | "p"',
          default: '"h2"',
          en: "Tag that fits the outline; the look does not change. `p` inside menus, lists and table cells.",
          ru: "Тег по структуре страницы; вид не меняется. `p` внутри меню, списков и ячеек таблицы.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `id` (for `aria-labelledby`), `className` and the other attributes.",
          ru: "`children`, `id` (для `aria-labelledby`), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "EmptyPage.Description",
      en: "`ref` → `HTMLParagraphElement`. A `<p>` capped at the reading width.",
      ru: "`<p>`, ограничен шириной чтения.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `id` (for `aria-labelledby`), `className` and the other attributes.",
          ru: "`children`, `id` (для `aria-labelledby`), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "EmptyPage.Actions",
      en: "`ref` → `HTMLDivElement`. A `<div>` row of buttons that wraps when narrow.",
      ru: "Ряд кнопок `<div>`, переносится в узком месте.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Buttons in the same `size`), `className` and the other div attributes.",
          ru: "`children` (Button того же `size`), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "EmptyPage.RetryButton",
      en: "`ref` → `HTMLButtonElement`. The kit's retry of a failed region: an outline neutral Button with the refresh icon and `labels.retry`, in the root's tier. Put it in `EmptyPage.Actions`.",
      ru: "Готовая кнопка повтора для упавшего региона: Button outline neutral с иконкой обновления и `labels.retry`, в ярусе корня. Кладите в `EmptyPage.Actions`.",
      props: [
        {
          name: "onRetry",
          type: "() => void | Promise<void>",
          required: true,
          en: "Loads the region again. A returned Promise keeps the button loading until it settles; on reject the error state stays and the button is ready again.",
          ru: "Загружает регион заново. Возвращённый Promise держит кнопку в загрузке до ответа; при reject ошибка остаётся, кнопка снова готова.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">',
          en: "`children` (text instead of `labels.retry`), `disabled`, `className` and the other button attributes.",
          ru: "`children` (текст вместо `labels.retry`), `disabled`, `className` и остальные атрибуты кнопки.",
        },
      ],
    },
  ],
  labels: labelRows(EMPTY_PAGE_LABELS, {
    retry: { en: "Text of `EmptyPage.RetryButton`.", ru: "Текст `EmptyPage.RetryButton`." },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        en: "On `EmptyPage.RetryButton`: retry the load; while the retry runs the button is loading and ignores presses.",
        ru: "На `EmptyPage.RetryButton` — повторить загрузку; пока повтор идёт, кнопка в состоянии загрузки и не нажимается.",
      },
    ],
    aria: [
      {
        en: '`tone="danger"` makes the root `role="alert"`, so the failure is announced when it appears; a `role` you pass replaces it.',
        ru: '`tone="danger"` делает корень `role="alert"` — ошибка объявляется, когда появляется; свой `role` заменяет его.',
      },
      {
        en: "The title is an `<h2>` (`as` picks `h3` / `h4` by the outline, `p` inside menus, lists and table cells); link the root to it with `aria-labelledby` when the empty state replaces a whole region.",
        ru: "Заголовок — `<h2>` (`as` выбирает `h3` / `h4` по структуре, `p` внутри меню, списков и ячеек таблицы); свяжите с ним корень через `aria-labelledby`, когда пустое состояние заменяет целую область.",
      },
      {
        en: 'In a filtered menu or list set `role="status"`, so screen readers announce «Ничего не найдено».',
        ru: 'В фильтруемом меню или списке задайте `role="status"`, чтобы скринридер объявил «Ничего не найдено».',
      },
      {
        en: "`EmptyPage.Icon` is `aria-hidden`: the tile is decorative, the title says what the state is.",
        ru: "`EmptyPage.Icon` скрыт от скринридера (`aria-hidden`): плашка декоративна, о состоянии говорит заголовок.",
      },
    ],
  },
};
