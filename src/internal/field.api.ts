import type { ApiProp } from "../../scripts/docs/componentApi";

/**
 * `…rest` of a framed field's root (`FieldRootDomProps`). The rule of every field root:
 * `className`, `ref` and the rest go to the frame `<div>`, `id` to the control.
 */
export const FIELD_ROOT_REST: ApiProp = {
  name: "…rest",
  type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
  en: "`className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control).",
  ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля (правило корня поля: `className`, `ref` и остальное → рамка, `id` → контрол).",
};
