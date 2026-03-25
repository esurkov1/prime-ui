import type { ReactNode } from "react";

import { Hint } from "@/components/hint/Hint";
import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import type { HintSize } from "@/internal/states";

import styles from "./AvatarRowsDemo.module.css";

export type AvatarRowsDemoRootProps = {
  children?: ReactNode;
  className?: string;
};

export function AvatarRowsDemoRoot({ children, className }: AvatarRowsDemoRootProps) {
  return <div className={cx(styles.root, className)}>{children}</div>;
}

export type AvatarRowsDemoRowProps = {
  avatar: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function AvatarRowsDemoRow({ avatar, children, className }: AvatarRowsDemoRowProps) {
  return (
    <div className={cx(styles.row, className)}>
      {avatar}
      <div className={styles.copyColumn}>{children}</div>
    </div>
  );
}

export type AvatarRowsDemoTitleBlockProps = {
  children?: ReactNode;
  className?: string;
};

export function AvatarRowsDemoTitleBlock({ children, className }: AvatarRowsDemoTitleBlockProps) {
  return <div className={cx(styles.titleBlock, className)}>{children}</div>;
}

export type AvatarRowsDemoActionsProps = {
  children?: ReactNode;
  className?: string;
};

export function AvatarRowsDemoActions({ children, className }: AvatarRowsDemoActionsProps) {
  return <div className={cx(styles.actions, className)}>{children}</div>;
}

export type AvatarRowsDemoTitleProps = {
  children?: ReactNode;
  className?: string;
};

export function AvatarRowsDemoTitle({ children, className }: AvatarRowsDemoTitleProps) {
  return <div className={cx(styles.title, className)}>{children}</div>;
}

export type AvatarRowsDemoHintProps = {
  children?: ReactNode;
  className?: string;
};

export function AvatarRowsDemoHint({ children, className }: AvatarRowsDemoHintProps) {
  const controlSize = useOptionalControlSize() ?? "m";
  return (
    <Hint.Root size={controlSize as HintSize} className={className}>
      {children}
    </Hint.Root>
  );
}
