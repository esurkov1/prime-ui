import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Card } from "@/components/card/Card";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Input } from "@/components/input/Input";
import { Typography } from "@/components/typography/Typography";
import type { PaletteColor } from "@/internal/states";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";

import { DocBlock, DocList, DocPage, DocTable } from "../components/Doc";
import { Panel, TokenName } from "./FoundationKit";
import s from "./foundation.module.css";
import {
  composite,
  contrastRatio,
  parseColor,
  primitiveTokens,
  type Rgba,
  refLabel,
  semanticKeys,
  semanticLeaves,
  sourceValue,
  toHex,
  toVarName,
  useComputedColors,
  useDocumentTheme,
} from "./tokenModel";

/** What each role group is for (foundation §3). Group names come from `semanticTokens.color`. */
const GROUP_NOTES: Record<string, string> = {
  bg: "Особые фоны: инверсия, подложка модалки, тень края таблицы, стекло нижней навигации.",
  fill: "Прозрачные заливки состояний: hover строк и ghost-кнопок, треки чекбокса и switch. Ложатся на любой фон.",
  text: "Текст по важности. Disabled — единственная пара, которой не нужен AA.",
  border: "Только разделители. Контролы обходятся без обводки: control прозрачен.",
  accent: "Главное действие, выбор, ссылки, активная вкладка, отмеченные контролы.",
  danger: "Ошибки и разрушительные действия.",
  success: "Успешный статус.",
  warning: "Предупреждение.",
  info: "Нейтральная информация.",
  field: "Отключённое поле. Заливка поля в покое, при наведении и в фокусе приходит из лестницы.",
  focus: "Одно кольцо фокуса для всех интерактивных элементов.",
  control: "Бегунок switch и slider.",
  tooltip: "Тултип.",
};

/** The ladder has its own blocks above; palette has its table. */
const ROLE_GROUPS = semanticKeys("color").filter((g) => g !== "palette" && g !== "layer");
const PALETTE_HUES = semanticKeys("color.palette");

/* --- Surface ladder ---------------------------------------------------------- */

const LEVEL_NAMES = ["страница", "карточка", "блок в карточке", "плитка", "вставка"];

/** A static field on the current layer: shows the layer's control fill. */
function LadderField({ value }: { value: string }) {
  return (
    <Input.Root>
      <Input.Wrapper>
        <Input.Field aria-label={value} defaultValue={value} readOnly tabIndex={-1} />
      </Input.Wrapper>
    </Input.Root>
  );
}

/** Layer `depth` as a kit Card with a field and a neutral button, and the next layer inside. */
function LadderLevel({ depth }: { depth: number }) {
  return (
    <Card.Root>
      <div className={s.ladderCard}>
        <Typography as="span" variant="caption" tone="muted">
          Слой {depth} · {LEVEL_NAMES[depth]}
        </Typography>
        <div className={s.ladderControls}>
          <LadderField value="Поле" />
          <Button.Root variant="soft" tone="neutral" tabIndex={-1}>
            Кнопка
          </Button.Root>
        </div>
        {depth < 4 ? <LadderLevel depth={depth + 1} /> : null}
      </div>
    </Card.Root>
  );
}

/** The whole ladder in one theme: a page of its own (`data-theme` resets it to layer 0). */
function LadderIsland({ scheme }: { scheme: "light" | "dark" }) {
  return (
    <div className={s.ladderIsland} data-theme={scheme} aria-hidden>
      <SurfaceDepthProvider value={0}>
        <Typography as="span" variant="caption" tone="muted">
          {scheme === "light" ? "Светлая" : "Тёмная"} · слой 0 · страница
        </Typography>
        <div className={s.ladderControls}>
          <LadderField value="Поле" />
          <Button.Root variant="soft" tone="neutral" tabIndex={-1}>
            Кнопка
          </Button.Root>
        </div>
        <LadderLevel depth={1} />
      </SurfaceDepthProvider>
    </div>
  );
}

