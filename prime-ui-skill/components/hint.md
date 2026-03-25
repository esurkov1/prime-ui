# Hint

## Что это

`Hint` — компактная строка пояснения под полем ввода: нейтральный текст, сообщение об ошибке или визуально приглушённый текст для неактивного поля, опционально с иконкой слева.

## Для чего нужен

- **Онбординг и регистрация** — пояснить правила пароля, формат телефона или требования к имени до отправки формы.
- **Корпоративные настройки и справочники** — показать, откуда берётся значение только для чтения или почему поле недоступно текущей роли.
- **Операционные экраны (логистика, биллинг)** — вывести лимит, единицу измерения или текст ошибки интеграции рядом с числовым полем без отдельного блока уведомлений.

## Юзкейсы

### Базовый

Подсказка под одним полем без дополнительных слотов: задаётся только текст и согласованный с полем размер.

```tsx
import { Hint } from "prime-ui-kit";
import { Label } from "prime-ui-kit";

export function InviteEmailField() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 320 }}>
      <Label.Root htmlFor="invite-email" size="m">
        Email гостя
      </Label.Root>
      <input id="invite-email" type="email" autoComplete="email" placeholder="name@company.com" />
      <Hint.Root size="m" variant="default">
        Приглашение будет действительно 7 дней.
      </Hint.Root>
    </div>
  );
}
```

### С вариантами и размерами

Другой контекст — панель магазина: крупное поле (`size="l"` на подсказке в паре с полем) и явный режим ошибки при неверном промокоде; иконка усиливает узнаваемость поля.

```tsx
import { Hint } from "prime-ui-kit";
import { Label } from "prime-ui-kit";

function TagIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M21.41 11.58l-9-9A2 2 0 0 0 12 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 .59 1.42l9 9a2 2 0 0 0 2.83 0l8-8a2 2 0 0 0 0-2.84zm-7.66 7.66L5 10.5V4h6.5l8.75 8.75-7.5 7.49zM7.5 6A1.5 1.5 0 1 1 6 7.5 1.5 1.5 0 0 1 7.5 6z"
      />
    </svg>
  );
}

export function CheckoutPromoRow() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 400 }}>
      <Label.Root htmlFor="promo" size="l">
        Промокод
      </Label.Root>
      <input id="promo" type="text" defaultValue="SUMR-WRONG" />
      <Hint.Root size="l" variant="error">
        <Hint.Icon>
          <TagIcon />
        </Hint.Icon>
        Код не найден или срок действия истёк. Проверьте написание.
      </Hint.Root>
    </div>
  );
}
```

### В контексте (боковая панель настроек)

Фрагмент колонки настроек уведомлений: лейбл, ползунок и подсказка с уточнением области действия — без отдельной «карточки» ошибки.

```tsx
import { Hint } from "prime-ui-kit";
import { Label } from "prime-ui-kit";

export function NotificationVolumePanel() {
  return (
    <section style={{ padding: 16, maxWidth: 360, borderLeft: "1px solid #e8e8e8" }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 18 }}>Звук в браузере</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Label.Root htmlFor="browser-vol" size="m">
          Громкость
        </Label.Root>
        <input id="browser-vol" type="range" min={0} max={100} defaultValue={35} />
        <Hint.Root size="m" variant="default">
          Каналы «Срочно» и «Безопасность» всегда проигрываются на полной громкости.
        </Hint.Root>
      </div>
    </section>
  );
}
```

### Контролируемый режим

Родитель хранит результат валидации и переключает `variant` и текст после отправки или при вводе.

```tsx
import { useState } from "react";
import { Button, Hint, Label } from "prime-ui-kit";

export function ProjectCodeField() {
  const [code, setCode] = useState("");
  const [showError, setShowError] = useState(false);

  const variant = showError && code.trim().length < 3 ? "error" : "default";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
      <Label.Root htmlFor="proj-code" size="m">
        Код проекта
      </Label.Root>
      <input
        id="proj-code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setShowError(false);
        }}
        aria-invalid={variant === "error"}
      />
      <Hint.Root size="m" variant={variant}>
        {variant === "error" ? "Минимум 3 символа, латиница и цифры." : "Будет использоваться в ссылках и API."}
      </Hint.Root>
      <Button.Root size="s" type="button" onClick={() => setShowError(true)}>
        Проверить
      </Button.Root>
    </div>
  );
}
```

## Анатомия

Составной объект **`Hint`** с двумя узлами:

- **`Hint.Root`** — элемент `p` с `data-size` и `data-variant`, внутри `ControlSizeProvider` для каскада размера к иконке.
- **`Hint.Icon`** — необязательный `span` с `aria-hidden="true"` и фиксированным квадратом под иконку; размещается как первый ребёнок или рядом с текстом внутри корня.

## API

### Hint.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Номинальный размер в связке с полем; кегль подсказки на ступень меньше поля. |
| variant | `"default" \| "error" \| "disabled"` | `"default"` | Нет | Цвет текста: вторичный контент, опасность или отключённый контент. |
| className | `string` | — | Нет | Дополнительный класс на `p`. |
| children | `React.ReactNode` | — | Нет | Текст; при необходимости рядом `Hint.Icon`. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | Нет | Нативные атрибуты параграфа (`id`, `role`, `aria-*` и др.). |

### Hint.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | Да | Обычно SVG или компонент иконки. |
| className | `string` | — | Нет | Дополнительный класс на `span`. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Прочие атрибуты обёртки. |

## Варианты

- **`default`** — цвет вторичного текста; обычные подсказки и ограничения.
- **`error`** — цвет опасности; сообщения валидации и сбои ввода.
- **`disabled`** — цвет отключённого контента; согласование с неактивным полем и лейблом.

Размеры **`s` | `m` | `l` | `xl`** задают шрифт, межстрочный интервал и зазор до иконки в одном ярусе с выбранным номинальным размером поля.

## Состояния

Отдельных пропсов `disabled` или `loading` у корня нет: неактивный вид задаётся **`variant="disabled"`**. Ошибка — **`variant="error"`**. Визуальное состояние поля (например `disabled` на `input`) синхронизируется смыслом с выбором варианта подсказки на стороне экрана.

## Доступность (a11y)

- Корень — параграф; текст подсказки читается в порядке документа.
- Для связи с полем задайте **`id`** на `Hint.Root` и **`aria-describedby`** на элементе ввода с этим id.
- Сообщение об ошибке можно дополнительно вывести с **`role="alert"`** или разместить в живой области — через `…rest` на корне, если это принято в вашем сценарии.
- **`Hint.Icon`** помечен **`aria-hidden`**, чтобы диктор не дублировал декоративную иконку.

## Ограничения и заметки

- Не заменяет **`Label`**: лейбл остаётся кратким именем поля, подсказка — дополнительным пояснением.
- Не встроен в каждый контрол автоматически: в составном **`Input`** кита подсказки могут подставляться пропами самого поля — при ручной вёрстке используйте `Hint` явно.
- Полиморфного **`asChild`** нет: корень всегда `p`.

## Связанные компоненты

- **`Label`** — основная подпись поля и связь `htmlFor` / `id`.
- **`Input`** — готовая композиция с опциональными `hint` и `error` на корне.
- **`Textarea`** — тот же паттерн метаданных под многострочным вводом (если используется в продукте).
- **`Button`** — для действий рядом с формой, инициирующих валидацию и смену `variant` подсказки.
