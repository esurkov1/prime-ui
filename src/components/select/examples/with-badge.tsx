/** Options with Select.ItemIcon and a Select.Badge in the trigger whose color follows the picked value. Use it when the chosen option carries a status. */
import { IconLock, IconMail, IconSearch, type PaletteColor, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STATUS: Record<string, { text: string; color: PaletteColor }> = {
  public: { text: "Открыт", color: "green" },
  link: { text: "По ссылке", color: "orange" },
  private: { text: "Закрыт", color: "gray" },
};

export default function SelectWithBadgeExample() {
  const [access, setAccess] = React.useState("public");
  const status = STATUS[access];

  return (
    <div className={styles.narrow}>
      <Select.Root label="Доступ к проекту" value={access} onValueChange={setAccess}>
        <Select.Trigger>
          <Select.Value />
          {status ? <Select.Badge color={status.color}>{status.text}</Select.Badge> : null}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="public">
            <Select.ItemIcon>
              <IconSearch />
            </Select.ItemIcon>
            Виден в поиске
          </Select.Item>
          <Select.Item value="link">
            <Select.ItemIcon>
              <IconMail />
            </Select.ItemIcon>
            Только по приглашению
          </Select.Item>
          <Select.Item value="private">
            <Select.ItemIcon>
              <IconLock />
            </Select.ItemIcon>
            Только участники
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
