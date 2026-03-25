# Notification

## Что это

Система тостов на контексте и портале: провайдер держит очередь сообщений, хуки показывают и закрывают карточки, а `NotificationCard` можно рендерить отдельно для статичного превью.

## Для чего нужен

- **Кабинет пользователя и платежи** — подтверждение сохранения карты, ошибка списания или успешная оплата без перехода на отдельный экран.
- **Редакторы и совместная работа** — кто-то оставил комментарий, документ отправлен на согласование, версия восстановлена из истории.
- **Логистика и трекинг** — смена статуса доставки, задержка на складе, короткое сообщение без блокировки карты заказа.
- **Интеграции и фоновые задачи** — экспорт готов, синхронизация с CRM завершилась, webhook вернул ошибку с возможностью «Повторить».
- **Медиа и загрузки** — файл загружен, конвертация завершена, превью недоступно по правам — без модального окна.
- **Инциденты и сессия** — потеря соединения, скорое обслуживание, принудительный выход из аккаунта на другом устройстве.

## Юзкейсы

Импорт из пакета `prime-ui-kit`. Примеры ниже — разные продуктовые зоны и разные части API.

### Базовый

Настройки уведомлений: после переключения канала показываем короткое подтверждение с автозакрытием.

```tsx
import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";
import * as React from "react";

function SaveChannelButton() {
  const { notify } = useNotifications();

  return (
    <Button.Root
      mode="filled"
      size="m"
      variant="primary"
      onClick={() =>
        notify({
          type: "success",
          title: "Канал обновлён",
          description: "Письма о заказах будут приходить на новый адрес.",
          position: "top-right",
          size: "m",
        })
      }
    >
      Сохранить канал
    </Button.Root>
  );
}

export function PreferencesRoot() {
  return (
    <NotificationProvider position="top-right">
      <SaveChannelButton />
    </NotificationProvider>
  );
}
```

### С вариантами/размерами

Панель модерации контента: жёсткое предупреждение крупным размером и информационное сообщение компактным — разные `type` и `size`.

```tsx
import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";

export function ModerationToolbar() {
  const { notify } = useNotifications();

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button.Root
        mode="filled"
        size="m"
        variant="danger"
        onClick={() =>
          notify({
            type: "error",
            title: "Публикация отклонена",
            description: "Нарушены правила раздела «Объявления».",
            size: "l",
            position: "top-center",
            duration: 8000,
          })
        }
      >
        Отклонить
      </Button.Root>
      <Button.Root
        mode="stroke"
        size="m"
        variant="neutral"
        onClick={() =>
          notify({
            type: "info",
            title: "Черновик сохранён",
            description: "Материал останется в очереди на 7 дней.",
            size: "s",
            position: "top-center",
            duration: 4000,
          })
        }
      >
        В черновики
      </Button.Root>
    </div>
  );
}

export function ModerationApp() {
  return (
    <NotificationProvider position="top-center" max={4}>
      <ModerationToolbar />
    </NotificationProvider>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Боковая панель отчётов: тост с действием «Открыть папку» после генерации выгрузки; иконка и счётчик строк через `badge`.

```tsx
import { Bell } from "lucide-react";
import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";

export function ReportsSidebar() {
  const { notify } = useNotifications();

  const runExport = () => {
    notify({
      type: "success",
      title: "Отчёт за квартал",
      description: "XLSX готов к скачиванию.",
      position: "bottom-right",
      size: "m",
      icon: <Bell aria-hidden style={{ width: 20, height: 20 }} />,
      badge: "12 МБ",
      action: {
        label: "Скачать",
        onClick: () => {
          window.location.assign("/exports/latest-quarter.xlsx");
        },
      },
    });
  };

  return (
    <aside>
      <Button.Root mode="filled" size="m" variant="primary" onClick={runExport}>
        Сформировать выгрузку
      </Button.Root>
    </aside>
  );
}

export function AnalyticsShell() {
  return (
    <NotificationProvider position="bottom-right">
      <ReportsSidebar />
    </NotificationProvider>
  );
}
```

### Контролируемый режим

Складской терминал: оператор добавляет тосты кнопкой «Событие», а нижняя таблица читает `items` и позволяет снять любой тост с экрана по `dismiss(id)` без крестика на самой карточке.

```tsx
import { Button, NotificationProvider, useNotificationStore } from "prime-ui-kit";

