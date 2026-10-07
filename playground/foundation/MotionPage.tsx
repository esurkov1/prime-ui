import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Typography } from "@/components/typography/Typography";
import { Icon } from "@/icons";

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

type MotionToken = { key: string; varName: string; value: string; use: string };

const TOKEN_ROWS: MotionToken[] = [
  ...DURATIONS.map((d) => ({ ...d, use: DURATION_USE[d.key] ?? "" })),
  ...EXTRAS.map((t) => ({ ...t, use: EXTRA_USE[t.key] ?? "" })),
];

const TOKEN_COLUMNS: DataTableColumn<MotionToken>[] = [
  { id: "token", header: "Токен", cell: (t) => <TokenName>{t.varName}</TokenName> },
  { id: "value", header: "Значение", accessor: "value", numeric: true },
  {
    id: "live",
    header: "Сейчас",
    numeric: true,
    cell: (t) => <LiveValue varName={t.varName} />,
  },
  { id: "use", header: "Для чего", accessor: "use" },
];

function TokensTable() {
  return <TokenTable columns={TOKEN_COLUMNS} rows={TOKEN_ROWS} getRowKey={(t) => t.key} />;
}

/** Muted lead text of a demo panel. */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <Typography as="span" variant="body-s" tone="muted">
      {children}
    </Typography>
  );
}

function EasingCards() {
  return (
    <div className={s.easingGrid}>
      {EASINGS.map((e) => (
        <Panel key={e.key} className={s.easingCard}>
          <EasingCurve name={e.key} value={e.value} />
          <Typography as="span" variant="title-s">
            {e.key}
          </Typography>
          <TokenName>{e.varName}</TokenName>
          <Note>{EASING_USE[e.key] ?? ""}</Note>
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
      <Typography as="span" variant="caption" tone="secondary">
        {label}
      </Typography>
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
        <Note>
          Наведите на дорожку или запустите все сразу. Шарик движется с указанной длительностью и
          кривой.
        </Note>
        <Button.Root
          size="s"
          variant="soft"
          tone="neutral"
          aria-pressed={playing}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "Вернуть" : "Запустить все"}
        </Button.Root>
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
        <Note>
          Одна длительность, разные кривые. Emphasized резко трогается и долго, мягко дотягивает до
          цели, никогда не проскакивая её, — так доезжают бегунок, индикатор вкладки, галочка.
        </Note>
        <Button.Root
          size="s"
          variant="soft"
          tone="neutral"
          aria-pressed={on}
          onClick={() => setOn((v) => !v)}
        >
          {on ? "Вернуть" : "Переключить"}
        </Button.Root>
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
        <Note>
          Короткая группа появляется по очереди: opacity и сдвиг вверх, задержка —{" "}
          <code>calc(var(--prime-motion-stagger) * n)</code>. Элементы доступны с первого кадра.
        </Note>
        <Button.Root size="s" variant="soft" tone="neutral" onClick={() => setRun((n) => n + 1)}>
          Показать снова
        </Button.Root>
      </div>
      <div key={run} className={s.staggerList}>
        {STAGGER_ITEMS.map((item, i) => (
          <Badge.Root
            key={item}
            size="l"
            className={s.staggerItem}
            style={{ "--demo-index": i } as React.CSSProperties}
          >
            {item}
          </Badge.Root>
        ))}
      </div>
    </Panel>
  );
}

function PressDemo() {
  return (
    <Panel className={s.motionPanel}>
      <Note>
        Зажмите кнопку: она сжимается за <code>fast</code> и отпускается тем же переходом. Disabled
        и loading не сжимаются.
      </Note>
      <div className={s.pressRow}>
        <Button.Root>press-scale · 0.98</Button.Root>
        <Button.Root variant="soft" tone="neutral" aria-label="press-scale-compact · 0.96">
          <Button.Icon>
            <Icon name="action.copy" />
          </Button.Icon>
        </Button.Root>
        <Note>press-scale-compact · 0.96</Note>
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
            <Typography as="span" variant="body-m" weight="semibold">
              {reduced ? "включено «уменьшить движение»" : "анимации разрешены"}
            </Typography>
            . При <code>prefers-reduced-motion: reduce</code> файл <code>globals.css</code> обнуляет
            все <code>--prime-motion-duration-*</code> и <code>--prime-motion-stagger</code>, а{" "}
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
