import { api } from "@/components/textarea/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { TextAlignStart } from "../icons";

export const page: ComponentPageConfig = {
  category: "inputs",
  nav: {
    segment: "textarea",
    label: "Textarea",
    summary: "Многострочное поле со счётчиком символов",
    keywords: ["текстовая область", "многострочное", "maxLength", "onValueChange"],
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
        "Обычное поле рядом с полем только для чтения и неактивным — `readOnly`, `disabled`.",
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
        "Поле, которое растёт с текстом, рядом с фиксированным и ручкой resize — `autoResize`, `rows`.",
    },
    {
      scenario: "without-focus-ring",
      title: "Без кольца фокуса",
      description: "Одно поле ответа, где фокус видно по каретке и светлой заливке — `focusRing`.",
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
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Фокус в поле; Enter переносит строку, а не отправляет форму." },
    ],
    aria: [
      "`label` — настоящий `<label htmlFor>`; без него задайте `aria-label`. Плейсхолдер не заменяет подпись.",
      'Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid="true"`.',
      "Поле — `<div>`, а не `<label>`: счётчик и подсказка не попадают в имя поля. Клик по отступу фокусирует textarea.",
      '`Textarea.Counter` показывает «12/280», а скринридер читает `labels.counter` через `aria-live="polite"`.',
    ],
  },
};
