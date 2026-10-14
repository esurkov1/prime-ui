import { api } from "@/components/gallery/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Image } from "../icons";

export const page: ComponentPageConfig = {
  category: "messages",
  nav: {
    segment: "gallery",
    label: "Gallery",
    summary: "Альбом фото и видео: раскладка по пропорциям, видео, передача, открытие",
    keywords: [
      "галерея",
      "альбом",
      "фото",
      "видео",
      "медиа",
      "плитки",
      "gallery",
      "album",
      "media",
    ],
    icon: Image,
    order: 5,
  },
  dir: "gallery",
  title: "Gallery",
  kind: "primitive",
  description:
    "Фото и видео альбомом, как в мессенджере: одна картинка или до десяти, разложенные по их пропорциям без измерений; плитка открывает альбом в MediaViewer. Из неё сделан `Message.Media`; годится и вне чата — в карточке, ленте, комментарии.",
  examples: [
    {
      slot: "overview",
      description:
        "Альбом из фото разной формы и видео, разложенный по их пропорциям ещё до загрузки; плитка открывает альбом в просмотрщике — `items`, `width`, `height`, `type`.",
    },
    {
      scenario: "album-sizes",
      title: "Размер альбома",
      description:
        "Один альбом, разложенный заново для каждого количества от одного до десяти: переключатель задаёт, сколько элементов в галерее, и раскладка плавно сменяется следующей — `items`.",
    },
    {
      scenario: "transfer",
      title: "Передача",
      description:
        "Плитки в пути, один вид в обе стороны: отправка с кольцом и отменой, неудача с повтором, полученное ждёт скачивания — картинка приглушена под диском до конца — `transfer`, `transferProgress`, `transferDirection`, `onCancel`, `onRetry`, `onDownload`.",
    },
    {
      slot: "controlled",
      description:
        "Альбом со своим просмотрщиком экрана: плитка сообщает свой элемент, а карточка приёмки рядом показывает, какое фото открыто — `viewer`, `index`, `onIndexChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Просмотрщик во владении экрана: кнопка открывает альбом на третьем элементе, показанная страница запоминается, а закрытие возвращает фокус туда, откуда он пришёл — `open`, `onOpenChange`, `index`, `onIndexChange`.",
    },
  ],
  api,
};
