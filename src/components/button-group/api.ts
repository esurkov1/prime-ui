import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { FIELD_OPTIONAL_LABEL_DOCS, fieldGroupProps } from "../../internal/field.api";
import { BUTTON_GROUP_LABELS } from "./ButtonGroup";

export const api: ComponentApi = {
  parts: [
    {
      name: "ButtonGroup.Root",
      en: '`ref` → `HTMLDivElement` (the field frame). The field: label · `<div role="group">` with the segments (a row scrolls as a switcher, a column stacks) · support row; sets the tier and orientation of every segment. The frame hugs the group unless `fullWidth`.',
      ru: 'Поле: подпись · `<div role="group">` с сегментами (ряд прокручивается как переключатель, колонка складывается стопкой) · строка поддержки; задаёт ярус и направление всех сегментов. Рамка облегает группу, если не задан `fullWidth`.',
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Control tier of every segment: height 28 · 32 · 36 · 40 · 48, padding, text, icon. Without it the tier of its host (a toolbar, a panel), else `m`.",
          ru: "Ярус всех сегментов: высота 28 · 32 · 36 · 40 · 48, отступы, кегль, иконка. Без него — ярус хоста (панель, тулбар), иначе `m`.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          en: "Direction of the segments; `vertical` stretches them to the widest.",
          ru: "Направление сегментов; `vertical` растягивает их по самому широкому.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          en: "Stretches the group; horizontal segments tend to equal widths but never get narrower than their label (the row scrolls instead).",
          ru: "Растянуть группу; горизонтальные сегменты стремятся к равной ширине, но не уже своей подписи (иначе ряд прокручивается).",
        },
        ...fieldGroupProps("group", "ButtonGroupLabels"),
        {
          name: "children",
          type: "ReactNode",
          en: "`ButtonGroup.Item` segments.",
          ru: "Сегменты `ButtonGroup.Item`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange" | "dir">',
          en: '`aria-label` / `aria-labelledby` / `aria-describedby` and `role` (e.g. `"toolbar"`) go to the group element; `className`, `data-*` and the other attributes to the field frame `<div>`.',
          ru: '`aria-label` / `aria-labelledby` / `aria-describedby` и `role` (например `"toolbar"`) — на элемент группы; `className`, `data-*` и остальное — на `<div>` рамки поля.',
        },
      ],
    },
    {
      name: "ButtonGroup.Item",
      en: "`ref` → `HTMLButtonElement`. One segment, a native `<button>`.",
      ru: "Один сегмент — нативная `<button>`.",
      props: [
        {
          name: "pressed",
          type: "boolean",
          en: 'Toggle state: `aria-pressed` and `data-state="active" | "inactive"`. Leave it out for a plain action segment.',
          ru: 'Состояние переключателя: `aria-pressed` и `data-state="active" | "inactive"`. Не задавайте для обычного действия.',
        },
        {
          name: "disabled",
          type: "boolean",
          en: "Native disabled; a disabled `Fieldset` around the group sets it too.",
          ru: "Нативное неактивное состояние; неактивный `Fieldset` вокруг группы включает его тоже.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Label and `ButtonGroup.Icon`. Only icons → square segment; give it `aria-label`.",
          ru: "Подпись и `ButtonGroup.Icon`. Только иконки — квадратный сегмент, ему нужен `aria-label`.",
        },
        {
          name: "…rest",
          type: "ButtonHTMLAttributes<HTMLButtonElement>",
          en: '`type` (`"button"` unless set: `"submit"` / `"reset"` in a form), `onClick`, `className`, `aria-*` and the other button attributes.',
          ru: '`type` (`"button"`, если не задан: `"submit"` / `"reset"` в форме), `onClick`, `className`, `aria-*` и остальные атрибуты кнопки.',
        },
      ],
    },
    {
      name: "ButtonGroup.Icon",
      en: "`ref` → `HTMLSpanElement`. Decorative icon wrapper (`aria-hidden`) sized to the group tier.",
      ru: "Декоративная обёртка иконки (`aria-hidden`) размера яруса группы.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="action.copy" />`.',
          ru: 'Иконка, например `<Icon name="action.copy" />`.',
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
  labels: labelRows(BUTTON_GROUP_LABELS, FIELD_OPTIONAL_LABEL_DOCS),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves focus between segments; a disabled one is skipped.",
        ru: "Переводит фокус между сегментами; неактивный пропускается.",
      },
      {
        keys: "Enter · Space",
        en: "Presses the segment (native `<button>`).",
        ru: "Нажимает сегмент (нативная `<button>`).",
      },
    ],
    aria: [
      {
        en: 'The group element is `role="group"`, named by `label` (`aria-labelledby`); without a label give the root `aria-label`. Set `role="toolbar"` on the outer container of several groups.',
        ru: 'Группа — `role="group"`: её называет `label` (`aria-labelledby`), иначе задайте `aria-label`; для нескольких групп поставьте `role="toolbar"` на общий контейнер.',
      },
      {
        en: 'Hint and error are linked through `aria-describedby`; an error sets `aria-invalid="true"`, `required` sets `aria-required="true"`.',
        ru: 'Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid="true"`, `required` — `aria-required="true"`.',
      },
      {
        en: "Toggle segments expose `aria-pressed`; in a toggle set pass `pressed={false}` to the inactive ones.",
        ru: "Сегменты-переключатели объявляют `aria-pressed`; в наборе переключателей передайте `pressed={false}` остальным.",
      },
      {
        en: "Icon-only segments need `aria-label`; `ButtonGroup.Icon` is `aria-hidden`.",
        ru: "Сегменту только с иконкой нужен `aria-label`; `ButtonGroup.Icon` скрыт (`aria-hidden`).",
      },
    ],
  },
};
