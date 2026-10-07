import * as React from "react";

import { IconCopy } from "@/icons";

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

/** Single-value motion tokens: the stagger step and the press scales. */
const EXTRAS = ["motion.stagger", "motion.press.scale", "motion.press.scaleCompact"].map(
  (path) => ({
    key: path,
    varName: toVarName(path),
    value: resolvePrimitive(sourceValue(path, "light") ?? ""),
  }),
);

const DURATION_USE: Record<string, string> = {
  xfast: "Заливка при наведении на плотные строки, ячейки, опции",
  fast: "Нажатие, наведение, небольшие панели, исчезновение",
  base: "Диалоги, переключатели, смена содержимого на месте",
  slow: "Drawer, sheet",
};

const EXTRA_USE: Record<string, string> = {
  "motion.stagger": "Шаг между элементами при первом появлении группы (до 6 штук)",
  "motion.press.scale": "Масштаб при нажатии (:active) кнопок и других нажимаемых элементов",
  "motion.press.scaleCompact": "То же для кнопок-иконок и маленьких целей",
};

const EASING_USE: Record<string, string> = {
  standard: "Движение и морфинг на экране, смена цвета и заливки",
  enter: "Появление и отклик: быстрый старт, мягкая остановка",
  exit: "Исчезновение: сильный ease-out, короче появления",
  emphasized:
    "Состояние доезжает на место (бегунок, индикатор, галочка): резкий старт, долгое мягкое торможение, без перелёта; вместе с base",
};

function parseBezier(value: string): [number, number, number, number] | null {
  const m = /cubic-bezier\(([^)]+)\)/.exec(value);
  if (!m) return null;
  const nums = m[1].split(",").map((n) => Number.parseFloat(n));
  return nums.length === 4 && nums.every(Number.isFinite)
    ? (nums as [number, number, number, number])
    : null;
}

const mapPoint = (x: number, y: number) => `${4 + x * 56} ${60 - y * 56}`;

/** The easing curve on a unit square, drawn from the token's `cubic-bezier`. */
function EasingCurve({ name, value }: { name: string; value: string }) {
  const bezier = parseBezier(value);
  if (!bezier) return null;
  return (
    <svg className={s.bezier} viewBox="0 0 64 64" role="img">
      <title>{`Кривая ${name}: ${value}`}</title>
      <path className={s.bezierGrid} d="M4 60H60M4 60V4" />
      <path
        className={s.bezierHandle}
        d={`M${mapPoint(0, 0)}L${mapPoint(bezier[0], bezier[1])}M${mapPoint(1, 1)}L${mapPoint(bezier[2], bezier[3])}`}
      />
      <path
        className={s.bezierPath}
        d={`M${mapPoint(0, 0)}C${mapPoint(bezier[0], bezier[1])} ${mapPoint(bezier[2], bezier[3])} ${mapPoint(1, 1)}`}
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

function LiveValue({ varName }: { varName: string }) {
  return <>{useLiveVar(varName) || "…"}</>;
}

function TokenRow({ varName, value, use }: { varName: string; value: string; use: string }) {
  return (
    <tr>
      <td>
        <TokenName>{varName}</TokenName>
      </td>
      <td className={s.numeric}>{value}</td>
      <td className={s.numeric}>
        <LiveValue varName={varName} />
      </td>
      <td>{use}</td>
    </tr>
  );
}

function TokensTable() {
  return (
    <TokenTable head={["Токен", "Значение", "Сейчас", "Для чего"]}>
      {DURATIONS.map((d) => (
        <TokenRow key={d.key} varName={d.varName} value={d.value} use={DURATION_USE[d.key] ?? ""} />
      ))}
      {EXTRAS.map((t) => (
        <TokenRow key={t.key} varName={t.varName} value={t.value} use={EXTRA_USE[t.key] ?? ""} />
      ))}
    </TokenTable>
  );
}

function EasingCards() {
  return (
    <div className={s.easingGrid}>
      {EASINGS.map((e) => (
        <Panel key={e.key} className={s.easingCard}>
          <EasingCurve name={e.key} value={e.value} />
          <span className={s.radiusName}>{e.key}</span>
          <TokenName>{e.varName}</TokenName>
          <span className={s.groupNote}>{EASING_USE[e.key] ?? ""}</span>
        </Panel>
      ))}
    </div>
  );
}

function MotionTrack({
  label,
  duration,
  easing,
  playing,
}: {
  label: string;
  duration: string;
  easing: string;
  playing: boolean;
}) {
  return (
    <div className={s.motionCell}>
      <span className={s.motionLabel}>{label}</span>
      <span
        className={s.motionTrack}
        data-playing={playing || undefined}
        style={
          {
            "--demo-duration": `var(${duration})`,
            "--demo-easing": `var(${easing})`,
          } as React.CSSProperties
        }
      >
        <span className={s.motionDot} />
      </span>
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
            <MotionTrack
              key={`${d.key}-${e.key}`}
              label={`${d.key} · ${e.key}`}
              duration={d.varName}
              easing={e.varName}
              playing={playing}
            />
          )),
        )}
      </div>
    </Panel>
  );
}

