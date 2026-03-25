import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
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
    <PlaygroundDocPage
      title="Dropdown"
      description={
        <>
          Выпадающее меню по клику на триггер: список действий, группы с подписями, шапка с профилем
          и опасные операции. Панель в портале позиционируется у триггера, закрывается по Escape и
          клику снаружи; пункты закрывают меню после выбора.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Проп <code>size</code> на <code>Dropdown.Content</code>: отступы панели, строки пунктов,{" "}
            <code>GroupLabel</code> и размер иконки по умолчанию в <code>ItemIcon</code> (если не
            передан числовой <code>size</code>).
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DropdownSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            Обычные строки и визуальный вариант опасного действия — булевый проп{" "}
            <code>destructive</code> у <code>Dropdown.Item</code>.
          </p>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()}>
            <PlaygroundExampleFrame.Stage>
              <DropdownVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Недоступный пункт через <code>disabled</code>: не активируется и не закрывает меню.
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()}>
            <PlaygroundExampleFrame.Stage>
              <DropdownStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Расположение панели</h4>
          <p className="demoBlockDescription">
            <code>align</code> — стык панели к левому краю, центру или правому краю триггера;{" "}
            <code>side</code> — предпочтение открываться снизу или сверху (с учётом границ экрана).
          </p>
          <PlaygroundExampleFrame.Root code={placementSource.trim()} previewLayout="row-start">
            <PlaygroundExampleFrame.Stage>
              <DropdownPlacementSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            <code>open</code> и <code>onOpenChange</code> на <code>Dropdown.Root</code> для связи с
            родительским состоянием (мастер, подсказки, аналитика).
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DropdownControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            <code>Block</code>, <code>Header</code> с рядом <code>HeaderRow</code>,{" "}
            <code>HeaderLeading</code> / <code>HeaderMain</code> / <code>HeaderTrailing</code>,{" "}
            <code>GroupLabel</code>, <code>ItemIcon</code> и вложенная кнопка в трейлинге.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()}>
            <PlaygroundExampleFrame.Stage>
              <DropdownCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width / минимальная ширина</h4>
          <p className="demoBlockDescription">
            <code>sameMinWidthAsTrigger</code> на <code>Dropdown.Content</code>: минимальная ширина
            панели не меньше ширины триггера — удобно для узкой иконки-кнопки и длинных подписей
            пунктов.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()}>
            <PlaygroundExampleFrame.Stage>
              <DropdownFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>asChild</h4>
          <p className="demoBlockDescription">
            <code>Dropdown.Trigger</code> клонирует единственного ребёнка: на ссылку добавляются{" "}
            <code>aria-expanded</code>, <code>aria-controls</code> и общий обработчик клика.
          </p>
          <PlaygroundExampleFrame.Root code={asChildSource.trim()}>
            <PlaygroundExampleFrame.Stage>
              <DropdownAsChildSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи</h4>
          <p className="demoBlockDescription">
            <code>Dropdown.Inset</code> — внутренние поля от края панели и вертикальный шаг между
            прямыми дочерними узлами через <code>padding</code> и <code>gap</code> (текст над
            списком, плотный режим без лишних полей).
          </p>
          <PlaygroundExampleFrame.Root code={insetSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <DropdownInsetSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Dropdown.Root</h5>
          <p className="demoBlockDescription">
            Контекст открытия, идентификаторы для aria-связи триггера и меню, ref триггера для
            позиционирования.
          </p>
          <PlaygroundApiTable rows={dropdownRootApiRows} />

          <h5>Dropdown.Trigger</h5>
          <p className="demoBlockDescription">
            Оборачивает один интерактивный дочерний элемент и переключает видимость панели по клику.
          </p>
          <PlaygroundApiTable rows={dropdownTriggerApiRows} />

          <h5>Dropdown.Content</h5>
          <p className="demoBlockDescription">
            Портальная панель с role=&quot;menu&quot;, ловушкой фокуса и позиционированием
            относительно триггера.
          </p>
          <PlaygroundApiTable rows={dropdownContentApiRows} />

          <h5>Dropdown.Inset</h5>
          <p className="demoBlockDescription">
            Внутренние поля и вертикальный ритм между прямыми дочерними узлами внутри контента.
          </p>
          <PlaygroundApiTable rows={dropdownInsetApiRows} />

          <h5>Dropdown.Block</h5>
          <p className="demoBlockDescription">
            Секция внутри панели для группировки шапки и списка.
          </p>
          <PlaygroundApiTable rows={dropdownDivSlotRows} />

          <h5>Dropdown.Header</h5>
          <p className="demoBlockDescription">
            Контейнер шапки секции (аватар, заголовок, действия).
          </p>
          <PlaygroundApiTable rows={dropdownDivSlotRows} />

          <h5>Dropdown.HeaderRow</h5>
          <p className="demoBlockDescription">Горизонтальный ряд внутри шапки.</p>
          <PlaygroundApiTable rows={dropdownDivSlotRows} />

          <h5>Dropdown.HeaderLeading</h5>
          <p className="demoBlockDescription">Левый слот строки шапки (например аватар).</p>
          <PlaygroundApiTable rows={dropdownDivSlotRows} />

          <h5>Dropdown.HeaderMain</h5>
          <p className="demoBlockDescription">Основная колонка заголовка и описания.</p>
          <PlaygroundApiTable rows={dropdownDivSlotRows} />

          <h5>Dropdown.HeaderTitle</h5>
          <p className="demoBlockDescription">Строка заголовка в шапке.</p>
          <PlaygroundApiTable rows={dropdownDivSlotRows} />

          <h5>Dropdown.HeaderDescription</h5>
          <p className="demoBlockDescription">
            Вторичный текст под заголовком; опционально с усечением.
          </p>
          <PlaygroundApiTable rows={dropdownHeaderDescriptionApiRows} />

          <h5>Dropdown.HeaderTrailing</h5>
          <p className="demoBlockDescription">Правый слот строки шапки (бейдж, кнопка).</p>
          <PlaygroundApiTable rows={dropdownHeaderTrailingApiRows} />

          <h5>Dropdown.Item</h5>
          <p className="demoBlockDescription">
            Кликабельный пункт меню; по активации вызывает onSelect и закрывает меню.
          </p>
          <PlaygroundApiTable rows={dropdownItemApiRows} />

          <h5>Dropdown.ItemIcon</h5>
          <p className="demoBlockDescription">
            Слот иконки слева от текста пункта; размер по умолчанию согласован с размером панели.
          </p>
          <PlaygroundApiTable rows={dropdownItemIconApiRows} />

          <h5>Dropdown.Group</h5>
          <p className="demoBlockDescription">Семантическая группа пунктов внутри меню.</p>
          <PlaygroundApiTable rows={dropdownGroupApiRows} />

          <h5>Dropdown.GroupLabel</h5>
          <p className="demoBlockDescription">Подпись над группой пунктов.</p>
          <PlaygroundApiTable rows={dropdownGroupLabelApiRows} />

          <h5>Dropdown.Separator</h5>
          <p className="demoBlockDescription">Горизонтальный разделитель между блоками.</p>
          <PlaygroundApiTable rows={dropdownSeparatorApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
