import { api } from "@/components/spinner/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Loader } from "../icons";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "spinner",
    label: "Spinner",
    summary: "Индикатор загрузки без известного прогресса",
    keywords: ["спиннер", "загрузка", "лоадер", "loader", "loading", "индикатор"],
    icon: Loader,
    order: 5,
  },
  dir: "spinner",
  title: "Spinner",
  kind: "primitive",
  description:
    "Индикатор загрузки без известного прогресса: четверть дуги вращается на слабой дорожке, пока идёт запрос. Когда прогресс известен — ProgressBar или ProgressCircle.",
  examples: [
    {
      slot: "overview",
      description:
        "Статус загрузки рядом с коротким пояснением; спиннер берёт цвет текста и называет ожидание — `labels`.",
    },
    {
      slot: "variants",
      description: "Все цвета кольца; `default` следует за текстом вокруг — `tone`.",
    },
    { slot: "sizes", description: "Все размеры по шкале иконок, от 14 до 32 px — `size`." },
  ],
  api,
};
