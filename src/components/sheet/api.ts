import type { ComponentApi } from "../../../scripts/docs/componentApi";

import {
  dialogContentAriaProps,
  dialogLabels,
  dialogParts,
  dialogRootProps,
  dialogSlotsPart,
} from "../modal/dialog.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "Sheet.Root",
      en: "No DOM, no ref. State and dismiss policy.",
      ru: "Состояние открытия и политика закрытия; своего DOM нет.",
      props: dialogRootProps("Sheet"),
    },
    {
      name: "Sheet.Content",
      en: '`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel raised from the bottom edge, as tall as its content. Header and footer are optional: without a header name it with `aria-label`.',
      ru: 'Портал, подложка и панель `role="dialog"`, поднятая от нижнего края, высотой по содержимому. Шапка и подвал не обязательны: без шапки назовите панель через `aria-label`.',
      props: dialogContentAriaProps,
    },
    ...dialogParts("Sheet", '"end"'),
    dialogSlotsPart("Sheet", "Sheet.Trigger · Sheet.Close"),
  ],
  labels: dialogLabels,
};
