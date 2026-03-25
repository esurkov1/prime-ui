# Switch

## Что это

Составной переключатель «вкл / выкл»: скрытый нативный input с `role="switch"`, видимый трек с бегунком и блоки подписи, подсказки и ошибки.

## Для чего нужен

- **Личный кабинет и уведомления** — быстро включить или отключить канал (почта, пуш, SMS) без отдельной кнопки «Сохранить» на каждой строке.
- **Маркетплейс и доставка** — переключить опцию к заказу (оставить у двери, бесконтактно) там, где смысл именно бинарный, а не выбор из списка.
- **Внутренние инструменты** — включить правило обработки заявок или автосводку для команды; состояние читается с первого взгляда.

## Юзкейсы

Каждый пример — другой тип экрана и другой набор пропсов; копировать одну форму с разными подписями не нужно.

### Базовый

Курс обучения: студент включает напоминания о дедлайнах — один тумблер и короткая подпись.

```tsx
import { Switch } from "prime-ui-kit";

export function CourseReminderRow() {
  return (
    <Switch.Root defaultChecked name="deadlineReminders">
      <Switch.Label>Напоминания о сроках сдачи</Switch.Label>
      <Switch.Hint>Письмо за два дня и в день дедлайна</Switch.Hint>
    </Switch.Root>
  );
}
```

### С вариантами/размерами

Панель мониторинга склада: одинаковые тумблеры в четырёх размерах, чтобы согласовать плотность с таблицей и фильтрами.

```tsx
import { Switch } from "prime-ui-kit";

export function WarehouseDensityPreview() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
      <Switch.Root size="s" defaultChecked>
        <Switch.Label>Авто-списание</Switch.Label>
      </Switch.Root>
      <Switch.Root size="m" defaultChecked>
        <Switch.Label>Авто-списание</Switch.Label>
      </Switch.Root>
      <Switch.Root size="l" defaultChecked>
        <Switch.Label>Авто-списание</Switch.Label>
      </Switch.Root>
      <Switch.Root size="xl" defaultChecked>
        <Switch.Label>Авто-списание</Switch.Label>
      </Switch.Root>
    </div>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Окно подтверждения перед оплатой: жёсткое требование согласия — ошибка валидации и текст через `Switch.Error`.

```tsx
import { Switch } from "prime-ui-kit";

export function CheckoutConsentField() {
  return (
    <section style={{ padding: 20, maxWidth: 400, borderRadius: 12, border: "1px solid #e4e4e7" }}>
      <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Условия</h2>
      <Switch.Root variant="error">
        <Switch.Label>Я принимаю условия оферты и политику данных</Switch.Label>
        <Switch.Error>Нужно отметить согласие, чтобы перейти к оплате</Switch.Error>
      </Switch.Root>
    </section>
  );
}
```

### Контролируемый режим

Пульт «умного дома»: родитель держит состояние лампы и синхронизирует его с ответом API после задержки.

```tsx
import * as React from "react";
import { Switch } from "prime-ui-kit";

