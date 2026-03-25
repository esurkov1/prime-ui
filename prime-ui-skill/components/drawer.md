# Drawer

## Что это

Выдвижная панель поверх страницы (сбоку, снизу или сверху): контент в портале с подложкой, блокировкой прокрутки фона и удержанием фокуса внутри панели до закрытия.

## Для чего нужен

- **Каталог и фильтры** — сбоку открыть набор фильтров, сортировку и теги, не покидая список товаров и не перегружая узкий макет модальным окном.
- **Операции в поле и склад** — на планшете крупная панель `size="l"` слева со штрихкодом партии и чек-листом приёмки, чтобы работать в перчатках и на расстоянии от экрана.
- **Документооборот** — справа показать метаданные договора, историю согласований и связанные файлы, пока основной текст остаётся на месте.
- **Логистика и карты** — нижний лист (`side="bottom"`) с маршрутом, ETA и контактом водителя поверх карты, не перекрывая точку назначения целиком.
- **Кадры и рекрутинг** — панель с заметками интервью, оценкой по критериям и быстрыми действиями по кандидату рядом со списком воронки.
- **Финансы и биллинг** — разбор строки счёта: налоги, период списания и кнопки «спорить» / «скачать PDF» в отдельном слое поверх таблицы начислений.

## Юзкейсы

Импорт из пакета `prime-ui-kit`. Примеры разделены по смыслу экрана и комбинации API. Разметка портала: `Drawer.Portal` содержит **рядом** `Drawer.Overlay` и `Drawer.Content` (оверлей не оборачивает контент).

### Базовый

Просмотр карточки заявки из таблицы: триггер, подложка, панель справа, заголовок и текст.

```tsx
import { Button, Drawer } from "prime-ui-kit";

export function RequestPreviewDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Заявка #4821
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="req-drawer-title">
          <Drawer.Header>
            <Drawer.Title id="req-drawer-title">Заявка #4821</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>Статус: на согласовании. Ответственный: отдел закупок.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root size="m" variant="neutral" mode="stroke">
                Закрыть
              </Button.Root>
            </Drawer.Close>
            <Button.Root size="m" variant="primary">
              Открыть полностью
            </Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

### С вариантами/размерами

Чаевые курьеру: нижний лист и выразительный размер панели для касаний в приложении доставки.

```tsx
import { Button, Drawer } from "prime-ui-kit";

export function TipBottomSheet() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="primary">
          Оставить чаевые
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="bottom" size="l" aria-labelledby="tip-title">
          <Drawer.Header>
            <Drawer.Title id="tip-title">Сумма чаевых</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>Курьер получит уведомление сразу после доставки.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root size="l" variant="neutral" mode="stroke">
                Позже
              </Button.Root>
            </Drawer.Close>
            <Button.Root size="l" variant="primary">
              Подтвердить 150 ₽
            </Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Фильтры каталога: несколько полей в теле панели, отмена через `Drawer.Close`.

```tsx
import { Button, Checkbox, Drawer, Input } from "prime-ui-kit";

export function CatalogFiltersDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Фильтры
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" size="m" aria-labelledby="filters-title">
          <Drawer.Header>
            <Drawer.Title id="filters-title">Уточнить выдачу</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input.Root label="Бренд" size="m">
              <Input.Wrapper>
                <Input.Field placeholder="Начните вводить…" />
              </Input.Wrapper>
            </Input.Root>
            <Checkbox.Root defaultChecked>
              <Checkbox.Label>Только в наличии</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root>
              <Checkbox.Label>С бесплатной доставкой</Checkbox.Label>
            </Checkbox.Root>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root size="m" variant="neutral" mode="stroke">
                Сбросить
              </Button.Root>
            </Drawer.Close>
            <Button.Root size="m" variant="primary">
              Показать
            </Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

### Контролируемый режим

Панель деталей заказа открыта из кода (например после синхронизации с параметром маршрута).

```tsx
import { useEffect, useState } from "react";
import { Button, Drawer } from "prime-ui-kit";

