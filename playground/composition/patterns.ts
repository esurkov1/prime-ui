/**
 * Composition pages of the playground: one entry per `SKILL/patterns/<file>.tsx`. The pattern file
 * is the one source (preview, code, skill reference); this list only adds the page text.
 * `SKILL/composition.md` links the same files — the patterns contract test keeps them in sync.
 */
export type CompositionPattern = {
  /** `SKILL/patterns/<file>.tsx`; its default export is `<PascalFile>Pattern`. */
  file: string;
  /** Route segment. */
  segment: string;
  /** Sidebar and search title (English, like the component pages). */
  label: string;
  /** Page title (Russian). */
  title: string;
  /** One or two sentences: what screen this is and when to start from it. */
  description: string;
  /** What the screen demonstrates — the rules from `SKILL/composition.md`, with `code` names. */
  rules: string[];
  /** Extra search terms. */
  keywords: string[];
};

export const COMPOSITION_PATTERNS: CompositionPattern[] = [
  {
    file: "list-page",
    segment: "pattern-list-page",
    label: "List page",
    title: "Страница списка",
    description:
      "Реестр сущностей: заголовок с одним главным действием, фильтры и таблица с пустым состоянием. Начинайте отсюда любой экран «список заказов / счетов / клиентов».",
    rules: [
      'Шапка — `PageContent.Header`: заголовок, одно предложение описания, справа `PageContent.Actions`. Главное действие одно (`solid`), остальные `soft` / `ghost` с `tone="neutral"`, главное — последним.',
      "Фильтры живут в `toolbar` таблицы: `SmartFilter.Toolbar` и `SmartFilter.Chips` внутри `DataTable`, а не отдельной карточкой над ней.",
      "Статус — `Badge` с одним цветом на смысл по всему продукту (`STATUS` — одна карта); текст несёт смысл, цвет его повторяет.",
      "Числа и даты — колонки `numeric` (табличные цифры, выравнивание по правому краю). На телефоне таблица прокручивается внутри себя, `stickyFirstColumn` держит номер на месте — страница вбок не едет.",
      'Действия со строкой — `Dropdown` за иконкой `action.more` размера `s`: контролы в ячейках на ступень меньше таблицы. Удаление — `tone="danger"` в конце меню.',
      'Пусто после фильтра — `empty` таблицы с `EmptyPage size="s"` и действием «Сбросить фильтры»; шапка и фильтры остаются на месте.',
    ],
    keywords: [
      "список",
      "реестр",
      "таблица",
      "фильтры",
      "list",
      "table",
      "SmartFilter",
      "DataTable",
    ],
  },
  {
    file: "detail-page",
    segment: "pattern-detail-page",
    label: "Detail page",
    title: "Карточка объекта",
    description:
      "Страница одной сущности: путь, статус и действия в шапке, основная колонка с содержанием и боковая — со сведениями и историей. Две колонки сами складываются в одну на узком экране.",
    rules: [
      "`Breadcrumb` — первым ребёнком `PageContent.Header`: он встаёт в колонку заголовка в 8 px над `PageContent.Title`. На страницах верхнего уровня крошек нет.",
      "Статус — `Badge` рядом с фактом, который важен сейчас («Оплатить до…»), в `PageContent.Description`, а не отдельной плашкой.",
      'Действия по весу: одно главное (`solid`, последним), второстепенное `soft` + `tone="neutral"`, редкие и разрушительные — в `Dropdown` за иконкой `action.more`; аннулирование — `tone="danger"` внизу меню.',
      "Колонки — CSS-модуль на flex-wrap без брейкпоинтов: основная растёт, боковая держит ~18rem и уходит вниз, когда основной не хватает места.",
      'Раздел без рамки — заголовок `Typography as="h2" variant="title-m"` в 16 px над таблицей; `Card variant="panel"` — только для самостоятельных блоков боковой колонки. Таблица — уже залитый блок, в карточку её не кладут.',
      'Пары «подпись → значение» — `<dl>` с `caption` + `tone="muted"` над `body-m`; суммы — табличные цифры, итог крупнее (`title-m`).',
      'История — `Timeline` с `highlight="current"`: последнее событие выделено, даты в `Timeline.Meta`.',
    ],
    keywords: ["детали", "карточка", "объект", "страница", "detail", "Breadcrumb", "Timeline"],
  },
  {
    file: "settings-page",
    segment: "pattern-settings-page",
    label: "Settings",
    title: "Настройки",
    description:
      "Страница настроек: разделы с колонкой заголовка и панелью, форма с собственным сохранением, переключатели, которые применяются сразу, и опасная зона с подтверждением.",
    rules: [
      'Раздел — колонка заголовка (`title-m` + одна строка `body-m` `secondary`) и панель `Card variant="panel"`; на узком экране колонка уходит над панелью сама (flex-wrap, без брейкпоинтов).',
      "Форма оборачивает весь `Card.Root` в `<form noValidate>`; кнопки — в `Card.Actions`: «Отменить изменения» `ghost` + `neutral`, затем главное «Сохранить». Пока идёт запрос — `loading` на кнопке и `disabled` на полях, по успеху — `Notification`.",
      "Поля 20 px друг от друга; два коротких связанных поля — в ряд, пока хватает ширины, с `align-items: start` и `reserveSupportRow`, чтобы ошибка не сдвигала соседа.",
      "Ошибка — через `error` поля после отправки, а не во время ввода; подсказка формата — в `hint`.",
      "`Switch` применяется сразу — в его разделе нет кнопки «Сохранить»; пояснение — в `hint` самого переключателя.",
      'Опасная зона — последний раздел: кнопка `outline` + `tone="danger"` открывает `Modal` с `closeOnOutsideClick={false}`; пока идёт удаление — `closeOnEscape={false}`, «Не удалять» выключена, подтверждение `solid` `danger` в `loading`.',
    ],
    keywords: ["настройки", "профиль", "форма", "settings", "Switch", "Modal", "опасная зона"],
  },
  {
    file: "form-drawer",
    segment: "pattern-form-drawer",
    label: "Form in Drawer",
    title: "Форма в Drawer",
    description:
      "Создание записи без ухода со страницы: длинная форма в боковой панели, проверка при отправке, загрузка и уведомление. Короткая форма (до четырёх полей) — в `Modal`.",
    rules: [
      "Кнопка открытия — главное действие страницы в `PageContent.Actions`; `Drawer.Trigger` оборачивает её как слот.",
      "Форма связана с кнопкой в подвале через `form={formId}`: `Drawer.Footer` вне `<form>`, отправка всё равно работает и по Enter.",
      "Группы — `<fieldset>` без рамки с заголовком `title-s` в 16 px над полями; группа от группы — 32 px воздуха, без разделителей. `fieldset disabled` выключает все поля на время запроса.",
      "Проверка — при отправке: ошибки в `error` каждого поля, фокус на первое неверное поле; метка `required` у обязательных, `optional` — у необязательных, если их меньшинство.",
      "Тип клиента — `Radio.Group` с `label` (два видимых варианта), менеджер — `Select`, согласие — `Checkbox` с `hint`: значение уходит с формой, а не применяется сразу.",
      "Подвал: «Отмена» `outline` + `neutral`, главное действие последним, в `loading` во время запроса; пока сохраняем, панель не закрывается (`closeOnEscape={false}`, без крестика).",
      "Результат — `Notification` и новая строка в таблице; панель закрывается сама.",
    ],
    keywords: ["форма", "drawer", "панель", "создание", "валидация", "fieldset", "form"],
  },
  {
    file: "dashboard",
    segment: "pattern-dashboard",
    label: "Dashboard",
    title: "Дашборд",
    description:
      "Обзорный экран: переключатель периода в шапке, ряд KPI, панели с прогрессом и структурой, короткая таблица со ссылкой на полный список.",
    rules: [
      "Период — `SegmentedControl` в `PageContent.Actions`: он меняет значения на этом же экране. Вкладки (`Tabs`) — для разного содержимого, не для периода.",
      'KPI — `Card variant="stat-trend"` в сетке `auto-fit` (~14rem), 16 px между плитками; `Card.Delta` с `tone` по смыслу изменения: рост просрочки — `danger`, её снижение — `success`.',
      'Панели — `Card variant="panel"` с `Card.SectionTitle as="h2"` и тихим контекстом справа (`Card.SectionTrailing`, `caption` + `muted`).',
      "Прогресс по одному значению — `ProgressBar` c `label` и `showValue`; части целого — `ProgressBar segments` и легенда из `Badge` с `Badge.Dot` теми же оттенками.",
      "Блоки страницы — 40 px (их даёт `PageContent.Body`), плитки внутри блока — 16 px: близость показывает, что связано.",
      'Короткий список — `DataTable paging="none"` под заголовком раздела без карточки, «Все счета» — `LinkButton`: это переход, а не действие.',
    ],
    keywords: ["дашборд", "обзор", "метрики", "kpi", "dashboard", "Card", "ProgressBar"],
  },
  {
    file: "screen-states",
    segment: "pattern-screen-states",
    label: "Screen states",
    title: "Состояния экрана",
    description:
      "Загрузка, ошибка и пустота в одном экране: каждый регион сообщает о своём состоянии на своём месте, раскладка не прыгает. Нажмите «Повторить», чтобы пройти загрузку до данных.",
    rules: [
      'Ошибка, которая касается всей страницы, — `Banner tone="danger"` первым блоком `PageContent.Body` с действием «Повторить»; результат действия — `Notification`.',
      "Ошибка региона — на месте региона: `error` у `DataTable` (шапка таблицы остаётся), а не всплывающее окно.",
      "Загрузка таблицы — `loading` + `loadingRows` (скелетон строк); загрузка карточки — `Spinner` на месте содержимого и `aria-busy` на карточке, высота блока не меняется.",
      "Устаревшие данные лучше пустоты: остатки показаны на прошлую дату, и это сказано в `Card.SectionTrailing`.",
      'Пусто при первом запуске — `EmptyPage size="s"` внутри панели: иконка `tone="accent"`, что это и зачем, одно действие. Пустой результат фильтра — `empty` у таблицы.',
      "Никаких самодельных спиннеров, шиммеров и модалок с ошибкой: у кита на каждое состояние уже есть компонент.",
    ],
    keywords: ["состояния", "загрузка", "ошибка", "пусто", "loading", "error", "empty", "Spinner"],
  },
];
