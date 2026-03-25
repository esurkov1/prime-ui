# Datepicker

## Что это

Набор частей для календарного выбора даты или периода: сетка дней, оболочка с контекстом размера, быстрые пресеты, время суток и текстовая подпись; сетка построена на react-day-picker с оформлением prime-ui-kit, локаль и форматирование дат удобно подключать через date-fns.

## Для чего нужен

- **Бронирование и слоты** — клиент выбирает день и время визита; календарь и `Datepicker.Time` делят одно состояние, подпись рядом объясняет выбранный слот.
- **Аналитика и отчёты** — задание периода «с–по» с пресетами «эта неделя», «этот месяц»; на широкой панели два месяца рядом ускоряют навигацию.
- **Публикация контента** — отложенная дата публикации статьи или акции: одиночная дата, валидация недоступных дней (выходные, прошлое).
- **Документооборот** — фильтр по дате подписания или срока действия договора во всплывающем блоке рядом с полем поиска.
- **Логистика и доставка** — интервал отгрузки с разным временем начала и конца в режиме диапазона.
- **Настройки профиля** — день рождения или юбилейная дата в форме с понятной подписью и локалью интерфейса.

## Юзкейсы

### Базовый

Одна дата в форме; состояние в React, подпись форматируется через date-fns.

```tsx
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";

import { Datepicker } from "prime-ui-kit";

export function ProfileBirthDateField() {
  const [born, setBorn] = React.useState<Date | undefined>();

  return (
    <Datepicker.Shell>
      <Datepicker.Calendar
        locale={ru}
        mode="single"
        month={new Date(2026, 0, 1)}
        selected={born}
        onSelect={setBorn}
      />
      <Datepicker.Value as="p">
        {born ? format(born, "d MMMM yyyy", { locale: ru }) : "Укажите дату рождения"}
      </Datepicker.Value>
    </Datepicker.Shell>
  );
}
```

### С вариантами/размерами

Витрина тарифов: компактный календарь в карточке ограниченной ширины.

```tsx
import { ru } from "date-fns/locale";
import * as React from "react";

import { Datepicker } from "prime-ui-kit";

export function PlanTrialStartPicker() {
  const [start, setStart] = React.useState<Date | undefined>();

  return (
    <Datepicker.Shell size="s">
      <Datepicker.Calendar
        locale={ru}
        mode="single"
        numberOfMonths={1}
        selected={start}
        size="s"
        onSelect={setStart}
      />
    </Datepicker.Shell>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Панель фильтров в боковой колонке отчёта: диапазон с адаптивными двумя месяцами.

```tsx
import { ru } from "date-fns/locale";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Datepicker } from "prime-ui-kit";

export function ReportSidebarDateFilter() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <aside style={{ minWidth: 0, width: "100%" }}>
      <Datepicker.Shell>
        <Datepicker.Calendar
          locale={ru}
          mode="range"
          responsiveMonths
          responsiveBreakpoints={{ twoColumns: 480 }}
          selected={range}
          onSelect={setRange}
        />
      </Datepicker.Shell>
    </aside>
  );
}
```

### Контролируемый режим

Бронирование: пресеты «сегодня / завтра», время и одно состояние `Date`, синхронизируемое с API.

```tsx
import { addDays } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";

import { Datepicker, type DatepickerPresetSingle } from "prime-ui-kit";

const presets: DatepickerPresetSingle[] = [
  { label: "Сегодня", date: new Date() },
  { label: "Завтра", date: addDays(new Date(), 1) },
];

export function BookingSlotPicker({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (next: Date | undefined) => void;
}) {
  return (
    <Datepicker.Shell
      presets={<Datepicker.Presets mode="single" presets={presets} onSelect={onChange} />}
    >
      <Datepicker.Calendar
        locale={ru}
        mode="single"
        selected={value}
        onSelect={onChange}
      />
      <Datepicker.Time value={value} onChange={onChange} />
    </Datepicker.Shell>
  );
}
```

### Композиция с Popover

Выпадающий календарь по клику на кнопку с автоматическим закрытием после выбора даты.

```tsx
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import * as React from "react";

import { Button, Datepicker, Popover } from "prime-ui-kit";

export function DatepickerPopoverField() {
  const [value, setValue] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    setValue(date);
    if (date) setOpen(false);
  };

  const label = value ? format(value, "d MMMM yyyy", { locale: ru }) : "Выберите дату";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          <Button.Icon>
            <CalendarDays aria-hidden strokeWidth={1.75} />
          </Button.Icon>
          {label}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <Popover.Inset padding="none">
          <Datepicker.Shell>
            <Datepicker.Calendar
              locale={ru}
              mode="single"
              responsiveMonths
              selected={value}
              onSelect={handleSelect}
            />
          </Datepicker.Shell>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

## Анатомия

- **`Datepicker.Shell`** — корневая обёртка: провайдер размера и запроса месяца для пресетов; опционально слот `presets` (нижняя полоса).
- **`Datepicker.Calendar`** — сетка react-day-picker с классами Prime; внутри — кастомные шевроны и подпись месяца с кнопками навигации на базе `Button`.
- **`Datepicker.Presets`** — `ButtonGroup` с вариантами быстрого выбора (single или range).
- **`Datepicker.Time`** — одно или два поля `Input` с `type="time"`, время вшивается в выбранные даты.
- **`Datepicker.Value`** — обёртка над `Typography.Root` с кеглем, привязанным к размеру датпикера.

