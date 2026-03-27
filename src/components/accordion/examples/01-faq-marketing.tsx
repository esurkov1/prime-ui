import { CreditCard, Package, Truck } from "lucide-react";
import { Accordion } from "@/components/accordion/Accordion";
import { Typography } from "@/components/typography/Typography";

import styles from "./examples.module.css";

/**
 * FAQ-style marketing page: single expansion, grouped frame, triggers with icons and chevron.
 */
export default function AccordionExampleFaqMarketing() {
  return (
    <Accordion.Root type="single" layout="grouped" defaultValue="shipping">
      <Accordion.Item value="shipping">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={Truck} />
            <span>When will my order ship?</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div className={styles.bodyStack}>
            <Typography.Root as="p" variant="body-default" className={styles.lead}>
              Most in-stock orders leave our warehouse within one business day. You will receive a
              tracking link by email as soon as the carrier scans the package.
            </Typography.Root>
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={Package} />
            <span>What is your return policy?</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            Unopened items in original packaging can be returned within 30 days for a full refund.
            Opened consumables may be eligible for store credit—contact support with your order
            number.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="payment">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={CreditCard} />
            <span>Which payment methods do you accept?</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            We accept major cards, digital wallets, and purchase orders for approved business
            accounts. All transactions are processed over encrypted connections.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
