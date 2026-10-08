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
      en: '`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel raised from the bottom edge: a grab handle on top (`aria-hidden`), height by content up to `100dvh − --prime-sheet-top-gap`, rounded on top; centred at `--prime-sheet-width` (560) on a tablet or desktop, full width below it. Header and footer are optional: without a header give it `aria-label`. A swipe down from the handle or the header closes it (with `closeOnOutsideClick`). Renders while open and during its exit animation, showing the children it had open.',
      ru: "Портал, подложка и панель, поднятая от нижнего края: ручка сверху, высота по содержимому, скругление сверху; по центру шириной 560 px на планшете и десктопе, на всю ширину на телефоне. Шапка и подвал не обязательны: без шапки задайте `aria-label`. Свайп вниз за ручку или шапку закрывает её (при `closeOnOutsideClick`).",
      props: dialogContentAriaProps,
    },
    ...dialogParts("Sheet", '"end"'),
    dialogSlotsPart("Sheet", "Sheet.Trigger · Sheet.Close"),
  ],
  labels: dialogLabels,
};
