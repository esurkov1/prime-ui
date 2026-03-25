# FileUpload

## Что это

Композиционный набор для выбора файлов: зона на основе `label` со скрытым `input type="file"`, поддержкой перетаскивания, и отдельные блоки разметки для списка загруженных файлов с бейджем формата и прогрессом.

## Для чего нужен

- **Кадры и соискатели** — загрузка резюме и портфолио в форматах PDF/изображений с понятной зоной «перетащите или выберите».
- **Интернет-магазин и маркетплейс** — фото товара, сертификаты и видеообзоры: фильтр `accept`, множественный выбор и список имён перед отправкой на сервер.
- **Медицинские и лабораторные порталы** — загрузка снимков и заключений с карточками статуса (идёт / готово / ошибка) и кнопкой повтора.
- **Профиль пользователя** — круглая или компактная зона для аватара плюс внешняя кнопка, открывающая тот же `input` через `inputRef`.
- **B2B и тендеры** — вложения к заявке в контролируемом списке: несколько файлов, очистка, валидация размера на стороне приложения.
- **Образование и LMS** — сдача работ учеником: ограничение типов файла, отключённая зона после дедлайна через `disabled`.

## Юзкейсы

Импорт из пакета `prime-ui-kit`. Примеры относятся к разным продуктам и экранам.

### Базовый

Страница отклика на вакансию: одна зона, выбранный файл показывается текстом под зоной.

```tsx
import * as React from "react";
import { FileUpload } from "prime-ui-kit";

export function JobApplyUpload() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div style={{ maxWidth: 480 }}>
      <FileUpload.Root
        accept=".pdf,application/pdf"
        onFilesChange={(next) => {
          setFiles(next);
        }}
      />
      {files[0] ? (
        <p style={{ marginTop: 12, fontSize: 14 }}>Прикреплён: {files[0].name}</p>
      ) : null}
    </div>
  );
}
```

### С вариантами/размерами

Кабинет поставщика: зона в карточке со сплошной рамкой и увеличенный размер; рядом карточка файла в состоянии ошибки.

```tsx
import { FileUpload } from "prime-ui-kit";

export function SupplierInvoiceUpload() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 520 }}>
      <FileUpload.Root size="l" appearance="solid" multiple />
      <FileUpload.Item variant="error" size="l">
        <FileUpload.ItemRow>
          <FileUpload.FormatBadge format="XLSX" color="green" />
          <FileUpload.ItemMain>
            <FileUpload.ItemName>invoice_wrong_currency.xlsx</FileUpload.ItemName>
            <FileUpload.ItemMeta>
              <span>Неверный формат колонки «Сумма»</span>
            </FileUpload.ItemMeta>
          </FileUpload.ItemMain>
        </FileUpload.ItemRow>
      </FileUpload.Item>
    </div>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Модальное окно импорта: колонка `DropBody`, приглушённый заголовок, ссылка «browse» и чипы источников с общим `inputRef`.

```tsx
import * as React from "react";
import { FileUpload } from "prime-ui-kit";

export function ImportModalDropzone() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <section style={{ padding: 24, borderRadius: 12, background: "var(--prime-sys-color-surface-elevated, #fff)", maxWidth: 400 }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Импорт таблицы</h2>
      <FileUpload.Root inputRef={inputRef} appearance="solid" size="m" multiple>
        <FileUpload.DropBody>
          <FileUpload.Title tone="muted">
            Перетащите файл или{" "}
            <FileUpload.BrowseLink type="button" onClick={() => inputRef.current?.click()}>
              выберите на диске
            </FileUpload.BrowseLink>
          </FileUpload.Title>
          <FileUpload.ActionsRow>
            <FileUpload.Chip type="button" onClick={() => inputRef.current?.click()}>
              <FileUpload.ChipLabel>Локальный диск</FileUpload.ChipLabel>
            </FileUpload.Chip>
            <FileUpload.Chip type="button">
              <FileUpload.ChipLabel>Сетевой каталог</FileUpload.ChipLabel>
            </FileUpload.Chip>
          </FileUpload.ActionsRow>
        </FileUpload.DropBody>
      </FileUpload.Root>
    </section>
  );
}
```

### Контролируемый режим

Панель вложений к заявке в поддержку: несколько файлов, список имён и кнопка очистки.

```tsx
import * as React from "react";
import { Button, FileUpload } from "prime-ui-kit";

