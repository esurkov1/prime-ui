import { Minus, Plus } from "lucide-react";
import { Accordion, LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Checkout flow: custom open/close icons on the arrow, dense copy, and a policy link in the body.
 */
export default function AccordionExampleCheckoutOrderSummary() {
  return (
    <Accordion.Root type="single" size="m" layout="grouped" defaultValue="totals">
      <Accordion.Item value="totals">
        <Accordion.Header>
          <Accordion.Trigger>
            <span>Order totals</span>
            <Accordion.Arrow openIcon={Plus} closeIcon={Minus} />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div className={styles.bodyStack}>
            <div className={styles.row}>
              <Typography.Root as="span" variant="body-default">
                Subtotal
              </Typography.Root>
              <Typography.Root as="span" variant="body-default">
                $124.00
              </Typography.Root>
            </div>
            <div className={styles.row}>
              <Typography.Root as="span" variant="body-default" tone="muted">
                Estimated tax
              </Typography.Root>
              <Typography.Root as="span" variant="body-default" tone="muted">
                $9.92
              </Typography.Root>
            </div>
            <div className={styles.row}>
              <Typography.Root as="span" variant="body-small" weight="semibold">
                Due today
              </Typography.Root>
              <Typography.Root as="span" variant="body-small" weight="semibold">
                $133.92
              </Typography.Root>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="delivery">
        <Accordion.Header>
          <Accordion.Trigger>
            <span>Delivery window</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            Arrives Tuesday–Thursday depending on carrier volume. You can reschedule from the
            confirmation email.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="terms">
        <Accordion.Header>
          <Accordion.Trigger>
            <span>Terms &amp; privacy</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div className={styles.stack}>
            <Typography.Root as="p" variant="body-small" className={styles.lead}>
              By placing this order you agree to our terms of sale and refund policy.
            </Typography.Root>
            <div className={styles.actions}>
              <LinkButton.Root href="#" size="s">
                Terms of sale
              </LinkButton.Root>
              <LinkButton.Root href="#" size="s">
                Privacy policy
              </LinkButton.Root>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
