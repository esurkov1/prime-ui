/** Deleting a shared tag asks first: the row waits with a spinner while the dialog is open, cancelling keeps the tag and the selection — `onOptionDelete`. */
import { ConfirmDialog, TagSelect, type TagSelectOption } from "prime-ui-kit";
import * as React from "react";

const INITIAL_OPTIONS: TagSelectOption[] = [
  { value: "vip", label: "VIP", color: "purple" },
  { value: "wholesale", label: "Опт", color: "blue" },
  { value: "overdue", label: "Просрочка", color: "red" },
  { value: "new", label: "Новый клиент", color: "green" },
];

const CLIENTS_WITH_TAG: Record<string, number> = { vip: 12, wholesale: 48, overdue: 7, new: 31 };

type Answer = { resolve: () => void; reject: () => void };

export default function TagSelectConfirmDeleteExample() {
  const [options, setOptions] = React.useState(INITIAL_OPTIONS);
  const [open, setOpen] = React.useState(false);
  const [target, setTarget] = React.useState<TagSelectOption>();
  const answer = React.useRef<Answer>(null);

  const askToDelete = (value: string) =>
    new Promise<void>((resolve, reject) => {
      answer.current = { resolve, reject };
      setTarget(options.find((option) => option.value === value));
      setOpen(true);
    });

  const confirm = () => {
    setOptions((prev) => prev.filter((option) => option.value !== target?.value));
    answer.current?.resolve();
    answer.current = null;
  };

  return (
    <>
      <TagSelect
        label="Метки клиента"
        options={options}
        defaultValue={["vip", "wholesale"]}
        onOptionDelete={askToDelete}
        placeholder="Добавить метку"
      />
      <ConfirmDialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) return;
          // Closed without the confirm: the tag stays.
          answer.current?.reject();
          answer.current = null;
        }}
        title={`Удалить метку «${target?.label ?? ""}»?`}
        description={`Она снимется у всех клиентов с этой меткой: ${CLIENTS_WITH_TAG[target?.value ?? ""] ?? 0}.`}
        confirmLabel="Удалить"
        onConfirm={confirm}
      />
    </>
  );
}
