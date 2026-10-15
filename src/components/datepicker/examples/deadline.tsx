/** A document's expiry date whose hint counts the days left and takes the status tone — `hint`, `hintTone`. */
import { differenceInCalendarDays } from "date-fns";
import { Datepicker } from "prime-ui-kit";
import * as React from "react";

const TODAY = new Date(2026, 9, 15);
const WARN_DAYS = 30;

/** The hint and its tone: the words say the status, the tone repeats it. */
function expiryHint(expires: Date | null) {
  if (!expires) return { hint: "Дата из договора страхования", tone: "neutral" as const };
  const days = differenceInCalendarDays(expires, TODAY);
  if (days < 0) return { hint: `Срок истёк ${-days} дн. назад`, tone: "danger" as const };
  if (days <= WARN_DAYS) return { hint: `Осталось ${days} дн.`, tone: "warning" as const };
  return { hint: `Действует ещё ${days} дн.`, tone: "success" as const };
}

export default function DatepickerDeadlineExample() {
  const [expires, setExpires] = React.useState<Date | null>(new Date(2026, 9, 27));
  const { hint, tone } = expiryHint(expires);

  return (
    <Datepicker.Root
      mode="single"
      label="Страховка действует до"
      value={expires}
      onValueChange={setExpires}
      hint={hint}
      hintTone={tone}
      fullWidth
    />
  );
}
