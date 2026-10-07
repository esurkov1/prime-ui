import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Divider } from "@/components/divider/Divider";
import menu from "@/components/dropdown/menu.module.css";
import { Input } from "@/components/input/Input";
import { Popover } from "@/components/popover/Popover";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import type { PaletteColor } from "@/internal/states";

import styles from "./TagSelect.module.css";

/** Every palette hue, in the order of the menu (as in Notion). */
const TAG_COLORS: PaletteColor[] = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "sky",
  "teal",
];

export type TagOptionMenuLabels = {
  edit: string;
  name: string;
  delete: string;
  colors: string;
  colorNames: Record<PaletteColor, string>;
};

type TagOptionMenuProps = {
  value: string;
  label: string;
  color: PaletteColor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (value: string, updates: { label?: string; color?: PaletteColor }) => void;
  onDelete?: (value: string) => void;
  labels: TagOptionMenuLabels;
  disabled: boolean;
};

/**
 * The «⋯» of a TagSelect row: a Popover to rename, recolor or delete the option. The popover
 * opens above the list (it is inside a dropdown layer) and is its own topmost layer, so presses in
 * it never dismiss the list.
 */
export function TagOptionMenu({
  value,
  label,
  color,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  labels,
  disabled,
}: TagOptionMenuProps) {
  const [draft, setDraft] = React.useState(label);

  React.useEffect(() => {
    if (open) setDraft(label);
  }, [open, label]);

  const commitLabel = () => {
    const next = draft.trim();
    if (next && next !== label) onUpdate?.(value, { label: next });
    if (!next) setDraft(label);
  };

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <Button.Root
          variant="ghost"
          tone="neutral"
          size="xs"
          aria-label={labels.edit.replace("{label}", label)}
          disabled={disabled}
          className={styles.menuTrigger}
          // Keeps focus in the field input and the press away from the row (no toggle).
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Button.Icon>
            <Icon name="action.more" />
          </Button.Icon>
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="end" size="s" flush className={styles.menuPanel}>
        {/* Keys stay in the menu: the list is its React ancestor and would move its highlight. */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: only stops propagation */}
        <div className={styles.menuBody} onKeyDown={(event) => event.stopPropagation()}>
          {onUpdate ? (
            <Input.Root size="s">
              <Input.Wrapper>
                <Input.Field
                  autoFocus
                  value={draft}
                  aria-label={labels.name}
                  onValueChange={setDraft}
                  onBlur={commitLabel}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    commitLabel();
                    onOpenChange(false);
                  }}
                />
              </Input.Wrapper>
            </Input.Root>
          ) : null}
          {onDelete ? (
            <Button.Root
              variant="ghost"
              tone="danger"
              size="s"
              className={styles.menuDelete}
              onClick={() => {
                onDelete(value);
                onOpenChange(false);
              }}
            >
              <Button.Icon>
                <Icon name="action.delete" />
              </Button.Icon>
              {labels.delete}
            </Button.Root>
          ) : null}
          {onUpdate ? (
            <>
              <Divider.Root className={menu.separator} />
              <div className={menu.groupLabel}>{labels.colors}</div>
              <div className={menu.tier} data-size="s">
                {TAG_COLORS.map((hue) => (
                  <button
                    key={hue}
                    type="button"
                    aria-pressed={color === hue}
                    className={cx(menu.item, styles.colorRow)}
                    onClick={() => onUpdate(value, { color: hue })}
                  >
                    <Badge.Root color={hue}>{labels.colorNames[hue]}</Badge.Root>
                    <span className={styles.colorCheck} aria-hidden="true">
                      {color === hue ? <Icon name="action.check" /> : null}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
