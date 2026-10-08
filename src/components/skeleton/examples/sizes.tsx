/** Every tier of a text line, a control and an avatar circle: the placeholder matches the content of that tier — `size`, `shape`. */
import { Skeleton, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;
const SHAPES = ["text", "control", "circle"] as const;

export default function SkeletonSizesExample() {
  return (
    <>
      {SHAPES.map((shape) => (
        <div key={shape}>
          {SIZES.map((size) => (
            <div key={size}>
              <Skeleton shape={shape} size={size} />
              <Typography as="span" variant="caption" tone="muted">
                {`${shape} · ${size}`}
              </Typography>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
