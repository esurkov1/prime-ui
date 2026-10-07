/** `loading` driven by parent state while a request runs. Use for async actions: the spinner appears by itself and clicks are blocked. */
import { Button } from "prime-ui-kit";
import { useState } from "react";

export default function ButtonControlledExample() {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1600);
  }

  return (
    <Button.Root loading={loading} onClick={handleClick}>
      Отправить отчёт
    </Button.Root>
  );
}
