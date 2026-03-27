# EmptyPage

## About

Центрированный блок **пустого состояния**: **`EmptyPage.Icon`** (область под глиф), **`EmptyPage.Title`** (**`<h2>`**), **`EmptyPage.Description`**, **`EmptyPage.Actions`** (ряд кнопок). Ось **`size`** (`s`–`xl`) задаёт иконку, кегль и отступы и пробрасывается в **`ControlSizeProvider`** для дочерних **`Button`**.

- **Используйте** на странице списка, в теле таблицы, в карточке или в **`ScrollContainer`**, когда данных нет и нужен явный призыв к действию.
- **`layout="fill"`** — блок растягивается по высоте **flex**-родителя с заданной **`min-height`** (типично «область таблицы»); **`default`** — компактный блок по содержимому.
- **Не** подменяйте **`Title`** на **`PageContent.Title`** (**`<h1>`**): пустое состояние — регион страницы, заголовок вью остаётся один на маршруте.

## Composition

- **`EmptyPage.Root`** — колонка по центру, **`text-align: center`**; **`size`**, **`layout`** через `data-*`.
- **`EmptyPage.Icon`** — круглая подложка под иконку (передайте **`lucide-react`** или **`Icon`** из кита с **`aria-hidden`** на обёртке или глифе).
- **`EmptyPage.Title`** — **`h2`**; связывайте с **`aria-labelledby`** на корне.
- **`EmptyPage.Description`** — **`p`**, вторичный цвет контента.
- **`EmptyPage.Actions`** — **`flex`**-ряд с **`gap`** по размеру; внутри — **`Button`**, **`ButtonGroup`**, **`LinkButton`**.

### Canonical example

```tsx
import { Search } from "lucide-react";
import { Button, EmptyPage } from "prime-ui-kit";

export function EmptySearchResults() {
  return (
    <EmptyPage.Root aria-labelledby="empty-heading">
      <EmptyPage.Icon aria-hidden>
        <Search strokeWidth={2} aria-hidden />
      </EmptyPage.Icon>
      <EmptyPage.Title id="empty-heading">Ничего не найдено</EmptyPage.Title>
      <EmptyPage.Description>
        Измените фильтры или сбросьте поиск — тогда мы снова покажем результаты.
      </EmptyPage.Description>
      <EmptyPage.Actions>
        <Button.Root type="button" variant="primary">
          Сбросить фильтры
        </Button.Root>
      </EmptyPage.Actions>
    </EmptyPage.Root>
  );
}
```

### Пустое состояние в области таблицы

Родитель с **`min-height`** (и обычно рамкой области данных) + **`layout="fill"`** — контент визуально по центру «подложки».

```tsx
import { PackagePlus } from "lucide-react";
import { Button, EmptyPage } from "prime-ui-kit";

export function OrdersTableEmpty() {
  return (
    <div className="ordersTableBodyRegion">
      <EmptyPage.Root layout="fill" aria-labelledby="empty-table-heading">
        <EmptyPage.Icon aria-hidden>
          <PackagePlus strokeWidth={2} aria-hidden />
        </EmptyPage.Icon>
        <EmptyPage.Title id="empty-table-heading">Пока нет позиций</EmptyPage.Title>
        <EmptyPage.Description>Добавьте первую строку или импортируйте каталог.</EmptyPage.Description>
        <EmptyPage.Actions>
          <Button.Root type="button" variant="primary">
            Добавить позицию
          </Button.Root>
        </EmptyPage.Actions>
      </EmptyPage.Root>
    </div>
  );
}
```

### Связь с DataTable

У **`DataTable`** пустой набор строк может отображаться через **`emptyText`** (строка в таблице). Для **богатого** пустого состояния с кнопкой и иконкой не подставляйте разметку внутрь **`emptyText`**: рендерите **`EmptyPage`** **вместо** таблицы или **в** ячейке-обёртке с **`layout="fill"`**, когда **`rows.length === 0`** и не **`loading`**.

### Playground

Живые примеры: **`playground/sections/EmptyPageSection.tsx`**.

## Extended examples

| Playground (сниппет) | Runnable (`examples/*.tsx`) |
|----------------------|------------------------------|
| [`canonical.tsx`](../../../playground/snippets/empty-page/canonical.tsx) | [`examples/canonical.tsx`](./examples/canonical.tsx) |
| [`sizes.tsx`](../../../playground/snippets/empty-page/sizes.tsx) | [`examples/sizes.tsx`](./examples/sizes.tsx) |
| [`table-region.tsx`](../../../playground/snippets/empty-page/table-region.tsx) | [`examples/table-region.tsx`](./examples/table-region.tsx) |

## Rules

- Заголовок вью — один **`h1`** ([`PageContent.Title`](../page-content/COMPONENT.md)); в **`EmptyPage`** используйте **`Title`** (**`h2`**).
- Иконка декоративная — **`aria-hidden`** на обёртке или SVG.
- Размеры кнопок в **`Actions`** наследуются от **`ControlSizeProvider`** на **`Root`**; при необходимости оберните действия в отдельный **`ControlSizeProvider`**.

## API

### EmptyPage.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `s` \| `m` \| `l` \| `xl` | `m` | No | Шкала иконки, текста, отступов; `ControlSizeProvider` для потомков. |
| layout | `default` \| `fill` | `default` | No | `fill` — растянуть по высоте flex-родителя (пустое тело таблицы / панели). |
| className | `string` | — | No | Дополнительный класс корня. |
| children | `React.ReactNode` | — | No | Icon, Title, Description, Actions. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | В т.ч. `ref` (`forwardRef`), `aria-*`. |

### EmptyPage.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Класс подложки под иконку. |
| children | `React.ReactNode` | — | No | Глиф (например из `lucide-react`). |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Атрибуты обёртки. |

### EmptyPage.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Класс на **`h2`**. |
| children | `React.ReactNode` | — | No | Заголовок блока. |
| …rest | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | В т.ч. `ref` (`forwardRef`), `id` для `aria-labelledby`. |

### EmptyPage.Description

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Класс на **`p`**. |
| children | `React.ReactNode` | — | No | Пояснение. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | В т.ч. `ref` (`forwardRef`). |

### EmptyPage.Actions

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Класс на flex-контейнере действий. |
| children | `React.ReactNode` | — | No | Кнопки и т.п. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Атрибуты **`div`**. |

## Related

- [PageContent](../page-content/COMPONENT.md) — шапка маршрута (**`h1`**).
- [DataTable](../data-table/COMPONENT.md) — **`emptyText`** vs отдельный **`EmptyPage`**.
- [Button](../button/COMPONENT.md) — действия в **`Actions`**.
