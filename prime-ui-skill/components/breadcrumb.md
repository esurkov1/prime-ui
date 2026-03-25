# Breadcrumb

## Что это

Составной компонент «хлебных крошек»: навигация `nav` со списком `ol`, пункты-ссылки или текст текущей страницы, опциональные разделители и многоточие для длинного пути.

## Для чего нужен

- **Витрина и каталог** — показать путь «главная → категория → подкатегория → товар» и быстро подняться на уровень выше.
- **Личный кабинет и операционные экраны** — ориентир в разделах вроде «заказы → карточка заказа» без поиска по меню.
- **База знаний и документация** — длинные ветки разделов с возможностью сократить середину пути через многоточие.

## Юзкейсы

Каждый пример самодостаточен; сценарии не повторяют одну и ту же задачу.

### Базовый

Типичная цепочка: все родители кликабельны, последний пункт — текущая страница.

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function OrderBreadcrumb() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/orders">Заказы</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Заказ № 1042</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

### С размерами

Тот же паттерн навигации в компактной шапке отчёта: весь блок масштабируется через `size`.

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function ReportHeaderBreadcrumb() {
  return (
    <Breadcrumb.Root size="s">
      <Breadcrumb.Item href="/analytics">Аналитика</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/analytics/2025">2025</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Квартал 1</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

### В контексте узкой колонки

Обучающий портал: средний уровень без ссылки (только заголовок модуля), урок — текущая страница. В узкой колонке элементы переносятся за счёт `flex-wrap` у списка.

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function CourseLessonBreadcrumb() {
  return (
    <div style={{ maxWidth: 240 }}>
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/courses">Курсы</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>Модуль 3</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>Введение в тему</Breadcrumb.Item>
      </Breadcrumb.Root>
    </div>
  );
}
```

### Иконка «дом» и свой разделитель

Центр поддержки: первый переход только значком (нужен `aria-label`), между уровнями — слэш вместо шеврона через `children` у `Separator`. Класс `itemHome` задаёт выравнивание иконки в модуле стилей крошек (в репозитории кита — `@/components/breadcrumb/Breadcrumb.module.css`; у себя можно подставить эквивалентный класс).

```tsx
import { Breadcrumb, Icon } from "prime-ui-kit";
import styles from "@/components/breadcrumb/Breadcrumb.module.css";

export function HelpBreadcrumb() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/help" className={styles.itemHome} aria-label="Справка">
        <Icon name="nav.home" tone="default" />
      </Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item href="/help/billing">Оплата</Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item current>Возврат средств</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

### Длинный путь и Ellipsis

Глубокая структура каталога: середина пути свёрнута в `Ellipsis`, видны корень, ближайший родитель и лист.

```tsx
import { Breadcrumb } from "prime-ui-kit";

export function DeepCatalogBreadcrumb() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog">Каталог</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog/furniture/chairs/office">Офисные кресла</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Модель X</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
```

## Анатомия

`Breadcrumb.Root` (`nav` → `ol`) содержит в произвольном порядке:

- `Breadcrumb.Item` — `li` с `LinkButton` (если есть `href`) или `span` (иначе; при `current` — стиль текущей страницы и `aria-current="page"`).
- `Breadcrumb.Separator` — `li` с `aria-hidden`, между пунктами; по умолчанию иконка-шеврон.
- `Breadcrumb.Ellipsis` — `li` с символом многоточия.

`Root` задаёт контекст размера (`BreadcrumbSizeContext` и `ControlSizeProvider`) для ссылок и иконок.

## API

### Breadcrumb.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | да | Узлы `Item`, `Separator`, `Ellipsis` внутри списка |
| className | `string` | — | нет | Дополнительный класс на `nav` |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | нет | Кегль ссылок, текущей страницы, многоточия; размер иконок разделителя и «дом» |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | нет | Прочие атрибуты `nav` (например свой `aria-label` вместо значения по умолчанию) |

### Breadcrumb.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| href | `string` | — | нет | При наличии — ссылка; иначе текстовый `span` |
| current | `boolean` | — | нет | Текущая страница: оформление и `aria-current="page"` |
| children | `React.ReactNode` | — | нет | Подпись или иконка |
| className | `string` | — | нет | Класс на `li` (например `itemHome` из модульных стилей крошек для иконки «дом») |
| aria-label | `string` | — | нет | Нужен для ссылки без видимого текста (icon-only) |

### Breadcrumb.Separator

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | иконка `nav.chevronRight` | нет | Произвольный разделитель между пунктами |
| className | `string` | — | нет | Класс на `li` |

### Breadcrumb.Ellipsis

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | нет | Класс на `li` с символом «…» |

## Варианты

Отдельного пропа `variant` нет. Визуальная иерархия строится за счёт:

- `size` на корне (`s` … `xl`);
- приглушённого цвета ссылок и более контрастного текста текущей страницы (стили модуля);
- кастомных `children` у `Separator` (шеврон, слэш, текст).

## Состояния

- **Ссылка** — `Item` с `href`: интерактивный `LinkButton`, hover/focus из кнопки-ссылки.
- **Текущая страница** — `Item` с `current` без `href`: `span` с `aria-current="page"` и классом текущего пункта.
- **Неактивный сегмент** — `Item` без `href` и без `current`: обычный `span` (например заголовок раздела без URL).

Явных пропов `disabled`, `loading` или `error` у крошек нет.

## Доступность (a11y)

- Корень — `nav` с `aria-label="Breadcrumb"` по умолчанию; при необходимости передайте свой ярлык через атрибуты корня.
- Путь — упорядоченный список `ol` / `li`.
- Текущая позиция помечается `aria-current="page"` на соответствующем пункте.
- Разделители в `Separator` скрыты от дерева доступности (`aria-hidden`).
- Для ссылки только с иконкой задайте осмысленный `aria-label` на `Item`.

## Ограничения и заметки

- Нет режима `asChild` и нет встроенного «контролируемого» состояния — это презентационная разметка пути; данные и переходы задаёт приложение.
- `Ellipsis` не раскрывается и не открывает меню: это статический маркер; полноценное сокращение пути с выпадающим списком нужно собирать отдельно.
- Дополнительные атрибуты на `Item` (кроме перечисленных в API) в компонент не прокидываются — расширение только через правки исходника или обёртки.

## Связанные компоненты

- **LinkButton** — внутри `Item` с `href` для оформления ссылки в стиле кита.
- **Icon** — для шеврона в `Separator` по умолчанию и для icon-only первого пункта.
- **Typography** — если рядом с крошками нужен заголовок страницы или подпись раздела.
