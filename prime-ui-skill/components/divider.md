# Divider

## Что это

`Divider` — визуальный разделитель контента: горизонтальная или вертикальная линия, опционально с подписью или иконкой.

## Для чего нужен

- **Личный кабинет и платежи** — отделить блок «способ оплаты» от итогов заказа или истории транзакций без лишней «рамки».
- **Каталог и карточка товара** — визуально разбить длинное описание, характеристики и отзывы, сохраняя единый столбец.
- **Внутренние инструменты** — сгруппировать действия в панели (фильтр | сортировка | экспорт) вертикальными чертами между пунктами.

## Юзкейсы

### Базовый

Самый частый случай: горизонтальная линия между абзацами или сплошная линия без текста.

```tsx
import { Divider } from "prime-ui-kit";

export function OrderSummary() {
  return (
    <section>
      <p>Состав заказа: 3 позиции</p>
      <Divider.Root />
      <p>Доставка: завтра, 10:00–14:00</p>
      <Divider.Root size="m">Итого</Divider.Root>
      <p>12 400 ₽</p>
    </section>
  );
}
```

### С вариантами и размерами

Другой контекст — настройки приложения: секции с подписью в стиле `text` и компактный маркер `line-spacing` между блоками в колонке с `gap`.

```tsx
import { Checkbox, Divider } from "prime-ui-kit";

export function NotificationSettings() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
      <Divider.Root variant="text" size="l">
        Push-уведомления
      </Divider.Root>
      <Checkbox.Root size="m">
        <Checkbox.Label>Новости продукта</Checkbox.Label>
      </Checkbox.Root>
      <Divider.Root variant="line-spacing" size="m" />
      <Checkbox.Root size="m">
        <Checkbox.Label>Напоминания о событиях</Checkbox.Label>
      </Checkbox.Root>
    </div>
  );
}
```

### В контексте (карточка и панель)

Экран документа или статьи: узкая колонка текста и полноширинная линия по краю карточки; отдельно — панель с вертикальными разделителями.

```tsx
import { Divider } from "prime-ui-kit";

export function ArticleCard() {
  return (
    <article style={{ maxWidth: 320, padding: 16, border: "1px solid #e5e5e5", borderRadius: 8 }}>
      <h2 style={{ margin: "0 0 8px" }}>Черновик</h2>
      <p style={{ margin: 0 }}>Текст превью…</p>
      <Divider.Root size="m" style={{ margin: "12px 0" }} />
      <p style={{ margin: 0, fontSize: 14 }}>Обновлено сегодня</p>
    </article>
  );
}

export function EditorToolbar() {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 8, height: 40 }}>
      <span style={{ alignSelf: "center" }}>Жирный</span>
      <Divider.Root orientation="vertical" size="m" />
      <span style={{ alignSelf: "center" }}>Курсив</span>
      <Divider.Root orientation="vertical" size="m" />
      <span style={{ alignSelf: "center" }}>Ссылка</span>
    </div>
  );
}
```

### Подпись с иконкой и декоративная линия

Раздел «Контакты» с иконкой в подписи; отдельно — линия только для сетки макета, скрытая от вспомогательных технологий.

```tsx
import { Divider } from "prime-ui-kit";

function MailIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
    </svg>
  );
}

export function ProfileContacts() {
  return (
    <>
      <Divider.Root variant="text" size="m">
        <MailIcon /> Связаться
      </Divider.Root>
      <Divider.Root size="m" role="presentation" aria-hidden />
    </>
  );
}
```

## Анатомия

Плоский API: **`Divider.Root`** рендерит один `div` с псевдоэлементами `::before` и `::after` (линии). При наличии `children` внутрь попадает `span` с классом контента; для `children` включается `ControlSizeProvider` с тем же `size`, что у корня.

## API

### Divider.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| orientation | `"horizontal"` \| `"vertical"` | `"horizontal"` | Нет | Горизонтальная линия на ширину ряда или вертикальная между соседями. |
| align | `"start"` \| `"center"` \| `"end"` | `center` для `variant="default"`, `start` для `variant="text"` | Нет | Длина отрезка линии слева/справа от подписи. |
| variant | `"default"` \| `"line-spacing"` \| `"text"` | `"default"` | Нет | Режим оформления и участие в раскладке flex-колонки (`line-spacing`). |
| size | `"s"` \| `"m"` \| `"l"` \| `"xl"` | `"m"` | Нет | Токены зазора, типографики подписи и размера иконки в контенте. |
| children | `React.ReactNode` | — | Нет | Подпись, иконка+текст или отсутствует (сплошная линия). |
| className | `string` | — | Нет | Дополнительный класс корня. |
| role | `string` | `"separator"` | Нет | Семантика элемента; для декора часто `presentation`. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | В т.ч. `aria-*`, `data-*`, обработчики. |

## Варианты

- **`default`** — линия с опциональной подписью по центру (или пустая линия на всю ширину ряда).
- **`line-spacing`** — не растягивается в flex-колонке; ритм между блоками задаёт `gap` у родителя, сам разделитель — визуальный штрих между ними.
- **`text`** — подпись в стиле заголовка секции (верхний регистр, приглушённый цвет); по умолчанию `align="start"`.

## Состояния

Интерактивных состояний (`disabled`, `loading` и т.п.) нет: компонент декоративный. Поведение можно дополнить через стандартные HTML-атрибуты корня (например `aria-hidden` вместе со сменой `role`).

## Доступность (a11y)

- По умолчанию **`role="separator"`**; для **`orientation="vertical"`** добавляется **`aria-orientation="vertical"`**.
- Если линия не несёт смысла для скринридеров, задайте **`role="presentation"`** (или **`none`**) и **`aria-hidden`**, чтобы не дублировать структуру, которую уже передаёт текст рядом.
- Вертикальный разделитель в панели не фокусируется сам по себе; фокус остаётся на соседних кнопках или ссылках.

## Ограничения и заметки

- Не заменяет семантические границы документа (`section`/`hr` по смыслу): при необходимости сочетайте с правильной разметкой страницы.
- Вертикальный режим требует **ограниченной высоты** у flex-родителя (`align-items: stretch`), иначе линия не будет видна.
- Визуальный «номинальный» размер в CSS на ступень ниже переданного `data-size` (комментарий в стилях компонента) — учитывайте при согласовании с соседними контролами.

## Связанные компоненты

- **Typography** — основной текст рядом с подписью разделителя.
- **Button** / **Link button** — пункты панели, между которыми ставят вертикальный `Divider`.
- **Tabs**, **Accordion** — альтернативы, когда нужна не линия, а переключаемая структура разделов.
