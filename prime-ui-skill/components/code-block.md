# CodeBlock

## Что это

Объект `CodeBlock` с подкомпонентом `Root`: статичное отображение фрагмента TypeScript или TSX с подсветкой синтаксиса и выбором светлой или тёмной палитры токенов.

## Для чего нужен

- В портале документации для партнёров и разработчиков показать пример запроса, типы ответа или снипет интеграции без выноса в сторонний виджет.
- На маркетинговой странице продукта вставить короткий пример кода в светлой и тёмной колонке так, чтобы читаемость не ломалась при смене оформления секции.
- В панели поддержки или внутреннем инструменте вывести фрагмент журнала, сгенерированного конфига или результата преобразования — с тем же визуальным языком, что и остальной интерфейс.

## Юзкейсы

### Базовый

Самый частый случай: один фрагмент в теле статьи, схема подсветки совпадает с темой приложения.

```tsx
import { CodeBlock } from "prime-ui-kit";

const snippet = `import { useState } from "react";

export function Counter() {
  const [n, setN] = useState(0);
  return <button type="button" onClick={() => setN((x) => x + 1)}>{n}</button>;
}
`;

export function ArticleBody({ scheme }: { scheme: "light" | "dark" }) {
  return <CodeBlock.Root code={snippet} colorScheme={scheme} />;
}
```

### С вариантами/размерами

Секция лендинга с двумя колонками: в одной светлый фон и `colorScheme="light"`, в соседней тёмная подложка и `colorScheme="dark"` — текст кода остаётся читаемым в обоих блоках.

```tsx
import { CodeBlock } from "prime-ui-kit";

const curl = `curl -sS https://api.store.example/health | jq .status`;

export function LandingDevStrip() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <section style={{ padding: 16, background: "#f8fafc" }}>
        <CodeBlock.Root code={curl} colorScheme="light" />
      </section>
      <section style={{ padding: 16, background: "#0f172a" }}>
        <CodeBlock.Root code={curl} colorScheme="dark" />
      </section>
    </div>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Карточка описания REST-ресурса в каталоге заказов: заголовок маршрута, пояснение и пример JSON-тела ответа вложенным блоком с чуть более глубоким фоном.

```tsx
import { CodeBlock, Typography } from "prime-ui-kit";

const body = `{
  "orderId": "ord_991",
  "lines": [{ "sku": "tea-1", "qty": 3 }],
  "total": { "amount": "1290.00", "currency": "RUB" }
}`;

export function OrderApiCard() {
  return (
    <article style={{ padding: 20, borderRadius: 12, border: "1px solid #e2e8f0" }}>
      <Typography.Root as="div" size="s" weight="semibold">
        GET /v2/orders/:id
      </Typography.Root>
      <Typography.Root as="p" size="xs" tone="muted" style={{ margin: "8px 0 12px" }}>
        Возвращает актуальный состав корзины для экрана курьера.
      </Typography.Root>
      <div style={{ padding: 12, borderRadius: 8, background: "#f1f5f9", fontSize: 13 }}>
        <CodeBlock.Root code={body} colorScheme="light" />
      </div>
    </article>
  );
}
```

### Контролируемый режим

Внутренняя страница «Песочница»: пользователь переключает вкладки «Хук» и «Утилита», строка `code` приходит из состояния.

```tsx
import { useEffect, useState } from "react";
import { Button, CodeBlock } from "prime-ui-kit";

const samples = [
  {
    id: "hook",
    label: "Хук",
    code: `export function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}`,
  },
  {
    id: "util",
    label: "Утилита",
    code: `export function isUuid(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}`,
  },
] as const;

export function SnippetPlayground({ scheme }: { scheme: "light" | "dark" }) {
  const [i, setI] = useState(0);
  const active = samples[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {samples.map((s, idx) => (
          <Button.Root
            key={s.id}
            type="button"
            size="s"
            variant={idx === i ? "primary" : "neutral"}
            mode={idx === i ? "filled" : "stroke"}
            onClick={() => setI(idx)}
          >
            {s.label}
          </Button.Root>
        ))}
      </div>
      <CodeBlock.Root code={active.code} colorScheme={scheme} />
    </div>
  );
}
```

## Анатомия

Экспортируется объект `CodeBlock` с единственным публичным подкомпонентом `Root`. `Root` рендерит элемент `pre` и внутрь подставляет один дочерний `code` с HTML-разметкой, сгенерированной из строки `code` (см. `highlightTsxHtml` в исходниках кита).

## API

### CodeBlock.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| `code` | `string` | — | Да | Исходник TS/TSX; перед подсветкой к концу строки применяется `trimEnd()`. |
| `colorScheme` | `"light" \| "dark"` | `"light"` | Нет | Какая палитра классов токенов подсветки используется (`data-theme` на `pre`). |
| `className` | `string` | — | Нет | Дополнительный класс для `pre`. |
| `…rest` | `Omit<React.HTMLAttributes<HTMLPreElement>, "children" \| "dangerouslySetInnerHTML">` | — | Нет | Стандартные атрибуты `pre`: `id`, `style`, `role`, ARIA, `data-*`, обработчики и т.д. Пропы `children` и `dangerouslySetInnerHTML` исключены из типа: разметка внутри задаётся только компонентом. |

## Варианты

Отдельного пропа `variant` нет. Визуальное различие режимов задаётся только `colorScheme`: светлая и тёмная схемы сопоставлены с селекторами `.root[data-theme="light"|"dark"]` в стилях компонента.

## Состояния

Интерактивных состояний (`disabled`, `loading` и т.п.) нет: блок только отображает текст. Управление внешним видом — через `colorScheme`, `className`, `style` и наследуемую от родителя типографику.

## Доступность (a11y)

Корень — нативный `pre` с программно сформированным `code` внутри. Для скринридеров смысл фрагмента стоит пояснять контекстом вокруг или атрибутами на `pre` (`aria-label`, `aria-describedby`), переданными через `…rest`. Фокус с клавиатуры на статичный блок обычно не ставят (`tabIndex` по умолчанию не задан).

## Ограничения и заметки

- Подсветка реализована эвристикой для TS/TSX внутри кита, а не полноценным парсером языка: редкие конструкции могут отображаться без ожидаемых классов.
- Разметка попадает в DOM через `dangerouslySetInnerHTML`: в `code` должна попадать только доверенная строка (контролируемая константа, ваш бэкенд с санитизацией и т.п.), не произвольный ввод пользователя.
- Отдельного пропа размера нет: кегль и межстрочный интервал наследуются от стилей родителя (`font-size`, `line-height` на обёртке).

## Связанные компоненты

- **Typography** — заголовки и пояснения рядом с примером кода.
- **Button** и **Segmented control** — переключение нескольких фрагментов в контролируемом сценарии.
- **Kbd** — сочетания клавиш в тексте подсказок рядом с кодом, без дублирования роли самого блока кода.
</think>


<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
StrReplace