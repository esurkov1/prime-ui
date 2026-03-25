# Button

## Что это

Составной контрол действия: корневая кнопка (`Button.Root`), опциональная иконка (`Button.Icon`) и индикатор загрузки (`Button.Spinner`), согласованные по размеру через контекст.

## Для чего нужен

- **Внутренние сервисы и панели** — подтвердить сохранение черновика, открыть модальное окно, запустить массовую операцию над строками таблицы.
- **Поток покупки или подписки** — перейти к оплате, повторить попытку после ошибки сети, отменить оформление без путаницы с текстовыми ссылками.
- **Онбординг и пустые экраны** — одна заметная кнопка «Начать» или «Создать первый проект», когда экран почти без другого UI.

## Юзкейсы

### Базовый

Типичная первичная кнопка в шапке экрана или в блоке действий.

```tsx
import { Button } from "prime-ui-kit";

export function SaveToolbar() {
  return (
    <Button.Root variant="primary" mode="filled" size="m" type="button">
      Сохранить
    </Button.Root>
  );
}
```

### С вариантами/размерами

Карточка медиатеки: основное действие крупнее, второстепенные — нейтральные и в обводке.

```tsx
import { Button } from "prime-ui-kit";

export function AssetCardActions() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
      <Button.Root variant="primary" mode="filled" size="l">
        Скачать оригинал
      </Button.Root>
      <Button.Root variant="neutral" mode="stroke" size="m">
        Поделиться
      </Button.Root>
      <Button.Root variant="neutral" mode="ghost" size="s">
        Подробнее
      </Button.Root>
    </div>
  );
}
```

### В контексте (форма)

Поисковая строка: отправка и сброс через нативные типы кнопки, ширина на колонку.

```tsx
import { Button } from "prime-ui-kit";

export function CatalogSearchForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      style={{ display: "grid", gap: "0.75rem", maxWidth: 320 }}
    >
      <input name="q" placeholder="Название или артикул" />
      <Button.Root type="submit" variant="primary" mode="filled" size="m" fullWidth>
        Искать
      </Button.Root>
      <Button.Root type="reset" variant="neutral" mode="stroke" size="m" fullWidth>
        Сбросить фильтр
      </Button.Root>
    </form>
  );
}
```

### Контролируемый режим

Долгий запрос: родитель держит `loading`, кнопка блокируется и показывает спиннер.

```tsx
import { useState } from "react";
import { Button } from "prime-ui-kit";

export function PublishDraftButton() {
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    setLoading(true);
    try {
      await fetch("/api/publish", { method: "POST" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button.Root
      variant="primary"
      mode="filled"
      size="m"
      loading={loading}
      onClick={handlePublish}
      type="button"
    >
      <Button.Spinner />
      {loading ? "Публикация…" : "Опубликовать"}
    </Button.Root>
  );
}
```

## Анатомия

- **`Button.Root`** — элемент `<button>` или один дочерний узел при `asChild` (через слот); оборачивает детей в `ControlSizeProvider` (кроме режима `asChild`, где размер задаётся на слоте).
- **`Button.Icon`** — `<span aria-hidden>` для иконки; визуальный размер из токенов размера контрола.
- **`Button.Spinner`** — индикатор в разметке; отображается только при `loading === true` на ближайшем `Button.Root` (контекст).

## API

### Button.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| variant | `"primary" \| "neutral" \| "error"` | `"primary"` | Нет | Семантика цвета. |
| mode | `"filled" \| "stroke" \| "lighter" \| "ghost" \| "fancy"` | `"filled"` | Нет | Заливка, обводка, акцентный «fancy». |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Единый ярус высоты, радиуса, текста и иконки. |
| fullWidth | `boolean` | — | Нет | Кнопка на ширину контейнера (`data-full-width`). |
| loading | `boolean` | `false` | Нет | Блокировка клика, `aria-busy`, контекст для `Button.Spinner`. |
| asChild | `boolean` | `false` | Нет | Слить пропсы с единственным ребёнком вместо `<button>`. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | Нет | Для нативной кнопки; при `asChild` не передаётся дочернему элементу. |
| disabled | `boolean` | — | Нет | Неактивное состояние; вместе с `loading` клик запрещён. |
| className | `string` | — | Нет | Доп. класс на корне. |
| children | `React.ReactNode` | — | Нет | Текст, `Button.Icon`, `Button.Spinner` и т.д. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` (без `size`) | — | Нет | `onClick`, `aria-*`, `data-*` и прочие атрибуты кнопки. |

### Button.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | Да | Узел иконки. |
| className | `string` | — | Нет | Доп. класс на `span`. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | Нет | Прочие атрибуты `span` (корень с `aria-hidden`). |

### Button.Spinner

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | Нет | Доп. класс индикатора. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Если `loading` на корне ложь, ничего не рендерится. |

## Варианты

- **primary** — основное позитивное действие.
- **neutral** — вторичное или нейтральное (отмена, «назад», фильтры).
- **error** — деструктивное или связанное с ошибкой (удалить, отменить подписку).

Режимы **filled**, **stroke**, **lighter**, **ghost** задают плотность; **fancy** — отдельный акцентный визуальный режим на том же API.

## Состояния

- **Обычное** — интерактивно, без `disabled` и `loading`.
- **disabled** — нативно отключённая кнопка (`disabled` на `<button>`); клики не проходят.
- **loading** — кнопка ведёт себя как отключённая для действия, выставляется `aria-busy`; `Button.Spinner` при наличии в дереве показывается.
- **asChild + disabled/loading** — нативный `disabled` на ссылке не ставится; используются `aria-disabled`, блокировка `onClick` и визуал из стилей.

## Доступность (a11y)

- Корень — нативная кнопка с фокусом по Tab; для `type="submit"`/`reset` соблюдайте иерархию формы и одну явную отправку на шаг, где это уместно.
- Иконка без текста: задайте осмысленный `aria-label` (или связанный видимый лейбл) на `Button.Root`; `Button.Icon` скрыт от вспомогательных технологий (`aria-hidden`).
- В режиме загрузки сохраняйте понятную подпись (текст или `aria-label`), чтобы не оставлять кнопку без имени.
- При `asChild` дочерний элемент должен поддерживать передачу `className`, ARIA и обработчиков; ссылка остаётся фокусируемой как ссылка.

## Ограничения и заметки

- Это не переключатель состояния и не «кнопка-таб»; для переключателей смотрите `Switch`, `Checkbox`, `SegmentedControl` и т.п.
- `Button.Spinner` не заменяет текстовое описание процесса — его лучше комбинировать с подписью или `aria-busy` + видимым статусом.
- `asChild` допускает ровно одного ребёнка; тип `type` на нём не форвардится.

## Связанные компоненты

- **LinkButton** — когда нужен стиль ссылки, а не кнопка.
- **ButtonGroup** — сгруппировать несколько кнопок с общим размером и разделителями.
- **Modal**, **Drawer** — триггеры открытия часто оформляются через `Button.Root` или `asChild` на кастомном якоре.
- **Input**, **Label**, **Hint** — в формах кнопки отправки и сброса стоят рядом с полями ввода.
