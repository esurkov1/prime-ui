# Drawer

## About

`Drawer` — модальная боковая панель поверх страницы.

Что делает компонент при `open=true`:
- рендерится в `Portal`;
- блокирует скролл страницы;
- закрывается по `Escape`;
- закрывается по клику на overlay;
- показывает шапку (иконка, заголовок, подзаголовок), scroll-body и опциональный footer;
- воспроизводит анимации `slide-in` / `slide-out`.

Используйте `Drawer` для вторичных сценариев: фильтры, быстрые формы, детали сущности, action-панели.

## Breaking Change

Старый compound API удалён полностью.

Удалены:
- `Drawer.Root`
- `Drawer.Trigger`
- `Drawer.Portal`
- `Drawer.Overlay`
- `Drawer.Content`
- `Drawer.Body`
- `Drawer.Header`
- `Drawer.Title`
- `Drawer.Footer`
- `Drawer.Close`

Новый API: один компонент `Drawer`.

## Minimal Example

```tsx
import * as React from "react";
import { Button, Drawer } from "prime-ui-kit";

export function DrawerMinimal() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root type="button" onClick={() => setOpen(true)}>
        Open drawer
      </Button.Root>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Edit workspace"
        description="Update settings and save changes"
        footer={
          <>
            <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(false)}>
              Cancel
            </Button.Root>
            <Button.Root variant="primary" onClick={() => setOpen(false)}>
              Save
            </Button.Root>
          </>
        }
      >
        <p>Body content</p>
      </Drawer>
    </>
  );
}
```

## API

### Drawer

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Контролируемое состояние открытия. |
| `onOpenChange` | `(open: boolean) => void` | — | Yes | Вызывается при закрытии/открытии (Esc, overlay, крестик, внешние действия). |
| `title` | `React.ReactNode` | — | Yes | Заголовок в шапке. |
| `description` | `React.ReactNode` | — | No | Подзаголовок в шапке. |
| `icon` | `React.ReactNode` | — | No | Иконка слева в шапке. |
| `children` | `React.ReactNode` | — | Yes | Контент body внутри `ScrollContainer`. |
| `footer` | `React.ReactNode` | — | No | Контент футера (обычно кнопки `Cancel` / `Save`). |
| `side` | `'left' \| 'right'` | `'right'` | No | Сторона выезда панели. |
| `className` | `string` | — | No | Дополнительный класс панели. |
| `overlayClassName` | `string` | — | No | Дополнительный класс overlay. |

## Rules

- Компонент только контролируемый: состояние хранится в родителе (`open`, `onOpenChange`).
- `side` поддерживает только `left` и `right`.
- Шапка всегда содержит кнопку закрытия (крестик) справа.
- Footer опционален: если `footer` не передан, нижняя зона не рендерится.
- Для доступности `aria-labelledby`/`aria-describedby` формируются автоматически из `title`/`description`.

## Playground snippets

Source of truth: `playground/snippets/drawer/*.tsx`.

| File | Intent |
|------|--------|
| `controlled.tsx` | Базовый контролируемый сценарий `open` / `onOpenChange`. |
| `composition.tsx` | Форма в body + действия в footer. |
| `variants-sides.tsx` | Сравнение `side='left'` и `side='right'`. |
| `states.tsx` | Варианты с footer и без footer. |
| `full-width.tsx` | Вертикальный стек `fullWidth` кнопок в footer. |
| `responsive.tsx` | Поведение ширины панели (`min(28rem, 90vw)`). |
| `trigger-link.tsx` | Открытие из `LinkButton` через внешний `setOpen(true)`. |
| `features.tsx` | Длинный scroll-body и шапка с иконкой/description. |
| `sizes.tsx` | Паттерны расположения и действий для левой/правой панели. |

## Examples (`examples/`)

| File | Intent |
|------|--------|
| `examples/filters-panel.tsx` | Левая панель фильтров с действиями Apply/Reset. |
| `examples/cart-preview.tsx` | Правая панель корзины с checkout-действиями. |
| `examples/settings-side.tsx` | Правая панель настроек формы. |
| `examples/mobile-nav-sheet.tsx` | Навигационные действия с закрытием по клику на пункт. |
| `examples/explicit-panel.tsx` | Канонический сценарий новой шапки/body/footer. |

## Related

- [Button](../button/COMPONENT.md)
- [Link button](../link-button/COMPONENT.md)
- [Modal](../modal/COMPONENT.md)
- [Input](../input/COMPONENT.md)
- [Checkbox](../checkbox/COMPONENT.md)
