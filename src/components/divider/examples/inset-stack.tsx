import { Divider } from "prime-ui-kit";

import s from "./divider-examples.module.css";

/**
 * Stack with a leading icon column: copy is inset in the text column while dividers span the full card width,
 * matching common settings / list layouts.
 */
export default function DividerInsetStackExample() {
  return (
    <section className={s.card}>
      <div className={s.stack}>
        <div className={s.rowWithIcon}>
          <span className={s.iconStub} aria-hidden />
          <div className={s.rowMain}>
            <p className={s.rowTitle}>Workspace</p>
            <p className={s.rowDesc}>Renaming affects the sidebar and shared links.</p>
          </div>
        </div>

        <Divider.Root />

        <div className={s.rowWithIcon}>
          <span className={s.iconStub} aria-hidden />
          <div className={s.rowMain}>
            <p className={s.rowTitle}>Billing</p>
            <p className={s.insetBody}>Payment method and invoices (inset body copy).</p>
          </div>
        </div>
      </div>
    </section>
  );
}
