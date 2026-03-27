import { BookOpen, Code2, Webhook } from "lucide-react";
import * as React from "react";
import { Accordion } from "@/components/accordion/Accordion";
import { Typography } from "@/components/typography/Typography";

import styles from "./examples.module.css";

/**
 * Long-form API reference: controlled `value` / `onValueChange` so another part of the page (or
 * deep link) can sync which section is open.
 */
export default function AccordionExampleApiDocsSections() {
  const [open, setOpen] = React.useState<string>("auth");

  return (
    <Accordion.Root
      type="single"
      size="m"
      layout="grouped"
      value={open}
      onValueChange={(next) => {
        if (typeof next === "string") setOpen(next);
      }}
    >
      <Accordion.Item value="auth">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={BookOpen} />
            <span>Authentication</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div className={styles.bodyStack}>
            <Typography.Root as="p" variant="body-default" className={styles.lead}>
              Send a bearer token in the{" "}
              <Typography.Root as="span" variant="caption" weight="medium">
                Authorization
              </Typography.Root>{" "}
              header. Tokens expire after twelve hours; refresh using the endpoint described in the
              session guide.
            </Typography.Root>
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="webhooks">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={Webhook} />
            <span>Webhooks</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            Register HTTPS endpoints to receive signed event payloads. Retry policy uses exponential
            backoff for non-2xx responses up to three days.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="errors">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={Code2} />
            <span>Error format</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            Errors return JSON with{" "}
            <Typography.Root as="span" variant="caption" weight="medium">
              code
            </Typography.Root>
            ,{" "}
            <Typography.Root as="span" variant="caption" weight="medium">
              message
            </Typography.Root>
            , and optional{" "}
            <Typography.Root as="span" variant="caption" weight="medium">
              details
            </Typography.Root>{" "}
            for validation issues.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
