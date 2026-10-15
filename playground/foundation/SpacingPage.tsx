import * as React from "react";

import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Hint } from "@/components/hint/Hint";
import { Input } from "@/components/input/Input";
import { Label } from "@/components/label/Label";
import { Switch } from "@/components/switch/Switch";
import { Typography } from "@/components/typography/Typography";

import { DocBlock, DocList, DocPage, DocTable } from "../components/Doc";
import { Panel, TokenName } from "./FoundationKit";
import s from "./foundation.module.css";
import { formatPx, semanticKeys, semanticPx, toVarName } from "./tokenModel";

const SCALE = semanticKeys("space").map((step) => ({
  step,
  varName: toVarName(`space.${step}`),
  px: semanticPx(`space.${step}`),
}));

function SpaceScale() {
  return (
    <Panel className={s.spaceScale}>
      {SCALE.map(({ step, varName, px }) => (
        <div key={step} className={s.spaceRow}>
          <Typography as="span" variant="body-s" weight="medium">
            {step}
          </Typography>
          <Typography as="span" variant="body-s" tone="muted" className={s.numeric}>
            {formatPx(px)}px
          </Typography>
          <span className={s.spaceTrack}>
            <span className={s.spaceBar} style={{ width: `var(${varName})` }} />
          </span>
          <TokenName>{varName}</TokenName>
        </div>
      ))}
    </Panel>
  );
}

type Rule = { name: string; varName: string; alt?: string; note: string };

/** Proximity rules (foundation §1.3), each mapped to the token that implements it. */
const RULES: Rule[] = [
  {
    name: "Подпись → поле",
    varName: "--prime-control-m-label-gap",
    note: "4–8 px, зависит от размера поля (label-gap уровня)",
  },
  {
    name: "Поле → подсказка",
    varName: "--prime-control-m-hint-gap",
    note: "Подсказка прилегает к своему полю",
  },
  { name: "Поле → поле", varName: toVarName("space.5"), note: "Соседние поля одной группы" },
  { name: "Группа → группа", varName: toVarName("space.8"), note: "Смысловые блоки формы" },
  {
    name: "Секция → секция",
    varName: toVarName("space.10"),
    alt: toVarName("space.12"),
    note: "Крупные разделы страницы, 40–48 px",
  },
];

