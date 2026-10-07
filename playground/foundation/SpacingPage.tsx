import * as React from "react";

import {
  FoundationPage,
  FoundationSection,
  Panel,
  RuleList,
  TokenName,
  TokenTable,
} from "./FoundationKit";
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
          <span className={s.spaceStep}>{step}</span>
          <span className={s.spacePx}>{formatPx(px)}px</span>
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

function RulesTable() {
  return (
    <TokenTable head={["Связь", "Токен", "Значение", "Зачем"]}>
      {RULES.map((rule) => (
        <tr key={rule.name}>
          <th scope="row">{rule.name}</th>
          <td>
            <span className={s.tokenStack}>
              <TokenName>{rule.varName}</TokenName>
              {rule.alt ? <TokenName>{rule.alt}</TokenName> : null}
            </span>
          </td>
          <td className={s.numeric}>
            <TokenPx varName={rule.varName} />
            {rule.alt ? (
              <>
                {" – "}
                <TokenPx varName={rule.alt} />
              </>
            ) : null}
          </td>
          <td>{rule.note}</td>
        </tr>
      ))}
    </TokenTable>
  );
}

/* --- Live example: spacers are real elements so they can be highlighted ------- */

function Gap({ varName, label }: { varName: string; label: string }) {
  return (
    <div className={s.gap} style={{ height: `var(${varName})` }} data-gap-label={label} aria-hidden>
      <span className={s.gapLabel}>
        {label} · {varName.replace("--prime-", "")}
      </span>
    </div>
  );
}

function FakeField({ label, hint, value }: { label: string; hint?: string; value?: string }) {
  return (
    <div className={s.fakeFieldGroup}>
      <span className={s.fakeLabel}>{label}</span>
      <Gap varName="--prime-control-m-label-gap" label="подпись → поле" />
      <span className={s.fakeField}>{value ?? ""}</span>
      {hint ? (
        <>
          <Gap varName="--prime-control-m-hint-gap" label="поле → подсказка" />
          <span className={s.fakeHint}>{hint}</span>
        </>
      ) : null}
    </div>
  );
}

function ProximityDemo() {
  const [show, setShow] = React.useState(true);
  const id = React.useId();
  return (
    <Panel className={s.proximityPanel}>
      <label className={s.inlineToggle} htmlFor={id}>
        <input id={id} type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
        Показать отступы
      </label>
      <div className={s.proximity} data-show-gaps={show || undefined}>
        <h5 className={s.fakeSectionTitle}>Профиль</h5>
        <Gap varName={toVarName("space.4")} label="заголовок → группа" />
        <FakeField label="Имя" value="Анна" />
        <Gap varName={toVarName("space.5")} label="поле → поле" />
        <FakeField
          label="Email"
          value="anna@example.com"
          hint="На этот адрес придёт подтверждение"
        />
        <Gap varName={toVarName("space.8")} label="группа → группа" />
        <FakeField label="Компания" value="ООО «Ромашка»" />
        <Gap varName={toVarName("space.5")} label="поле → поле" />
        <FakeField label="Должность" />
        <Gap varName={toVarName("space.12")} label="секция → секция" />
        <h5 className={s.fakeSectionTitle}>Уведомления</h5>
        <Gap varName={toVarName("space.4")} label="заголовок → группа" />
        <FakeField label="Частота писем" value="Раз в неделю" />
      </div>
    </Panel>
  );
}

export default function SpacingPage() {
  return (
    <FoundationPage
      title="Отступы"
      description={
        <>
          Все размеры кратны 4 px. Ключ токена означает число шагов: <code>--prime-space-5</code> —
          это 5 × 4 = 20 px. Других значений в шкале нет. Если не хватает шага, сначала проверьте,
          правильно ли сгруппированы элементы.
        </>
      }
    >
      <FoundationSection
        title="Шкала"
        description="Значения из semanticTokens.space в пикселях при корневом кегле 16 px."
      >
        <SpaceScale />
      </FoundationSection>

      <FoundationSection
        title="Близость"
        description="Внутри группы элементы стоят ближе друг к другу, чем группы между собой. По расстоянию пользователь понимает, что к чему относится, ещё до того, как прочитает подписи."
      >
        <RulesTable />
      </FoundationSection>

      <FoundationSection
        title="Как это выглядит"
        description="Форма собрана из обычных блоков на токенах. Подсвеченные полосы — это реальные отступы между элементами."
      >
        <ProximityDemo />
      </FoundationSection>

      <FoundationSection title="Правила">
        <RuleList>
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
        </RuleList>
      </FoundationSection>
    </FoundationPage>
  );
}
