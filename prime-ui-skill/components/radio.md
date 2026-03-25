# Radio

## Что это

Составной контроль «радиокнопка»: обёртка поля, подпись с нативным `input type="radio"`, опциональные подсказка и сообщение об ошибке.

## Для чего нужен

- **Подписки и тарифы** — выбрать один план из нескольких витринных карточек с разной ценой и набором функций.
- **Логистика и слоты** — назначить одно окно доставки или приёма из списка взаимоисключающих интервалов.
- **Настройки доступа** — указать единственную роль или уровень видимости документа без множественного выбора.

## Юзкейсы

Примеры разнесены по разным продуктовым зонам и показывают разные части API.

### Базовый

Онбординг: пользователь выбирает одну цель использования сервиса; пункты с общим `name` ведут себя как одна группа.

```tsx
import { Radio } from "prime-ui-kit";

export function OnboardingGoalStep() {
  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      <legend style={{ fontWeight: 600, marginBottom: 12 }}>Что хотите сделать в первую очередь?</legend>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Radio.Root name="goal" value="tasks" defaultChecked size="m">
          <Radio.Label>Вести задачи команды</Radio.Label>
        </Radio.Root>
        <Radio.Root name="goal" value="reports" size="m">
          <Radio.Label>Собирать отчёты</Radio.Label>
        </Radio.Root>
        <Radio.Root name="goal" value="integrations" size="m">
          <Radio.Label>Подключить интеграции</Radio.Label>
        </Radio.Root>
      </div>
    </fieldset>
  );
}
```

### С вариантами/размерами

Медицинский портал: согласие на обработку данных с акцентом на ошибку валидации и компактный размер в боковой колонке записи.

```tsx
import { Radio } from "prime-ui-kit";

export function ConsentSidebar() {
  return (
    <aside style={{ maxWidth: 320 }}>
      <Radio.Root name="consent" value="yes" defaultChecked size="s">
        <Radio.Label>Согласен с политикой</Radio.Label>
        <Radio.Hint>Можно изменить в профиле до подписания договора.</Radio.Hint>
      </Radio.Root>
      <Radio.Root name="consent" value="no" variant="error" size="s">
        <Radio.Label>Не согласен</Radio.Label>
        <Radio.Error>Без согласия запись к специалисту недоступна.</Radio.Error>
      </Radio.Root>
    </aside>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Корзина магазина: блок способа оплаты в карточке оформления — у каждого способа подпись и краткое пояснение.

```tsx
import { Radio } from "prime-ui-kit";