/** Measures a length token by rendering it as a width. */
function TokenPx({ varName }: { varName: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [px, setPx] = React.useState<number | null>(null);
  React.useLayoutEffect(() => {
    if (ref.current) setPx(Number.parseFloat(getComputedStyle(ref.current).width));
  }, []);
  return (
    <>
      <span ref={ref} className={s.measureProbe} style={{ width: `var(${varName})` }} aria-hidden />
      {px === null ? "…" : `${formatPx(px)} px`}
    </>
  );
}

const RULE_COLUMNS: DataTableColumn<Rule>[] = [
  { id: "name", header: "Связь", accessor: "name" },
  {
    id: "token",
    header: "Токен",
    cell: (rule) => (
      <span className={s.tokenStack}>
        <TokenName>{rule.varName}</TokenName>
        {rule.alt ? <TokenName>{rule.alt}</TokenName> : null}
      </span>
    ),
  },
  {
    id: "value",
    header: "Значение",
    numeric: true,
    cell: (rule) => (
      <>
        <TokenPx varName={rule.varName} />
        {rule.alt ? (
          <>
            {" – "}
            <TokenPx varName={rule.alt} />
          </>
        ) : null}
      </>
    ),
  },
  { id: "note", header: "Зачем", accessor: "note" },
];

function RulesTable() {
  return <DocTable columns={RULE_COLUMNS} rows={RULES} getRowKey={(rule) => rule.name} />;
}

/* --- Live example: spacers are real elements so they can be highlighted ------- */

/** The kinds of gap the demo form shows, in legend order; a kind keeps its number on every strip. */
const GAP_KINDS = {
  heading: { label: "заголовок → группа", varName: toVarName("space.4") },
  label: { label: "подпись → поле", varName: "--prime-control-m-label-gap" },
  hint: { label: "поле → подсказка", varName: "--prime-control-m-hint-gap" },
  field: { label: "поле → поле", varName: toVarName("space.5") },
  group: { label: "группа → группа", varName: toVarName("space.8") },
  section: { label: "секция → секция", varName: toVarName("space.12") },
} as const;
type GapKind = keyof typeof GAP_KINDS;
const GAP_ORDER = Object.keys(GAP_KINDS) as GapKind[];

const gapName = (kind: GapKind) =>
  `${GAP_KINDS[kind].label} · ${GAP_KINDS[kind].varName.replace("--prime-", "")}`;

/**
 * A spacer as a real element. A wide panel names it beside the form; a narrow one has no room
 * there, so the strip carries only its number in a gutter and the legend under the form names it.
 */
function Gap({ kind }: { kind: GapKind }) {
  return (
    <div className={s.gap} style={{ height: `var(${GAP_KINDS[kind].varName})` }} aria-hidden>
      <Typography as="span" variant="caption" tone="accent" className={s.gapMarker}>
        {GAP_ORDER.indexOf(kind) + 1}
      </Typography>
      <Typography as="span" variant="caption" tone="accent" className={s.gapLabel}>
        {gapName(kind)}
      </Typography>
    </div>
  );
}

/** A real Label, Input and Hint with the spacers between them drawn as elements. */
function DemoField({ label, hint, value }: { label: string; hint?: string; value?: string }) {
  const id = React.useId();
  return (
    <div className={s.fakeFieldGroup}>
      <Label.Root htmlFor={id}>{label}</Label.Root>
      <Gap kind="label" />
      <Input.Root id={id}>
        <Input.Wrapper>
          <Input.Field defaultValue={value ?? ""} />
        </Input.Wrapper>
      </Input.Root>
      {hint ? (
        <>
          <Gap kind="hint" />
          <Hint.Root>{hint}</Hint.Root>
        </>
      ) : null}
    </div>
  );
}

function ProximityDemo() {
  const [show, setShow] = React.useState(true);
  return (
    <Panel className={s.proximityPanel}>
      <Switch.Root checked={show} onCheckedChange={setShow}>
        <Switch.Label>Показать отступы</Switch.Label>
      </Switch.Root>
      <div className={s.proximity} data-show-gaps={show || undefined}>
        <Typography as="h3" variant="title-m">
          Профиль
        </Typography>
        <Gap kind="heading" />
        <DemoField label="Имя" value="Анна" />
        <Gap kind="field" />
        <DemoField
          label="Email"
          value="anna@example.com"
          hint="На этот адрес придёт подтверждение"
        />
        <Gap kind="group" />
        <DemoField label="Компания" value="ООО «Ромашка»" />
        <Gap kind="field" />
        <DemoField label="Должность" />
        <Gap kind="section" />
        <Typography as="h3" variant="title-m">
          Уведомления
        </Typography>
        <Gap kind="heading" />
        <DemoField label="Частота писем" value="Раз в неделю" />
      </div>
      {show ? (
        <ol className={s.gapLegend}>
          {GAP_ORDER.map((kind, index) => (
            <li key={kind}>
              <Typography as="span" variant="caption" tone="accent" className={s.gapLegendMarker}>
                {index + 1}
              </Typography>
              <Typography as="span" variant="caption" tone="secondary">
                {gapName(kind)}
              </Typography>
            </li>
          ))}
        </ol>
      ) : null}
    </Panel>
  );
}

export default function SpacingPage() {
  return (
    <DocPage
      title="Отступы"
      description={
        <>
          Все размеры кратны 4 px. Ключ токена означает число шагов: <code>--prime-space-5</code> —
          это 5 × 4 = 20 px. Других значений в шкале нет. Если не хватает шага, сначала проверьте,
          правильно ли сгруппированы элементы.
        </>
      }
    >
      <DocBlock
        title="Шкала"
        description="Значения из semanticTokens.space в пикселях при корневом кегле 16 px."
      >
        <SpaceScale />
      </DocBlock>

      <DocBlock
        title="Близость"
        description="Внутри группы элементы стоят ближе друг к другу, чем группы между собой. По расстоянию пользователь понимает, что к чему относится, ещё до того, как прочитает подписи."
      >
        <RulesTable />
      </DocBlock>

      <DocBlock
        title="Как это выглядит"
        description="Форма собрана из обычных блоков на токенах. Подсвеченные полосы — это реальные отступы между элементами."
      >
        <ProximityDemo />
      </DocBlock>

      <DocBlock title="Правила">
        <DocList>
          <li>
            Расстояние между соседями задаёт <code>gap</code> у flex или grid родителя. Margin у
            дочерних элементов не используйте.
          </li>
          <li>Внутренние отступы контролов берите из размерного уровня, а не из шкалы.</li>
          <li>Важному контенту отдавайте больше воздуха, второстепенное группируйте плотнее.</li>
          <li>
            Поля страницы: <code>--prime-layout-gutter-&#123;s,m,l&#125;</code>. Ширина контента
            ограничена <code>--prime-layout-content-max-width</code>.
          </li>
        </DocList>
      </DocBlock>
    </DocPage>
  );
}
