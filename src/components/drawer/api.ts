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
      name: "Drawer.Root",
      en: "No DOM, no ref. State and dismiss policy.",
      ru: "Состояние открытия и политика закрытия; своего DOM нет.",
      props: dialogRootProps("Drawer"),
    },
    {
      name: "Drawer.Content",
      en: 'No ref. Portal + scrim + `role="dialog"` panel at the edge; renders while open and during its exit animation.',
      ru: "Портал, подложка и панель у края экрана: ловушка фокуса, блокировка прокрутки.",
      props: [
        {
          name: "side",
          type: '"left" | "right"',
          default: '"right"',
          en: "Edge the panel slides from; rounded only on the edge facing the page.",
          ru: "Край, от которого выезжает панель; скругление только со стороны страницы.",
        },
        {
          name: "size",
          type: '"s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Width: 360 · 480 · 640 · 800. Below 640 px of viewport — full width, square corners.",
          ru: "Ширина 360 · 480 · 640 · 800 px. Уже 640 px экрана — на всю ширину без скруглений.",
        },
        ...dialogContentAriaProps,
      ],
    },
    ...dialogParts("Drawer", '"end"'),
    dialogSlotsPart("Drawer", "Drawer.Trigger · Drawer.Close"),
  ],
  labels: dialogLabels,
};
