/** Every palette hue of the fallback; derive it from a stable user id — `color`. */
import { Avatar, Typography } from "prime-ui-kit";

const ROWS = [
  [
    { initials: "АК", color: "gray" },
    { initials: "БС", color: "blue" },
    { initials: "ВЛ", color: "sky" },
    { initials: "ГМ", color: "teal" },
    { initials: "ДН", color: "green" },
  ],
  [
    { initials: "ЕО", color: "yellow" },
    { initials: "ЖП", color: "orange" },
    { initials: "ЗР", color: "red" },
    { initials: "ИС", color: "pink" },
    { initials: "КТ", color: "purple" },
  ],
] as const;

export default function AvatarVariantsExample() {
  return (
    <>
      {ROWS.map((row) => (
        <div key={row[0].color}>
          {row.map(({ initials, color }) => (
            <div key={color}>
              <Avatar.Root color={color}>
                <Avatar.Fallback>{initials}</Avatar.Fallback>
              </Avatar.Root>
              <Typography as="span" variant="caption" tone="muted">
                {color}
              </Typography>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
