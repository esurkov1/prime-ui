import { Divider } from "prime-ui-kit";

import s from "./divider-examples.module.css";

/** Inside one card: horizontal rules separate header, body, and a summary footer without extra bordered panels. */
export default function DividerCardSplitsExample() {
  return (
    <section className={s.card}>
      <div className={s.stack}>
        <div>
          <h3 className={s.subheading}>Order summary</h3>
          <p className={s.muted}>Ships in 2–3 business days</p>
        </div>

        <Divider.Root />

        <p className={s.body}>
          Subtotal, shipping, and tax are estimated until checkout. You can edit the cart before
          paying.
        </p>

        <Divider.Root>Total</Divider.Root>
        <p className={s.body}>$128.00 USD</p>
      </div>
    </section>
  );
}
