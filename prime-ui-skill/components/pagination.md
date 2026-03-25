# Pagination

## Что это

Однокомпонентная навигация по страницам списка: стрелки «назад» и «вперёд», кликабельные номера и сокращённый ряд с многоточием при большом числе страниц.

## Для чего нужен

- **Каталог и поиск** — листинг товаров или результатов запроса, когда данные приходят порциями с сервера.
- **Журнал событий и аудит** — таблица операций в админке: перелистывание без прокрутки тысяч строк.
- **Медиатека** — сетка превью или список файлов, разбитый на страницы фиксированного размера.
- **Публикации и обучение** — многостраничная статья или урок, где «страница» — логический кусок контента.
- **Внутренние инструменты** — просмотр ответов API или логов с пейджингом в широкой панели под таблицей.
- **Компактный мобильный экран** — нижняя или верхняя полоса с уменьшенным `size`, когда места мало, а страниц много.

## Юзкейсы

Примеры из разных продуктовых зон; в каждом — свой смысл экрана и набор пропсов.

### Базовый

Интернет-витрина: пользователь листает выдачу, состояние страницы хранится в React.

```tsx
import * as React from "react";
import { Pagination } from "prime-ui-kit";

export function CatalogPagination() {
  const [page, setPage] = React.useState(1);
  const totalPages = 48;

  return (
    <Pagination.Root page={page} totalPages={totalPages} onPageChange={setPage} />
  );
}
```

### С вариантами/размерами

Панель модерации на десктопе: крупнее кликабельная зона и текст номеров через `size`, при этом тот же контролируемый пейджинг.

```tsx
import * as React from "react";
import { Pagination } from "prime-ui-kit";

export function ModerationQueuePagination() {
  const [page, setPage] = React.useState(1);

  return (
    <Pagination.Root
      page={page}
      totalPages={32}
      onPageChange={setPage}
      size="l"
      siblingCount={2}
    />
  );
}
```

### В контексте (панель списка)

Подвал таблицы заказов: слева сводка «показано N–M», справа пагинация на всю ширину строки инструментов.

```tsx
import * as React from "react";
import { Pagination } from "prime-ui-kit";

export function OrdersFooterBar() {
  const [page, setPage] = React.useState(2);
  const pageSize = 25;
  const totalItems = 412;
  const totalPages = Math.ceil(totalItems / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 14, opacity: 0.8 }}>
        Показано {from}–{to} из {totalItems}
      </span>
      <Pagination.Root page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
```

### Контролируемый режим

Страница синхронизирована с запросом: смена номера обновляет данные; при пустом ответе (`totalPages === 0`) блок навигации не показывают.

```tsx
import * as React from "react";
import { Pagination } from "prime-ui-kit";

type PageResult = { items: unknown[]; totalPages: number };

export function InvoicesPagination() {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<PageResult | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch(`/api/invoices?page=${page}`);
      const json = (await res.json()) as PageResult;
      if (!cancelled) setData(json);
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  if (!data || data.totalPages < 1) {
    return null;
  }

  return (
    <Pagination.Root page={page} totalPages={data.totalPages} onPageChange={setPage} />
  );
}
```

## Анатомия

Плоский API: экспортируется объект `Pagination` с единственным подкомпонентом `Root`.

- **`Pagination.Root`** — элемент `nav` с `aria-label="Pagination"`. Внутри: две кнопки-стрелки (`Button.Root` с иконками) и серия кнопок с номерами или невзаимодействующие ячейки с символом многоточия (`span`, `aria-hidden`).

## API

### Pagination.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `page` | `number` | — | Да | Текущая страница; при расчёте ограничивается диапазоном `1 … totalPages`. |
| `totalPages` | `number` | — | Да | Количество страниц. Если `< 1`, компонент возвращает `null`. |
| `onPageChange` | `(page: number) => void` | — | Да | Обработчик смены страницы (номер или стрелка). |
| `siblingCount` | `number` | `1` | Нет | Сколько номеров слева и справа от текущей в сокращённом ряду (при `totalPages > 7`). |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Размер кнопок и согласованный размер ячейки многоточия. |
| `className` | `string` | — | Нет | Дополнительный класс на корневой `nav`. |

## Варианты

Отдельного пропа `variant` нет. Визуальные роли зашиты в разметку: активная страница — `Button` с `variant="primary"` и `mode="filled"`, остальные номера и стрелки — `variant="neutral"`, `mode="ghost"`. Пользовательский «вариант» масштаба задаётся только `size`.

## Состояния

- **Текущая страница** — у соответствующей кнопки `aria-current="page"`.
- **Первая страница** — кнопка «назад» с `disabled`.
- **Последняя страница** — кнопка «вперёд» с `disabled`.
- **Одна страница** — обе стрелки неактивны.
- **Нет страниц** — при `totalPages < 1` рендер пустой.

## Доступность (a11y)

- Корень — семантический `nav` с меткой `aria-label="Pagination"`.
- Стрелки имеют `aria-label` «Previous page» / «Next page» (в коде кита — на английском).
- Номера страниц — `aria-label` вида `Page N`.
- Многоточие декоративное: `aria-hidden="true"`, не участвует в порядке фокуса.

## Ограничения и заметки

- Нет неконтролируемого режима: всегда нужны `page` и `onPageChange`.
- Нельзя подменить разметку слотов или текст стрелок без форка: состав фиксирован.
- Номер страницы и подписи стрелок не локализуются пропами; при необходимости другого языка — обёртка или собственная реализация.
- URL-синхронизация (`?page=`) — задача роутера или родителя, не компонента.

## Связанные компоненты

- **DataTable** — таблицы с встроенной пагинацией данных; `Pagination` удобен под кастомными списками и простыми таблицами без DataTable.
- **Button** — пагинация построена на кнопках кита; стили согласованы с системой контролов.
