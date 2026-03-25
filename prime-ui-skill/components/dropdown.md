# Dropdown

## Что это

Композитное меню действий: по клику на триггер открывается портальная панель со списком команд, группами, шапкой и разделителями.

## Для чего нужен

- **Карточки сущностей** — вторичные операции над задачей, документом или тикетом без отдельной страницы настроек.
- **Таблицы и журналы** — «⋯» у строки: дублировать, экспортировать, открыть историю, не уводя фокус со списка.
- **Шапка продукта** — профиль, выход, тариф и справка в одном компактном меню у аватара или кнопки.
- **Узкие колонки и плотные интерфейсы** — короткий триггер и длинные подписи пунктов: ширина панели подстраивается под триггер и размер контента.
- **Мастера и пошаговые сценарии** — внешнее состояние `open`, чтобы подсветить шаг, синхронизировать подсказку или отправить событие в аналитику.
- **Текстовые триггеры и ссылки** — тот же паттерн меню на ссылке или подчёркнутом тексте, если не нужна отдельная кнопка.

## Юзкейсы

Каждый пример — другой экран и смысл; комбинации пропсов не повторяют одну задачу.

### Базовый

Частый случай: меню действий над карточкой задачи в трекере.

```tsx
import { Button, Dropdown } from "prime-ui-kit";

export function TaskCardMenu() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke" aria-label="Действия с задачей">
          ⋯
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Dropdown.Item onSelect={() => console.log("edit")}>Редактировать</Dropdown.Item>
        <Dropdown.Item onSelect={() => console.log("copy")}>Дублировать</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item destructive onSelect={() => console.log("archive")}>
          В архив
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
```

### С вариантами/размерами

Логистика: компактная панель на мобильной ширине и явное опасное действие.

```tsx
import { Button, Dropdown } from "prime-ui-kit";

export function ShipmentCardMenu() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root size="s" variant="neutral" mode="lighter">
          Заказ #4821
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content size="s" align="start" side="bottom">
        <Dropdown.Item>Показать маршрут</Dropdown.Item>
        <Dropdown.Item>Связаться с курьером</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item destructive>Отменить доставку</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Реестр платежей: подпись строки и меню операций рядом, в одной строке панели фильтров.

```tsx
import { Button, Dropdown, Typography } from "prime-ui-kit";

export function PayoutRowToolbar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        maxWidth: "36rem",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <Typography.Root size="m" weight="medium">
          Выплата 12.04.2025
        </Typography.Root>
        <Typography.Root size="s" tone="muted">
          Получатель: ООО «Север» · 128 400 ₽
        </Typography.Root>
      </div>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="s" variant="neutral" mode="stroke" aria-label="Операции по выплате">
            Действия
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="end" sameMinWidthAsTrigger>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Документы</Dropdown.GroupLabel>
            <Dropdown.Item>Скачать акт</Dropdown.Item>
            <Dropdown.Item>Отправить на почту</Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Item disabled>Сторно (недоступно)</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
}
```

### Контролируемый режим

Панель мониторинга: родитель держит флаг открытия, чтобы показать подсказку рядом с меню фильтров.

```tsx
import * as React from "react";
import { Button, Dropdown } from "prime-ui-kit";

