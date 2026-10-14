import type { ComponentApi } from "../../../scripts/docs/componentApi";
import { FIELD_OPTIONAL_LABEL, fieldGroupProps } from "../../internal/field.api";

const PALETTE =
  '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"';

export const api: ComponentApi = {
  parts: [
    {
      name: "SegmentedControl.Root",
      en: '`ref` → `HTMLDivElement` (the field frame). The field: label · `<div role="radiogroup">` track with the sliding thumb, keyboard handling and a horizontally scrolling `ScrollContainer` row · support row. The frame hugs the track unless `fullWidth`.',
      ru: 'Поле: подпись · дорожка `<div role="radiogroup">` со скользящим бегунком, клавиатурой и горизонтальной прокруткой · строка поддержки.',
      props: [
        {
          name: "value",
          type: "string",
          en: "Selected value (controlled).",
          ru: "Выбранное значение (управляемый режим).",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '""',
          en: 'Initial value (uncontrolled); `""` — nothing selected.',
          ru: 'Начальное значение (неуправляемый режим); `""` — ничего не выбрано.',
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the new value on click or arrow keys.",
          ru: "Вызывается с новым значением при клике или стрелках.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables the whole group.",
          ru: "Отключает всю группу.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Control tier; the outer height equals the control height 28 · 32 · 36 · 40 · 48. Without it the tier of its host (a toolbar, a panel with a size), else `m`.",
          ru: "Ярус; внешняя высота равна высоте контрола 28 · 32 · 36 · 40 · 48.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          en: "Fills the container; single-line segments tend to equal widths but never get narrower than their label — when they do not fit, the row scrolls.",
          ru: "Заполнить контейнер; однострочные сегменты стремятся к равной ширине, но не уже своей подписи — если не помещаются, ряд прокручивается.",
        },
        ...fieldGroupProps("radiogroup", "SegmentedControlLabels"),
        {
          name: "children",
          type: "ReactNode",
          en: "`SegmentedControl.Item`s (may be wrapped, e.g. in `Tooltip.Trigger`).",
          ru: "Пункты `SegmentedControl.Item` (можно обернуть, например в `Tooltip.Trigger`).",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange" | "dir">',
          en: "`aria-label` / `aria-labelledby` / `aria-describedby` and `onKeyDown` go to the radiogroup (a prevented key skips the kit's handling); `className`, `data-*` and the other attributes to the field frame `<div>`.",
          ru: "`aria-label` / `aria-labelledby` / `aria-describedby` и `onKeyDown` — на radiogroup (отменённая клавиша пропускает обработку кита); `className`, `data-*` и остальное — на `<div>` рамки поля.",
        },
      ],
    },
    {
      name: "SegmentedControl.Item",
      en: '`ref` → `HTMLButtonElement`. One option, a `<button role="radio">` with roving `tabIndex`; plain text is wrapped in a `SegmentedControl.Label`.',
      ru: 'Один вариант — `<button role="radio">` с перемещаемым `tabIndex`.',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Option value compared with the root value.",
          ru: "Значение варианта.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables this option; arrow keys skip it.",
          ru: "Отключает вариант; стрелки его пропускают.",
        },
        {
          name: "color",
          type: PALETTE,
          en: "Palette hue: a dot before the content; while selected the thumb takes a soft fill of the hue with a ring of it.",
          ru: "Оттенок: точка перед содержимым; выбранный бегунок получает мягкую заливку оттенка.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Text, `Icon`, `Label`, `Count`, `Description`. Only an icon → square segment; give it `aria-label`.",
          ru: "Текст, `Icon`, `Label`, `Count`, `Description`. Только иконка — квадратный сегмент с `aria-label`.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type" | "role">',
          en: "`aria-label`, `onClick` (runs first and can `preventDefault()` the selection), `className` and the other button attributes.",
          ru: "`aria-label`, `onClick` (выполняется первым и может отменить выбор), `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "SegmentedControl.Icon",
      en: "`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`) sized to the tier.",
      ru: "Декоративная иконка размера яруса.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="theme.light" />`.',
          ru: 'Иконка, например `<Icon name="theme.light" />`.',
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
      name: "SegmentedControl.Label",
      en: "`ref` → `HTMLSpanElement`. Segment title on one line; never truncated. Plain text is wrapped automatically.",
      ru: "Подпись сегмента в одну строку, не обрезается. Простой текст оборачивается сам.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Title text.",
          ru: "Текст подписи.",
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
      name: "SegmentedControl.Count",
      en: "`ref` → `HTMLSpanElement`. Counter `Badge` after the label, one tier below the control, tabular numbers.",
      ru: "Счётчик `Badge` после подписи, на ярус меньше.",
      props: [
        {
          name: "color",
          type: PALETTE,
          default: '"gray"',
          en: "Badge hue.",
          ru: "Оттенок бейджа.",
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
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "SegmentedControl.Description",
      en: "`ref` → `HTMLSpanElement`. Muted second line; makes the segment two-line and becomes its `aria-describedby`.",
      ru: "Приглушённая вторая строка; делает сегмент двухстрочным и становится `aria-describedby`.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Second-line text; wrap a key value in `<strong>`.",
          ru: "Текст второй строки; ключевое значение оберните в `<strong>`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: [FIELD_OPTIONAL_LABEL],
  accessibility: {
    keyboard: [
      {
        keys: "ArrowRight · ArrowDown",
        en: "Next option, wrapping and skipping disabled ones; focus and selection move together.",
        ru: "Следующий вариант по кругу, пропуская неактивные; фокус и выбор двигаются вместе.",
      },
      { keys: "ArrowLeft · ArrowUp", en: "Previous option.", ru: "Предыдущий вариант." },
      {
        keys: "Home · End",
        en: "First and last enabled option.",
        ru: "Первый и последний доступный вариант.",
      },
      {
        keys: "Tab",
        en: "Enters the group on the selected option (or the first enabled one) and leaves it.",
        ru: "Входит в группу на выбранном варианте (или первом доступном) и выходит из неё.",
      },
    ],
    aria: [
      {
        en: 'The track is `role="radiogroup"`, named by `label` (`aria-labelledby`); without a label give the root `aria-label`. `aria-disabled` when disabled.',
        ru: 'Дорожка — `role="radiogroup"`: её называет `label` (`aria-labelledby`), иначе задайте `aria-label`; при `disabled` — `aria-disabled`.',
      },
      {
        en: 'Hint and error are linked through `aria-describedby`; an error sets `aria-invalid="true"`, `required` sets `aria-required="true"`.',
        ru: "Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid`, `required` — `aria-required`.",
      },
      {
        en: 'Items are `<button role="radio" aria-checked>` with roving `tabIndex`.',
        ru: 'Варианты — `<button role="radio" aria-checked>` с перемещаемым `tabIndex`.',
      },
      {
        en: "Two-line items: `aria-labelledby` = label (+ count), `aria-describedby` = description.",
        ru: "В двухстрочном сегменте имя — подпись и счётчик, описание — `aria-describedby`.",
      },
      {
        en: "Icons are `aria-hidden`; icon-only items need `aria-label` (and a Tooltip for sighted users).",
        ru: "Иконки скрыты (`aria-hidden`); сегменту только с иконкой нужен `aria-label`.",
      },
    ],
  },
};
