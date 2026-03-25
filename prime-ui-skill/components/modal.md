# Modal

## Что это

Модальное окно поверх страницы: панель в портале с затемнённым фоном, блокировкой прокрутки и удержанием фокуса внутри диалога до закрытия.

## Для чего нужен

- **Безопасность и необратимые действия** — явное подтверждение удаления аккаунта, сброса настроек или остановки платной подписки без случайного клика по фону.
- **Оформление заказа и оплата** — короткий шаг с итогом суммы и выбором способа оплаты поверх каталога, не уводя пользователя с контекста покупки.
- **Онбординг и подсказки** — первый запуск продукта, тур по ключевым кнопкам или предупреждение о режиме обслуживания с одной понятной кнопкой «Понятно».
- **Админка и справочники** — быстрое редактирование одной записи (имя, роль, лимит) во всплывающей форме без перехода на отдельный экран.
- **Медиа и детали объекта** — просмотр увеличенного превью, подписи к файлу или метаданных выпуска в отдельном слое поверх галереи.
- **Юридические и согласия** — показ сжатого текста оферты, политики cookies или согласия на рассылку с фиксацией явного действия пользователя.

## Юзкейсы

Импорт из пакета `prime-ui-kit`. Примеры разделены по смыслу экрана и комбинации API.

### Структура и короткие комбинации

Рекомендуемая структура `Modal.Content`: обязательный `Modal.Header`, опциональные `Modal.Body` и `Modal.Footer`.

```tsx
import { Button, Icon, Modal } from "prime-ui-kit";

export function ModalStructureExamples() {
  return (
    <>
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Только шапка и футер
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content aria-labelledby="m-struct-header-footer-title">
              <Modal.Header>
                <Modal.Title id="m-struct-header-footer-title">Подтверждение без контента</Modal.Title>
                <Modal.Description>Подходит для короткого вопроса с явным выбором.</Modal.Description>
                <Modal.Close>
                  <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                    <Button.Icon>
                      <Icon name="action.close" tone="subtle" />
                    </Button.Icon>
                  </Button.Root>
                </Modal.Close>
              </Modal.Header>
              <Modal.Footer>
                <Modal.Close>
                  <Button.Root size="m" variant="neutral" mode="stroke">
                    Отмена
                  </Button.Root>
                </Modal.Close>
                <Button.Root size="m" variant="primary">
                  Подтвердить
                </Button.Root>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Шапка и контент без футера
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content aria-labelledby="m-struct-header-body-title">
              <Modal.Header icon={<Icon name="nav.itemDot" />}>
                <Modal.Title id="m-struct-header-body-title">Информационное окно</Modal.Title>
                <Modal.Close>
                  <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                    <Button.Icon>
                      <Icon name="action.close" tone="subtle" />
                    </Button.Icon>
                  </Button.Root>
                </Modal.Close>
              </Modal.Header>
              <Modal.Body>
                <p style={{ margin: 0 }}>
                  Футер не обязателен, если нет отдельного блока с кнопками действий.
                </p>
              </Modal.Body>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Только шапка (полный блок)
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content aria-labelledby="m-struct-header-only-title">
              <Modal.Header>
                <Modal.Title id="m-struct-header-only-title">Короткое уведомление</Modal.Title>
                <Modal.Description>
                  Полный блок шапки: заголовок и описание, без контента и футера.
                </Modal.Description>
                <Modal.Close>
                  <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                    <Button.Icon>
                      <Icon name="action.close" tone="subtle" />
                    </Button.Icon>
                  </Button.Root>
                </Modal.Close>
              </Modal.Header>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>
    </>
  );
}
```

### Базовый

Подтверждение удаления черновика: заголовок, описание, закрытие из шапки.

