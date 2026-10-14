import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { BADGE_LABELS } from "./Badge";

export const api: ComponentApi = {
  parts: [
    {
      name: "Badge.Root",
      en: "`ref` → `HTMLSpanElement`. The chip: fill, tier dimensions; a read-only badge is one `<span>`, `onPress` makes the body a `<button>`, `onRemove` adds a remove segment.",
      ru: "Чип: заливка и размеры яруса; без действий — один `<span>`, `onPress` делает тело `<button>`, `onRemove` добавляет сегмент удаления.",
      props: [
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"gray"',
          en: "Palette hue. Categorizes; the text carries the meaning.",
          ru: "Оттенок палитры. Категоризирует; смысл несёт текст.",
        },
        {
          name: "variant",
          type: '"solid" | "soft" | "outline"',
          default: '"soft"',
          en: "Treatment.",
          ru: "Подача.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          en: "Badge tier, 16 · 20 · 24 · 28 · 32 px high. Without it the badge follows the surrounding control one tier down; outside a control it is `m`.",
          ru: "Ярус бейджа, высота 16 · 20 · 24 · 28 · 32 px. Без него внутри контрола — на ступень ниже, вне контрола — `m`.",
        },
        {
          name: "onRemove",
          type: "() => void | Promise<void>",
          en: "Adds the full-height remove segment at the end; called on its click. Return the request's promise: the badge waits with a spinner; take it out of your list before resolving; on reject it stays.",
          ru: "Добавляет сегмент удаления во всю высоту в конце; вызывается по клику на него. Верните промис запроса: бейдж ждёт со спиннером; уберите его из списка до resolve; при reject он остаётся.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The badge waits on a request (a value its owner is still creating): dimmed, `aria-busy`, a spinner in the remove segment, which takes no press. A promise from `onRemove` does the same on its own.",
          ru: "Бейдж ждёт запроса (значение, которое владелец ещё создаёт): приглушён, `aria-busy`, спиннер в сегменте удаления, нажатие не действует. Промис из `onRemove` делает то же сам.",
        },
        {
          name: "onPress",
          type: "(event: MouseEvent<HTMLButtonElement>) => void",
          en: "Makes the body a `<button>` covering the whole badge (a toggle chip, a filter value); gets the event, so Alt / Shift clicks can mean more.",
          ru: "Делает тело `<button>` во весь бейдж (переключатель, значение фильтра); получает событие, так что Alt / Shift могут значить другое.",
        },
        {
          name: "pressed",
          type: "boolean",
          en: "Toggle state of a pressable badge: `aria-pressed` on the body, `data-pressed` on the root.",
          ru: "Состояние нажатого бейджа: `aria-pressed` на теле, `data-pressed` на корне.",
        },
        {
          name: "disabled",
          type: "boolean",
          en: "Muted look for every variant, `aria-disabled`; the body button, remove and action get native `disabled`.",
          ru: "Приглушённый вид в любом варианте, `aria-disabled`; кнопки внутри получают `disabled`.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the badge.",
          ru: "Класс на бейдже.",
        },
        {
          name: "labels",
          type: "Partial<BadgeLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Text, `Badge.Dot`, `Badge.Icon`, one `Badge.Action`. Only `Badge.Icon` children (no remove or action) make a square icon-only badge.",
          ru: "Текст, `Badge.Dot`, `Badge.Icon`, один `Badge.Action`. Только `Badge.Icon` (без удаления и действия) — квадратный бейдж-иконка.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`aria-label` (icon-only) and the other span attributes.",
          ru: "`aria-label` (для бейджа-иконки) и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Badge.Icon",
      en: "`ref` → `HTMLSpanElement`. A `<span>` holding one icon at the tier icon size. At the first or last position it becomes a full-height edge segment.",
      ru: "`<span>` с иконкой размера яруса. Первой или последней — становится сегментом во всю высоту у края.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The icon (`Icon`).",
          ru: "Иконка (`Icon`).",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the icon box.",
          ru: "Класс на блоке иконки.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "The other span attributes.",
          ru: "Остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Badge.Dot",
      en: "`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` dot in the text color; at an edge it becomes a segment. Alone (a marker on an icon, before a label) it takes the host tier and the color set on it.",
      ru: "Точка `<span>` цвета текста, `aria-hidden`; у края становится сегментом. Отдельно (метка на иконке, перед подписью) берёт ярус контейнера и заданный на ней цвет.",
      props: [
        {
          name: "className",
          type: "string",
          en: "Class on the dot.",
          ru: "Класс на точке.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "The other span attributes.",
          ru: "Остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Badge.Action",
      en: "`ref` → `HTMLButtonElement`. A `<button>` segment at the end, revealed on hover and focus (always shown on touch); the width never changes. One per badge, not together with `onRemove`.",
      ru: "Сегмент `<button>` в конце, появляется при наведении и фокусе, на сенсорных экранах видна всегда; место зарезервировано, ширина не меняется. Одна на бейдж, не вместе с `onRemove`.",
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          en: "Accessible name and tooltip («Скрыть billing»).",
          ru: "Доступное имя и подсказка («Скрыть billing»).",
        },
        {
          name: "onClick",
          type: "(event: MouseEvent<HTMLButtonElement>) => void",
          required: true,
          en: "Runs the action.",
          ru: "Выполняет действие.",
        },
        {
          name: "persistent",
          type: "boolean",
          default: "false",
          en: "Keeps the action shown, not only on hover and focus (while the state it sets is on).",
          ru: "Держит действие видимым всегда (пока включено состояние, которое оно задаёт).",
        },
        {
          name: "pressed",
          type: "boolean",
          en: "Toggle state of the action: `aria-pressed`.",
          ru: "Состояние переключения действия: `aria-pressed`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "The action is unavailable.",
          ru: "Действие недоступно.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "A custom glyph at the tier icon size; a minus by default.",
          ru: "Свой глиф размера иконки яруса; по умолчанию минус.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick" | "children">',
          en: "`className` and the other button attributes.",
          ru: "`className` и остальные атрибуты кнопки.",
        },
      ],
    },
  ],
  labels: labelRows(BADGE_LABELS, {
    remove: {
      en: "Accessible name of the remove segment; include the badge text («Убрать фильтр «Москва»»).",
      ru: "Имя сегмента удаления; включите текст бейджа («Убрать фильтр «Москва»»).",
    },
    removeFailed: {
      en: "Spoken when the `onRemove` promise rejects and the badge stays; name the badge («Фильтр «Москва» не убран»).",
      ru: "Озвучивается, когда промис `onRemove` отклонён и бейдж остался; назовите бейдж («Фильтр «Москва» не убран»).",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses the body of a pressable badge, then its action or remove segment.",
        ru: "Фокус на теле нажимаемого бейджа, затем на действии или удалении.",
      },
      {
        keys: "Enter · Space",
        en: "Presses the focused body, remove or action button.",
        ru: "Нажимает тело, удаление или действие в фокусе.",
      },
    ],
    aria: [
      {
        en: "A read-only badge is plain text in a `<span>`, no role.",
        ru: "Бейдж без действий — обычный текст в `<span>`, без роли.",
      },
      {
        en: "`onPress` makes the body a `<button>` with `aria-pressed` when `pressed` is set; remove and `Badge.Action` are separate buttons with their own names.",
        ru: "`onPress` делает тело `<button>` с `aria-pressed` при заданном `pressed`; удаление и `Badge.Action` — отдельные кнопки со своими именами.",
      },
      {
        en: "Give every remove button a unique name with `labels.remove`; after removing, move focus to a neighbouring badge or the source field.",
        ru: "Дайте каждому удалению уникальное имя через `labels.remove`, иначе скринридер услышит несколько одинаковых «Удалить».",
      },
      {
        en: "While a removal is saved the badge has `aria-busy` and the segment `aria-disabled`; once a removal waits, the badge mounts a polite live region that speaks `labels.removeFailed` if the promise rejects.",
        ru: "Пока удаление сохраняется, у бейджа `aria-busy`, у сегмента `aria-disabled`; когда удаление ждёт, бейдж ставит вежливую live-область, которая объявит `labels.removeFailed`, если промис отклонён.",
      },
      {
        en: "`Badge.Dot` is `aria-hidden`; icon-only badges need `aria-label`. Color never carries meaning alone.",
        ru: "`Badge.Dot` скрыт (`aria-hidden`); бейджу-иконке нужен `aria-label`. Цвет никогда не несёт смысл один — оставляйте слово.",
      },
    ],
  },
};