const LADDER_ROWS = [
  { key: "0", label: "0 · страница", use: "Фон приложения, панель контента AppShell" },
  { key: "1", label: "1 · карточка", use: "Card, Sidebar, таблица на странице" },
  { key: "2", label: "2 · блок", use: "Карточка в карточке, таблица в карточке" },
  { key: "3", label: "3 · плитка", use: "Плитка внутри блока" },
  { key: "4", label: "4 · вставка", use: "Самая глубокая вложенность" },
  { key: "floating", label: "floating", use: "Меню, поповер, модалка, drawer, уведомление" },
] as const;

const LADDER_ROLES = ["bg", "fill", "fill-hover", "selected"] as const;

function LadderTable() {
  const host = React.useRef<HTMLDivElement>(null);
  const names = React.useMemo(
    () =>
      LADDER_ROWS.flatMap((row) =>
        LADDER_ROLES.map((role) => `--prime-color-layer-${row.key}-${role}`),
      ),
    [],
  );
  const colors = useComputedColors(host, names);
  type Row = (typeof LADDER_ROWS)[number];
  const chip = (name: string) => {
    const color = colors[name];
    return (
      <span className={s.ladderChip}>
        <span className={s.ladderChipFill} style={{ background: `var(${name})` }} />
        <span className={s.numeric}>{color ? toHex(color) : "…"}</span>
      </span>
    );
  };
  const columns: DataTableColumn<Row>[] = [
    {
      id: "layer",
      header: "Слой",
      cell: (row) => (
        <span className={s.ladderLabel}>
          <Typography as="span" variant="body-s" weight="medium">
            {row.label}
          </Typography>
          <Typography as="span" variant="caption" tone="muted">
            {row.use}
          </Typography>
        </span>
      ),
    },
    ...LADDER_ROLES.map(
      (role): DataTableColumn<Row> => ({
        id: role,
        header: role,
        cell: (row) => chip(`--prime-color-layer-${row.key}-${role}`),
      }),
    ),
  ];
  return (
    <div ref={host}>
      <DocTable columns={columns} rows={[...LADDER_ROWS]} getRowKey={(row) => row.key} />
    </div>
  );
}

type ContextVar = { name: string; meaning: string };

const CONTEXT_VARS: ContextVar[] = [
  { name: "--prime-color-layer-current", meaning: "Заливка самой поверхности" },
  { name: "--prime-color-layer-nested", meaning: "Поверхность, вложенная в эту (плитка, вставка)" },
  { name: "--prime-color-field-bg", meaning: "Поле в покое: на шаг от слоя" },
  { name: "--prime-color-field-bg-hover", meaning: "Поле при наведении: на два шага" },
  { name: "--prime-color-field-bg-focus", meaning: "Поле в фокусе: цвет слоя, рамку даёт кольцо" },
  {
    name: "--prime-color-fill-muted",
    meaning: "Нейтральная кнопка, чип, трек сегментов, полоса вкладок",
  },
  { name: "--prime-color-fill-muted-hover", meaning: "Их наведение" },
  { name: "--prime-color-control-selected", meaning: "Выбранный сегмент на треке" },
  { name: "--prime-layer-shadow", meaning: "Лёгкая тень: только у карточки на странице" },
];

const CONTEXT_COLUMNS: DataTableColumn<ContextVar>[] = [
  { id: "name", header: "Переменная", cell: (row) => <TokenName>{row.name}</TokenName> },
  { id: "meaning", header: "Что это", accessor: "meaning" },
];

function Swatch({ path }: { path: string }) {
  const theme = useDocumentTheme();
  const varName = toVarName(path);
  // Read the value on the chip itself: panels switch the field context, the page does not.
  const chip = React.useRef<HTMLDivElement>(null);
  const [color, setColor] = React.useState<Rgba | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `theme` triggers a re-read
  React.useLayoutEffect(() => {
    if (chip.current) setColor(parseColor(getComputedStyle(chip.current).backgroundColor));
  }, [theme, varName]);
  const transparent = color?.a === 0;
  const source = sourceValue(path, theme);
  // Literal values (rgba, transparent) are already shown as the resolved color.
  const ref =
    source && (source.startsWith("{") || source.includes("var(")) ? refLabel(source) : null;
  return (
    <figure className={s.swatch}>
      <div
        ref={chip}
        className={s.swatchChip}
        data-transparent={transparent || undefined}
        style={{ "--swatch": `var(${varName})` } as React.CSSProperties}
      />
      <figcaption className={s.swatchCaption}>
        <Typography as="span" variant="body-s" weight="medium">
          {path.split(".").slice(2).join(".")}
        </Typography>
        <TokenName>{varName}</TokenName>
        <Typography as="span" variant="caption" tone="muted" className={s.numeric}>
          {color ? (transparent ? "transparent" : toHex(color)) : "…"}
          {ref ? ` · ${ref}` : null}
        </Typography>
      </figcaption>
    </figure>
  );
}

