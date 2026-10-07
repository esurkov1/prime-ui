import CommandMenuCompositionExample from "@/components/command-menu/examples/composition";
import compositionSource from "@/components/command-menu/examples/composition.tsx?raw";
import CommandMenuControlledExample from "@/components/command-menu/examples/controlled";
import controlledSource from "@/components/command-menu/examples/controlled.tsx?raw";
import CommandMenuKeyboardSearchExample from "@/components/command-menu/examples/keyboard-search";
import featuresSource from "@/components/command-menu/examples/keyboard-search.tsx?raw";
import CommandMenuSizesExample from "@/components/command-menu/examples/sizes";
import variantsSource from "@/components/command-menu/examples/sizes.tsx?raw";
import CommandMenuStatesExample from "@/components/command-menu/examples/states";
import statesSource from "@/components/command-menu/examples/states.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const dialogApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус пунктов (высота item-height 24–40, кегль, иконка) и строки поиска (l/xl — выше).",
  },
  {
    prop: "labels",
    type: "Partial<CommandMenuLabels>",
    defaultValue: "русские",
    required: "Нет",
    description: "search (плейсхолдер и имя поля поиска), empty, emptyHint.",
  },
  {
    prop: "open",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое открытие модального окна.",
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
    description: "Колбэк при открытии или закрытии.",
  },
  {
    prop: "closeOnEscape",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Закрытие по Escape (через Modal).",
  },
  {
    prop: "closeOnOutsideClick",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Клик по подложке (вне диалога) закрывает палитру.",
  },
  {
    prop: "overlayClassName",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс подложки поверх стилей палитры команд.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Дополнительный класс панели контента (например модификаторы ширины из CSS-модуля).",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Имя диалога, если нет видимого заголовка.",
  },
  {
    prop: "aria-labelledby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Связь с видимым или скрытым заголовком диалога.",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Связь с описанием диалога для вспомогательных технологий.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое палитры: поле поиска, список, футер.",
  },
];

const dialogTitleApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст заголовка (те же стили, что у заголовка в Modal).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс заголовка.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLHeadingElement>",
    defaultValue: "—",
    required: "Нет",
    description: "id, style и прочие атрибуты заголовка.",
  },
];

const dialogDescriptionApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст описания под заголовком.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс описания.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLParagraphElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты параграфа.",
  },
];

const inputRowApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "leading",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Слот слева от поля. По умолчанию — иконка поиска; `null` убирает её.",
  },
  {
    prop: "trailing",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Слот справа (клавиши, кнопка закрытия).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно CommandMenu.Input.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки строки.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты контейнера строки поиска.",
  },
];

const inputApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Строка запроса при вводе; нативный onChange тоже вызывается.",
  },
  {
    prop: "placeholder / aria-label",
    type: "string",
    defaultValue: "labels.search",
    required: "Нет",
    description: "По умолчанию — «Поиск» из labels Dialog.",
  },
  {
    prop: "value",
    type: "string | number | readonly string[]",
    defaultValue: "—",
    required: "Нет",
    description:
      "При передаче включает контролируемый режим строки поиска (синхронизация с контекстом фильтрации).",
  },
  {
    prop: "onChange",
    type: "React.ChangeEventHandler<HTMLInputElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Обработчик ввода; внутри также обновляется строка поиска в контексте.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс поля ввода.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">',
    defaultValue: "—",
    required: "Нет",
    description: "placeholder, aria-*, disabled и др.; type фиксирован как search.",
  },
];

const listApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Группы и пункты списка.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс контейнера listbox.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительные атрибуты контейнера списка.",
  },
];

const groupApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "heading",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись секции; строка или произвольная разметка.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "CommandMenu.Item внутри группы.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки группы.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты группы; скрытие без видимых пунктов задаётся компонентом.",
  },
];

const itemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description:
      "Текст для фильтрации вместе с keywords; при пустой строке пункт виден, пока запрос пуст или совпали keywords.",
  },
  {
    prop: "keywords",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description: "Дополнительные слова для поиска (латиница/кириллица в одной строке).",
  },
  {
    prop: "onSelect",
    type: "() => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается по клику или Enter на активном пункте.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Пункт скрыт из выдачи и не выбирается (не показывается приглушённым).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись, иконка, бейджи.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс кнопки пункта.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onSelect">',
    defaultValue: "—",
    required: "Нет",
    description: "onClick, onPointerMove, aria-* и др.; type всегда button.",
  },
];

const itemIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: "React.ElementType",
    defaultValue: '"span"',
    required: "Нет",
    description: "Тег или компонент иконки (например экспорт из lucide-react).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс к иконке.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">',
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы выбранного элемента (strokeWidth, aria-hidden и т.д.).",
  },
];

const badgeSectionApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Метка секции и ряд бейджей.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс секции под строкой поиска.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты контейнера секции бейджей.",
  },
];

const tagSectionLabelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст подписи над бейджами.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс подписи.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты элемента подписи.",
  },
];

const tagRowApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Бейджи (Badge) в ряд.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс ряда.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты flex-контейнера ряда.",
  },
];

const footerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подсказки по клавишам, ссылки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс футера.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нижней панели.",
  },
];

const footerKeyBoxApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"soft" | "ghost"',
    defaultValue: '"soft"',
    required: "Нет",
    description: "`soft` — клавиша на мягкой заливке, `ghost` — только текст.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись клавиши или иконка (рендерится в `<kbd>`).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс элемента kbd.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLElement>, "color">',
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты kbd.",
  },
];

const footerHintApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "keys",
    type: "React.ReactNode[]",
    defaultValue: "—",
    required: "Да",
    description: "Клавиши (строки или иконки), каждая рендерится как FooterKeyBox.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись, например «Навигация».",
  },
];

const emptyApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Действие под текстом (например кнопка «Создать»). Текст — labels.empty / labels.emptyHint у Dialog; блок виден, только когда ни один пункт не подошёл.",
  },
];

const itemPartsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "ItemText · description",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Вторая строка пункта (путь, пояснение): caption, приглушённый цвет.",
  },
  {
    prop: "ItemShortcut · children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Сочетание клавиш у правого края пункта; только подсказка.",
  },
];

