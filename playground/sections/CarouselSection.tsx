import { api } from "@/components/carousel/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Image } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "carousel",
    label: "Carousel",
    summary: "Фото записи в одной рамке: свайп, перебор наведением, точки",
    keywords: ["карусель", "слайдер", "фото", "галерея", "обложка", "carousel", "slider"],
    icon: Image,
    order: 4,
  },
  dir: "carousel",
  title: "Carousel",
  kind: "primitive",
  description:
    "Фото и видео одной записи — машины, товара, объекта — в одной рамке с фиксированным соотношением сторон: палец или мышь листают, точки, стрелки и клавиши шагают, а в каталоге фото можно перебирать наведением. Годится обложкой карточки каталога и сама по себе.",
  examples: [
    {
      slot: "overview",
      description:
        "Пять фото скутера в рамке 4 : 3: свайп, стрелки при наведении или нажатие на точку — `items`, `ratio`, `arrows`.",
    },
    {
      slot: "states",
      description:
        "Запись ещё грузится, одно фото (без точек), фото с ошибкой, совсем без фото и без точек — `loading`, `items`, `dots`.",
    },
    {
      scenario: "card-cover",
      title: "Обложка карточки",
      description:
        "Карточка машины с фото в обложке: бейджи машины стоят в четырёх углах, заметка к одному фото и длительность видео едут со своим слайдом, нажатие открывает фото во весь экран — `Carousel.Overlay`, `placement`, `renderOverlay`, `onItemOpen`.",
    },
    {
      scenario: "scrub",
      title: "Перебор наведением",
      description:
        "Каталог скутеров: движение мыши по обложке карточки перебирает её фото, уход с карточки снова показывает первое — `scrub`.",
    },
    {
      scenario: "video",
      title: "Видео",
      description:
        "Велосипед: первым — короткий ролик, который крутится без звука, пока на экране, и обзорное видео среди фото — `type`, `autoPlay`, `loop`, `poster`.",
    },
    {
      slot: "controlled",
      description:
        "Показанное фото живёт в экране: миниатюры под каруселью выбирают его, подпись следует за каждым свайпом, в том числе через края — `index`, `onIndexChange`, `loop`.",
    },
    {
      slot: "narrow",
      description:
        "Карточка объявления в колонке шириной с телефон: рамка следует за колонкой, точки и углы не задевают друг друга — `ratio`, `Carousel.Overlay`.",
    },
  ],
  api,
};
