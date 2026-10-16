import { api } from "@/components/message/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { MessageSquare } from "../icons";

export const page: ComponentPageConfig = {
  category: "messages",
  nav: {
    segment: "message",
    label: "Message",
    summary: "Сообщение чата: пузыри всех видов, статусы, ответы, реакции, медиа, файлы, автор",
    keywords: [
      "сообщение",
      "чат",
      "переписка",
      "пузырь",
      "мессенджер",
      "реакции",
      "ответ",
      "альбом",
      "файл",
      "геопозиция",
      "контакт",
      "выделение",
      "message",
      "chat",
      "bubble",
    ],
    icon: MessageSquare,
    order: 1,
  },
  dir: "message",
  title: "Message",
  kind: "composite",
  description:
    "Одно сообщение чата в его оболочке: пузырь, фото или кружок, входящее или исходящее, хвостик в конце серии, время и статус в углу, реакции, меню, шапка автора — и каждый вид содержимого. Ленту, поиск и выбор собирает Chat.",
  examples: [
    {
      slot: "overview",
      description:
        "Короткая переписка с клиентом: входящий пузырь и серия из двух исходящих с хвостиком на последнем, время и галочки в углу, цитата ответа и реакция, которую можно переключить — `Message.Root`, `direction`, `position`, `time`, `status`, `Message.Text`, `Message.Reply`, `Message.Reactions`.",
    },
    {
      slot: "structure",
      description:
        "Необязательные части пузыря по порядку: автор, «Переслано от», цитата ответа, текст и реакции — `Message.Author`, `Message.Forwarded`, `Message.Reply`, `Message.Reactions`.",
    },
    {
      scenario: "kinds",
      title: "Все виды и оболочки",
      description:
        "Каждый вид сообщения в своей оболочке, в обе стороны, одиночные и сериями: текстовые пузыри, фото и кружки — блоки, пузырь подписи, голосовое, файл, контакт, место и превью ссылки, реакции в пузыре и под фото — `Message.Media`, `VideoNote`, `Message.File`, `Message.Contact`, `Message.Location`, `Message.LinkPreview`, `VoicePlayer`.",
    },
    {
      scenario: "author",
      title: "Автор и аватар",
      description:
        "Серия одного автора в групповом чате: первое сообщение открывается именем в цвете автора, короной и тегом участника, последнее показывает аватар в поле; другой автор только с инициалами, длинное имя, которое сокращается раньше тега, шапка на плашке над фото и ваш ответ — `Message.Author`, `tag`, `Message.AuthorIcon`, `Message.Avatar`, `position`, `hueOf`.",
    },
    {
      scenario: "typing",
      title: "Печатает",
      description:
        "«Печатает…»: входящий пузырь из трёх точек появляется как сообщение и уходит, закрывая высоту; переключайте его, не размонтируя — `Message.Typing`, `open`.",
    },
    {
      scenario: "status",
      title: "Статус доставки",
      description:
        "Доставка исходящих: часы при отправке, одна галочка — отправлено, две — прочитано; неотправленное с повтором, который завершается через секунду; время приходит датой и читается до секунды — `status`, `onRetry`, `formatTime`.",
    },
    {
      scenario: "text-formatting",
      title: "Форматирование",
      description:
        "Разметка, которую пишет Composer, безопасно отрисована: жирный, курсив, зачёркнутый, код, блок кода, ссылки и цитата; длинные слова и адреса переносятся; вставленный лог ошибки остаётся как набран, со своими звёздочками и подчёркиваниями — `Message.Text`, `edited`, `plain`.",
    },
    {
      scenario: "reactions",
      title: "Реакции",
      description:
        "Реакции под сообщением: чип показывает, кто отреагировал, — до трёх аватаров, с четырёх два и «+N»; нажатие на чип или двойное касание ставит или снимает свою сразу, пока запрос идёт следом — `Message.Reactions`, `users`, `onReactionToggle`.",
    },
    {
      scenario: "context-menu",
      title: "Меню и панель реакций",
      description:
        "Долгое нажатие: панель реакций над сообщением и меню под ним; правая кнопка — только меню, долгое наведение — только панель, с клавиатуры `R` и Shift+F10 — `Message.Menu`, `onReactionToggle`.",
    },
    {
      scenario: "media",
      title: "Фото и альбомы",
      description:
        "Подписи под фото, высоким портретом, альбомом и видео — каждая шириной со своё медиа; альбом с видео плитками, исходящий альбом с нейтральными зазорами и фото в процессе загрузки с кольцом и отменой; плитка открывает альбом в просмотрщике — `Message.Media`, `items`, `onCancel`.",
    },
    {
      scenario: "media-open",
      title: "Просмотр альбома снаружи",
      description:
        "Просмотрщик альбома во владении экрана: кнопка открывает фото приёмки на повреждённой паллете, а страница просмотра сохраняется до следующего открытия — `Message.Media`, `open`, `onOpenChange`, `index`, `onIndexChange`.",
    },
    {
      scenario: "voice",
      title: "Голосовое",
      description:
        "Голосовые в пузырях: плеер оставляет место под время в углу; новое несёт точку «не прослушано», пока его не включат — `VoicePlayer`, `unplayed`.",
    },
    {
      scenario: "file",
      title: "Файл",
      description:
        "Документы в чате: ссылка на скачивание, файл с картинкой, большой файл, который скачивают с плитки, отправка с долей и отменой и неудачная отправка с повтором, чей размер читается в целых килобайтах — `Message.File`, `href`, `preview`, `transfer`, `transferProgress`, `transferDirection`, `onDownload`, `formatSize`.",
    },
    {
      scenario: "location",
      title: "Геопозиция",
      description:
        "Место на картинке карты из вашего сервиса с меткой, названием и адресом, и геопозиция курьера в реальном времени — `Message.Location`, `href`, `live`.",
    },
    {
      scenario: "contact",
      title: "Контакт",
      description:
        "Отправленный контакт: инициалы или фото, имя и телефон, действия «Написать» и «Добавить» — `Message.Contact`, `phone`.",
    },
    {
      scenario: "link-preview",
      title: "Превью ссылки",
      description:
        "Сообщение со ссылкой и карточкой страницы под ним: сайт, заголовок, описание и картинка — `Message.LinkPreview`, `site`, `image`.",
    },
    {
      scenario: "bot-actions",
      title: "Кнопки бота",
      description:
        "Сообщение бота со встроенной клавиатурой, как в Telegram: ряды в одну строку делят её поровну, цветная кнопка со значком грузится, пока идёт её промис, ссылки помечены по месту назначения: страница продукта или другой сайт — `Message.Actions`, `tone`, `Button.Icon`, `asChild`.",
    },
    {
      scenario: "sticker",
      title: "Стикер",
      description:
        "Стикеры в переписке: картинка по адресу и видеостикер в вашем плеере, без пузыря, время на плашке в углу — `Message.Sticker`, `src`, `loading`.",
    },
    {
      scenario: "preview",
      title: "Превью вне чата",
      description:
        "Приветствие бота на странице его настроек: тот же пузырь с клавиатурой, в нём ничего не нажимается и не открывается, время — в поясе профиля — `preview`, `timeZone`.",
    },
    {
      slot: "narrow",
      description:
        "На ширине телефона пузырь занимает до 85% чата, длинные слова и ссылки переносятся внутри, альбом держит раскладку — `Message.Root`, `Message.Media`.",
    },
  ],
  api,
};
