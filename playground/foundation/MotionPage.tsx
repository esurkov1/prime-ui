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
import { resolvePrimitive, semanticKeys, sourceValue, toVarName } from "./tokenModel";

const DURATIONS = semanticKeys("motion.duration").map((key) => ({
  key,
  varName: toVarName(`motion.duration.${key}`),
  value: resolvePrimitive(sourceValue(`motion.duration.${key}`, "light") ?? ""),
}));

const EASINGS = semanticKeys("motion.easing").map((key) => ({
  key,
  varName: toVarName(`motion.easing.${key}`),
  value: resolvePrimitive(sourceValue(`motion.easing.${key}`, "light") ?? ""),
}));

const DURATION_USE: Record<string, string> = {
  fast: "Наведение, нажатие, смена цвета",
  base: "Открытие меню и popover, переключатели",
  slow: "Модалка, drawer, крупные перемещения",
};

const EASING_USE: Record<string, string> = {
  standard: "Изменение на месте: цвет, размер, позиция",
  enter: "Появление: быстрый старт, мягкая остановка",
  exit: "Исчезновение: плавный старт, быстрый уход",
};

function parseBezier(value: string): [number, number, number, number] | null {
  const m = /cubic-bezier\(([^)]+)\)/.exec(value);
  if (!m) return null;
  const nums = m[1].split(",").map((n) => Number.parseFloat(n));
  return nums.length === 4 && nums.every(Number.isFinite)
    ? (nums as [number, number, number, number])
    : null;
}

/** The easing curve on a unit square, drawn from the token value. */
function BezierCurve({ name, value }: { name: string; value: string }) {
  const p = parseBezier(value);
  if (!p) return null;
  const [x1, y1, x2, y2] = p;
  const map = (x: number, y: number) => `${4 + x * 56} ${60 - y * 56}`;
  return (
    <svg className={s.bezier} viewBox="0 0 64 64" role="img">
      <title>{`Кривая ${name}: ${value}`}</title>
      <path className={s.bezierGrid} d="M4 60H60M4 60V4" />
      <path
        className={s.bezierHandle}
        d={`M${map(0, 0)}L${map(x1, y1)}M${map(1, 1)}L${map(x2, y2)}`}
      />
      <path
        className={s.bezierPath}
        d={`M${map(0, 0)}C${map(x1, y1)} ${map(x2, y2)} ${map(1, 1)}`}
      />
    </svg>
  );
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useLiveVar(varName: string): string {
  const [value, setValue] = React.useState("");
  const reduced = useReducedMotion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: `reduced` changes the computed value
  React.useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(varName).trim());
  }, [varName, reduced]);
  return value;
}

function LiveDuration({ varName }: { varName: string }) {
  return <>{useLiveVar(varName) || "…"}</>;
}

function TokensTable() {
  return (
    <TokenTable head={["Токен", "Значение", "Сейчас", "Для чего"]}>
      {DURATIONS.map((d) => (
        <tr key={d.key}>
          <td>
            <TokenName>{d.varName}</TokenName>
          </td>
          <td className={s.numeric}>{d.value}</td>
          <td className={s.numeric}>
            <LiveDuration varName={d.varName} />
          </td>
          <td>{DURATION_USE[d.key] ?? ""}</td>
        </tr>
      ))}
    </TokenTable>
  );
}

function EasingCards() {
  return (
    <div className={s.easingGrid}>
      {EASINGS.map((e) => (
        <Panel key={e.key} className={s.easingCard}>
          <BezierCurve name={e.key} value={e.value} />
          <span className={s.radiusName}>{e.key}</span>
          <TokenName>{e.varName}</TokenName>
          <span className={s.groupNote}>{EASING_USE[e.key] ?? ""}</span>
        </Panel>
      ))}
    </div>
  );
}

function MotionPlayground() {
  const [playing, setPlaying] = React.useState(false);
  return (
    <Panel className={s.motionPanel}>
      <div className={s.motionHead}>
        <span className={s.groupNote}>
          Наведите на дорожку или запустите все сразу. Шарик движется с указанной длительностью и
          кривой.
        </span>
        <button
          type="button"
          className={s.plainButton}
          aria-pressed={playing}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "Вернуть" : "Запустить все"}
        </button>
      </div>
      <div className={s.motionGrid}>
        {DURATIONS.flatMap((d) =>
          EASINGS.map((e) => (
            <div key={`${d.key}-${e.key}`} className={s.motionCell}>
              <span className={s.motionLabel}>
                {d.key} · {e.key}
              </span>
              <span
                className={s.motionTrack}
                data-playing={playing || undefined}
                style={
                  {
                    "--demo-duration": `var(${d.varName})`,
                    "--demo-easing": `var(${e.varName})`,
                  } as React.CSSProperties
                }
              >
                <span className={s.motionDot} />
              </span>
            </div>
          )),
        )}
      </div>
    </Panel>
  );
}

export default function MotionPage() {
  const reduced = useReducedMotion();
  return (
    <FoundationPage
      title="Движение"
      description="Анимация объясняет, что изменилось и откуда появился элемент. Есть три длительности и три кривые, других значений нет."
    >
      <FoundationSection title="Длительности">
        <TokensTable />
      </FoundationSection>

      <FoundationSection title="Кривые">
        <EasingCards />
      </FoundationSection>

      <FoundationSection title="Попробовать">
        <MotionPlayground />
      </FoundationSection>

      <FoundationSection
        title="Если анимации отключены"
        description={
          <>
            Сейчас в системе{" "}
            <strong>{reduced ? "включено «уменьшить движение»" : "анимации разрешены"}</strong>. При{" "}
            <code>prefers-reduced-motion: reduce</code> файл <code>globals.css</code> обнуляет все{" "}
            <code>--prime-motion-duration-*</code>, и CSS-переходы срабатывают мгновенно.
          </>
        }
      >
        <RuleList>
          <li>
            JS-анимации (скролл, измерения, requestAnimationFrame) должны сами проверять{" "}
            <code>matchMedia("(prefers-reduced-motion: reduce)")</code>.
          </li>
          <li>
            Анимируйте transform и opacity. Изменения width, height и top заставляют страницу
            пересчитывать раскладку.
          </li>
          <li>
            Ничего не должно двигаться дольше <code>slow</code>. Пользователь не должен ждать
            анимацию.
          </li>
        </RuleList>
      </FoundationSection>
    </FoundationPage>
  );
}
