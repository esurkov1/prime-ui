# Typography

**Проектирование по умолчанию:** для текста страницы выбирайте **`body-default`** в `variant`, если явно не оговорено иное. Для контролов используйте их ось **`size`** (`s`–`xl`), а не `Typography`.

## About

Стилизованный текст с **семантическими ролями чтения** (`variant`), привязанными к `typography.role` в токенах, и опциональными осями: `weight`, `tracking`, курсив и приглушённый `tone`. Рендерится как выбранный HTML-тег (`as`).

- **Use** для основного текста, подзаголовков по смыслу ролей, подписей и метрик там, где нужны токены кита, а не произвольный `font-size`.
- **Use** `tone="muted"` для вторичных пояснений и юридических строк.
- **Use** вложенные `Typography.Root` с разными `as` и `weight` внутри одного блока.
- **Use** `as="h1"`–`as="h6"` для визуального уровня заголовка, согласованного с темой; по возможности сохраняйте логичный порядок уровней на странице.
- **Use** `as` с landmarks (`main`, `article`, `section`, `header`, `footer`, …) при вёрстке шаблонов.
- **Do not use** для подписей **внутри кнопок и полей**, где кегль задаёт контроль: оборачивайте `Button`/`Input` и полагайтесь на наследование (см. [Button](../button/COMPONENT.md)) или используйте [Label](../label/COMPONENT.md).
- **Do not use** `as` вместо настоящих `<button>` / `<a>` для действий и навигации.
- **Do not use** ожидая отдельный контроль `line-height` вне роли — межстрочный интервал связан с `variant` в стилях.

## Ось чтения и ось контроля

- **`Typography`** — **чтение**: только `variant` (роли из `tokens/semantic.ts` → `typography.role`).
- **Инпуты, кнопки, чекбоксы и т.д.** — **контроль**: `size` `s` | `m` | `l` | `xl` и токены `--prime-sys-size-control-*`.

Не подменяйте одну ось другой: «крупная кнопка» и «крупный заголовок» задаются разными пропами и токенами.

## Composition

- Одна часть: **`Typography.Root`**. Текст или инлайн-разметка в **`children`**.
- **`as`** задаёт элемент по умолчанию **`p`**; допустимы абзац, инлайн, блок, **заголовки `h1`–`h6`**, **`small`**, **`blockquote`**, а также **landmarks**: `article`, `section`, `header`, `footer`, `aside`, `nav`, `main`.

### Minimal example

```tsx
import { Typography } from "prime-ui-kit";

export function Example() {
  return <Typography.Root variant="body-default">Hello</Typography.Root>;
}
```

## Rules

- **`variant` обязателен**; лишние **`data-*`** для значений по умолчанию не выставляются (`weight="regular"`, `tracking="normal"`, `tone="default"`, без курсива).
- В DOM на корне: **`data-variant`** (кебаб-кейс, например `heading-page`).
- HTML-атрибуты (`id`, `aria-*`, …) пробрасываются через **`...rest`**.
- Корень использует **`text-wrap: balance`** для коротких блоков; при необходимости переопределяйте снаружи.
- Отдельных состояний disabled/loading/error нет — сочетайте с родительским UI.

## Миграция с `size` (до v0.3)

Публичный проп **`size`** (`2xs`…`6xl`) заменён на **`variant`**. Соответствие прежней ступени шкалы и роли:

| Было `size` | Стало `variant`   |
| ----------- | ----------------- |
| `6xl`       | `display`         |
| `5xl`       | `headline`        |
| `4xl`       | `heading-page`    |
| `3xl`       | `heading-section` |
| `2xl`       | `heading-subsection` |
| `xl`        | `heading-group`   |
| `l`         | `body-large`      |
| `m`         | `body-default`    |
| `s`         | `body-small`      |
| `xs`        | `body-compact`    |
| `2xs`       | `caption`         |

## API

### Typography.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | см. `TypographyAs` | `"p"` | No | HTML-элемент-обёртка |
| variant | см. `TypographyVariant` | — | Yes | Семантическая роль чтения |
| weight | `"regular"` \| `"medium"` \| `"semibold"` | `"regular"` | No | Начертание |
| tracking | `"normal"` \| `"tight"` \| `"tighter"` \| `"wide"` | `"normal"` | No | Межбуквенное расстояние |
| italic | `boolean` | `false` | No | Курсив |
| tone | `"default"` \| `"muted"` | `"default"` | No | Основной или вторичный цвет текста |
| children | `React.ReactNode` | — | No | Контент |
| className | `string` | — | No | Дополнительный класс |
| ref | `React.Ref<HTMLElement>` | — | No | Ref на узел |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | No | Прочие атрибуты элемента |

## Related

- [Label](../label/COMPONENT.md)
- [Hint](../hint/COMPONENT.md)
- [LinkButton](../link-button/COMPONENT.md)
- [Banner](../banner/COMPONENT.md)
- [Notification](../notification/COMPONENT.md)
