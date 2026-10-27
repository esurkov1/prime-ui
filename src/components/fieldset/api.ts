import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Fieldset",
      en: "`ref` → `HTMLFieldSetElement`. A native `<fieldset>` without border, padding or fill: the `<legend>` heading, an optional description, then the children at the form rhythm. `disabled` disables every control inside.",
      ru: "Нативный `<fieldset>` без рамки, отступов и заливки: заголовок `<legend>`, необязательное описание, затем поля в ритме формы. `disabled` выключает все контролы внутри.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Group heading in the native `<legend>` (`title-s`), the group name. Without it the fieldset is the plain field column of a form; give it an `aria-label` when the group needs a name.",
          ru: "Заголовок группы в нативном `<legend>` (`title-s`), имя группы. Без него это просто колонка полей формы; задайте `aria-label`, если группе нужно имя.",
        },
        {
          name: "description",
          type: "ReactNode",
          en: "Secondary text under the heading (`body-s`, secondary), linked through `aria-describedby`.",
          ru: "Пояснение под заголовком (`body-s`, вторичный цвет), связано через `aria-describedby`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables every kit control inside (each takes its own disabled look, ARIA and keyboard, in place); nested groups inherit it. A native control of your own takes `disabled` itself. Use it while the form's request runs.",
          ru: "Выключает все контролы кита внутри (каждый на месте принимает свой вид, ARIA и клавиатуру неактивного); вложенные группы наследуют его. Свой нативный контрол выключайте его `disabled`. Используйте на время запроса формы.",
        },
        {
          name: "layout",
          type: '"stack" | "pair"',
          default: '"stack"',
          en: "How the fields stand: `stack` — one column; `pair` — two equal columns 20 apart, a field left alone in the last row spans it, and below 27.5rem of group width (`--prime-layout-form-width-s`) one column again.",
          ru: "Как стоят поля: `stack` — в одну колонку; `pair` — по два в ряд, через 20; поле, оставшееся одно в последнем ряду, занимает весь ряд; уже 27.5rem ширины группы (`--prime-layout-form-width-s`) — снова одна колонка.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The fields, 20 apart, in the `layout`; each direct child is one cell — a nested `Fieldset` without `label` keeps a part of the group in its own `layout`.",
          ru: "Поля, через 20 друг от друга, по `layout`; каждый прямой потомок — одна ячейка, вложенный `Fieldset` без `label` держит часть группы в своём `layout`.",
        },
        {
          name: "…rest",
          type: 'Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children" | "disabled">',
          en: "`className`, `name`, `form`, `aria-*` and the other attributes of the `<fieldset>`.",
          ru: "`className`, `name`, `form`, `aria-*` и остальные атрибуты `<fieldset>`.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves through the group's fields; the fields of a disabled group are skipped.",
        ru: "Проходит по полям группы; в выключенной группе поля пропускаются.",
      },
    ],
    aria: [
      {
        en: 'The native `<fieldset>` is a group (`role="group"`) named by the `<legend>` text from `label`; without a heading give it `aria-label`.',
        ru: 'Нативный `<fieldset>` — группа (`role="group"`), её имя — текст `<legend>` из `label`; без заголовка задайте `aria-label`.',
      },
      {
        en: "`description` is linked to the group through `aria-describedby`.",
        ru: "`description` связан с группой через `aria-describedby`.",
      },
      {
        en: "`disabled` sets `aria-disabled` on the group, never native `disabled`, and passes a context: kit controls set their own `disabled` / `aria-disabled` in place, so a `Tooltip.Trigger` inside never re-hosts one.",
        ru: "`disabled` ставит группе `aria-disabled`, а не нативный `disabled`, и передаёт контекст: контролы кита на месте ставят свои `disabled` / `aria-disabled`, и `Tooltip.Trigger` внутри не переносит их.",
      },
    ],
  },
};
