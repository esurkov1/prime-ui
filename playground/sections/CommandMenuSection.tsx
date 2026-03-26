import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

import CommandMenuCompositionSnippet from "../snippets/command-menu/composition-tags-footer";
import compositionSource from "../snippets/command-menu/composition-tags-footer.tsx?raw";
import CommandMenuControlledSnippet from "../snippets/command-menu/controlled-open-search";
import controlledSource from "../snippets/command-menu/controlled-open-search.tsx?raw";
import CommandMenuFeaturesSnippet from "../snippets/command-menu/features-keyboard-search";
import featuresSource from "../snippets/command-menu/features-keyboard-search.tsx?raw";
import CommandMenuFullWidthSnippet from "../snippets/command-menu/full-width-panel";
import fullWidthSource from "../snippets/command-menu/full-width-panel.tsx?raw";
import CommandMenuItemIconAsSnippet from "../snippets/command-menu/item-icon-as";
import itemIconAsSource from "../snippets/command-menu/item-icon-as.tsx?raw";
import CommandMenuStatesSnippet from "../snippets/command-menu/states-disabled-filter";
import statesSource from "../snippets/command-menu/states-disabled-filter.tsx?raw";
import CommandMenuVariantsSnippet from "../snippets/command-menu/variants-density-items";
import variantsSource from "../snippets/command-menu/variants-density-items.tsx?raw";

const dialogApiRows: PlaygroundApiPropRow[] = [
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
    prop: "closeOnOverlayClick",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Закрытие по клику на подложку.",
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
    prop: "contentClassName",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Алиас класса для той же панели; объединяется с className внутри.",
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
    description: "Слот слева от поля (иконка поиска).",
  },
  {
    prop: "trailing",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Слот справа (клавиши, кнопка закрытия).",
  },
  {
    prop: "density",
    type: '"compact" | "comfortable"',
    defaultValue: '"compact"',
    required: "Нет",
    description: "Высота строки ввода: компактная или с большим вертикальным запасом.",
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
    description: "Текст для фильтрации; пустая строка — пункт всегда проходит фильтр.",
  },
  {
    prop: "keywords",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description: "Дополнительные слова для поиска (латиница/кириллица в одной строке).",
  },
  {
    prop: "size",
    type: '"s" | "m"',
    defaultValue: '"s"',
    required: "Нет",
    description: "Высота и типографика строки пункта.",
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
    description: "Пункт неактивен и исключается из списка кандидатов клавиатуры.",
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

const tagSectionApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Метка секции и ряд тегов.",
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
    description: "Атрибуты контейнера секции тегов.",
  },
];

const tagSectionLabelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст подписи над тегами.",
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
    description: "Теги или чипы в ряд.",
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
    description: "Класс футера (например footerMuted из CSS-модуля).",
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
    prop: "tone",
    type: '"default" | "muted"',
    defaultValue: '"default"',
    required: "Нет",
    description: "Вариант бейджа: контурный или светлый (для приглушённого футера).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое внутри Badge.Icon (иконка или текст клавиши).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс бейджа-подсказки.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLDivElement>, "color">',
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты корня Badge (color зарезервирован токенами).",
  },
];

