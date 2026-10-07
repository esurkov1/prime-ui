import * as React from "react";

import { SurfaceGallery } from "../components/ExampleSurface";
import {
  FoundationPage,
  FoundationSection,
  Panel,
  RuleList,
  TokenName,
  TokenTable,
} from "./FoundationKit";
import s from "./foundation.module.css";
import { composite, contrastRatio, sourceValue, toVarName, useComputedColors } from "./tokenModel";

const RING = toVarName("color.focus.ring");
const BACKGROUNDS = ["color.bg.canvas", "color.bg.surface", "color.bg.raised", "color.accent.soft"];

function RingTokens() {
  const host = React.useRef<HTMLDivElement>(null);
  const names = React.useMemo(() => [RING, ...BACKGROUNDS.map((b) => toVarName(b))], []);
  const colors = useComputedColors(host, names);
  const ring = colors[RING];
  const surface = colors[toVarName("color.bg.surface")];
  return (
    <div ref={host} className={s.stack}>
      <TokenTable head={["Токен", "Значение"]}>
        <tr>
          <td>
            <TokenName>--prime-focus-width</TokenName>
          </td>
          <td className={s.numeric}>{sourceValue("focus.width", "light")}</td>
        </tr>
        <tr>
          <td>
            <TokenName>--prime-focus-offset</TokenName>
          </td>
          <td className={s.numeric}>{sourceValue("focus.offset", "light")}</td>
        </tr>
        <tr>
          <td>
            <TokenName>--prime-focus-offset-inset</TokenName>
          </td>
          <td className={s.numeric}>{sourceValue("focus.offsetInset", "light")}</td>
        </tr>
        <tr>
          <td>
            <TokenName>--prime-focus-space</TokenName>
          </td>
          <td className={s.numeric}>{sourceValue("focus.space", "light")}</td>
        </tr>
        <tr>
          <td>
            <TokenName>{RING}</TokenName>
          </td>
          <td>
            <span className={s.inlineSwatch} style={{ background: `var(${RING})` }} />
          </td>
        </tr>
      </TokenTable>
      <TokenTable head={["Кольцо на фоне", "Контраст", "Норма 3 : 1"]}>
        {BACKGROUNDS.map((bgPath) => {
          const bgRaw = colors[toVarName(bgPath)];
          const bg = bgRaw && surface && bgRaw.a < 1 ? composite(bgRaw, surface) : bgRaw;
          const ratio = ring && bg ? contrastRatio(ring, bg) : null;
          return (
            <tr key={bgPath}>
              <td>
                <TokenName>{toVarName(bgPath)}</TokenName>
              </td>
              <td className={s.numeric}>{ratio === null ? "…" : `${ratio.toFixed(2)} : 1`}</td>
              <td>
                <span
                  className={s.verdict}
                  data-tone={ratio !== null && ratio >= 3 ? "pass" : "fail"}
                >
                  {ratio !== null && ratio >= 3 ? "Да" : "Нет"}
                </span>
              </td>
            </tr>
          );
        })}
      </TokenTable>
    </div>
  );
}

function KeyboardDemo() {
  const [invalid, setInvalid] = React.useState(false);
  return (
    <Panel className={s.focusDemo}>
      <p className={s.groupNote}>
        Нажмите Tab. Кольцо появляется только при навигации с клавиатуры (
        <code>:focus-visible</code>). При клике мышью его нет.
      </p>
      <div className={s.focusRow}>
        <button type="button" className={s.demoButton} data-tone="accent">
          Сохранить
        </button>
        <button type="button" className={s.demoButton} data-tone="neutral">
          Отмена
        </button>
        <a className={s.demoLink} href="#focus-demo">
          Ссылка
        </a>
      </div>
      <div className={s.focusRow}>
        <label className={s.focusField} data-invalid={invalid || undefined}>
          <span className={s.srOnly}>Поле поиска</span>
          <input
            className={s.focusInput}
            placeholder="Поле рисует кольцо на обёртке"
            aria-invalid={invalid || undefined}
          />
        </label>
        <label className={s.inlineToggle}>
          <input type="checkbox" checked={invalid} onChange={(e) => setInvalid(e.target.checked)} />
          Ошибка
        </label>
      </div>
    </Panel>
  );
}

function StaticRing() {
  return <span className={s.ringSample}>Фокус</span>;
}

export default function FocusPage() {
  return (
    <FoundationPage
      title="Фокус"
      description={
        <>
          Во всём ките одно кольцо фокуса: <code>outline</code> толщиной 2 px, цвет{" "}
          <code>{RING}</code>. Кнопки, ссылки и вкладки рисуют его снаружи с отступом 2 px, поля —
          внутри своего края, поэтому кольцо никогда не обрезается. Компоненты не придумывают свой
          вариант.
        </>
      }
    >
      <FoundationSection title="Токены и контраст">
        <RingTokens />
      </FoundationSection>

      <FoundationSection title="С клавиатуры">
        <KeyboardDemo />
      </FoundationSection>

      <FoundationSection
        title="На разных поверхностях"
        description="Кольцо показано постоянно, чтобы его можно было сравнить на разных фонах."
      >
        <SurfaceGallery>
          <StaticRing />
        </SurfaceGallery>
      </FoundationSection>

      <FoundationSection title="Правила">
        <RuleList>
          <li>
            Нужен <code>:focus-visible</code>, а не <code>:focus</code>. Мышь не должна оставлять
            кольцо.
          </li>
          <li>
            Поле рисует кольцо на обёртке через <code>:focus-within</code> или{" "}
            <code>:has(:focus-visible)</code>. У самого <code>input</code> outline отключён.
          </li>
          <li>
            У поля с ошибкой кольцо цвета <code>--prime-color-danger-border</code>.
          </li>
          <li>Нельзя убирать outline и ничего не давать взамен.</li>
        </RuleList>
      </FoundationSection>
    </FoundationPage>
  );
}
