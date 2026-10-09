import type { ComponentApi } from "../../../scripts/docs/componentApi";
import { FIELD_OPTIONAL_LABEL, fieldGroupProps } from "../../internal/field.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "ButtonGroup.Root",
      en: '`ref` → `HTMLDivElement` (the field frame). The field: label · `<div role="group">` with the segments · support row; sets the tier and orientation of every segment and passes the tier to nested icons. The frame hugs the group unless `fullWidth`.',
      ru: 'Поле: подпись · `<div role="group">` с сегментами · строка поддержки; задаёт ярус и направление всех сегментов и передаёт ярус иконкам.',
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Control tier of every segment: height 28 · 32 · 36 · 40 · 48, padding, text, icon. Without it the tier of its host (a toolbar, a panel), else `m`.",
          ru: "Ярус всех сегментов: высота 28 · 32 · 36 · 40 · 48, отступы, кегль, иконка.",
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
          en: "Stretches the group; horizontal segments share the width equally.",
          ru: "Растянуть группу; горизонтальные сегменты делят ширину поровну.",
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
          ru: "Состояние переключателя: `aria-pressed` и `data-state`. Не задавайте для обычного действия.",
        },
        {
          name: "type",
          type: '"button" | "submit" | "reset"',
          default: '"button"',
          en: "Native button type.",
          ru: "Тип нативной кнопки.",
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
          en: "`onClick`, `className`, `aria-*` and the other button attributes.",
          ru: "`onClick`, `className`, `aria-*` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "ButtonGroup.Icon",
      en: "`ref` → `HTMLSpanElement`. Decorative icon wrapper (`aria-hidden`) sized to the group tier.",
      ru: "Иконка размера яруса группы; скрыта от скринридеров.",
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
  labels: [FIELD_OPTIONAL_LABEL],
};
