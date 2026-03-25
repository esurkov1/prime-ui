# ColorPicker

## Что это

Составной виджет выбора цвета в интерфейсе prime-ui-kit: область на двух каналах, слайдеры каналов, палитра пресетов, ввод hex и полоса каналов с пипеткой; состояние цвета синхронизируется через примитивы **react-aria-components** (модель `Color`, разметка и a11y из React Aria).

## Для чего нужен

- **Бренд и темы:** настройка основного, акцентного и фонового цвета продукта с предпросмотром и пресетами палитры.
- **Контент и редакторы:** выбор цвета текста, заливки блока или обводки в визуальном редакторе без привязки к «настройкам темы».
- **Данные и визуализация:** цвет серии на графике, легенды и условные подсветки в отчётах, когда значение уходит в конфиг дашборда.
- **E-commerce и витрина:** персонализация товара (цвет варианта), согласование оттенка с фото карточки.
- **Формы заявок и анкет:** «любимый цвет», визуальные метки статуса или категории с понятным цветовым кодом.
- **Встраивание в оверлей:** компактная панель в поповере от кнопки с `TriggerSwatch`, чтобы не занимать место на основном экране.

## Юзкейсы

Каждый пример рассчитан на другой контекст продукта и другую комбинацию API.

### Базовый

Встроенная панель на странице настроек: пользователь сразу видит область HSL, оттенок, альфу, переключение формата и пресеты.

```tsx
import { Pipette } from "lucide-react";
import { ColorPicker } from "prime-ui-kit";

const PRESETS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444"];

export function BrandAccentField() {
  return (
    <ColorPicker.Root defaultValue="hsl(220, 90%, 56%)">
      <ColorPicker.FormatProvider defaultFormat="hsl">
        <ColorPicker.FormatSelect />
        <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
          <ColorPicker.AreaThumb />
        </ColorPicker.Area>
        <ColorPicker.Slider channel="hue" colorSpace="hsl">
          <ColorPicker.SliderMeta label="Оттенок" />
          <ColorPicker.SliderTrack>
            <ColorPicker.Thumb />
          </ColorPicker.SliderTrack>
        </ColorPicker.Slider>
        <ColorPicker.Slider channel="alpha">
          <ColorPicker.SliderMeta label="Непрозрачность" />
          <ColorPicker.SliderTrack>
            <ColorPicker.Thumb />
          </ColorPicker.SliderTrack>
        </ColorPicker.Slider>
        <ColorPicker.ChannelStrip
          pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
        />
        <ColorPicker.SwatchPicker aria-label="Пресеты бренда">
          {PRESETS.map((c) => (
            <ColorPicker.SwatchPickerItem key={c} color={c}>
              <ColorPicker.Swatch />
            </ColorPicker.SwatchPickerItem>
          ))}
        </ColorPicker.SwatchPicker>
      </ColorPicker.FormatProvider>
    </ColorPicker.Root>
  );
}
```

### С вариантами / размерами

Маркетинговый лендинг: редактор блока CTA с разными размерами поля hex для мобильного и десктопа (несколько корней, в каждом только `HexInput`).

```tsx
import { ColorPicker } from "prime-ui-kit";

export function CtaHexRow() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end" }}>
      <ColorPicker.Root defaultValue="#2563eb">
        <ColorPicker.HexInput label="Кнопка (s)" size="s" />
      </ColorPicker.Root>
      <ColorPicker.Root defaultValue="#2563eb">
        <ColorPicker.HexInput label="Кнопка (xl)" size="xl" />
      </ColorPicker.Root>
    </div>
  );
}
```

### В контексте (поповер)

Документооборот или задачи: цвет метки в карточке — панель открывается из кнопки с квадратом текущего цвета (`TriggerSwatch`) рядом с китовым `Popover`.

```tsx
import { Pipette } from "lucide-react";
import { Button, ColorPicker, Popover } from "prime-ui-kit";

function PickerBody() {
  return (
    <ColorPicker.FormatProvider>
      <ColorPicker.FormatSelect />
      <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
        <ColorPicker.AreaThumb />
      </ColorPicker.Area>
      <ColorPicker.Slider channel="hue" colorSpace="hsl">
        <ColorPicker.SliderTrack>
          <ColorPicker.Thumb />
        </ColorPicker.SliderTrack>
      </ColorPicker.Slider>
      <ColorPicker.ChannelStrip
        pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
      />
    </ColorPicker.FormatProvider>
  );
}

export function TaskLabelColorTrigger() {
  return (
    <ColorPicker.Root defaultValue="hsl(280, 70%, 55%)">
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            <ColorPicker.TriggerSwatch />
            Цвет метки
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <Popover.Inset>
            <PickerBody />
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}
```

### Композиция с Popover

Выбор цвета во всплывающей панели; индикатор на кнопке обновляется при изменении цвета через область, слайдеры или пресеты.

