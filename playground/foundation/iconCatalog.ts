import type { IconName } from "@/icons";

/** Catalog groups in display order: `id` is the prefix of an icon name before the first dot. */
export const ICON_GROUPS = [
  { id: "nav", label: "Навигация" },
  { id: "action", label: "Действия" },
  { id: "field", label: "Поля" },
  { id: "format", label: "Форматирование" },
  { id: "object", label: "Объекты" },
  { id: "sort", label: "Сортировка" },
  { id: "status", label: "Статусы" },
  { id: "theme", label: "Тема" },
  { id: "view", label: "Вид" },
  { id: "viewport", label: "Устройства" },
] as const;

export type IconGroupId = (typeof ICON_GROUPS)[number]["id"];

/** What each icon means in a product interface, plus search synonyms (Russian and English). */
export const ICON_CATALOG: Record<IconName, { meaning: string; keywords: string[] }> = {
  "nav.chevronDown": {
    meaning: "Раскрыть список или секцию",
    keywords: ["стрелка вниз", "раскрыть", "выпадающий", "chevron", "down", "expand", "dropdown"],
  },
  "nav.chevronLeft": {
    meaning: "Назад, предыдущая страница",
    keywords: ["стрелка влево", "назад", "chevron", "left", "back", "previous"],
  },
  "nav.chevronRight": {
    meaning: "Вперёд, перейти глубже",
    keywords: ["стрелка вправо", "вперёд", "далее", "chevron", "right", "next", "forward"],
  },
  "nav.chevronUp": {
    meaning: "Свернуть список или секцию",
    keywords: ["стрелка вверх", "свернуть", "chevron", "up", "collapse"],
  },
  "nav.chevronsLeft": {
    meaning: "В самое начало, свернуть панель",
    keywords: ["двойная стрелка", "первая страница", "chevrons", "first", "double"],
  },
  "nav.chevronsUpDown": {
    meaning: "Выбрать значение из списка",
    keywords: ["селект", "выбор", "список", "select", "combobox", "chevrons"],
  },
  "nav.dashboard": {
    meaning: "Дашборд, обзор показателей",
    keywords: ["панель", "обзор", "главная", "dashboard", "layout", "overview"],
  },
  "nav.home": {
    meaning: "Главная страница",
    keywords: ["дом", "домой", "главная", "home", "house"],
  },
  "nav.itemDot": {
    meaning: "Маркер пункта вложенной навигации",
    keywords: ["точка", "маркер", "пункт", "dot", "bullet", "circle"],
  },
  "nav.layoutGrid": {
    meaning: "Раздел с плиточным видом",
    keywords: ["сетка", "плитки", "grid", "tiles", "layout"],
  },
  "nav.menu": {
    meaning: "Открыть меню навигации",
    keywords: ["гамбургер", "меню", "burger", "hamburger", "menu"],
  },
  "nav.sidebarCollapse": {
    meaning: "Свернуть боковую панель",
    keywords: ["сайдбар", "панель", "свернуть", "sidebar", "collapse", "panel"],
  },
  "nav.sidebarExpand": {
    meaning: "Развернуть боковую панель",
    keywords: ["сайдбар", "панель", "развернуть", "sidebar", "expand", "panel"],
  },
  "action.add": {
    meaning: "Добавить или создать",
    keywords: ["плюс", "создать", "новый", "plus", "add", "create", "new"],
  },
  "action.check": {
    meaning: "Подтвердить, выбрано",
    keywords: ["галочка", "готово", "ок", "check", "tick", "done", "confirm"],
  },
  "action.close": {
    meaning: "Закрыть или очистить",
    keywords: ["крестик", "закрыть", "очистить", "x", "close", "clear", "cancel"],
  },
  "action.copy": {
    meaning: "Скопировать в буфер",
    keywords: ["копировать", "буфер", "copy", "clipboard", "duplicate"],
  },
  "action.delete": {
    meaning: "Удалить без возврата",
    keywords: ["корзина", "удалить", "trash", "delete", "remove", "bin"],
  },
  "action.download": {
    meaning: "Скачать файл",
    keywords: ["скачать", "загрузить на устройство", "download", "save"],
  },
  "action.drag": {
    meaning: "Ручка для перетаскивания",
    keywords: ["перетащить", "порядок", "drag", "handle", "grip", "reorder"],
  },
  "action.externalLink": {
    meaning: "Открыть во внешнем окне или на другом сайте",
    keywords: ["внешняя ссылка", "новая вкладка", "external", "link", "open", "new tab"],
  },
  "action.eyedropper": {
    meaning: "Взять цвет с экрана",
    keywords: ["пипетка", "цвет", "eyedropper", "pipette", "color", "picker"],
  },
  "action.filter": {
    meaning: "Открыть фильтры",
    keywords: ["фильтр", "отбор", "filter", "funnel"],
  },
  "action.login": {
    meaning: "Войти в аккаунт",
    keywords: ["вход", "авторизация", "login", "sign in"],
  },
  "action.logout": {
    meaning: "Выйти из аккаунта",
    keywords: ["выход", "logout", "sign out"],
  },
  "action.more": {
    meaning: "Открыть меню действий",
    keywords: ["ещё", "три точки", "меню", "more", "ellipsis", "kebab", "overflow"],
  },
  "action.refresh": {
    meaning: "Обновить данные",
    keywords: ["обновить", "перезагрузить", "refresh", "reload", "sync"],
  },
  "action.remove": {
    meaning: "Убрать из выбора, уменьшить",
    keywords: ["минус", "убрать", "minus", "remove", "decrease"],
  },
  "action.search": {
    meaning: "Найти по тексту",
    keywords: ["поиск", "лупа", "найти", "search", "magnifier", "find"],
  },
  "action.send": {
    meaning: "Отправить сообщение или форму",
    keywords: ["отправить", "самолётик", "send", "submit", "paper plane"],
  },
  "action.settings": {
    meaning: "Открыть настройки",
    keywords: ["настройки", "шестерёнка", "параметры", "settings", "gear", "cog", "preferences"],
  },
  "action.upload": {
    meaning: "Загрузить файл",
    keywords: ["загрузить", "облако", "upload", "cloud", "file"],
  },
  "field.calendar": {
    meaning: "Выбрать дату",
    keywords: ["календарь", "дата", "calendar", "date", "datepicker"],
  },
  "field.email": {
    meaning: "Адрес электронной почты",
    keywords: ["почта", "письмо", "email", "mail", "envelope"],
  },
  "field.password.show": {
    meaning: "Показать пароль",
    keywords: ["глаз", "показать", "пароль", "eye", "show", "password", "reveal"],
  },
  "field.password.hide": {
    meaning: "Скрыть пароль",
    keywords: ["глаз зачёркнут", "скрыть", "пароль", "eye off", "hide", "password", "mask"],
  },
  "format.bold": {
    meaning: "Полужирный текст",
    keywords: ["жирный", "bold", "strong", "editor"],
  },
  "format.italic": {
    meaning: "Курсив",
    keywords: ["наклонный", "italic", "emphasis", "editor"],
  },
  "format.link": {
    meaning: "Вставить ссылку",
    keywords: ["ссылка", "цепочка", "link", "url", "chain"],
  },
  "format.list": {
    meaning: "Маркированный список",
    keywords: ["список", "маркеры", "list", "bullets", "editor"],
  },
  "format.underline": {
    meaning: "Подчёркнутый текст",
    keywords: ["подчёркивание", "underline", "editor"],
  },
  "object.activity": {
    meaning: "Активность, пульс, лента событий",
    keywords: ["активность", "пульс", "события", "activity", "pulse", "heartbeat"],
  },
  "object.bell": {
    meaning: "Уведомления",
    keywords: ["колокольчик", "оповещения", "bell", "notifications", "alerts"],
  },
  "object.book": {
    meaning: "Документация, справочник",
    keywords: ["книга", "справка", "docs", "book", "guide", "help"],
  },
  "object.cart": {
    meaning: "Корзина покупок",
    keywords: ["корзина", "покупки", "заказ", "cart", "shopping", "basket"],
  },
  "object.chart": {
    meaning: "График, аналитика",
    keywords: ["диаграмма", "статистика", "столбцы", "chart", "analytics", "bars", "stats"],
  },
  "object.document": {
    meaning: "Документ или файл с текстом",
    keywords: ["файл", "документ", "договор", "file", "document", "text", "doc"],
  },
  "object.image": {
    meaning: "Изображение, фото",
    keywords: ["картинка", "фото", "image", "picture", "photo"],
  },
  "object.inbox": {
    meaning: "Входящие, пустой список",
    keywords: ["входящие", "ящик", "inbox", "empty", "tray"],
  },
  "object.key": {
    meaning: "Ключ доступа",
    keywords: ["ключ", "токен", "api", "key", "token", "access"],
  },
  "object.message": {
    meaning: "Сообщение, комментарий, чат",
    keywords: ["сообщение", "чат", "комментарий", "message", "chat", "comment"],
  },
  "object.package": {
    meaning: "Посылка, товар, пакет",
    keywords: ["посылка", "товар", "коробка", "package", "box", "parcel", "product"],
  },
  "object.receipt": {
    meaning: "Счёт, чек, накладная",
    keywords: ["счёт", "чек", "инвойс", "receipt", "invoice", "bill"],
  },
  "object.rocket": {
    meaning: "Запуск, быстрый старт",
    keywords: ["ракета", "запуск", "старт", "rocket", "launch", "start"],
  },
  "object.storage": {
    meaning: "Хранилище, диск",
    keywords: ["диск", "хранилище", "сервер", "storage", "disk", "drive", "server"],
  },
  "object.tasks": {
    meaning: "Список задач",
    keywords: ["задачи", "чеклист", "tasks", "todo", "checklist"],
  },
  "object.truck": {
    meaning: "Доставка, отгрузка",
    keywords: ["грузовик", "доставка", "логистика", "truck", "delivery", "shipping"],
  },
  "object.user": {
    meaning: "Пользователь, профиль",
    keywords: ["человек", "профиль", "аккаунт", "user", "person", "profile", "account"],
  },
  "object.users": {
    meaning: "Команда, группа людей",
    keywords: ["команда", "люди", "группа", "users", "team", "group", "people"],
  },
  "object.wallet": {
    meaning: "Кошелёк, баланс, платежи",
    keywords: ["кошелёк", "деньги", "оплата", "баланс", "wallet", "money", "payment", "balance"],
  },
  "sort.ascending": {
    meaning: "Сортировка по возрастанию",
    keywords: ["по возрастанию", "а-я", "ascending", "sort", "asc"],
  },
  "sort.descending": {
    meaning: "Сортировка по убыванию",
    keywords: ["по убыванию", "я-а", "descending", "sort", "desc"],
  },
  "sort.none": {
    meaning: "Сортировка не задана",
    keywords: ["сортировка", "порядок", "sort", "unsorted", "arrows"],
  },
  "status.danger": {
    meaning: "Ошибка, сбой",
    keywords: ["ошибка", "опасность", "крест в круге", "error", "danger", "failed", "x circle"],
  },
  "status.emailSent": {
    meaning: "Письмо отправлено",
    keywords: ["письмо", "отправлено", "почта", "email", "sent", "mail check"],
  },
  "status.info": {
    meaning: "Пояснение, информация",
    keywords: ["информация", "справка", "подсказка", "info", "hint", "help"],
  },
  "status.locked": {
    meaning: "Закрыто, нет доступа",
    keywords: ["замок", "заблокировано", "доступ", "lock", "locked", "private", "secure"],
  },
  "status.offline": {
    meaning: "Нет соединения",
    keywords: ["офлайн", "нет сети", "облако", "offline", "no connection", "cloud off"],
  },
  "status.success": {
    meaning: "Успех, выполнено",
    keywords: ["успех", "готово", "галочка в круге", "success", "done", "ok", "check circle"],
  },
  "status.trendUp": {
    meaning: "Рост показателя",
    keywords: ["рост", "тренд", "стрелка вверх", "trend", "up", "increase", "growth"],
  },
  "status.warning": {
    meaning: "Предупреждение, нужно внимание",
    keywords: ["предупреждение", "внимание", "треугольник", "warning", "alert", "caution"],
  },
  "theme.dark": {
    meaning: "Тёмная тема",
    keywords: ["тёмная", "ночь", "луна", "dark", "night", "moon"],
  },
  "theme.light": {
    meaning: "Светлая тема",
    keywords: ["светлая", "день", "солнце", "light", "day", "sun"],
  },
  "view.code": {
    meaning: "Показать код",
    keywords: ["код", "исходник", "code", "source", "html"],
  },
  "view.preview": {
    meaning: "Показать результат",
    keywords: ["предпросмотр", "глаз", "превью", "preview", "eye", "view"],
  },
  "viewport.desktop": {
    meaning: "Широкий экран, десктоп",
    keywords: ["компьютер", "монитор", "десктоп", "desktop", "monitor", "screen"],
  },
  "viewport.mobile": {
    meaning: "Телефон",
    keywords: ["мобильный", "смартфон", "mobile", "phone", "smartphone"],
  },
  "viewport.tablet": {
    meaning: "Планшет",
    keywords: ["планшет", "tablet", "ipad"],
  },
};
