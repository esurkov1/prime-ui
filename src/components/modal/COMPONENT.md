# Modal

**Проектирование по умолчанию:** у контролов с осью размера выбирай **`m`**, если не оговорено иное. У модалки фиксированный масштаб оболочки **`m`** — отдельного `size` на `Modal.Root` нет.

## Публичный API (только это)

| Компонент | Назначение |
|-----------|------------|
| **`Modal.Root`** | Состояние открыто/закрыто, `onOpenChange`, `closeOnEscape`, `closeOnOverlayClick`. |
| **`Modal.Trigger`** | Ровно один дочерний элемент — по клику открывает модалку. |
| **`Modal.Panel`** | Всё остальное: портал, подложка, панель `role="dialog"`, шапка/тело/подвал через **пропы**. Ширина панели по умолчанию укладывается во вьюпорт в стилях — отдельного пропа «адаптивности» нет. |
| **`Modal.Close`** | Оборачивает кнопку, по клику закрывает (часто внутри `footer` у `Panel`). |

Типичное дерево: **`Root` → `Trigger` + `Panel`**. Вложенность **`Layer` / `Content` / `Header` / `Body` / `Footer`** в публичном API **нет** — это внутренняя сборка внутри `Panel`.

## Минимальный пример

```tsx
import { Button, Modal } from "prime-ui-kit";

export function ConfirmModal() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Open
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        description="This cannot be undone."
        footer={
          <>
            <Modal.Close>
              <Button.Root size="m" variant="neutral" mode="stroke">
                Cancel
              </Button.Root>
            </Modal.Close>
            <Button.Root size="m" variant="error">
              Delete
            </Button.Root>
          </>
        }
        title="Delete item?"
      >
        <p>Only this row will be removed.</p>
      </Modal.Panel>
    </Modal.Root>
  );
}
```

### `Modal.Panel` — основные пропы

| Prop | Описание |
|------|----------|
| `title` | Заголовок (`h2`). Если задан — строится шапка с иконкой/закрытием и **тело** с разделителем. |
| `description` | Текст под заголовком. |
| `icon` | Иконка слева в шапке. |
| `showClose` | Встроенная кнопка закрытия в шапке (по умолчанию `true`, если есть `title`). |
| `closeAriaLabel` | `aria-label` этой кнопки (по умолчанию `"Close"`). |
| `children` | Основной контент. |
| `footer` | Нижняя зона (кнопки). |
| `footerClassName` | Класс на `<footer>`. |
| `bodyClassName` / `bodyStyle` | Область тела (например `maxHeight` + `overflow` для прокрутки). |
| `container` | Узел для `createPortal` (не `body` — для тестов / особых stacking). |
| `overlayClassName` | Класс на полноэкранной подложке. |
| `className` / `style` | Панель (белая карточка). |
| `aria-label` | Имя диалога, если **нет** видимой шапки (`title`). |
| `aria-labelledby` / `aria-describedby` | Ручная связка с разметкой; иначе при `title`/`description` выставляется автоматически. |

Без **`title`**: рендерится только `children` внутри панели (например headless-диалог) — задайте **`aria-label`** или **`aria-labelledby`**.

## Контролируемый режим

```tsx
<Modal.Root open={open} onOpenChange={setOpen}>
  <Modal.Panel title="..." footer={...}>
    ...
  </Modal.Panel>
</Modal.Root>
```

`Trigger` не обязателен.

## Accessibility

- Панель: `role="dialog"`, `aria-modal="true"`.
- С шапкой: имя и описание связываются с `h2` / `p` автоматически.
- Без шапки: **`aria-label`** на `Panel` или корректный **`aria-labelledby`**.
- Закрытие: Escape и клик по подложке (если не отключены на `Root`).

## Ограничения

- `Trigger` и `Close` ожидают **ровно один** дочерний React-элемент (`cloneElement`).
- Вложенные модалки в одном дереве — потребуются дополнительные меры по фокусу и порядку порталов.

## Связанные компоненты

- **Button** — триггер и действия в `footer`.
- **Drawer** — боковая панель вместо центрированного диалога.
- **Popover** — лёгкий оверлей без полной модальной семантики.
