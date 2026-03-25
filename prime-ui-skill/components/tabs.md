# Tabs

## Что это

Набор составных частей для вкладок: список переключателей, панели контента и слоты под иконку и подпись, с одной активной вкладкой за раз.

## Для чего нужен

- **Кабинет и настройки:** разделить профиль, безопасность, уведомления и биллинг без перехода на отдельные URL.
- **Аналитика и отчёты:** переключать «Обзор», «Динамика», «Сырые данные» в одном экране дашборда.
- **Каталог и витрина:** вкладки «Описание», «Характеристики», «Отзывы» у карточки товара.
- **Редактор и документы:** боковая колонка с вертикальными вкладками «Структура», «Свойства», «История».
- **Онбординг и мастера:** контролируемый `value` из шага мастера, чтобы заголовок шага и список вкладок оставались согласованными.
- **Маркетинговые лендинги:** горизонтальные вкладки на всю ширину блока для сегментов аудитории или тарифов.

## Юзкейсы

Каждый пример — отдельная задача и разметка; общий импорт: `import { Tabs } from "prime-ui-kit"` (или из `@/components/tabs/Tabs` в монорепозитории).

### Базовый

Горизонтальные вкладки по умолчанию: пользователь выбирает раздел, под списком показывается одна панель.

```tsx
export function ProductTabs() {
  return (
    <Tabs.Root defaultValue="desc">
      <Tabs.List>
        <Tabs.Tab value="desc">
          <Tabs.Label>Описание</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="spec">
          <Tabs.Label>Характеристики</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="reviews">
          <Tabs.Label>Отзывы</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="desc">
        <p>Текст описания товара.</p>
      </Tabs.Panel>
      <Tabs.Panel value="spec">
        <ul>
          <li>Вес: 420 г</li>
          <li>Материал: алюминий</li>
        </ul>
      </Tabs.Panel>
      <Tabs.Panel value="reviews">
        <p>Отзывы покупателей.</p>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
```

### С вариантами/размерами

Визуального `variant` у Tabs нет; плотность и кегль задаются осью `size` — например компактные вкладки в плотной таблице отчёта.

```tsx
export function ReportToolbarTabs() {
  return (
    <Tabs.Root defaultValue="day" size="s">
      <Tabs.List>
        <Tabs.Tab value="day">
          <Tabs.Label>День</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="week">
          <Tabs.Label>Неделя</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="month">
          <Tabs.Label>Месяц</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="day">Срез за сегодня.</Tabs.Panel>
      <Tabs.Panel value="week">Срез за 7 дней.</Tabs.Panel>
      <Tabs.Panel value="month">Срез за 30 дней.</Tabs.Panel>
    </Tabs.Root>
  );
}
```

### В контексте (форма / модал / сайдбар)

Вертикальный список слева от области контента — типичный каркас настроек в боковой колонке страницы (не модальное окно, а постоянная колонка).

```tsx
export function SettingsColumn() {
  return (
    <Tabs.Root defaultValue="profile" orientation="vertical">
      <Tabs.List>
        <Tabs.Tab value="profile">
          <Tabs.Label>Профиль</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="team">
          <Tabs.Label>Команда</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="api" disabled>
          <Tabs.Label>API (скоро)</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile">
        <p>Имя, аватар, контакты.</p>
      </Tabs.Panel>
      <Tabs.Panel value="team">
        <p>Список участников и роли.</p>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
```

### Контролируемый режим

Состояние снаружи: удобно связать с параметром поиска, стором или шагом сценария, не дублируя источник правды внутри Tabs.

```tsx
import * as React from "react";

export function WizardStepTabs() {
  const [step, setStep] = React.useState<"basics" | "delivery" | "pay">("basics");

  return (
    <>
      <Tabs.Root value={step} onValueChange={(v) => setStep(v as typeof step)}>
        <Tabs.List>
          <Tabs.Tab value="basics">
            <Tabs.Label>Основное</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="delivery">
            <Tabs.Label>Доставка</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="pay">
            <Tabs.Label>Оплата</Tabs.Label>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="basics">Шаг 1: контактные данные.</Tabs.Panel>
        <Tabs.Panel value="delivery">Шаг 2: адрес и слот.</Tabs.Panel>
        <Tabs.Panel value="pay">Шаг 3: способ оплаты.</Tabs.Panel>
      </Tabs.Root>
      <p>Текущий шаг в родителе: {step}</p>
    </>
  );
}
```

## Анатомия

