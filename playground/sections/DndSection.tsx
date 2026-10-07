import DndBoardExample from "@/components/dnd/examples/board";
import boardSource from "@/components/dnd/examples/board.tsx?raw";
import DndDropZonesExample from "@/components/dnd/examples/drop-zones";
import dropZonesSource from "@/components/dnd/examples/drop-zones.tsx?raw";
import DndHorizontalExample from "@/components/dnd/examples/horizontal";
import horizontalSource from "@/components/dnd/examples/horizontal.tsx?raw";
import DndSortableHandleExample from "@/components/dnd/examples/sortable-handle";
import handleSource from "@/components/dnd/examples/sortable-handle.tsx?raw";
import DndSortableListExample from "@/components/dnd/examples/sortable-list";
import listSource from "@/components/dnd/examples/sortable-list.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const rootRows: PlaygroundApiPropRow[] = [
  {
    prop: "labels",
    type: "Partial<DndLabels>",
    defaultValue: "русские строки",
    required: "Нет",
    description: "Системные строки: live-регион, ручка, roleDescription.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Приложение или экран, где есть перетаскивание. Монтируется один раз выше всех экранов.",
  },
];

const sortableRows: PlaygroundApiPropRow[] = [
  {
    prop: "items",
    type: "readonly T[]",
    defaultValue: "—",
    required: "Да",
    description: "Элементы в текущем порядке.",
  },
  {
    prop: "getId",
    type: "(item: T) => string",
    defaultValue: "—",
    required: "Да",
    description: "Стабильный уникальный id; совпадает с id у Dnd.SortableItem.",
  },
  {
    prop: "getLabel",
    type: "(item: T) => string",
    defaultValue: "id",
    required: "Нет",
    description: "Текст для live-региона.",
  },
  {
    prop: "onReorder",
    type: "(id, beforeId: string | null) => … | Promise<…>",
    defaultValue: "—",
    required: "Да",
    description:
      "Элемент id встал перед beforeId (null — в конец); id может быть из другого списка с тем же kind. Примените moveBefore; { ok: false } откатывает порядок.",
  },
  {
    prop: "renderItem",
    type: "(item: T, index: number) => ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Возвращает Dnd.SortableItem.",
  },
  {
    prop: "axis",
    type: '"x" | "y"',
    defaultValue: '"y"',
    required: "Нет",
    description: "Колонка или одна горизонтальная строка.",
  },
  {
    prop: "handle",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Тянуть можно только за Dnd.Handle.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Выключает перетаскивание и клавиатурный порядок.",
  },
  {
    prop: "kind",
    type: "string",
    defaultValue: "уникален для списка",
    required: "Нет",
    description:
      "Тип перетаскивания. Списки с общим kind обмениваются элементами; по умолчанию уникален.",
  },
  {
    prop: "canDrop",
    type: "(id: string) => boolean",
    defaultValue: "принимать всё",
    required: "Нет",
    description: "Отказ для элемента (например, из другого списка): список краснеет до отпускания.",
  },
  {
    prop: "as",
    type: '"div" | "ul" | "ol"',
    defaultValue: '"div"',
    required: "Нет",
    description: "Корневой элемент; в ul/ol элементы рендерятся как li.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс (раскладка списка).",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Название списка.",
  },
];

const itemRows: PlaygroundApiPropRow[] = [
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Тот же id, что возвращает getId.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Этот элемент нельзя перетащить.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Вид строки: заливка, радиус, отступы.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Нативные атрибуты (кроме id); onPointerDown и onKeyDown вызываются первыми.",
  },
];

const handleRows: PlaygroundApiPropRow[] = [
  {
    prop: "aria-label",
    type: "string",
    defaultValue: "labels.handle",
    required: "Нет",
    description: "Имя кнопки.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "иконка",
    required: "Нет",
    description: "Своя иконка.",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Нативные атрибуты кнопки, кроме type.",
  },
];

const draggableRows: PlaygroundApiPropRow[] = [
  {
    prop: "kind",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Что это; зона принимает по kind.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Уникален внутри kind.",
  },
  {
    prop: "data",
    type: "TData",
    defaultValue: "—",
    required: "Нет",
    description: "Данные, которые получит onDrop зоны.",
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "id",
    required: "Нет",
    description: "Текст для live-региона.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Нельзя перетащить.",
  },
  {
    prop: "handle",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Тянуть только за Dnd.Handle внутри.",
  },
  {
    prop: "as",
    type: '"div" | "li" | "span" | "article" | "section"',
    defaultValue: '"div"',
    required: "Нет",
    description: "Элемент.",
  },
  {
    prop: "onDragStart",
    type: "(item, point, origin) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Нажатие стало перетаскиванием.",
  },
  {
    prop: "onDragEnd",
    type: '(item, outcome: "drop" | "release" | "cancel") => void',
    defaultValue: "—",
    required: "Нет",
    description: "Конец перетаскивания.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс.",
  },
];

