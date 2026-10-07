import type * as React from "react";

import styles from "./PlaygroundApiTable.module.css";

export type PlaygroundApiPropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  required: string;
  description: string;
};

/** Marks `` `code` `` fragments inside descriptions. */
function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static split of a constant string
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      part
    ),
  );
}

/**
 * Props table for playground pages. A plain semantic table (not DataTable) so documentation
 * renders even while components are being reworked; on narrow screens rows become cards.
 */
export function PlaygroundApiTable({ rows }: { rows: PlaygroundApiPropRow[] }) {
  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Проп</th>
            <th scope="col">Тип</th>
            <th scope="col">По умолчанию</th>
            <th scope="col">Описание</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const required = row.required.trim().toLowerCase().startsWith("да");
            return (
              <tr key={row.prop}>
                <th scope="row" data-label="Проп">
                  <span className={styles.prop}>
                    <code>{row.prop}</code>
                    {required ? (
                      <span className={styles.required} title="Обязательный">
                        обяз.
                      </span>
                    ) : null}
                  </span>
                </th>
                <td data-label="Тип">
                  <code className={styles.type}>{row.type}</code>
                </td>
                <td data-label="По умолчанию">
                  {row.defaultValue === "—" || row.defaultValue === "" ? (
                    <span className={styles.empty}>—</span>
                  ) : (
                    <code>{row.defaultValue}</code>
                  )}
                </td>
                <td data-label="Описание" className={styles.description}>
                  {renderInlineCode(row.description)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
