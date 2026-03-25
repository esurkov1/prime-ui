# Checkbox

## Что это

Составной контроль «флажок»: скрытый нативный `input type="checkbox"`, видимый квадрат с галочкой или чертой «неопределённо», подпись и опциональные подсказка и ошибка.

## Для чего нужен

- **Оформление заказа и юридические согласия** — явное «согласен с условиями» перед оплатой или отправкой заявки, с текстом оферты рядом с квадратом.
- **Таблицы и списки с массовым выбором** — отметка строк и родительский флажок «выбрать всё» в промежуточном состоянии, когда выбрана только часть строк.
- **Настройки продукта и рассылок** — включение каналов уведомлений, опций приватности и экспериментальных функций без отдельной кнопки «Сохранить» на каждый пункт.
- **Согласование и маршруты документов** — отметка «ознакомлен», «согласовано» или «требуется доработка» в карточке этапа, где важна фиксация факта в форме.
- **Внутренние панели и отчёты** — фильтры «показать архив», «только мои объекты», переключатели видимости колонок при сохранении макета таблицы.

## Юзкейсы

Каждый пример — другой тип экрана и другой набор пропсов; импорт из пакета `prime-ui-kit`.

### Базовый

Короткая анкета перед записью к врачу: одно согласие на обработку данных, без подсказки и без ошибки.

```tsx
import { Checkbox } from "prime-ui-kit";

export function MedicalConsentLine() {
  return (
    <Checkbox.Root size="m" name="gdpr" value="yes" required>
      <Checkbox.Label>Согласен на обработку персональных данных в целях записи на приём</Checkbox.Label>
    </Checkbox.Root>
  );
}
```

### С вариантами/размерами

Витрина настроек плотности интерфейса: один и тот же текст согласия в четырёх размерах, чтобы согласовать с сеткой карточек каталога.

```tsx
import { Checkbox } from "prime-ui-kit";

export function CatalogDensityConsent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["s", "m", "l", "xl"] as const).map((size) => (
        <Checkbox.Root key={size} size={size} name={`compact-${size}`}>
          <Checkbox.Label>Компактный режим списка товаров (размер {size})</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </div>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Блок в боковой панели подписки: подпись, пояснение частоты писем и сообщение валидации после неудачной попытки отправить форму без согласия.

```tsx
import { Checkbox } from "prime-ui-kit";

export function NewsletterSidebarBlock() {
  const showError = true;

  return (
    <aside style={{ maxWidth: 320, padding: 16, borderRadius: 8, background: "var(--prime-sys-color-surface-raised, #f4f4f5)" }}>
      <Checkbox.Root size="m" variant={showError ? "error" : "default"} name="digest">
        <Checkbox.Label>Еженедельный дайджест новинок и скидок</Checkbox.Label>
        <Checkbox.Hint>Не чаще одного письма в неделю; отписка в один клик внизу письма.</Checkbox.Hint>
        {showError ? <Checkbox.Error>Отметьте пункт или нажмите «Пропустить».</Checkbox.Error> : null}
      </Checkbox.Root>
    </aside>
  );
}
```

### Контролируемый режим

Заголовок таблицы заказов: флажок отражает, все ли строки на странице выбраны; при частичном выборе показывается `indeterminate`, по клику — выделить всё или снять всё.

```tsx
import * as React from "react";
import { Checkbox } from "prime-ui-kit";

type Row = { id: string };

