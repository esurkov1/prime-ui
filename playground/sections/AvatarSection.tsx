import AvatarColorsExample from "@/components/avatar/examples/colors";
import avatarColorsSource from "@/components/avatar/examples/colors.tsx?raw";
import AvatarGroupExample from "@/components/avatar/examples/group";
import avatarGroupSource from "@/components/avatar/examples/group.tsx?raw";
import AvatarPresenceExample from "@/components/avatar/examples/presence";
import avatarPresenceSource from "@/components/avatar/examples/presence.tsx?raw";
import AvatarSizesExample from "@/components/avatar/examples/sizes";
import avatarSizesSource from "@/components/avatar/examples/sizes.tsx?raw";
import AvatarSrcFromStateExample from "@/components/avatar/examples/src-from-state";
import avatarSrcFromStateSource from "@/components/avatar/examples/src-from-state.tsx?raw";
import AvatarStatesExample from "@/components/avatar/examples/states";
import avatarStatesSource from "@/components/avatar/examples/states.tsx?raw";
import AvatarTeamCardExample from "@/components/avatar/examples/team-card";
import avatarTeamCardSource from "@/components/avatar/examples/team-card.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const avatarSizeType = '"xs" | "s" | "m" | "l" | "xl" | "2xl"';

const avatarRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: avatarSizeType,
    defaultValue: '"m"',
    required: "Нет",
    description: "Диаметр 20 · 24 · 32 · 40 · 48 · 64 px (--prime-avatar-<size>).",
  },
  {
    prop: "color",
    type: '"gray" | "blue" | "sky" | "teal" | "green" | "yellow" | "orange" | "red" | "pink" | "purple"',
    defaultValue: '"gray"',
    required: "Нет",
    description: "Оттенок запасного слоя: мягкая заливка палитры и инициалы в цвете текста.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Avatar.Image, Avatar.Fallback и при необходимости Avatar.Status.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className, aria-label (имя, если рядом нет подписи) и прочие атрибуты div.",
  },
];

const avatarImageApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "src",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description:
      "URL изображения. data-status: loading → loaded или error; при ошибке остаётся Fallback. Смена src перезапускает загрузку.",
  },
  {
    prop: "alt",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description: "Пустой, если имя написано рядом; иначе — имя человека.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">',
    defaultValue: "—",
    required: "Нет",
    description: "className, loading, onLoad, onError и прочие атрибуты img.",
  },
];

const avatarFallbackApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Инициалы или иконка; после загрузки фото получает aria-hidden.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className и прочие атрибуты span.",
  },
];

const avatarStatusApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "status",
    type: '"online" | "offline" | "away" | "busy"',
    defaultValue: "—",
    required: "Да",
    description: "Присутствие: точка на нижнем крае аватара с кольцом цвета поверхности.",
  },
  {
    prop: "labels",
    type: "Partial<AvatarStatusLabels>",
    defaultValue: '{ online: "В сети", offline: "Не в сети", away: "Отошёл", busy: "Занят" }',
    required: "Нет",
    description: 'Доступные имена состояний (role="img" + aria-label).',
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "className и прочие атрибуты span.",
  },
];

const avatarGroupApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: avatarSizeType,
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер группы; передаётся в Avatar.Root и Overflow без собственного size.",
  },
  {
    prop: "role (Root)",
    type: "string",
    defaultValue: '"group"',
    required: "Нет",
    description: "Дайте группе aria-label: «Участники: 6».",
  },
  {
    prop: "--avatar-ring",
    type: "CSS-переменная",
    defaultValue: "var(--prime-color-bg-canvas)",
    required: "Нет",
    description:
      "Цвет кольца вокруг аватаров. На карточке задайте цвет её заливки, например var(--prime-color-card-bg).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className, style, aria-* и прочие атрибуты div.",
  },
];

export default function AvatarSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Avatar</PageContent.Title>
        <PageContent.Description measure="full">
          Круглое фото пользователя или сущности с запасным слоем — инициалами или иконкой в цвете
          палитры. Несколько аватаров собираются в <code>Avatar.Group.Root</code> с наложением и
          ячейкой <code>Avatar.Group.Overflow</code> для «ещё N».
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code> — плотные таблицы и упоминания, <code>s</code> — меню, <code>m</code>{" "}
              (по умолчанию) — списки, <code>l</code> — комментарии, <code>xl</code> и{" "}
              <code>2xl</code> — карточки и шапки профиля.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarSizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <AvatarSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Цвета</DemoSectionTitle>
            <DemoDescription>
              Проп <code>color</code> красит запасной слой одним из десяти оттенков палитры.
              Выбирайте оттенок по стабильному id пользователя, чтобы у человека всегда был один
              цвет.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarColorsSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <AvatarColorsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Пока фото грузится или если загрузка не удалась, виден <code>Avatar.Fallback</code>.
              После загрузки запасной слой скрывается от скринридеров. Без <code>Avatar.Image</code>{" "}
              аватар показывает только инициалы или иконку.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarStatesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <AvatarStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Смена фото</DemoSectionTitle>
            <DemoDescription>
              Родитель меняет <code>src</code> — цикл загрузки начинается заново.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarSrcFromStateSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <AvatarSrcFromStateExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Присутствие</DemoSectionTitle>
            <DemoDescription>
              <code>Avatar.Status</code> — точка на краю аватара: в сети, отошёл, занят, не в сети.
              Цвет не единственный сигнал: состояние озвучивается из <code>labels</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarPresenceSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <AvatarPresenceExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Группа</DemoSectionTitle>
            <DemoDescription>
              Аватары перекрываются на четверть диаметра, вокруг каждого кольцо цвета холста.{" "}
              <code>size</code> группы передаётся детям без своего размера. Дайте группе и ячейке
              переполнения <code>aria-label</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarGroupSource.trim()} surface="canvas">
              <PlaygroundExampleFrame.Stage>
                <AvatarGroupExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция: карточка команды</DemoSectionTitle>
            <DemoDescription>
              Группа в шапке карточки и список участников с аватаром <code>m</code>. На карточке
              кольцо группы перекрашено в цвет поверхности через <code>--avatar-ring</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={avatarTeamCardSource.trim()}
              previewLayout="stack-center"
              surface="canvas"
            >
              <PlaygroundExampleFrame.Stage>
                <AvatarTeamCardExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Avatar.Root</DemoApiTitle>
            <PlaygroundApiTable rows={avatarRootApiRows} />
            <DemoApiTitle>Avatar.Image</DemoApiTitle>
            <PlaygroundApiTable rows={avatarImageApiRows} />
            <DemoApiTitle>Avatar.Fallback</DemoApiTitle>
            <PlaygroundApiTable rows={avatarFallbackApiRows} />
            <DemoApiTitle>Avatar.Status</DemoApiTitle>
            <PlaygroundApiTable rows={avatarStatusApiRows} />
            <DemoApiTitle>Avatar.Group.Root / Avatar.Group.Overflow</DemoApiTitle>
            <DemoDescription>
              <code>Overflow</code> — ячейка того же диаметра на нейтральной заливке с моноширинными
              цифрами.
            </DemoDescription>
            <PlaygroundApiTable rows={avatarGroupApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
