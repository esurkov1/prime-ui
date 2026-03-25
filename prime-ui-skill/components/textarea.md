# Textarea

## Что это

Составной компонент многострочного ввода: поле ввода, опциональный счётчик символов в подвале, слоты подсказки и ошибки с автоматической связью по `aria-describedby`.

## Для чего нужен

- **Логистика и доставка** — уточнить адрес, пожелания по времени или комментарий курьеру в карточке заказа без отдельного экрана.
- **Образование и проверка заданий** — собрать развёрнутый ответ учащегося с подсказкой по объёму или критериям оценки.
- **Поддержка и обратная связь** — описать проблему с лимитом длины, счётчиком и явным сообщением об ошибке, если поле не заполнено.

## Юзкейсы

Каждый пример рассчитан на другой тип экрана и набор пропсов.

### Базовый

Тикет в сервисе доставки: короткая подсказка, без внешнего состояния.

```tsx
import { Textarea } from "prime-ui-kit";

export function DeliveryNoteField() {
  return (
    <Textarea.Root size="m" placeholder="Комментарий к заказу (необязательно)">
      <Textarea.Hint>Не указывайте пароли и коды от домофона в этом поле.</Textarea.Hint>
    </Textarea.Root>
  );
}
```

### С вариантами/размерами

Медицинская анкета: крупное поле для хронологии симптомов и явная ошибка валидации.

```tsx
import * as React from "react";
import { Textarea } from "prime-ui-kit";

export function SymptomTimelineField() {
  const [variant, setVariant] = React.useState<"default" | "error">("error");

  return (
    <Textarea.Root
      size="l"
      variant={variant}
      placeholder="Опишите, когда начались симптомы и как менялись"
      onChange={() => setVariant("default")}
    >
      <Textarea.Error>Заполните поле, чтобы врач увидел анамнез до приёма.</Textarea.Error>
    </Textarea.Root>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Редакция материала: заголовок блока и поле с лимитом по символам для лид-абзаца.

```tsx
import * as React from "react";
import { Textarea } from "prime-ui-kit";
import { Typography } from "prime-ui-kit";

const LEAD_MAX = 320;

export function ArticleLeadBlock() {
  const [lead, setLead] = React.useState("");

  return (
    <section style={{ maxWidth: "36rem" }}>
      <Typography.Root size="s" weight="semibold" as="h3">
        Лид-абзац
      </Typography.Root>
      <Textarea.Root
        size="m"
        value={lead}
        maxLength={LEAD_MAX}
        onChange={(e) => setLead(e.target.value)}
        placeholder="Два-три предложения для списка статей и соцсетей"
      >
        <Textarea.CharCounter current={lead.length} max={LEAD_MAX} />
        <Textarea.Hint>Лимит {LEAD_MAX} символов совпадает с maxLength у textarea.</Textarea.Hint>
      </Textarea.Root>
    </section>
  );
}
```

### Контролируемый режим

Внутренний отчёт об инциденте: текст и метаданные хранятся в родителе, высота растёт при вводе (`autoResize` по умолчанию).

```tsx
import * as React from "react";
import { Textarea } from "prime-ui-kit";

