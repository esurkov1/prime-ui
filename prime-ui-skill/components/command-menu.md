# CommandMenu

## Что это

Составной компонент «палитра команд»: модальное окно со строкой поиска и списком действий, где пункты фильтруются по вводу и выбираются с клавиатуры или мышью.

## Для чего нужен

- **Корпоративное веб-приложение:** быстрый переход между разделами (отчёты, настройки, биллинг) без раскрытия полного меню.
- **CRM или десктоп оператора:** одна комбинация клавиш открывает действия над текущей сделкой или тикетом.
- **Редактор или студия контента:** команды «создать», «экспорт», «превью» в одном списке с поиском по названию.
- **Служба поддержки:** подтягивание статей базы знаний и готовых ответов по ключевым словам в строке поиска.
- **Интернет-магазин или личный кабинет:** поиск заказов и разделов по номеру, статусу или человекочитаемой метке.
- **Медиатека или каталог:** узкие фильтры-теги под поиском плюс команды «открыть плейлист», «поделиться» без отдельной страницы фильтрации.

## Юзкейсы

Каждый пример рассчитан на другой экран продукта и другой набор пропсов.

### Базовый

Типичный сценарий: кнопка открывает палитру, строка поиска фильтрует пункты по `value` и `keywords`, выбор закрывает окно.

```tsx
import { FileText, Search, Settings } from "lucide-react";
import * as React from "react";
import { Button, CommandMenu } from "prime-ui-kit";

export function CommandPaletteBasic() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root size="m" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Команды
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} size="l" aria-labelledby="cmd-basic-title">
        <CommandMenu.DialogTitle id="cmd-basic-title" style={{ margin: "1rem 1rem 0", fontSize: "1.125rem" }}>
          Команды приложения
        </CommandMenu.DialogTitle>
        <CommandMenu.InputRow leading={<Search size={18} strokeWidth={2} aria-hidden />}>
          <CommandMenu.Input placeholder="Команда или поиск…" aria-label="Поиск команд" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Файл">
            <CommandMenu.Item
              value="новый документ"
              keywords="create new doc"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={FileText} strokeWidth={2} />
              Новый документ
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="Приложение">
            <CommandMenu.Item
              value="настройки"
              keywords="settings preferences"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={Settings} strokeWidth={2} />
              Настройки
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
```

### С вариантами/размерами

Другой контекст — настройка плотности интерфейса справочника: высота строки поиска и кегль строк списка задаются независимо от масштаба всего модального окна.

```tsx
import { Search } from "lucide-react";
import * as React from "react";
import { CommandMenu } from "prime-ui-kit";

export function CommandPaletteDensityAndItems() {
  const [open, setOpen] = React.useState(true);

  return (
    <CommandMenu.Dialog open={open} onOpenChange={setOpen} size="m">
      <CommandMenu.InputRow
        density="comfortable"
        leading={<Search size={18} strokeWidth={2} aria-hidden />}
      >
        <CommandMenu.Input placeholder="Справочник контрагентов…" aria-label="Поиск" />
      </CommandMenu.InputRow>
      <CommandMenu.List>
        <CommandMenu.Group heading="Юрлица">
          <CommandMenu.Item value="ООО Ромашка" size="m" onSelect={() => setOpen(false)}>
            ООО «Ромашка»
          </CommandMenu.Item>
          <CommandMenu.Item value="ИП Иванов" size="s" onSelect={() => setOpen(false)}>
            ИП Иванов
          </CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>
    </CommandMenu.Dialog>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Экран настроек рабочего пространства: сверху заголовок и описание, под строкой поиска — съёмные теги области поиска, внизу футер с пояснением клавиш. Рядом используются `Tag`, `Kbd`, `Button` того же кита.

```tsx
import { Search, X } from "lucide-react";
import * as React from "react";
import { Button, CommandMenu, Kbd, Tag, Typography } from "prime-ui-kit";

