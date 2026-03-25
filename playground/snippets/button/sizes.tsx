import { Button } from "@/components/button/Button";

/** Четыре размера на primary / filled — по одному на строку. */
export default function ButtonSizesSnippet() {
  return (
    <>
      <Button.Root variant="primary" mode="filled" size="s">
        Button s
      </Button.Root>
      <Button.Root variant="primary" mode="filled" size="m">
        Button m
      </Button.Root>
      <Button.Root variant="primary" mode="filled" size="l">
        Button l
      </Button.Root>
      <Button.Root variant="primary" mode="filled" size="xl">
        Button xl
      </Button.Root>
    </>
  );
}
