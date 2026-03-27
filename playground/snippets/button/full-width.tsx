import { Button } from "@/components/button/Button";

export default function ButtonFullWidthSnippet() {
  return (
    <>
      <Button.Root variant="primary" mode="filled" fullWidth>
        Button full width primary
      </Button.Root>
      <Button.Root variant="neutral" mode="stroke" fullWidth>
        Button full width neutral stroke
      </Button.Root>
    </>
  );
}