```tsx
import { Pipette } from "lucide-react";
import * as React from "react";

import { Button, ColorPicker, parseColor, Popover } from "prime-ui-kit";
import type { Color } from "react-aria-components";

const PRESETS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#8b5cf6"];

export function ColorPickerPopoverField() {
  const [color, setColor] = React.useState<Color | undefined>(parseColor("#3b82f6"));
  const [open, setOpen] = React.useState(false);

  const handleColorChange = (newColor: Color) => {
    setColor(newColor);
  };

  const colorString = color?.toString("css") ?? "#000000";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          <span
            style={{
              display: "inline-block",
              width: "1rem",
              height: "1rem",
              borderRadius: "var(--prime-sys-radius-s)",
              backgroundColor: colorString,
              border: "1px solid var(--prime-sys-color-border-primary)",
            }}
          />
          {colorString}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <Popover.Inset padding="x2" gap="x3">
          <ColorPicker.Root value={color} onChange={handleColorChange}>
            <ColorPicker.FormatProvider>
              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>
              <ColorPicker.Slider channel="hue" colorSpace="hsl">
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
              <ColorPicker.Slider channel="alpha">
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
              <ColorPicker.ChannelStrip
                pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
              />
              <ColorPicker.SwatchPicker aria-label="Быстрые цвета">
                {PRESETS.map((c) => (
                  <ColorPicker.SwatchPickerItem key={c} color={c}>
                    <ColorPicker.Swatch />
                  </ColorPicker.SwatchPickerItem>
                ))}
              </ColorPicker.SwatchPicker>
            </ColorPicker.FormatProvider>
          </ColorPicker.Root>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

### Контролируемый режим

Дашборд: цвет сохраняется в состоянии страницы и сериализуется в API; используются `value`, `onChange` и `parseColor`.

```tsx
import * as React from "react";
import { Pipette } from "lucide-react";
import { ColorPicker, parseColor } from "prime-ui-kit";
import type { Color } from "react-aria-components";

