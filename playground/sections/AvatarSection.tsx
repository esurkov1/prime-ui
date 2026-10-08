import { api } from "@/components/avatar/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { UserRound } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "avatar",
    label: "Avatar",
    summary: "Аватар: фото, инициалы, группа",
    keywords: ["аватар", "фото", "инициалы", "color", "size"],
    icon: UserRound,
    order: 2,
  },
  dir: "avatar",
  title: "Avatar",
  kind: "primitive",
  description:
    "Круглое фото человека или организации с подложкой из инициалов или иконки, точкой присутствия и группами с наложением. Предметы показывает Thumbnail.",
  examples: [
    {
      slot: "overview",
      description:
        "Фото с инициалами под ним, пока оно грузится, и одни инициалы — `Avatar.Image`, `Avatar.Fallback`.",
    },
    {
      slot: "variants",
      description: "Все оттенки палитры для подложки; выводите их из постоянного id — `color`.",
    },
    {
      slot: "sizes",
      description: "Все диаметры, от 20 до 64 px; инициалы — 40% диаметра — `size`.",
    },
    {
      slot: "states",
      description: "Загруженное фото, битая ссылка с переходом на инициалы и иконка для гостя.",
    },
    {
      scenario: "presence",
      title: "Присутствие",
      description:
        "Точка присутствия на краю аватара, читается названием состояния — `Avatar.Status`, `labels`.",
    },
    {
      scenario: "team-group",
      title: "Группа",
      description:
        "Участники проекта в ряд с наложением и ячейкой «+N»; размер группы получает каждый — `Avatar.Group`, `Avatar.Overflow`, `size`.",
    },
    {
      scenario: "src-from-state",
      title: "Смена фото",
      description:
        "Новый адрес фото начинает загрузку заново; до прихода фото видны инициалы — `src`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "`alt` у `Avatar.Image` пустой, когда имя написано рядом, иначе — имя. Без фото и без имени рядом — `aria-label` на `Avatar.Root`.",
      '`Avatar.Status` — `role="img"` с `aria-label` из `labels`.',
      '`Avatar.Group` — `role="group"`, задайте ему `aria-label`; `Avatar.Overflow` — `aria-label` («Ещё 3 участника»).',
    ],
  },
};
