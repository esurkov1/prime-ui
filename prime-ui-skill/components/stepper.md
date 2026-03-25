# Stepper

## Что это

Набор компонентов для отображения многошагового процесса: высокоуровневый `Stepper` на семантическом списке и примитивы `HorizontalStepper` / `VerticalStepper` с ручным `state` у каждого шага.

## Для чего нужен

- **Онбординг и мастера настройки** — пользователь видит, на каком этапе знакомства с продуктом или конфигурации он находится.
- **Оформление заказа и длинные формы** — короткие горизонтальные подписи этапов (корзина, доставка, оплата) без перегрузки экрана.
- **Документооборот и согласования** — отражение стадий заявки или договора с возможностью выделить проблемный шаг (`status="error"`).
- **Редакционный контент** — вертикальная линия шагов с стрелкой у активного этапа (черновик, правки, публикация).
- **Настройки уведомлений и профиля** — примитивный API с кликом по шагам и явным `state`, когда логика приходит из API или стора.
- **CI/CD и внутренние панели** — полоса этапов на всю ширину карточки релиза или пайплайна.

## Юзкейсы

Каждый пример рассчитан на другой тип экрана и другой срез API.

### Базовый

Вертикальный мастер с автоматическим номером шага и подписями; активный шаг задаётся через `currentStep`.

```tsx
import { Stepper } from "prime-ui-kit";

export function OnboardingSteps() {
  const step = 1;

  return (
    <Stepper.Root currentStep={step} size="m">
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Аккаунт" description="Создайте или привяжите вход" />
        <Stepper.Arrow />
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Команда" description="Пригласите коллег" />
        <Stepper.Arrow />
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Готово" description="Можно пользоваться продуктом" />
      </Stepper.Step>
    </Stepper.Root>
  );
}
```

### С вариантами/размерами

Горизонтальная витрина этапов заказа: `orientation="horizontal"`, разделители `SeparatorIcon`, без описаний под заголовками.

```tsx
import { Stepper } from "prime-ui-kit";

export function CheckoutRail() {
  return (
    <Stepper.Root orientation="horizontal" currentStep={1} size="l" className="w-full max-w-2xl">
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Корзина" />
      </Stepper.Step>
      <Stepper.SeparatorIcon />
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Доставка" />
      </Stepper.Step>
      <Stepper.SeparatorIcon />
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Оплата" />
      </Stepper.Step>
    </Stepper.Root>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Колонка настроек с примитивным вертикальным степпером: состояние шагов вычисляется в родителе, клик переключает активный индекс (типично для боковой панели).

```tsx
import * as React from "react";
import { VerticalStepper } from "prime-ui-kit";

const rows = [
  { id: "channels", label: "Каналы", hint: "1" },
  { id: "quiet", label: "Тишина", hint: "2" },
  { id: "digest", label: "Дайджест", hint: "3" },
] as const;

export function NotificationSidebarPanel() {
  const [active, setActive] = React.useState(0);

  const stateAt = (i: number) =>
    i < active ? "completed" : i === active ? "active" : "default";

  return (
    <aside className="w-56 border-r p-4">
      <VerticalStepper.Root size="m">
        {rows.map((row, i) => (
          <VerticalStepper.Item key={row.id} state={stateAt(i)} onClick={() => setActive(i)}>
            <VerticalStepper.ItemIndicator>{row.hint}</VerticalStepper.ItemIndicator>
            {row.label}
            {stateAt(i) === "active" ? <VerticalStepper.Arrow /> : null}
          </VerticalStepper.Item>
        ))}
      </VerticalStepper.Root>
    </aside>
  );
}
```

### Контролируемый режим

Индекс шага и кнопки навигации живут в одном контейнере анкеты или мастера.

```tsx
import * as React from "react";
import { Button, Stepper } from "prime-ui-kit";

