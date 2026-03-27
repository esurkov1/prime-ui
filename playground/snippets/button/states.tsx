import { Button } from "@/components/button/Button";

export default function ButtonStatesSnippet() {
  return (
    <>
      <Button.Root variant="primary" mode="filled">
        Button default
      </Button.Root>
      <Button.Root variant="primary" mode="filled" loading>
        <Button.Spinner />
        Button loading
      </Button.Root>
      <Button.Root variant="primary" mode="filled" disabled>
        Button disabled
      </Button.Root>
    </>
  );
}
