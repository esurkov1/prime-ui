import { Bell, Lock, User } from "lucide-react";
import { Accordion } from "@/components/accordion/Accordion";
import { Typography } from "@/components/typography/Typography";

import styles from "./examples.module.css";

/**
 * Account settings: compare several open sections at once with `type="multiple"` and card-like
 * `layout="separate"`.
 */
export default function AccordionExampleSettingsPanels() {
  return (
    <Accordion.Root
      type="multiple"
      size="m"
      layout="separate"
      defaultValue={["profile", "notifications"]}
    >
      <Accordion.Item value="profile">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={User} />
            <span>Profile</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div className={styles.bodyStack}>
            <Typography.Root as="p" variant="body-default" className={styles.lead}>
              Update your display name, avatar, and public contact details. Changes apply across all
              signed-in devices after you save.
            </Typography.Root>
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="notifications">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={Bell} />
            <span>Notifications</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            Choose email, push, and in-app channels. Digest mode bundles low-priority updates into
            one daily summary.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="security">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={Lock} />
            <span>Security</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" className={styles.lead}>
            Manage passwords, two-factor authentication, and active sessions. We recommend enabling
            an authenticator app for administrator roles.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
