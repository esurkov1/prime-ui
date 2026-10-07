import BadgeIconsExample from "@/components/badge/examples/icons";
import badgeIconsSource from "@/components/badge/examples/icons.tsx?raw";
import BadgeInControlsExample from "@/components/badge/examples/in-controls";
import badgeInControlsSource from "@/components/badge/examples/in-controls.tsx?raw";
import BadgeOrderListExample from "@/components/badge/examples/order-list";
import badgeOrderListSource from "@/components/badge/examples/order-list.tsx?raw";
import BadgePaletteExample from "@/components/badge/examples/palette";
import badgePaletteSource from "@/components/badge/examples/palette.tsx?raw";
import BadgeSizesExample from "@/components/badge/examples/sizes";
import badgeSizesSource from "@/components/badge/examples/sizes.tsx?raw";
import BadgeStatesExample from "@/components/badge/examples/states";
import badgeStatesSource from "@/components/badge/examples/states.tsx?raw";
import BadgeSurfacesExample from "@/components/badge/examples/surfaces";
import badgeSurfacesSource from "@/components/badge/examples/surfaces.tsx?raw";
import BadgeVariantsExample from "@/components/badge/examples/variants";
import badgeVariantsSource from "@/components/badge/examples/variants.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const badgeRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "color",
    type: '"gray" | "blue" | "sky" | "teal" | "green" | "yellow" | "orange" | "red" | "pink" | "purple"',
    defaultValue: '"gray"',
    required: "Нет",
    description:
      "Оттенок палитры (--prime-color-palette-<hue>-*), одинаково работает в светлой и тёмной теме. Для категорий, а не статуса.",
  },
  {
    prop: "variant",
    type: '"soft" | "solid" | "outline"',
    defaultValue: '"soft"',
    required: "Нет",
    description: "soft — мягкая заливка, solid — насыщенная, outline — тонкий внутренний контур.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: 'из контрола или "m"',
    required: "Нет",
    description:
      "Высота 16 · 20 · 24 · 28 · 32 px. Без size внутри Button, Input и других контролов бейдж на ярус меньше контрола (m → s, xl → l, s/xs → xs). Явный size всегда побеждает.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Приглушённый вид: fill-muted и text-disabled (data-disabled).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Текст, Badge.Dot, Badge.Icon. Только Badge.Icon без текста — квадратный бейдж (добавьте aria-label).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты span: className, id, aria-*, data-*. ref передаётся на span.",
  },
];

const badgeIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Иконка; размер подстраивается под ярус бейджа (12–16 px).",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "className и прочие атрибуты span-обёртки.",
  },
];

const badgeDotApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className и атрибуты span. Точка в currentColor, всегда aria-hidden.",
  },
];

export default function BadgeSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Badge</PageContent.Title>
        <PageContent.Description measure="full">
          Компактная неинтерактивная метка: статус, категория, окружение, счётчик. По умолчанию
          мягкая заливка без обводки, цифры моноширинные. Для удаляемых и фильтр-чипов —{" "}
          <code>Tag</code>, для клавиш — <code>Kbd</code>, для действий — <code>Button</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Пять ярусов <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> ·{" "}
              <code>xl</code> — 16, 20, 24, 28 и 32 px. Значение по умолчанию — <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={badgeSizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <BadgeSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Варианты</DemoSectionTitle>
            <DemoDescription>
              <code>soft</code> (по умолчанию) — основной вариант для меток в таблицах и списках;{" "}
              <code>solid</code> — для одного акцентного бейджа на экране; <code>outline</code> —
              без заливки. Точка состояния — часть <code>Badge.Dot</code>; присутствие человека
              показывает <code>Avatar.Status</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={badgeVariantsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <BadgeVariantsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Палитра</DemoSectionTitle>
            <DemoDescription>
              Десять оттенков <code>color</code>. Цвет только дублирует смысл — текст бейджа должен
              читаться и без него.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={badgePaletteSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <BadgePaletteExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Бейдж не реагирует на наведение и не получает фокус — это статичный текст. Из
              состояний есть только <code>disabled</code>: серая заливка и приглушённый текст для
              любого варианта.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={badgeStatesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <BadgeStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Точка и иконки</DemoSectionTitle>
            <DemoDescription>
              <code>Badge.Dot</code> — маркер в цвете текста, <code>Badge.Icon</code> — иконка слева
              или справа. Если внутри только <code>Badge.Icon</code>, бейдж становится квадратным;
              дайте ему <code>aria-label</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={badgeIconsSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <BadgeIconsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Внутри контролов</DemoSectionTitle>
            <DemoDescription>
              Без <code>size</code> бейдж внутри <code>Button</code> или <code>Input</code>{" "}
              автоматически берёт ярус на ступень ниже контрола: кнопка <code>s</code> →{" "}
              <code>xs</code>, <code>m</code> → <code>s</code>, <code>l</code> → <code>m</code>.
              Явный <code>size</code> отключает это правило.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={badgeInControlsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <BadgeInControlsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>На разных поверхностях</DemoSectionTitle>
            <DemoDescription>
              Мягкие заливки рассчитаны на холст, карточку и всплывающий слой без подстройки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={badgeSurfacesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery>
                  <BadgeSurfacesExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция: список заказов</DemoSectionTitle>
            <DemoDescription>
              Типичное место бейджа — колонка статуса в строке списка или таблицы.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={badgeOrderListSource.trim()}
              previewLayout="stack-center"
              surface="canvas"
            >
              <PlaygroundExampleFrame.Stage>
                <BadgeOrderListExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Badge.Root</DemoApiTitle>
            <DemoDescription>
              Корень метки; выставляет <code>data-size</code> (номинальный размер) и{" "}
              <code>data-tier</code> (визуальный ярус).
            </DemoDescription>
            <PlaygroundApiTable rows={badgeRootApiRows} />

            <DemoApiTitle>Badge.Icon</DemoApiTitle>
            <PlaygroundApiTable rows={badgeIconApiRows} />

            <DemoApiTitle>Badge.Dot</DemoApiTitle>
            <DemoDescription>
              Декоративная точка внутри метки в цвете текста бейджа.
            </DemoDescription>
            <PlaygroundApiTable rows={badgeDotApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
