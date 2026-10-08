import { RectangleHorizontal } from "lucide-react";
import { api } from "@/components/skeleton/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "skeleton",
    label: "Skeleton",
    summary: "Заглушка в форме загружаемого содержимого",
    keywords: ["скелетон", "заглушка", "загрузка", "placeholder", "loading", "shimmer"],
    icon: RectangleHorizontal,
    order: 6,
  },
  dir: "skeleton",
  title: "Skeleton",
  kind: "primitive",
  description:
    "Заглушка в форме того, что загружается: строки текста, поля, аватар, блок. Раскладка готова до прихода данных, а Crossfade плавно сменяет заглушку содержимым.",
  examples: [
    {
      slot: "overview",
      description:
        "Карточка проекта при загрузке: обложка, автор и две строки текста занимают место настоящего содержимого — `shape`, `lines`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы строки текста, контрола и аватара: заглушка совпадает с содержимым своего яруса — `size`, `shape`.",
    },
    {
      scenario: "form",
      title: "Форма при загрузке",
      description:
        "Форма настроек ждёт значения: подписи — короткие строки, поля и кнопка — контролы того же яруса — `shape`.",
    },
    {
      scenario: "with-crossfade",
      title: "Смена на данные",
      description:
        "Список перезагружается: строки-заглушки той же геометрии плавно сменяются данными, ничего не прыгает — `Crossfade`, `state`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      'Заглушка декоративная: `aria-hidden="true"`, скринридер её не читает.',
      'О загрузке сообщает область: `aria-busy` на ней (Crossfade, карточка, форма), при необходимости — `role="status"` с текстом.',
      "Под `prefers-reduced-motion` заглушка не пульсирует.",
    ],
  },
};
