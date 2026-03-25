import type * as React from "react";

import styles from "./ExampleSurface.module.css";

export type ExampleSurfaceProps = {
  className?: string;
  children: React.ReactNode;
};

export default function ExampleSurface({ className, children }: ExampleSurfaceProps) {
  const classes = className ? `${styles.root} ${className}` : styles.root;
  return <div className={classes}>{children}</div>;
}