const dropZoneRows: PlaygroundApiPropRow[] = [
  {
    prop: "accepts",
    type: "string | readonly string[] | (item) => boolean",
    defaultValue: "—",
    required: "Да",
    description: "Какие kind принимает зона.",
  },
  {
    prop: "onDrop",
    type: "(item: DragItem<TData>) => void",
    defaultValue: "—",
    required: "Да",
    description: "Принятый элемент отпущен над зоной.",
  },
  {
    prop: "canDrop",
    type: "(item) => boolean",
    defaultValue: "принимать всё",
    required: "Нет",
    description: "Отказ: зона краснеет до отпускания.",
  },
  {
    prop: "onEnter",
    type: "(item) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Подходящий элемент над зоной.",
  },
  {
    prop: "onLeave",
    type: "() => void",
    defaultValue: "—",
    required: "Нет",
    description: "Элемент ушёл с зоны.",
  },
  {
    prop: "flashOnDrop",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Вспышка зоны после дропа.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Зона не принимает.",
  },
  {
    prop: "as",
    type: '"div" | "section" | "li" | "ul" | "ol" | "span"',
    defaultValue: '"div"',
    required: "Нет",
    description: "Элемент.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс.",
  },
];

export default function DndSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Dnd</PageContent.Title>
        <PageContent.Description measure="full">
          Перетаскивание на pointer-событиях: мышь, палец и стилус работают одинаково. Сортируемые
          списки с «дырой» на месте посадки, Draggable с DropZone, автопрокрутка у краёв, удержание
          на тач-экране, Alt+стрелки с клавиатуры и live-регион для скринридеров. Одна сессия на
          приложение: <code>Dnd.Root</code> монтируется один раз.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Список: вся строка — ручка</DemoSectionTitle>
            <DemoDescription>
              Строку можно взять за любое место: рядом открывается пустое место нужного размера,
              соседи плавно уступают. С клавиатуры — <code>Alt</code> + <code>↑</code>/
              <code>↓</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={listSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DndSortableListExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ручка и вложенные контролы</DemoSectionTitle>
            <DemoDescription>
              <code>handle</code>: тянуть можно только за <code>Dnd.Handle</code>, а в строке
              остаются рабочие переключатели. Асинхронный <code>onReorder</code> может ответить{" "}
              <code>{"{ ok: false }"}</code> и порядок откатится.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={handleSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DndSortableHandleExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Горизонтальный порядок</DemoSectionTitle>
            <DemoDescription>
              <code>axis=&quot;x&quot;</code> — одна строка тегов (<code>Tag</code>), которые
              переставляются движением вбок. Подложка повторяет форму элемента.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={horizontalSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DndHorizontalExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Доска: перенос между списками</DemoSectionTitle>
            <DemoDescription>
              Колонки с общим <code>kind</code> обмениваются элементами: тикет можно бросить в
              другую колонку на конкретную позицию — открывается «дыра» нужного размера, соседи
              уступают. <code>canDrop</code> не пускает четвёртый тикет в «В работе», колонка
              краснеет ещё до отпускания.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={boardSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DndBoardExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Draggable и DropZone</DemoSectionTitle>
            <DemoDescription>
              Когда у цели нет внутреннего порядка: файлы переносятся на папки. Закрытая папка
              отказывает через <code>canDrop</code>; <code>flashOnDrop</code> подсвечивает место
              посадки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={dropZonesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DndDropZonesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Dnd.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootRows} />
            <DemoApiTitle>Dnd.Sortable</DemoApiTitle>
            <PlaygroundApiTable rows={sortableRows} />
            <DemoApiTitle>Dnd.SortableItem</DemoApiTitle>
            <PlaygroundApiTable rows={itemRows} />
            <DemoApiTitle>Dnd.Handle</DemoApiTitle>
            <PlaygroundApiTable rows={handleRows} />
            <DemoApiTitle>Dnd.Draggable</DemoApiTitle>
            <PlaygroundApiTable rows={draggableRows} />
            <DemoApiTitle>Dnd.DropZone</DemoApiTitle>
            <PlaygroundApiTable rows={dropZoneRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
