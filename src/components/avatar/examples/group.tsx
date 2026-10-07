/** Overlapping group in sizes `s` and `l`: the group `size` goes to children without their own size, the last cell is "+N". Use for participants of a project or a chat. */
import { Avatar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AvatarGroupExample() {
  return (
    <div className={styles.row}>
      <Avatar.Group.Root size="s" aria-label="Участники: 6">
        <Avatar.Root color="blue">
          <Avatar.Fallback>АК</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root color="green">
          <Avatar.Fallback>ДН</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root color="orange">
          <Avatar.Fallback>ЖП</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Group.Overflow aria-label="Ещё 3 участника">+3</Avatar.Group.Overflow>
      </Avatar.Group.Root>
      <Avatar.Group.Root size="l" aria-label="Участники: 6">
        <Avatar.Root color="blue">
          <Avatar.Fallback>АК</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root color="green">
          <Avatar.Fallback>ДН</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root color="orange">
          <Avatar.Fallback>ЖП</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Group.Overflow aria-label="Ещё 3 участника">+3</Avatar.Group.Overflow>
      </Avatar.Group.Root>
    </div>
  );
}
