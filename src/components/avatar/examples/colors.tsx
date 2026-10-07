/** `color` tints the fallback layer with one of ten palette hues. Derive the hue from a stable user id so a person always keeps one color. */
import { Avatar, type PaletteColor } from "prime-ui-kit";

import styles from "./examples.module.css";

const people: { initials: string; color: PaletteColor }[] = [
  { initials: "АК", color: "gray" },
  { initials: "БС", color: "blue" },
  { initials: "ВЛ", color: "sky" },
  { initials: "ГМ", color: "teal" },
  { initials: "ДН", color: "green" },
  { initials: "ЕО", color: "yellow" },
  { initials: "ЖП", color: "orange" },
  { initials: "ЗР", color: "red" },
  { initials: "ИС", color: "pink" },
  { initials: "КТ", color: "purple" },
];

export default function AvatarColorsExample() {
  return (
    <div className={styles.row}>
      {people.map(({ initials, color }) => (
        <Avatar.Root key={color} color={color} size="l">
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  );
}
