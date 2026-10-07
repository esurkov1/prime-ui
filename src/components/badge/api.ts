import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Badge.Root",
      en: "`ref` → `HTMLSpanElement`. The chip: fill, tier dimensions; a read-only badge is one `<span>`, `onPress` makes the body a `<button>`, `onRemove` adds a remove segment.",
      ru: "Чип: заливка и размеры яруса; без действий — один `<span>`, `onPress` делает тело кнопкой, `onRemove` добавляет сегмент удаления.",
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
          type: "() => void",
          en: "Adds the full-height remove segment at the end; called on its click.",
          ru: "Добавляет сегмент удаления во всю высоту в конце; вызывается по клику на него.",
        },
        {
          name: "onPress",
          type: "(event: MouseEvent<HTMLButtonElement>) => void",
          en: "Makes the body a `<button>` covering the whole badge (a toggle chip, a filter value); gets the event, so Alt / Shift clicks can mean more.",
          ru: "Делает тело кнопкой во весь бейдж (переключатель, значение фильтра); получает событие, так что Alt / Shift могут значить другое.",
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
          en: "`className`, `aria-label` (icon-only) and the other span attributes.",
          ru: "`className`, `aria-label` (для бейджа-иконки) и остальные атрибуты span.",
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
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Badge.Dot",
      en: "`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` dot in the text color; at an edge it becomes a segment like an edge icon. Also usable alone (a marker on an icon, before a label): it takes the tier of the surrounding control (6px, 8px from `l`) and the color set on it.",
      ru: "Точка цвета текста, `aria-hidden`; у края становится сегментом, как иконка. Работает и отдельно (метка на иконке, перед подписью): размер по ярусу окружающего контрола (6px, с `l` — 8px), цвет — заданный на ней.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Badge.Action",
      en: "`ref` → `HTMLButtonElement`. A `<button>` segment at the end, revealed on hover and focus; the badge reserves its room, so the width never changes. One per badge, not together with `onRemove`.",
      ru: "Кнопка-сегмент в конце, появляется при наведении и фокусе; место зарезервировано, ширина не меняется. Одна на бейдж, не вместе с `onRemove`.",
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
  labels: [
    {
      key: "remove",
      default: "Удалить",
      en: "Accessible name of the remove segment; include the badge text («Убрать фильтр «Москва»»).",
      ru: "Имя сегмента удаления; включите текст бейджа («Убрать фильтр «Москва»»).",
    },
  ],
};
