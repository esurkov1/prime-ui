import { Button } from "@/components/button/Button";

export default function ButtonFullWidthSnippet() {
  return (
    <>
      <Button.Root variant="primary" mode="filled" size="m" fullWidth>
        Button full width primary
      </Button.Root>
      <Button.Root variant="neutral" mode="stroke" size="m" fullWidth>
        Button full width neutral stroke
      </Button.Root>
    </>
  );
}
