/** Invoice statuses: soft badges where the text carries the meaning and the tone repeats it — `tone`. */
import { Badge } from "prime-ui-kit";

export default function BadgeOverviewExample() {
  return (
    <>
      <Badge.Root tone="neutral">Черновик</Badge.Root>
      <Badge.Root tone="info">Выставлен</Badge.Root>
      <Badge.Root tone="success">Оплачен</Badge.Root>
      <Badge.Root tone="warning">Ждёт оплаты</Badge.Root>
      <Badge.Root tone="danger">Просрочен</Badge.Root>
    </>
  );
}
