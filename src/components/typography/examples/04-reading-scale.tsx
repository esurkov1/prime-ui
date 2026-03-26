import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Vertical ladder of reading roles from display down to caption-micro (English labels). */
export default function TypographyExampleReadingScale() {
  return (
    <div className={styles.scaleList}>
      <Typography.Root as="p" variant="display">
        Display
      </Typography.Root>
      <Typography.Root as="p" variant="headline">
        Headline
      </Typography.Root>
      <Typography.Root as="p" variant="heading-page">
        Heading page
      </Typography.Root>
      <Typography.Root as="p" variant="heading-section">
        Heading section
      </Typography.Root>
      <Typography.Root as="p" variant="heading-subsection">
        Heading subsection
      </Typography.Root>
      <Typography.Root as="p" variant="heading-group">
        Heading group
      </Typography.Root>
      <Typography.Root as="p" variant="body-large">
        Body large — introductory paragraphs and emphasis blocks.
      </Typography.Root>
      <Typography.Root as="p" variant="body-default">
        Body default — default paragraph role for product copy.
      </Typography.Root>
      <Typography.Root as="p" variant="body-small">
        Body small — dense tables and secondary descriptions.
      </Typography.Root>
      <Typography.Root as="p" variant="body-compact">
        Body compact — tight single-line labels and metadata.
      </Typography.Root>
      <Typography.Root as="p" variant="caption">
        Caption — supporting text and timestamps.
      </Typography.Root>
      <Typography.Root as="p" variant="caption-micro" tone="muted">
        Caption micro — legal footnotes and fine print.
      </Typography.Root>
    </div>
  );
}
