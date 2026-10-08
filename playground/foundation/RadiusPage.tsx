import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Typography } from "@/components/typography/Typography";

import { DocBlock, DocList, DocPage, DocTable } from "../components/Doc";
import { Panel, TokenName } from "./FoundationKit";
import s from "./foundation.module.css";
import {
  formatPx,
  resolvePrimitive,
  SIZE_TIERS,
  semanticKeys,
  semanticPx,
  sourceValue,
  toVarName,
} from "./tokenModel";

const SCALE = semanticKeys("radius").map((key) => {
  const raw = resolvePrimitive(sourceValue(`radius.${key}`, "light") ?? "");
  return {
    key,
    varName: toVarName(`radius.${key}`),
    label: key === "full" ? "pill" : `${formatPx(semanticPx(`radius.${key}`))} px`,
    raw,
  };
});

/** Where component radii come from: every path below exists in `semanticTokens`. */
const COMPONENT_RADII: { name: string; path: string }[] = [
  ...SIZE_TIERS.map((t) => ({ name: `Контрол ${t}`, path: `control.${t}.radius` })),
  { name: "Карточка", path: "card.radius" },
  { name: "Плавающая панель", path: "panel.radius" },
  { name: "Пункт в панели", path: "panel.itemRadius" },
  { name: "Модалка", path: "modal.radius" },
  { name: "Тултип", path: "tooltip.radius" },
  ...SIZE_TIERS.map((t) => ({ name: `Badge ${t}`, path: `badge.${t}.radius` })),
];

function RadiusScale() {
  return (
    <div className={s.radiusGrid}>
      {SCALE.map((r) => (
        <Panel key={r.key} className={s.radiusCard}>
          <span className={s.radiusShape} style={{ borderRadius: `var(${r.varName})` }} />
          <Typography as="span" variant="title-s">
            {r.key} · {r.label}
          </Typography>
          <TokenName>{r.varName}</TokenName>
        </Panel>
      ))}
    </div>
  );
}

type RadiusRow = (typeof COMPONENT_RADII)[number];

const RADII_COLUMNS: DataTableColumn<RadiusRow>[] = [
  { id: "name", header: "Где", accessor: "name" },
  { id: "token", header: "Токен", cell: (row) => <TokenName>{toVarName(row.path)}</TokenName> },
  { id: "px", header: "px", numeric: true, cell: (row) => formatPx(semanticPx(row.path)) },
  {
    id: "sample",
    header: "",
    cell: (row) => (
      <span className={s.radiusMini} style={{ borderRadius: `var(${toVarName(row.path)})` }} />
    ),
  },
];

function ComponentRadii() {
  return <DocTable columns={RADII_COLUMNS} rows={COMPONENT_RADII} getRowKey={(row) => row.path} />;
}

const PANEL_R = formatPx(semanticPx("panel.radius"));
const PANEL_P = formatPx(semanticPx("panel.padding"));
const ITEM_R = formatPx(semanticPx("panel.itemRadius"));

function NestedDemo() {
  const items = ["Редактировать", "Дублировать", "Переместить"];
  return (
    <div className={s.twoCol}>
      <div className={s.nestedCase}>
        <div className={s.nestedPanel}>
          {items.map((item, i) => (
            <Typography
              as="span"
              variant="body-m"
              key={item}
              className={s.nestedItem}
              data-active={i === 0 || undefined}
            >
              {item}
            </Typography>
          ))}
        </div>
        <Typography as="p" variant="body-s" tone="success">
          Так: {PANEL_R} − {PANEL_P} = {ITEM_R}. Внутренний угол повторяет внешний.
        </Typography>
      </div>
      <div className={s.nestedCase}>
        <div className={s.nestedPanel}>
          {items.map((item, i) => (
            <Typography
              as="span"
              variant="body-m"
              key={item}
              className={s.nestedItem}
              data-active={i === 0 || undefined}
              style={{ borderRadius: "var(--prime-panel-radius)" }}
            >
              {item}
            </Typography>
          ))}
        </div>
        <Typography as="p" variant="body-s" tone="danger">
          Не так: у пункта тот же радиус {PANEL_R}. В углах зазор становится неровным.
        </Typography>
      </div>
    </div>
  );
}

export default function RadiusPage() {
  return (
    <DocPage
      title="Радиусы"
      description={
        <>
          Скругления умеренные: 8 у контролов, 12 у карточек и панелей, 16 у модалок. Компоненты
          берут радиус из своего токена или уровня размера, а не из общей шкалы напрямую.
        </>
      }
    >
      <DocBlock title="Шкала">
        <RadiusScale />
      </DocBlock>

      <DocBlock
        title="Вложенный радиус"
        description="Внутренний радиус равен внешнему минус отступ между ними. Плавающая панель: радиус 12, отступ 4, у пунктов 8."
      >
        <NestedDemo />
      </DocBlock>

      <DocBlock title="Радиусы компонентов">
        <ComponentRadii />
      </DocBlock>

      <DocBlock title="Правила">
        <DocList>
          <li>
            Чем больше элемент, тем больше радиус. Маленький контрол с крупным радиусом становится
            похож на таблетку.
          </li>
          <li>
            <code>--prime-radius-full</code> подходит только для круглых и pill-форм: аватар,
            бегунок, точка статуса.
          </li>
          <li>
            Если отступ больше внешнего радиуса, внутренний угол может остаться прямым или получить
            минимальный радиус.
          </li>
        </DocList>
      </DocBlock>
    </DocPage>
  );
}
