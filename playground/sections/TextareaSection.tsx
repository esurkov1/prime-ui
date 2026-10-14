import { api } from "@/components/textarea/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { TextAlignStart } from "../icons";

export const page: ComponentPageConfig = {
  category: "inputs",
  nav: {
    segment: "textarea",
    label: "Textarea",
    summary: "Многострочное поле со счётчиком символов",
    keywords: [
      "текстовая область",
      "многострочное",
      "maxLength",
      "onValueChange",
      "форматирование",
      "markdown",
    ],
    icon: TextAlignStart,
    order: 2,
  },
  dir: "textarea",
  title: "Textarea",
  kind: "field",
  description:
    "Многострочное поле для комментариев, описаний и обращений. Повторяет контракт Input: подпись сверху, поле на заливке, строка поддержки со счётчиком снизу.",
  examples: [
    {
      slot: "overview",
      description: "Поле с подписью и подсказкой; высота следует за текстом — `label`, `hint`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы; кегль, отступы, подпись и подсказка берут ярус — `size`.",
    },
    {
      slot: "states",
      description:
        "Обычное поле рядом с полем только для чтения, неактивным и ошибочным без текста — `readOnly`, `disabled`, `invalid`.",
    },
    {
      slot: "validation",
      description:
        "Живая проверка: с ошибкой поле встряхивается, сообщение выезжает и уходит, как только значение исправлено; пометки обязательного и необязательного поля, подсказка и строка поддержки без сдвига — `required`, `optional`, `hint`, `error`, `reserveSupportRow`.",
    },
    {
      scenario: "auto-resize",
      title: "Высота",
      description:
        "Поле, которое растёт с текстом, поле с одной строки, которое после пяти строк прокручивается, и фиксированное с ручкой resize — `autoResize`, `rows`, `maxRows`.",
    },
    {
      scenario: "without-focus-ring",
      title: "Без кольца фокуса",
      description: "Одно поле ответа, где фокус видно по каретке и светлой заливке — `focusRing`.",
    },
    {
      scenario: "edge-actions",
      title: "Действия в поле",
      description:
        "Готовый ответ только для чтения с копированием и ссылкой на шаблон в углу поля — `Textarea.CopyButton`, `Textarea.Action`.",
    },
    {
      scenario: "inline-edit",
      title: "Правка на месте",
      description:
        "Заметка карточки сохраняется при выходе из поля и по Mod+Enter, Escape отменяет правку, отказ сервера показан ошибкой — `onCommit`, `error`.",
    },
    {
      scenario: "formatting",
      title: "Форматирование",
      description:
        "Длинное объявление: над выделенным текстом появляется панель оформления с сочетаниями клавиш, оформление пишется Markdown вокруг выделения — `formatting`.",
    },
    {
      slot: "controlled",
      description:
        "Текстом владеет родитель; счётчик следует за ним, `maxLength` не даёт ввести лишнее — `value`, `onValueChange`, `Textarea.Counter`, `maxLength`.",
    },
    {
      slot: "in-form",
      description:
        "Обращение в поддержку: описание проверяется при отправке, ошибка уходит, как только текста хватает, и не сдвигает форму, а отправленное обращение красит кнопку в зелёный — `required`, `error`, `reserveSupportRow`.",
    },
  ],
  api,
};
