# SegmentedControl

## Что это

Составной контроль из нескольких сегментов с единственным выбранным значением: контейнер `radiogroup`, каждый пункт — кнопка с `role="radio"`, с плавающим индикатором под активным сегментом.

## Для чего нужен

- **Аналитика и отчёты** — переключить период агрегации (день / неделя / месяц) над графиком без выпадающего списка.
- **Каталог и витрина** — выбрать вид выдачи или быстрый фильтр «все / мои» в шапке списка, когда вариантов мало и их нужно видеть сразу.
- **Настройки приложения** — переключить тему или плотность интерфейса рядом с другими полями формы.
- **Задачи и процессы** — фильтровать карточки по стадии или приоритету одним рядом сегментов в тулбаре доски.
- **Редакторы и просмотрщики** — выбрать режим просмотра документа (например черновик / правки / чистый вид) у заголовка.
- **Мобильные панели** — компактно переключать подрежим на узкой ширине, когда полноценные вкладки занимают слишком много места.

## Юзкейсы

Каждый пример — другой экран и другой смысл; комбинации пропсов отражают типичное использование API.

### Базовый

Дашборд продаж: смена периода для виджета выручки.

```tsx
import { SegmentedControl } from "prime-ui-kit";

export function RevenuePeriodToggle() {
  return (
    <SegmentedControl.Root defaultValue="week" size="m">
      <SegmentedControl.Item value="day">День</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```

### С вариантами/размерами

Внутренний портал: один и тот же переключатель кварталов в четырёх размерах для согласования с плотностью таблицы и фильтров.

```tsx
import { SegmentedControl } from "prime-ui-kit";

export function QuarterPickersByDensity() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["s", "m", "l", "xl"] as const).map((size) => (
        <SegmentedControl.Root key={size} defaultValue="q2" size={size}>
          <SegmentedControl.Item value="q1">Q1</SegmentedControl.Item>
          <SegmentedControl.Item value="q2">Q2</SegmentedControl.Item>
          <SegmentedControl.Item value="q3">Q3</SegmentedControl.Item>
          <SegmentedControl.Item value="q4">Q4</SegmentedControl.Item>
        </SegmentedControl.Root>
      ))}
    </div>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Боковая панель уведомлений: время дайджеста полем ввода и выбор канала сегментами, один канал временно недоступен.

```tsx
import { Input, SegmentedControl } from "prime-ui-kit";

export function NotificationChannelPanel() {
  return (
    <aside style={{ padding: 20, maxWidth: 360, borderRadius: 12, background: "#f4f4f5" }}>
      <Input.Root id="digest-time" label="Время дайджеста" size="m">
        <Input.Wrapper>
          <Input.Field type="time" defaultValue="09:00" />
        </Input.Wrapper>
      </Input.Root>
      <p style={{ margin: "16px 0 8px", fontSize: 13, fontWeight: 600 }}>Канал</p>
      <SegmentedControl.Root defaultValue="email" size="m">
        <SegmentedControl.Item value="email">Почта</SegmentedControl.Item>
        <SegmentedControl.Item value="push">Пуш</SegmentedControl.Item>
        <SegmentedControl.Item value="sms" disabled>
          SMS
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    </aside>
  );
}
```

### Контролируемый режим

Страница медиатеки: родитель держит выбранный тип контента и синхронизирует его с запросом к API при смене сегмента.

```tsx
import * as React from "react";
import { SegmentedControl } from "prime-ui-kit";

