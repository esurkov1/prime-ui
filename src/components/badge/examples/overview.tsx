/** Publication statuses: soft badges where the text carries the meaning and the hue repeats it — `color`. */
import { Badge } from "prime-ui-kit";

export default function BadgeOverviewExample() {
  return (
    <>
      <Badge.Root>Черновик</Badge.Root>
      <Badge.Root color="blue">На ревью</Badge.Root>
      <Badge.Root color="green">Опубликован</Badge.Root>
      <Badge.Root color="red">Ошибка</Badge.Root>
    </>
  );
}
