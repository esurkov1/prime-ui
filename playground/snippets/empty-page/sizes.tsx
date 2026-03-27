import { Inbox } from "lucide-react";

import { EmptyPage } from "@/components/empty-page/EmptyPage";
import type { EmptyPageSize } from "@/internal/states";

import styles from "./empty-page-demos.module.css";

const sizes = ["s", "m", "l", "xl"] as const satisfies readonly EmptyPageSize[];

export default function EmptyPageSizesSnippet() {
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
