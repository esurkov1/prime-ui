# Select

## Что это

Композитный выпадающий список: кнопка-триггер с текущим значением или подсказкой и портальное меню с вариантами выбора ровно одного значения.

## Для чего нужен

- **Онбординг и анкеты** — выбрать роль, страну или категорию запроса из фиксированного набора без свободного ввода.
- **Настройки аккаунта** — язык интерфейса, часовой пояс, единицы измерения в компактном поле рядом с другими контролами.
- **Коммерция и логистика** — способ доставки, склад или валюта цен: в триггере удобно показать короткую подпись, в списке — развёрнутое название.
- **Аналитика и дашборды** — один фильтр-измерение (интервал, сегмент аудитории) с явным значением после выбора.
- **Поддержка и тикеты** — приоритет, продуктовая линия или ответственная команда в форме обращения или в диалоге назначения.
- **Инфраструктура и операции** — зона развёртывания, очередь или окружение; длинные списки с группами и временно недоступными пунктами.

## Юзкейсы

Подразделы разведены по разным экранам и задачам; в каждом — свой осмысленный пример кода.

### Базовый

Типичная форма подписки: подсказка в триггере до выбора тарифа.

```tsx
import { Select } from "prime-ui-kit";

export function PlanField() {
  return (
    <Select.Root size="m" placeholder="Выберите тариф">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="starter">Старт</Select.Item>
        <Select.Item value="growth">Рост</Select.Item>
        <Select.Item value="scale">Масштаб</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
```

### С размерами и начальным значением

Панель устройства или шапка приложения: компактный контрол и заранее заданная опция.

```tsx
import { Select } from "prime-ui-kit";

export function ThemeCompactSelect() {
  return (
    <Select.Root size="s" defaultValue="system">
      <Select.Trigger aria-label="Тема оформления">
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="light">Светлая</Select.Item>
        <Select.Item value="dark">Тёмная</Select.Item>
        <Select.Item value="system">Как в системе</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
```

### В контексте (форма с подписью и подсказкой)

Экран профиля: связка `Label` + селект + `Hint`. У `Label.Root` задаётся стабильный `id`, на триггер — `aria-labelledby`, потому что `id` кнопки-триггера генерируется внутри компонента.

```tsx
import * as React from "react";
import { Hint } from "prime-ui-kit";
import { Label } from "prime-ui-kit";
import { Select } from "prime-ui-kit";

export function TimezoneField() {
  const labelId = React.useId();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        maxWidth: "20rem",
      }}
    >
      <Label.Root id={labelId} size="m">
        Часовой пояс
      </Label.Root>
      <Select.Root size="m" defaultValue="utc3">
        <Select.Trigger aria-labelledby={labelId}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="utc0">UTC+0 (Лондон)</Select.Item>
          <Select.Item value="utc3">UTC+3 (Москва)</Select.Item>
          <Select.Item value="utc9">UTC+9 (Токио)</Select.Item>
        </Select.Content>
      </Select.Root>
      <Hint.Root size="s" variant="neutral">
        Влияет на время напоминаний и отчётов «за сегодня».
      </Hint.Root>
    </div>
  );
}
```

### Контролируемый режим

Родитель хранит значение (синхронизация с URL, сброс фильтра, сохранение в стор).

```tsx
import * as React from "react";
import { Select } from "prime-ui-kit";

export function IntervalToolbar() {
  const [range, setRange] = React.useState("7d");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Select.Root value={range} onChange={setRange} size="m" placeholder="Интервал">
        <Select.Trigger aria-label="Интервал метрик">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="24h">24 часа</Select.Item>
          <Select.Item value="7d">7 дней</Select.Item>
          <Select.Item value="30d">30 дней</Select.Item>
        </Select.Content>
      </Select.Root>
      <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>Активно: {range}</span>
    </div>
  );
}
```

### В модальном окне

Сценарий поддержки: выбор категории внутри диалога вместе с кнопками действий.

