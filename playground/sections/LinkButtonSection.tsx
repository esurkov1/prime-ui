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
      description:
        "Ссылка внутри текста берёт его шрифт и держит подчёркивание — `href`, `inline`.",
    },
    {
      slot: "variants",
      description:
        "Обычная ссылка, тихая для футеров и метаданных и приглушённая для цепочек — `tone`.",
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
};
