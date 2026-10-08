import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { Crossfade } from "@/components/crossfade/Crossfade";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Input } from "@/components/input/Input";
import { LinkButton } from "@/components/link-button/LinkButton";
import { Typography } from "@/components/typography/Typography";
import * as iconSet from "@/icon-set";
import { Icon, type IconName } from "@/icons";
import type { Glyph } from "@/icons/glyph";
import { iconRegistry } from "@/icons/registry";
import { cx } from "@/internal/cx";
import enter from "@/internal/enterMotion.module.css";
import { useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { touchTargetClass } from "@/internal/touchTarget";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import { DocBlock, DocList, DocPage, DocTable } from "../components/Doc";
import s from "./IconsPage.module.css";
import { ICON_CATALOG, ICON_GROUPS, type IconGroupId } from "./iconCatalog";

/** A tile of the catalog: one named glyph of `prime-ui-kit/icons`. */
type Entry = {
  /** The component name: `BellIcon`. */
  name: string;
  /** The semantic `<Icon name>` names drawn with this glyph, if any. */
  semantic: IconName[];
  /** The Lucide name in kebab case: `bell`. */
  lucide: string;
  haystack: string;
  glyph: Glyph;
};

/** `ChevronsUpDown` → `chevrons-up-down`, the form the Lucide site searches by. */
const kebab = (pascal: string) =>
  pascal
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])(?=[A-Z])/g, "$1-")
    .replace(/([A-Za-z])([0-9])/g, "$1-$2")
    .replace(/([0-9])(?=[0-9])/g, "$1-")
    .toLowerCase();

const GROUP_LABEL = Object.fromEntries(ICON_GROUPS.map((g) => [g.id, g.label])) as Record<
  IconGroupId,
  string
>;

/** Semantic names per glyph, so a search in Russian («корзина») finds the drawing too. */
const SEMANTIC_BY_GLYPH = new Map<Glyph, IconName[]>();
for (const name of Object.keys(iconRegistry) as IconName[]) {
  const glyph = iconRegistry[name];
  SEMANTIC_BY_GLYPH.set(glyph, [...(SEMANTIC_BY_GLYPH.get(glyph) ?? []), name]);
}

const ENTRIES: Entry[] = Object.entries(iconSet)
  .filter((entry): entry is [string, Glyph] => typeof entry[1] === "function")
  .map(([name, glyph]) => {
    const semantic = SEMANTIC_BY_GLYPH.get(glyph) ?? [];
    const words = semantic.flatMap((id) => [
      id,
      GROUP_LABEL[id.split(".")[0] as IconGroupId],
      ICON_CATALOG[id].meaning,
      ...ICON_CATALOG[id].keywords,
    ]);
    return {
      name,
      semantic,
      lucide: kebab(glyph.source),
      haystack: [name, glyph.source, kebab(glyph.source), ...words].join(" ").toLowerCase(),
      glyph,
    };
  });

const snippet = (entry: Entry) => `<${entry.name} />`;

const COPIED_MS = 1600;

