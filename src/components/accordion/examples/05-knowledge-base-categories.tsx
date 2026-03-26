import { FileQuestion, LifeBuoy, ShieldCheck } from "lucide-react";
import { Accordion, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Support hub: `collapsible={false}` keeps one section pinned open once chosen, and a disabled item
 * marks content that is not yet available for the user’s plan.
 */
export default function AccordionExampleKnowledgeBaseCategories() {
  return (
    <Accordion.Root
      type="single"
      size="m"
      layout="separate"
      defaultValue="basics"
      collapsible={false}
    >
      <Accordion.Item value="basics">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={LifeBuoy} />
            <span>Getting started</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            New here? Complete the workspace checklist, invite teammates, and connect your first
            data source from the integrations directory.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="billing" disabled>
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={ShieldCheck} />
            <span>Billing &amp; contracts (Enterprise)</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            Contract terms and invoice history appear here when your organization upgrades.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="troubleshoot">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={FileQuestion} />
            <span>Troubleshooting</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            Common fixes: clear the local cache, verify outbound firewall rules for our API hosts,
            and confirm your SDK is on a supported major version.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
