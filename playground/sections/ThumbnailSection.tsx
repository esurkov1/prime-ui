import { api } from "@/components/thumbnail/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Image } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "thumbnail",
    label: "Thumbnail",
    summary: "Превью объекта с соотношением сторон",
    keywords: ["миниатюра", "превью", "картинка", "фото", "обложка", "ratio", "image"],
    icon: Image,
    order: 3,
  },
  dir: "thumbnail",
  title: "Thumbnail",
  kind: "primitive",
  description:
    "Превью предмета — товара, машины, файла, обложки, видео — с фиксированным соотношением сторон и цветной подложкой с иконкой; может открывать объект или выбираться. Людей показывает Avatar.",
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
    {
      scenario: "video",
      title: "Видео",
      description:
        "Видео в рамке: запись без обложки показывает первый кадр, знак воспроизведения и длительность; короткий ролик крутится без звука, как GIF; видеосообщение играет на месте с контролами — `Thumbnail.Video`, `autoPlay`, `controls`.",
    },
    {
      scenario: "pressable",
      title: "Открывает просмотр",
      description:
        "Фото доставки открывают просмотр: рамка стоит на кнопке, поэтому поднимается при наведении, нажимается и получает кольцо фокуса — `asChild`.",
    },
    {
      slot: "controlled",
      description:
        "Медиатека выбирает фото для объявления: плитка — чекбокс с галочкой в углу, выбор живёт в родителе, кнопка снимает его — `checked`, `onCheckedChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action:
          "Фокус на превью-кнопке (`asChild`) или выбираемой плитке; простое превью не фокусируется.",
      },
      {
        keys: "Enter · Space",
        action: "Открывает объект (`asChild`) или переключает выбор плитки.",
      },
    ],
    aria: [
      'Рядом с названием превью декоративно: `alt=""` (по умолчанию), иконки подложки — `aria-hidden`.',
      'Без названия рядом: осмысленный `alt` у `Thumbnail.Image` или `role="img"` + `aria-label` на корне для превью без картинки.',
      "Превью, открывающее объект, — `asChild` на `<button>` или `<a>` с именем (`aria-label`, если на нём только картинка).",
      'Выбираемая плитка — `<button role="checkbox">` с `aria-checked`; галочка `Checkbox.Indicator` скрыта от чтения, выбор не передаётся только цветом.',
      "`Thumbnail.Video` назовите `aria-label`; знак воспроизведения и длительность — подсказки на тени `media`. При `prefers-reduced-motion` ролик с `autoPlay` стоит на первом кадре.",
    ],
  },
};