export function OrdersHeaderSelectAll({ rows }: { rows: Row[] }) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set());

  const total = rows.length;
  const selectedCount = rows.filter((r) => selectedIds.has(r.id)).length;
  const allSelected = total > 0 && selectedCount === total;
  const indeterminate = selectedCount > 0 && selectedCount < total;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)));
    }
  };

  return (
    <Checkbox.Root
      size="m"
      checked={allSelected}
      indeterminate={indeterminate}
      onChange={() => toggleAll()}
      aria-label={allSelected ? "Снять выбор со всех заказов на странице" : "Выбрать все заказы на странице"}
    >
      <Checkbox.Label />
    </Checkbox.Root>
  );
}
```

## Анатомия

- **`Checkbox.Root`** — провайдер контекста и обёртка `div.field` с `data-size`, `data-variant`, `data-disabled`, `data-invalid`, `data-checked`, `data-indeterminate`; внутри `ControlSizeProvider` и `children` (слоты).
- **`Checkbox.Label`** — `Label.Root` с сеткой: ячейка с нативным `input` (скрыт) и декоративным `span` с SVG (рамка, галочка, линия indeterminate), затем колонка текста подписи.
- **`Checkbox.Hint`** — `Hint.Root` под подписью, с отступом под колонку текста; регистрирует наличие подсказки для `aria-describedby`.
- **`Checkbox.Error`** — `Hint.Root` с вариантом ошибки; регистрирует invalid для поля (вместе с `variant="error"` на корне).

Публичный API: объект **`Checkbox`** с полями **`Root`**, **`Label`**, **`Hint`**, **`Error`**.

## API

### Checkbox.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| variant | `"default" \| "error"` | `"default"` | нет | Красная обводка при `error`; `invalid` также при монтировании `Checkbox.Error`. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | нет | Размер квадрата и типографики подписи. |
| indeterminate | `boolean` | `false` | нет | Промежуточное состояние; выставляется на DOM `input.indeterminate`. |
| id | `string` | авто | нет | Стабильный id input; связывается с `htmlFor` у `Checkbox.Label`. |
| className | `string` | — | нет | Класс на обёртке поля. |
| checked | `boolean` | — | нет | Управляемое «отмечен». |
| defaultChecked | `boolean` | `false` | нет | Начальное значение в неконтролируемом режиме. |
| onChange | `React.ChangeEventHandler<HTMLInputElement>` | — | нет | Событие изменения; внутри обновляется состояние checked. |
| disabled | `boolean` | — | нет | Неактивный input и подпись. |
| aria-describedby | `string` | — | нет | Дополняется id hint и error при использовании слотов. |
| children | `React.ReactNode` | — | нет | Обычно слоты Label, Hint, Error. |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" \| "size">` | — | нет | `name`, `value`, `required`, `readOnly`, `form` и прочие атрибуты нативного checkbox. |

### Checkbox.Label

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | нет | Текст рядом с квадратом; пустой узел — только квадрат (нужен `aria-label` на Root). |
| className | `string` | — | нет | Класс на `label`. |
| …rest | `Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "htmlFor" \| "size">` | — | нет | Прочие атрибуты label. |

### Checkbox.Hint

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | да | Текст подсказки. |
| className | `string` | — | нет | Дополнительный класс. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | нет | Атрибуты абзаца без `id`. |

### Checkbox.Error

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | да | Текст ошибки. |
| className | `string` | — | нет | Дополнительный класс. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | нет | Атрибуты абзаца без `id`. |

## Варианты

- **`default`** — нейтральная обводка квадрата; при ошибке только если смонтирован **`Checkbox.Error`**.
- **`error`** — обводка в цвет ошибки независимо от текста в слоте (удобно при ошибке всей формы до монтирования сообщения).

## Состояния

- **Не отмечен / отмечен** — обычный toggle; визуально анимирована галочка.
- **Indeterminate** — линия по центру квадрата; логически input может быть `checked` или нет — визуал задаётся пропом **`indeterminate`** и DOM-свойством.
- **Disabled** — нет клика, приглушённые цвета, курсор «запрещено» на строке подписи.
- **Invalid** — `aria-invalid` на input при `variant="error"` или при наличии **`Checkbox.Error`**.

Отдельного визуального режима «loading» у компонента нет.

## Доступность (a11y)

- Фокус с клавиатуры обрабатывается нативным `input`; видимое кольцо фокуса — на декоративном квадрате через `focus-visible`.
- **`Checkbox.Label`** задаёт **`htmlFor`** на сгенерированный **`id`** input; клик по тексту переключает флажок.
- Без видимого текста задайте **`aria-label`** (или **`aria-labelledby`**) на **`Checkbox.Root`**, чтобы скрытый input имел доступное имя.
- **`aria-describedby`** на input собирается из пользовательского значения, id подсказки и id ошибки при наличии слотов.

## Ограничения и заметки

- Компонент **не** поддерживает **`asChild`**: разметка фиксирована (label + скрытый input + SVG).
- Группа «один из нескольких взаимоисключающих» — сценарий для **`Radio`**, а не для нескольких независимых **`Checkbox`**.
- Состояние **`indeterminate`** в HTML не участвует в отправке формы: при снятии indeterminate по клику за поведение отвечает ваш **`onChange`** и внешнее состояние.
- **`Checkbox.Root`** не задаёт `type` на input — он всегда checkbox; проп **`size`** на input не пробрасывается (зарезервирован под дизайн-систему).

## Связанные компоненты

- **Radio** — выбор одного варианта из группы с тем же визуальным языком choice-контролов.
- **Switch** — бинарное включение настройки с другой метафорой (ползунок).
- **Label** и **Hint** — используются внутри чекбокса; их можно сочетать рядом с **Input** в общих формах.
- Нативная **form** — для `name`, `value`, `required` и отправки данных на сервер.
