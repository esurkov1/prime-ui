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
          en: "Group heading in the native `<legend>` (`title-s`); it names the group for assistive tech. Without it give the fieldset an `aria-label` when the group needs a name.",
          ru: "Заголовок группы в нативном `<legend>` (`title-s`); он же имя группы для вспомогательных технологий. Без него задайте `aria-label`, если группе нужно имя.",
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
          en: "Disables every control inside, native and kit (they take their own disabled look, ARIA and keyboard); nested groups inherit it. Use it while the form's request runs.",
          ru: "Выключает все контролы внутри, нативные и кита (они принимают свой вид, ARIA и клавиатуру неактивного); вложенные группы наследуют его. Используйте на время запроса формы.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The fields, stacked 20 apart; a row of two fields is the consumer's grid.",
          ru: "Поля, через 20 друг от друга; ряд из двух полей — сетка потребителя.",
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
};