function IconCatalog() {
  // Each tile is a surface one step above the page, like a card.
  const depth = useNestedSurfaceDepth();
  const [query, setQuery] = React.useState("");
  const [copied, setCopied] = React.useState<{ entry: Entry; ok: boolean } | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const found = React.useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return ENTRIES.filter((e) => terms.every((term) => e.haystack.includes(term)));
  }, [query]);

  const copy = async (entry: Entry) => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(snippet(entry));
    } catch {
      ok = false;
    }
    setCopied({ entry, ok });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), COPIED_MS);
  };

  return (
    <div className={s.catalog}>
      <div className={s.controls}>
        <div className={s.toolbar}>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon side="start">
                <Icon name="action.search" />
              </Input.Icon>
              <Input.Field
                type="search"
                aria-label="Поиск иконки"
                placeholder="Поиск по названию, смыслу или синониму: корзина, trash, bell…"
                value={query}
                onValueChange={setQuery}
              />
              {query ? <Input.ClearButton onClick={() => setQuery("")} /> : null}
            </Input.Wrapper>
          </Input.Root>
        </div>
        <Typography as="p" variant="caption" tone="muted" className={s.counter}>
          Найдено: {found.length} из {ENTRIES.length}
        </Typography>
      </div>

      <VisuallyHidden role="status" aria-live="polite">
        {copied
          ? copied.ok
            ? `Скопировано: ${snippet(copied.entry)}`
            : "Не удалось скопировать"
          : ""}
      </VisuallyHidden>

      <Crossfade state={found.length ? "ready" : "empty"}>
        {found.length ? (
          <ul className={s.grid} aria-label="Иконки">
            {found.map((e) => {
              const state = copied?.entry === e ? copied : null;
              return (
                <li key={e.name} className={s.cell}>
                  <button
                    type="button"
                    className={cx(s.tile, touchTargetClass)}
                    data-depth={depth}
                    data-copied={state ? (state.ok ? "true" : "failed") : undefined}
                    title={[e.name, ...e.semantic].join(" · ")}
                    onClick={() => copy(e)}
                  >
                    <span className={s.glyph}>
                      <e.glyph size="l" />
                    </span>
                    <span className={s.caption}>
                      {state ? (
                        <span
                          className={cx(s.name, enter.enter)}
                          data-state={state.ok ? "copied" : "failed"}
                          key="state"
                        >
                          {state.ok ? "Скопировано" : "Не удалось"}
                        </span>
                      ) : (
                        <span className={cx(s.name, enter.enter)} key="name">
                          {e.name}
                        </span>
                      )}
                      <span className={s.meaning}>
                        {e.semantic.length ? e.semantic.join(" · ") : e.lucide}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyPage.Root layout="compact" role="status">
            <EmptyPage.Icon>
              <Icon name="action.search" />
            </EmptyPage.Icon>
            <EmptyPage.Title as="p">Ничего не найдено</EmptyPage.Title>
            <EmptyPage.Description>
              Попробуйте другое слово или синоним, например «корзина» или «trash».
            </EmptyPage.Description>
            <EmptyPage.Actions>
              <Button.Root size="s" variant="soft" tone="neutral" onClick={() => setQuery("")}>
                Сбросить поиск
              </Button.Root>
            </EmptyPage.Actions>
          </EmptyPage.Root>
        )}
      </Crossfade>
    </div>
  );
}

const SNIPPET_BASIC = `
import { Icon } from "prime-ui-kit";

(<Icon name="action.search" />)`;

const SNIPPET_BUTTON = `;
import { Button, Icon } from "prime-ui-kit";

// Без size иконка берёт размер хоста: здесь — уровень кнопки.
(
  <Button.Root size="l">
    <Button.Icon>
      <Icon name="action.add" />
    </Button.Icon>
    Создать заказ
  </Button.Root>
)`;

const SNIPPET_SIZE = ` < // Размер на шкале иконок: xs 14 · s 16 · m 20 · l 24 · xl 32.
  Icon;
name = "object.bell";
size="l" />

// Цвет: tone, по умолчанию currentColor хоста.
<Icon name="status.warning" tone="warning" />`;

const SNIPPET_SET = `
import { BellIcon, ShoppingCartIcon } from "prime-ui-kit/icons";

// Полный набор: те же size, tone, animated, что у <Icon>.
(<BellIcon />) < ShoppingCartIcon;
size = "l";
tone="muted" />`;

const SNIPPET_STILL = `// Иконка без жеста: статичная, даже когда хост под курсором.
<Icon
name = "status.success";
animated={false} />`;

const SNIPPET_DOMAIN = `

import { Bike } from "lucide-react";
import { createIcon } from "prime-ui-kit";

// Доменная иконка, которой нет в наборе: один раз на уровне модуля.
const BikeIcon = createIcon(Bike);

<BikeIcon size="l" />`;

type Gesture = { motion: string; meaning: string; sample: IconName };

const GESTURES: Gesture[] = [
  {
    motion: "nudge",
    meaning: "Сдвиг в сторону действия: шаг вперёд, вниз к файлу",
    sample: "nav.chevronRight",
  },
  {
    motion: "shake",
    meaning: "Короткая дрожь: ошибка, предупреждение, закрытое",
    sample: "status.locked",
  },
  {
    motion: "tilt",
    meaning: "Наклон части рисунка: поиск, ключ, корзина",
    sample: "action.search",
  },
  { motion: "swing", meaning: "Раскачивание вокруг точки подвеса", sample: "object.bell" },
  {
    motion: "spin",
    meaning: "Поворот: настройки, обновление, добавление",
    sample: "action.settings",
  },
  { motion: "pop", meaning: "Лёгкий всплеск масштаба части рисунка", sample: "object.users" },
  {
    motion: "squeeze",
    meaning: "Сжатие к центру: закрыть, убрать, упаковать",
    sample: "action.close",
  },
  { motion: "blink", meaning: "Моргание: показать и скрыть", sample: "view.preview" },
  { motion: "grow", meaning: "Рост линий и столбцов от основания", sample: "format.list" },
  { motion: "draw", meaning: "Штрих дорисовывается: галочка, пульс", sample: "action.check" },
];

const GESTURE_COLUMNS: DataTableColumn<Gesture>[] = [
  {
    id: "motion",
    header: "Жест",
    cell: (g) => (
      <Typography as="span" variant="code">
        {g.motion}
      </Typography>
    ),
  },
  { id: "meaning", header: "Смысл", cell: (g) => g.meaning },
  {
    id: "sample",
    header: "Пример: наведите",
    cell: (g) => (
      <Button.Root size="s" variant="soft" tone="neutral">
        <Button.Icon>
          <Icon name={g.sample} />
        </Button.Icon>
        {g.sample}
      </Button.Root>
    ),
  },
];

export default function IconsPage() {
  return (
    <DocPage
      title="Icons"
      description="Набор иконок: у каждой смысловое имя, один API и свой жест, который проигрывается при наведении на хозяина."
    >
      <DocBlock
        title="Набор"
        description={
          <>
            Иконки вызываются по смысловому имени — <code>action.search</code>, а не по рисунку.
            Компонент один: <code>{"<Icon name />"}</code> с размером, цветом и флагом анимации.
            Рисунки взяты из Lucide, каждая иконка анимирована, а размер по умолчанию берётся от
            хозяина — кнопки, поля или ссылки.
          </>
        }
      >
        <DocList>
          <li>
            Имя состоит из группы и смысла: <code>nav.home</code>, <code>status.success</code>. Если
            смысл меняется, имя остаётся, а рисунок можно заменить.
          </li>
          <li>Иконки декоративны (aria-hidden): имя элементу даёт текст или aria-label.</li>
          <li>
            Кроме смысловых имён есть полный набор: {ENTRIES.length} анимированных глифов как
            именованные компоненты из <code>prime-ui-kit/icons</code> —{" "}
            <code>{"<BellIcon />"}</code>. В сборку попадают только импортированные.
          </li>
          <li>Доменный рисунок, которого нет в наборе, оборачивает createIcon.</li>
        </DocList>
      </DocBlock>

      <DocBlock
        title="Каталог"
        description="Наведите на плитку, чтобы увидеть жест, и нажмите, чтобы скопировать готовый JSX."
      >
        <IconCatalog />
      </DocBlock>

      <DocBlock title="Использование">
        <div className={s.snippets}>
          <CodeBlock code={SNIPPET_BASIC} aria-label="Иконка по имени" />
          <CodeBlock code={SNIPPET_BUTTON} aria-label="Иконка в кнопке" />
          <CodeBlock code={SNIPPET_SIZE} aria-label="Размер и цвет иконки" />
          <CodeBlock code={SNIPPET_SET} aria-label="Полный набор глифов" />
          <CodeBlock code={SNIPPET_STILL} aria-label="Иконка без анимации" />
          <CodeBlock code={SNIPPET_DOMAIN} aria-label="Доменная иконка" />
        </div>
      </DocBlock>

      <DocBlock
        title="Анимация"
        description="Жест проигрывается один раз и всегда возвращается в покой. Он двигает части рисунка, а не сам svg, поэтому хозяин может поворачивать шеврон, и это складывается с жестом."
      >
        <DocList>
          <li>
            Жест играет, когда наведён хозяин иконки: кнопка, ссылка, вкладка, переключатель,
            подпись, пункт меню, опция списка, строка таблицы; на касании — при нажатии.
          </li>
          <li>Вне хозяина иконка играет, когда наведён курсор на неё саму.</li>
          <li>
            Иконка принадлежит ближайшему хозяину: наведение на строку не запускает иконки её кнопок
            действий.
          </li>
          <li>Фокус с клавиатуры жест не запускает; при reduced motion он не играет совсем.</li>
          <li>
            Отключённый хозяин не запускает жест; <code>animated=&#123;false&#125;</code> оставляет
            иконку неподвижной.
          </li>
          <li>Иконки из createIcon играют мягкий общий всплеск всего рисунка.</li>
        </DocList>
        <DocTable columns={GESTURE_COLUMNS} rows={GESTURES} getRowKey={(g) => g.motion} />
      </DocBlock>

      <DocBlock
        title="Источник и лицензия"
        description={
          <>
            Рисунки — Lucide (лицензия ISC). Жесты адаптированы из lucide-animated, автор pqoqubbw
            (лицензия MIT): переписаны с Motion на CSS-кадры на токенах движения кита, без
            runtime-зависимости. Тексты уведомлений об авторстве входят в пакет, файл
            THIRD_PARTY_NOTICES.
          </>
        }
      >
        <div className={s.links}>
          <LinkButton href="https://lucide.dev" target="_blank" rel="noopener noreferrer">
            Lucide
            <Icon name="action.externalLink" />
          </LinkButton>
          <LinkButton href="https://lucide-animated.com" target="_blank" rel="noopener noreferrer">
            lucide-animated
            <Icon name="action.externalLink" />
          </LinkButton>
          <LinkButton
            href="https://github.com/pqoqubbw/icons"
            target="_blank"
            rel="noopener noreferrer"
          >
            pqoqubbw/icons
            <Icon name="action.externalLink" />
          </LinkButton>
          <Badge.Root color="gray">ISC · MIT</Badge.Root>
        </div>
      </DocBlock>
    </DocPage>
  );
}
