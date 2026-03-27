import { Inbox } from "lucide-react";
import { EmptyPage, type EmptyPageSize } from "prime-ui-kit";

import styles from "./examples-demos.module.css";

const sizes = ["s", "m", "l", "xl"] as const satisfies readonly EmptyPageSize[];

/** Лестница размеров `s`–`xl`: иконка, кегль и отступы согласованы. */
export function EmptyPageSizes() {
  return (
    <div className={styles.stack}>
      {sizes.map((size) => (
        <EmptyPage.Root key={size} size={size} aria-labelledby={`empty-size-${size}`}>
          <EmptyPage.Icon aria-hidden>
            <Inbox strokeWidth={2} aria-hidden />
          </EmptyPage.Icon>
          <EmptyPage.Title id={`empty-size-${size}`}>Размер {size}</EmptyPage.Title>
          <EmptyPage.Description>Одинаковая структура, разная шкала.</EmptyPage.Description>
        </EmptyPage.Root>
      ))}
    </div>
  );
}
