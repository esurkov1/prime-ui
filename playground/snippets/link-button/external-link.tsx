import { LinkButton } from "@/components/link-button/LinkButton";

/** Внешний переход: <code>target</code> и <code>rel</code> пробрасываются в нативный <code>&lt;a&gt;</code>. */
export default function LinkButtonExternalLinkSnippet() {
  return (
    <p>
      Документация в отдельной вкладке:{" "}
      <LinkButton.Root
        href="https://example.com/docs"
        target="_blank"
        rel="noopener noreferrer"
        size="m"
      >
        Открыть справку
      </LinkButton.Root>
    </p>
  );
}
