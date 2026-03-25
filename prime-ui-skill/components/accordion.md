# Accordion

## Что это

Набор вложенных частей (`Root`, `Item`, `Header`, `Trigger`, `Content`, плюс слоты `Icon` и `Arrow`), который показывает список секций: по клику на триггер раскрывается связанный контент с анимацией высоты.

## Для чего нужен

- **Маркетинг и лендинги** — блок «вопрос–ответ» без отдельной страницы на каждый пункт: компактно на мобильных, без перегрузки скролла длинным текстом.
- **Настройки продукта и личный кабинет** — группы опций (уведомления, безопасность, оплата) в одной колонке, чтобы не строить глубокое меню на каждый подраздел.
- **Каталоги и заказы** — детали состава, доставки и условий в карточке заказа: покупатель раскрывает только интересующие разделы.
- **Базы знаний и внутренние порталы** — статьи с вложенными инструкциями: редактор держит единый стиль раскрытия и размер текста.
- **Админка и роли** — часть пунктов недоступна (`disabled` на `Item`), остальные остаются в том же списке без отдельного «заглушечного» экрана.
- **Боковые панели и узкие колонки** — корень можно растянуть на ширину сайдбара; `layout="separate"` визуально отделяет тяжёлые блоки.

## Юзкейсы

Импорт из пакета `prime-ui-kit`. Каждый фрагмент — другой экран и другой смысл, не только смена пропсов.

### Базовый

Страница доставки интернет-магазина: три типовых вопроса, один открыт по умолчанию, режим «только один открыт».

```tsx
import { Accordion } from "prime-ui-kit";

export function DeliveryFaqBlock() {
  return (
    <Accordion.Root type="single" size="m" defaultValue="time" layout="grouped">
      <Accordion.Item value="time">
        <Accordion.Header>
          <Accordion.Trigger>
            Сроки доставки по городу
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Курьер привозит заказ в день заказа или на следующий рабочий день до 22:00.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="pickup">
        <Accordion.Header>
          <Accordion.Trigger>
            Пункты самовывоза
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Выберите точку на карте при оформлении; хранение заказа — до 5 дней.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="return">
        <Accordion.Header>
          <Accordion.Trigger>
            Возврат без вопросов
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>14 дней на возврат товара надлежащего качества при сохранении упаковки.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

### С вариантами/размерами

Витрина справочника для врачей: крупный размер для сенсорных панелей в клинике, отдельные «карточки» по разделам специализаций.

```tsx
import { Accordion } from "prime-ui-kit";

