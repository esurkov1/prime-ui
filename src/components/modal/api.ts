import type { ComponentApi } from "../../../scripts/docs/componentApi";

import {
  dialogContentAriaProps,
  dialogLabels,
  dialogParts,
  dialogRootProps,
  dialogSlotsPart,
} from "./dialog.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "Modal.Root",
      en: "No DOM, no ref. State and dismiss policy.",
      ru: "Состояние открытия и политика закрытия; своего DOM нет.",
      props: [
        ...dialogRootProps("Modal"),
        {
          name: "confirmOnEnter",
          type: "boolean",
          default: "true",
          en: "Enter inside the dialog clicks the element wrapped in `Modal.Confirm`.",
          ru: "Enter нажимает элемент в `Modal.Confirm` (кроме textarea, select, чекбоксов, шапки).",
        },
        {
          name: "onEnterConfirm",
          type: "(event: KeyboardEvent) => void",
          en: "Replaces the default Enter confirm.",
          ru: "Свой обработчик Enter вместо нажатия `Modal.Confirm`.",
        },
      ],
    },
    {
      name: "Modal.Content",
      en: 'No ref. Portal + scrim + `role="dialog"`; renders while open and during its exit animation. Controls inside get size `m`.',
      ru: "Портал, подложка и сам диалог: ловушка фокуса, блокировка прокрутки.",
      props: [
        {
          name: "size",
          type: '"s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Width: 440 · 560 · 720 · 960. Below 640 px of viewport — a full-width bottom sheet.",
          ru: "Ширина 440 · 560 · 720 · 960 px. Уже 640 px экрана — лист снизу на всю ширину.",
        },
        {
          name: "container",
          type: "HTMLElement | null",
          default: "document.body",
          en: "Portal target.",
          ru: "Узел для портала.",
        },
        ...dialogContentAriaProps,
      ],
    },
    ...dialogParts("Modal", '"fill" (s/m), "end" (l/xl)'),
    dialogSlotsPart("Modal", "Modal.Trigger · Modal.Close · Modal.Confirm"),
  ],
  labels: dialogLabels,
};
