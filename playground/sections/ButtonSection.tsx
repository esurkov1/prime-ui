import { api } from "@/components/button/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "button",
  title: "Button",
  kind: "primitive",
  description:
    "Кнопка для явных действий: сохранить, отправить, удалить. `tone` задаёт смысл действия, `variant` — подачу, `size` — ярус контрола.",
  examples: [
    {
      slot: "overview",
      description: "Главное действие и второстепенное рядом — `variant`, `tone`.",
    },
    { slot: "variants", description: "Все подачи во всех тонах — `variant`, `tone`." },
    { slot: "sizes", description: "Все ярусы, от 28 до 48 px в высоту — `size`." },
    {
      slot: "states",
      description:
        "Неактивная и загрузка рядом с обычной; спиннер не меняет ширину — `disabled`, `loading`.",
    },
    {
      slot: "with-icon",
      description:
        "Иконка до или после подписи и квадратная кнопка только с иконкой — `Button.Icon`, `aria-label`.",
    },
    {
      scenario: "as-child",
      title: "Как ссылка",
      description:
        "Вид кнопки на настоящей ссылке; неактивная ссылка не переходит — `asChild`, `disabled`.",
    },
    {
      slot: "in-form",
      description:
        "Кнопка отправки на всю ширину показывает идущий запрос — `type`, `loading`, `fullWidth`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Enter · Space", action: "Нажимает кнопку (нативное поведение `<button>`)." },
      {
        keys: "Tab",
        action:
          "Переводит фокус; неактивная кнопка пропускается, а с `asChild` остаётся в порядке фокуса с `aria-disabled`.",
      },
    ],
    aria: [
      'Нативный `<button type="button">`: случайно не отправит форму.',
      "Кнопке только с иконкой нужен `aria-label`; `Button.Icon` скрыт (`aria-hidden`).",
      '`loading` ставит `aria-busy="true"` и блокирует нажатие.',
      'С `asChild` неактивное состояние — `aria-disabled="true"` без нативного `disabled`.',
    ],
  },
};

export default function ButtonSection() {
  return <ComponentPage page={page} />;
}
