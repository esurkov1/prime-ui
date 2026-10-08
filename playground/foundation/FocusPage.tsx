import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Input } from "@/components/input/Input";
import { LinkButton } from "@/components/link-button/LinkButton";
import { Switch } from "@/components/switch/Switch";
import { Typography } from "@/components/typography/Typography";
import { DocBlock, DocList, DocPage, DocTable } from "../components/Doc";
import { SurfaceGallery } from "../components/ExampleSurface";
import { Panel, TokenName } from "./FoundationKit";
import s from "./foundation.module.css";
import { composite, contrastRatio, sourceValue, toVarName, useComputedColors } from "./tokenModel";

const RING = toVarName("color.focus.ring");
const BACKGROUNDS = ["color.bg.canvas", "color.bg.surface", "color.bg.raised", "color.accent.soft"];

type TokenRow = { varName: string; value: React.ReactNode };

const TOKEN_COLUMNS: DataTableColumn<TokenRow>[] = [
  { id: "token", header: "Токен", cell: (row) => <TokenName>{row.varName}</TokenName> },
  { id: "value", header: "Значение", cell: (row) => row.value },
];

const TOKEN_ROWS: TokenRow[] = [
  { varName: "--prime-focus-width", value: sourceValue("focus.width", "light") },
  { varName: "--prime-focus-offset", value: sourceValue("focus.offset", "light") },
  { varName: "--prime-focus-offset-inset", value: sourceValue("focus.offsetInset", "light") },
  { varName: "--prime-focus-space", value: sourceValue("focus.space", "light") },
  {
    varName: RING,
    value: <span className={s.inlineSwatch} style={{ background: `var(${RING})` }} />,
  },
];

type RingRow = { bgPath: string; ratio: number | null };

const RING_COLUMNS: DataTableColumn<RingRow>[] = [
  {
    id: "bg",
    header: "Кольцо на фоне",
    cell: (row) => <TokenName>{toVarName(row.bgPath)}</TokenName>,
  },
  {
    id: "ratio",
    header: "Контраст",
    numeric: true,
    cell: (row) => (row.ratio === null ? "…" : `${row.ratio.toFixed(2)} : 1`),
  },
  {
    id: "verdict",
    header: "Норма 3 : 1",
    cell: (row) =>
      row.ratio !== null && row.ratio >= 3 ? (
        <Badge.Root color="green">Да</Badge.Root>
      ) : (
        <Badge.Root color="red">Нет</Badge.Root>
      ),
  },
];

function RingTokens() {
  const host = React.useRef<HTMLDivElement>(null);
  const names = React.useMemo(() => [RING, ...BACKGROUNDS.map((b) => toVarName(b))], []);
  const colors = useComputedColors(host, names);
  const ring = colors[RING];
  const surface = colors[toVarName("color.bg.surface")];
  const ringRows: RingRow[] = BACKGROUNDS.map((bgPath) => {
    const bgRaw = colors[toVarName(bgPath)];
    const bg = bgRaw && surface && bgRaw.a < 1 ? composite(bgRaw, surface) : bgRaw;
    return { bgPath, ratio: ring && bg ? contrastRatio(ring, bg) : null };
  });
  return (
    <div ref={host} className={s.stack}>
      <DocTable columns={TOKEN_COLUMNS} rows={TOKEN_ROWS} getRowKey={(row) => row.varName} />
      <DocTable columns={RING_COLUMNS} rows={ringRows} getRowKey={(row) => row.bgPath} />
    </div>
  );
}

function KeyboardDemo() {
  const [invalid, setInvalid] = React.useState(false);
  return (
    <Panel className={s.focusDemo}>
      <Typography as="p" variant="body-s" tone="muted">
        Нажмите Tab. Кольцо появляется только при навигации с клавиатуры (
        <code>:focus-visible</code>). При клике мышью его нет.
      </Typography>
      <div className={s.focusRow}>
        <Button.Root>Сохранить</Button.Root>
        <Button.Root variant="soft" tone="neutral">
          Отмена
        </Button.Root>
        <LinkButton href="#focus-demo">Ссылка</LinkButton>
      </div>
      <div className={s.focusRow}>
        <Input.Root invalid={invalid} className={s.focusField}>
          <Input.Wrapper>
            <Input.Field aria-label="Поле поиска" placeholder="Поле рисует кольцо на обёртке" />
          </Input.Wrapper>
        </Input.Root>
        <Switch.Root checked={invalid} onCheckedChange={setInvalid}>
          <Switch.Label>Ошибка</Switch.Label>
        </Switch.Root>
      </div>
    </Panel>
  );
}

/** The ring drawn permanently (an illustration, not a state of a component) to compare surfaces. */
function StaticRing() {
  return (
    <Typography as="span" variant="body-m" weight="medium" className={s.ringSample}>
      Фокус
    </Typography>
  );
}

export default function FocusPage() {
  return (
    <DocPage
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
      <DocBlock title="Токены и контраст">
        <RingTokens />
      </DocBlock>

      <DocBlock title="С клавиатуры">
        <KeyboardDemo />
      </DocBlock>

      <DocBlock
        title="На разных поверхностях"
        description="Кольцо показано постоянно, чтобы его можно было сравнить на разных фонах."
      >
        <SurfaceGallery>
          <StaticRing />
        </SurfaceGallery>
      </DocBlock>

      <DocBlock title="Правила">
        <DocList>
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
        </DocList>
      </DocBlock>
    </DocPage>
  );
}
