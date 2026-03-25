import * as React from "react";
import { Button } from "@/components/button/Button";
import { Hint } from "@/components/hint/Hint";

/** Родитель задаёт `variant` через состояние — например после проверки формы. */
export default function HintControlledVariantSnippet() {
  const [variant, setVariant] = React.useState<"default" | "error">("default");

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-start" }}
    >
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Button.Root size="s" variant="neutral" mode="stroke" onClick={() => setVariant("default")}>
          Сбросить
        </Button.Root>
        <Button.Root size="s" variant="error" mode="lighter" onClick={() => setVariant("error")}>
          Показать ошибку
        </Button.Root>
      </div>
      <Hint.Root size="m" variant={variant}>
        {variant === "error"
          ? "Заполните поле перед сохранением черновика."
          : "Черновик можно сохранить без обязательных полей."}
      </Hint.Root>
    </div>
  );
}
