# ButtonGroup

## Что это

Составной контрол из нескольких сегментов-кнопок в одной обводке: общий размер, стыковка границ и скругления только с внешних углов.

## Для чего нужен

- **Аналитика и отчёты** — переключить интервал агрегации (день / неделя / месяц) одним визуальным блоком без выпадающего списка.
- **Редакторы и тулбары** — сгруппировать форматирование или вид (иконки и подписи) так, чтобы инструменты читались как единый блок.
- **Оплата и тарифы** — выбрать план в строке карточки: сегменты на всю ширину колонки с явным «выбранным» состоянием.

## Юзкейсы

Сценарии ниже различаются экраном и составом API; не дублируйте одну и ту же форму с другими подписями.

### Базовый

Фильтр каталога: три взаимоисключающие опции «Все / В наличии / Под заказ» — пользователь видит группу как один контроль.

```tsx
import { ButtonGroup } from "prime-ui-kit";

export function StockFilterStrip() {
  return (
    <ButtonGroup.Root aria-label="Наличие товара" size="m">
      <ButtonGroup.Item type="button">Все</ButtonGroup.Item>
      <ButtonGroup.Item pressed type="button">
        В наличии
      </ButtonGroup.Item>
      <ButtonGroup.Item type="button">Под заказ</ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
```

### С вариантами/размерами

Компактная панель на мобильном и просторная на десктопе: меняется только `size`; плюс вертикальный столбец для узкой колонки настроек.

```tsx
import { ButtonGroup } from "prime-ui-kit";

export function DensityPreview() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
      <ButtonGroup.Root aria-label="Сортировка, размер s" size="s">
        <ButtonGroup.Item pressed type="button">
          По дате
        </ButtonGroup.Item>
        <ButtonGroup.Item type="button">По цене</ButtonGroup.Item>
        <ButtonGroup.Item type="button">По рейтингу</ButtonGroup.Item>
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Приоритет задач, вертикально" orientation="vertical" size="l">
        <ButtonGroup.Item pressed type="button">
          Срочно
        </ButtonGroup.Item>
        <ButtonGroup.Item type="button">Обычно</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Низкий</ButtonGroup.Item>
      </ButtonGroup.Root>
    </div>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Короткая форма поиска: сегменты отправляют и сбрасывают форму нативными типами кнопки.

```tsx
import { ButtonGroup } from "prime-ui-kit";

export function SearchMiniForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}
    >
      <label htmlFor="q">Запрос</label>
      <input id="q" name="q" type="search" />
      <ButtonGroup.Root aria-label="Действия поиска" size="m">
        <ButtonGroup.Item type="submit">Найти</ButtonGroup.Item>
        <ButtonGroup.Item type="reset">Сбросить</ButtonGroup.Item>
      </ButtonGroup.Root>
    </form>
  );
}
```

### Контролируемый режим

Вкладки-переключатели раздела документации: родитель хранит ключ раздела, на активном сегменте `pressed`.

```tsx
import * as React from "react";
import { ButtonGroup } from "prime-ui-kit";

type SectionKey = "overview" | "api" | "examples";

export function DocsSectionSwitch() {
  const [section, setSection] = React.useState<SectionKey>("overview");

  return (
    <ButtonGroup.Root aria-label="Раздел справки" size="m">
      <ButtonGroup.Item pressed={section === "overview"} type="button" onClick={() => setSection("overview")}>
        Обзор
      </ButtonGroup.Item>
      <ButtonGroup.Item pressed={section === "api"} type="button" onClick={() => setSection("api")}>
        API
      </ButtonGroup.Item>
      <ButtonGroup.Item
        pressed={section === "examples"}
        type="button"
        onClick={() => setSection("examples")}
      >
        Примеры
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
```

## Анатомия

- **`ButtonGroup.Root`** — `div` с `data-size`, при вертикали — `data-orientation="vertical"`; внутри **`ButtonGroupProvider`**, **`ControlSizeProvider`** (размер наследуют вложенные контролы).
- **`ButtonGroup.Item`** — нативная **`button`** с классом сегмента; обязан вызываться внутри корня (контекст).
- **`ButtonGroup.Icon`** — **`span`** с `aria-hidden` для SVG внутри сегмента.

Публичный API: объект **`ButtonGroup`** с полями **`Root`**, **`Item`**, **`Icon`**.

## API

### ButtonGroup.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| orientation | `"horizontal" \| "vertical"` | `"horizontal"` | нет | Направление flex-раскладки сегментов. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | нет | Высота, радиус, кегль и размер иконки из одного яруса токенов группы. |
| children | `React.ReactNode` | — | да | Содержимое группы (обычно несколько `Item`). |
| className | `string` | — | нет | Дополнительный класс корня. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | нет | Остальные атрибуты обёртки (`aria-label`, `role`, обработчики и т.д.). |

### ButtonGroup.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| pressed | `boolean` | — | нет | Выбранный сегмент: `data-state="on"`; при переданном boolean — `aria-pressed`. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | нет | Поведение в форме. |
| disabled | `boolean` | — | нет | Блокировка клика и стиль неактивности. |
| children | `React.ReactNode` | — | нет | Текст, `Icon` и др. |
| className | `string` | — | нет | Дополнительный класс сегмента. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | нет | Остальные атрибуты кнопки. |

### ButtonGroup.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | да | Обычно иконка (SVG). |
| className | `string` | — | нет | Дополнительный класс обёртки. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | нет | Прочие атрибуты `span`. |

## Варианты

Отдельного пропа `variant` нет: у группы один визуальный стиль «сегменты с общей рамкой». Различия достигаются **`size`**, **`orientation`**, **`pressed`** и **`disabled`** на сегментах.

## Состояния

- **Обычный сегмент** — без `pressed` и без `disabled`.
- **Выбранный** — `pressed={true}`: фон и цвет текста как у активного; `aria-pressed="true"`.
- **Не выбран при явном boolean** — `pressed={false}`: `aria-pressed="false"`.
- **Отключённый** — `disabled`: курсор `not-allowed`, сниженная непрозрачность, hover не меняет фон.

## Доступность (a11y)

- На **`Root`** задавайте **`aria-label`** (или **`aria-labelledby`**, если рядом видимый заголовок), чтобы группа читалась как единый переключатель или набор действий.
- Для сегментов только с иконкой используйте **`aria-label`** на **`Item`**; **`ButtonGroup.Icon`** помечен **`aria-hidden`**, текстовой дублирующей подписи внутри иконки нет.
- При использовании как переключателя одного значения синхронизируйте **`pressed`** с логикой и не оставляйте несколько сегментов с `pressed` без намерения.

## Ограничения и заметки

- Нет **`asChild`**: сегмент всегда рендерится как **`<button>`**.
- Нет встроенного **`fullWidth`**: растягивание — через **`className`** на корне (например ширина контейнера) и **`flex-1`** / **`min-w-0`** на сегментах.
- Взаимоисключающий выбор из нескольких сегментов реализует родитель (состояние + **`onClick`**); компонент не ведёт собственной «группы радио».
- **`Item`** вне **`Root`** вызовет ошибку контекста.

## Связанные компоненты

- **`Button`** — одиночное действие с вариантами заливки и режимом загрузки; не заменяет сегментированную группу.
- **`SegmentedControl`** — если нужен паттерн переключателя с иным API и разметкой кита.
- **`Radio`** или нативный **`radio`** — когда важна семантика «один из N» для форм и отправки значения поля.
</think>


<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
StrReplace