```
Tabs.Root
├── Tabs.List          (role="tablist", индикатор, обработка клавиш)
│   ├── Tabs.Tab[]     (role="tab", кнопка)
│   │   ├── Tabs.Icon? (опционально, aria-hidden)
│   │   └── Tabs.Label? / произвольные узлы
│   └── (внутренний индикатор)
└── Tabs.Panel[]       (role="tabpanel", рендер только для активного value)
```

## API

### Tabs.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| value | string | — | Нет | Активная вкладка (контролируемый режим). |
| defaultValue | string | "" | Нет | Начальное значение без `value`. |
| onValueChange | (value: string) => void | — | Нет | Смена вкладки. |
| orientation | `"horizontal"` \| `"vertical"` | `"horizontal"` | Нет | Ось списка и клавиатурные стрелки. |
| size | `"s"` \| `"m"` \| `"l"` \| `"xl"` | `"m"` | Нет | Размер триггеров и типографики панели. |
| children | React.ReactNode | — | Да | List, Tab, Panel. |
| className | string | — | Нет | Класс обёртки-корня. |

### Tabs.List

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | React.ReactNode | — | Да | Триггеры `Tabs.Tab`. |
| className | string | — | Нет | Класс контейнера tablist. |

### Tabs.Tab

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| value | string | — | Да | Связь с `Tabs.Panel` того же `value`. |
| disabled | boolean | false | Нет | Не выбирается, пропускается в цикле фокуса. |
| children | React.ReactNode | — | Да | Содержимое кнопки. |
| className | string | — | Нет | Класс кнопки. |

### Tabs.Icon

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | React.ReactNode | — | Да | Иконка. |
| className | string | — | Нет | Класс span. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | Нет | Прочие атрибуты span. |

### Tabs.Label

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | React.ReactNode | — | Да | Подпись. |
| className | string | — | Нет | Класс span. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | Нет | Прочие атрибуты span. |

### Tabs.Panel

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| value | string | — | Да | Совпадение с активной вкладкой. |
| children | React.ReactNode | — | Да | Контент панели. |
| className | string | — | Нет | Класс панели. |

## Варианты

Отдельного пропа `variant` нет. Визуал определяется:

- **`size`** — четыре ступени контрольных токенов (высота триггера, кегль, отступы, иконка).
- **`orientation`** — горизонтальная полоса с индикатором снизу или вертикальная с индикатором справа.

Дополнительную стилизацию дают `className` на корне, списке и отдельных вкладках.

## Состояния

- **Активная вкладка** — `aria-selected`, индикатор подстраивается под геометрию триггера.
- **Неактивные** — `tabIndex={-1}` на кнопках, фокус по Tab попадает на активную.
- **`disabled`** на `Tabs.Tab` — нативный `disabled`, `data-disabled`, исключение из обхода стрелками.
- **Неконтролируемый режим** — задать `defaultValue` на `Tabs.Root`.
- **Контролируемый** — `value` + `onValueChange`; без `value` внутреннее состояние из `useControllableState`.

## Доступность (a11y)

- Роли `tablist`, `tab`, `tabpanel` и связи `aria-controls` / `aria-labelledby`.
- **`aria-orientation`** на списке совпадает с пропом `orientation`.
- Клавиатура на фокусе внутри `Tabs.List`: **стрелки** вдоль оси (горизонтально — влево/вправо, вертикально — вверх/вниз), **Home** — первая доступная вкладка, **End** — последняя; недоступные вкладки пропускаются.
- Первая иконка в активной вкладке визуально выделяется; смысл вкладки должен читаться по тексту в `Tabs.Label` или явной подписи, если иконка одна.

## Ограничения и заметки

- Одновременно видна только одна панель; **неактивные `Tabs.Panel` не рендерятся** (`return null`) — тяжёлый контент не стоит монтировать в скрытых панелях без ленивой подгрузки на уровне приложения.
- Нет встроенного **URL-синка** и **asChild**: вкладка всегда `<button type="button">`.
- Для каждого `value` с панелью нужна пара Tab + Panel; панель без вкладки нарушает ожидаемую модель ARIA.
- Растягивание на всю ширину контейнера — через **CSS/className** на корне и flex-раскладку на вкладках, отдельного пропа нет.

## Связанные компоненты

- **Icon** — глифы внутри `Tabs.Icon`.
- **Typography** — текст внутри панелей наследует кегль от `size` корня (с оговорками для ссылок и кода в разметке панели).
- **SegmentedControl** — альтернатива для короткого выбора из 2–4 опций без тяжёлых панелей.
- **Breadcrumb** — навигация по иерархии страниц, а не переключение секций внутри одной страницы.