Экспортируемые утилиты: **`formatTimeInputValue`**, **`mergeTimeIntoDate`** — для согласования `Date` с нативным `input type="time"` и обратно.

## API

### Datepicker.Calendar

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | из контекста Shell или `m` | Нет | Размер ячеек и типографики. |
| responsiveMonths | boolean | false | Нет | 1 или 2 месяца по ширине контейнера; при `true` `numberOfMonths` игнорируется. |
| responsiveBreakpoints | `{ twoColumns: number }` | `{ twoColumns: 500 }` | Нет | Порог ширины (px) для второй колонки. |
| weekStartsOn | 0–6 | 1 | Нет | Первый день недели. |
| navLayout | см. react-day-picker | `after` | Нет | Положение навигации по месяцам. |
| month | Date | — | Нет | Текущий отображаемый месяц (контролируемо). |
| onMonthChange | `(d: Date) => void` | — | Нет | Смена месяца; связана с контекстом Shell. |
| numberOfMonths | number | 1 | Нет | Фиксированное число месяцев без responsive. |
| mode, selected, onSelect, disabled, locale, classNames, components, style | см. DayPickerProps | — | Зависит от режима | Режим выбора и остальные пропсы react-day-picker пробрасываются в `DayPicker`. |

### Datepicker.Shell

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `m` | Нет | Контекст размера для дочерних частей. |
| presets | ReactNode | — | Нет | Содержимое нижней полосы (часто `Datepicker.Presets`). |
| children | ReactNode | — | Да | Календарь, время, подпись. |
| className | string | — | Нет | Доп. класс корня. |

### Datepicker.Presets

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| mode | `"single" \| "range"` | — | Да | Тип пресетов и сигнатура onSelect. |
| presets | массив с `label` и `date` или `range` | — | Да | Кнопки быстрого выбора. |
| onSelect | функция | — | Да | Вызов при выборе пресета. |
| size | `"s" \| "m" \| "l" \| "xl"` | из контекста | Нет | Размер сегментов. |
| className | string | — | Нет | Класс блока. |
| title | string | — | Нет | Есть в типе; в разметке компонента не рендерится. |

### Datepicker.Time

**Режим single** (по умолчанию): `value`, `onChange`, опционально `labels.time`, `size`.

**Режим range**: `mode="range"`, `from`, `to`, `onFromChange`, `onToChange`, опционально `labels.from` / `labels.to`, `size`.

Поля времени неактивны, пока нет соответствующей даты-якоря.

### Datepicker.Value

Наследует пропсы `Typography.Root`, кроме обязательного `size` у типографики: здесь `size` задаёт шкалу датпикера (`s`–`xl`) и маппится на кегль подписи. Доступны `as`, `tone`, `weight`, `children`, `className`, атрибуты корневого элемента.

### Утилиты

| Имя | Сигнатура | Описание |
|-----|-----------|----------|
| formatTimeInputValue | `(date?: Date) => string` | Строка `HH:mm` для `value` у `<input type="time" />`. |
| mergeTimeIntoDate | `(date: Date, timeHHmm: string) => Date` | Новая дата с часами и минутами из строки. |

## Варианты

- **Режим календаря** (`mode` у `Calendar`): в первую очередь `single` и `range`; остальные режимы react-day-picker доступны через те же пропсы, если типы это допускают.
- **Размер** (`size` у `Shell` / `Calendar` / частей): `s`, `m`, `l`, `xl` — единый ярус токенов контрола.
- **Пресеты**: только смысловое разделение `mode="single"` и `mode="range"`; набор кнопок задаётся массивом `presets`.

## Состояния

- **Выбор даты/диапазона** — через `selected` и `onSelect` (контролируемо) или внутреннее состояние day-picker при неконтролируемом использовании.
- **Недоступные дни** — проп `disabled` у `Calendar` (matcher-ы react-day-picker).
- **Время без даты** — `Datepicker.Time` отключает `input type="time"`, пока нет `value` / `from` / `to`.
- **Месяц для пресетов** — при выборе пресета вызывается `requestMonth` контекста, чтобы сетка перешла к нужному месяцу.

## Доступность (a11y)

- Сетка дней — разметка и роли react-day-picker (например `grid`, `gridcell`); клавиатурная навигация по дням — из библиотеки.
- Кнопки навигации по месяцам в кастомном caption — нативные `button` с `aria-label` (в коде на английском; при продукте на другом языке задайте свои подписи через кастомизацию компонентов day-picker при необходимости).
- Поля времени — связка `label` + `Input.Field` с `id` из `useId`.
- Пресеты — отдельные `button` внутри группы.

## Ограничения и заметки

- Пресеты для диапазона не смешиваются с режимом single в одном `Datepicker.Presets`: нужен отдельный экземпляр с `mode="range"`.
- `responsiveMonths` измеряет ширину контейнера-календаря; в узкой вёрстке без `min-width: 0` flex может обрезать ширину — учитывайте в сетке страницы.
- Стили react-day-picker подключены в модуле компонента (`react-day-picker/style.css`); кастомизация вне классов Prime может потребовать аккуратного `classNames`.
- Часовые пояса и UTC: поведение зависит от переданных `Date` и отображения в `input type="time"` в локальном времени браузера.

## Связанные компоненты

- **Button** / **ButtonGroup** — навигация по месяцам и пресеты.
- **Input** — поля времени.
- **Typography** — основа `Datepicker.Value`.
- **Popover** — типичная оболочка для выпадающего календаря по клику на триггер.
