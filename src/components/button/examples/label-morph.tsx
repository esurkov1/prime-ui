/** A new label flows into the button letter by letter while the width glides: save, then saved; a step flow — `children`, `loading`. */
import { Button } from "prime-ui-kit";
import * as React from "react";

const STEPS = ["Продолжить", "Подтвердить оплату", "Оплачено"];

export default function ButtonLabelMorphExample() {
  const [save, setSave] = React.useState<"idle" | "saving" | "saved">("idle");
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (save === "idle") return;
    const timer = window.setTimeout(
      () => setSave(save === "saving" ? "saved" : "idle"),
      save === "saving" ? 1200 : 2000,
    );
    return () => window.clearTimeout(timer);
  }, [save]);

  return (
    <>
      <Button.Root
        variant="soft"
        tone="neutral"
        loading={save === "saving"}
        onClick={() => setSave("saving")}
      >
        {save === "saved" ? "Изменения сохранены" : "Сохранить изменения"}
      </Button.Root>
      <Button.Root onClick={() => setStep((step + 1) % STEPS.length)}>{STEPS[step]}</Button.Root>
    </>
  );
}
