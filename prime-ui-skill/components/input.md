# Input

## Что это

Составной блок однострочного поля ввода: подпись и метаданные снаружи, внутри — обведённая строка с нативным `input`, опциональными иконками и текстовыми аффиксами.

## Для чего нужен

- **Вход и настройки аккаунта** — почта, телефон, имя с подсказкой формата и явной связью `label` ↔ поле.
- **Оформление заказа и доставка** — адрес, промокод, контакт курьера с пометкой «необязательно» и сообщением об ошибке сервера.
- **Внутренние справочники и CRM** — быстрый ввод кода клиента или названия в плотной таблице, где важен компактный размер `s`.
- **Каталог и поиск** — строка поиска с иконкой и контролируемым значением для фильтрации списка без перезагрузки.
- **Финансы и прайсинг** — суммы с символом валюты через `InlineAffix` и ограничениями ввода (`inputMode`, `pattern`).
- **Лид-формы и лендинги** — крупное поле `xl` с короткой подписью для мобильного первого экрана.

## Юзкейсы

Каждый пример — другой экран и смысл; API комбинируется по-разному.

### Базовый

Форма входа: почта с подсказкой, без лишней обвязки.

```tsx
import { Input } from "prime-ui-kit";

export function LoginEmailField() {
  return (
    <Input.Root size="m" label="Электронная почта" hint="На этот адрес придёт код">
      <Input.Wrapper>
        <Input.Field type="email" name="email" autoComplete="email" placeholder="you@company.com" />
      </Input.Wrapper>
    </Input.Root>
  );
}
```

### С вариантами/размерами

Тот же сценарий «код товара» в двух плотностях интерфейса: компактная строка в таблице и крупное поле в карточке товара.

```tsx
import { Input } from "prime-ui-kit";

export function SkuFieldComparison() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input.Root size="s" label="SKU (таблица)" hint="Для строки грида">
        <Input.Wrapper>
          <Input.Field placeholder="ART-0000" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root size="xl" label="SKU (карточка)" hint="Для экрана детали">
        <Input.Wrapper>
          <Input.Field placeholder="ART-0000" />
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Блок оформления подписки: префикс сайта и зона домена как блочные аффиксы, поле ввода посередине.

```tsx
import { Input } from "prime-ui-kit";

export function WorkspaceUrlRow() {
  return (
    <section
      style={{
        maxWidth: 480,
        padding: 20,
        borderRadius: 12,
        border: "1px solid var(--prime-sys-color-border-subtle, #e4e4e7)",
      }}
    >
      <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Адрес рабочего пространства</h3>
      <Input.Root size="m" label="Поддомен" hint="Только латиница и цифры">
        <Input.Wrapper>
          <Input.Affix side="start">https://</Input.Affix>
          <Input.Field placeholder="команда" autoComplete="off" />
          <Input.Affix side="end">.app.example</Input.Affix>
        </Input.Wrapper>
      </Input.Root>
    </section>
  );
}
```

### Контролируемый режим

Фильтр заявок: значение строки хранится в состоянии родителя и сбрасывается кнопкой.

```tsx
import * as React from "react";
import { Button, Input } from "prime-ui-kit";

export function SupportTicketFilter() {
  const [q, setQ] = React.useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
      <Input.Root size="m" label="Поиск по теме обращения" hint="Фильтр по введённому тексту">
        <Input.Wrapper>
          <Input.Field
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Номер или ключевые слова"
            aria-label="Фильтр обращений"
          />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root mode="ghost" size="m" variant="neutral" onClick={() => setQ("")}>
        Сбросить
      </Button.Root>
    </div>
  );
}
```

## Анатомия

- **`Input.Root`** — внешний контейнер (`div` с `data-size`), опционально строка заголовка (`label` + `optionalLabel`), провайдер контекста и `ControlSizeProvider`, затем `children` (обычно `Input.Wrapper`), затем блок мета с **`Hint.Root`** для `hint` и `error`.
- **`Input.Wrapper`** — flex-обёртка с рамкой и фоном поля; внутри в произвольном порядке **`Input.Field`**, **`Input.Icon`**, **`Input.Affix`**, **`Input.InlineAffix`**.
- **`Input.Field`** — нативный `<input>` с `id` из контекста, склейкой `aria-describedby` и `aria-invalid` при ошибке.

Публичный объект **`Input`** с полями **`Root`**, **`Wrapper`**, **`Field`**, **`Icon`**, **`Affix`**, **`InlineAffix`**. Дополнительно экспортируется хук **`useInputContext`** для кастомных подкомпонентов.

## API

### Input.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | нет | Размер контрола из токенов `--prime-sys-size-control-*`. |
| hasError | `boolean` | `false` | нет | Ошибка: рамка и `aria-invalid` на поле; если передан `error`, становится `true` автоматически. |
| label | `React.ReactNode` | — | нет | Подпись; рендерится как `<label htmlFor={inputId}>`. |
| optionalLabel | `React.ReactNode` | — | нет | Вторичный текст в строке заголовка. |
| hint | `React.ReactNode` | — | нет | Подсказка под полем. |
| error | `React.ReactNode` | — | нет | Текст ошибки; задаёт `hasError` и id для `aria-describedby`. |
| id | `string` | — | нет | Явный id инпута; иначе генерируется в `useFieldIds`. |
| children | `React.ReactNode` | — | да | Тело поля (как правило `Input.Wrapper` с содержимым). |
| className | `string` | — | нет | Класс на корневом `div`. |

### Input.Wrapper

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | да | Содержимое рамки поля. |
| className | `string` | — | нет | Класс на обёртке; `data-size` и `data-has-error` выставляются из контекста. |

### Input.Field

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | нет | Класс на `input`. |
| aria-describedby | `string` | — | нет | Дополняет список id из контекста (hint/error). |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">` | — | нет | Все стандартные атрибуты `input`, кроме `size` (зарезервирован под дизайн-систему). |

