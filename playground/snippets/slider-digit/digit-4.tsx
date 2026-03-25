import * as React from "react";
import { DigitInput } from "@/components/digit-input/DigitInput";

export default function DigitFourSnippet() {
  const [pin4, setPin4] = React.useState("");

  return (
    <>
      <DigitInput.Root length={4} value={pin4} onChange={setPin4} />
      <p className="previewCaption previewCaptionTopBase">Value: {pin4 || "—"}</p>
    </>
  );
}
