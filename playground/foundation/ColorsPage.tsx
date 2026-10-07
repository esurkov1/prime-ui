import * as React from "react";

import { FoundationPage, FoundationSection, Panel, TokenName, TokenTable } from "./FoundationKit";
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
  bg: "Слои: страница, карточка, плавающий слой, утопленная зона, инверсия, подложка модалки.",
  fill: "Нейтральные заливки: прозрачная подсветка ghost/строк, кнопки и чипы, треки контролов.",
  text: "Текст по важности. Disabled — единственная пара, которой не нужен AA.",
  border: "Только разделители. Контролы обходятся без обводки: control прозрачен.",
  accent: "Главное действие, выбор, ссылки, активная вкладка, отмеченные контролы.",
  danger: "Ошибки и разрушительные действия.",
  success: "Успешный статус.",
  warning: "Предупреждение.",
  info: "Нейтральная информация.",
  field: "Заливка полей. На карточках поле темнее, чтобы оставаться заметным без обводки.",
  focus: "Одно кольцо фокуса для всех интерактивных элементов.",
  control: "Бегунок switch и slider.",
  tooltip: "Тултип.",
};

const ROLE_GROUPS = semanticKeys("color").filter((g) => g !== "palette");
const PALETTE_HUES = semanticKeys("color.palette");

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
        style={{ background: `var(${varName})` }}
      />
      <figcaption className={s.swatchCaption}>
        <span className={s.swatchTitle}>{path.split(".").slice(2).join(".")}</span>
        <TokenName>{varName}</TokenName>
        <span className={s.swatchMeta}>
          {color ? (transparent ? "transparent" : toHex(color)) : "…"}
          {ref ? ` · ${ref}` : null}
        </span>
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
            <h5 className={s.groupTitle}>
              <code>color.{group}</code>
            </h5>
            {GROUP_NOTES[group] ? <p className={s.groupNote}>{GROUP_NOTES[group]}</p> : null}
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

