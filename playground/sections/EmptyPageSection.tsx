import { api } from "@/components/empty-page/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "empty-page",
  title: "EmptyPage",
  kind: "composite",
  description:
    "Пустое состояние страницы, таблицы, карточки или меню: иконка, заголовок, пояснение и следующее действие.",
  examples: [
    {
      slot: "overview",
      description:
        "Пустой результат поиска: иконка, заголовок, пояснение и два действия — `EmptyPage.Icon`, `EmptyPage.Actions`.",
    },
    {
      slot: "sizes",
      description:
        "Каждый ярус меняет плашку иконки, заголовок и отступы; кнопки в Actions того же размера — `size`.",
    },
    {
      scenario: "icon-tones",
      title: "Тон иконки",
      description:
        "Тон плашки говорит, почему пусто: данных ещё нет, первый запуск или ошибка загрузки — `tone`.",
    },
    {
      scenario: "data-region",
      title: "Пустая область данных",
      description: "Пустое состояние растягивается на остаток карточки с шапкой — `layout`.",
    },
    {
      scenario: "compact",
      title: "В меню и списке",
      description:
        "Тихое пустое состояние панели поиска: без анимации появления, мельче текст, одно действие — `layout`.",
    },
    {
      slot: "narrow",
      description:
        "В боковой панели 320 px текст переносится под плашкой, а действия — на вторую строку.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Заголовок — `<h2>`; свяжите с ним корень через `aria-labelledby`, когда пустое состояние заменяет целую область.",
      'В фильтруемом меню или списке задайте `role="status"`, чтобы скринридер объявил «Ничего не найдено».',
      "Иконка декоративна: передавайте её с `aria-hidden`.",
    ],
  },
};

export default function EmptyPageSection() {
  return <ComponentPage page={page} />;
}
