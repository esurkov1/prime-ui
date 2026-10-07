/** The button look on a real link; a disabled link blocks navigation — `asChild`, `disabled`. */
import { Button } from "prime-ui-kit";

export default function ButtonAsChildExample() {
  return (
    <>
      <Button.Root asChild>
        <a href="#invoices">Открыть счета</a>
      </Button.Root>
      <Button.Root variant="outline" tone="neutral" asChild disabled>
        <a href="#export">Экспорт недоступен</a>
      </Button.Root>
    </>
  );
}