function PaletteTable() {
  return (
    <TokenTable head={["Оттенок", "soft + text", "solid + solidFg", "Переменные"]}>
      {PALETTE_HUES.map((hue) => {
        const v = (k: string) => `var(${toVarName(`color.palette.${hue}.${k}`)})`;
        return (
          <tr key={hue}>
            <th scope="row">{hue}</th>
            <td>
              <span className={s.paletteChip} style={{ background: v("soft"), color: v("text") }}>
                Метка
              </span>
            </td>
            <td>
              <span
                className={s.paletteChip}
                style={{ background: v("solid"), color: v("solidFg") }}
              >
                Метка
              </span>
            </td>
            <td>
              <TokenName>{`--prime-color-palette-${hue}-{soft,text,solid,solid-fg}`}</TokenName>
            </td>
          </tr>
        );
      })}
    </TokenTable>
  );
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
          <span className={s.rampName}>{ramp.hue}</span>
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
const CONTRAST_PAIRS: Pair[] = [
  { fg: "color.text.primary", bg: "color.bg.canvas", min: TEXT },
  { fg: "color.text.primary", bg: "color.bg.surface", min: TEXT },
  { fg: "color.text.primary", bg: "color.bg.raised", min: TEXT },
  { fg: "color.text.secondary", bg: "color.bg.canvas", min: TEXT },
  { fg: "color.text.secondary", bg: "color.bg.surface", min: TEXT },
  { fg: "color.text.muted", bg: "color.bg.canvas", min: TEXT },
  { fg: "color.text.muted", bg: "color.bg.surface", min: TEXT },
  { fg: "color.text.muted", bg: "color.fill.muted", min: TEXT },
  { fg: "color.text.placeholder", bg: "color.field.bg", min: TEXT },
  { fg: "color.text.placeholder", bg: "color.field.bgSurface", min: TEXT },
  { fg: "color.text.disabled", bg: "color.bg.surface", min: 0, note: "не требуется" },
  { fg: "color.text.inverse", bg: "color.bg.inverse", min: TEXT },
  { fg: "color.accent.fg", bg: "color.accent.default", min: TEXT },
  { fg: "color.accent.text", bg: "color.bg.surface", min: TEXT },
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
  { fg: "color.focus.ring", bg: "color.bg.canvas", min: UI, note: "кольцо фокуса" },
  { fg: "color.focus.ring", bg: "color.bg.surface", min: UI, note: "кольцо фокуса" },
  ...PALETTE_HUES.flatMap((hue): Pair[] => [
    { fg: `color.palette.${hue}.text`, bg: `color.palette.${hue}.soft`, min: TEXT },
    { fg: `color.palette.${hue}.solidFg`, bg: `color.palette.${hue}.solid`, min: TEXT },
  ]),
];

/** Translucent backgrounds are composited over the surface they normally sit on. */
const BACKDROP = toVarName("color.bg.surface");

function ContrastTable() {
  const host = React.useRef<HTMLDivElement>(null);
  const varNames = React.useMemo(
    () => [BACKDROP, ...new Set(CONTRAST_PAIRS.flatMap((p) => [toVarName(p.fg), toVarName(p.bg)]))],
    [],
  );
  const colors = useComputedColors(host, varNames);
  const backdrop = colors[BACKDROP];

  return (
    <div ref={host}>
      <TokenTable head={["Пример", "Текст / элемент", "Фон", "Контраст", "Норма"]}>
        {CONTRAST_PAIRS.map((pair) => {
          const fgRaw = colors[toVarName(pair.fg)];
          const bgRaw = colors[toVarName(pair.bg)];
          let ratio: number | null = null;
          if (fgRaw && bgRaw && backdrop) {
            const bg = bgRaw.a < 1 ? composite(bgRaw, backdrop) : bgRaw;
            const fg = fgRaw.a < 1 ? composite(fgRaw, bg) : fgRaw;
            ratio = contrastRatio(fg, bg);
          }
          const pass = ratio !== null && ratio >= pair.min;
          const aaa = ratio !== null && pair.min === TEXT && ratio >= 7;
          return (
            <tr key={`${pair.fg}|${pair.bg}`}>
              <td>
                <span
                  className={s.contrastSample}
                  style={{
                    background: `var(${toVarName(pair.bg)})`,
                    color: `var(${toVarName(pair.fg)})`,
                  }}
                >
                  {pair.min === UI ? <span className={s.contrastRing} /> : "Аа"}
                </span>
              </td>
              <td>
                <TokenName>{toVarName(pair.fg)}</TokenName>
              </td>
              <td>
                <TokenName>{toVarName(pair.bg)}</TokenName>
              </td>
              <td className={s.numeric}>{ratio === null ? "…" : `${ratio.toFixed(2)} : 1`}</td>
              <td>
                {pair.min === 0 ? (
                  <span className={s.verdict} data-tone="neutral">
                    {pair.note}
                  </span>
                ) : (
                  <span className={s.verdict} data-tone={pass ? "pass" : "fail"}>
                    {pass ? (aaa ? "AAA" : pair.min === UI ? "≥ 3 : 1" : "AA") : "Ниже нормы"}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </TokenTable>
    </div>
  );
}

export default function ColorsPage() {
  const theme = useDocumentTheme();
  return (
    <FoundationPage
      title="Цвет"
      description={
        <>
          Компоненты берут цвет только из семантических ролей <code>--prime-color-*</code>. Роль
          описывает назначение, а не оттенок: в тёмной теме у той же роли другое значение. Ниже
          показаны значения для текущей темы — {theme === "dark" ? "тёмной" : "светлой"}.
          Переключите тему в сайдбаре, и всё пересчитается.
        </>
      }
    >
      <FoundationSection
        title="Семантические роли"
        description={
          <>
            Под каждым образцом: переменная, итоговый цвет и примитив, на который роль ссылается в
            этой теме. Пути в <code>tokens/semantic.ts</code> переводятся в имена переменных по
            правилу <code>color.bg.canvas</code> → <code>--prime-color-bg-canvas</code>.
          </>
        }
      >
        <RoleGroups />
      </FoundationSection>

      <FoundationSection
        title="Палитра меток"
        description={
          <>
            <code>color.palette.&lt;hue&gt;</code> раскрашивает Badge и Avatar. Мягкий вариант (soft
            + text) используется по умолчанию, сплошной (solid + solidFg) — для редких акцентов.
          </>
        }
      >
        <PaletteTable />
      </FoundationSection>

      <FoundationSection
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
      </FoundationSection>

      <FoundationSection
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
      </FoundationSection>
    </FoundationPage>
  );
}
