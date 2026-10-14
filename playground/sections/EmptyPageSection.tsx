import { api } from "@/components/empty-page/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Inbox } from "../icons";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "empty-page",
    label: "Empty Page",
    summary: "Пустое состояние страницы или блока",
    keywords: ["пусто", "пустое состояние", "empty state"],
    icon: Inbox,
    order: 7,
  },
  dir: "empty-page",
  title: "EmptyPage",
  kind: "composite",
  description:
    "Пустое состояние или ошибка загрузки страницы, таблицы, карточки или меню: иконка, заголовок, пояснение и следующее действие — в том числе повтор.",
  examples: [
    {
      slot: "overview",
      description:
        "Пустой результат поиска: иконка, заголовок, пояснение и два действия — `EmptyPage.Icon`, `EmptyPage.Actions`.",
    },
    {
      slot: "variants",
      description:
        "Тон говорит, почему пусто: данных ещё нет, первый запуск или ошибка загрузки с повтором — `tone`, `EmptyPage.RetryButton`.",
    },
    {
      slot: "sizes",
      description:
        "Каждый ярус меняет плашку иконки, заголовок и отступы; кнопки в Actions того же размера — `size`.",
    },
    {
      scenario: "data-region",
      title: "Пустая область данных",
      description: "Пустое состояние растягивается на остаток карточки с шапкой — `layout`.",
    },
    {
      scenario: "region-error",
      title: "Ошибка загрузки региона",
      description:
        "Регион данных не загрузился: ошибка занимает регион, повтор показывает загрузку, пока данные не проявятся; его текст — из labels — `tone`, `layout`, `EmptyPage.RetryButton`, `onRetry`, `labels`.",
    },
    {
      scenario: "compact",
      title: "В меню и списке",
      description:
        "Тихое пустое состояние во всплывающей панели поиска: без анимации появления, мельче текст, заголовок абзацем, одно действие — `layout`, `as`.",
    },
    {
      slot: "narrow",
      description:
        "В боковой панели 320 px текст переносится под плашкой, а действия — на вторую строку — `EmptyPage.Actions`.",
    },
  ],
  api,
};
