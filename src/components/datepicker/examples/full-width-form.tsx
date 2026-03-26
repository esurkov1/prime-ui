import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button, Datepicker, Label, Popover } from "prime-ui-kit";
import * as React from "react";

const fieldStack: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--prime-sys-spacing-s)",
  width: "100%",
  maxWidth: "22rem",
  minWidth: 0,
};

/**
 * Полноширинное поле в колонке формы: триггер на всю ширину, широкая панель поповера.
 */
export function FullWidthFormDateExample() {
  const [value, setValue] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  const triggerText = value ? format(value, "d MMMM yyyy", { locale: ru }) : "Выберите дату";

  return (
    <div style={fieldStack}>
      <Label.Root htmlFor="fw-date-trigger" size="m">
        Дата визита
      </Label.Root>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button.Root fullWidth id="fw-date-trigger" mode="stroke" size="m" variant="neutral">
            {triggerText}
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content
          align="start"
          className="min-w-[min(100vw-2rem,36rem)]"
          insetPadding="none"
          side="bottom"
        >
          <Datepicker.Shell className="min-w-0">
            <Datepicker.Calendar
              locale={ru}
              mode="single"
              responsiveMonths
              selected={value}
              onSelect={(d) => {
                setValue(d);
                if (d) {
                  setOpen(false);
                }
              }}
            />
          </Datepicker.Shell>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
