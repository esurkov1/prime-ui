# Avatar

## Что это

Составной компонент круглого аватара: фотография (`Avatar.Image`), запасной слой (`Avatar.Fallback`) и опциональная группа с наложением (`Avatar.Group`).

## Для чего нужен

- **Профили и совместная работа** — узнаваемое лицо в шапке чата, карточке коллеги или списке участников звонка, когда важно быстро сопоставить человека с действием.
- **Торговые и сервисные сценарии** — визуальная привязка заказа, доставки или обращения к конкретному менеджеру или курьеру без длинных подписей.
- **Администрирование и каталоги** — компактное представление учётной записи в таблицах, фильтрах и журналах аудита, где рядом идут имя, роль и статус.

## Юзкейсы

Каждый пример рассчитан на другой тип экрана и набор пропсов.

### Базовый

Портрет с подстраховкой инициалами: пока грузится фото, виден fallback; после успешной загрузки скрывается от скринридеров через `aria-hidden`.

```tsx
import { Avatar } from "prime-ui-kit";

export function UserAvatar({ photoUrl, initials }: { photoUrl: string; initials: string }) {
  return (
    <Avatar.Root size="l" aria-label="Аватар пользователя">
      <Avatar.Image src={photoUrl} alt="" />
      <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar.Root>
  );
}
```

### С вариантами/размерами

Лендинг команды: одинаковая структура, разные `size` для акцентов (крупный руководитель, мелче остальные).

```tsx
import { Avatar, type AvatarSize } from "prime-ui-kit";

const team: { name: string; src: string; size: AvatarSize }[] = [
  { name: "Руководитель", src: "/photos/lead.jpg", size: "3xl" },
  { name: "Аналитик", src: "/photos/analyst.jpg", size: "xl" },
  { name: "Дизайнер", src: "/photos/designer.jpg", size: "l" },
];

export function TeamRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {team.map((m) => (
        <Avatar.Root key={m.name} size={m.size} aria-label={m.name}>
          <Avatar.Image src={m.src} alt="" />
          <Avatar.Fallback>{m.name.slice(0, 2)}</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  );
}
```

### В контексте (панель участников)

Горизонтальная «стопка» с перекрытием и счётчик скрытых людей — типично для панели созвона или совместного редактирования.

```tsx
import { Avatar } from "prime-ui-kit";

export function CallParticipantsBar(props: {
  visible: { id: string; src?: string; initials: string }[];
  extraCount: number;
}) {
  return (
    <Avatar.Group.Root size="m" aria-label={`Участники, ещё ${props.extraCount}`}>
      {props.visible.map((p) => (
        <Avatar.Root key={p.id}>
          {p.src ? <Avatar.Image src={p.src} alt="" /> : null}
          <Avatar.Fallback>{p.initials}</Avatar.Fallback>
        </Avatar.Root>
      ))}
      {props.extraCount > 0 ? (
        <Avatar.Group.Overflow aria-label={`Ещё участников: ${props.extraCount}`}>
          +{props.extraCount}
        </Avatar.Group.Overflow>
      ) : null}
    </Avatar.Group.Root>
  );
}
```

### Смена изображения из состояния родителя

Список с выбором строки: URL портрета приходит из состояния. Компонент сбрасывает внутренний цикл загрузки при смене `src` (внутри реализации используется ключ по `src`).

```tsx
import * as React from "react";
import { Avatar } from "prime-ui-kit";

export function InspectorAvatar(props: { candidates: { id: string; photo: string }[] }) {
  const [activeId, setActiveId] = React.useState(props.candidates[0]?.id);
  const active = props.candidates.find((c) => c.id === activeId);

  if (!active) return null;

  return (
    <aside>
      <label>
        Запись
        <select value={activeId} onChange={(e) => setActiveId(e.target.value)}>
          {props.candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}
            </option>
          ))}
        </select>
      </label>
      <Avatar.Root size="xl">
        <Avatar.Image src={active.photo} alt="" />
        <Avatar.Fallback>?</Avatar.Fallback>
      </Avatar.Root>
    </aside>
  );
}
```

## Анатомия

