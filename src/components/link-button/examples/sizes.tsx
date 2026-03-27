import { LinkButton } from "prime-ui-kit";

/** `size` ladder `s`–`xl` — mirrors [`playground/snippets/link-button/sizes.tsx`](../../../../playground/snippets/link-button/sizes.tsx). */
export default function LinkButtonSizesExample() {
  return (
    <>
      <LinkButton.Root href="#" size="s">
        LinkButton s
      </LinkButton.Root>
      <LinkButton.Root href="#" size="m">
        LinkButton m
      </LinkButton.Root>
      <LinkButton.Root href="#" size="l">
        LinkButton l
      </LinkButton.Root>
      <LinkButton.Root href="#" size="xl">
        LinkButton xl
      </LinkButton.Root>
    </>
  );
}
