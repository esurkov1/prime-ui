import type { CSSProperties } from "react";

import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { DemoApiTitle, DemoDescription } from "../components/PlaygroundDemoTypography";
import { FoundationPage, FoundationSection, Panel, RuleList, TokenTable } from "./FoundationKit";
import s from "./foundation.module.css";
import { formatPx, SIZE_TIERS, type SizeTier, semanticPx, toVarName } from "./tokenModel";

const px = (path: string) => formatPx(semanticPx(path));
const pair = (size: string, lh: string) => `${px(size)}/${px(lh)}`;

/** Columns of foundation §6; every cell is read from `semanticTokens.control.<tier>`. */
const COLUMNS: { head: string; cell: (t: SizeTier) => string }[] = [
  { head: "Высота", cell: (t) => px(`control.${t}.height`) },
  { head: "Текст", cell: (t) => pair(`control.${t}.textSize`, `control.${t}.lineHeight`) },
  { head: "Кнопка padX", cell: (t) => px(`control.${t}.paddingX`) },
  { head: "Поле padX", cell: (t) => px(`control.${t}.fieldPaddingX`) },
  { head: "Gap", cell: (t) => px(`control.${t}.gap`) },
  { head: "Иконка", cell: (t) => px(`control.${t}.icon`) },
  { head: "Радиус", cell: (t) => px(`control.${t}.radius`) },
  { head: "Подпись", cell: (t) => pair(`control.${t}.labelSize`, `control.${t}.labelLineHeight`) },
  { head: "Подсказка", cell: (t) => pair(`control.${t}.hintSize`, `control.${t}.hintLineHeight`) },
  { head: "Пункт меню", cell: (t) => px(`control.${t}.itemHeight`) },
  { head: "Checkbox", cell: (t) => px(`control.${t}.choice`) },
];

function TierTable() {
  return (
    <TokenTable head={["Уровень", ...COLUMNS.map((c) => c.head)]}>
      {SIZE_TIERS.map((t) => (
        <tr key={t} data-default={t === "m" || undefined}>
          <th scope="row">
            {t}
            {t === "m" ? <span className={s.defaultMark}>по умолчанию</span> : null}
          </th>
          {COLUMNS.map((c) => (
            <td key={c.head} className={s.numeric}>
              {c.cell(t)}
            </td>
          ))}
        </tr>
      ))}
    </TokenTable>
  );
}

/** Badge tier one step down from a control tier (pairing rule). */
function badgeTierFor(t: SizeTier): SizeTier {
  const i = SIZE_TIERS.indexOf(t);
  return SIZE_TIERS[Math.max(0, i - 1)];
}

function tierVars(t: SizeTier): CSSProperties {
  const v = (k: string) => `var(${toVarName(`control.${t}.${k}`)})`;
  const b = badgeTierFor(t);
  const bv = (k: string) => `var(${toVarName(`badge.${b}.${k}`)})`;
  return {
    "--t-height": v("height"),
    "--t-pad": v("paddingX"),
    "--t-field-pad": v("fieldPaddingX"),
    "--t-gap": v("gap"),
    "--t-icon": v("icon"),
    "--t-radius": v("radius"),
    "--t-text": v("textSize"),
    "--t-lh": v("lineHeight"),
    "--t-choice": v("choice"),
    "--t-label": v("labelSize"),
    "--t-label-lh": v("labelLineHeight"),
    "--t-label-gap": v("labelGap"),
    "--t-hint": v("hintSize"),
    "--t-hint-lh": v("hintLineHeight"),
    "--t-hint-gap": v("hintGap"),
    "--t-item": v("itemHeight"),
    "--b-height": bv("height"),
    "--b-pad": bv("paddingX"),
    "--b-text": bv("textSize"),
    "--b-radius": bv("radius"),
  } as CSSProperties;
}

/** Plain blocks styled only by tier tokens: renders even while components are being reworked. */
function TierRow({ t }: { t: SizeTier }) {
  return (
    <div className={s.tierRow} style={tierVars(t)}>
      <span className={s.tierName}>
        {t} · {px(`control.${t}.height`)}
      </span>
      <div className={s.tierItems}>
        <span className={s.tierButton} data-tone="accent">
          <span className={s.tierIcon} />
          Сохранить
        </span>
        <span className={s.tierButton} data-tone="neutral">
          Отмена
        </span>
        <span className={s.tierIconButton} title="Квадратная: ширина = высоте">
          <span className={s.tierIcon} />
        </span>
        <span className={s.tierField}>
          <span className={s.tierPlaceholder}>Поиск</span>
          <span className={s.tierBadge}>⌘K</span>
        </span>
        <span className={s.tierSegmented}>
          <span data-active>День</span>
          <span>Неделя</span>
        </span>
        <span className={s.tierChoice} />
      </div>
    </div>
  );
}

function TierLiveRows() {
  return (
    <Panel className={s.tierPanel}>
      {SIZE_TIERS.map((t) => (
        <TierRow key={t} t={t} />
      ))}
    </Panel>
  );
}

