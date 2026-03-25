import { LinkButton } from "@/components/link-button/LinkButton";

export default function LinkButtonSizesSnippet() {
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
