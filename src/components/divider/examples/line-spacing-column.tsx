import { Divider } from "prime-ui-kit";

import s from "./divider-examples.module.css";

/**
 * `variant="line-spacing"` between flex children: vertical rhythm comes from the parent `gap`, not from the
 * divider stretching as a spacer.
 */
export default function DividerLineSpacingColumnExample() {
  return (
    <div className={`${s.shell} ${s.stack}`}>
      <p className={s.body}>First block in a column with gap-driven spacing.</p>
      <Divider.Root variant="line-spacing" />
      <p className={s.body}>Second block — the divider is only a marker between siblings.</p>
      <Divider.Root variant="line-spacing" />
      <div className={s.toolbar}>
        <button className={s.toolbarBtn} type="button">
          One
        </button>
        <Divider.Root orientation="vertical" />
        <button className={s.toolbarBtn} type="button">
          Two
        </button>
      </div>
    </div>
  );
}