/** A field + label + hint + open menu of one tier: shows the pairing rules together. */
function PairingDemo() {
  return (
    <div className={s.pairingGrid}>
      {(["s", "m", "l"] as const).map((t) => (
        <Panel key={t} className={s.pairingCard} style={tierVars(t)}>
          <span className={s.demoLabel}>Уровень {t}</span>
          <div className={s.pairField}>
            <span className={s.pairLabel}>Город</span>
            <span className={s.tierField} data-open>
              <span>Москва</span>
            </span>
            <span className={s.pairHint}>Подсказка мельче текста поля</span>
          </div>
          <div className={s.pairMenu}>
            {["Москва", "Казань", "Самара"].map((city, i) => (
              <span key={city} className={s.pairItem} data-active={i === 0 || undefined}>
                {city}
              </span>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}

const BADGE_COLS = ["height", "paddingX", "textSize", "icon", "gap", "radius"] as const;

function BadgeTable() {
  return (
    <TokenTable head={["Badge", "Высота", "padX", "Текст", "Иконка", "Gap", "Радиус", ""]}>
      {SIZE_TIERS.map((t) => (
        <tr key={t}>
          <th scope="row">{t}</th>
          {BADGE_COLS.map((k) => (
            <td key={k} className={s.numeric}>
              {px(`badge.${t}.${k}`)}
            </td>
          ))}
          <td>
            <span
              className={s.tierBadge}
              style={
                {
                  "--b-height": `var(${toVarName(`badge.${t}.height`)})`,
                  "--b-pad": `var(${toVarName(`badge.${t}.paddingX`)})`,
                  "--b-text": `var(${toVarName(`badge.${t}.textSize`)})`,
                  "--b-radius": `var(${toVarName(`badge.${t}.radius`)})`,
                } as CSSProperties
              }
            >
              Новый
            </span>
          </td>
        </tr>
      ))}
    </TokenTable>
  );
}

const providerRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: "—",
    required: "Да",
    description: "Уровень размера, который получат дочерние компоненты без явного `size`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Поддерево, в котором действует контекст.",
  },
];

export default function SizeTiersPage() {
  return (
    <FoundationPage
      title="Размеры"
      description={
        <>
          Одна ось размеров для всех контролов: <code>xs · s · m · l · xl</code>, по умолчанию{" "}
          <code>m</code>. Контролы одного уровня стоят в ряд без подгонки: Button, Input, Select,
          Datepicker, SegmentedControl, Tabs. Переменные:{" "}
          <code>--prime-control-&lt;tier&gt;-*</code>.
        </>
      }
    >
      <FoundationSection
        title="Таблица уровней"
        description="Значения в пикселях, прочитаны из semanticTokens.control."
      >
        <TierTable />
      </FoundationSection>

      <FoundationSection
        title="В одну линию"
        description="Каждая строка собрана из обычных блоков на токенах своего уровня. Высоты совпадают, базовая линия текста общая."
      >
        <TierLiveRows />
      </FoundationSection>

      <FoundationSection title="Правила пар">
        <RuleList>
          <li>
            Поле уровня T берёт подпись и подсказку того же уровня. Подсказка и ошибка всегда мельче
            текста поля.
          </li>
          <li>
            Меню, открытое от триггера уровня T, использует <code>item-height</code> того же уровня
            и тот же кегль.
          </li>
          <li>
            Badge и Kbd внутри контрола уровня T берут badge-уровень на ступень ниже: в поле{" "}
            <code>m</code> стоит badge <code>s</code>.
          </li>
          <li>Кнопка только с иконкой квадратная: ширина равна высоте.</li>
          <li>
            В поле иконка стоит посередине между краем и текстом: край → иконка = иконка → текст ={" "}
            <code>field-padding-x</code> уровня. Это касается и шеврона, и кнопки очистки.
          </li>
          <li>
            В кнопке со стороны иконки отступ на 4 px меньше: <code>padX − 4px</code>, но не меньше
            8 px. Так иконка и подпись выглядят одной группой по центру.
          </li>
        </RuleList>
        <PairingDemo />
      </FoundationSection>

      <FoundationSection
        title="Badge, Kbd"
        description={
          <>
            Свои уровни высоты 16 · 20 · 24 · 28 · 32: <code>--prime-badge-&lt;tier&gt;-*</code>.
          </>
        }
      >
        <BadgeTable />
      </FoundationSection>

      <FoundationSection
        title="ControlSizeProvider"
        description={
          <>
            Передаёт уровень вниз по дереву. Компоненты без явного <code>size</code> (например,{" "}
            <code>Icon</code>) берут его из ближайшего провайдера. Хук{" "}
            <code>useOptionalControlSize()</code> возвращает уровень или <code>undefined</code> вне
            провайдера.
          </>
        }
      >
        <DemoApiTitle>ControlSizeProvider</DemoApiTitle>
        <PlaygroundApiTable rows={providerRows} />
        <DemoDescription>
          Явный <code>size</code> на компоненте всегда важнее контекста.
        </DemoDescription>
      </FoundationSection>
    </FoundationPage>
  );
}
