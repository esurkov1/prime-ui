import { Button } from "@/components/button/Button";

export default function ButtonStatesSnippet() {
  return (
    <>
      <Button.Root variant="primary" mode="filled" size="m">
        Button default
      </Button.Root>
      <Button.Root variant="primary" mode="filled" size="m" loading>
        <Button.Spinner />
        Button loading
      </Button.Root>
      <Button.Root variant="primary" mode="filled" size="m" disabled>
        Button disabled
      </Button.Root>
    </>
  );
}
