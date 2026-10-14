import { api } from "@/components/media-viewer/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { GalleryHorizontalEnd } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "media-viewer",
    label: "MediaViewer",
    summary: "Полноэкранный просмотр фото и видео с жестами",
    keywords: [
      "просмотр",
      "просмотрщик",
      "лайтбокс",
      "lightbox",
      "галерея",
      "фото",
      "видео",
      "зум",
      "pinch",
      "свайп",
      "viewer",
    ],
    icon: GalleryHorizontalEnd,
    order: 7,
  },
  dir: "media-viewer",
  title: "MediaViewer",
  kind: "overlay",
  description:
    "Полноэкранный просмотр фото и видео, который ведёт себя как родной: страницы листаются пальцем с пружиной, щипок и двойной тап приближают, приближенная картинка двигается с инерцией и пружинит от краёв, свайп вниз закрывает. Открывается из миниатюры и закрывается обратно в неё.",
  examples: [
    {
      slot: "overview",
      description:
        "Фото приёмки открываются на весь экран из своих миниатюр — с той, которую нажали, — `items`, `open`, `index`.",
    },
    {
      scenario: "thumbnails",
      title: "Плёнка и подписи",
      description:
        "Фотоотчёт осмотра склада из 120 фото с плёнкой миниатюр и подписями: смонтированы только видимые миниатюры — `thumbnails`, `caption`.",
    },
    {
      scenario: "video",
      title: "Видео",
      description:
        "Видео среди фото объекта запускается, когда его страница встала на место; на панели — воспроизведение, время, перемотка, кнопка звука и громкость, масштаба нет — `type`, `autoPlay`.",
    },
    {
      scenario: "actions",
      title: "Действия",
      description:
        "Фото объявления с действиями для текущего: скачать или сделать обложкой — `renderActions`.",
    },
    {
      scenario: "origin",
      title: "Возврат в миниатюру",
      description:
        "Каждое фото улетает обратно в свою миниатюру, даже после листания, а за последним идёт первое — `getOrigin`, `loop`.",
    },
    {
      slot: "dismiss",
      description:
        "Сканы договора читают внимательно: случайный свайп или клик мимо страницы их не закрывает, только Escape и кнопка закрытия, а мелкий шрифт приближается до восьми раз — `closeOnOutsideClick`, `maxZoom`.",
    },
    {
      slot: "controlled",
      description:
        "Страницей владеет родитель: замечание открывает своё фото, а листание в просмотре двигает отметку по списку — `index`, `onIndexChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Родитель открывает один скан по ссылке в тексте: для одного элемента нет счётчика и стрелок — `open`, `onOpenChange`.",
    },
  ],
  api,
};
