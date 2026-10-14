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
  accessibility: {
    keyboard: [
      {
        keys: "Escape",
        en: "Closes the sheet (`closeOnEscape`); focus returns to the trigger.",
        ru: "Закрывает шторку (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Tab · Shift+Tab",
        en: "Cycle focus inside the sheet.",
        ru: "Переводит фокус по кругу внутри шторки.",
      },
    ],
    aria: [
      {
        en: '`role="dialog"`, `aria-modal="true"`, named by Title — without a header by `aria-label` on `Sheet.Content`; described by Description.',
        ru: '`role="dialog"` и `aria-modal="true"`; имя — `Sheet.Title`, а без шапки — `aria-label` на `Sheet.Content`.',
      },
      {
        en: "Focus moves into the sheet on open and returns to the opener on close, including after a scrim click.",
        ru: "При открытии фокус уходит в шторку, при закрытии — на элемент, открывший её.",
      },
      {
        en: "The page behind is `inert`, scroll is locked; only the topmost layer reacts.",
        ru: "Страница за шторкой неактивна (`inert`), прокрутка заблокирована; реагирует только верхний слой.",
      },
      {
        en: "A swipe down is an extra way out; Escape and the scrim stay. The grab handle is `aria-hidden`.",
        ru: "Свайп вниз за ручку или шапку — дополнительный способ закрыть шторку; Escape и подложка остаются. Ручка скрыта от скринридеров.",
      },
      {
        en: 'A busy `Guard` holds every dismiss, the swipe included; a dirty one opens a `role="alertdialog"` confirm with focus on «Продолжить».',
        ru: '`Sheet.Guard busy` удерживает все способы закрытия, свайп тоже; `dirty` открывает подтверждение `role="alertdialog"`.',
      },
    ],
  },
};
