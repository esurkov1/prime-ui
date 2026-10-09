import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "ConfirmDialog.Root",
      en: 'No ref (state root). Renders its Trigger and a Modal `s` with `role="alertdialog"`: the title, the description, an inline danger message after a failure, Cancel (focused first) and the confirm. A press outside never closes it; while `onConfirm` runs nothing closes it.',
      ru: "Подтверждение действия целиком: окно `s`, вопрос, последствия, «Отмена» и кнопка действия. Клик мимо не закрывает; пока идёт запрос — не закрывается ничем.",
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
          en: "The action. A Promise keeps the dialog busy: the confirm shows `loading`, Cancel and the close button are disabled, Escape is ignored. Resolve closes the dialog; reject keeps it open with `error` (else `labels.error`).",
          ru: "Действие. Пока Promise не завершён: кнопка в `loading`, «Отмена» и крестик выключены, Escape не работает. Успех закрывает окно; ошибка оставляет его открытым с `error` (иначе `labels.error`).",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Why the action failed, from the owner; shown under the text while set.",
          ru: "Причина ошибки от владельца; показывается под текстом, пока задана.",
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
      ru: "Без DOM: клик по дочернему элементу открывает окно; фокус возвращается на него.",
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
  labels: [
    {
      key: "cancel",
      default: "Отмена",
      en: "The cancel button.",
      ru: "Кнопка отмены.",
    },
    {
      key: "close",
      default: "Закрыть",
      en: "`aria-label` of the header close button.",
      ru: "`aria-label` кнопки закрытия в шапке.",
    },
    {
      key: "error",
      default: "Не получилось. Попробуйте ещё раз.",
      en: "The message after a rejected `onConfirm` when there is no `error`.",
      ru: "Сообщение после ошибки `onConfirm`, если `error` не задан.",
    },
  ],
};
