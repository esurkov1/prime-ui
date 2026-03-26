import * as React from "react";
import { Button } from "@/components/button/Button";
import { Hint } from "@/components/hint/Hint";

/** Родитель задаёт `variant` через состояние — например после проверки формы. */
export default function HintControlledVariantSnippet() {
  const [variant, setVariant] = React.useState<"default" | "error">("default");

  return (
    <div className="stack">
      <div className="previewRowWrap">
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
