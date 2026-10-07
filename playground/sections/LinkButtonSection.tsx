import { api } from "@/components/link-button/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "link-button",
  title: "LinkButton",
  kind: "primitive",
  description:
    'Настоящая ссылка в виде текстового действия, на ярусах контролов. Для действия без адреса — Button с `variant="ghost"`.',
  examples: [
    {
      slot: "overview",
      description: "Ссылка внутри текста, того же кегля, что и текст — `href`.",
    },
    {
      slot: "variants",
      description: "Обычная ссылка и тихая для футеров и метаданных — `tone`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы; кегль и иконка следуют ярусу, от xs 12 до xl 18 — `size`.",
    },
    {
      slot: "states",
      description:
        "Неактивная ссылка теряет `href` и выходит из порядка Tab, в обоих тонах — `disabled`.",
    },
    {
      slot: "with-icon",
      description: "Иконка до или после текста; `Icon` без размера берёт ярус ссылки — `Icon`.",
    },
    {
      scenario: "external-link",
      title: "Внешняя ссылка",
      description:
        "Ссылка из приложения открывает новую вкладку и говорит об этом в тексте — `target`, `rel`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Enter", action: "Переходит по ссылке (нативное поведение `<a>`)." },
      { keys: "Tab", action: "Переводит фокус; неактивная ссылка пропускается." },
    ],
    aria: [
      "Нативный `<a>`: объявляется как ссылка, имя — её текст.",
      'Неактивная ссылка — `<span role="link" aria-disabled="true">` вне порядка фокуса.',
      "Иконки декоративные; о новой вкладке скажите в тексте или в `aria-label`.",
    ],
  },
};

export default function LinkButtonSection() {
  return <ComponentPage page={page} />;
}
