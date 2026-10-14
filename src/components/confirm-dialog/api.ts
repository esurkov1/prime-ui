import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";

import { CONFIRM_DIALOG_LABELS } from "./ConfirmDialog";

export const api: ComponentApi = {
  parts: [
    {
      name: "ConfirmDialog.Root",
      en: 'No ref (state root). Renders its Trigger and a Modal `s` with `role="alertdialog"`: the question, the consequence, the reason after a failure, Cancel (focused first) and the confirm. While `onConfirm` runs nothing closes it.',
      ru: 'Подтверждение целиком: окно `s` с `role="alertdialog"`, вопрос, последствия, причина после ошибки, «Отмена» (в фокусе первой) и кнопка действия. Пока идёт `onConfirm`, окно не закрывается ничем.',
      props: [
        {
          name: "open",
          type: "boolean",
          en: "Controlled visibility; together with `onOpenChange`.",
          ru: "Управляемое открытие; вместе с `onOpenChange`.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial visibility, uncontrolled.",
          ru: "Начальное состояние без управления.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Called on open and close: the Trigger, Cancel, the close button, Escape, a resolved `onConfirm`.",
          ru: "Вызывается при открытии и закрытии: триггер, «Отмена», крестик, Escape, успешный `onConfirm`.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          en: "Escape closes the dialog, like Cancel.",
          ru: "Escape закрывает окно, как «Отмена».",
        },
        {
          name: "closeOnOutsideClick",
          type: "boolean",
          default: "false",
          en: "A click on the scrim (and on a phone a swipe down) closes the dialog. Off by default: a question about a weighty action is answered with a button, not by a stray click beside it.",
          ru: "Клик по подложке (и на телефоне свайп вниз) закрывает окно. По умолчанию выключено: на вопрос о весомом действии отвечают кнопкой, а не случайным кликом мимо.",
        },
        {
          name: "title",
          type: "ReactNode",
          required: true,
          en: "The question as a heading («Удалить проект?»); names the dialog.",
          ru: "Вопрос заголовком («Удалить проект?»); имя диалога.",
        },
        {
          name: "description",
          type: "ReactNode",
          en: "What happens and what cannot be undone; describes the dialog.",
          ru: "Что произойдёт и что нельзя отменить; описание диалога.",
        },
        {
          name: "confirmLabel",
          type: "ReactNode",
          required: true,
          en: "The confirm button: the action as a verb («Удалить»), never «Да» or «ОК».",
          ru: "Кнопка действия: глагол («Удалить»), не «Да» и не «ОК».",
        },
        {
          name: "tone",
          type: '"danger" | "accent"',
          default: '"danger"',
          en: "`danger`: a destructive action, solid danger confirm. `accent`: a weighty but safe one (send, publish), solid accent confirm.",
          ru: "`danger` — разрушительное действие, кнопка solid danger; `accent` — весомое, но безопасное (отправить, опубликовать).",
        },
        {
          name: "onConfirm",
          type: "() => unknown",
          required: true,
          en: "The action. A pending Promise keeps the dialog busy (`loading`, nothing closes it). Resolve closes it; reject keeps it open with the reason: the `Error.message` or string, else `labels.error`.",
          ru: "Действие. Пока Promise не завершён, окно занято (`loading`, ничто его не закрывает). Успех закрывает окно; отказ оставляет с причиной: `Error.message` или строка, иначе `labels.error`.",
        },
        {
          name: "labels",
          type: "Partial<ConfirmDialogLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`ConfirmDialog.Trigger`; nothing when `open` comes from code.",
          ru: "`ConfirmDialog.Trigger`; ничего, если открытием управляет код.",
        },
      ],
    },
    {
      name: "ConfirmDialog.Trigger",
      en: "No DOM: clones the single child and chains its `onClick` to open the dialog (unless the child's handler calls `preventDefault()`); focus returns to it on close.",
      ru: "Без DOM: клонирует единственный элемент и добавляет к его `onClick` открытие окна (если обработчик элемента не вызвал `preventDefault()`); фокус возвращается на него при закрытии.",
      props: [
        {
          name: "children",
          type: "ReactElement",
          required: true,
          en: 'One element, usually a Button with `tone="danger"`.',
          ru: 'Ровно один элемент, обычно Button с `tone="danger"`.',
        },
      ],
    },
  ],
  labels: labelRows(CONFIRM_DIALOG_LABELS, {
    cancel: {
      en: "The cancel button.",
      ru: "Кнопка отмены.",
    },
    close: {
      en: "`aria-label` of the header close button.",
      ru: "`aria-label` кнопки закрытия в шапке.",
    },
    error: {
      en: "The message after a rejected `onConfirm` without a reason of its own.",
      ru: "Сообщение после отказа `onConfirm` без своей причины.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab · Shift+Tab",
        en: "Cycles focus inside the dialog; Cancel is focused first.",
        ru: "Переводит фокус по кругу внутри окна; первой в фокусе «Отмена».",
      },
      {
        keys: "Enter",
        en: "On a button presses it; from the dialog itself presses the confirm.",
        ru: "На кнопке нажимает её; из самого окна — кнопку действия.",
      },
      {
        keys: "Escape",
        en: "Closes the dialog (`closeOnEscape`) unless the action runs; focus returns to the trigger.",
        ru: "Закрывает окно (`closeOnEscape`), если не идёт запрос; фокус возвращается на триггер.",
      },
    ],
    aria: [
      {
        en: '`role="alertdialog"`, `aria-modal="true"`, named by `title`, described by `description`.',
        ru: '`role="alertdialog"` и `aria-modal="true"`; имя — `title`, описание — `description`.',
      },
      {
        en: "Cancel takes focus first — the least destructive choice.",
        ru: "Первой фокус получает «Отмена» — наименее опасный выбор.",
      },
      {
        en: 'While the action runs the confirm has `aria-busy="true"`; Cancel and the close button are disabled.',
        ru: 'Пока идёт запрос, у кнопки действия `aria-busy="true"`, «Отмена» и крестик выключены.',
      },
      {
        en: 'The reason of a failure is `role="alert"`, read at once.',
        ru: 'Причина ошибки — `role="alert"`, её зачитывают сразу.',
      },
    ],
  },
};