```tsx
import { Button, Icon, Modal } from "prime-ui-kit";

export function DeleteDraftConfirm() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="error" mode="lighter">
          Удалить черновик
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="del-draft-title" aria-describedby="del-draft-desc">
            <Modal.Header icon={<Icon name="status.locked" />}>
              <Modal.Title id="del-draft-title">Удалить черновик?</Modal.Title>
              <Modal.Description id="del-draft-desc">
                Восстановить запись будет нельзя. Действие затронет только этот документ.
              </Modal.Description>
              <Modal.Close>
                <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                  <Button.Icon>
                    <Icon name="action.close" tone="subtle" />
                  </Button.Icon>
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Отмена
                </Button.Root>
              </Modal.Close>
              <Modal.Close>
                <Button.Root size="m" variant="error">
                  Удалить
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### С вариантами/размерами

Публичное объявление на киоске: крупная оболочка `size="xl"` для дальней дистанции и заметного заголовка.

```tsx
import { Button, Icon, Modal } from "prime-ui-kit";

export function KioskAnnouncement() {
  return (
    <Modal.Root size="xl" defaultOpen>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="kiosk-title">
            <Modal.Header icon={<Icon name="nav.layoutGrid" />}>
              <Modal.Title id="kiosk-title">Сегодня сокращённый день</Modal.Title>
              <Modal.Description>Кассы работают до 16:00. Заранее спасибо за понимание.</Modal.Description>
              <Modal.Close>
                <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                  <Button.Icon>
                    <Icon name="action.close" tone="subtle" />
                  </Button.Icon>
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Body>
              <p style={{ margin: 0 }}>Плановое обновление оборудования завершится к открытию завтра.</p>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="l" variant="primary">
                  Ознакомился
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Заявка в службу поддержки: поле ввода в `Modal.Body`, подпись через `Input` кита, действия в подвале.

```tsx
import { Button, Icon, Input, Modal } from "prime-ui-kit";

export function SupportTicketModal() {
  return (
    <Modal.Root size="m">
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Написать в поддержку
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="ticket-title">
            <Modal.Header icon={<Icon name="field.email" />}>
              <Modal.Title id="ticket-title">Новое обращение</Modal.Title>
              <Modal.Description>Кратко опишите проблему — ответ придёт на почту из профиля.</Modal.Description>
              <Modal.Close>
                <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                  <Button.Icon>
                    <Icon name="action.close" tone="subtle" />
                  </Button.Icon>
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Body>
              <Input.Root label="Тема" size="m">
                <Input.Wrapper>
                  <Input.Field placeholder="Не работает экспорт отчёта" />
                </Input.Wrapper>
              </Input.Root>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Отмена
                </Button.Root>
              </Modal.Close>
              <Modal.Close>
                <Button.Root size="m" variant="primary" onClick={() => console.log("ticket")}>
                  Отправить
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### Без иконки

Простое подтверждение без иконки в шапке: только заголовок, описание и кнопка закрытия.

```tsx
import { Button, Icon, Modal } from "prime-ui-kit";

export function SimpleConfirmModal() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Сохранить изменения
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="simple-title">
            <Modal.Header>
              <Modal.Title id="simple-title">Подтвердите действие</Modal.Title>
              <Modal.Description>Изменения будут применены ко всем выбранным элементам.</Modal.Description>
              <Modal.Close>
                <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                  <Button.Icon>
                    <Icon name="action.close" tone="subtle" />
                  </Button.Icon>
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Отмена
                </Button.Root>
              </Modal.Close>
              <Modal.Close>
                <Button.Root size="m" variant="primary">
                  Подтвердить
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### Контролируемый режим

Мастер из трёх шагов: родитель держит `open` и открывает второй шаг программно после проверки данных.

```tsx
import { useState } from "react";
import { Button, Icon, Modal } from "prime-ui-kit";

export function WizardStepModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <>
      <Button.Root
        size="m"
        variant="primary"
        onClick={() => {
          setStep(1);
          setOpen(true);
        }}
      >
        Продолжить настройку
      </Button.Root>

      <Modal.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setStep(1);
        }}
      >
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content aria-labelledby={`wiz-${step}-title`}>
              <Modal.Header icon={<Icon name="action.copy" />}>
                <Modal.Title id={`wiz-${step}-title`}>Шаг {step} из 2</Modal.Title>
                <Modal.Description>
                  {step === 1 ? "Проверьте контакты." : "Подтвердите завершение."}
                </Modal.Description>
                <Modal.Close>
                  <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                    <Button.Icon>
                      <Icon name="action.close" tone="subtle" />
                    </Button.Icon>
                  </Button.Root>
                </Modal.Close>
              </Modal.Header>
              <Modal.Body>
                {step === 1 ? <p style={{ margin: 0 }}>Данные профиля проверены.</p> : <p style={{ margin: 0 }}>Настройки будут сохранены.</p>}
              </Modal.Body>
              <Modal.Footer>
                {step === 1 ? (
                  <Button.Root size="m" variant="primary" onClick={() => setStep(2)}>
                    Далее
                  </Button.Root>
                ) : (
                  <Modal.Close>
                    <Button.Root size="m" variant="primary" onClick={() => setOpen(false)}>
                      Готово
                    </Button.Root>
                  </Modal.Close>
                )}
              </Modal.Footer>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>
    </>
  );
}
```

## Анатомия

Объектный API `Modal`:

`Root` задаёт контекст открытости и политику закрытия.

Типичная разметка:

`Root` → опционально `Trigger` → `Portal` → `Overlay` → `Content`.

Внутри `Content`:

- `Header` (опционально `icon`) → `Title`, `Description`, `Close` с кнопкой;
- `Body` — опциональный основной контент;
- `Footer` — опциональный ряд действий.

`Portal` ничего не рендерит, пока модал закрыт. `Overlay` — подложка на весь вьюпорт; `Content` — панель `role="dialog"` с ловушкой фокуса.

## API

### Modal.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `open` | `boolean` | — | Нет | Контролируемое открытие; вместе с `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Нет | Начальное состояние без `open`. |
| `onOpenChange` | `(open: boolean) => void` | — | Нет | Смена открытости (триггер, закрытие, программно). |
| `closeOnEscape` | `boolean` | `true` | Нет | Закрытие по Escape, пока диалог открыт. |
| `closeOnOverlayClick` | `boolean` | `true` | Нет | Закрытие по клику на подложку, если цель клика — сам оверлей. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Масштаб панели, отступов оверлея и ярус `ControlSizeProvider` внутри `Content`. |
| `children` | `React.ReactNode` | — | Нет | Триггер, портал и остальная разметка. |

### Modal.Trigger

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `children` | `React.ReactElement<{ onClick?: … }>` | — | Да | Ровно один элемент; к нему добавляется открытие по клику после существующего `onClick`. |

### Modal.Close

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `children` | `React.ReactElement<{ onClick?: …; className?: string; size?: ButtonSize }>` | — | Да | Один элемент; по клику закрывает модал. Внутри `Header` для `Button.Root` без `size` подставляется `size` оболочки. |

### Modal.Portal

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `children` | `React.ReactNode` | — | Нет | Содержимое портала; не монтируется при закрытом модале. |
| `container` | `HTMLElement \| null` | `document.body` | Нет | Узел для портала. |

### Modal.Overlay

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Дополнительный класс подложки. |
| `onClick` | `React.MouseEventHandler<HTMLDivElement>` | — | Нет | Вызывается до логики закрытия по клику. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | `role="presentation"`, `data-size` от контекста; остальные атрибуты корневого `div`. |

### Modal.Content

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `aria-label` | `string` | — | Нет | Имя диалога без видимого заголовка (сочетать с рекомендациями a11y). |
| `aria-labelledby` | `string` | — | Нет | `id` элемента с названием (часто `Modal.Title`). |
| `aria-describedby` | `string` | — | Нет | `id` описания (часто `Modal.Description`). |
| `className` | `string` | — | Нет | Класс панели. |
| `children` | `React.ReactNode` | — | Нет | Шапка, тело, подвал; внутри — `ControlSizeProvider`. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | `role="dialog"`, `aria-modal`, `tabIndex={-1}`, ловушка фокуса, блокировка скролла, Escape через контекст. |

### Modal.Header

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `icon` | `React.ReactNode` | — | Нет | Иконка слева от текстовой колонки. |
| `className` | `string` | — | Нет | Класс `header`. |
| `children` | `React.ReactNode` | — | Нет | Обычно заголовок, описание, `Close`. |
| … | `React.HTMLAttributes<HTMLElement>` | — | Нет | Корень `<header>`. |

### Modal.Title

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Класс заголовка. |
| `children` | `React.ReactNode` | — | Нет | Текст; задайте `id` для `aria-labelledby` на `Content`. |
| … | `React.HTMLAttributes<HTMLHeadingElement>` | — | Нет | Рендер `<h2>`. |

### Modal.Description

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Класс описания. |
| `children` | `React.ReactNode` | — | Нет | Вторичный текст под заголовком. |
| … | `React.HTMLAttributes<HTMLParagraphElement>` | — | Нет | Рендер `<p>`. |

### Modal.Body

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Класс области контента. |
| `children` | `React.ReactNode` | — | Нет | Основное содержимое. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Корневой `div`. |

### Modal.Footer

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `className` | `string` | — | Нет | Класс подвала. |
| `children` | `React.ReactNode` | — | Нет | Кнопки действий. |
| … | `React.HTMLAttributes<HTMLElement>` | — | Нет | Рендер `<footer>`. |

## Варианты

Отдельного пропа `variant` у модала нет: визуальный масштаб задаётся **`size` на `Modal.Root`** (`s`, `m`, `l`, `xl`) — ширина панели, отступы затемнения, сетка шапки и размер кнопки закрытия в шапке (если у `Button` в `Modal.Close` не указан свой `size`). Семантику кнопок (основная, нейтральная, ошибка) задают компоненты `Button` внутри модала.

## Состояния

- **Открыт / закрыт** — `open` / `defaultOpen` / `onOpenChange` на `Root`; при закрытом `Portal` не рендерит детей.
- **Закрытие по Escape** — `closeOnEscape` (по умолчанию `true`); при `false` выход только явными контролами.
- **Закрытие по клику на фон** — `closeOnOverlayClick` (по умолчанию `true`); срабатывает только если клик пришёл на сам оверлей, а не на панель.
- **Фокус и фон** — при открытом модале страница под порталом получает `inert` и `aria-hidden`; у `Content` ловушка таба и `tabIndex={-1}` для программного фокуса.

## Доступность (a11y)

- Панель — `role="dialog"`, `aria-modal="true"`. Задавайте **`aria-labelledby`** (на `id` у `Modal.Title`) и при необходимости **`aria-describedby`** на описание; если заголовка нет, используйте **`aria-label`** на `Content`.
- Клавиша **Escape** закрывает диалог, если не отключено `closeOnEscape`.
- Фокус остаётся внутри содержимого `Content` при открытом модале.
- Кнопка закрытия в шапке должна иметь доступное имя (`aria-label` или видимый текст).

## Ограничения и заметки

- **Нет встроенного `asChild`:** `Trigger` и `Close` ожидают **ровно один** дочерний React-элемент и дописывают ему `onClick` через `cloneElement`.
- В **`Modal.Close`** внутри **`Modal.Header`** для потомка с `displayName === "ButtonRoot"` без `size` подставляется размер оболочки; вне шапки такого подмешивания нет.
- Длинный контент: ограничивайте высоту **`Modal.Body`** (или классом) и включайте **`overflow`**, чтобы прокрутка шла внутри панели при заблокированном фоне.
- Проп **`container`** у **`Modal.Portal`** задаёт узел монтирования вместо `document.body` (тесты, особые контексты наложения); подложка по-прежнему с `position: fixed` относительно окна, если предки не меняют контекст позиционирования.
- Кнопки на всю ширину панели — через **`fullWidth`** у **`Button.Root`** или вёрстку подвала; отдельного пропа у модала нет.
- Вложенные модалы в одном дереве потребуют отдельной проработки порядка фокуса и порталов — компонент рассчитан на один диалог на `Root`.

## Связанные компоненты

- **Button** — триггер, закрытие и действия в подвале.
- **LinkButton** — текстовая ссылка как триггер открытия (с `preventDefault` на `href="#"` при демо).
- **Input**, **Label**, **Hint** — поля внутри `Modal.Body`.
- **Drawer** — боковая панель вместо центрированного диалога, когда контент длинный или контекст — список/фильтры.
- **Popover** — лёгкое всплывающее окно без полной модальной семантики и блокировки страницы.
