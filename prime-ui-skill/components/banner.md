# Banner

## Что это

Составная полоса объявления: корневая сетка с центральным блоком текста и опциональной кнопкой закрытия, внутри — слоты под иконку, заголовок, описание и ряд действий.

## Для чего нужен

- **Логистика и статусы заказа** — одна заметная строка над трекингом: доставка задерживается, заказ собран или ожидает оплаты, с кнопкой «Подробнее» без открытия модального окна.
- **Согласования и внутренние панели** — предупреждение о дедлайне согласования документа или блокировке этапа, с семантикой `warning` или `error` и возможностью скрыть полосу после прочтения.
- **Онбординг и релизы** — короткое сообщение о новой функции (`feature`) или изменении интерфейса, с лёгким вариантом фона и ссылкой в действиях.
- **Формы и чек-аут** — ненавязчивая подсказка перед отправкой (политика, доставка, ограничения по региону) с вариантом `stroke` или `lighter`, не конкурирующая с полями ввода.
- **Технические инциденты** — глобальная плашка о сбое API или регламентных работах (`information` / `error`), на всю ширину области контента и с явным закрытием для повторяющихся визитов.

## Юзкейсы

Каждый пример — другой тип экрана и другой набор пропсов; импорт из пакета `prime-ui-kit`.

### Базовый

Страница настроек профиля: нейтральное напоминание сохранить изменения перед уходом, без кнопок и без закрытия.

```tsx
import { User } from "lucide-react";
import { Banner } from "prime-ui-kit";

export function ProfileSettingsHint() {
  return (
    <Banner.Root status="information" variant="lighter" size="m">
      <Banner.Content>
        <Banner.Icon as={User} aria-hidden />
        <Banner.Title>Черновик не сохранён</Banner.Title>
        <Banner.Description>Несохранённые поля будут потеряны при переходе на другую вкладку.</Banner.Description>
      </Banner.Content>
    </Banner.Root>
  );
}
```

### С вариантами/размерами

Витрина тарифов: один и тот же текст акции в четырёх размерах, чтобы согласовать с сеткой карточек планов.

```tsx
import { Sparkles } from "lucide-react";
import { Banner } from "prime-ui-kit";

export function PricingPromoStripes() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(["s", "m", "l", "xl"] as const).map((size) => (
        <Banner.Root key={size} status="feature" variant="light" size={size}>
          <Banner.Content>
            <Banner.Icon as={Sparkles} aria-hidden />
            <Banner.Title>Первый месяц со скидкой 40%</Banner.Title>
            <Banner.Description>Действует для новых рабочих пространств до конца квартала.</Banner.Description>
          </Banner.Content>
        </Banner.Root>
      ))}
    </div>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Модальное окно импорта таблицы: ошибка разбора файла в шапке диалога, с действием «Скачать шаблон» и закрытием полосы после исправления.

```tsx
import { AlertCircle } from "lucide-react";
import { Banner, Button } from "prime-ui-kit";

export function ImportModalErrorBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Banner.Root status="error" variant="filled" size="m" onDismiss={onDismiss}>
      <Banner.Content>
        <Banner.Icon as={AlertCircle} aria-hidden />
        <Banner.Title>Не удалось прочитать файл</Banner.Title>
        <Banner.Description>Проверьте кодировку UTF-8 и наличие колонок «Код» и «Количество».</Banner.Description>
        <Banner.Actions>
          <Button.Root size="s" type="button" variant="neutral" mode="ghost">
            Скачать шаблон
          </Button.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}
```

### Контролируемый режим

Дашборд мониторинга: полоса о снижении точности метрик показывается только пока оператор не нажал «Понятно»; состояние хранится в родителе.

```tsx
import * as React from "react";
import { Activity } from "lucide-react";
import { Banner, Button } from "prime-ui-kit";

