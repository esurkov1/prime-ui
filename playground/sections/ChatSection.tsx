import { api } from "@/components/chat/api";
import { MessageSquareMore } from "@/icons/glyphs/message-square-more";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "messages",
  nav: {
    segment: "chat",
    label: "Chat",
    summary: "Готовый чат: шапка, поиск, закреплённые, лента сообщений, «печатает…» и Composer",
    keywords: [
      "чат",
      "мессенджер",
      "переписка",
      "лента",
      "диалог",
      "групповой чат",
      "поиск по сообщениям",
      "закреплённые",
      "chat",
      "messenger",
      "conversation",
    ],
    icon: MessageSquareMore,
    order: 0,
  },
  dir: "chat",
  title: "Chat",
  kind: "composite",
  description:
    "Переписка в сборе: шапка с собеседником, поиск, закреплённые, лента сообщений с датами, сериями и выбором, «печатает…» и Composer внизу. Сообщения можно передать данными или частями; лента одна и та же.",
  examples: [
    {
      slot: "overview",
      description:
        "Полный командный мессенджер на две тысячи сообщений: статус в шапке сменяется на «печатает…», поиск выделяет совпадения, закреплённые, история сверху, шапки авторов с тегами в групповом чате, все виды сообщений, расшифровки, реакции, меню с ответом, правкой, закреплением и выбором, переходы, кнопка новых сообщений и Composer, чьи сообщения поднимаются в ленту — `Chat.Root`, `Chat.Header`, `Chat.Search`, `Chat.Pinned`, `Chat.Messages`, `type`, `items`, `renderMessage`, `typing`, `selected`, `Chat.Footer`.",
    },
    {
      slot: "structure",
      description:
        "Только лента, записанная частями: `Chat.Root` с одним `Chat.Messages`, дата, которая держится сверху, пока листается её день, событие чата и полоса непрочитанных — `Chat.Messages`, `Chat.Separator`, `Chat.Service`, `Chat.Unread`.",
    },
    {
      scenario: "group-chat",
      title: "Групповой чат",
      description:
        "Чат команды из данных: первое сообщение серии открывается именем в цвете автора, короной владельца и тегом участника; аватар — фото или инициалы — закрывает серию, в которую входят сообщения до четверти часа друг от друга; даты с днём недели — `type`, `items`, `renderMessage`, `groupWindow`, `formatDate`, `Message.Author`, `tag`, `Message.AuthorIcon`, `hueOf`.",
    },
    {
      scenario: "reactions",
      title: "Свои реакции",
      description:
        "Реакции команды согласований: двойное касание или `L` ставит «Согласовано», долгое нажатие или `R` открывает набор команды, чип снимает реакцию обратно — `quickReaction`, `reactionOptions`, `onReactionToggle`.",
    },
    {
      scenario: "live",
      title: "Новые сообщения",
      description:
        "Живой чат поддержки: клиент печатает — об этом говорят шапка и конец ленты, — потом отвечает; новые сообщения появляются в конце, отметки о прочтении идут от того, что на экране, а если прокрутить вверх, круглая кнопка считает пришедшие — `typing`, `onNewMessage`, `onRead`.",
    },
    {
      scenario: "search",
      title: "Поиск и закреплённые",
      description:
        "Строка поиска выделяет каждое совпадение в текстах и расшифровках, считает их и ходит по ним, пока остальные отступают; нажатие на закреплённое переходит к нему и мигает им — `Chat.SearchButton`, `Chat.Search`, `defaultSearch`, `Chat.Pinned`.",
    },
    {
      slot: "states",
      description:
        "Первая загрузка переписки: заглушки в форме пузырей с обеих сторон стоят на месте ленты и плавно сменяются сообщениями — `loading`.",
    },
    {
      slot: "controlled",
      description:
        "Режим выбора во владении экрана: «Выбрать» в меню сообщения включает его, у каждого сообщения флажок, нажатие переключает, пока остальные отступают, панель считает и действует, Escape выходит — `selected`, `onSelectedChange`, `Chat.SelectionBar`.",
    },
    {
      slot: "narrow",
      description:
        "На ширине телефона шапка держит действия и сокращает заголовок, пузыри занимают до 85% чата, длинные ссылки переносятся, альбом держит раскладку — `Chat.Root`, `Chat.Header`, `Chat.Messages`, `Chat.Footer`.",
    },
    {
      slot: "screen",
      description:
        "Рабочий экран поддержки: заголовок и число непрочитанных в шапке приложения, диалоги с поиском рядом с перепиской, история подгружается сверху, полоса непрочитанных, ответ и правка из меню, «печатает…» в обе стороны и непрочитанные по тому, что увидено — `items`, `renderMessage`, `hasOlder`, `onLoadOlder`, `typing`.",
    },
  ],
  api,
};
