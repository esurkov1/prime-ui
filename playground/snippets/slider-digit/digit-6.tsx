import * as React from "react";
import { DigitInput } from "@/components/digit-input/DigitInput";

export default function DigitSixSnippet() {
  const [pin6, setPin6] = React.useState("");

  return (
    <>
      <DigitInput.Root length={6} value={pin6} onChange={setPin6} />
      <p className="previewCaption previewCaptionTopBase">Value: {pin6 || "—"}</p>
    </>
  );
}
