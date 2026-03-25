# Tooltip

## Что это

Составной слой всплывающей подсказки: провайдер задержки, корень с состоянием открытия, триггер из одного дочернего элемента и контент в портале с позиционированием от якоря.

## Для чего нужен

- **Панели редактирования и формы** — пояснить назначение неочевидной кнопки, иконки без подписи или сокращённого поля без раздувания разметки.
- **Таблицы и дашборды** — раскрыть значение метрики, статуса или заголовка колонки при наведении или фокусе с клавиатуры.
- **Витрины и маркетинговые блоки** — коротко пояснить условия акции или ограничение по ссылке «Подробнее», не уводя на отдельную страницу сразу.
- **Внутренние каталоги и справочники** — дать расшифровку аббревиатуры, внутреннего кода или статуса строки в списке.
- **Онбординг и пустые состояния** — мягко подсказать следующий шаг у единичного призыва к действию, не показывая постоянный текст под каждым контролом.

## Юзкейсы

Каждый пример — другой тип экрана и другой набор пропсов; импорт из пакета `prime-ui-kit`.

### Базовый

Карточка настроек уведомлений: кнопка «Сохранить» с пояснением, что именно отправляется на сервер.

```tsx
import { Button, Tooltip } from "prime-ui-kit";

export function NotificationSaveRow() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root type="submit" variant="primary" mode="filled" size="m">
            Сохранить
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Записать выбранные каналы и частоту писем в профиль</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
```

### С вариантами/размерами

Сетка карточек товаров: у каждой карточки иконка «избранное» без текста; подсказка компактного размера, чтобы не перекрывать соседние карточки.

```tsx
import { Button, Icon, Tooltip } from "prime-ui-kit";

export function WishlistIconCell() {
  return (
    <Tooltip.Provider delayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root
            type="button"
            variant="neutral"
            mode="ghost"
            size="m"
            aria-label="Добавить в избранное"
          >
            <Button.Icon>
              <Icon name="nav.itemDot" size="s" tone="subtle" />
            </Button.Icon>
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content size="s" side="top">
          Сохранить товар в список желаний
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Боковая панель отчёта: термин в тексте сводки с фокусом с клавиатуры и подсказкой снизу, чтобы не упираться в край панели.

```tsx
import { Tooltip } from "prime-ui-kit";

export function ReportSidebarGlossary() {
  return (
    <aside style={{ maxWidth: 280, padding: 16 }}>
      <p style={{ margin: 0, lineHeight: 1.5 }}>
        Итог по{" "}
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <button
                type="button"
                style={{
                  margin: 0,
                  padding: 0,
                  border: "none",
                  background: "none",
                  font: "inherit",
                  cursor: "help",
                  textDecoration: "underline dotted",
                }}
              >
                MRR
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content size="m" side="bottom">
              Monthly recurring revenue — ежемесячный повторяющийся доход по подпискам
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>{" "}
        за квартал.
      </p>
    </aside>
  );
}
```

### Контролируемый режим

Экран справки: переключатель «Показать подсказки» синхронизирован с открытием демонстрационной подсказки и с реакцией на наведение на тот же триггер.

```tsx
import * as React from "react";
import { Button, Switch, Tooltip } from "prime-ui-kit";

export function HelpOverlayDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 360 }}>
      <Switch.Root size="m" checked={open} onCheckedChange={setOpen}>
        <Switch.Label>Показывать подсказку</Switch.Label>
      </Switch.Root>
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger>
            <Button.Root type="button" variant="neutral" mode="stroke" size="m">
              Пример триггера
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>Текст подсказки управляется снаружи и наведением</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
```

## Анатомия

`Tooltip.Provider` (опционально, выше по дереву) → `Tooltip.Root` → `Tooltip.Trigger` (ровно один `ReactElement`) + `Tooltip.Content` (портал: `div` с `role="tooltip"` и `id`, совпадающим с `aria-describedby` на триггере).

## API

Экспортируются объект `Tooltip`, типы размеров и стороны `TooltipSize`, `TooltipSide`, а также пропсы подкомпонентов: `TooltipProviderProps`, `TooltipRootProps`, `TooltipTriggerProps`, `TooltipContentProps`.

### Tooltip.Provider

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| delayDuration | number | 400 | Нет | Пауза в миллисекундах перед установкой открытого состояния после входа курсора или фокуса в триггер. |
| children | React.ReactNode | — | Да | Область, внутри которой живут `Tooltip.Root`. |

### Tooltip.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | React.ReactNode | — | Да | `Tooltip.Trigger` и `Tooltip.Content`. |
| open | boolean | — | Нет | Контролируемое открытие. |
| defaultOpen | boolean | false | Нет | Начальное значение без внешнего `open`. |
| onOpenChange | (open: boolean) => void | — | Нет | Уведомление о смене видимости. |

### Tooltip.Trigger

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | React.ReactElement | — | Да | Единственный элемент; к нему добавляются ref, `aria-describedby`, обработчики mouse/focus. |
| className | string | — | Нет | Дополнительный класс (сливается с классом ребёнка). |

### Tooltip.Content

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | React.ReactNode | — | Да | Содержимое подсказки; оборачивается в `ControlSizeProvider` по выбранному `size`. |
| size | TooltipSize | m | Нет | Визуальный масштаб padding, типографики и стрелки. |
| side | TooltipSide | top | Нет | Сторона относительно триггера; координаты ограничиваются видимой областью окна. |
| className | string | — | Нет | Пользовательский класс на корне контента в портале. |

## Варианты

Отдельного пропа вроде `variant` нет: фон, обводка и тень берутся из семантических токенов подсказки активной темы. Визуально различаются только масштабы `size` (`s`, `m`, `l`, `xl`) и положение `side` (влияет на стрелку и `data-side` для стилей).

## Состояния

- **Закрыто** — контент не монтируется в DOM; таймер задержки сбрасывается при уходе курсора или потере фокуса.
- **Открыто** — после задержки провайдера контент показывается в портале, позиция пересчитывается на `resize` и `scroll`.
- **Неконтролируемый / контролируемый** — через `defaultOpen` или пару `open` + `onOpenChange`.
- **Триггер `disabled`** — у нативной отключённой кнопки наведение обычно не приходит; подсказка не откроется без обходного приёма (обёртка, другой элемент).

## Доступность (a11y)

На триггер пробрасывается `aria-describedby`, указывающий на `id` контента с `role="tooltip"`. Открытие по `mouseenter` / `focus`, закрытие по `mouseleave` / `blur`. Для термина в тексте лучше использовать нестилизованную `button type="button"`, чтобы фокус с клавиатуры был предсказуемым. Содержимое подсказки не интерактивно (`pointer-events: none` в стилях) — не размещайте внутри кнопки и ссылки.

## Ограничения и заметки

Один триггер — один корень; для нескольких якорей нужны отдельные `Tooltip.Root`. Контент рендерится в портале и не наследует контекст DOM от триггера (кроме переданной разметки). Позиция клампится к полям окна, без переворота «умной» стороны при нехватке места — при необходимости смените `side` сами. Для сложного интерактивного слоя рассмотрите `Popover`.

## Связанные компоненты

`Button`, `LinkButton` — типичные триггеры; `Switch` или другой контрол — для демонстрации контролируемого `open`. Для постоянной подписи у поля — `Label` и `Hint`; для открывающегося слоя с фокусом внутри — `Popover`.