export function CheckoutPaymentCard() {
  return (
    <section style={{ padding: 16, borderRadius: 12, border: "1px solid #e4e4e7" }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Оплата</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Radio.Root name="pay" value="card" defaultChecked size="m">
          <Radio.Label>Карта онлайн</Radio.Label>
          <Radio.Hint>3-D Secure при необходимости.</Radio.Hint>
        </Radio.Root>
        <Radio.Root name="pay" value="cod" size="m">
          <Radio.Label>Наличные курьеру</Radio.Label>
          <Radio.Hint>Подготовьте сумму без сдачи.</Radio.Hint>
        </Radio.Root>
      </div>
    </section>
  );
}
```

### Контролируемый режим

Панель администратора: режим публикации страницы хранится в состоянии экрана и синхронизируется с черновиком API.

```tsx
import * as React from "react";
import { Radio } from "prime-ui-kit";

export function PageVisibilityControl() {
  const [visibility, setVisibility] = React.useState<"public" | "staff" | "private">("staff");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Radio.Root
        name="visibility"
        value="public"
        checked={visibility === "public"}
        onChange={(e) => {
          if (e.currentTarget.checked) setVisibility("public");
        }}
        size="m"
      >
        <Radio.Label>Публичная</Radio.Label>
      </Radio.Root>
      <Radio.Root
        name="visibility"
        value="staff"
        checked={visibility === "staff"}
        onChange={(e) => {
          if (e.currentTarget.checked) setVisibility("staff");
        }}
        size="m"
      >
        <Radio.Label>Только сотрудники</Radio.Label>
      </Radio.Root>
      <Radio.Root
        name="visibility"
        value="private"
        checked={visibility === "private"}
        onChange={(e) => {
          if (e.currentTarget.checked) setVisibility("private");
        }}
        size="m"
      >
        <Radio.Label>Черновик (скрыта)</Radio.Label>
      </Radio.Root>
    </div>
  );
}
```

## Анатомия

`Radio.Root` — обёртка `.field` с `data-size`, `data-variant`, `data-disabled`, `data-invalid` и провайдером контекста.

Внутри по смыслу:

- `Radio.Label` — `Label.Root` + нативный `input[type=radio]` + декоративный SVG; опциональный текст в `.text`.
- `Radio.Hint` — `Hint.Root` под маркером, с отступом слева под длину контроля.
- `Radio.Error` — тот же слот, вариант ошибки; при монтировании помечает группу как невалидную.

Порядок слотов на практике: `Label` первым, затем `Hint` и/или `Error`.

## API

### Radio.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| variant | `"default"` \| `"error"` | `"default"` | Нет | Ошибка оформления и `data-invalid` при `error` или при наличии `Radio.Error`. |
| size | `"s"` \| `"m"` \| `"l"` \| `"xl"` | `"m"` | Нет | Единый размер для маркера, типографики и отступов hint/error. |
| disabled | `boolean` | — | Нет | Неактивный пункт; `cursor` и стили disabled на маркере и подписи. |
| id | `string` | автогенерация | Нет | id input; связь с `label[for]`. |
| className | `string` | — | Нет | Класс корневой обёртки поля. |
| aria-describedby | `string` | — | Нет | Склеивается с id hint и error при их наличии. |
| children | `React.ReactNode` | — | Нет | Вложенные `Radio.Label`, `Radio.Hint`, `Radio.Error`. |
| …rest | `Omit<InputHTMLAttributes<HTMLInputElement>, "type" \| "size">` | — | Нет | В том числе `name`, `value`, `checked`, `defaultChecked`, `onChange`, `required`, `readOnly` и прочие атрибуты радио input. |

### Radio.Label

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | Нет | Текст подписи; если пусто — обеспечьте имя через `aria-label` на корне. |
| className | `string` | — | Нет | Дополнительный класс строки подписи. |
| …rest | `Omit<HTMLAttributes<HTMLLabelElement>, "htmlFor" \| "size">` | — | Нет | `htmlFor` и `size` задаются из контекста. |

### Radio.Hint

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | Да | Текст подсказки. |
| className | `string` | — | Нет | Класс слота hint. |
| …rest | `Omit<HTMLAttributes<HTMLParagraphElement>, "id">` | — | Нет | `id` фиксирован для доступности. |

### Radio.Error

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | Да | Текст ошибки. |
| className | `string` | — | Нет | Класс слота ошибки. |
| …rest | `Omit<HTMLAttributes<HTMLParagraphElement>, "id">` | — | Нет | `id` фиксирован для `aria-describedby`. |

## Варианты

- **default** — стандартная обводка маркера, hover на подписи, выбранное состояние с заливкой центра.
- **error** — обводка и заливка в цветах ошибки; имеет смысл вместе с `Radio.Error` или для внешней индикации невалидности.

## Состояния

- **Не выбрано / выбрано** — нативное `checked` или неконтролируемое `defaultChecked`.
- **disabled** — проп на `Radio.Root`: input и подпись неактивны, стили приглушены.
- **Невалидно** — `variant="error"` или смонтированный `Radio.Error`: `aria-invalid` на input, `data-invalid` на корне.
- **С подсказкой** — при монтировании `Radio.Hint` в `aria-describedby` добавляется id подсказки.

## Доступность (a11y)

- Нативный `input type="radio"` сохраняет поведение в формах и при навигации с клавиатуры.
- Подпись связана с полем через `htmlFor` / `id`.
- Подсказка и ошибка участвуют в `aria-describedby`; при ошибке выставляется `aria-invalid`.
- Для пункта без видимого текста задайте доступное имя (`aria-label` на корне, пробрасывается на input через остальные пропсы).

## Ограничения и заметки

- Один `Radio.Root` — один пункт группы; саму группу нужно собирать несколькими корнями с **одинаковым** `name` (и при необходимости оборачивать в `fieldset` / `legend`).
- Нет встроенного «RadioGroup»-компонента: логика выбора — нативная или контролируемая вручную.
- Полиморфного `asChild` у Radio нет: маркер и подпись фиксированы реализацией.
- `type` и `size` HTML input зафиксированы (`radio` и исключены из пропсов в пользу `size` дизайн-системы).

## Связанные компоненты

- **Checkbox** — когда допускается несколько независимых флагов.
- **Switch** — бинарное да/нет без списка вариантов.
- **Label** и **Hint** — используются внутри Radio; их можно изучить для согласованных форм.
- **Segmented control** — если нужен переключатель сегментами в одной панели, а не список радиопунктов.