export function WorkspaceSettingsCommandPalette() {
  const [open, setOpen] = React.useState(true);
  const [scopes, setScopes] = React.useState(["Проекты", "Люди"]);

  return (
    <CommandMenu.Dialog open={open} onOpenChange={setOpen} size="l" aria-labelledby="ws-cmd-title">
      <div style={{ padding: "1rem 1rem 0" }}>
        <Typography.Root as="div" id="ws-cmd-title" role="heading" aria-level={2} size="l" weight="semibold">
          Рабочее пространство
        </Typography.Root>
        <Typography.Root size="s" tone="muted">
          Поиск по объектам и быстрые действия
        </Typography.Root>
      </div>

      <CommandMenu.InputRow
        leading={<Search size={18} strokeWidth={2} aria-hidden />}
        trailing={
          <>
            <Kbd.Root aria-label="Открыть палитру">⌘K</Kbd.Root>
            <Button.Root size="m" variant="neutral" mode="ghost" aria-label="Закрыть" onClick={() => setOpen(false)}>
              <Button.Icon>
                <X size={18} strokeWidth={2} aria-hidden />
              </Button.Icon>
            </Button.Root>
          </>
        }
      >
        <CommandMenu.Input placeholder="Куда перейти…" aria-label="Поиск" />
      </CommandMenu.InputRow>

      <CommandMenu.TagSection style={{ padding: "0.75rem 1rem" }}>
        <CommandMenu.TagSectionLabel>
          <Typography.Root size="xs" tone="muted">
            Область
          </Typography.Root>
        </CommandMenu.TagSectionLabel>
        <CommandMenu.TagRow style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {scopes.map((s) => (
            <Tag.Root key={s} size="m" onRemove={() => setScopes((p) => p.filter((x) => x !== s))}>
              {s}
            </Tag.Root>
          ))}
        </CommandMenu.TagRow>
      </CommandMenu.TagSection>

      <CommandMenu.List>
        <CommandMenu.Group heading="Действия">
          <CommandMenu.Item value="пригласить" onSelect={() => setOpen(false)}>
            Пригласить участника
          </CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>

      <CommandMenu.Footer style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--prime-sys-color-border-subtle, #e4e4e7)" }}>
        <Typography.Root size="xs" tone="muted">
          Стрелки и Enter работают из поля поиска.
        </Typography.Root>
      </CommandMenu.Footer>
    </CommandMenu.Dialog>
  );
}
```

### Контролируемый режим

Сценарий интеграции с роутером или аналитикой: открытие и строка поиска живут в состоянии родителя; при закрытии запрос сбрасывается.

```tsx
import { Search } from "lucide-react";
import * as React from "react";
import { CommandMenu, Typography } from "prime-ui-kit";

