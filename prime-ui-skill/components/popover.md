# Popover

## Что это

Композитный блок «якорь + портальная панель»: по клику на триггер рядом с ним открывается диалоговая панель с произвольным содержимым, позиционируемая у края окна и закрываемая по Escape или клику снаружи.

## Для чего нужен

- **Статьи и справка** — краткое пояснение термина или сноска без перехода на другую страницу.
- **Каталог и витрина** — фильтры, сортировка или превью опций в компактной панели у кнопки действия.
- **Настройки и профиль** — несколько полей или переключателей, которые не стоит выносить на отдельный экран.
- **Отчёты и дашборды** — уточнение метрики, быстрый срез данных или выбор периода у виджета.
- **Согласования и заявки** — короткая форма комментария, выбор роли или причины рядом с основным потоком.
- **Онбординг и подсказки к интерфейсу** — контекстная подсказка к элементу, не перекрывающая всю страницу модальным окном.

## Юзкейсы

Каждый фрагмент кода относится к другому типу экрана; сочетания пропсов не повторяют одну и ту же задачу.

### Базовый

Самый частый случай: пояснение к термину по клику на кнопку в тексте статьи (внешне как сноска).

```tsx
import { Button, Popover } from "prime-ui-kit";

export function GlossaryTerm() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="ghost" size="m" variant="neutral">
          SLA
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom" size="m">
        <Popover.Inset>
          <p style={{ margin: 0, maxWidth: "18rem" }}>
            Соглашение об уровне сервиса: целевое время реакции и восстановления для инцидентов.
          </p>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

### С вариантами/размерами

Карточка товара: крупная панель и просторные отступы внутри `Popover.Inset` для читаемого описания акции.

```tsx
import { Button, Popover, Typography } from "prime-ui-kit";

export function PromoHint() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          Условия акции
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom" size="xl">
        <Popover.Inset padding="x3" gap="x4">
          <Typography.Root as="p" size="s" weight="semibold">
            Скидка до 15 марта
          </Typography.Root>
          <Typography.Root as="p" size="s">
            Суммируется с бонусами программы лояльности. Не распространяется на подарочные карты.
          </Typography.Root>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

### В контексте (форма рядом с полем)

Экран уведомлений: компактный выбор канала доставки алертов в панели у переключателя.

```tsx
import { Button, Checkbox, Popover, Switch, Typography } from "prime-ui-kit";

export function AlertChannelRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <Switch.Root defaultChecked size="m" />
      <Typography.Root as="span" size="m">
        Push-уведомления
      </Typography.Root>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="ghost" size="m" variant="neutral" style={{ fontSize: "0.875rem", textDecoration: "underline" }}>
            Настроить
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="end" side="bottom" size="m" sameMinWidthAsTrigger>
          <Popover.Inset>
            <Typography.Root as="p" size="s" style={{ margin: "0 0 0.5rem" }}>
              Каналы
            </Typography.Root>
            <Checkbox.Root defaultChecked size="m">
              <Checkbox.Label>Критические</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root size="m">
              <Checkbox.Label>Маркетинг</Checkbox.Label>
            </Checkbox.Root>
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
```

### Контролируемый режим

Панель бронирования: родитель открывает слот по кнопке «Выбрать время» и синхронизирует состояние с подписью в шапке шага.

```tsx
import * as React from "react";
import { Button, Popover, Typography } from "prime-ui-kit";

export function BookingStep() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-start" }}>
      <Typography.Root as="p" size="s">
        Шаг 2 · {open ? "Выберите интервал в панели" : "Интервал не выбран"}
      </Typography.Root>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setOpen(true)}>
          Открыть слоты
        </Button.Root>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button.Root mode="filled" size="m" variant="primary">
              Или тут
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom" size="m">
            <Popover.Inset>
              <Typography.Root as="p" size="s" style={{ margin: "0 0 0.5rem" }}>
                Доступно сегодня
              </Typography.Root>
              <Button.Root mode="ghost" size="m" variant="neutral" onClick={() => setOpen(false)}>
                14:00–15:00
              </Button.Root>
            </Popover.Inset>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
}
```

