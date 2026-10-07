import {
  FoundationPage,
  FoundationSection,
  Panel,
  RuleList,
  TokenName,
  TokenTable,
} from "./FoundationKit";
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
          <span className={s.radiusName}>
            {r.key} · {r.label}
          </span>
          <TokenName>{r.varName}</TokenName>
        </Panel>
      ))}
    </div>
  );
}

function ComponentRadii() {
  return (
    <TokenTable head={["Где", "Токен", "px", ""]}>
      {COMPONENT_RADII.map((row) => {
        const varName = toVarName(row.path);
        return (
          <tr key={row.path}>
            <th scope="row">{row.name}</th>
            <td>
              <TokenName>{varName}</TokenName>
            </td>
            <td className={s.numeric}>{formatPx(semanticPx(row.path))}</td>
            <td>
              <span className={s.radiusMini} style={{ borderRadius: `var(${varName})` }} />
            </td>
          </tr>
        );
      })}
    </TokenTable>
  );
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
            <span key={item} className={s.nestedItem} data-active={i === 0 || undefined}>
              {item}
            </span>
          ))}
        </div>
        <p className={s.caseCaption} data-tone="pass">
          Так: {PANEL_R} − {PANEL_P} = {ITEM_R}. Внутренний угол повторяет внешний.
        </p>
      </div>
      <div className={s.nestedCase}>
        <div className={s.nestedPanel}>
          {items.map((item, i) => (
            <span
              key={item}
              className={s.nestedItem}
              data-active={i === 0 || undefined}
              style={{ borderRadius: "var(--prime-panel-radius)" }}
            >
              {item}
            </span>
          ))}
        </div>
        <p className={s.caseCaption} data-tone="fail">
          Не так: у пункта тот же радиус {PANEL_R}. В углах зазор становится неровным.
        </p>
      </div>
    </div>
  );
}

export default function RadiusPage() {
  return (
    <FoundationPage
      title="Радиусы"
      description={
        <>
          Скругления умеренные: 8 у контролов, 12 у карточек и панелей, 16 у модалок. Компоненты
          берут радиус из своего токена или уровня размера, а не из общей шкалы напрямую.
        </>
      }
    >
      <FoundationSection title="Шкала">
        <RadiusScale />
      </FoundationSection>

      <FoundationSection
        title="Вложенный радиус"
        description="Внутренний радиус равен внешнему минус отступ между ними. Плавающая панель: радиус 12, отступ 4, у пунктов 8."
      >
        <NestedDemo />
      </FoundationSection>

      <FoundationSection title="Радиусы компонентов">
        <ComponentRadii />
      </FoundationSection>

      <FoundationSection title="Правила">
        <RuleList>
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
        </RuleList>
      </FoundationSection>
    </FoundationPage>
  );
}
