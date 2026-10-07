import { api } from "@/components/thumbnail/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "thumbnail",
  title: "Thumbnail",
  kind: "primitive",
  description:
    "Превью предмета — товара, машины, файла, обложки — с фиксированным соотношением сторон и цветной подложкой с иконкой. Людей показывает Avatar.",
  examples: [
    {
      slot: "overview",
      description:
        "Машина рядом с названием: фото и подложка с иконкой под ним — `Thumbnail.Image`, `Thumbnail.Fallback`, `ratio`.",
    },
    {
      slot: "variants",
      description:
        "Заливка подложки: мягкий оттенок или насыщенный цвет со смыслом — `variant`, `color`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы высоты, от 24 до 64 px; `m` подходит для двухстрочной ячейки — `size`.",
    },
    {
      slot: "states",
      description:
        "Без картинки (иконка или короткая подпись на заливке) и картинка с ошибкой, которая сама уходит в подложку.",
    },
    {
      scenario: "ratios",
      title: "Соотношения сторон",
      description: "Все соотношения при одной высоте; держите одно соотношение в списке — `ratio`.",
    },
    {
      scenario: "ring",
      title: "Кольцо",
      description:
        "Тонкое внутреннее кольцо для фото на белом фоне на светлой поверхности, где край теряется — `ring`.",
    },
    {
      scenario: "full-width",
      title: "Во всю ширину",
      description:
        "Обложки в сетке карточек берут ширину карточки и держат 16:9 — высота у всех одна — `fullWidth`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      'Рядом с названием превью декоративно: `alt=""` (по умолчанию), иконки подложки — `aria-hidden`.',
      'Без названия рядом: осмысленный `alt` у `Thumbnail.Image` или `role="img"` + `aria-label` на корне для превью без картинки.',
      "Своего поведения нет: оберните превью в ссылку или кнопку, если оно открывает объект.",
    ],
  },
};

export default function ThumbnailSection() {
  return <ComponentPage page={page} />;
}
