/** Loading is a Skeleton ring of the same diameter and stroke; the number in the centre waits for the data — `loading`. */
import { ProgressCircle, Typography } from "prime-ui-kit";

export default function ProgressCircleStatesExample() {
  return (
    <div>
      <div>
        <ProgressCircle value={72} size="l" aria-label="План продаж">
          72%
        </ProgressCircle>
        <Typography as="span" variant="caption" tone="muted">
          value
        </Typography>
      </div>
      <div>
        <ProgressCircle value={0} size="l" aria-label="План продаж" loading>
          0%
        </ProgressCircle>
        <Typography as="span" variant="caption" tone="muted">
          loading
        </Typography>
      </div>
    </div>
  );
}
