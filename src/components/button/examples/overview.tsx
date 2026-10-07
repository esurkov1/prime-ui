/** The primary action with a secondary one next to it — `variant`, `tone`. */
import { Button } from "prime-ui-kit";

export default function ButtonOverviewExample() {
  return (
    <>
      <Button.Root variant="soft" tone="neutral">
        Отмена
      </Button.Root>
      <Button.Root>Сохранить</Button.Root>
    </>
  );
}
