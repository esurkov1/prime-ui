import { api } from "@/components/chat-list/api";
import { MessageCircleMore } from "@/icons/glyphs/message-circle-more";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "messages",
  nav: {
    segment: "chat-list",
    label: "ChatList",
    summary:
      "Список диалогов мессенджера: поиск, непрочитанные, «печатает…», черновик, меню строки",
    keywords: [
      "диалоги",
      "список чатов",
      "мессенджер",
      "входящие",
      "непрочитанные",
      "закреплённые",
      "без звука",
      "черновик",
      "inbox",
      "conversations",
      "chat list",
    ],
    icon: MessageCircleMore,
    order: 6,
  },
  dir: "chat-list",
  title: "ChatList",
  kind: "composite",
  description:
    "Левая панель мессенджера, где выбирают диалог: аватар с присутствием, имя, время, превью последнего сообщения, счётчики, «печатает…» и черновик. Диалоги передаются данными, открытый — `value`; строки плавно переезжают, когда меняется порядок.",
  examples: [
    {
      slot: "overview",
      description:
        "Входящие поддержки: закреплённые сверху, поиск, счётчики обычных и заглушённых диалогов, «печатает…», черновик, отметки доставки и меню строки — закрепить, без звука, отметить прочитанным, удалить после подтверждения — `ChatList.Root`, `items`, `renderItem`, `value`, `onSearchChange`, `ChatList.Item`, `ChatList.ItemMenu`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: высота строки, кегль, аватар, значки и поле поиска следуют ярусу — `size`.",
    },
    {
      slot: "structure",
      description:
        "Все части строки: фото или инициалы с присутствием, значок у имени, статус записи бейджами, автор последнего сообщения, слова медиа с длительностью, участник группы печатает, отметки от отправки до ошибки — `ChatList.ItemIcon`, `ChatList.ItemStatus`, `ChatList.ItemDescription`, `author`, `kind`, `duration`, `typing`, `status`.",
    },
    {
      scenario: "search",
      title: "Поиск",
      description:
        "Поле поиска фильтрует диалоги по имени и последнему сообщению, подсвечивает совпадение в обоих, сообщает, сколько найдено, и показывает тихое пустое состояние — `defaultSearch`, `onSearchChange`.",
    },
    {
      scenario: "actions",
      title: "Кнопки панели",
      description:
        "Панель тредов ассистента: поиск, под ним «+ Чат», дальше треды — создание стоит наверху, а не под списком — `ChatList.Actions`, `onSearchChange`.",
    },
    {
      scenario: "live",
      title: "Новые сообщения",
      description:
        "Живые входящие: клиент печатает, потом пишет — превью сменяется на «печатает…» и обратно, счётчик прокручивается, диалог плавно поднимается наверх; открытие сбрасывает счётчик — `typing`, `unread`, `items`.",
    },
    {
      scenario: "long-list",
      title: "Длинный список",
      description:
        "Входящие отдела продаж на тысячу диалогов: рисуются только строки у видимой области, стрелки проходят по всем, следующая страница грузится у конца — `hasMore`, `onLoadMore`.",
    },
    {
      scenario: "links",
      title: "Диалоги-ссылки",
      description:
        "У каждого диалога свой адрес: строка — ссылка на страницу обращения, время читается как «сколько ждёт», а список назван по своей очереди — `href`, `formatTime`, `labels`.",
    },
    {
      scenario: "router",
      title: "Ссылки роутера",
      description:
        "Диалоги — ссылки роутера, время — в поясе профиля оператора; рисуйте список внутри роутера — `asChild`, `timeZone`.",
    },
    {
      slot: "states",
      description:
        "Загрузка и пустота: строки-заглушки в геометрии строк плавно сменяются диалогами; у нового пространства без диалогов своё пустое состояние с действием — `loading`, `empty`.",
    },
    {
      slot: "controlled",
      description:
        "Открытый диалог хранит экран: строка открывает его рядом со списком, а «Следующий непрочитанный» открывает следующий снаружи — `value`, `onValueChange`.",
    },
    {
      slot: "narrow",
      description:
        "На ширине телефона длинные имена и превью обрезаются, а время и счётчики остаются целыми; панель уже 240px оставляет только имена и счётчики — `ChatList.Root`, `search`.",
    },
  ],
  api,
};