export function ControlledWizard() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const max = 2;

  return (
    <div className="flex flex-col gap-4">
      <Stepper.Root currentStep={currentStep}>
        <Stepper.Step onClick={() => setCurrentStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Условия" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step onClick={() => setCurrentStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Анкета" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step onClick={() => setCurrentStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Отправка" />
        </Stepper.Step>
      </Stepper.Root>
      <div className="flex gap-2">
        <Button.Root
          mode="stroke"
          variant="neutral"
          disabled={currentStep <= 0}
          onClick={() => setCurrentStep((s) => s - 1)}
        >
          Назад
        </Button.Root>
        <Button.Root
          mode="filled"
          variant="primary"
          disabled={currentStep >= max}
          onClick={() => setCurrentStep((s) => s + 1)}
        >
          Далее
        </Button.Root>
      </div>
    </div>
  );
}
```

## Анатомия

**Высокоуровневый Stepper**

- `Stepper.Root` — `<ol>` с контекстом ориентации, `currentStep`, размера и счётчиком индексов для дочерних шагов.
- `Stepper.Step` / `Stepper.Item` — `<li>` + `<button>`; в контексте шага доступны статус и индекс.
- `Stepper.Indicator` / `Stepper.ItemIndicator` — `span` с номером, галочкой при `completed` или своим `children`.
- `Stepper.Content` — заголовок и опциональное описание.
- `Stepper.SeparatorIcon` — `<li>` с шевроном между горизонтальными шагами.
- `Stepper.Arrow` — стрелка у вертикального шага (делегирует в `VerticalStepper.Arrow`).

**HorizontalStepper**

- `Root` → `SeparatorIcon` | `Item` (кнопка) → внутри `ItemIndicator`.

**VerticalStepper**

- `Root` → `Item` → `ItemIndicator`, текст, опционально `Arrow`.

## API

### Stepper.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| orientation | `"horizontal" \| "vertical"` | `"vertical"` | Нет | Направление списка шагов. |
| currentStep | `number` | `0` | Нет | Индекс активного шага для авто-статусов. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Тир контрола и типографики. |
| children | `React.ReactNode` | — | Да | Шаги и при горизонтали — `SeparatorIcon`. |
| className | `string` | — | Нет | Класс на `<ol>`. |

### Stepper.Step (Stepper.Item)

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| index | `number` | авто | Нет | Явный индекс для статуса и номера в индикаторе. |
| status | `StepStatus` | из `currentStep` | Нет | `pending` \| `active` \| `completed` \| `error`. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | Нет | Тип кнопки. |
| disabled | `boolean` | — | Нет | Отключение шага. |
| className | `string` | — | Нет | Класс кнопки. |
| children | `React.ReactNode` | — | Да | Разметка шага. |
| …rest | `ButtonHTMLAttributes` (без `type`) | — | Нет | Остальные атрибуты кнопки. |

### Stepper.Indicator (Stepper.ItemIndicator)

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | номер / галочка | Нет | Кастомный индикатор. |
| className | `string` | — | Нет | Класс `span`. |

### Stepper.Content

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| title | `string` | — | Да | Заголовок. |
| description | `string` | — | Нет | Подзаголовок. |
| className | `string` | — | Нет | Обёртка блока текста. |

### Stepper.SeparatorIcon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | Нет | Класс на иконку внутри `li`. |

### Stepper.Arrow

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| as | `ElementType` | `IconChevronRight` | Нет | Замена компонента иконки. |
| className | `string` | — | Нет | Класс иконки. |
| …rest | пропсы `as` | — | Нет | Проброс на иконку. |

### HorizontalStepper.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Размер тира. |
| className | `string` | — | Нет | Класс `div`. |
| children | `React.ReactNode` | — | Нет | Разметка полосы. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты контейнера. |

### HorizontalStepper.SeparatorIcon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| as | `ElementType` | `IconChevronRight` | Нет | Другая иконка-разделитель. |
| className | `string` | — | Нет | Класс svg. |
| …rest | пропсы `as` | — | Нет | Проброс на иконку. |

### HorizontalStepper.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| state | `StepperAlignItemState` | `"default"` | Нет | `default` \| `active` \| `completed`. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | Нет | Тип кнопки. |
| className | `string` | — | Нет | Класс кнопки. |
| children | `React.ReactNode` | — | Нет | Индикатор и подпись. |
| …rest | `ButtonHTMLAttributes` (без `type`) | — | Нет | Остальные атрибуты. |

### HorizontalStepper.ItemIndicator

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| state | `StepperAlignItemState` | из контекста | Нет | Переопределение состояния. |
| className | `string` | — | Нет | Класс обёртки. |
| children | `React.ReactNode` | галочка при completed | Нет | Содержимое круга. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты `div`. |

### VerticalStepper.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Размер тира. |
| className | `string` | — | Нет | Класс `div`. |
| children | `React.ReactNode` | — | Нет | Вертикальные `Item`. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты контейнера. |

### VerticalStepper.Arrow

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| as | `ElementType` | `IconChevronRight` | Нет | Другая иконка. |
| className | `string` | — | Нет | Класс иконки. |
| …rest | пропсы `as` | — | Нет | Проброс на иконку. |

### VerticalStepper.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| state | `StepperAlignItemState` | `"default"` | Нет | Состояние строки. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | Нет | Тип кнопки. |
| className | `string` | — | Нет | Класс кнопки. |
| children | `React.ReactNode` | — | Нет | Индикатор, текст, стрелка. |
| …rest | `ButtonHTMLAttributes` (без `type`) | — | Нет | Остальные атрибуты. |

### VerticalStepper.ItemIndicator

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| state | `StepperAlignItemState` | из контекста | Нет | Состояние индикатора. |
| className | `string` | — | Нет | Класс обёртки. |
| children | `React.ReactNode` | галочка при completed | Нет | Содержимое круга. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты `div`. |

Тип `StepperAlignItemState` экспортируется из пакета для примитивов; у высокоуровневого `Stepper` для шагов используется `StepStatus` (`pending` вместо `default` в примитивах).

## Варианты

- **Два уровня API:** семантический `Stepper` с `currentStep` и автоматической нумерацией либо `HorizontalStepper` / `VerticalStepper` с явным `state` на каждом `Item`.
- **Ориентация:** `horizontal` — полоса с опциональными `SeparatorIcon`; `vertical` (по умолчанию) — колонка, часто со `Stepper.Arrow` у активного шага.
- **Размер:** `size` на корне задаёт единый тир для шага и текста во всех подкомпонентах этой ветки.

## Состояния

- **Авто по `currentStep`:** шаги до индекса — `completed`, равный индексу — `active`, после — `pending`.
- **Ручной `status` на `Stepper.Step`:** можно зафиксировать ошибку (`error`) или иной статус независимо от индекса; для ошибки стилизуется `data-legacy-status="error"` на кнопке и индикаторе.
- **Примитивы:** только три визуальных значения `state`: `default`, `active`, `completed` (без отдельного `error` в типе — ошибки оформляйте на высокоуровневом `Stepper` или кастомным содержимым индикатора).
- **disabled:** стандартная блокировка кнопки шага.

## Доступность (a11y)

- Высокоуровневый `Stepper` рендерит **упорядоченный список** `<ol>` / `<li>` — скринридеры получают порядок шагов.
- У активного шага выставляется **`aria-current="step"`** на кнопке.
- Индикатор и разделители помечены **`aria-hidden`** там, где число дублируется текстом рядом; при кастомных символах в индикаторе смысл должен быть в подписи шага.
- Клавиатура: фокус на кнопках шагов, логика перехода — на стороне приложения (`onClick`, роутинг, controlled `currentStep`).

## Ограничения и заметки

- `SeparatorIcon` в составе `Stepper` предназначен для **горизонтальной** ориентации; во вертикали разделители между пунктами не вставляются тем же компонентом.
- Примитивы **не** формируют семантический список шагов сами по себе — при необходимости задайте `role` / разметку снаружи.
- Счётчик индексов у `Stepper.Root` **последовательный** для шагов без явного `index`; смешение явных и автоматических индексов требует внимания к порядку детей.
- Переход между шагами (валидация, сохранение черновика) в пакет **не встроен** — только отображение и клики по кнопкам.

## Связанные компоненты

- **Button** — действия «Далее» / «Назад» рядом с контролируемым степпером.
- **Modal / Drawer** — обёртки многошаговых мастеров.
- **Breadcrumb** — если нужна иерархия страниц, а не этапы одного потока.
- **Progress bar** — когда важна доля выполнения, а не дискретные шаги.
- **Icon** (или экспорты из `prime-ui-kit/icons`) — подстановка в `as` у разделителя и стрелки в примитивах.