export function FilterMenuWithHint() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Интервал
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Dropdown.Item onSelect={() => setOpen(false)}>Сегодня</Dropdown.Item>
          <Dropdown.Item onSelect={() => setOpen(false)}>7 дней</Dropdown.Item>
          <Dropdown.Item onSelect={() => setOpen(false)}>30 дней</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>
        Меню {open ? "открыто — можно подсветить шаг онбординга" : "закрыто"}
      </span>
    </div>
  );
}
```

## Анатомия

- `Dropdown.Root` — открытие/закрытие, контролируемый и неконтролируемый режим, id для связи триггера и меню, ref триггера для позиции.
- `Dropdown.Trigger` — ровно один дочерний элемент; на него сливаются ref, `aria-*` и переключение по клику.
- `Dropdown.Content` — портал, `role="menu"`, позиционирование у триггера, ловушка фокуса, закрытие по Escape и клику снаружи.
- `Dropdown.Inset` — внутренние поля и вертикальный шаг между прямыми дочерними узлами внутри панели.
- `Dropdown.Block` — секция внутри панели (шапка + список).
- `Dropdown.Header`, `HeaderRow`, `HeaderLeading`, `HeaderMain`, `HeaderTitle`, `HeaderDescription`, `HeaderTrailing` — разметка шапки профиля или промо-блока.
- `Dropdown.Item` — кнопка `role="menuitem"`; при активации вызывает `onSelect` и закрывает меню (если пункт не `disabled`).
- `Dropdown.ItemIcon` — иконка слева от текста строки; размер по умолчанию от яруса `Content`.
- `Dropdown.Group`, `Dropdown.GroupLabel`, `Dropdown.Separator` — группировка и визуальное разделение блоков.

## API

### Dropdown.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| open | `boolean` | — | Нет | Контролируемое открытие панели. |
| defaultOpen | `boolean` | `false` | Нет | Начальное состояние в неконтролируемом режиме. |
| onOpenChange | `(open: boolean) => void` | — | Нет | Событие при открытии и закрытии. |
| children | `React.ReactNode` | — | Да | Триггер, контент и вложенная разметка. |

### Dropdown.Trigger

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| children | `React.ReactElement` | — | Да | Один элемент; на него навешиваются ref, aria и объединённый `onClick`. |
| asChild | `boolean` | `true` | Нет | В типе сохранён для согласованности; триггер всегда клонирует дочерний элемент. |

### Dropdown.Content

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| align | `"start" \| "center" \| "end"` | `"start"` | Нет | Горизонтальное выравнивание панели относительно триггера. |
| side | `"bottom" \| "top"` | `"bottom"` | Нет | Предпочтительная сторона; при нехватке места пересчитывается. |
| sameMinWidthAsTrigger | `boolean` | `false` | Нет | Минимальная ширина панели не меньше ширины триггера. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Ярус токенов для панели, строк, подписей групп и иконки по умолчанию. |
| className | `string` | — | Нет | Дополнительный класс портальной панели. |
| children | `React.ReactNode` | — | Да | Вложенное меню: Inset, Block, Group, Item и т.д. |

### Dropdown.Inset

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| padding | `"none" \| "x1" \| "x2" \| "x3"` | `"x2"` | Нет | Внутренние поля от края `Content`. |
| gap | `"none" \| "x2" \| "x3" \| "x4"` | `"x3"` | Нет | Вертикальный зазор между прямыми дочерними узлами. |
| className | `string` | — | Нет | Дополнительный класс. |
| children | `React.ReactNode` | — | Да | Блоки и пункты внутри inset. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты контейнера. |

### Dropdown.Block

Наследует атрибуты `HTMLDivElement`.

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| className | `string` | — | Нет | Дополнительный класс секции. |
| children | `React.ReactNode` | — | Нет | Шапка, группы и пункты. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты `div`. |

### Dropdown.Header

Как у `Dropdown.Block`: `className`, `children`, остальные атрибуты `div`.

### Dropdown.HeaderRow

Как у `Dropdown.Block`.

### Dropdown.HeaderLeading

Как у `Dropdown.Block`.

### Dropdown.HeaderMain

Как у `Dropdown.Block`.

### Dropdown.HeaderTitle

Как у `Dropdown.Block`.

### Dropdown.HeaderDescription

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| truncate | `boolean` | — | Нет | Однострочное усечение с многоточием. |
| className | `string` | — | Нет | Дополнительный класс. |
| children | `React.ReactNode` | — | Нет | Текст описания. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты `div`. |

### Dropdown.HeaderTrailing

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| alignSelf | `"start" \| "center"` | `"start"` | Нет | Вертикальное выравнивание слота в строке шапки. |
| className | `string` | — | Нет | Дополнительный класс. |
| children | `React.ReactNode` | — | Нет | Бейдж, кнопка и т.п. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты контейнера. |

### Dropdown.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| onSelect | `() => void` | — | Нет | Вызывается при активации; затем меню закрывается. |
| disabled | `boolean` | — | Нет | Пункт не активен, не закрывает меню по клику. |
| destructive | `boolean` | — | Нет | Визуальный акцент опасного действия (`data-destructive`). |
| className | `string` | — | Нет | Дополнительный класс кнопки пункта. |
| children | `React.ReactNode` | — | Да | Текст, `ItemIcon` и прочая разметка строки. |

### Dropdown.ItemIcon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| as | `React.ElementType` | `"span"` | Нет | Корневой элемент или компонент иконки. |
| aria-hidden | `boolean \| "true" \| "false"` | `true` | Нет | Скрыть декоративную иконку от вспомогательных технологий, если есть текст пункта. |
| className | `string` | — | Нет | Дополнительный класс обёртки. |
| children | `React.ReactNode` | — | Нет | Содержимое, если иконка не задаётся через `as`. |
| size | `number` | из яруса `Content` | Нет | Размер иконки в px. |
| …rest | `Record<string, unknown>` | — | Нет | Пробрасываются в элемент `as` (например `strokeWidth`), кроме зарезервированных полей. |

### Dropdown.Group

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| className | `string` | — | Нет | Дополнительный класс (`role="group"`). |
| children | `React.ReactNode` | — | Нет | Подпись группы и пункты. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты `div`. |

### Dropdown.GroupLabel

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| className | `string` | — | Нет | Дополнительный класс подписи. |
| children | `React.ReactNode` | — | Да | Текст заголовка группы. |

### Dropdown.Separator

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| className | `string` | — | Нет | Дополнительный класс для `hr`. |

## Варианты

- **`Dropdown.Content` · `size`** — единый ярус для панели, высоты строк, типографики подписей групп и размера иконки по умолчанию в `ItemIcon`. Доступные размеры: `s`, `m` (по умолчанию), `l`, `xl`. При изменении размера автоматически меняются:
  - Отступы панели (`padding`)
  - Высота пунктов меню (`min-height`)
  - Горизонтальные отступы пунктов (`padding-inline`)
  - Размер шрифта пунктов и подписей групп (`font-size`)
  - Размер иконок в `ItemIcon` (если не указан явно через проп `size`)
  - Радиус скругления пунктов (`border-radius`)
  - Отступы в шапке и между элементами
- **`Dropdown.Item` · `destructive`** — выделение опасных команд (удаление, отмена, блокировка).
- **`Dropdown.Content` · `align` / `side`** — привязка к краю триггера и предпочтение открываться снизу или сверху; итоговая сторона может смениться при нехватке места во вьюпорте.
- **`Dropdown.HeaderDescription` · `truncate`** — длинный вторичный текст в шапке в одну строку.
- **`Dropdown.Inset` · `padding` / `gap`** — плотный или разреженный блок текста и списка внутри панели.

## Состояния

- **Закрыто** — портальное меню не смонтировано; триггер с `aria-expanded={false}`.
- **Открыто** — панель в портале, `aria-expanded={true}`, на контейнере меню задаются `data-size` и `data-side` (фактическая сторона после расчёта).
- **Неконтролируемый режим** — `defaultOpen` задаёт начальное значение; дальше состояние внутри `Root`.
- **Контролируемый режим** — `open` и `onOpenChange` полностью управляют видимостью снаружи.
- **Недоступный пункт** — `disabled` на `Dropdown.Item`: `aria-disabled`, `tabIndex={-1}`, клик и активация клавишей не вызывают `onSelect` и не закрывают меню.

## Доступность (a11y)

- Триггер получает `aria-expanded`, `aria-haspopup="menu"`, `aria-controls` на id панели; у панели `role="menu"` и `aria-labelledby` на id триггера.
- Пункты — `role="menuitem"`; у отключённых — `aria-disabled` и исключение из логики активации.
- В открытой панели работает ловушка фокуса с возвратом на триггер после закрытия; **Escape** и клик вне триггера и панели закрывают меню.
- Стрелки **вверх/вниз**, **Home** и **End** перемещают фокус между доступными пунктами; **Enter** и **Пробел** активируют пункт.
- Для триггера только с иконкой или символом задайте доступное имя: `aria-label` на кнопке или осмысленный текст внутри ссылки.

## Ограничения и заметки

- Компонент рассчитан на **плоское меню**: вложенные подменю «вторым уровнем» в API не предусмотрены — для сложной иерархии комбинируйте с навигацией или отдельными паттернами.
- Это **меню действий**, а не выбор значения поля формы — для закрытого поля с выбранным значением используйте **Select**.
- **`Dropdown.Trigger`** принимает ровно **один** элемент React; составные триггеры оборачивайте в один узел (например `span` или `Button.Root`).
- После успешного `onSelect` меню **закрывается**; отключённый пункт меню не закрывает.
- Панель рендерится в **портале**; учитывайте z-index и фокус при вложении в **Modal** или **Drawer**.
- **Размеры иконок**: `Dropdown.ItemIcon` автоматически подбирает размер иконки в зависимости от `size` у `Dropdown.Content`. **Не указывайте** явно проп `size` у `ItemIcon`, если хотите, чтобы иконки масштабировались вместе с меню. Явный `size` переопределяет автоматический размер и нарушает согласованность дизайн-системы.

## Связанные компоненты

- **Button** — типичный триггер меню; **LinkButton** — если нужен текстовый акцент вне кнопки.
- **Select** — выбор одного значения из списка с подписью в триггере.
- **Popover** — нейтральный портальный контейнер без роли меню и без обхода пунктов как `menuitem`.
- **Modal** / **Drawer** — обёртки сценариев, куда меню могут открываться из шапки или строки.
- **Avatar**, **Badge**, **Typography** — частые элементы внутри `Header` и строк `Item`.