export default function CommandMenuSection() {
  return (
    <PlaygroundDocPage
      headingId="command-menu-heading"
      title="Command Menu"
      description={
        <>
          Окно поверх страницы с полем поиска и списком команд: можно быстро перейти в раздел или
          вызвать действие. Строка поиска фильтрует пункты, стрелки и Enter работают из поля ввода;
          диалог построен на <code>Modal</code> из этого же кита.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            <code>InputRow density</code> (<code>compact</code> / <code>comfortable</code>) и размер
            строк списка <code>Item size</code> (<code>s</code> / <code>m</code>).
          </p>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <CommandMenuVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Неактивный пункт (<code>disabled</code> — не попадает в навигацию), пункт с пустым{" "}
            <code>value</code> (всегда остаётся в выдаче), подсказка про пустой список после
            фильтра.
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <CommandMenuStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            <code>Dialog open</code> / <code>onOpenChange</code> и контролируемое поле{" "}
            <code>Input value</code> с синхронизацией строки поиска снаружи.
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <CommandMenuControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            Заголовок над панелью, слоты <code>InputRow</code> (иконка, <code>Kbd</code>, кнопка
            закрытия), секция <code>TagSection</code> с тегами, группы с <code>ItemIcon</code>,
            текстовый <code>Footer</code>.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <CommandMenuCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            Узел панели расширяется классом из CSS-модуля (<code>dialogContentWide</code>) через{" "}
            <code>className</code> на <code>Dialog</code>.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <CommandMenuFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Полиморфная разметка</h4>
          <p className="demoBlockDescription">
            <code>CommandMenu.ItemIcon</code> с пропом <code>as</code>: SVG-компонент или нативный{" "}
            <code>span</code> с текстовой меткой.
          </p>
          <PlaygroundExampleFrame.Root code={itemIconAsSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <CommandMenuItemIconAsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи</h4>
          <p className="demoBlockDescription">
            Глобальное сочетание ⌘K / Ctrl+K, фильтрация по <code>keywords</code>, подсказки в{" "}
            <code>FooterKeyBox</code> (навигация, выбор, закрытие).
          </p>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="row">
            <PlaygroundExampleFrame.Stage>
              <CommandMenuFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>CommandMenu.Dialog</h5>
          <p className="demoBlockDescription">
            Корень палитры: модальное окно, внутри провайдер состояния поиска и списка.
          </p>
          <PlaygroundApiTable rows={dialogApiRows} />
          <h5>CommandMenu.DialogTitle</h5>
          <p className="demoBlockDescription">
            Заголовок диалога (разметка и стили как у <code>h2</code> в шапке{" "}
            <code>Modal.Panel</code>).
          </p>
          <PlaygroundApiTable rows={dialogTitleApiRows} />
          <h5>CommandMenu.DialogDescription</h5>
          <p className="demoBlockDescription">
            Описание для вспомогательных технологий (стили как у текста описания в шапке{" "}
            <code>Modal.Panel</code>
            ).
          </p>
          <PlaygroundApiTable rows={dialogDescriptionApiRows} />
          <h5>CommandMenu.InputRow</h5>
          <p className="demoBlockDescription">Горизонтальная строка: слоты и поле поиска.</p>
          <PlaygroundApiTable rows={inputRowApiRows} />
          <h5>CommandMenu.Input</h5>
          <p className="demoBlockDescription">
            Поле поиска с ролью combobox, связь со списком и обработка стрелок или Enter.
          </p>
          <PlaygroundApiTable rows={inputApiRows} />
          <h5>CommandMenu.List</h5>
          <p className="demoBlockDescription">Контейнер listbox для групп и пунктов.</p>
          <PlaygroundApiTable rows={listApiRows} />
          <h5>CommandMenu.Group</h5>
          <p className="demoBlockDescription">
            Секция с опциональным заголовком; скрывается, если внутри нет видимых пунктов.
          </p>
          <PlaygroundApiTable rows={groupApiRows} />
          <h5>CommandMenu.Item</h5>
          <p className="demoBlockDescription">
            Кнопка-опция: участвует в фильтрации, фокусе клавиатуры и выборе.
          </p>
          <PlaygroundApiTable rows={itemApiRows} />
          <h5>CommandMenu.ItemIcon</h5>
          <p className="demoBlockDescription">Слот иконки с выбором корневого элемента.</p>
          <PlaygroundApiTable rows={itemIconApiRows} />
          <h5>CommandMenu.TagSection</h5>
          <p className="demoBlockDescription">Блок под строкой поиска для фильтров-тегов.</p>
          <PlaygroundApiTable rows={tagSectionApiRows} />
          <h5>CommandMenu.TagSectionLabel</h5>
          <p className="demoBlockDescription">Подпись над рядом тегов.</p>
          <PlaygroundApiTable rows={tagSectionLabelApiRows} />
          <h5>CommandMenu.TagRow</h5>
          <p className="demoBlockDescription">Горизонтальный ряд для чипов или тегов.</p>
          <PlaygroundApiTable rows={tagRowApiRows} />
          <h5>CommandMenu.Footer</h5>
          <p className="demoBlockDescription">Нижняя зона подсказок и ссылок.</p>
          <PlaygroundApiTable rows={footerApiRows} />
          <h5>CommandMenu.FooterKeyBox</h5>
          <p className="demoBlockDescription">
            Компактный бейдж для обозначения клавиш (обёртка над <code>Badge</code>).
          </p>
          <PlaygroundApiTable rows={footerKeyBoxApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