export function ChartSeriesColorControl() {
  const [color, setColor] = React.useState<Color>(() => parseColor("hsl(200, 80%, 50%)"));

  return (
    <div>
      <p>Серия A: {color.toString("css")}</p>
      <ColorPicker.Root value={color} onChange={setColor}>
        <ColorPicker.FormatProvider>
          <ColorPicker.FormatSelect />
          <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
            <ColorPicker.AreaThumb />
          </ColorPicker.Area>
          <ColorPicker.Slider channel="hue" colorSpace="hsl">
            <ColorPicker.SliderMeta label="Оттенок" />
            <ColorPicker.SliderTrack>
              <ColorPicker.Thumb />
            </ColorPicker.SliderTrack>
          </ColorPicker.Slider>
          <ColorPicker.ChannelStrip
            pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
          />
        </ColorPicker.FormatProvider>
      </ColorPicker.Root>
    </div>
  );
}
```

## Анатомия

```
ColorPicker.Root
├── ColorPicker.FormatProvider (нужен для FormatSelect и ChannelStrip)
│   ├── ColorPicker.FormatSelect
│   ├── ColorPicker.Area → ColorPicker.AreaThumb
│   ├── ColorPicker.Slider → ColorPicker.SliderMeta?, ColorPicker.SliderTrack → ColorPicker.Thumb
│   ├── ColorPicker.ChannelStrip (pipetteIcon обязателен)
│   ├── ColorPicker.HexInput | ColorPicker.Field + Input (react-aria-components)
│   └── ColorPicker.SwatchPicker → ColorPicker.SwatchPickerItem → ColorPicker.Swatch
├── ColorPicker.TriggerSwatch (рядом с триггером поповера, внутри того же Root)
└── ColorPicker.EyeDropperButton (отдельно или внутри ChannelStrip)
```

`parseColor` экспортируется из модуля рядом с `ColorPicker` (re-export из react-aria-components).

## API

### ColorPicker.Root

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| value | `string \| Color` | — | Нет | Контролируемое значение цвета |
| defaultValue | `string \| Color` | — | Нет | Начальное значение без внешнего state |
| onChange | `(color: Color) => void` | — | Нет | Смена цвета из любого вложенного контрола |
| children | `ReactNode \| (props) => ReactNode` | — | Да | Разметка панели; в render-функции доступен `color` |
| className | `string \| fn` | — | Нет | Стили корня RAC ColorPicker |
| slot | `string \| null` | — | Нет | Слот для slotted context |
| …rest | RAC + DOM | — | Нет | Остальные атрибуты по документации react-aria-components |

У корня в типах нет единого `isDisabled`: отключение задаётся на отдельных частях (`Slider`, `SwatchPickerItem`, обёртка `fieldset disabled` и т.д.).

### ColorPicker.FormatProvider

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| children | `ReactNode` | — | Да | Дочерние контролы формата и полосы каналов |
| defaultFormat | `"hsl" \| "rgb" \| "hex"` | `"hsl"` | Нет | Начальный формат для ChannelStrip / Select |

### ColorPicker.FormatSelect

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | Нет | Класс обёртки вокруг китового Select |

Работает только внутри `FormatProvider`.

### ColorPicker.ChannelStrip

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| pipetteIcon | `ReactNode` | — | Да | Иконка в кнопке пипетки (часто `Button.Icon`) |
| className | `string` | — | Нет | Класс полосы |

### ColorPicker.HexInput

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Нет | Размер китового Input |
| label | `ReactNode` | `"Hex"` | Нет | Подпись поля |
| className | `string` | — | Нет | Класс `Input.Root` |

### ColorPicker.TriggerSwatch

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| className | `string` | — | Нет | Класс квадрата превью (заливка через SVG) |

### ColorPicker.SliderMeta

| Проп | Тип | По умолчанию | Обязательный | Описание |
|------|-----|--------------|--------------|----------|
| label | `ReactNode` | — | Да | Текст слева; справа — значение через внутренний Output |

### ColorPicker.EyeDropperButton

Почти все пропсы китовой `Button.Root`, кроме зафиксированных `variant`, `mode`, `size`. Дети — обычно `Button.Icon`. При отсутствии Web API `EyeDropper` рендерится неактивная кнопка с `aria-hidden`.

### ColorPicker.Area, AreaThumb, Slider, SliderTrack, Thumb, Output, Field, SwatchPicker, SwatchPickerItem, Swatch

Обёртки над соответствующими компонентами react-aria-components со стилями кита. Ключевые пропсы:

- **Area:** `colorSpace`, `xChannel`, `yChannel`, `isDisabled`, `className`, …
- **Slider:** `channel`, опционально `colorSpace`, `orientation`, `isDisabled`; на корне выставляется `data-size="m"`.
- **SwatchPicker:** `value` / `defaultValue` / `onChange` для выбранного пресета, `layout`, `aria-label`, …
- **SwatchPickerItem:** `color` (обязательный), `isDisabled`, …
- **Field:** опционально `channel` и `colorSpace`; внутри — как минимум `Input` из react-aria-components.

Полный перечень — в типах `react-aria-components` для одноимённых примитивов.

### parseColor(value: string): Color

Разбор строки CSS / hex в объект `Color` для `useState` или для сравнения значений.

## Варианты

- **Формат каналов (`FormatProvider` + `FormatSelect`):** `hsl` (оттенок, насыщенность, яркость, альфа), `rgb`, единое поле `hex`.
- **Раскладка пресетов:** у `SwatchPicker` проп `layout`: `grid` или `stack`.
- **Размер поля hex:** только у `HexInput` (`size` как у китового Input); слайдеры цвета в текущей реализации с фиксированным визуальным ярусом `m`.

## Состояния

- Отдельный **пресет** недоступен: `isDisabled` на `SwatchPickerItem`.
- Отдельный **слайдер** или **область:** `isDisabled` на `ColorPicker.Slider` / `ColorPicker.Area`.
- **Пипетка:** при отсутствии API браузера — визуально отключённая кнопка без участия в tab-порядке смыслового выбора цвета.
- Невалидный ввод в hex-полях: при потере фокуса или Enter значение откатывается к последнему валидному цвету из контекста.

## Доступность (a11y)

- Область и слайдеры получают роли и клавиатурную навигацию из React Aria (стрелки, Home/End, Page Up/Down по смыслу слайдера).
- У `SwatchPicker` нужен доступное имя (`aria-label` или связанный label).
- `TriggerSwatch` помечен `aria-hidden`: смысл выбора цвета должен быть у триггера (текст кнопки или `aria-label`).
- Подписи полей каналов в полосе и в `HexInput` / `Field` задаются через `label`, `aria-label` или видимый текст рядом.

## Ограничения и заметки

- Корень **не** объявляет в типах общий `isDisabled` — отключайте части явно или используйте нативный `fieldset disabled` осознанно (влияет на все поля внутри).
- `FormatSelect` и `ChannelStrip` **обязаны** жить под `FormatProvider`.
- `EyeDropper` поддерживается не во всех браузерах; поведение кнопки уже учитывает отсутствие API.
- Тип `Color` и `parseColor` приходят из react-aria-components; при жёсткой типизации импортируйте `Color` оттуда же.

## Связанные компоненты

- **Popover** — компактное открытие панели от триггера с `TriggerSwatch`.
- **Button** и **Button.Icon** — триггер и иконка пипетки на `EyeDropperButton` / в `ChannelStrip`.
- **Input** (кит) — внутри `HexInput`; **Input** из react-aria-components — внутри `Field`.
- **Select** (кит) — внутри реализации `FormatSelect`.
- **Typography** — подписи секций и вспомогательный текст рядом с панелью.