export function OrderDetailsDrawer({ orderId }: { orderId: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(orderId != null);
  }, [orderId]);

  return (
    <>
      <Button.Root size="m" onClick={() => setOpen(true)}>
        Показать последний заказ
      </Button.Root>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content side="right" aria-labelledby="ord-drawer-title">
            <Drawer.Header>
              <Drawer.Title id="ord-drawer-title">Заказ {orderId ?? "—"}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>Состав и трекинг подгружаются при открытии по идентификатору.</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button.Root size="m" variant="primary">
                  Закрыть
                </Button.Root>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
```

## Анатомия

Композиция с пространством имён `Drawer`:

- **`Drawer.Root`** — провайдер состояния открытости и политики закрытия (`closeOnEscape`, `closeOnOverlayClick`).
- **`Drawer.Trigger`** (опционально) — один интерактивный потомок, открывающий панель по клику.
- **`Drawer.Portal`** — рендер в портал при `open`; внутри обычно **`Drawer.Overlay`** и **`Drawer.Content`** как соседи.
- **`Drawer.Content`** — панель с `role="dialog"`, фокус-ловушкой и `ControlSizeProvider` для шапки и подвала.
- **`Drawer.Header`** — зона заголовка и встроенная кнопка закрытия (если не отключена).
- **`Drawer.Title`** — видимый заголовок (`h2`), часто связан с `aria-labelledby` на `Content`.
- **`Drawer.Body`** — прокручиваемое тело.
- **`Drawer.Footer`** — действия внизу; удобно сочетать с **`Drawer.Close`**.

## API

### Drawer.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `open` | `boolean` | — | Нет | Контролируемое открытие. |
| `defaultOpen` | `boolean` | `false` | Нет | Начальное состояние в неконтролируемом режиме. |
| `onOpenChange` | `(open: boolean) => void` | — | Нет | Смена открытости. |
| `closeOnEscape` | `boolean` | `true` | Нет | Закрытие по Escape при открытой панели. |
| `closeOnOverlayClick` | `boolean` | `true` | Нет | Закрытие по клику на подложку (по самому оверлею). |
| `children` | `React.ReactNode` | — | Да | Триггер, портал и остальная разметка. |

### Drawer.Trigger

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `children` | `React.ReactElement<{ onClick?: … }>` | — | Да | Ровно один потомок; к нему добавляется открытие. |

### Drawer.Close

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `children` | `React.ReactElement<{ onClick?: …; className?: string }>` | — | Да | Ровно один потомок; по клику закрывает панель. |

### Drawer.Portal

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `children` | `React.ReactNode` | — | Нет | Содержимое портала; не монтируется при закрытом drawer. |
| `container` | `HTMLElement \| null` | `document.body` | Нет | Узел для портала. |

### Drawer.Overlay

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Дополнительный класс. |
| `onClick` | `React.MouseEventHandler<HTMLDivElement>` | — | Нет | До встроенного закрытия по клику. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | В т.ч. `role="presentation"` на корне. |

### Drawer.Content

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `side` | `"left" \| "right" \| "bottom" \| "top"` | `"right"` | Нет | Сторона выезда. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Ярус отступов и размеров контролов в шапке/подвале. |
| `aria-label` | `string` | — | Нет | Имя диалога без видимого заголовка. |
| `aria-labelledby` | `string` | — | Нет | `id` заголовка. |
| `aria-describedby` | `string` | — | Нет | `id` описания. |
| `className` | `string` | — | Нет | Класс панели. |
| `children` | `React.ReactNode` | — | Нет | Шапка, тело, подвал. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | `role="dialog"`, `aria-modal`, фокус и скролл-лок. |

### Drawer.Header

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `showCloseButton` | `boolean` | `true` | Нет | Встроенная кнопка закрытия в шапке. |
| `className` | `string` | — | Нет | Класс `header`. |
| `children` | `React.ReactNode` | — | Нет | Обычно `Drawer.Title`. |
| … | `React.HTMLAttributes<HTMLElement>` | — | Нет | Корень `<header>`. |

### Drawer.Title

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Класс заголовка. |
| `children` | `React.ReactNode` | — | Нет | Текст названия. |
| … | `React.HTMLAttributes<HTMLHeadingElement>` | — | Нет | Рендер `<h2>`. |

### Drawer.Body

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Класс тела. |
| `children` | `React.ReactNode` | — | Нет | Контент; вертикальный скролл при переполнении. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Корень `div`. |

### Drawer.Footer

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Класс подвала. |
| `children` | `React.ReactNode` | — | Нет | Кнопки действий. |
| … | `React.HTMLAttributes<HTMLElement>` | — | Нет | Корень `<footer>`. |

## Варианты

- **`side`** — визуально и по анимации: панель справа или слева (фиксированная ширина в стилях с пределом по вьюпорту), лист снизу или сверху (ограничение высоты, скругление у края экрана).
- **`size` на `Drawer.Content`** — четыре уровня (`s`–`xl`): отступы панели, промежутки шапки/подвала, кегль заголовка и размер встроенной кнопки закрытия.

## Состояния

- **Открыт / закрыт** — задаётся `open` / `defaultOpen` и `onOpenChange` на `Drawer.Root`; `Drawer.Portal` не рендерит детей при закрытии.
- **Закрытие по подложке и Escape** — по умолчанию включено; отключается пропами `closeOnOverlayClick` и `closeOnEscape` на `Drawer.Root` для сценариев «только явное закрытие».
- **Кнопка в шапке** — по умолчанию есть; `showCloseButton={false}` убирает её (нужен явный выход в разметке или программно).

## Доступность (a11y)

- У открытой панели **`Drawer.Content`** — `role="dialog"` и `aria-modal="true"`; задайте **`aria-labelledby`** (ссылка на `id` у `Drawer.Title`) или **`aria-label`**, если заголовок скрыт.
- Фокус ограничивается панелью; фоновая страница получает **`inert`** и **`aria-hidden`** на время открытия.
- Встроенная кнопка закрытия в шапке имеет **`aria-label="Close drawer"`** (английская строка в коде компонента).

## Ограничения и заметки

- **`Drawer.Header`**, **`Drawer.Title`**, **`Drawer.Body`**, **`Drawer.Footer`** должны находиться внутри **`Drawer.Content`** — иначе контекст размера не определён и будет ошибка времени выполнения.
- **`Drawer.Trigger`** и **`Drawer.Close`** ожидают **ровно одного** React-потомка с поддержкой `onClick` (часто `Button.Root` или `LinkButton.Root`).
- Панель не управляет маршрутизацией: при открытии «по URL» состояние нужно поднимать в родителе (`open` / `onOpenChange`).
- Визуальная ширина/высота боковых и верхних/нижних листов задаётся CSS модуля компонента, а не отдельным пропом `width`.

## Связанные компоненты

- **Button** — триггеры, действия в подвале и встроенное закрытие в шапке.
- **LinkButton** — открытие панели с элемента, стилизованного как ссылка.
- **Input**, **Checkbox** — типичное содержимое `Drawer.Body` для форм и фильтров.
- **Modal** — когда нужен центрированный диалог фиксированной ширины, а не выезд с края экрана.