export function ClinicReferenceAccordion() {
  return (
    <Accordion.Root type="single" size="xl" layout="separate" defaultValue="cardio">
      <Accordion.Item value="cardio">
        <Accordion.Header>
          <Accordion.Trigger>
            Кардиология — быстрые назначения
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Шаблоны назначений и контрольные визиты после стационара.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="ped">
        <Accordion.Header>
          <Accordion.Trigger>
            Педиатрия — вакцинация
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Календарь прививок и напоминания родителям в личном кабинете.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

### В контексте (форма / модал / сайдбар / …)

Вложенный блок в карточке проекта: несколько юридических и финансовых секций открыты одновременно для сверки договора.

```tsx
import { Accordion } from "prime-ui-kit";

export function ProjectLegalAccordion() {
  return (
    <section style={{ maxWidth: 560, padding: 16, borderRadius: 12, border: "1px solid var(--prime-sys-color-border-subtle, #e4e4e7)" }}>
      <h2 style={{ margin: "0 0 12px", fontSize: "1.125rem" }}>Проект «Северный склад»</h2>
      <Accordion.Root type="multiple" size="m" defaultValue={["scope", "budget"]} layout="grouped">
        <Accordion.Item value="scope">
          <Accordion.Header>
            <Accordion.Trigger>
              Объём работ
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Поставка оборудования, монтаж линий, пусконаладка — 90 календарных дней.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="budget">
          <Accordion.Header>
            <Accordion.Trigger>
              Бюджет и этапы оплаты
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>40% аванс, 40% после монтажа, 20% после приёмки актом.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="risk">
          <Accordion.Header>
            <Accordion.Trigger>
              Штрафы и ответственность
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Просрочка поставки — 0,1% в день, не более 10% от контракта.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </section>
  );
}
```

### Контролируемый режим

Панель диспетчера: кнопки сценариев сбрасывают или переключают открытую зону трека без клика по заголовку.

```tsx
import * as React from "react";
import { Accordion, Button } from "prime-ui-kit";

export function DispatchControlledAccordion() {
  const [panel, setPanel] = React.useState<string>("fleet");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setPanel("fleet")}>
          Автопарк
        </Button.Root>
        <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setPanel("routes")}>
          Маршруты
        </Button.Root>
        <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setPanel("")}>
          Свернуть
        </Button.Root>
      </div>
      <Accordion.Root type="single" size="m" value={panel} onValueChange={(v) => typeof v === "string" && setPanel(v)}>
        <Accordion.Item value="fleet">
          <Accordion.Header>
            <Accordion.Trigger>
              Статус машин
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>12 на линии, 3 на ТО, 1 в резерве.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="routes">
          <Accordion.Header>
            <Accordion.Trigger>
              Задержки на маршрутах
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Север: +18 мин из‑за ремонта моста; юг: по графику.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
```

## Анатомия

`Accordion.Root` — контейнер с контекстом размера и состояния открытых `value`.

Для каждого пункта:

`Accordion.Item` → `Accordion.Header` → `Accordion.Trigger` (кнопка; внутри часто `Accordion.Icon`, текст, `Accordion.Arrow`) → рядом по дереву `Accordion.Content` (внешний узел в DOM — `section`, внутренний блок с отступами для текста).

## API

### Accordion.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| type | `"single" \| "multiple"` | `"single"` | Нет | Один открытый пункт или несколько. |
| value | `string \| string[]` | — | Нет | Контролируемое состояние: строка или массив id открытых пунктов. |
| defaultValue | `string \| string[]` | — | Нет | Начальное раскрытие без `value`. |
| onValueChange | `(value: string \| string[]) => void` | — | Нет | В `single` в колбэк передаётся строка; в `multiple` — массив. |
| collapsible | `boolean` | `true` | Нет | Только `single`: `false` запрещает закрыть единственный открытый пункт. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Токены текста, иконок и отступов. |
| layout | `"grouped" \| "separate"` | `"grouped"` | Нет | Общая рамка или отдельные карточки. |
| className | `string` | — | Нет | Класс корневого `div`. |
| children | `React.ReactNode` | — | Нет | Набор `Accordion.Item`. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Прочие атрибуты корня. |

### Accordion.Item

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| value | `string` | — | Да | Уникальный id в пределах одного Root. |
| disabled | `boolean` | `false` | Нет | Пункт не раскрывается, триггер отключён. |
| className | `string` | — | Нет | Класс обёртки пункта. |
| children | `React.ReactNode` | — | Нет | Заголовок и контент. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Атрибуты на `div` пункта. |

### Accordion.Header

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Класс заголовка. |
| children | `React.ReactNode` | — | Нет | Обычно один `Accordion.Trigger`. |
| …rest | `React.HTMLAttributes<HTMLHeadingElement>` | — | Нет | Рендерится как `h3`. |

### Accordion.Trigger

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | Нет | Рекомендуется `button`, чтобы не сабмитить формы. |
| className | `string` | — | Нет | Класс кнопки. |
| children | `React.ReactNode` | — | Нет | Подпись, иконки, стрелка. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | Нет | `onClick` вызывается первым; при `preventDefault` переключение отменяется. |

### Accordion.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| as | `React.ElementType` | `"div"` | Нет | Полиморфная оболочка (например компонент иконки или `span`). |
| className | `string` | — | Нет | Класс оболочки. |
| children | `React.ReactNode` | — | Нет | Содержимое при `as="span"` или подобном. |
| …rest | Зависит от `as` | — | Нет | Пропсы выбранного элемента, кроме `as` и `className`. |

### Accordion.Arrow

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| openIcon | `React.ElementType` | `ChevronDown` | Нет | Иконка «закрыто» или единственная при повороте. |
| closeIcon | `React.ElementType` | — | Нет | Если задана и отличается от `openIcon` — показ двух иконок без поворота. |
| className | `string` | — | Нет | Класс `span`-обёртки. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | Нет | Иконки помечены `aria-hidden`. |

### Accordion.Content

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|-------------|----------|
| className | `string` | — | Нет | Класс **внутреннего** блока с padding и типографикой. |
| style | `React.CSSProperties` | — | Нет | Сливается со стилем внешнего узла (в т.ч. переменная высоты анимации). |
| children | `React.ReactNode` | — | Нет | Текст и вложенная разметка. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Нет | Попадает на внешний узел (`section` в DOM); `aria-labelledby` и `aria-hidden` выставляются из контекста. |

## Варианты

Отдельного пропа `variant` нет; визуальные отличия задаются:

- **`layout`**: `grouped` — единый бордер и общий фон; `separate` — каждый `Item` как карточка с зазором.
- **`size`**: дискретные ступени `s`–`xl` для текста триггера, иконок и полей контента.
- **`type`**: не меняет палитру, но меняет логику: в `multiple` допускается несколько открытых `value` и `defaultValue` в виде массива.

## Состояния

- **Открыт / закрыт** — хранится в корне; на `Item`, `Trigger` и обёртке контента выставляются `data-state="open" | "closed"`.
- **Пункт отключён** — `disabled` на `Item`: `data-disabled`, триггер `disabled`, клик не обрабатывается.
- **Неконтролируемый режим** — только `defaultValue` / внутренний стейт.
- **Контролируемый** — передан `value`; обновление через `onValueChange`.
- **`collapsible={false}`** в `single` — нельзя оставить список полностью закрытым после первого открытия.

## Доступность (a11y)

- Триггер — нативная кнопка: активация с клавиатуры Enter/Пробел.
- У кнопки есть `aria-expanded` и `aria-controls`, у области контента — `aria-labelledby` и `aria-hidden` в зависимости от открытости.
- Иконки в `Accordion.Arrow` скрыты от вспомогательных технологий через `aria-hidden`; смысл должен быть в тексте триггера или отдельной подписи.
- Видимый фокус на триггере — стиль `:focus-visible` в теме кита.

## Ограничения и заметки

- Это не табы: не управляет панелями по «вкладкам» с общей панелью без повторения заголовков — для переключения без вертикального списка смотрите `Tabs`.
- Высота анимации считается через `ResizeObserver` и измерение контента; тяжёлый контент внутри (большие списки, графики) может влиять на производительность при частых изменениях размера.
- Тип экспорта `AccordionContentProps` основан на `HTMLAttributes<HTMLDivElement>`, хотя в разметке внешний узел — `section`; при селекторах и тестах ориентируйтесь на фактический DOM.
- Вложенный аккордеон внутри контента возможен разметкой, но клавиатурная навигация и читаемость страдают — для глубокой иерархии предпочтительнее плоский список или дерево.

## Связанные компоненты

- **Typography** — согласованные отступы и кегль внутри `Accordion.Content`.
- **Button** — внешние действия, синхронизированные с контролируемым `value` корня.
- **Tabs** — альтернатива, когда нужно переключать панели без повторяющегося вертикального списка заголовков.
- **Modal / Drawer** — часто содержат компактный аккордеон для длинных форм в ограниченной высоте.
