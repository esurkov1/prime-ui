import { api } from "@/components/banner/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Megaphone } from "../icons";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "banner",
    label: "Banner",
    summary: "Баннер: сообщение на всю ширину",
    keywords: ["баннер", "сообщение", "alert", "tone"],
    icon: Megaphone,
    order: 1,
  },
  dir: "banner",
  title: "Banner",
  kind: "primitive",
  description:
    "Сообщение в потоке страницы, раздела или карточки: иконка статуса, заголовок, описание, действия и закрытие. Короткая реакция на действие — Notification.",
  examples: [
    {
      slot: "overview",
      description:
        "Объявление о работах: иконка, заголовок и описание на мягкой заливке info — `Banner.Icon`, `Banner.Title`, `Banner.Description`.",
    },
    {
      slot: "variants",
      description:
        "Все подачи на всех тонах: soft по умолчанию, solid для срочного, outline для спокойного — `variant`, `tone`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы на рамке своей ступени: отступы, радиус, метка и роли текста растут вместе с ним — `size`.",
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
        "Видимостью владеет родитель: кнопка закрытия вызывает колбэк, баннер сменяется кнопкой возврата, и фокус переходит на неё; имя кнопки из labels — `onDismiss`, `labels`.",
    },
    {
      scenario: "page-strip",
      title: "Над страницей и в карточке",
      layout: "full",
      description:
        "Полоса во всю ширину над страницей и скруглённый блок в карточке — `placement`.",
    },
    {
      slot: "narrow",
      description:
        "Уже 36rem собственной ширины баннер переносит действия под текст — `Banner.Actions`.",
    },
  ],
  api,
};
