import { Hint } from "prime-ui-kit";

/** Nominal `size` matches the field tier; hint typography is one step smaller (see styles). */
export default function HintSizesExample() {
  return (
    <>
      <Hint.Root size="s">Hint size s</Hint.Root>
      <Hint.Root size="m">Hint size m</Hint.Root>
      <Hint.Root size="l">Hint size l</Hint.Root>
      <Hint.Root size="xl">Hint size xl</Hint.Root>
    </>
  );
}
