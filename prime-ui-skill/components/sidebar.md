# Sidebar

## Что это

Композитная боковая навигация: корень с контекстом состояния, опциональная узкая колонка разделов и основная панель с группами пунктов, заголовками и подвалом.

## Для чего нужен

- **Рабочие пространства и переключение продуктов** — слева иконки CRM, биллинга и поддержки; справа список сущностей выбранного продукта без смены всего макета.
- **Порталы документации** — сворачиваемые категории оглавления, дерево страниц и длинные списки глав с компактной панелью и отдельным слотом контента.
- **Логистика и операционные панели** — узкая колонка «Fleet / Warehouse» и детальное меню маршрутов, ТС и заявок с счётчиками в строках.
- **Настройки и мастер-формы** — одна колонка разделов настроек; открытость панели и режим simple/double можно вести из родителя вместе с маршрутом.
- **Витрины и каталоги** — сайдбар в слоте навигации страницы на всю высоту рядом с фильтрами и сеткой товаров (`sidebarSlot`, компактная ширина панели).
- **Приложения с маршрутизацией** — пункты на `NavLink` и хук `useSidebarNavTo`, чтобы не дублировать префикс раздела в каждом `to`.

## Юзкейсы

Импорт из пакета `prime-ui-kit`. Ниже сценарии из разных областей; комбинации API не повторяют одну и ту же задачу.

### Базовый

Одна панель для внутреннего инструмента команды: шапка, группа пунктов, подвал с профилем.

```tsx
import { Avatar, Sidebar } from "prime-ui-kit";

export function TeamToolNav() {
  return (
    <Sidebar.Root size="m" variant="simple" defaultOpen aria-label="Навигация инструмента">
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.IdentityButton
                leading={<span aria-hidden="true">Δ</span>}
                title="Delta Ops"
                subtitle="Internal"
                type="button"
              />
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Сервисы</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton type="button" active>
                  <Sidebar.MenuLabel>Инциденты</Sidebar.MenuLabel>
                  <Sidebar.MenuTrailing>4</Sidebar.MenuTrailing>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton type="button">
                  <Sidebar.MenuLabel>Смены</Sidebar.MenuLabel>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.IdentityButton
            leading={
              <Avatar.Root size="s">
                <Avatar.Fallback>ИП</Avatar.Fallback>
              </Avatar.Root>
            }
            title="Иван Петров"
            subtitle="Дежурный"
            type="button"
          />
        </Sidebar.Footer>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

### С вариантами/размерами

Образовательный портал: крупный размер, компактная ширина панели и сворачиваемый блок оглавления.

```tsx
import { Sidebar } from "prime-ui-kit";
import { useState } from "react";

