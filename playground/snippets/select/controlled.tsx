import * as React from "react";

import { Select } from "@/components/select/Select";

import styles from "./select-snippets.module.css";

export default function SelectControlledSnippet() {
  const [tier, setTier] = React.useState("pro");

  return (
    <div className={`stack ${styles.stackNarrow}`}>
      <Select.Root size="m" value={tier} onChange={setTier} placeholder="Тариф">
        <Select.Trigger aria-label="Тариф подписки">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="free">Free</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
          <Select.Item value="team">Team</Select.Item>
        </Select.Content>
      </Select.Root>
      <p className="previewCaption previewCaptionTopBase">
        Текущее значение в состоянии родителя: <code>{tier}</code>
      </p>
    </div>
  );
}
