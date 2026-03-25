import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import BannerCompositionSnippet from "../snippets/banner/composition";
import compositionSource from "../snippets/banner/composition.tsx?raw";
import BannerControlledSnippet from "../snippets/banner/controlled";
import controlledSource from "../snippets/banner/controlled.tsx?raw";
import BannerDismissPatternsSnippet from "../snippets/banner/dismiss-patterns";
import dismissPatternsSource from "../snippets/banner/dismiss-patterns.tsx?raw";
import BannerFullWidthSnippet from "../snippets/banner/full-width";
import fullWidthSource from "../snippets/banner/full-width.tsx?raw";
import BannerSizesSnippet from "../snippets/banner/sizes";
import sizesSource from "../snippets/banner/sizes.tsx?raw";
import BannerStatusesSnippet from "../snippets/banner/statuses";
import statusesSource from "../snippets/banner/statuses.tsx?raw";
import BannerVariantsSnippet from "../snippets/banner/variants";
import variantsSource from "../snippets/banner/variants.tsx?raw";

const bannerRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"filled" | "light" | "lighter" | "stroke"',
    defaultValue: '"filled"',
    required: "Нет",
    description: "Плотность фона и акцент (в т.ч. нижняя полоска у stroke).",
  },
  {
    prop: "status",
    type: '"information" | "warning" | "error" | "success" | "feature"',
    defaultValue: '"information"',
    required: "Нет",
    description: "Семантика цвета и иконки по смыслу сообщения.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Высота, отступы, кегль и размер иконки; пробрасывается в ControlSizeProvider.",
  },
  {
    prop: "onDismiss",
    type: "() => void",
    defaultValue: "—",
    required: "Нет",
    description:
      "Если задан и в дереве нет Banner.CloseButton, справа подставляется кнопка закрытия с aria-label «Dismiss».",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корневого div.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно Banner.Content и при необходимости Banner.CloseButton.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "id, role, aria-*, data-*, onClick на обёртке и прочие атрибуты div.",
  },
];

const bannerContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс flex-контейнера с иконкой, текстом и действиями.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Banner.Icon, Banner.Title, Banner.Description, Banner.Actions.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты внутреннего div контента.",
  },
];

const bannerIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: "React.ElementType",
    defaultValue: '"div"',
    required: "Нет",
    description: "Тег или компонент иконки (например компонент из lucide-react с aria-hidden).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс обёртки иконки.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое слота; при as={LucideIcon} обычно не нужно.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">',
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы выбранного элемента, кроме as и className.",
  },
];

const bannerTitleApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс span заголовка.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Краткий заголовок сообщения.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты span.",
  },
];

const bannerDescriptionApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс span описания.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Поясняющий текст под заголовком.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты span.",
  },
];

const bannerActionsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс контейнера кнопок и ссылок.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Button.Root, LinkButton.Root и другие действия в одной строке.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты div действий.",
  },
];

const bannerCloseButtonApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип нативной кнопки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс; к корню применяются стили закрытия баннера.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "По умолчанию иконка крестика внутри Button.Icon.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">',
    defaultValue: "—",
    required: "Нет",
    description:
      "onClick, aria-label, disabled и остальные атрибуты кнопки; size задаётся из контекста размера баннера.",
  },
];

export default function BannerSection() {
  return (
    <PlaygroundDocPage
      title="Banner"
      description={
        <>
          Полоса сообщения под шапкой страницы или над формой: можно выбрать смысл (справка,
          предупреждение, ошибка, успех или новинка), плотность фона и размер. Внутри — иконка,
          заголовок, короткий текст и при необходимости кнопки; закрытие можно повесить на корень
          или вынести отдельную кнопку.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре значения <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code> при <code>variant=&quot;light&quot;</code> и{" "}
            <code>status=&quot;information&quot;</code> — меняются отступы, кегль и размер иконки из
            одного яруса токенов.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            Проп <code>variant</code>: <code>filled</code>, <code>light</code>, <code>lighter</code>
            , <code>stroke</code> на одном статусе <code>information</code>.
          </p>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния (семантика)</h4>
          <p className="demoBlockDescription">
            Проп <code>status</code>: <code>information</code>, <code>warning</code>,{" "}
            <code>error</code>, <code>success</code>, <code>feature</code> при{" "}
            <code>variant=&quot;light&quot;</code>; иконки из набора, согласованного со смыслом
            полосы.
          </p>
          <PlaygroundExampleFrame.Root code={statusesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerStatusesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Показ и скрытие целиком из состояния React: при скрытии рендерится кнопка «Показать
            объявление», внутри баннера — действие «Скрыть» без обязательного <code>onDismiss</code>{" "}
            на корне.
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            Слоты <code>Banner.Icon</code> с <code>as=&#123;…&#125;</code>, заголовок, описание и{" "}
            <code>Banner.Actions</code> с <code>LinkButton</code> и <code>Button</code>; размер{" "}
            <code>l</code>, <code>variant=&quot;stroke&quot;</code>.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            Корень баннера по умолчанию на всю ширину родителя — в примере узкая рамка имитирует
            колонку карточки или сайдбара.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Закрытие: onDismiss и CloseButton</h4>
          <p className="demoBlockDescription">
            Автоподстановка кнопки при одном <code>onDismiss</code>; отдельный{" "}
            <code>Banner.CloseButton</code> без <code>onDismiss</code>; оба варианта вместе — без
            дубля второй кнопки (в дереве уже есть CloseButton).
          </p>
          <PlaygroundExampleFrame.Root code={dismissPatternsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerDismissPatternsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Banner.Root</h5>
          <p className="demoBlockDescription">
            Обёртка полосы: вариант, статус, размер, опциональное закрытие и контекст размера для
            вложенной кнопки.
          </p>
          <PlaygroundApiTable rows={bannerRootApiRows} />
          <h5>Banner.Content</h5>
          <p className="demoBlockDescription">
            Центральная колонка сетки: иконка, тексты и блок действий.
          </p>
          <PlaygroundApiTable rows={bannerContentApiRows} />
          <h5>Banner.Icon</h5>
          <p className="demoBlockDescription">
            Обёртка иконки с полиморфным <code>as</code>; размеры берутся от <code>size</code>{" "}
            корня.
          </p>
          <PlaygroundApiTable rows={bannerIconApiRows} />
          <h5>Banner.Title</h5>
          <p className="demoBlockDescription">
            Заголовок в одну строку или с переносом в flex-группе.
          </p>
          <PlaygroundApiTable rows={bannerTitleApiRows} />
          <h5>Banner.Description</h5>
          <p className="demoBlockDescription">Вторичный текст с чуть пониженной непрозрачностью.</p>
          <PlaygroundApiTable rows={bannerDescriptionApiRows} />
          <h5>Banner.Actions</h5>
          <p className="demoBlockDescription">
            Горизонтальный ряд кнопок и ссылок рядом с текстом.
          </p>
          <PlaygroundApiTable rows={bannerActionsApiRows} />
          <h5>Banner.CloseButton</h5>
          <p className="demoBlockDescription">
            Кнопка на базе <code>Button.Root</code> (ghost neutral); размер синхронизирован с
            размером баннера.
          </p>
          <PlaygroundApiTable rows={bannerCloseButtonApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