export function ControlledCommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <>
      <Typography.Root size="s" tone="muted">
        Запрос: «{query || "—"}»
      </Typography.Root>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setQuery("");
        }}
        size="l"
      >
        <CommandMenu.InputRow leading={<Search size={18} strokeWidth={2} aria-hidden />}>
          <CommandMenu.Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Синхронизированный ввод…"
            aria-label="Поиск"
          />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Сброс">
            <CommandMenu.Item value="очистить" onSelect={() => setQuery("")}>
              Очистить строку
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
```

## Анатомия

Дерево подкомпонентов:

`CommandMenu.Dialog` → провайдер внутреннего состояния → дочерние узлы:

- опционально `DialogTitle` / `DialogDescription` (экспорты совместимы с `Modal`);
- `InputRow` → `Input`;
- опционально `TagSection` → `TagSectionLabel`, `TagRow`;
- `List` → `Group` → `Item` (внутри — `ItemIcon` и текст);
- опционально `Footer` → `FooterKeyBox` и текст.

## API

### CommandMenu.Dialog

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| open | boolean | — | Нет | Контролируемое открытие |
| defaultOpen | boolean | false | Нет | Начальное состояние |
| onOpenChange | (open: boolean) => void | — | Нет | Смена открытости |
| closeOnEscape | boolean | true | Нет | Закрытие по Escape |
| closeOnOverlayClick | boolean | true | Нет | Закрытие по клику на подложку |
| size | "s" \| "m" \| "l" \| "xl" | "l" | Нет | Масштаб модального окна |
| overlayClassName | string | — | Нет | Класс подложки |
| className | string | — | Нет | Класс панели контента (модификаторы ширины из CSS-модуля) |
| contentClassName | string | — | Нет | Доп. класс панели |
| aria-labelledby | string | — | Нет | Связь с заголовком |
| aria-describedby | string | — | Нет | Связь с описанием |
| children | React.ReactNode | — | Нет | Разметка палитры |

### CommandMenu.DialogTitle / DialogDescription

Совпадают с `Modal.Title` и `Modal.Description`: стандартные HTML-атрибуты заголовка и параграфа плюс `children`, `className`.

### CommandMenu.InputRow

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| leading | React.ReactNode | — | Нет | Слот слева |
| trailing | React.ReactNode | — | Нет | Слот справа |
| density | "compact" \| "comfortable" | "compact" | Нет | Высота строки ввода |
| children | React.ReactNode | — | Нет | Обычно `Input` |
| className | string | — | Нет | Класс обёртки |
| …rest | HTMLAttributes\<div\> | — | Нет | Прочие атрибуты |

### CommandMenu.Input

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| value | string и др. | — | Нет | Контролируемая строка поиска |
| onChange | ChangeEventHandler | — | Нет | Ввод текста |
| …rest | InputHTMLAttributes (без size, type) | — | Нет | type фиксирован как search; стрелки/Home/End/Enter обрабатываются внутри |

### CommandMenu.List

Контейнер с `role="listbox"`: `children`, `className`, стандартные атрибуты `div`.

### CommandMenu.Group

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| heading | React.ReactNode | — | Нет | Заголовок секции |
| children | React.ReactNode | — | Нет | Пункты |
| …rest | HTMLAttributes\<div\> | — | Нет | Скрывается, если нет видимых пунктов |

### CommandMenu.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| value | string | — | Да | Строка для фильтра; `""` — всегда виден |
| keywords | string | "" | Нет | Доп. слова для поиска |
| size | "s" \| "m" | "s" | Нет | Размер строки |
| onSelect | () => void | — | Нет | Выбор |
| disabled | boolean | — | Нет | Исключён из фильтра и навигации |
| …rest | ButtonHTMLAttributes (без type) | — | Нет | type всегда button |

### CommandMenu.ItemIcon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| as | ElementType | "span" | Нет | Корневой элемент или компонент иконки |
| className | string | — | Нет | Класс |
| …rest | пропсы `as` | — | Нет | Пробрасываются в выбранный элемент |

### CommandMenu.TagSection / TagSectionLabel / TagRow

Семантические обёртки для блока под строкой поиска: атрибуты `div` и `children`.

### CommandMenu.Footer

Нижняя панель: атрибуты `div`, в т.ч. класс `footerMuted` из CSS-модуля для приглушённого фона.

### CommandMenu.FooterKeyBox

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| tone | "default" \| "muted" | "default" | Нет | Вариант бейджа (обводка / lighter) |
| children | React.ReactNode | — | Нет | Иконка или подпись клавиши |
| …rest | HTMLAttributes\<div\> (без color) | — | Нет | Остальное на корень Badge |

## Варианты

- **Размер диалога** `Dialog size`: `s` | `m` | `l` | `xl` — влияет на типографику и каскад `ControlSizeProvider` внутри модалки.
- **Плотность строки поиска** `InputRow density`: `compact` или `comfortable`.
- **Размер пункта** `Item size`: `s` или `m`.
- **Тон подсказки клавиши** `FooterKeyBox tone`: `default` (контурный бейдж) или `muted` (светлый фон на тёмном футере).
- **Ширина панели:** классы из `CommandMenu.module.css` (например `dialogContentWide`) через `className` на `Dialog`.

## Состояния

- **Открытие модалки:** контролируемое (`open` / `onOpenChange`) или неконтролируемое (`defaultOpen`).
- **Фильтрация:** при вводе в `Input` список сокращается; пункты с `disabled` не участвуют; `value=""` не отфильтровывается по запросу.
- **Активный пункт:** подсветка и `aria-activedescendant` на поле поиска; группа без видимых пунктов скрывается (`hidden`).
- **Выбор:** клик или Enter вызывают `onSelect` активного пункта.

## Доступность (a11y)

- Поле поиска: `role="combobox"`, `aria-controls` указывает на `List`, `aria-activedescendant` — на id опции.
- Список: `role="listbox"`.
- Пункт: `role="option"`, `aria-selected`.
- Задавайте видимый или визуально скрытый `DialogTitle` и при необходимости `aria-labelledby` на `Dialog`.
- Навигация с клавиатуры из поля ввода: стрелки вверх/вниз, Home, End, Enter (Escape обрабатывает модалка).

## Ограничения и заметки

- Нет встроенного экрана «ничего не найдено» — при пустой выдаче группы скрываются; пустое состояние добавляйте сами под списком.
- Один активный пункт; множественный выбор не поддерживается.
- Фильтрация синхронная и на клиенте; для больших списков может понадобиться виртуализация или серверный поиск снаружи.
- Глобальные сочетания (например ⌘K) не встроены — вешайте слушатель на `document` в приложении.

## Связанные компоненты

- **Modal** — основа диалога.
- **Badge** — внутри `FooterKeyBox`.
- **Button**, **LinkButton** — триггеры и ссылки в футере.
- **Tag** — часто в паре с `TagSection` / `TagRow`.
- **Kbd** — отображение сочетаний рядом с полем поиска.
- **Typography** — заголовки и подписи вокруг палитры.