export function MetricsDegradedBanner() {
  const [visible, setVisible] = React.useState(true);

  if (!visible) {
    return (
      <Button.Root size="s" type="button" variant="neutral" onClick={() => setVisible(true)}>
        Показать уведомление о метриках
      </Button.Root>
    );
  }

  return (
    <Banner.Root status="warning" variant="stroke" size="m">
      <Banner.Content>
        <Banner.Icon as={Activity} aria-hidden />
        <Banner.Title>Задержка агрегации 5–10 минут</Banner.Title>
        <Banner.Description>Данные за последний интервал могут догружаться; алерты работают в штатном режиме.</Banner.Description>
        <Banner.Actions>
          <Button.Root size="s" type="button" variant="primary" onClick={() => setVisible(false)}>
            Понятно
          </Button.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}
```

## Анатомия

`Banner.Root` → провайдер размера для вложенных контролов.

Внутри корня обычно:

- `Banner.Content` → `Banner.Icon` + `Banner.Title` + `Banner.Description` + опционально `Banner.Actions`
- опционально `Banner.CloseButton` соседом с `Banner.Content` (колонка сетки справа)

Если передан `onDismiss` и в дереве нет `Banner.CloseButton`, кнопка закрытия добавляется автоматически.

## API

### Banner.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| variant | `"filled" \| "light" \| "lighter" \| "stroke"` | `"filled"` | Нет | Плотность фона и стиль акцента (у `stroke` — нижняя цветная полоска). |
| status | `"information" \| "warning" \| "error" \| "success" \| "feature"` | `"information"` | Нет | Семантика палитры и типичного смысла сообщения. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Размерная шкала для отступов, текста и иконки; задаёт контекст для `Banner.CloseButton`. |
| onDismiss | `() => void` | — | Нет | При наличии и отсутствии дочернего `Banner.CloseButton` рендерит кнопку закрытия с `aria-label` «Dismiss». |
| className | `string` | — | Нет | Дополнительный класс корня. |
| children | `React.ReactNode` | — | Нет | Контент и при необходимости явная кнопка закрытия. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты корневого `div`. |

### Banner.Content

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | Нет | Класс flex-контейнера центральной колонки. |
| children | `React.ReactNode` | — | Нет | Иконка, заголовок, описание, действия. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты внутреннего `div`. |

### Banner.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| as | `React.ElementType` | `"div"` | Нет | Элемент или компонент иконки (часто SVG-компонент с `aria-hidden`). |
| className | `string` | — | Нет | Дополнительный класс обёртки. |
| children | `React.ReactNode` | — | Нет | Содержимое при `as="div"` или кастомной обёртке. |
| …rest | пропсы `T` без `as` и `className` | — | Нет | Пробрасываются в выбранный элемент. |

### Banner.Title

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | Нет | Класс `span` заголовка. |
| children | `React.ReactNode` | — | Нет | Текст заголовка. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Атрибуты `span`. |

### Banner.Description

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | Нет | Класс `span` описания. |
| children | `React.ReactNode` | — | Нет | Вторичный текст. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Атрибуты `span`. |

### Banner.Actions

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | Нет | Класс контейнера кнопок. |
| children | `React.ReactNode` | — | Нет | `Button`, `LinkButton` и т.п. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты `div`. |

### Banner.CloseButton

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | Нет | Тип нативной кнопки. |
| className | `string` | — | Нет | Дополнительный класс. |
| children | `React.ReactNode` | — | Нет | По умолчанию крестик в `Button.Icon`. |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">` | — | Нет | В т.ч. `onClick`, `aria-label`, `disabled`; размер кнопки выводится из контекста баннера. |

## Варианты

- **filled** — насыщенный фон статуса и контрастный текст; максимальная заметность.
- **light** — мягкий фон из палитры статуса и текст в цвете статуса; универсальный баланс.
- **lighter** — смешение фона статуса с поверхностью страницы; спокойное напоминание.
- **stroke** — нейтральная подложка, акцент — цветная линия снизу и цвет иконки по статусу.

## Состояния

Семантика задаётся пропом **`status`**: под каждый тип подбираются токены фона, текста и акцента. Отдельных пропов `disabled` или `loading` у корня нет.

**Закрытие:** либо **`onDismiss`** (и тогда при отсутствии своей `Banner.CloseButton` добавляется стандартная), либо только **`Banner.CloseButton`** с собственным `onClick`, либо оба — тогда автоматическая кнопка **не** дублируется, если `Banner.CloseButton` уже есть среди потомков.

## Доступность (a11y)

- Корень — `div`; при необходимости задайте **`role="region"`** и **`aria-label` / `aria-labelledby`**, если полоса — осмысленный ориентир на странице.
- Иконки в `Banner.Icon` обычно декоративны: **`aria-hidden`** на компоненте иконки.
- Автоматически вставляемая кнопка закрытия использует **`aria-label="Dismiss"`**; при собственной кнопке задайте понятный **`aria-label`** на языке интерфейса.
- `Banner.Title` и `Banner.Description` — `span`; при длинном тексте переносы идут за счёт flex-вёрстки контента.

## Ограничения и заметки

- Нет встроенного **`open` / `visible`**: показ и скрытие реализуются условным рендером или состоянием родителя.
- **`Banner.Icon`** использует проп **`as`**, а не `asChild` у корня.
- Сетка рассчитана на **одну** центральную группу контента и **одну** зону закрытия справа; сложные макеты с несколькими колонками лучше собирать снаружи.
- Тексты заголовка и описания — инлайновые `span`; для богатого форматирования вкладывайте в них допустимую вложенную разметку осознанно.

## Связанные компоненты

- **Button** — действия в `Banner.Actions`; `Banner.CloseButton` построен на `Button.Root` (ghost neutral).
- **LinkButton** — вторичные переходы в полосе без имитации кнопки через `button`.
- **Typography** — подписи и пояснения рядом с баннером вне слота (например после скрытия).
- **Notification** — если нужен тост или временное всплывающее сообщение вместо полосы в потоке документа.