function EmphasizedDemo() {
  const [on, setOn] = React.useState(false);
  return (
    <Panel className={s.motionPanel}>
      <div className={s.motionHead}>
        <span className={s.groupNote}>
          Одна длительность, разные кривые. Emphasized резко трогается и долго, мягко дотягивает до
          цели, никогда не проскакивая её, — так доезжают бегунок, индикатор вкладки, галочка.
        </span>
        <button
          type="button"
          className={s.plainButton}
          aria-pressed={on}
          onClick={() => setOn((v) => !v)}
        >
          {on ? "Вернуть" : "Переключить"}
        </button>
      </div>
      <div className={s.compareGrid}>
        <MotionTrack
          label="base · standard"
          duration="--prime-motion-duration-base"
          easing="--prime-motion-easing-standard"
          playing={on}
        />
        <MotionTrack
          label="base · emphasized"
          duration="--prime-motion-duration-base"
          easing="--prime-motion-easing-emphasized"
          playing={on}
        />
      </div>
    </Panel>
  );
}

const STAGGER_ITEMS = ["Иконка", "Заголовок", "Описание", "Действия"];

function StaggerDemo() {
  const [run, setRun] = React.useState(0);
  return (
    <Panel className={s.motionPanel}>
      <div className={s.motionHead}>
        <span className={s.groupNote}>
          Короткая группа появляется по очереди: opacity и сдвиг вверх, задержка —{" "}
          <code>calc(var(--prime-motion-stagger) * n)</code>. Элементы доступны с первого кадра.
        </span>
        <button type="button" className={s.plainButton} onClick={() => setRun((n) => n + 1)}>
          Показать снова
        </button>
      </div>
      <div key={run} className={s.staggerList}>
        {STAGGER_ITEMS.map((item, i) => (
          <span
            key={item}
            className={s.staggerItem}
            style={{ "--demo-index": i } as React.CSSProperties}
          >
            {item}
          </span>
        ))}
      </div>
    </Panel>
  );
}

function PressDemo() {
  return (
    <Panel className={s.motionPanel}>
      <span className={s.groupNote}>
        Зажмите кнопку: она сжимается за <code>fast</code> и отпускается тем же переходом. Disabled
        и loading не сжимаются.
      </span>
      <div className={s.pressRow}>
        <button
          type="button"
          className={s.pressDemo}
          style={{ "--demo-press": "var(--prime-motion-press-scale)" } as React.CSSProperties}
        >
          press-scale · 0.98
        </button>
        <button
          type="button"
          className={s.pressDemo}
          data-compact
          aria-label="press-scale-compact · 0.96"
          style={
            { "--demo-press": "var(--prime-motion-press-scale-compact)" } as React.CSSProperties
          }
        >
          <IconCopy size="s" />
        </button>
        <span className={s.groupNote}>press-scale-compact · 0.96</span>
      </div>
    </Panel>
  );
}

export default function MotionPage() {
  const reduced = useReducedMotion();
  return (
    <FoundationPage
      title="Движение"
      description="Анимация объясняет, что изменилось и откуда появился элемент. Четыре длительности, четыре кривые, шаг стаггера и масштаб нажатия — других значений нет."
    >
      <FoundationSection title="Токены">
        <TokensTable />
      </FoundationSection>

      <FoundationSection title="Кривые">
        <EasingCards />
      </FoundationSection>

      <FoundationSection title="Попробовать">
        <MotionPlayground />
      </FoundationSection>

      <FoundationSection
        title="Emphasized и standard"
        description="Emphasized — для состояния, которое доезжает на место, вместе с base. Ничто в ките не проскакивает цель. Появление и исчезновение остаются на enter и exit."
      >
        <EmphasizedDemo />
      </FoundationSection>

      <FoundationSection
        title="Стаггер"
        description="Только для первого появления короткой группы (до 6 элементов) и редких состояний вроде пустого экрана."
      >
        <StaggerDemo />
      </FoundationSection>

      <FoundationSection title="Нажатие">
        <PressDemo />
      </FoundationSection>

      <FoundationSection
        title="Если анимации отключены"
        description={
          <>
            Сейчас в системе{" "}
            <strong>{reduced ? "включено «уменьшить движение»" : "анимации разрешены"}</strong>. При{" "}
            <code>prefers-reduced-motion: reduce</code> файл <code>globals.css</code> обнуляет все{" "}
            <code>--prime-motion-duration-*</code> и <code>--prime-motion-stagger</code>, а{" "}
            <code>--prime-motion-press-scale*</code> становится 1 — CSS-переходы срабатывают
            мгновенно, кнопки не сжимаются.
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