```tsx
import { Button } from "prime-ui-kit";
import { Modal } from "prime-ui-kit";
import { Select } from "prime-ui-kit";

export function TicketCategoryModal() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Новый тикет
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="ticket-cat-title">
            <Modal.Header>
              <Modal.Title id="ticket-cat-title">Категория обращения</Modal.Title>
              <Modal.Description>Выберите тему до отправки в очередь.</Modal.Description>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="ghost" aria-label="Закрыть диалог">
                  Закрыть
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Body>
              <Select.Root size="m" defaultValue="billing" placeholder="Категория">
                <Select.Trigger aria-label="Категория тикета">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="billing">Оплата и счета</Select.Item>
                  <Select.Item value="bug">Сбой или ошибка</Select.Item>
                  <Select.Item value="access">Доступы и роли</Select.Item>
                </Select.Content>
              </Select.Root>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Отмена
                </Button.Root>
              </Modal.Close>
              <Button.Root size="m" variant="primary">
                Отправить
              </Button.Root>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### Иконки, подпись в триггере, группы и недоступный пункт

Сочетание `Select.TriggerIcon` и `Select.ItemIcon`, длинная подпись в поле через `label` у пункта, секции списка и пункт «занято».

```tsx
import { Icon } from "prime-ui-kit/icons";
import { Select } from "prime-ui-kit";