- **`Avatar.Root`** — `div` с `data-size`, контекст со статусом изображения (`idle` | `loading` | `loaded` | `error`).
- **`Avatar.Image`** — `img` с `data-status` (`loading` | `loaded` | `error`), позиционируется поверх fallback.
- **`Avatar.Fallback`** — `span` под картинкой; при `imageStatus === "loaded"` получает `aria-hidden`.
- **`Avatar.Group.Root`** — `div` с flex-рядом; дочерним `Avatar.Root` и `Avatar.Group.Overflow` без собственного `size` подставляется `size` группы.
- **`Avatar.Group.Overflow`** — `div` с тем же визуальным размером, что аватар выбранного `size`.

## API

### Avatar.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| size | `"s" \| "m" \| "l" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "5xl" \| "6xl"` | `"m"` | Нет | Диаметр, радиус и кегль fallback |
| children | `React.ReactNode` | — | Нет | Обычно `Avatar.Image` и `Avatar.Fallback` |
| className | `string` | — | Нет | Дополнительный класс |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты корня |

### Avatar.Image

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| src | `string` | — | Да | URL; при смене монтирование заново |
| alt | `string` | `""` | Нет | Альтернативный текст |
| className | `string` | — | Нет | Класс на `img` |
| …rest | `Omit<ImgHTMLAttributes, "src" \| "alt">` | — | Нет | `loading`, `decoding`, обработчики и т.д. |

### Avatar.Fallback

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| children | `React.ReactNode` | — | Нет | Текст, иконка или плейсхолдер |
| className | `string` | — | Нет | Класс на `span` |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Прочие атрибуты |

### Avatar.Group.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| size | см. Avatar.Root | `"m"` | Нет | Размер для детей без своего `size` |
| children | `React.ReactNode` | — | Нет | Аватары и опционально `Overflow` |
| className | `string` | — | Нет | Класс контейнера |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты |

### Avatar.Group.Overflow

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|-------------|-------------|----------|
| size | см. Avatar.Root | `"m"` | Нет | Локальный размер, если не задан группой |
| children | `React.ReactNode` | — | Нет | Например `+3` |
| className | `string` | — | Нет | Класс ячейки |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты |

## Варианты

Отдельного пропа `variant` нет. Визуальное различие задаётся только **`size`** (девять ступеней от `s` до `6xl`) и содержимым **`Fallback`** (текст, иконка, символ).

## Состояния

Статус изображения в контексте корня:

| Статус | Когда | Поведение |
|--------|--------|-----------|
| `idle` | Нет `Avatar.Image` или до эффекта | Fallback видим, без `aria-hidden` на fallback |
| `loading` | После монтирования `Image`, до `onLoad` / `onError` | Картинка с `data-status="loading"` скрыта по стилям (opacity 0) |
| `loaded` | Успешный `onLoad` | Картинка видима; `Avatar.Fallback` с `aria-hidden` |
| `error` | `onError` | Картинка скрыта (`display: none` в стилях); снова виден fallback |

Пользовательского пропа `disabled` у аватара нет — при необходимости неактивность оформляют на уровне родителя (кнопка, ссылка, opacity).

## Доступность (a11y)

- Осмысленный контекст задавайте на **`Avatar.Root`** или обёртке: `aria-label`, `aria-labelledby`, или соседний видимый текст.
- Для **`Avatar.Image`** указывайте осмысленный **`alt`**, если аватар несёт смысл; декоративные дубликаты имени можно оставить с пустым `alt`.
- После загрузки фото **`Avatar.Fallback`** помечается **`aria-hidden`**, чтобы дубли не озвучивались.
- Для **`Avatar.Group.Root`** и **`Avatar.Group.Overflow`** полезны суммарные подписи (`aria-label`), особенно при счётчике «+N».

## Ограничения и заметки

- Статус загрузки **не вынесен** наружу: нельзя подставить «контролируемый» статус без обходных путей; смена **`src`** — основной способ сбросить состояние.
- **`Avatar.Fallback`** не принимает `src`: картинки только через **`Avatar.Image`**.
- Группа рассчитана на **горизонтальный** ряд; вертикальной компоновки в API нет.
- Вложенность **`Avatar.Root`** внутри другого **`Avatar.Root`** не предусмотрена паттерном.

## Связанные компоненты

- **Button** — кликабельная обёртка, если аватар ведёт в профиль или меню.
- **Dropdown** — триггер с аватаром и списком действий.
- **Typography** — подпись рядом с аватаром (имя, роль).
- **Tooltip** — краткая информация по наведению на аватар.
