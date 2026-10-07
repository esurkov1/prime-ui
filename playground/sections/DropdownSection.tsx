import DropdownAsChildExample from "@/components/dropdown/examples/as-child";
import asChildSource from "@/components/dropdown/examples/as-child.tsx?raw";
import DropdownCompositionExample from "@/components/dropdown/examples/composition";
import compositionSource from "@/components/dropdown/examples/composition.tsx?raw";
import DropdownControlledExample from "@/components/dropdown/examples/controlled";
import controlledSource from "@/components/dropdown/examples/controlled.tsx?raw";
import DropdownFullWidthExample from "@/components/dropdown/examples/full-width";
import fullWidthSource from "@/components/dropdown/examples/full-width.tsx?raw";
import DropdownPlacementExample from "@/components/dropdown/examples/placement";
import placementSource from "@/components/dropdown/examples/placement.tsx?raw";
import DropdownRowActionsExample from "@/components/dropdown/examples/row-actions";
import rowActionsSource from "@/components/dropdown/examples/row-actions.tsx?raw";
import DropdownSizesExample from "@/components/dropdown/examples/sizes";
import sizesSource from "@/components/dropdown/examples/sizes.tsx?raw";
import DropdownStatesExample from "@/components/dropdown/examples/states";
import statesSource from "@/components/dropdown/examples/states.tsx?raw";
import DropdownVariantsExample from "@/components/dropdown/examples/variants";
import variantsSource from "@/components/dropdown/examples/variants.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const dropdownDivSlotRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корня.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Вложенные слоты и разметка секции.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Стандартные атрибуты div: id, style, data-*, обработчики и др.",
  },
];

const dropdownRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "open",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое открытие панели.",
  },
  {
    prop: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Начальное состояние в неконтролируемом режиме.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Колбэк при открытии и закрытии.",
  },
  {
    prop: "closeOnOutsideClick",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      "Клик в любом месте вне панели и триггера закрывает её. false — закрытие только явно.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Триггер, контент и вложенная разметка меню.",
  },
];

const dropdownTriggerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactElement",
    defaultValue: "—",
    required: "Да",
    description: "Ровно один элемент; на него навешиваются ref, aria и объединённый onClick.",
  },
];

const dropdownContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    defaultValue: '"start"',
    required: "Нет",
    description: "Выравнивание панели относительно триггера по горизонтали.",
  },
  {
    prop: "side",
    type: '"bottom" | "top"',
    defaultValue: '"bottom"',
    required: "Нет",
    description: "Предпочтительная сторона открытия; при нехватке места позиция пересчитывается.",
  },
  {
    prop: "sameMinWidthAsTrigger",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Минимальная ширина панели не меньше ширины триггера.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус пунктов (высота 24–40, кегль, иконка); совпадает с размером триггера.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: 'Дополнительный класс для портальной панели (role="menu").',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Содержимое меню: Block, Group, Item, Separator и т.д.",
  },
];

const dropdownItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "onSelect",
    type: "() => void",
    defaultValue: "—",
    required: "Нет",
    description: "Действие по активации пункта; после вызова меню закрывается.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Недоступный пункт: aria-disabled, tabIndex -1, без закрытия по клику.",
  },
  {
    prop: "tone",
    type: '"neutral" | "danger"',
    defaultValue: '"neutral"',
    required: "Нет",
    description: "danger — опасное действие (удалить, отозвать): data-tone, цвет danger.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: 'Дополнительный класс кнопки пункта (role="menuitem").',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Подпись, ItemIcon и прочая разметка строки.",
  },
];

const dropdownItemIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: "React.ElementType",
    defaultValue: '"span"',
    required: "Нет",
    description: "Компонент иконки (например из набора иконок с пропом size).",
  },
  {
    prop: "aria-hidden",
    type: 'boolean | "true" | "false"',
    defaultValue: "true",
    required: "Нет",
    description:
      "Скрыть декоративную иконку от вспомогательных технологий; оставьте true, если есть текст пункта.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс обёртки.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Опциональное содержимое, если иконка не задаётся через as.",
  },
  {
    prop: "size",
    type: "number",
    defaultValue: "из яруса Content",
    required: "Нет",
    description: "Размер иконки в px; если не задан — из токенов по размеру панели.",
  },
  {
    prop: "…rest",
    type: "Record<string, unknown>",
    defaultValue: "—",
    required: "Нет",
    description: "Пробрасываются в элемент as (strokeWidth и др.), кроме зарезервированных полей.",
  },
];

const dropdownItemShortcutApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Сочетание клавиш, например `⌘C`. Только подсказка — обработчик вешайте сами.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты элемента kbd.",
  },
];

const dropdownGroupLabelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс подписи группы.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст заголовка группы.",
  },
];

const dropdownSeparatorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс для hr.",
  },
];

const dropdownHeaderDescriptionApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "truncate",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Однострочное усечение длинного текста с многоточием.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст описания под заголовком шапки.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты div (id, style, aria-*, обработчики).",
  },
];

const dropdownHeaderTrailingApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "alignSelf",
    type: '"start" | "center"',
    defaultValue: '"start"',
    required: "Нет",
    description: "Вертикальное выравнивание слота относительно строки шапки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Бейдж, кнопка или иной контент правого слота.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты контейнера трейлинга.",
  },
];

const dropdownGroupApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: 'Дополнительный CSS-класс группы (role="group").',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись группы, пункты и вложенная разметка.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты группы внутри меню.",
  },
];

export default function DropdownSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Dropdown</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Выпадающее меню по клику на триггер: список действий, группы с подписями, шапка с
              профилем и опасные операции. Панель в портале позиционируется у триггера, закрывается
              по Escape и клику снаружи; пункты закрывают меню после выбора.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> на <code>Dropdown.Content</code> — <code>xs</code>–<code>xl</code>:
              высота пункта 24–40, кегль и иконка того же яруса. Берите тот же размер, что у
              триггера. По умолчанию — <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DropdownSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Виды пунктов и группы</DemoSectionTitle>
            <DemoDescription>
              Пункт с иконкой (<code>ItemIcon</code>) и сочетанием клавиш (<code>ItemShortcut</code>
              ), недоступный (<code>disabled</code>), опасный (<code>tone="danger"</code>), группы с{" "}
              <code>GroupLabel</code> и разделители. Наведение и фокус с клавиатуры подсвечивают
              строку <code>fill-subtle</code>, опасный пункт — <code>danger-soft</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DropdownVariantsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Длинный список</DemoSectionTitle>
            <DemoDescription>
              Панель ограничена <code>--prime-panel-max-height</code> и прокручивается; недоступные
              пункты пропускаются стрелками. Поиска и пустого состояния у Dropdown нет: для
              фильтрации действий используйте CommandMenu, для выбора значения — Select с{" "}
              <code>searchable</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DropdownStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Действия в карточке</DemoSectionTitle>
            <DemoDescription>
              Основное действие остаётся на виду, остальные — в меню «⋯» (квадратная кнопка только с
              иконкой и <code>aria-label</code>), панель выровнена по правому краю.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={rowActionsSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DropdownRowActionsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Меню пользователя</DemoSectionTitle>
            <DemoDescription>
              <code>Block</code>, <code>Header</code> с <code>HeaderLeading</code> /{" "}
              <code>HeaderMain</code> / <code>HeaderTrailing</code>, усечённый e-mail в{" "}
              <code>HeaderDescription truncate</code>, группы и кнопка внутри шапки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={compositionSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DropdownCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Расположение панели</DemoSectionTitle>
            <DemoDescription>
              <code>align</code> — к началу, центру или концу триггера; <code>side</code> —
              предпочтение снизу или сверху. У края экрана панель переворачивается и сдвигается,
              оставляя 8 px до границы.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={placementSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DropdownPlacementExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ширина по триггеру</DemoSectionTitle>
            <DemoDescription>
              <code>sameMinWidthAsTrigger</code>: панель не уже триггера — для кнопок на всю ширину
              колонки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DropdownFullWidthExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              <code>open</code> и <code>onOpenChange</code> на <code>Dropdown.Root</code> — для
              связи с состоянием родителя (подсказки, аналитика).
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={controlledSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DropdownControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Свой триггер</DemoSectionTitle>
            <DemoDescription>
              <code>Dropdown.Trigger</code> клонирует единственного ребёнка: ссылка получает{" "}
              <code>aria-expanded</code>, <code>aria-controls</code> и обработчик клика.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={asChildSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <DropdownAsChildExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Dropdown.Root</DemoApiTitle>
            <DemoDescription>
              Контекст открытия, идентификаторы для aria-связи триггера и меню, ref триггера для
              позиционирования.
            </DemoDescription>
            <PlaygroundApiTable rows={dropdownRootApiRows} />

            <DemoApiTitle>Dropdown.Trigger</DemoApiTitle>
            <DemoDescription>
              Оборачивает один интерактивный дочерний элемент и переключает видимость панели по
              клику.
            </DemoDescription>
            <PlaygroundApiTable rows={dropdownTriggerApiRows} />

            <DemoApiTitle>Dropdown.Content</DemoApiTitle>
            <DemoDescription>
              Портальная панель с role=&quot;menu&quot;, ловушкой фокуса и позиционированием
              относительно триггера.
            </DemoDescription>
            <PlaygroundApiTable rows={dropdownContentApiRows} />

            <DemoApiTitle>Dropdown.Block</DemoApiTitle>
            <DemoDescription>Секция внутри панели для группировки шапки и списка.</DemoDescription>
            <PlaygroundApiTable rows={dropdownDivSlotRows} />

            <DemoApiTitle>Dropdown.Header</DemoApiTitle>
            <DemoDescription>Контейнер шапки секции (аватар, заголовок, действия).</DemoDescription>
            <PlaygroundApiTable rows={dropdownDivSlotRows} />

            <DemoApiTitle>Dropdown.HeaderRow</DemoApiTitle>
            <DemoDescription>Горизонтальный ряд внутри шапки.</DemoDescription>
            <PlaygroundApiTable rows={dropdownDivSlotRows} />

            <DemoApiTitle>Dropdown.HeaderLeading</DemoApiTitle>
            <DemoDescription>Левый слот строки шапки (например аватар).</DemoDescription>
            <PlaygroundApiTable rows={dropdownDivSlotRows} />

            <DemoApiTitle>Dropdown.HeaderMain</DemoApiTitle>
            <DemoDescription>Основная колонка заголовка и описания.</DemoDescription>
            <PlaygroundApiTable rows={dropdownDivSlotRows} />

            <DemoApiTitle>Dropdown.HeaderTitle</DemoApiTitle>
            <DemoDescription>Строка заголовка в шапке.</DemoDescription>
            <PlaygroundApiTable rows={dropdownDivSlotRows} />

            <DemoApiTitle>Dropdown.HeaderDescription</DemoApiTitle>
            <DemoDescription>
              Вторичный текст под заголовком; опционально с усечением.
            </DemoDescription>
            <PlaygroundApiTable rows={dropdownHeaderDescriptionApiRows} />

            <DemoApiTitle>Dropdown.HeaderTrailing</DemoApiTitle>
            <DemoDescription>Правый слот строки шапки (бейдж, кнопка).</DemoDescription>
            <PlaygroundApiTable rows={dropdownHeaderTrailingApiRows} />

            <DemoApiTitle>Dropdown.Item</DemoApiTitle>
            <DemoDescription>
              Кликабельный пункт меню; по активации вызывает onSelect и закрывает меню.
            </DemoDescription>
            <PlaygroundApiTable rows={dropdownItemApiRows} />

            <DemoApiTitle>Dropdown.ItemIcon</DemoApiTitle>
            <DemoDescription>
              Слот иконки слева от текста пункта; размер по умолчанию согласован с размером панели.
            </DemoDescription>
            <PlaygroundApiTable rows={dropdownItemIconApiRows} />

            <DemoApiTitle>Dropdown.ItemShortcut</DemoApiTitle>
            <DemoDescription>
              Приглушённая подсказка сочетания клавиш у правого края пункта.
            </DemoDescription>
            <PlaygroundApiTable rows={dropdownItemShortcutApiRows} />

            <DemoApiTitle>Dropdown.Group</DemoApiTitle>
            <DemoDescription>Семантическая группа пунктов внутри меню.</DemoDescription>
            <PlaygroundApiTable rows={dropdownGroupApiRows} />

            <DemoApiTitle>Dropdown.GroupLabel</DemoApiTitle>
            <DemoDescription>Подпись над группой пунктов.</DemoDescription>
            <PlaygroundApiTable rows={dropdownGroupLabelApiRows} />

            <DemoApiTitle>Dropdown.Separator</DemoApiTitle>
            <DemoDescription>Горизонтальный разделитель между блоками.</DemoDescription>
            <PlaygroundApiTable rows={dropdownSeparatorApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