export function RegionSelectRich() {
  return (
    <Select.Root size="m" defaultValue="eur" placeholder="Валюта отчёта">
      <Select.Trigger>
        <Select.TriggerIcon>
          <Icon name="nav.layoutGrid" size="s" tone="subtle" />
        </Select.TriggerIcon>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupLabel>Основные</Select.GroupLabel>
          <Select.Item value="rub" label="RUB — Российский рубль">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            ₽ RUB
          </Select.Item>
          <Select.Item value="eur" label="EUR — Евро">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            € EUR
          </Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.GroupLabel>Ограничено</Select.GroupLabel>
          <Select.Item value="usd" disabled label="USD — Доллар США">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            $ USD
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
```

## Анатомия

- `Select.Root` — значение (контролируемое или нет), открытие списка, подсветка пункта, размер, `hasError`, `disabled`, `placeholder`.
- `Select.Trigger` — кнопка `role="combobox"`; внутри слот основного ряда и фиксированный шеврон справа.
- `Select.Value` — текст выбранного пункта, иначе `placeholder` (стиль подсказки через data-атрибут).
- `Select.TriggerIcon` — опциональная иконка слева от значения в триггере.
- `Select.Content` — портальный `role="listbox"` с позиционированием относительно триггера и клавиатурной навигацией; не рендерится, пока список закрыт.
- `Select.Item` — `role="option"`; дочерний `Select.ItemIcon` выделяется по типу и рендерится до текста.
- `Select.Group` / `Select.GroupLabel` / `Select.Separator` — структура длинных списков.

## API

### Select.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Размер триггера и токены списка. |
| value | `string` | — | Нет | Контролируемое значение. |
| defaultValue | `string` | — | Нет | Начальное значение без `value`. |
| onChange | `(value: string) => void` | — | Нет | Вызывается после выбора пункта. |
| disabled | `boolean` | — | Нет | Блокирует открытие и выбор. |
| placeholder | `string` | — | Нет | Текст при отсутствии выбора. |
| hasError | `boolean` | `false` | Нет | Стиль ошибки на триггере. |
| children | `React.ReactNode` | — | Да | Триггер и контент со списком. |

### Select.Trigger

Наследует атрибуты `HTMLButtonElement`, кроме принудительно заданных `id`, `type` и `role`. Поддерживает `ref` (forwardRef).

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| children | `React.ReactNode` | — | Нет | Обычно `Select.Value` и при необходимости `Select.TriggerIcon`. |
| className | `string` | — | Нет | Дополнительный класс. |
| disabled | `boolean` | — | Нет | Нативное отключение; итоговое состояние учитывает `Select.Root`. |
| ref | `React.Ref<HTMLButtonElement>` | — | Нет | Ref на элемент кнопки. |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "id" \| "type" \| "role">` | — | Нет | В т.ч. `aria-label`, `aria-labelledby`, обработчики. |

### Select.Value

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| className | `string` | — | Нет | Класс текста значения / подсказки. |

### Select.TriggerIcon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| children | `React.ReactNode` | — | Нет | Содержимое слота (иконка). |
| className | `string` | — | Нет | Класс обёртки. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Прочие атрибуты `span`. |

### Select.Content

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| className | `string` | — | Нет | Класс портального списка. |
| children | `React.ReactNode` | — | Да | Пункты и группы. |

### Select.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| value | `string` | — | Да | Значение опции. |
| label | `string` | — | Нет | Подпись в триггере; иначе из текста children или `value`. |
| disabled | `boolean` | — | Нет | Не выбирается и пропускается в клавиатурной навигации. |
| className | `string` | — | Нет | Класс пункта. |
| children | `React.ReactNode` | — | Да | Текст и опционально `Select.ItemIcon`. |
| ref | `React.Ref<HTMLDivElement>` | — | Нет | Ref на корень опции. |

### Select.ItemIcon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| children | `React.ReactNode` | — | Нет | Иконка в строке пункта. |
| className | `string` | — | Нет | Класс обёртки. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Атрибуты `span`. |

### Select.Group

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| className | `string` | — | Нет | Класс группы (`role="group"`). |
| children | `React.ReactNode` | — | Нет | Заголовок и пункты. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты `div`. |

### Select.GroupLabel

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| className | `string` | — | Нет | Класс подписи. |
| children | `React.ReactNode` | — | Нет | Текст заголовка. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты `div`. |

### Select.Separator

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| className | `string` | — | Нет | Класс `hr`. |
| …rest | `React.HTMLAttributes<HTMLHRElement>` | — | Нет | Атрибуты `hr`. |

## Варианты

Отдельного пропа `variant` нет: один визуальный стиль поля. Различия задаются `size`, семантикой ошибки `hasError` и при необходимости классами на подкомпонентах.

## Состояния

- **Пустое значение** — показывается `placeholder`, у `Select.Value` выставляется признак подсказки.
- **Выбрано** — в триггере подпись из `label` пункта или из текста children.
- **Отключён корень** — `disabled` на `Select.Root`: триггер неактивен, список не открыть.
- **Отключён пункт** — `disabled` на `Select.Item`: не выбирается кликом и не участвует в обходе стрелками.
- **Ошибка** — `hasError` на `Select.Root`: акцентная обводка триггера.
- **Открыт** — портальный listbox с фокусом и подсветкой текущего пункта.

## Доступность (a11y)

- Триггер: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls` указывает на listbox.
- Список: `role="listbox"`, `aria-labelledby` связывает с триггером; фокус при открытии переносится в панель.
- Пункты: `role="option"`, `aria-selected`, `aria-disabled` при необходимости.
- Клавиатура: стрелки вверх/вниз, Home/End, Enter/Space для выбора, Escape закрывает список (дополнительно обрабатывается хуками вне списка).
- Если видимой текстовой подписи у триггера нет, задайте `aria-label` на `Select.Trigger`. Для внешнего `Label` с `htmlFor` используйте `aria-labelledby` на триггере с `id` подписи (см. юзкейс «В контексте»).

## Ограничения и заметки

- Выбор только **одного** значения; мультивыбор и поиск по списку не входят в компонент.
- Значения — строки; числа и перечисления приводите к строке сами.
- Пока список закрыт, размонтированные `Select.Item` не инициализируют подпись — до первого открытия в триггере может отображаться сырое `value`, если подпись ещё не известна.
- Позиция списка (сверху/снизу от триггера) выбирается внутренне по доступному месту во вьюпорте; публичных пропсов `side`/`align` нет.

## Связанные компоненты

- **Label** — подпись к полю; **Hint** — пояснение под селектом.
- **Input** — когда нужен свободный ввод вместо фиксированного списка.
- **Dropdown** — меню действий, а не выбор значения поля формы.
- **Modal** / **Drawer** — обёртки для сценариев с фокусом и порталом; учитывайте вложенный портал списка.