export function SupportTicketAttachments() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
      <FileUpload.Root
        multiple
        accept="image/*,.pdf,application/pdf"
        onFilesChange={(next) => {
          setFiles((prev) => [...prev, ...next]);
        }}
      />
      {files.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          {files.map((f) => (
            <li key={`${f.name}-${f.lastModified}`}>{f.name}</li>
          ))}
        </ul>
      ) : null}
      {files.length > 0 ? (
        <Button.Root type="button" size="s" variant="neutral" mode="stroke" onClick={() => setFiles([])}>
          Убрать вложения
        </Button.Root>
      ) : null}
    </div>
  );
}
```

## Анатомия

**Зона выбора:** `FileUpload.Root` (рендер `label` + скрытый `input`) → по умолчанию внутри `ControlSizeProvider` встроенные `Icon`, `Title`, `Hint`, `BrowseLabel`, либо собственные `children` (`DropBody`, `Title`, `BrowseLink`, `ActionsRow`, `Chip`, …).

**Карточка файла:** `FileUpload.Item` → `ItemRow` → `FormatBadge` + `ItemMain` (часто `ItemTextGroup` с `ItemName` и `ItemMeta`, или `ItemStack` с ошибкой и `ItemTryAgain`) + при необходимости `ItemActions`; под рядом — `ItemProgress` или `ItemFooter`.

## API

### FileUpload.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Токены для зоны, текста, чипа Browse и контекста Hint. |
| appearance | `"dashed" \| "solid"` | `"dashed"` | Нет | Пунктир или сплошная рамка и фон «как поле». |
| inputRef | `React.Ref<HTMLInputElement>` | — | Нет | Доступ к скрытому input для программного `click()`. |
| accept | `string` | — | Нет | Нативный `accept`. |
| multiple | `boolean` | — | Нет | Множественный выбор в диалоге. |
| disabled | `boolean` | — | Нет | Отключает выбор и drop; `aria-disabled` на input. |
| onFilesChange | `(files: File[]) => void` | — | Нет | После change или drop; значение input сбрасывается. |
| children | `React.ReactNode` | — | Нет | Кастомная разметка зоны. |
| className | `string` | — | Нет | Класс `label`. |
| …rest | `Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "children">` | — | Нет | `htmlFor`, `id`, aria и др. |

### FileUpload.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Класс обёртки. |
| children | `React.ReactNode` | — | Нет | Обычно иконка из кита. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | Нет | Корень с `aria-hidden`. |

### FileUpload.Title

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| tone | `"default" \| "muted"` | `"default"` | Нет | Цвет текста заголовка. |
| className | `string` | — | Нет | Класс параграфа. |
| children | `React.ReactNode` | — | Нет | Текст. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | Нет | Прочие атрибуты `p`. |

### FileUpload.Hint

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Класс. |
| children | `React.ReactNode` | — | Нет | Подсказка (рендер через `Hint.Root`). |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | Нет | Размер подставляется из контекста корня зоны. |

### FileUpload.BrowseLabel

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Класс `span`. |
| children | `React.ReactNode` | — | Нет | Подпись чипа Browse. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Атрибуты `span`. |

### FileUpload.BrowseLink

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | Нет | Клик не всплывает к `label`. |
| className | `string` | — | Нет | Класс кнопки. |
| onClick | `React.MouseEventHandler<HTMLButtonElement>` | — | Нет | Часто открывает диалог через `inputRef`. |
| children | `React.ReactNode` | — | Нет | Текст ссылки. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | Нет | Остальные атрибуты кнопки. |

### FileUpload.DropBody

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Класс колонки. |
| children | `React.ReactNode` | — | Нет | Текст и чипы. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты `div`. |

### FileUpload.ActionsRow

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Класс ряда. |
| children | `React.ReactNode` | — | Нет | `Chip` и др. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты `div`. |

### FileUpload.Chip

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | Нет | Не открывает диалог без обработчика. |
| className | `string` | — | Нет | Класс кнопки. |
| onClick | `React.MouseEventHandler<HTMLButtonElement>` | — | Нет | Остановка всплытия к `label`. |
| children | `React.ReactNode` | — | Нет | Иконка и `ChipLabel`. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | Нет | Остальные атрибуты. |

### FileUpload.ChipLabel

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Класс. |
| children | `React.ReactNode` | — | Нет | Текст чипа. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Атрибуты `span`. |

### FileUpload.FormatBadge

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| format | `string` | — | Да | Строка расширения; в UI укорачивается и капсом. |
| color | `FileUploadFormatBadgeColor` | `"gray"` | Нет | Палитра бейджа. |
| className | `string` | — | Нет | Доп. класс. |

### FileUpload.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| variant | `"default" \| "error"` | `"default"` | Нет | Обычная или ошибочная карточка. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Размеры карточки и типографики. |
| className | `string` | — | Нет | Класс контейнера. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты `div`. |

### Слоты карточки и ряда (`ItemRow`, `ItemMain`, `ItemStack`, `ItemTextGroup`, `ItemName`, `ItemMeta`, `ItemActions`, `ItemFooter`)

Для каждого из перечисленных компонентов контракт совпадает:

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Доп. класс. |
| children | `React.ReactNode` | — | Нет | Вложенная разметка. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты `div`. |

### FileUpload.ItemMetaSep

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Класс `span`. |
| children | `React.ReactNode` | — | Нет | Игнорируется в разметке; показывается «·». |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Узел с `aria-hidden`. |

### FileUpload.ItemTryAgain

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | Нет | Тип кнопки. |
| className | `string` | — | Нет | Класс. |
| children | `React.ReactNode` | — | Нет | Подпись. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | Нет | Остальные атрибуты. |

### FileUpload.ItemProgress

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| value | `number` | — | Нет | Если задано без `children` — рендер `ProgressBar.Root`. |
| max | `number` | — | Нет | Максимум прогресса. |
| className | `string` | — | Нет | Класс обёртки. |
| children | `React.ReactNode` | — | Нет | Свой индикатор вместо полосы. |

## Варианты

- **`appearance` у Root:** `dashed` — типовая зона с пунктиром; `solid` — сплошная граница и фон ближе к полю ввода, удобно внутри карточек и модалок.
- **`variant` у Item:** `default` — нейтральная карточка; `error` — акцентная рамка и фон для сбоя загрузки или отклонения файла.
- **`size`:** общая ось `s`–`xl` для зоны и для карточки; кнопки рядом с карточкой лучше брать того же размера.
- **`FormatBadge.color`:** `gray`, `red`, `blue`, `green`, `orange`, `purple`, `sky`, `yellow` — визуальная группировка типов файлов.
- **`Title.tone`:** `muted` для второстепенного текста в плотных макетах.

## Состояния

- **Обычная зона** — клик по свободной области открывает диалог; hover и фокус меняют обводку и тень.
- **Перетаскивание** — пока файл над зоной, на `label` выставляется `data-dragover` (подсветка рамки и фона).
- **`disabled`** — курсор `not-allowed`, снижена непрозрачность; drop не обрабатывается.
- **Карточка** — состояния «загрузка / успех / ошибка» в разметке и иконках задаёт приложение; `ItemProgress` опционален; для ошибок — `variant="error"` и `ItemTryAgain`.

## Доступность (a11y)

- Зона кликабельна через связку `label` + скрытый `input`; фокус с клавиатуры приводит к видимому кольцу на зоне (`focus-within`).
- У скрытого поля выставляется `aria-disabled` при `disabled`.
- `BrowseLink` и `Chip` останавливают всплытие, чтобы не дублировать открытие диалога без явного `onClick`.
- `FormatBadge` и декоративные иконки в примерах помечайте `aria-hidden`, если статус дублируется текстом в `ItemName`.
- Иконки в `FileUpload.Icon` по умолчанию в обёртке с `aria-hidden` — смысл должен быть в тексте рядом.

## Ограничения и заметки

- Нет встроенной загрузки на сервер, проверки вирусов или облачных коннекторов — только UI и событие `onFilesChange` / нативный выбор.
- Повторный выбор того же файла снова вызовет `onFilesChange`, потому что значение input очищается после выбора.
- Чипы «облако» в демо — визуальные заглушки: реальную интеграцию с хранилищами нужно подключать отдельно.
- Список файлов и удаление элементов — ответственность приложения; карточки `Item` не хранят состояние файлов.
- Для строки настроек без видимой зоны достаточно скрытого `input` и кнопок — блок `FileUpload` может не понадобиться; в доке показан соседний паттерн с `Avatar` для контекста.

## Связанные компоненты

- **Button** — внешний вызов `inputRef.click()`, сброс списка, действия в `ItemActions`.
- **Hint** — используется внутри `FileUpload.Hint` с размером из контекста.
- **ProgressBar** — рендер внутри `ItemProgress`, если передан `value` без кастомных `children`.
- **Avatar** — превью изображения в списке настроек рядом с действиями загрузки.
- **Divider** — разделители между строками списка в макетах профиля.
