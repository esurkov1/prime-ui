import { api } from "@/components/banner/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "banner",
  title: "Banner",
  kind: "primitive",
  description:
    "Сообщение в потоке страницы, раздела или карточки: иконка статуса, заголовок, описание, действия и закрытие. Короткая реакция на действие — Notification.",
  examples: [
    {
      slot: "overview",
      description: "Объявление о работах: иконка, заголовок и описание на мягкой заливке info.",
    },
    {
      slot: "variants",
      description:
        "Все подачи на всех тонах: soft по умолчанию, solid для срочного, outline для спокойного — `variant`, `tone`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: отступы, иконка и заголовок по ярусу контрола, описание на ступень мельче — `size`.",
    },
    {
      slot: "structure",
      description:
        "Необязательные части: заголовок в строку, заголовок с описанием и действия, к которым присоединяется закрытие — `Banner.Description`, `Banner.Actions`, `onDismiss`.",
    },
    {
      scenario: "dismissible",
      title: "Закрытие",
      description:
        "Видимостью владеет родитель: кнопка закрытия вызывает колбэк, родитель убирает баннер; имя кнопки из labels — `onDismiss`, `labels`.",
    },
    {
      scenario: "page-strip",
      title: "Над страницей и в карточке",
      description:
        "Полоса во всю ширину над страницей и скруглённый блок в карточке — `placement`.",
    },
    {
      slot: "narrow",
      description: "Уже 36rem собственной ширины баннер переносит действия под текст.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Действия и кнопка закрытия — обычные кнопки в порядке Tab." },
    ],
    aria: [
      'Сам баннер без роли: ошибкам после действия задайте `role="alert"`, спокойным статусам — `role="status"`, полосе страницы — `role="region"` с `aria-label`.',
      "Иконка скрыта (`aria-hidden`): смысл несёт заголовок, а не цвет.",
      "Кнопка закрытия названа `labels.dismiss`; после закрытия верните фокус в разумное место.",
    ],
  },
};

export default function BannerSection() {
  return <ComponentPage page={page} />;
}