function RoleGroups() {
  return (
    <div className={s.roleGroups}>
      {ROLE_GROUPS.map((group) => (
        <Panel key={group} className={s.roleGroup}>
          <div className={s.roleGroupHead}>
            <Typography as="h3" variant="title-s">
              <code>color.{group}</code>
            </Typography>
            {GROUP_NOTES[group] ? (
              <Typography as="p" variant="body-s" tone="muted">
                {GROUP_NOTES[group]}
              </Typography>
            ) : null}
          </div>
          <div className={s.swatchGrid}>
            {semanticLeaves(`color.${group}`).map((leaf) => (
              <Swatch key={leaf.path} path={leaf.path} />
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}

const PALETTE_COLUMNS: DataTableColumn<string>[] = [
  { id: "hue", header: "Оттенок", accessor: (hue) => hue },
  {
    id: "soft",
    header: "soft",
    cell: (hue) => <Badge.Root color={hue as PaletteColor}>Метка</Badge.Root>,
  },
  {
    id: "solid",
    header: "solid",
    cell: (hue) => (
      <Badge.Root color={hue as PaletteColor} variant="solid">
        Метка
      </Badge.Root>
    ),
  },
  {
    id: "vars",
    header: "Переменные",
    cell: (hue) => (
      <TokenName>{`--prime-color-palette-${hue}-{soft,text,solid,solid-fg}`}</TokenName>
    ),
  },
];

function PaletteTable() {
  return <DocTable columns={PALETTE_COLUMNS} rows={PALETTE_HUES} getRowKey={(hue) => hue} />;
}

/* --- Primitive ramps --------------------------------------------------------- */

type Ramp = { hue: string; steps: { step: string; hex: string }[] };

const RAMPS: Ramp[] = Object.entries(
  primitiveTokens.color as Record<string, string | Record<string, string>>,
)
  .flatMap(([hue, steps]) => (typeof steps === "object" ? [{ hue, steps }] : []))
  .map(({ hue, steps }) => ({
    hue,
    steps: Object.entries(steps)
      .map(([step, hex]) => ({ step, hex }))
      .sort((a, b) => Number(a.step) - Number(b.step)),
  }));

const INK_LIGHT = parseColor(primitiveTokens.color.white);
const INK_DARK = parseColor(primitiveTokens.color.gray[925]);

/** Picks the more readable of two primitive inks for a label on a ramp step. */
function inkFor(hex: string): string {
  const bg = parseColor(hex);
  if (!bg || !INK_LIGHT || !INK_DARK) return primitiveTokens.color.gray[925];
  return contrastRatio(bg, INK_DARK) >= contrastRatio(bg, INK_LIGHT)
    ? primitiveTokens.color.gray[925]
    : primitiveTokens.color.white;
}

function PrimitiveRamps() {
  return (
    <Panel className={s.ramps}>
      {RAMPS.map((ramp) => (
        <div key={ramp.hue} className={s.ramp}>
          <Typography as="span" variant="body-s" weight="medium" className={s.rampName}>
            {ramp.hue}
          </Typography>
          <ul className={s.rampSteps} aria-label={`Шкала ${ramp.hue}`}>
            {ramp.steps.map(({ step, hex }) => (
              <li
                key={step}
                className={s.rampStep}
                style={{ background: hex, color: inkFor(hex) }}
                title={`--prime-ref-color-${ramp.hue}-${step} · ${hex}`}
              >
                <span>{step}</span>
                <span className={s.rampHex}>{hex.slice(1)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Panel>
  );
}

/* --- Contrast ---------------------------------------------------------------- */

type Pair = { fg: string; bg: string; min: number; note?: string };

const TEXT = 4.5;
const UI = 3;

/** Key text/background pairs from foundation §3. Paths are semantic, values are read live. */
const LAYER_ROWS = ["0", "1", "2", "3", "4", "floating"];

const CONTRAST_PAIRS: Pair[] = [
  ...LAYER_ROWS.flatMap((row): Pair[] => [
    { fg: "color.text.primary", bg: `color.layer.${row}.bg`, min: TEXT },
    { fg: "color.text.muted", bg: `color.layer.${row}.bg`, min: TEXT },
    { fg: "color.text.placeholder", bg: `color.layer.${row}.fill`, min: TEXT },
  ]),
  { fg: "color.text.secondary", bg: "color.layer.0.bg", min: TEXT },
  { fg: "color.text.secondary", bg: "color.layer.1.bg", min: TEXT },
  { fg: "color.text.muted", bg: "color.layer.4.fill-hover", min: TEXT },
  { fg: "color.text.disabled", bg: "color.layer.1.bg", min: 0, note: "не требуется" },
  { fg: "color.text.inverse", bg: "color.bg.inverse", min: TEXT },
  { fg: "color.accent.fg", bg: "color.accent.default", min: TEXT },
  { fg: "color.accent.text", bg: "color.layer.1.bg", min: TEXT },
  { fg: "color.accent.text", bg: "color.accent.soft", min: TEXT },
  { fg: "color.danger.fg", bg: "color.danger.default", min: TEXT },
  { fg: "color.danger.text", bg: "color.danger.soft", min: TEXT },
  { fg: "color.success.fg", bg: "color.success.default", min: TEXT },
  { fg: "color.success.text", bg: "color.success.soft", min: TEXT },
  { fg: "color.warning.fg", bg: "color.warning.default", min: TEXT },
  { fg: "color.warning.text", bg: "color.warning.soft", min: TEXT },
  { fg: "color.info.fg", bg: "color.info.default", min: TEXT },
  { fg: "color.info.text", bg: "color.info.soft", min: TEXT },
  { fg: "color.tooltip.text", bg: "color.tooltip.bg", min: TEXT },
  { fg: "color.focus.ring", bg: "color.layer.0.bg", min: UI, note: "кольцо фокуса" },
  { fg: "color.focus.ring", bg: "color.layer.1.bg", min: UI, note: "кольцо фокуса" },
  { fg: "color.focus.ring", bg: "color.layer.4.bg", min: UI, note: "кольцо фокуса" },
  ...PALETTE_HUES.flatMap((hue): Pair[] => [
    { fg: `color.palette.${hue}.text`, bg: `color.palette.${hue}.soft`, min: TEXT },
    { fg: `color.palette.${hue}.solidFg`, bg: `color.palette.${hue}.solid`, min: TEXT },
  ]),
];

/** Translucent backgrounds are composited over the surface they normally sit on: a card. */
const BACKDROP = toVarName("color.layer.1.bg");

function ContrastTable() {
  const host = React.useRef<HTMLDivElement>(null);
  const varNames = React.useMemo(
    () => [BACKDROP, ...new Set(CONTRAST_PAIRS.flatMap((p) => [toVarName(p.fg), toVarName(p.bg)]))],
    [],
  );
  const colors = useComputedColors(host, varNames);
  const backdrop = colors[BACKDROP];

  const rows = CONTRAST_PAIRS.map((pair) => {
    const fgRaw = colors[toVarName(pair.fg)];
    const bgRaw = colors[toVarName(pair.bg)];
    let ratio: number | null = null;
    if (fgRaw && bgRaw && backdrop) {
      const bg = bgRaw.a < 1 ? composite(bgRaw, backdrop) : bgRaw;
      const fg = fgRaw.a < 1 ? composite(fgRaw, bg) : fgRaw;
      ratio = contrastRatio(fg, bg);
    }
    return { pair, ratio };
  });

  const columns: DataTableColumn<(typeof rows)[number]>[] = [
    {
      id: "sample",
      header: "Пример",
      cell: ({ pair }) => (
        <span
          className={s.contrastSample}
          style={{
            background: `var(${toVarName(pair.bg)})`,
            color: `var(${toVarName(pair.fg)})`,
          }}
        >
          {pair.min === UI ? <span className={s.contrastRing} /> : "Аа"}
        </span>
      ),
    },
    {
      id: "fg",
      header: "Текст / элемент",
      cell: ({ pair }) => <TokenName>{toVarName(pair.fg)}</TokenName>,
    },
    { id: "bg", header: "Фон", cell: ({ pair }) => <TokenName>{toVarName(pair.bg)}</TokenName> },
    {
      id: "ratio",
      header: "Контраст",
      numeric: true,
      cell: ({ ratio }) => (ratio === null ? "…" : `${ratio.toFixed(2)} : 1`),
    },
    {
      id: "verdict",
      header: "Норма",
      cell: ({ pair, ratio }) => {
        if (pair.min === 0) return <Badge.Root>{pair.note}</Badge.Root>;
        const pass = ratio !== null && ratio >= pair.min;
        const aaa = ratio !== null && pair.min === TEXT && ratio >= 7;
        return (
          <Badge.Root color={pass ? "green" : "red"}>
            {pass ? (aaa ? "AAA" : pair.min === UI ? "≥ 3 : 1" : "AA") : "Ниже нормы"}
          </Badge.Root>
        );
      },
    },
  ];

  return (
    <div ref={host}>
      <DocTable columns={columns} rows={rows} getRowKey={({ pair }) => `${pair.fg}|${pair.bg}`} />
    </div>
  );
}

export default function ColorsPage() {
  const theme = useDocumentTheme();
  return (
    <DocPage
      title="Цвет"
      description={
        <>
          Компоненты берут цвет только из семантических ролей <code>--prime-color-*</code>. Роль
          описывает назначение, а не оттенок: в тёмной теме у той же роли другое значение.
          Поверхности и заливки контролов стоят на одной лестнице, поэтому компонент никогда не
          сливается с тем, на чём лежит. Таблицы ниже показывают текущую тему —{" "}
          {theme === "dark" ? "тёмную" : "светлую"}; переключите её кнопкой в шапке.
        </>
      }
    >
      <DocBlock title="Подход">
        <DocList>
          <li>
            Поверхности — лестница из страницы (слой 0) и четырёх вложенных слоёв. Соседние слои
            отличаются на один шаг светлоты: ΔL 0.03 в OKLab. Цвета считаются при сборке токенов в{" "}
            <code>tokens/layers.ts</code>, в CSS попадают готовые значения.
          </li>
          <li>
            Вложенный слой на шаг светлее родителя. Если до края меньше полушага, шаг идёт обратно;
            если после шага до края остаётся меньше полушага, цвет ставится ровно на край.
          </li>
          <li>
            Светлая тема: страница <code>#f3f4f6</code>, карточка чисто белая, глубже слои
            чередуются с тоном страницы. Тёмная: страница почти чёрная <code>#0d0f13</code>, каждый
            слой светлее предыдущего.
          </li>
          <li>
            Оттенок и насыщенность берутся у страницы, поэтому холодный оттенок Graphite есть на
            каждом слое.
          </li>
          <li>
            Контролы на слое (поле, чип, нейтральная кнопка, трек сегментов) на шаг темнее слоя в
            светлой теме и на шаг светлее в тёмной. Выбранный сегмент на два шага светлее трека.
            Поле в фокусе принимает цвет слоя, рамку даёт кольцо.
          </li>
          <li>
            Плавающие слои (меню, поповер, модалка, drawer, уведомление) — на шаг выше карточки. В
            светлой теме они белые, глубину даёт тень.
          </li>
          <li>
            Фон вне лестницы (тонированный Banner, акцентная подложка, картинка) — глубина{" "}
            <code>tinted</code>: контролы на нём берут прозрачные заливки, которые читаются на любом
            цвете.
          </li>
          <li>
            Прозрачными остаются только состояния: hover строк и ghost-кнопок, треки чекбокса и
            switch (<code>color.fill.*</code>).
          </li>
        </DocList>
      </DocBlock>

      <DocBlock
        title="Лестница в обеих темах"
        description="Страница и четыре вложенные карточки кита. В каждой одно и то же поле и нейтральная кнопка: их заливка всегда на шаг от слоя."
      >
        <div className={s.ladderGrid}>
          <LadderIsland scheme="light" />
          <LadderIsland scheme="dark" />
        </div>
      </DocBlock>

      <DocBlock
        title="Токены слоёв"
        description={
          <>
            <code>--prime-color-layer-&lt;слой&gt;-&lt;роль&gt;</code>: <code>bg</code> — сам слой,{" "}
            <code>fill</code> — контролы на нём, <code>fill-hover</code> — их наведение,{" "}
            <code>selected</code> — выбранный сегмент на треке. Компоненты читают их не напрямую, а
            через контекстные переменные ниже.
          </>
        }
      >
        <LadderTable />
      </DocBlock>

      <DocBlock
        title="Контекстные переменные"
        description={
          <>
            Поверхность ставит <code>data-depth</code> (0–4, <code>floating</code>,{" "}
            <code>tinted</code>), и эти переменные указывают на строку своего слоя. Компонент пишет{" "}
            <code>background: var(--prime-color-field-bg)</code> и сам не знает, где лежит.
          </>
        }
      >
        <DocTable columns={CONTEXT_COLUMNS} rows={CONTEXT_VARS} getRowKey={(row) => row.name} />
      </DocBlock>

      <DocBlock title="Как применять">
        <DocList>
          <li>
            Слой ставят сами компоненты: Card, Sidebar, Accordion, DataTable, LoginForm,
            Datepicker.Panel, Banner с обводкой. Карточка в карточке получает следующий слой без
            настроек.
          </li>
          <li>
            Панель контента AppShell — это сама страница: в светлой теме серая, карточки на ней
            белые. Сайдбар рядом — отдельный слой 1: белый в светлой теме, на шаг светлее страницы в
            тёмной, поэтому он не сливается с контентом.
          </li>
          <li>
            Свой контейнер с фоном делайте через Card. Не красьте блоки в{" "}
            <code>--prime-color-layer-2-bg</code> руками: слой зависит от того, где блок лежит.
          </li>
          <li>
            Глубже четвёртого слоя лестница не идёт. Если вложенности больше, разделите экран
            отступами и заголовками.
          </li>
          <li>
            Тень только у карточки на странице (<code>--prime-layer-shadow</code>) и у плавающих
            слоёв. Глубже карточки — плоские плитки.
          </li>
        </DocList>
      </DocBlock>

      <DocBlock
        title="Семантические роли"
        description={
          <>
            Под каждым образцом: переменная, итоговый цвет и примитив, на который роль ссылается в
            этой теме. Пути в <code>tokens/semantic.ts</code> переводятся в имена переменных по
            правилу <code>color.text.primary</code> → <code>--prime-color-text-primary</code>.
          </>
        }
      >
        <RoleGroups />
      </DocBlock>

      <DocBlock
        title="Палитра меток"
        description={
          <>
            <code>color.palette.&lt;hue&gt;</code> раскрашивает Badge и Avatar. Мягкий вариант (soft
            + text) используется по умолчанию, сплошной (solid + solidFg) — для редких акцентов.
          </>
        }
      >
        <PaletteTable />
      </DocBlock>

      <DocBlock
        title="Контраст WCAG"
        description={
          <>
            Отношение считается по цветам, которые браузер вычислил прямо сейчас. Полупрозрачные
            фоны смешиваются с <code>{BACKDROP}</code>. Для текста нужно не меньше 4.5 : 1, для
            кольца фокуса — 3 : 1.
          </>
        }
      >
        <ContrastTable />
      </DocBlock>

      <DocBlock
        title="Примитивы"
        description={
          <>
            Исходные шкалы из <code>tokens/primitives.ts</code> (<code>--prime-ref-color-*</code>).
            Они нужны, чтобы собирать роли, а не чтобы красить компоненты напрямую. Наведите на шаг,
            чтобы увидеть имя переменной.
          </>
        }
      >
        <PrimitiveRamps />
      </DocBlock>
    </DocPage>
  );
}
