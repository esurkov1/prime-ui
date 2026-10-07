import type { ApiProp } from "../../scripts/docs/componentApi";

/** `…rest` of a framed field's root (`FieldRootDomProps`): native attributes of the frame `<div>`. */
export const FIELD_ROOT_REST: ApiProp = {
  name: "…rest",
  type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
  en: "`className`, `data-*` and the other attributes of the field frame `<div>`; `id` goes to the control.",
  ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля; `id` уходит контролу.",
};