export function IncidentReportBody() {
  const [body, setBody] = React.useState("");

  return (
    <Textarea.Root
      size="m"
      value={body}
      onChange={(e) => setBody(e.target.value)}
      placeholder="Что произошло, кто затронут, какие действия уже предприняты"
    >
      <Textarea.Hint>Набрано символов: {body.length}. Черновик можно сериализовать вместе с формой.</Textarea.Hint>
    </Textarea.Root>
  );
}
```

## Анатомия

`Textarea` — объект с подкомпонентами:

- **`Textarea.Root`** — внешний `div.field` с контекстом; внутри `label.control` с `textarea` (и при `autoResize` — обёртка с `data-value`), опциональный подвал для `Textarea.CharCounter`; после `label` рендерятся `Textarea.Hint` и `Textarea.Error`.
- **`Textarea.CharCounter`** — только прямой ребёнок `Root`, попадает в подвал.
- **`Textarea.Hint`** / **`Textarea.Error`** — прямые дети `Root`, рендерятся как `Hint.Root` с нужным `id` для связи с полем.

## API

### Textarea.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| variant | `"default" \| "error"` | `"default"` | Нет | Визуальная роль и базовая инвалидность, если не переопределено `aria-invalid`. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Размерная сетка поля (текст, отступы, минимальная высота). |
| autoResize | `boolean` | `true` | Нет | Подстройка высоты по содержимому через разметку и `data-value`; при `false` остаётся нативный resize. |
| id | `string` | из `useId()` | Нет | Якорь для `htmlFor` не нужен — корень сам `label`; id нужен для стабильных `aria-describedby`. |
| className | `string` | — | Нет | Класс на элементе-оболочке с рамкой (`label`). |
| disabled | `boolean` | — | Нет | Нативная блокировка; Hint переключается в «disabled»-вид. |
| readOnly | `boolean` | — | Нет | Только чтение; Hint ведёт себя как при disabled. |
| value | `string` | — | Нет | Контролируемое значение. |
| defaultValue | `string` | — | Нет | Неконтролируемый стартовый текст. |
| onInput | `React.FormEventHandler<HTMLTextAreaElement>` | — | Нет | Внутри дополняется обновлением `data-value` при `autoResize`. |
| aria-describedby | `string` | — | Нет | Дополняется id подсказки и ошибки при их наличии. |
| aria-invalid | `Booleanish` | из variant / Error | Нет | Явная инвалидность поверх эвристики. |
| children | `React.ReactNode` | — | Нет | `CharCounter` в подвале; `Hint` и `Error` снаружи `label`. |
| …rest | `Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">` | — | Нет | Все стандартные атрибуты textarea: `placeholder`, `rows`, `maxLength`, `required`, `onChange`, `name` и т.д. |

### Textarea.CharCounter

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| current | `number` | — | Да | Текущее число символов. |
| max | `number` | — | Да | Отображаемый лимит; при `current > max` выставляется `data-overflow="true"`. |

### Textarea.Hint

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | Да | Текст подсказки. |
| className | `string` | — | Нет | Дополнительный класс. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | Нет | Атрибуты `p`; `id` задаётся контекстом. |

### Textarea.Error

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | Да | Текст ошибки. |
| className | `string` | — | Нет | Дополнительный класс. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | Нет | Атрибуты `p`; `id` задаётся контекстом. |

## Варианты

- **`default`** — обычное поле с нейтральной рамкой.
- **`error`** — акцент ошибки; в сочетании с `Textarea.Error` и автоматическим `aria-invalid` даёт согласованную доступность.

Отдельно от `variant` счётчик может показывать логическое переполнение (`current > max`), не блокируя ввод — это не `variant`, а визуальный флаг `data-overflow` на счётчике.

## Состояния

- **Обычное** — фокус по клику на рамку (`label` с `cursor: text`), стили по `data`-атрибутам размера.
- **disabled / readOnly** — нативные атрибуты textarea; подсказка получает приглушённый вариант.
- **Ошибка** — `variant="error"` и/или смонтированный `Textarea.Error`; поле получает невалидность для вспомогательных технологий.
- **Обязательность** — нативный `required` на textarea для подсказки браузеру и валидации формы.

## Доступность (a11y)

- Поле внутри `label` — кликабельная область расширена на рамку.
- `Textarea.Hint` и `Textarea.Error` получают стабильные `id` и добавляются в `aria-describedby` у textarea.
- `aria-invalid` выводится из `variant`, наличия `Error` или явного пропа.
- Счётчик объявляет изменения политично (`aria-live="polite"`), не мешая набору текста.

## Ограничения и заметки

- **`Textarea.CharCounter`** должен быть **прямым** ребёнком `Root` (разделение по `child.type`); Hint и Error в том же дереве, но не в подвале.
- Полиморфного `asChild` у Textarea нет — корень зафиксирован как обёртка с `label` и `textarea`.
- Ориентации «horizontal/vertical» у компонента нет — это одноколоночный блок.
- Лимит по символам: либо нативный `maxLength`, либо только отображение через счётчик; переполнение в счётчике не блокирует ввод само по себе.

## Связанные компоненты

- **Input** — однострочный ввод в той же визуальной семье полей.
- **Hint** (через `Textarea.Hint`) — общий примитив подсказки.
- **Label** — внешний заголовок к полю, если нужен текст **над** рамкой (согласуйте `htmlFor` с `id`, переданным в `Textarea.Root`, и избегайте вложенных `label`).
- **Typography** — заголовки и пояснения рядом с полем в макете формы.
