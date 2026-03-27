import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import DropdownAsChildSnippet from "../snippets/dropdown/as-child";
import asChildSource from "../snippets/dropdown/as-child.tsx?raw";
import DropdownCompositionSnippet from "../snippets/dropdown/composition";
import compositionSource from "../snippets/dropdown/composition.tsx?raw";
import DropdownControlledSnippet from "../snippets/dropdown/controlled";
import controlledSource from "../snippets/dropdown/controlled.tsx?raw";
import DropdownFullWidthSnippet from "../snippets/dropdown/full-width";
import fullWidthSource from "../snippets/dropdown/full-width.tsx?raw";
import DropdownInsetSnippet from "../snippets/dropdown/inset";
import insetSource from "../snippets/dropdown/inset.tsx?raw";
import DropdownPlacementSnippet from "../snippets/dropdown/placement";
import placementSource from "../snippets/dropdown/placement.tsx?raw";
import DropdownSizesSnippet from "../snippets/dropdown/sizes";
import sizesSource from "../snippets/dropdown/sizes.tsx?raw";
import DropdownStatesSnippet from "../snippets/dropdown/states";
import statesSource from "../snippets/dropdown/states.tsx?raw";
import DropdownVariantsSnippet from "../snippets/dropdown/variants";
import variantsSource from "../snippets/dropdown/variants.tsx?raw";

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
  {
    prop: "asChild",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      "В типе API сохранён для согласованности с паттерном слияния; фактически триггер всегда клонирует дочерний элемент.",
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
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус токенов для панели, пунктов, подписей групп и размера иконки по умолчанию.",
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
    description: "Содержимое меню: Inset, Block, Group, Item, Separator и т.д.",
  },
];

const dropdownInsetApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "padding",
    type: '"none" | "x1" | "x2" | "x3"',
    defaultValue: '"x2"',
    required: "Нет",
    description: "Внутренние поля от края Dropdown.Content.",
  },
  {
    prop: "gap",
    type: '"none" | "x2" | "x3" | "x4"',
    defaultValue: '"x3"',
    required: "Нет",
    description: "Вертикальный зазор между прямыми дочерними узлами.",
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
    required: "Да",
    description: "Вложенные блоки и пункты.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты контейнера inset.",
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
    prop: "destructive",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Акцент опасного действия (data-destructive).",
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
              Проп <code>size</code> на <code>Dropdown.Content</code>: отступы панели, строки
              пунктов, <code>GroupLabel</code> и размер иконки по умолчанию в <code>ItemIcon</code>{" "}
              (если не передан числовой <code>size</code>).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DropdownSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Варианты</DemoSectionTitle>
            <DemoDescription>
              Обычные строки и визуальный вариант опасного действия — булевый проп{" "}
              <code>destructive</code> у <code>Dropdown.Item</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <DropdownVariantsSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Недоступный пункт через <code>disabled</code>: не активируется и не закрывает меню.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <DropdownStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Расположение панели</DemoSectionTitle>
            <DemoDescription>
              <code>align</code> — стык панели к левому краю, центру или правому краю триггера;{" "}
              <code>side</code> — предпочтение открываться снизу или сверху (с учётом границ
              экрана).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={placementSource.trim()} previewLayout="row-start">
              <PlaygroundExampleFrame.Stage>
                <DropdownPlacementSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              <code>open</code> и <code>onOpenChange</code> на <code>Dropdown.Root</code> для связи
              с родительским состоянием (мастер, подсказки, аналитика).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DropdownControlledSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              <code>Block</code>, <code>Header</code> с рядом <code>HeaderRow</code>,{" "}
              <code>HeaderLeading</code> / <code>HeaderMain</code> / <code>HeaderTrailing</code>,{" "}
              <code>GroupLabel</code>, <code>ItemIcon</code> и вложенная кнопка в трейлинге.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <DropdownCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Full width / минимальная ширина</DemoSectionTitle>
            <DemoDescription>
              <code>sameMinWidthAsTrigger</code> на <code>Dropdown.Content</code>: минимальная
              ширина панели не меньше ширины триггера — удобно для узкой иконки-кнопки и длинных
              подписей пунктов.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <DropdownFullWidthSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>asChild</DemoSectionTitle>
            <DemoDescription>
              <code>Dropdown.Trigger</code> клонирует единственного ребёнка: на ссылку добавляются{" "}
              <code>aria-expanded</code>, <code>aria-controls</code> и общий обработчик клика.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={asChildSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <DropdownAsChildSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
            <DemoDescription>
              <code>Dropdown.Inset</code> — внутренние поля от края панели и вертикальный шаг между
              прямыми дочерними узлами через <code>padding</code> и <code>gap</code> (текст над
              списком, плотный режим без лишних полей).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={insetSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <DropdownInsetSnippet />
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

            <DemoApiTitle>Dropdown.Inset</DemoApiTitle>
            <DemoDescription>
              Внутренние поля и вертикальный ритм между прямыми дочерними узлами внутри контента.
            </DemoDescription>
            <PlaygroundApiTable rows={dropdownInsetApiRows} />

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
