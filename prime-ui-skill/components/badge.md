# Badge

## Что это

Компактная несамостоятельная метка (бейдж) для подписи статуса, категории или числа, с опциональными слотами под точку и иконку.

## Для чего нужен

- **Каталог и заказы:** подпись этапа доставки, тип оплаты или приоритет строки без отдельной колонки.
- **Внутренние панели и отчёты:** роли пользователя, окружение (staging), метки фильтра рядом с заголовком.
- **Профиль и совместная работа:** короткая метка присутствия или режима («В сети», «Занят») рядом с именем или в списке участников.

## Юзкейсы

### Базовый

Счётчик или короткая метка у заголовка вкладки или секции.

```tsx
import { Badge } from "prime-ui-kit";

export function TabWithCount() {
  return (
    <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
      Входящие
      <Badge.Root color="blue" variant="light" size="m">
        12
      </Badge.Root>
    </h2>
  );
}
```

### С вариантами и размерами

Маркетинговый блок: разные уровни акцента для тегов темы статьи.

```tsx
import { Badge } from "prime-ui-kit";

export function ArticleTopics() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Badge.Root color="purple" variant="filled" size="s">
        Гайд
      </Badge.Root>
      <Badge.Root color="teal" variant="lighter" size="m">
        Обновлено
      </Badge.Root>
      <Badge.Root color="orange" variant="stroke" size="m">
        Бета
      </Badge.Root>
    </div>
  );
}
```

### В контексте карточки

Строка товара: цена, название и метка «В наличии» с иконкой и точкой.

```tsx
import { Badge, Icon } from "prime-ui-kit";

export function ProductRow() {
  return (
    <article
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: 12,
        borderRadius: 8,
        border: "1px solid var(--border-subtle, #e5e5e5)",
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>Клавиатура механическая</div>
        <div style={{ fontSize: 14, opacity: 0.7 }}>Арт. KB-204</div>
      </div>
      <Badge.Root color="green" variant="light" size="m">
        <Badge.Dot />
        <Badge.Icon>
          <Icon name="status.locked" />
        </Badge.Icon>
        В наличии
      </Badge.Root>
    </article>
  );
}
```

### Статус присутствия

Индикатор с осмысленной подписью для вспомогательных технологий.

```tsx
import { Badge } from "prime-ui-kit";

export function PresenceRow({ name }: { name: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span>{name}</span>
      <Badge.Root variant="status" status="away" size="m" label={`${name}: отошёл`}>
        Отошёл
      </Badge.Root>
    </div>
  );
}
```

### Иконки в разных позициях

Иконки можно размещать слева от текста, справа или использовать только иконку без текста.

```tsx
import { Badge, Icon } from "prime-ui-kit";

export function IconPositions() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {/* Иконка слева */}
      <Badge.Root color="blue" variant="light" size="m">
        <Badge.Icon>
          <Icon name="field.email" />
        </Badge.Icon>
        Email
      </Badge.Root>

      {/* Иконка справа */}
      <Badge.Root color="red" variant="light" size="m">
        New
        <Badge.Icon>
          <Icon name="nav.chevronRight" />
        </Badge.Icon>
      </Badge.Root>

      {/* Только иконка */}
      <Badge.Root color="sky" variant="light" size="m">
        <Badge.Icon>
          <Icon name="action.copy" />
        </Badge.Icon>
      </Badge.Root>

      {/* Комбинация точки и иконки */}
      <Badge.Root color="purple" variant="stroke" size="m">
        <Badge.Dot />
        <Badge.Icon>
          <Icon name="status.locked" />
        </Badge.Icon>
        Protected
      </Badge.Root>
    </div>
  );
}
```

## Анатомия

Плоский составной API:

- `Badge.Root` — обёртка `div`; при `variant="status"` добавляются встроенная точка статуса и `role="status"`.
- `Badge.Dot` — декоративная точка внутри содержимого (`span`, `aria-hidden`).
- `Badge.Icon` — выравнивание иконки в строке с текстом (`span`).

