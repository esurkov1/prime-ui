import { Divider } from "prime-ui-kit";

import s from "./divider-examples.module.css";

/** Section rhythm: `variant="text"` labels blocks; pair with real headings where structure matters for a11y. */
export default function DividerSectionBreaksExample() {
  return (
    <article className={s.card}>
      <div className={s.stackLoose}>
        <header>
          <h2 className={s.heading}>Account</h2>
          <p className={s.muted}>Profile and security</p>
        </header>

        <Divider.Root variant="text">General</Divider.Root>
        <p className={s.body}>Name, email, and language preferences apply across all workspaces.</p>

        <Divider.Root variant="text">Notifications</Divider.Root>
        <p className={s.body}>Choose channels for product updates and billing alerts.</p>
      </div>
    </article>
  );
}