function WarehouseFooter() {
  const { items, notify, dismiss } = useNotificationStore();

  return (
    <footer>
      <Button.Root
        mode="filled"
        size="m"
        variant="primary"
        onClick={() =>
          notify({
            type: "warning",
            title: "Задержка отгрузки",
            description: "Погрузчик занят на воротах 4.",
            position: "bottom-left",
            size: "m",
            persistent: true,
            badge: items.length + 1,
          })
        }
      >
        Зафиксировать событие
      </Button.Root>
      <p>На экране тостов: {items.length}</p>
      <table>
        <tbody>
          {items.map((row) => (
            <tr key={row.id}>
              <td>{row.title}</td>
              <td>
                <Button.Root mode="ghost" size="s" variant="neutral" onClick={() => dismiss(row.id)}>
                  Снять с экрана
                </Button.Root>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </footer>
  );
}

export function WarehouseApp() {
  return (
    <NotificationProvider position="bottom-left" max={6}>
      <WarehouseFooter />
    </NotificationProvider>
  );
}
```

## Анатомия

- **`NotificationProvider`** — React Context со значением стора, дочерний портал с фиксированным viewport и зонами по позициям; внутри зон — стеки по `type`.
- **`NotificationStack` / `NotificationStackItem`** (внутренние) — список карточек, hover разворачивает стек и ставит `paused` на таймеры.
- **`NotificationCard`** — `article` с `role` alert или status, иконка, заголовок, опциональный `badge`, описание, ряд с `Button.Root` для `action`, кнопка закрытия, полоса прогресса (если не `persistent`).

## API

### NotificationProvider

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| children | React.ReactNode | — | Да | Обертка приложения (или части дерева), где вызываются хуки. |
| position | NotificationPosition | `"top-right"` | Нет | Дефолтная зона, если в `notify` не передан `position`. |
| max | number | `5` | Нет | Лимит карточек в одной стопке (позиция + type). |

### notify(options)

| Поле | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| type | `"success"` \| `"error"` \| `"warning"` \| `"info"` | — | Да | Семантика, иконка по умолчанию, группировка стека. |
| title | string | — | Да | Заголовок. |
| description | string | — | Нет | Подзаголовок. |
| size | `"s"` \| `"m"` \| `"l"` | `"m"` | Нет | Размер карточки. |
| position | NotificationPosition | из провайдера | Нет | Угол или центр края экрана. |
| duration | number | `5000` | Нет | Мс до автозакрытия; при `persistent` не используется для закрытия. |
| persistent | boolean | `false` | Нет | Не закрывать по таймеру; без полосы прогресса. |
| icon | React.ReactNode | иконка по type | Нет | Своя иконка слева. |
| badge | string \| number | — | Нет | Метка рядом с заголовком. |
| closable | boolean | `true` | Нет | Показать кнопку закрытия. |
| action | `{ label: string; onClick: () => void }` | — | Нет | Вторичное действие в теле карточки. |

Возвращает `string` — `id` записи для `dismiss(id)`.

### NotificationRecord

Результат нормализации в сторе: все поля из `NotificationOptions` с заполненными дефолтами плюс `id` и `createdAt`.

### NotificationCard

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| item | NotificationRecord | — | Да | Данные карточки. |
| paused | boolean | — | Да | Остановка обратного отсчёта (например стек развёрнут). |
| onDismiss | `(id: string) => void` | — | Да | Закрытие по таймеру или кнопке. |
| stackDepth | number | `0` | Нет | Индекс в стеке для оформления. |
| stackExpanded | boolean | `false` | Нет | Развёрнут ли стек. |
| className | string | — | Нет | Доп. класс на корне. |

### useNotifications()

| Поле | Тип | Описание |
|------|-----|----------|
| notify | `(options: NotificationOptions) => string` | Показать уведомление. |
| dismiss | `(id: string) => void` | Закрыть одно. |
| dismissAll | `() => void` | Закрыть все активные. |

### useNotificationStore()

Те же методы, плюс `items: NotificationRecord[]` — активные записи без внутреннего состояния анимации закрытия.

## Варианты

- **`type`**: `success`, `error`, `warning`, `info` — палитра, иконка по умолчанию и live-роль (`error` и `warning` → `alert` + `aria-live="assertive"`, иначе `status` + `polite`).
- **`size`**: `s`, `m`, `l` — высота, типографика и размер зоны иконки из токенов карточки.

## Состояния

- **Обычный тост** — таймер, полоса прогресса, закрытие по времени или крестику.
- **Развёрнутый стек** — при наведении на стопку карточки разъезжаются, таймеры на паузе (`paused`).
- **Persistent** — без автозакрытия и без нижней полосы; закрытие только вручную или через `dismiss` / `dismissAll`.
- **Закрытие** — карточка помечается внутренне, проигрывается exit-анимация, затем запись удаляется из стора.

## Доступность (a11y)

- Живой регион: `role="alert"` или `status` и соответствующий `aria-live`.
- Кнопка закрытия с `aria-label="Dismiss notification"`; иконка внутри с `aria-hidden`.
- Область стека помечена `aria-label` с указанием позиции.
- Действие в теле карточки — обычная кнопка `Button` с видимым текстом `label`.

## Ограничения и заметки

- Несколько вложенных `NotificationProvider` создадут несколько порталов с дублирующимися зонами — обычно достаточно одного на корне.
- Стопки разделены по **позиции** и **type**: два `info` в одном углу складываются в один стек; `info` и `success` в том же углу — в две колонки стеков.
- Параметр `max` обрезает глубину стопки; при переполнении старые в этой стопке отбрасываются.
- `duration <= 0` отключает анимацию таймера в `useCountdown`; сценарий закрытия по времени нужно продумывать отдельно.
- `NotificationCard` сам по себе не подключается к стору — для живых тостов используйте провайдер и `notify`.

## Связанные компоненты

- **Button** — кнопка действия внутри карточки (`action`).
- **Banner** — для постоянного сообщения в потоке страницы, когда тост не подходит.
- **Modal / Drawer** — для ошибок, требующих фокуса и блокировки фона; тост не заменяет их.
