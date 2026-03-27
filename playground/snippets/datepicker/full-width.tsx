import { ru } from "date-fns/locale";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { Datepicker } from "@/components/datepicker/Datepicker";
import { Popover } from "@/components/popover/Popover";
import ExampleSurface from "../../components/ExampleSurface";

export default function DatepickerFullWidthSnippet() {
  const [value, setValue] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full max-w-xl min-w-0">
      <ExampleSurface className="!w-full min-w-0 max-w-none">
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" variant="neutral">
              Календарь на всю ширину панели
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" className="min-w-[min(100vw-2rem,36rem)]" side="bottom">
            <Datepicker.Shell className="min-w-0">
              <Datepicker.Calendar
                locale={ru}
                mode="single"
                responsiveMonths
                selected={value}
                onSelect={(d) => {
                  setValue(d);
                  if (d) setOpen(false);
                }}
              />
            </Datepicker.Shell>
          </Popover.Content>
        </Popover.Root>
      </ExampleSurface>
    </div>
  );
}