export function LivingRoomLightSwitch() {
  const [on, setOn] = React.useState(false);

  return (
    <Switch.Root checked={on} onCheckedChange={setOn}>
      <Switch.Label>Свет в гостиной: {on ? "включён" : "выключен"}</Switch.Label>
    </Switch.Root>
  );
}
```

## Анатомия

- **`Switch.Root`** — провайдер контекста и обёртка поля (`div` с `data-size`, `data-variant`, `data-checked`, `data-disabled`, `data-invalid`, `data-readonly`); внутри **`ControlSizeProvider`**.
- **`Switch.Label`** — **`Label.Root`** с колонкой «тумблер + текст»: нативный **`input type="checkbox"`** с **`role="switch"`**, визуальный **`span.track`** и опциональный текст в **`span.text`**.
- **`Switch.Hint`** и **`Switch.Error`** — обёртки над **`Hint.Root`** с фиксированными `id` для связи через **`aria-describedby`**; **`Switch.Error`** регистрирует ошибку в контексте (влияет на `aria-invalid` вместе с `variant="error"`).

Публичный API: объект **`Switch`** с полями **`Root`**, **`Label`**, **`Hint`**, **`Error`**.

## API

### Switch.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | нет | Размеры дорожки и бегунка из системных токенов переключателя. |
| variant | `"default" \| "error"` | `"default"` | нет | Семантика ошибки на уровне поля; суммируется с наличием `Switch.Error`. |
| checked | `boolean` | — | нет | Контролируемое включённое состояние. |
| defaultChecked | `boolean` | `false` | нет | Неконтролируемое начальное значение. |
| onCheckedChange | `(checked: boolean) => void` | — | нет | Смена значения после взаимодействия пользователя. |
| disabled | `boolean` | — | нет | Блокировка; `data-disabled` на корне. |
| readOnly | `boolean` | — | нет | Видимое состояние без смены по клику; `aria-readonly`. |
| label | `React.ReactNode` | — | нет | Подпись без дочерних элементов; эквивалент одного `Switch.Label`, если `children` не заданы. |
| children | `React.ReactNode` | — | нет | Композиция `Label` / `Hint` / `Error`; имеет приоритет над `label`. |
| id | `string` | из `useId()` | нет | Связь подписи и input. |
| className | `string` | — | нет | Класс корневого `div` поля. |
| aria-describedby | `string` | — | нет | Дополнительные описания; к ним добавляются id подсказки и ошибки. |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" \| "size" \| "checked" \| "defaultChecked" \| "onChange">` | — | нет | В т.ч. `name`, `value`, `required`, `autoFocus`, `aria-*`; `onChange` не используется — только `onCheckedChange`. |

### Switch.Label

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | нет | Текст справа от тумблера; без children остаётся только трек (редкий случай — дайте имя через `aria-label` на Root). |
| className | `string` | — | нет | Класс строки подписи. |
| …rest | `Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "htmlFor" \| "size">` | — | нет | Прокидывается в `Label.Root`; `htmlFor` и `size` задаются из контекста. |

### Switch.Hint

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | да | Текст подсказки. |
| className | `string` | — | нет | Класс слота с отступом под колонку текста. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | нет | Атрибуты корня `Hint`; `id` фиксирован. |

### Switch.Error

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | да | Текст ошибки. |
| className | `string` | — | нет | Класс блока ошибки. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | нет | Атрибуты корня `Hint` с вариантом ошибки. |

## Варианты

- **`default`** — нейтральная обводка трека; при включении — заливка акцентом.
- **`error`** — обводка в цвет ошибки и `aria-invalid` на input (как при наличии **`Switch.Error`**).

## Состояния

- **Вкл / выкл** — `checked` / `defaultChecked` и визуальное положение бегунка; `aria-checked` синхронизирован с DOM `checked`.
- **Недоступно** — `disabled`: клик не меняет значение, подсказка получает вариант `disabled` у `Hint`.
- **Только чтение** — `readOnly`: `preventDefault` в обработчике, значение не меняется от пользователя.
- **Ошибка** — `variant="error"` и/или дочерний **`Switch.Error`**: `aria-invalid`, красная обводка трека.

Состояний **loading** и **indeterminate** у переключателя нет.

## Доступность (a11y)

- Роль **`switch`**, **`aria-checked`**, клавиатура как у чекбокса (в т.ч. **Space** в фокусе).
- Фокус виден по **`focus-visible`** на треке (кольцо фокуса).
- **`aria-describedby`** собирается из внешнего описания, **`Switch.Hint`** и **`Switch.Error`**.
- При **`readOnly`** выставляется **`aria-readonly`**.

## Ограничения и заметки

- Нет **`asChild`**: разметка фиксирована компонентами **`Switch.*`**.
- Это **не** замена **`Checkbox`** для списков с частичным выбором и **`indeterminate`**.
- Для выбора одной опции из нескольких взаимоисключающих используйте **`Radio`**, а не набор независимых переключателей.
- Проп **`label`** на **`Root`** удобен для одной строки текста; **`children`** нужны, если одновременно нужны **`Hint`** или **`Error`**.

## Связанные компоненты

- **Checkbox** — флаги и частичный выбор в группах.
- **Radio** — один выбранный вариант из набора.
- **Label** и **Hint** — те же примитивы внутри переключателя для согласованной типографики.
- **Input** — когда нужно свободное значение, а не бинарный флаг.
