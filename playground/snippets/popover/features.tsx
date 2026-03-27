import * as React from "react";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Popover } from "@/components/popover/Popover";
import { Select } from "@/components/select/Select";
import { Typography } from "@/components/typography/Typography";

import preview from "./preview.module.css";

export default function PopoverFeaturesSnippet() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root className={preview.triggerWide} mode="stroke" variant="neutral">
          Заявка на доступ
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" className={preview.formPanel} sameMinWidthAsTrigger trapFocus>
        <Typography.Root as="p" variant="body-small" weight="medium">
          Короткая форма
        </Typography.Root>
        <Typography.Root as="p" className={preview.panelTextMuted} variant="body-small">
          <code>trapFocus</code> удерживает Tab внутри панели; выпадающий список не воспринимается
          как «клик снаружи» поповера, поэтому панель не закрывается при работе с выбором значения.
        </Typography.Root>
        <Input.Root label="Комментарий">
          <Input.Wrapper>
            <Input.Field
              placeholder="Зачем нужен доступ"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Input.Wrapper>
        </Input.Root>
        <Select.Root placeholder="Роль">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="viewer">Наблюдатель</Select.Item>
            <Select.Item value="editor">Редактор</Select.Item>
            <Select.Item value="admin">Администратор</Select.Item>
          </Select.Content>
        </Select.Root>
        <div className={preview.actionsRow}>
          <Button.Root mode="ghost" variant="neutral" onClick={() => setOpen(false)}>
            Отмена
          </Button.Root>
          <Button.Root mode="filled" variant="primary" onClick={() => setOpen(false)}>
            Отправить
          </Button.Root>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