### Расположение относительно якоря

Плотная панель инструментов редактора: панель открывается сверху и выравнивается по концу кнопки, чтобы не вылезать за край холста.

```tsx
import { Button, Popover } from "prime-ui-kit";

export function CanvasToolMenu() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="s" variant="neutral">
          Слои
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="end" side="top" size="s">
        <Popover.Inset padding="x2" gap="x2">
          <Button.Root mode="ghost" size="s" variant="neutral" style={{ display: "block", width: "100%", textAlign: "left" }}>
            Дублировать
          </Button.Root>
          <Button.Root mode="ghost" size="s" variant="neutral" style={{ display: "block", width: "100%", textAlign: "left" }}>
            Сгруппировать
          </Button.Root>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

### Фокус и вложенный портальный список

Заявка на доступ: форма внутри панели с `trapFocus` и `Select`, чтобы выпадающий список не закрывал поповер как «клик снаружи».

```tsx
import * as React from "react";
import { Button, Input, Popover, Select, Typography } from "prime-ui-kit";

export function AccessRequestPopover() {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          Запросить доступ
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom" size="m" trapFocus>
        <Popover.Inset>
          <Typography.Root as="p" size="s" weight="medium">
            Доступ к проекту
          </Typography.Root>
          <Input.Root label="Обоснование" size="m">
            <Input.Wrapper>
              <Input.Field placeholder="Зачем нужен доступ" />
            </Input.Wrapper>
          </Input.Root>
          <Select.Root placeholder="Роль" size="m">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="viewer">Наблюдатель</Select.Item>
              <Select.Item value="editor">Редактор</Select.Item>
            </Select.Content>
          </Select.Root>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <Button.Root mode="ghost" size="m" variant="neutral" onClick={() => setOpen(false)}>
              Отмена
            </Button.Root>
            <Button.Root mode="filled" size="m" variant="primary" onClick={() => setOpen(false)}>
              Отправить
            </Button.Root>
          </div>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

## Анатомия

- `Popover.Root` — открыто/закрыто (контролируемо или нет), идентификаторы связи триггера и контента, ref якоря для геометрии.
- `Popover.Trigger` — ровно один дочерний элемент; на него сливаются ref, `aria-*` и переключение по клику (`cloneElement`).
- `Popover.Content` — портальный контейнер с `role="dialog"`, позиционированием относительно триггера, опциональной ловушкой фокуса; оборачивает детей в `ControlSizeProvider` по `size`.
- `Popover.Inset` — внутренняя колонка с отступами (`padding`) и вертикальным зазором между прямыми дочерними узлами (`gap`).

## API

### Popover.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| open | `boolean` | — | Нет | Контролируемое открытие; вместе с `onOpenChange`. |
| defaultOpen | `boolean` | `false` | Нет | Начальное состояние в неконтролируемом режиме. |
| onOpenChange | `(open: boolean) => void` | — | Нет | Срабатывает при открытии и закрытии (триггер, Escape, клик вне области). |
| children | `React.ReactNode` | — | Да | Обычно `Popover.Trigger` и `Popover.Content`. |

### Popover.Trigger

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| children | `React.ReactElement` | — | Да | Один элемент-якорь; на него накладываются ref, ARIA и обработчик клика. |
| asChild | `boolean` | `true` | Нет | В API для совместимости со слотом; фактически поведение всегда через слияние с единственным ребёнком. |

### Popover.Content

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| align | `"start" \| "center" \| "end"` | `"start"` | Нет | Горизонтальное выравнивание панели относительно триггера. |
| side | `"bottom" \| "top"` | `"bottom"` | Нет | Предпочтительная сторона; у границы вьюпорта может смениться (flip). |
| sameMinWidthAsTrigger | `boolean` | `false` | Нет | Минимальная ширина панели не меньше ширины триггера. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Ярус отступов и типографики; дочерние контролы получают размер через провайдер. |
| trapFocus | `boolean` | `false` | Нет | Ловушка фокуса внутри панели при открытии (Tab циклически внутри). |
| className | `string` | — | Нет | Дополнительный класс на контейнере панели. |
| children | `React.ReactNode` | — | Да | Содержимое; часто оборачивают в `Popover.Inset`. |

### Popover.Inset

Наследует атрибуты `HTMLDivElement`; кроме перечисленного ниже можно передать `id`, `style`, `data-*` и др.

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| padding | `"none" \| "x1" \| "x2" \| "x3"` | `"x2"` | Нет | Внутренние отступы (`data-inset-padding`). |
| gap | `"none" \| "x2" \| "x3" \| "x4"` | `"x3"` | Нет | Вертикальный зазор между прямыми дочерними элементами (`data-inset-gap`). |
| className | `string` | — | Нет | Дополнительный класс обёртки. |
| children | `React.ReactNode` | — | Да | Колонка контента внутри панели. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты корневого `div`. |

## Варианты

Отдельного `variant` у корня нет. Визуальная плотность задаётся:

- **`Popover.Content` → `size`** — согласованный ярус токенов контрола для панели и вложенных полей.
- **`Popover.Inset` → `padding` и `gap`** — от «вплотную» (`padding="none"`, `gap="none"`) до просторной колонки (`padding="x3"`, `gap="x4"`).

Дополнительная стилизация — `className` на `Popover.Content` и `Popover.Inset`.

## Состояния

- **Закрыт** — `Popover.Content` не рендерится (`null`).
- **Открыт** — панель в портале, позиция пересчитывается при прокрутке и ресайзе (через хук позиционирования).
- **Неконтролируемый** — `defaultOpen` задаёт начальное открытие после монтирования.
- **Контролируемый** — `open` и `onOpenChange` на `Popover.Root`; родитель может открывать панель извне и закрывать по своей логике.
- **Триггер неактивен** — отдельного `disabled` у поповера нет: если якорь (например `Button`) с `disabled`, клик не откроет панель.
- **Ловушка фокуса** — при `trapFocus` на `Popover.Content` фокус остаётся внутри панели, пока она открыта (с восстановлением фокуса при закрытии).

## Доступность (a11y)

- Триггер получает `aria-expanded`, `aria-haspopup="dialog"`, `aria-controls` на id контента; стабильные `id` генерируются на корне.
- Панель: `role="dialog"`, `aria-modal={false}`, `aria-labelledby` указывает на id триггера (подпись диалога берётся из элемента-якоря).
- **Escape** закрывает панель.
- **Клик вне** области триггера и контента закрывает панель; клики по портальному listbox `Select`, принадлежащему контейнеру панели, подавляются как «внешние» (см. `isPortaledSelectListboxOwnedByContainer`).
- Для якоря без видимого текста задайте доступное имя (`aria-label` на кнопке или осмысленную подпись внутри элемента).

## Ограничения и заметки

- Позиционирование поддерживает только стороны **`top` и `bottom`**; влево/вправо от якоря как отдельные режимы в API не выставляются.
- Это **немодальная** панель (`aria-modal={false}`): фокус может уходить за пределы страницы; для модального сценария смотрите компонент **Modal**.
- `Popover.Trigger` принимает **строго один** элемент React; фрагменты и несколько узлов не поддерживаются.
- Проп `asChild` зарезервирован под единый паттерн слота, но слияние с дочерним элементом выполняется всегда — передача `asChild={false}` не переключает на внутреннюю обёртку-кнопку.

## Связанные компоненты

- **Button**, **LinkButton** — типичные якоря для `Popover.Trigger`.
- **Select**, **Dropdown** — вложенные выпадающие списки внутри панели; для Select предусмотрено игнорирование «внешнего» клика по портальному listbox.
- **Input**, **Textarea**, **Checkbox**, **Switch** — поля и переключатели внутри `Popover.Inset`.
- **Typography**, **Label**, **Hint** — структура текста и подписей в панели.
- **Modal** — когда нужно заблокировать остальной интерфейс и явный модальный поток.
- **Tooltip** — короткая подсказка по наведению или фокусу без отдельной «панели действий».
