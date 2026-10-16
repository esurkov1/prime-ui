import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { FIELD_OPTIONAL_LABEL_DOCS, fieldGroupProps } from "../../internal/field.api";
import { SEGMENTED_CONTROL_LABELS } from "./SegmentedControl";

const PALETTE =
  '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"';

export const api: ComponentApi = {
  parts: [
    {
      name: "SegmentedControl.Root",
      en: '`ref` → `HTMLDivElement` (the field frame). The field: label · `<div role="radiogroup">` track with the sliding thumb and the switcher row (titles go before it scrolls, when every segment has an icon) · support row. The frame hugs the track unless `fullWidth`.',
      ru: 'Поле: подпись · дорожка `<div role="radiogroup">` со скользящим бегунком и строкой переключателя (подписи уходят раньше прокрутки, если иконка есть у каждого сегмента) · строка поддержки. Рамка облегает дорожку, если не задан `fullWidth`.',
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
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Control tier; the outer height equals the control height 28 · 32 · 36 · 40 · 48. Without it the tier of its host (a toolbar, a panel with a size), else `m`.",
          ru: "Ярус; внешняя высота равна высоте контрола 28 · 32 · 36 · 40 · 48. Без него — ярус хоста, иначе `m`.",
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
      en: '`ref` → `HTMLButtonElement`, or the child element with `asChild`. One option, a `<button role="radio">` with roving `tabIndex`; plain text is wrapped in a `SegmentedControl.Label`. With `asChild` the segment is the consumer\'s link.',
      ru: 'Один вариант — `<button role="radio">` с перемещаемым `tabIndex`; простой текст оборачивается в `SegmentedControl.Label`. С `asChild` сегмент — ссылка потребителя.',
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
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "The single child (a router `<Link>`) becomes the segment. A row of links is a navigation: links in the Tab order, the one matching `value` current, no arrow keys.",
          ru: "Единственный дочерний элемент (`<Link>` роутера) становится сегментом. Ряд ссылок — навигация: ссылки в порядке Tab, совпавшая с `value` — текущая, без стрелок.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Text, `Icon`, `Label`, `Count`, `Description`. Only an icon → square segment; give it `aria-label`.",
          ru: "Текст, `Icon`, `Label`, `Count`, `Description`. Только иконка — квадратный сегмент с `aria-label`.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the segment button.",
          ru: "Класс на кнопке сегмента.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type" | "role">',
          en: "`aria-label`, `onClick` (runs first and can `preventDefault()` the selection), `className` and the other button attributes.",
          ru: "`aria-label`, `onClick` (выполняется первым и может отменить выбор через `preventDefault()`), `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "SegmentedControl.Icon",
      en: "`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`) sized to the tier.",
      ru: "Декоративная иконка (`aria-hidden`) размера яруса.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="theme.light" />`.',
          ru: 'Иконка, например `<Icon name="theme.light" />`.',
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
          name: "className",
          type: "string",
          en: "Class on the label.",
          ru: "Класс на подписи.",
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
          name: "className",
          type: "string",
          en: "Class on the description.",
          ru: "Класс на описании.",
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
  labels: labelRows(SEGMENTED_CONTROL_LABELS, FIELD_OPTIONAL_LABEL_DOCS),
  accessibility: {
    keyboard: [
      {
        keys: "ArrowRight · ArrowDown",
        en: "Next option, wrapping and skipping disabled ones; focus and selection move together (not in a row of links).",
        ru: "Следующий вариант по кругу, пропуская неактивные; фокус и выбор двигаются вместе (кроме ряда ссылок).",
      },
      { keys: "ArrowLeft · ArrowUp", en: "Previous option.", ru: "Предыдущий вариант." },
      {
        keys: "Home · End",
        en: "First and last enabled option.",
        ru: "Первый и последний доступный вариант.",
      },
      {
        keys: "Tab",
        en: "Enters the group on the selected option (or the first enabled one) and leaves it; in a row of links it moves from link to link.",
        ru: "Входит в группу на выбранном варианте (или первом доступном) и выходит из неё; в ряду ссылок переходит от ссылки к ссылке.",
      },
    ],
    aria: [
      {
        en: 'The track is `role="radiogroup"`, named by `label` (`aria-labelledby`); without a label give the root `aria-label`. `aria-disabled` when disabled.',
        ru: 'Дорожка — `role="radiogroup"`: её называет `label` (`aria-labelledby`), без подписи задайте корню `aria-label`. В выключенном состоянии — `aria-disabled`.',
      },
      {
        en: 'Hint and error are linked through `aria-describedby`; an error sets `aria-invalid="true"`, `required` sets `aria-required="true"`.',
        ru: 'Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid="true"`, `required` — `aria-required="true"`.',
      },
      {
        en: 'Items are `<button role="radio" aria-checked>` with roving `tabIndex`.',
        ru: 'Варианты — `<button role="radio" aria-checked>` с перемещаемым `tabIndex`.',
      },
      {
        en: 'With an `asChild` item the track is `role="navigation"` (named the same way), the links keep their role and the current one has `aria-current="page"`; `required` and `invalid` do not apply.',
        ru: 'С сегментом `asChild` дорожка — `role="navigation"` (с тем же именем), ссылки сохраняют свою роль, текущая — `aria-current="page"`; `required` и `invalid` не применяются.',
      },
      {
        en: "Two-line items: `aria-labelledby` = label (+ count), `aria-describedby` = description; plain text is the label, so every reference resolves.",
        ru: "В двухстрочном сегменте `aria-labelledby` — подпись (и счётчик), `aria-describedby` — описание; простой текст становится подписью, так что каждая ссылка находит элемент.",
      },
      {
        en: "Icons are `aria-hidden`; icon-only items need `aria-label` (and a Tooltip for sighted users). In a row collapsed to icons a `VisuallyHidden` copy of the title names the segment and a `Tooltip` shows it.",
        ru: "Иконки скрыты (`aria-hidden`); сегменту только с иконкой нужен `aria-label` (и Tooltip для зрячих). В строке, свёрнутой до иконок, сегмент называет копия подписи в `VisuallyHidden`, а `Tooltip` показывает её.",
      },
    ],
  },
};
