import { Hint, Icon } from "prime-ui-kit";

/** Decorative leading icon; meaning must be repeated in text (`Hint.Icon` is `aria-hidden`). */
export default function HintWithIconExample() {
  return (
    <Hint.Root variant="default">
      <Hint.Icon>
        <Icon surface="none" name="field.email" tone="subtle" />
      </Hint.Icon>
      We will send a confirmation code to this address.
    </Hint.Root>
  );
}
