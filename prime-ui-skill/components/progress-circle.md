# ProgressCircle

## Что это

`ProgressCircle` — круговой индикатор доли выполнения: SVG-кольцо с ролью `progressbar` и опциональным содержимым в центре.

## Для чего нужен

- **Загрузка и фоновые задачи** — показать процент копирования или подготовки отчёта прямо в центре кольца рядом с кнопкой «Отмена».
- **Подписки и лицензии** — визуализировать «месяц 4 из 12» или оставшуюся часть периода через `max` и подпись в центре или сбоку.
- **Запись на услугу и пошаговые сценарии** — отразить текущий шаг из пяти (например «Шаг 2 из 5») без линейной полосы, когда важна компактная иконка статуса.

## Юзкейсы

### Базовый

Частый случай: процент готовности одной операции с подписью в центре.

```tsx
import { ProgressCircle } from "prime-ui-kit";

export function BackupStatus() {
  return (
    <section style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ProgressCircle.Root value={68} max={100} size="l">
        68%
      </ProgressCircle.Root>
      <div>
        <strong>Резервная копия</strong>
        <p style={{ margin: "4px 0 0", color: "#666" }}>Осталось около минуты</p>
      </div>
    </section>
  );
}
```

### С вариантами и размерами

Другая область — панель преподавателя: три компактных кольца разного `size` для разных групп заданий.

```tsx
import { ProgressCircle } from "prime-ui-kit";

export function ClassProgressRow() {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
      <div style={{ textAlign: "center" }}>
        <ProgressCircle.Root value={90} size="s">
          90%
        </ProgressCircle.Root>
        <div style={{ fontSize: 12, marginTop: 6 }}>Гр. А</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <ProgressCircle.Root value={55} size="m">
          55%
        </ProgressCircle.Root>
        <div style={{ fontSize: 12, marginTop: 6 }}>Гр. Б</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <ProgressCircle.Root value={40} size="xl">
          40%
        </ProgressCircle.Root>
        <div style={{ fontSize: 12, marginTop: 6 }}>Гр. В</div>
      </div>
    </div>
  );
}
```

### В контексте (карточка бронирования)

Экран выбора слота: кольцо показывает занятость дня (места из вместимости зала), рядом текст и кнопка без смены макета.

```tsx
import { Button, ProgressCircle } from "prime-ui-kit";

export function VenueDayCard() {
  const booked = 42;
  const capacity = 60;

  return (
    <article
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: 16,
        borderRadius: 12,
        border: "1px solid #e8e8e8",
        maxWidth: 420,
      }}
    >
      <ProgressCircle.Root value={booked} max={capacity} size="l">
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {booked}/{capacity}
        </span>
      </ProgressCircle.Root>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: "0 0 4px" }}>Суббота, 14:00</h3>
        <p style={{ margin: 0, fontSize: 14, color: "#555" }}>Зал «Север» — осталось места</p>
      </div>
      <Button.Root size="s" type="button">
        Забронировать
      </Button.Root>
    </article>
  );
}
```

### Контролируемый режим

Данные приходят из состояния или подписки (имитация потока прогресса импорта).

```tsx
import * as React from "react";

import { ProgressCircle } from "prime-ui-kit";

export function CatalogImportMonitor() {
  const [done, setDone] = React.useState(0);
  const total = 200;

  React.useEffect(() => {
    if (done >= total) return;
    const t = window.setInterval(() => setDone((n) => Math.min(total, n + 20)), 900);
    return () => window.clearInterval(t);
  }, [done, total]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <ProgressCircle.Root value={done} max={total} size="xl" label={`Импортировано ${done} из ${total} позиций`}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{Math.round((done / total) * 100)}%</span>
      </ProgressCircle.Root>
      <span style={{ fontSize: 13, color: "#666" }}>
        Обработка каталога поставщика…
      </span>
    </div>
  );
}
```

## Анатомия

- **`ProgressCircle.Root`** — обёртка `display: inline-flex` с `data-size`.
  - **`<svg role="progressbar">`** — трек и дуга заполнения (`stroke-dasharray` / `stroke-dashoffset`).
  - **Необязательный блок по центру** — потомки рендерятся в контейнере поверх SVG, если `children` заданы.

## API

### ProgressCircle.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `value` | `number` | — | Да | Текущее значение; ограничивается диапазоном `[0, max]`. |
| `max` | `number` | `100` | Нет | Верхняя граница; если `max <= 0`, подставляется `100`. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Диаметр и толщина штриха из примитивов `progressCircle`. |
| `label` | `string` | — | Нет | Текст для `aria-label` на SVG, когда в центре нет видимой подписи. |
| `children` | `React.ReactNode` | — | Нет | Контент в центре кольца. |
| `className` | `string` | — | Нет | Дополнительный класс корневого элемента. |
| `ref` | `React.Ref<HTMLDivElement>` | — | Нет | Ref на корневой `div`. |

## Варианты

Отдельного пропа `variant` нет: визуальный стиль один (трек и акцентная дуга из системных цветов). Настраивается **масштаб** через `size` (`s` → `xl`) и **шкала** через пару `value` / `max`.

## Состояния

- **Заполнение** задаётся числом `value`; дуга пересчитывается относительно `max`.
- **Выход за пределы**: значения ниже `0` становятся `0`, выше `max` — `max`.
- **Некорректный max**: при `max <= 0` используется `100`, чтобы избежать деления на ноль и пустой шкалы.
- Состояний «загрузка», «ошибка» или «неактивно» в самом компоненте нет — их отражают соседняя разметка или приостановка обновления `value`.

## Доступность (a11y)

- SVG объявлен как **`role="progressbar"`** с **`aria-valuenow`**, **`aria-valuemin={0}`**, **`aria-valuemax`** равным используемому `max`.
- Проп **`label`** задаёт **`aria-label`** на SVG — используйте его, если в центре нет текста, иначе индикатор может остаться без имени для скринридеров.
- Компонент **не фокусируется** и не ожидает клавиатурного ввода: это декоративно-информативный виджет, управление прогрессом остаётся за родителем.

## Ограничения и заметки

- Нет режима **indeterminate** (бесконечная загрузка без числа) — только определённая доля по `value` и `max`.
- Нет **`asChild`** и полиморфного корня: всегда рендерится обёртка и SVG внутри неё.
- **Ширина на весь контейнер** не поддерживается: корень `inline-flex`; для растягивания оборачивайте в собственный flex/grid-контейнер.

## Связанные компоненты

- **`ProgressBar`** — линейный тот же смысл «доля от max», если ось должна быть горизонтальной или в потоке формы.
- **`Typography`** — подписи и единицы рядом с кольцом или внутри `children`.
- **`Button`** — действия «Отмена», «Повторить» рядом с индикатором долгой операции.
