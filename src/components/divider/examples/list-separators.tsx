import { Divider } from "prime-ui-kit";

import s from "./divider-examples.module.css";

/** Full-width horizontal dividers between rows inside a bordered list shell. */
export default function DividerListSeparatorsExample() {
  return (
    <ul className={s.list}>
      <li className={s.listRow}>Inbox</li>
      <li className={s.listSep} aria-hidden>
        <Divider.Root size="s" role="presentation" />
      </li>
      <li className={s.listRow}>Sent</li>
      <li className={s.listSep} aria-hidden>
        <Divider.Root size="s" role="presentation" />
      </li>
      <li className={s.listRow}>Archive</li>
    </ul>
  );
}
