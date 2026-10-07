/** A plan ring with the percentage in the center, named for screen readers — `value`, `aria-label`. */
import { ProgressCircle } from "prime-ui-kit";

export default function ProgressCircleOverviewExample() {
  return (
    <ProgressCircle value={84} aria-label="Выполнение плана">
      84%
    </ProgressCircle>
  );
}