export function CourseOutlineNav() {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(true);

  return (
    <Sidebar.Root
      size="l"
      variant="simple"
      panelWidth="compact"
      open={open}
      onOpenChange={setOpen}
      responsive={false}
      aria-label="Оглавление курса"
    >
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.NavPanelHeading>Модуль 3</Sidebar.NavPanelHeading>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.NavCategory>
            <Sidebar.NavCategoryTrigger
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              <Sidebar.NavCategoryLabel>Лекции</Sidebar.NavCategoryLabel>
              <Sidebar.NavCategoryCount>6</Sidebar.NavCategoryCount>
            </Sidebar.NavCategoryTrigger>
            {expanded ? (
              <Sidebar.NavCategoryPanel>
                <Sidebar.NavDocTree>
                  <Sidebar.Text>Введение в тему</Sidebar.Text>
                  <Sidebar.Text>Практика</Sidebar.Text>
                </Sidebar.NavDocTree>
              </Sidebar.NavCategoryPanel>
            ) : null}
          </Sidebar.NavCategory>
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

### В контексте (макет страницы)

Витрина: сайдбар в слоте навигации рядом с зоной контента, без адаптивного оверлея в этом фрейме.

```tsx
import { Sidebar } from "prime-ui-kit";

export function StorefrontShell() {
  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh" }}>
      <Sidebar.Root
        size="m"
        variant="simple"
        sidebarSlot="page-nav"
        defaultOpen
        responsive={false}
        aria-label="Категории витрины"
      >
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.HeaderRow>
              <Sidebar.HeaderMain>
                <Sidebar.Text>Каталог</Sidebar.Text>
              </Sidebar.HeaderMain>
              <Sidebar.ToggleButton />
            </Sidebar.HeaderRow>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton type="button" active>
                  <Sidebar.MenuLabel>Новинки</Sidebar.MenuLabel>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuLink href="/sale" active={false}>
                  Распродажа
                </Sidebar.MenuLink>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar.NavPanel>
      </Sidebar.Root>
      <main style={{ flex: 1, padding: 24 }}>Сетка товаров</main>
    </div>
  );
}
```

### Контролируемый режим

Админка: родитель держит открытость и режим колонок, чтобы синхронизировать с пользовательской настройкой «компактной навигации».

```tsx
import { Sidebar } from "prime-ui-kit";
import { useState } from "react";

export function AdminNavControlled() {
  const [open, setOpen] = useState(true);
  const [variant, setVariant] = useState<"simple" | "double">("double");
  const [section, setSection] = useState("users");

  return (
    <Sidebar.Root
      size="m"
      variant={variant}
      onVariantChange={setVariant}
      activeSection={section}
      onActiveSectionChange={setSection}
      open={open}
      onOpenChange={setOpen}
      responsive={false}
      aria-label="Администрирование"
    >
      {variant === "double" ? (
        <Sidebar.ContextBar
          items={[
            { id: "users", label: "Users", icon: <span aria-hidden>👤</span> },
            { id: "billing", label: "Billing", icon: <span aria-hidden>💳</span> },
          ]}
        />
      ) : null}
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>Панель</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.PanelSwitch
            sections={{
              users: (
                <Sidebar.NavPanelBody>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton type="button" active>
                        <Sidebar.MenuLabel>Учётные записи</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.NavPanelBody>
              ),
              billing: (
                <Sidebar.NavPanelBody>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton type="button" active>
                        <Sidebar.MenuLabel>Счета</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.NavPanelBody>
              ),
            }}
          />
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

### Маршруты и `useSidebarNavTo`

SPA с React Router: двухуровневая навигация и короткие пути внутри раздела.

```tsx
import { Sidebar, useSidebarNavTo } from "prime-ui-kit";

function PanelRoutes() {
  const toList = useSidebarNavTo("list");
  const toNew = useSidebarNavTo("new");

  return (
    <Sidebar.NavPanelBody>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuRouterLink to={toList} end>
            <Sidebar.MenuLabel>Все заявки</Sidebar.MenuLabel>
          </Sidebar.MenuRouterLink>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuRouterLink to={toNew}>
            <Sidebar.MenuLabel>Новая</Sidebar.MenuLabel>
          </Sidebar.MenuRouterLink>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.NavPanelBody>
  );
}

export function TicketsSidebar() {
  return (
    <Sidebar.Root variant="double" defaultActiveSection="desk" aria-label="Заявки">
      <Sidebar.ContextBar
        items={[
          { id: "desk", label: "Desk", icon: <span aria-hidden>📋</span> },
          { id: "archive", label: "Archive", icon: <span aria-hidden>🗄</span> },
        ]}
      />
      <Sidebar.NavPanel>
        <Sidebar.Content>
          <Sidebar.PanelSwitch
            sections={{
              desk: <PanelRoutes />,
              archive: (
                <Sidebar.NavPanelBody>
                  <Sidebar.Text>Архивные обращения</Sidebar.Text>
                </Sidebar.NavPanelBody>
              ),
            }}
          />
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

## Анатомия

```
Sidebar.Root (контекст + aside)
├── Sidebar.ContextBar? (опционально при variant="double")
│   ├── [logo] ContextBarHeader
│   ├── ContextBarBody → список ContextItemButton (+ Tooltip из кита при items)
│   └── [footer] ContextBarFooter
└── Sidebar.NavPanel
    ├── Sidebar.Header
    │   └── Sidebar.HeaderRow → Sidebar.HeaderMain | Sidebar.ToggleButton
    ├── Sidebar.Content
    │   ├── Sidebar.PanelSwitch? (контент по activeSection)
    │   ├── Sidebar.NavCategory → Trigger, Label, Count, Panel, NavDocTree
    │   └── Sidebar.Group → GroupLabel, Menu → MenuItem → MenuButton | MenuLink | MenuRouterLink, MenuAction, MenuIcon, MenuLabel, MenuTrailing
    └── Sidebar.Footer → IdentityButton и др.
```

Плавающая кнопка открытия и подложка рендерятся на `Sidebar.Root` при закрытой панели в адаптивном режиме.

## API

### Sidebar.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Масштаб контролов и ширин колонок. |
| variant | `"simple" \| "double"` | из defaultVariant | Нет | Одна или две колонки. |
| defaultVariant | `"simple" \| "double"` | `"double"` | Нет | Начальный variant. |
| onVariantChange | `(v) => void` | — | Нет | Смена variant. |
| activeSection | `string` | — | Нет | Активный раздел верхнего яруса. |
| defaultActiveSection | `string` | — | Нет | Начальный раздел. |
| onActiveSectionChange | `(section: string) => void` | — | Нет | Уведомление о выборе раздела. |
| open | `boolean` | — | Нет | Контролируемое открытие панели. |
| defaultOpen | `boolean` | `true` (на широком viewport при responsive) | Нет | Начальное open. |
| onOpenChange | `(open: boolean) => void` | — | Нет | Смена open. |
| responsive | `boolean` | `true` | Нет | Поведение при max-width 64rem. |
| panelWidth | `"compact"` | — | Нет | Узкая панель. |
| sidebarSlot | `"page-nav"` | — | Нет | Режим в слоте рядом с контентом. |
| aria-label | `string` | `"Sidebar"` | Нет | Подпись aside. |
| className | `string` | — | Нет | Доп. класс. |
| children | `ReactNode` | — | Да | Разметка внутри корня. |

### Sidebar.ContextBar

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| items | `SidebarContextItem[]` | — | Нет | id, label, icon; опционально tooltip, ariaLabel, disabled. |
| activeSection | `string \| null` | из контекста | Нет | Подсветка пункта. |
| onSelectSection | `(id: string) => void` | контекст | Нет | Выбор раздела. |
| logo | `ReactNode` | — | Нет | Верх контекстной колонки. |
| footer | `ReactNode` | — | Нет | Низ колонки. |
| className, children, … | — | — | Нет | При отсутствии `items` — произвольная разметка в `nav`. |

### Sidebar.ContextItemButton

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| active | `boolean` | — | Нет | data-active. |
| asChild | `boolean` | `false` | Нет | Slot вместо button. |
| type | `"button" \| …` | `"button"` | Нет | Тип кнопки. |
| disabled | `boolean` | — | Нет | Блокировка. |

Остальные пропсы — как у `button` (или дочернего элемента при `asChild`).

### Sidebar.PanelSwitch

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| sections | `Record<string, ReactNode>` | — | Нет | Карта раздел → контент. |
| renderSection | `(activeSection) => ReactNode` | — | Нет | Приоритет над sections. |
| fallback | `ReactNode` | `null` | Нет | Если ключ не найден. |

### Sidebar.Footer

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| variant | `"plain" \| "inset"` | `"plain"` | Нет | Вариант отступов. |

### Sidebar.IdentityButton

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| leading | `ReactNode` | — | Нет | Слева. |
| title | `ReactNode` | — | Да | Основная строка. |
| subtitle | `ReactNode` | — | Нет | Вторая строка. |
| trailing | `ReactNode` | иконка | Нет | Справа. |

`children` не используется; остальное — атрибуты `button`.

### Sidebar.ToggleButton

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| openLabel | `string` | «Скрыть сайдбар» | Нет | aria-label при open. |
| closedLabel | `string` | «Открыть сайдбар» | Нет | aria-label при закрытии. |

Вызывает `toggleOpen` из контекста после `onClick`, если не `preventDefault`.

### Sidebar.MenuButton / MenuLink / MenuRouterLink

- **MenuButton** — `active`, `asChild`, `type`, `disabled` и пропсы `button`.
- **MenuLink** — `active` и пропсы `a`.
- **MenuRouterLink** — пропсы `NavLink` из react-router-dom (`to`, `className`, `end`, …); стили пункта меню накладываются поверх.

### Sidebar.MenuAction

Компактная кнопка в строке `MenuItem`; пропсы `button`.

### Прочие обёртки

`ContextBarHeader`, `ContextBarBody`, `ContextBarFooter`, `NavPanel`, `NavPanelBody`, `NavDocTree`, `NavPanelHeading`, `NavCategory`, `NavCategoryTrigger`, `NavCategoryLabel`, `NavCategoryCount`, `NavCategoryPanel`, `Header`, `HeaderRow`, `HeaderMain`, `Content`, `Group`, `GroupLabel`, `Menu`, `MenuItem`, `MenuIcon`, `MenuLabel`, `MenuTrailing`, `Text` — семантические контейнеры с `className`, `children` и стандартными HTML-атрибутами соответствующего элемента.

### useSidebarContext()

Возвращает: `size`, `variant`, `setVariant`, `activeSection`, `setActiveSection`, `open`, `setOpen`, `toggleOpen`. Должен вызываться под `Sidebar.Root`.

### useSidebarNavTo(pathWithinSection: string)

Возвращает строку пути: при `variant === "double"` и выбранном разделе — `/{activeSection}/{path}` (слэши в аргументе нормализуются), иначе путь от корня.

## Варианты

- **variant `simple`** — только `NavPanel`; контекстная колонка скрыта (`data-collapsed` на корне для стилей).
- **variant `double`** — `ContextBar` + `NavPanel`, между ними зазор по токенам.
- **panelWidth `compact`** — уже основная панель.
- **sidebarSlot `page-nav`** — отступы и высота для колонки в общем макете страницы.
- **Footer `inset`** — визуально «вдавленный» подвал.

## Состояния

- **open** — панель выдвинута; при `responsive` и узком окне — оверлей и фокусируемая подложка «Закрыть сайдбар».
- **disabled** на пунктах контекста и меню — сниженная непрозрачность, блокировка клика; в `asChild` пробрасывается `aria-disabled`.
- **active** на `MenuButton` / `MenuLink` или `aria-current` у `NavLink` — подсветка текущего пункта.
- Плавающая кнопка на корне при закрытой панели в адаптивном сценарии.

## Доступность (a11y)

- Корневой `aside` с настраиваемым `aria-label`.
- Подложка закрытия при оверлее получает доступное имя и фокус только когда видима.
- `ToggleButton` и плавающая кнопка меняют `aria-label` в зависимости от `open`.
- `ContextBar` с `items` оборачивает пункты в `Tooltip` для подписи; задавайте `ariaLabel` у элемента, если метка отличается от иконки.
- `MenuIcon`, `MenuTrailing` с `aria-hidden` там, где роль несёт `MenuLabel` или `aria-label` кнопки.

## Ограничения и заметки

- Порог адаптивности завязан на **ширину окна** (`matchMedia("(max-width: 64rem)")`), а не на ширину контейнера превью.
- `useSidebarNavTo` осмыслен в первую очередь при `variant="double"` и ненулевом `activeSection`.
- `MenuRouterLink` требует провайдера React Router выше по дереву.
- `onActiveSectionChange` не вызывается при сбросе активного раздела в `null` внутри контролируемого состояния.

## Связанные компоненты

- **Tooltip** — подписи к узким иконкам в `ContextBar` при использовании `items`.
- **Dropdown** — часто оборачивает `IdentityButton` для меню пользователя или темы.
- **Avatar** — в `IdentityButton.leading`.
- **Button** — действия снаружи сайдбара или в шапке приложения.
- **PageShell** — типичный потребитель `sidebarSlot="page-nav"`.
