import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import AvatarCompositionSnippet from "../snippets/avatar/composition";
import avatarCompositionSource from "../snippets/avatar/composition.tsx?raw";
import AvatarGroupOverflowSnippet from "../snippets/avatar/group-overflow";
import avatarGroupOverflowSource from "../snippets/avatar/group-overflow.tsx?raw";
import AvatarGroupThreeSnippet from "../snippets/avatar/group-three";
import avatarGroupThreeSource from "../snippets/avatar/group-three.tsx?raw";
import AvatarSizesSnippet from "../snippets/avatar/sizes";
import avatarSizesSource from "../snippets/avatar/sizes.tsx?raw";
import AvatarSrcFromStateSnippet from "../snippets/avatar/src-from-state";
import avatarSrcFromStateSource from "../snippets/avatar/src-from-state.tsx?raw";
import AvatarStatesSnippet from "../snippets/avatar/states";
import avatarStatesSource from "../snippets/avatar/states.tsx?raw";

const avatarSizeType = '"s" | "m" | "l" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl"';

const avatarRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: avatarSizeType,
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Диаметр аватара и кегль запасного контента; пробрасывается в data-size для стилей.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Обычно Avatar.Image и Avatar.Fallback; контекст хранит статус загрузки изображения.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корневом div.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Стандартные атрибуты div.",
  },
];

const avatarImageApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "src",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "URL изображения; при смене src внутреннее состояние сбрасывается (key по src).",
  },
  {
    prop: "alt",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description: "Альтернативный текст img; для декоративных аватаров часто оставляют пустым.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на элементе img.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">',
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты img: loading, decoding, sizes, onLoad, onError и т.д.",
  },
];

const avatarFallbackApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Инициалы, иконка или плейсхолдер; скрывается от вспомогательных технологий, когда изображение успешно загрузилось.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на span запасного контента.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Стандартные атрибуты span.",
  },
];

const avatarGroupRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: avatarSizeType,
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Общий размер: клонируется в дочерние Avatar.Root и Avatar.Group.Overflow, если у них size не задан явно.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Несколько Avatar.Root и при необходимости Avatar.Group.Overflow; поддерживаются Fragment.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на контейнере группы.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Стандартные атрибуты div.",
  },
];

const avatarGroupOverflowApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: avatarSizeType,
    defaultValue: '"m"',
    required: "Нет",
    description: "Согласуется с группой, если обёрнута в Avatar.Group.Root без собственного size.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст вроде «+3» для скрытых участников.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на ячейке переполнения.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Стандартные атрибуты div.",
  },
];

export default function AvatarSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Avatar</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Круглое фото или запасной слой с инициалами или иконкой. Размер задаётся одним пропом{" "}
              <code>size</code> от <code>s</code> до <code>6xl</code>. Несколько аватаров можно
              собрать в <code>Avatar.Group.Root</code> с наложением и ячейкой{" "}
              <code>Avatar.Group.Overflow</code> для счётчика «ещё N».
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Все значения <code>size</code> подряд: одна и та же разметка <code>Image</code> +{" "}
              <code>Fallback</code> с подписью размера.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={avatarSizesSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <AvatarSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Без <code>Avatar.Image</code> контекст остаётся в <code>idle</code> — виден только
              fallback. С валидным <code>src</code> после загрузки статус <code>loaded</code>, у{" "}
              <code>Avatar.Fallback</code> выставляется <code>aria-hidden</code>. Неверный URL даёт{" "}
              <code>error</code> и снова показывает fallback.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarStatesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <AvatarStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Расположение в группе</DemoSectionTitle>
            <DemoDescription>
              <code>Avatar.Group.Root</code> выстраивает детей в горизонтальный ряд с отрицательным
              отступом, чтобы круги частично перекрывались; общий <code>size</code> группы
              подставляется дочерним <code>Avatar.Root</code>, если у них нет своего{" "}
              <code>size</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarGroupThreeSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <AvatarGroupThreeSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Смена изображения снаружи</DemoSectionTitle>
            <DemoDescription>
              Родитель держит <code>src</code> в состоянии (например выбран другой пользователь в
              списке). Внутри компонента изображение монтируется с ключом по <code>src</code>,
              поэтому цикл загрузки начинается заново при каждой смене URL.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={avatarSrcFromStateSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <AvatarSrcFromStateSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция слотов</DemoSectionTitle>
            <DemoDescription>
              Пара <code>Avatar.Image</code> + текстовый <code>Avatar.Fallback</code> и отдельно
              аватар только с <code>Fallback</code>, куда передана иконка из набора{" "}
              <code>icons</code> кита.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarCompositionSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <AvatarCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Переполнение группы</DemoSectionTitle>
            <DemoDescription>
              Последний элемент — <code>Avatar.Group.Overflow</code>: тот же диаметр, что у аватаров
              группы, для подписи вроде <code>+3</code>. На контейнер группы удобно повесить{" "}
              <code>aria-label</code> с пояснением состава.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={avatarGroupOverflowSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <AvatarGroupOverflowSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Avatar.Root</DemoApiTitle>
            <DemoDescription>
              Обёртка-круг: задаёт размер, фон и контекст статуса изображения для дочерних{" "}
              <code>Image</code> и <code>Fallback</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={avatarRootApiRows} />
            <DemoApiTitle>Avatar.Image</DemoApiTitle>
            <DemoDescription>
              Картинка на весь круг; управляет статусом загрузки в контексте через{" "}
              <code>onLoad</code> и <code>onError</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={avatarImageApiRows} />
            <DemoApiTitle>Avatar.Fallback</DemoApiTitle>
            <DemoDescription>
              Запасной слой под изображением; остаётся видимым, пока картинка не в состоянии{" "}
              <code>loaded</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={avatarFallbackApiRows} />
            <DemoApiTitle>Avatar.Group.Root</DemoApiTitle>
            <DemoDescription>
              Контейнер для нескольких <code>Avatar.Root</code> и опционально одной ячейки{" "}
              <code>Overflow</code>; пробрасывает <code>size</code> вложенным аватарам без
              собственного размера.
            </DemoDescription>
            <PlaygroundApiTable rows={avatarGroupRootApiRows} />
            <DemoApiTitle>Avatar.Group.Overflow</DemoApiTitle>
            <DemoDescription>
              Круглая ячейка того же размера, что аватары в группе, для текста переполнения.
            </DemoDescription>
            <PlaygroundApiTable rows={avatarGroupOverflowApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
