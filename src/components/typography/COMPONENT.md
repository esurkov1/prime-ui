# Typography

**Проектирование по умолчанию:** для текста страницы выбирайте **`body-default`** в `variant`, если явно не оговорено иное.

## About

Стилизованный текст с **семантическими ролями чтения** (`variant`), привязанными к `typography.role` в токенах, и опциональными осями: `weight`, `tracking`, курсив и приглушённый `tone`. Рендерится как выбранный HTML-тег (`as`).

- **Use** для основного текста, подзаголовков по смыслу ролей, подписей и метрик там, где нужны токены кита, а не произвольный `font-size`.
- **Use** `tone="muted"` для вторичных пояснений и юридических строк.
- **Use** вложенные `Typography.Root` с разными `as` и `weight` внутри одного блока.
- **Use** `as="h1"`–`as="h6"` для визуального уровня заголовка, согласованного с темой; по возможности сохраняйте логичный порядок уровней на странице.
- **Use** `as` с landmarks (`main`, `article`, `section`, `header`, `footer`, …) при вёрстке шаблонов.
- **Do not use** для подписи внутри **кнопки** или **поля ввода** как отдельной «типографики»: у этих компонентов свой ритм текста — положитесь на разметку [Button](../button/COMPONENT.md) / [Input](../input/COMPONENT.md) и при необходимости [Label](../label/COMPONENT.md).
- **Do not use** `as` вместо настоящих `<button>` / `<a>` для действий и навигации.
- **Do not use** ожидая отдельный контроль `line-height` вне роли — межстрочный интервал связан с `variant` в стилях.

Интерактивные компоненты (формы, кнопки и т.д.) настраиваются **своими** пропами и токенами; **`Typography`** к ним не относится и **не** задаёт их внешний вид.

## Справочное сопоставление: MD3, Apple (SF), Polaris

Ниже — **ориентировочное** соответствие ролей prime-ui-kit стилям из [Material Design 3 — Type scale](https://m3.material.io/styles/typography/type-scale-tokens), уровням текста [Apple — Typography](https://developer.apple.com/design/human-interface-guidelines/typography) (SF Pro) и вариантам [Polaris Text](https://polaris.shopify.com/components/typography/text). У разных систем **разные pt/px**; ориентир — **уровень иерархии**, не побитовое совпадение.

**Кегль в теме:** каждая роль ссылается на ступени `typography.sizeScale` / `lineHeightScale` → примитивы `font.size.*` / `font.lineHeight.*`. Ниже — **приблизительный размер шрифта** при `1rem = 16px` на `:root` (округление).

| `variant` | Примитив кегля | ≈ px @16 | Близкий стиль MD3 | Близкий уровень Apple (SF) | Polaris `Text` |
| --------- | ---------------- | -------- | ----------------- | --------------------------- | -------------- |
| `display` | `9xl` | 57 | Display Large | Large Title | `heading3xl` |
| `headline` | `6xl` | 32 | Headline Large | Title 1 | `heading2xl` |
| `heading-page` | `4xl` | 28 | Headline Medium | Title 2 | `headingXl` |
| `heading-section` | `2xl` | 24 | Headline Small | Title 3 | `headingLg` |
| `heading-subsection` | `xl` | 22 | Title Large | Headline | `headingMd` |
| `heading-group` | `xs` | 14 | Title Small | Subheadline / Footnote | `headingSm`, `headingXs` |
| `body-large` | `s` | 16 | Body Large | Body / Callout | `bodyLg` |
| `body-default` | `xs` | 14 | Body Medium | Subheadline | `bodyMd` |
| `body-small` | `2xs` | 12 | Body Small | Footnote | `bodySm` |
| `body-compact` | кегль `xs`, межстрочный `2xs` | 14, плотнее | Label Large (плотная строка) | — | `bodyXs` |
| `caption` | `2xs` | 12 | Label Medium | Caption 1 | `bodySm` (по смыслу + `tone`) |
| `caption-micro` | `labelMicro` | 11 | Label Small | Caption 2 | самый мелкий смысловой уровень |

Ступени **`7xl`**, **`8xl`** в шкале есть (как у MD3 Display Medium / Small по размеру), но **в роли `typography.role` не задействованы** — при необходимости используйте их через токены напрямую, не через `Typography`.

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