export function MediaLibraryFilterBar() {
  const [kind, setKind] = React.useState<"photo" | "video" | "audio">("photo");

  return (
    <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 14 }}>Тип файлов: {kind}</span>
      <SegmentedControl.Root value={kind} onValueChange={(v) => setKind(v as typeof kind)} size="m">
        <SegmentedControl.Item value="photo">Фото</SegmentedControl.Item>
        <SegmentedControl.Item value="video">Видео</SegmentedControl.Item>
        <SegmentedControl.Item value="audio">Аудио</SegmentedControl.Item>
      </SegmentedControl.Root>
    </header>
  );
}
```

## Анатомия

`SegmentedControl.Root` — обёртка `div` с `role="radiogroup"`, провайдером размера контрола и слоем плавающего индикатора.

- `SegmentedControl.Item` — сегмент (`button`, `role="radio"`).
- `SegmentedControl.Icon` — `span` с `aria-hidden` для декоративной иконки внутри сегмента.

## API

### SegmentedControl.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| value | string | — | Нет | Выбранное значение в контролируемом режиме. |
| defaultValue | string | "" | Нет | Начальное значение в неконтролируемом режиме; пустая строка — нет выбранного сегмента. |
| onValueChange | (value: string) => void | — | Нет | Смена выбранного значения (клик или клавиатура). |
| disabled | boolean | false | Нет | Отключает всю группу. |
| size | "s" \| "m" \| "l" \| "xl" | "m" | Нет | Размер сегментов и типографики. |
| children | React.ReactNode | — | Да | Сегменты и вложенная разметка. |
| className | string | — | Нет | Дополнительный класс на контейнере (например ширина 100%). |

### SegmentedControl.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| value | string | — | Да | Идентификатор сегмента. |
| disabled | boolean | false | Нет | Отключает один сегмент; при навигации стрелками пропускается. |
| children | React.ReactNode | — | Да | Подпись и/или `SegmentedControl.Icon`. |
| className | string | — | Нет | Дополнительный класс на кнопке. |

### SegmentedControl.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| children | React.ReactNode | — | Да | Иконка. |
| className | string | — | Нет | Дополнительный класс. |
| …rest | Omit<HTMLAttributes<HTMLSpanElement>, "children"> | — | Нет | Прочие атрибуты `span`. |

## Варианты

Отдельного пропа `variant` нет: внешний вид единый для всех сегментов. Визуальная иерархия задаётся пропом `size` на корне (`s` | `m` | `l` | `xl`).

## Состояния

- **Выбранный сегмент** — `aria-checked="true"`, у выбранного пункта `tabIndex={0}`, у остальных `-1` (кроме случая отсутствия выбора).
- **Нет выбора** — при `defaultValue=""` и отсутствии `value` ни один сегмент не отмечен; у корня `tabIndex={0}` для приёма фокуса группы.
- **Пункт `disabled`** — `disabled` на кнопке, `data-disabled`, не участвует в клике и в обходе стрелками.
- **Корень `disabled`** — `aria-disabled` на группе, все сегменты неактивны.
- **Анимация индикатора** — при смене значения на корне кратко выставляется `data-animate="true"` для плавного перемещения пилюли.

## Доступность (a11y)

- Семантика **radiogroup / radio** и связь через общее состояние выбора.
- **Roving tabindex**: фокус табом попадает на группу или на выбранный сегмент; стрелки **Left/Right** переносят выбор и фокус между включёнными сегментами.
- **Фокус** — видимое кольцо `:focus-visible` на сегментах.
- Иконка в `SegmentedControl.Icon` скрыта от вспомогательных технологий (`aria-hidden`); у сегмента должно оставаться доступное имя через видимый текст или скрытый текст в `children`.

## Ограничения и заметки

- Нет встроенной **вертикальной** раскладки и отдельного пропа ориентации — сетка колонок только горизонтальная.
- Нет **`asChild`** и слияния с произвольным корневым элементом.
- Корень **не пробрасывает** произвольные HTML-атрибуты (`aria-label`, `style` и т.д.) — при необходимости оборачивайте группу во внешний элемент с нужной семантикой.
- Значения сегментов — **строки**; привязка к enum на стороне приложения остаётся на потребителе.
- Плавающий индикатор измеряет геометрию активного сегмента в layout; избегайте смены размеров сегментов без пересчёта (например тяжёлые условные вложения) без понимания, что позиция обновляется через `ResizeObserver` и `MutationObserver`.

## Связанные компоненты

- **Tabs** — когда нужны полноценные панели контента и клавиатурная модель вкладок.
- **ButtonGroup** — группа независимых или переключаемых кнопок действий, а не единственный выбор из набора.
- **Radio** — одиночные радиокнопки с собственной разметкой поля; для ряда взаимоисключающих опций визуально компактнее SegmentedControl.
- **Select** — когда вариантов много или список длинный.