### Input.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| side | `"start" \| "end"` | — | да | Позиция иконки. |
| children | `React.ReactNode` | — | да | Обычно иконка из набора prime-ui-kit. |
| className | `string` | — | нет | Класс на `span` с `aria-hidden`. |

### Input.Affix

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| side | `"start" \| "end"` | — | да | Сторона блочного аффикса. |
| children | `React.ReactNode` | — | да | Текст сегмента (префикс URL и т.п.). |
| className | `string` | — | нет | Класс на контейнере; `aria-hidden`. |

### Input.InlineAffix

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| side | `"start" \| "end"` | — | да | Сторона инлайн-аффикса. |
| children | `React.ReactNode` | — | да | Короткий текст (символ валюты и т.д.). |
| className | `string` | — | нет | Класс на `span`; `aria-hidden`. |

### useInputContext()

Возвращает объект `{ size, hasError, inputId, describedBy }` для расширений, согласованных с тем же контекстом, что использует `Input.Field`.

## Варианты

Отдельного пропа `variant` у Input нет: одно визуальное оформление рамки и типографики. Поведенческие «режимы» задаются нативным атрибутом **`type`** (`email`, `password`, `tel`, `number`, `search`, …) и связанными атрибутами (`autoComplete`, `inputMode`, `pattern`, `maxLength` и др.) на **`Input.Field`**.

## Состояния

- **Обычное** — фокус подсвечивает рамку через `:focus-visible` на инпуте.
- **Наведение** — обёртка меняет фон и границу, пока поле не зафокусено и не `disabled`.
- **`disabled`** — приглушённые цвета, `cursor: not-allowed`, без hover-эффекта.
- **`readOnly`** — визуально как обычное поле; блокировка редактирования задаётся нативно.
- **Ошибка** — `error` или `hasError` на Root: красная рамка, отдельная тень при фокусе, `aria-invalid` на инпуте.
- **`required`** — задаётся на `Input.Field`; визуальная звёздочка в макете при необходимости добавляется в `label` вручную.

## Доступность (a11y)

- Связка **`label`** на Root с полем через **`htmlFor` / `id`** (id генерируется или задаётся пропом `id` на Root).
- **`hint`** и **`error`** получают стабильные id и участвуют в **`aria-describedby`** на инпуте; при необходимости можно дополнить через `aria-describedby` на `Input.Field`.
- **`Input.Icon`** и аффиксы помечены **`aria-hidden`**, смысл должен быть в подписи, плейсхолдере или **`aria-label`** на поле.
- Для поля без видимой подписи задайте **`aria-label`** или **`aria-labelledby`** на **`Input.Field`**.

## Ограничения и заметки

- Многострочный ввод и авто-рост по высоте — не этот компонент; используйте **Textarea**.
- Маски ввода, форматирование по маске и поля с фиксированным числом ячеек — смотрите **DigitInput** или отдельную логику на стороне приложения.
- `Input.Field` не проксирует проп `size`: для размера используйте **`Input.Root`** (`size`).
- Кастомные внутренние элементы должны жить внутри **`Input.Wrapper`** и при необходимости читать контекст через **`useInputContext`**.

## Связанные компоненты

- **Label** — если подпись нужна отдельно от встроенного `label` на Root (нестандартная вёрстка).
- **Hint** — используется внутри Root для `hint`/`error`; можно комбинировать с другими полями согласованно.
- **Textarea** — многострочный ввод.
- **Button** — отправка формы рядом с полем.
- **DigitInput** — ввод кода из нескольких ячеек.
