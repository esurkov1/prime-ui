import { api } from "@/components/rich-text/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Type } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "rich-text",
    label: "RichText",
    summary: "Текст с разметкой чата вне сообщения: жирный, ссылки, цитаты, код, спойлер",
    keywords: ["markdown", "разметка", "форматирование", "текст", "спойлер", "rich text"],
    icon: Type,
    order: 9.5,
  },
  dir: "rich-text",
  title: "RichText",
  kind: "primitive",
  description:
    "Текст в подмножестве Markdown чата вне сообщения — приветствие бота, шаблон, комментарий: та же отрисовка, что у `Message.Text`, элементами React, без HTML. Берёт шрифт хоста.",
  examples: [
    {
      slot: "overview",
      description:
        "Приветствие бота поддержки вне чата: жирный, ссылка, цитата, код и спойлер из разметки чата — `children`.",
    },
    {
      scenario: "entities",
      title: "Текст с диапазонами",
      description:
        "Приветствие бота, сохранённое так, как его шлёт мессенджер, — простой текст и размеченные диапазоны; звёздочки остаются текстом — `entities`.",
    },
  ],
  api,
};
