import styles from "./touchTarget.module.css";

/** A 44px hit area on coarse pointers, both axes, the visual size unchanged (`touchTarget.module.css`). */
export const touchTargetClass = styles.target;

/** The same hit area grown in height only: a segment beside other content of its host. */
export const touchTargetBlockClass = styles.targetBlock;

/**
 * A row of a stacked list (a list item, a menu row, a timeline entry): on coarse pointers the row
 * itself grows to the touch target height, since a hit area outside it would cover its neighbours.
 */
export const touchTargetRowClass = styles.targetRow;
