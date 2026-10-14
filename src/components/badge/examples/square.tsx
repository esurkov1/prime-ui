/** File formats as square tiles of text, large enough for three letters; the hue sorts them by kind — `shape`, `size`, `color`. */
import { Badge } from "prime-ui-kit";

const FORMATS = [
  { format: "PDF", color: "red" },
  { format: "XLS", color: "green" },
  { format: "DOC", color: "blue" },
  { format: "ZIP", color: "gray" },
] as const;

export default function BadgeSquareExample() {
  return (
    <>
      {FORMATS.map((item) => (
        <Badge.Root key={item.format} shape="square" size="xl" color={item.color}>
          {item.format}
        </Badge.Root>
      ))}
    </>
  );
}
