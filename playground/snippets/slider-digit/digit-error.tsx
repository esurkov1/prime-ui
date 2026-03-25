import { DigitInput } from "@/components/digit-input/DigitInput";

export default function DigitErrorSnippet() {
  return <DigitInput.Root length={4} defaultValue="12" hasError />;
}