Внутри `Badge.Root` дети оборачиваются в `ControlSizeProvider`, чтобы вложенные иконки могли наследовать размер.

## API

### Badge.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `color` | `"gray" \| "red" \| "blue" \| "green" \| "orange" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Нет | Семантический цвет; не влияет на оформление при `variant="status"`. |
| `variant` | `"filled" \| "light" \| "lighter" \| "stroke" \| "status"` | `"light"` | Нет | Плотность фона, обводка или режим статуса с точкой. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | из `ControlSizeContext` или `"m"` | Нет | Явный размер; без пропа берётся контекст контрольной поверхности (с маппингом `xs` → `s`), иначе `"m"`. |
| `disabled` | `boolean` | — | Нет | Приглушённый вид, `data-disabled`. |
| `status` | `"online" \| "offline" \| "away" \| "busy"` | `"online"` | Нет | Вариант точки только для `variant="status"`. |
| `label` | `string` | — | Нет | `aria-label` на корне при `variant="status"`. |
| `children` | `React.ReactNode` | — | Нет | Текст, `Badge.Dot`, `Badge.Icon`, иконки. |
| `className` | `string` | — | Нет | Дополнительный класс корня. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Стандартные атрибуты и `ref` для корневого `div`. |

### Badge.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `children` | `React.ReactNode` | — | Да | Узел иконки. |
| `className` | `string` | — | Нет | Класс обёртки. |
| … | `Omit<React.HTMLAttributes<HTMLDivElement>, "children">` | — | Нет | Прочие атрибуты обёртки. |

### Badge.Dot

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Класс точки. |
| … | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Атрибуты `span`; узел скрыт от вспомогательных технологий. |

## Варианты

- **`filled`** — сплошная заливка по выбранному `color`, максимальный акцент.
- **`light`** — мягкий фон и контрастный текст; стиль по умолчанию.
- **`lighter`** — ещё светлее фон, вторичные метки на плотных экранах.
- **`stroke`** — прозрачный фон и цветная обводка.
- **`status`** — встроенная индикаторная точка; цвет точки задаётся `status`, текст остаётся в `children`.

## Состояния

- **Обычный** — по умолчанию, стили из `variant`, `color`, `size`.
- **`disabled`** — визуальное приглушение через `data-disabled` для всех вариантов, включая `status`.

Отдельных состояний загрузки, ошибки или фокуса у бейджа нет: это статичная метка, не кнопка и не поле ввода.

## Доступность (a11y)

- При **`variant="status"`** на корне выставляются `role="status"` и опциональный `aria-label` из пропа `label`; нужно передавать `label`, если короткий текст внутри недостаточен для смысла (например только «Онлайн» без имени).
- **`Badge.Dot`** помечен `aria-hidden` — не дублирует смысл текста рядом.
- Клавиатурного управления у бейджа нет; для действий используйте кнопку или ссылку рядом или обёртку с соответствующей ролью.

## Ограничения и заметки

- Бейдж **не** заменяет кнопку, ссылку или поле; кликабельные сценарии оформляйте отдельными контролами.
- Проп **`color`** игнорируется в оформлении при **`variant="status"`** (важен `status` для точки).
- Размер без явного `size` зависит от **`ControlSizeProvider`** выше по дереву; вне контекста используется **`m`**.
- **Иконки** внутри `Badge.Icon` автоматически наследуют размер от `Badge.Root` через `ControlSizeProvider` — не нужно явно указывать размер иконки, если она должна соответствовать размеру бейджа.

## Связанные компоненты

- **Tag** — интерактивная или съёмная метка с другим UX (закрытие, выбор).
- **Typography** — основной текст рядом с бейджем.
- **Button / LinkButton** — если метка должна быть действием, а не подписью.
- **Kbd** — для отображения сочетаний клавиш, а не статусов.
