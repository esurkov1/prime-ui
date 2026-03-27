import { useState } from "react";
import { Button } from "@/components/button/Button";

/** Состояние загрузки хранится в родителе: имитация запроса после клика. */
export default function ButtonControlledSnippet() {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1600);
  }

  return (
    <Button.Root variant="primary" mode="filled" loading={loading} onClick={handleClick}>
      <Button.Spinner />
      {loading ? "Сохранение…" : "Сохранить"}
    </Button.Root>
  );
}