export default function CommandMenuSection() {
  return (
    <PageContent.Section aria-labelledby="command-menu-heading">
      <PageContent.Header>
        <PageContent.Title id="command-menu-heading">Command Menu</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Окно поверх страницы с полем поиска и списком команд: можно быстро перейти в раздел
              или вызвать действие. Строка поиска фильтрует пункты, стрелки и Enter работают из поля
              ввода; диалог построен на <code>Modal</code> из этого же кита.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Палитра приложения</DemoSectionTitle>
            <DemoDescription>
              Открытие по ⌘K / Ctrl+K, группы, фильтр по <code>value</code> и <code>keywords</code>,
              вторая строка через <code>ItemText</code>, сочетания клавиш в{" "}
              <code>ItemShortcut</code>, легенда клавиш в <code>FooterHint</code>. Наберите «xyz» —
              появится <code>CommandMenu.Empty</code>: «Ничего не найдено» с подсказкой.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <CommandMenuKeyboardSearchExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> у <code>CommandMenu.Dialog</code> — та же ось xs–xl, что у
              контролов: высота пунктов, кегль и иконки; на <code>l</code> и <code>xl</code> строка
              поиска выше. По умолчанию — <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <CommandMenuSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>
              Длинный список, недоступные пункты, пустое состояние
            </DemoSectionTitle>
            <DemoDescription>
              Строка поиска закреплена, список прокручивается под ней. <code>disabled</code>{" "}
              скрывает пункт из выдачи. Текст пустого состояния и подсказку можно заменить.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <CommandMenuStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              <code>DialogTitle</code> и <code>DialogDescription</code>, слот <code>trailing</code>{" "}
              с <code>Kbd</code> и кнопкой закрытия, область поиска из бейджей (
              <code>BadgeSection</code>), футер с подсказками.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={compositionSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <CommandMenuCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              <code>Dialog open</code> / <code>onOpenChange</code> и контролируемое поле{" "}
              <code>Input value</code> / <code>onChange</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={controlledSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <CommandMenuControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>CommandMenu.Dialog</DemoApiTitle>
            <DemoDescription>
              Корень палитры: модальное окно, внутри провайдер состояния поиска и списка.
            </DemoDescription>
            <PlaygroundApiTable rows={dialogApiRows} />
            <DemoApiTitle>CommandMenu.DialogTitle</DemoApiTitle>
            <DemoDescription>
              Заголовок диалога (разметка и стили как у <code>Modal.Title</code>).
            </DemoDescription>
            <PlaygroundApiTable rows={dialogTitleApiRows} />
            <DemoApiTitle>CommandMenu.DialogDescription</DemoApiTitle>
            <DemoDescription>
              Видимое описание (стили как у <code>Modal.Description</code>); с диалогом связывается
              вручную через <code>aria-describedby</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={dialogDescriptionApiRows} />
            <DemoApiTitle>CommandMenu.InputRow</DemoApiTitle>
            <DemoDescription>Горизонтальная строка: слоты и поле поиска.</DemoDescription>
            <PlaygroundApiTable rows={inputRowApiRows} />
            <DemoApiTitle>CommandMenu.Input</DemoApiTitle>
            <DemoDescription>
              Поле поиска с ролью combobox, связь со списком и обработка стрелок или Enter.
            </DemoDescription>
            <PlaygroundApiTable rows={inputApiRows} />
            <DemoApiTitle>CommandMenu.List</DemoApiTitle>
            <DemoDescription>Контейнер listbox для групп и пунктов.</DemoDescription>
            <PlaygroundApiTable rows={listApiRows} />
            <DemoApiTitle>CommandMenu.Group</DemoApiTitle>
            <DemoDescription>
              Секция с опциональным заголовком; скрывается, если внутри нет видимых пунктов.
            </DemoDescription>
            <PlaygroundApiTable rows={groupApiRows} />
            <DemoApiTitle>CommandMenu.Item</DemoApiTitle>
            <DemoDescription>
              Кнопка-опция: участвует в фильтрации, фокусе клавиатуры и выборе.
            </DemoDescription>
            <PlaygroundApiTable rows={itemApiRows} />
            <DemoApiTitle>CommandMenu.ItemIcon</DemoApiTitle>
            <DemoDescription>Слот иконки с выбором корневого элемента.</DemoDescription>
            <PlaygroundApiTable rows={itemIconApiRows} />
            <DemoApiTitle>CommandMenu.BadgeSection</DemoApiTitle>
            <DemoDescription>Блок под строкой поиска для бейджей-фильтров.</DemoDescription>
            <PlaygroundApiTable rows={badgeSectionApiRows} />
            <DemoApiTitle>CommandMenu.BadgeSectionLabel</DemoApiTitle>
            <DemoDescription>Подпись над рядом бейджей.</DemoDescription>
            <PlaygroundApiTable rows={tagSectionLabelApiRows} />
            <DemoApiTitle>CommandMenu.BadgeRow</DemoApiTitle>
            <DemoDescription>Горизонтальный ряд бейджей.</DemoDescription>
            <PlaygroundApiTable rows={tagRowApiRows} />
            <DemoApiTitle>CommandMenu.Footer</DemoApiTitle>
            <DemoDescription>Нижняя зона подсказок и ссылок.</DemoDescription>
            <PlaygroundApiTable rows={footerApiRows} />
            <DemoApiTitle>CommandMenu.FooterKeyBox</DemoApiTitle>
            <DemoDescription>
              Клавиша в мягкой плашке (<code>kbd</code>).
            </DemoDescription>
            <PlaygroundApiTable rows={footerKeyBoxApiRows} />
            <DemoApiTitle>CommandMenu.FooterHint</DemoApiTitle>
            <DemoDescription>Группа клавиш с подписью.</DemoDescription>
            <PlaygroundApiTable rows={footerHintApiRows} />
            <DemoApiTitle>CommandMenu.Empty</DemoApiTitle>
            <DemoDescription>Пустое состояние списка (role=&quot;status&quot;).</DemoDescription>
            <PlaygroundApiTable rows={emptyApiRows} />
            <DemoApiTitle>CommandMenu.ItemText / ItemShortcut</DemoApiTitle>
            <DemoDescription>Части строки пункта.</DemoDescription>
            <PlaygroundApiTable rows={itemPartsApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
