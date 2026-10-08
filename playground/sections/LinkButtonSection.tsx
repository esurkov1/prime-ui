import { api } from "@/components/link-button/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Link2 } from "../icons";

export const page: ComponentPageConfig = {
  category: "actions",
  nav: {
    segment: "link-button",
    label: "Link Button",
    summary: "Ссылка, оформленная как текстовое действие",
    keywords: ["ссылка", "link", "href", "underline"],
    icon: Link2,
    order: 3,
  },
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
    {
      scenario: "as-child",
      title: "Кнопка в виде ссылки",
      description:
        "Вид ссылки на кнопке для действия в тексте, которое никуда не ведёт — `asChild`.",
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
      'Неактивная ссылка — `<a role="link" aria-disabled="true">` без `href`, вне порядка фокуса.',
      "С `asChild` роль и имя даёт вложенный элемент: ссылка роутера или `<button>` для действия.",
      "Иконки декоративные; о новой вкладке скажите в тексте или в `aria-label`.",
    ],
  },
};
