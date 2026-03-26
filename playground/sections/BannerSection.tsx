import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
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
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code> при <code>variant=&quot;light&quot;</code> и{" "}
            <code>status=&quot;information&quot;</code> — меняются отступы, кегль и размер иконки из
            одного яруса токенов.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <BannerSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты</DemoSectionTitle>
          <DemoDescription>
            Проп <code>variant</code>: <code>filled</code>, <code>light</code>, <code>lighter</code>
            , <code>stroke</code> на одном статусе <code>information</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния (семантика)</DemoSectionTitle>
          <DemoDescription>
            Проп <code>status</code>: <code>information</code>, <code>warning</code>,{" "}
            <code>error</code>, <code>success</code>, <code>feature</code> при{" "}
            <code>variant=&quot;light&quot;</code>; иконки из набора, согласованного со смыслом
            полосы.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statusesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerStatusesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Показ и скрытие целиком из состояния React: при скрытии рендерится кнопка «Показать
            объявление», внутри баннера — действие «Скрыть» без обязательного <code>onDismiss</code>{" "}
            на корне.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Слоты <code>Banner.Icon</code> с <code>as=&#123;…&#125;</code>, заголовок, описание и{" "}
            <code>Banner.Actions</code> с <code>LinkButton</code> и <code>Button</code>; размер{" "}
            <code>l</code>, <code>variant=&quot;stroke&quot;</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Корень баннера по умолчанию на всю ширину родителя — в примере узкая рамка имитирует
            колонку карточки или сайдбара.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Закрытие: onDismiss и CloseButton</DemoSectionTitle>
          <DemoDescription>
            Автоподстановка кнопки при одном <code>onDismiss</code>; отдельный{" "}
            <code>Banner.CloseButton</code> без <code>onDismiss</code>; оба варианта вместе — без
            дубля второй кнопки (в дереве уже есть CloseButton).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={dismissPatternsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <BannerDismissPatternsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Banner.Root</DemoApiTitle>
          <DemoDescription>
            Обёртка полосы: вариант, статус, размер, опциональное закрытие и контекст размера для
            вложенной кнопки.
          </DemoDescription>
          <PlaygroundApiTable rows={bannerRootApiRows} />
          <DemoApiTitle>Banner.Content</DemoApiTitle>
          <DemoDescription>
            Центральная колонка сетки: иконка, тексты и блок действий.
          </DemoDescription>
          <PlaygroundApiTable rows={bannerContentApiRows} />
          <DemoApiTitle>Banner.Icon</DemoApiTitle>
          <DemoDescription>
            Обёртка иконки с полиморфным <code>as</code>; размеры берутся от <code>size</code>{" "}
            корня.
          </DemoDescription>
          <PlaygroundApiTable rows={bannerIconApiRows} />
          <DemoApiTitle>Banner.Title</DemoApiTitle>
          <DemoDescription>Заголовок в одну строку или с переносом в flex-группе.</DemoDescription>
          <PlaygroundApiTable rows={bannerTitleApiRows} />
          <DemoApiTitle>Banner.Description</DemoApiTitle>
          <DemoDescription>Вторичный текст с чуть пониженной непрозрачностью.</DemoDescription>
          <PlaygroundApiTable rows={bannerDescriptionApiRows} />
          <DemoApiTitle>Banner.Actions</DemoApiTitle>
          <DemoDescription>Горизонтальный ряд кнопок и ссылок рядом с текстом.</DemoDescription>
          <PlaygroundApiTable rows={bannerActionsApiRows} />
          <DemoApiTitle>Banner.CloseButton</DemoApiTitle>
          <DemoDescription>
            Кнопка на базе <code>Button.Root</code> (ghost neutral); размер синхронизирован с
            размером баннера.
          </DemoDescription>
          <PlaygroundApiTable rows={bannerCloseButtonApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
