import * as React from "react";

import { Button } from "@/components/button/Button";
import { ColorSwatches } from "@/components/color-swatches/ColorSwatches";
import { Divider } from "@/components/divider/Divider";
import { Input } from "@/components/input/Input";
import { Popover } from "@/components/popover/Popover";
import { Icon } from "@/icons";
import { formatLabel } from "@/internal/formatLabel";
import { ListRowMark, listRowStyles } from "@/internal/listRow";
import { menuRowProps } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
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
  /** The deletion is pending: «⋯» shows a spinner in its place and does not open. */
  pending: boolean;
  /** A rename or recolor is being saved: «⋯» spins, the menu stays as it is. */
  saving: boolean;
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
  pending,
  saving,
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
          aria-label={formatLabel(labels.edit, { label })}
          disabled={disabled}
          loading={pending || saving}
          className={styles.menuTrigger}
          // Keeps focus in the field input until the menu opens.
          onMouseDown={(event) => event.preventDefault()}
        >
          <Button.Icon>
            <Icon name="action.more" />
          </Button.Icon>
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content size="s" flush className={styles.menuPanel}>
        <div className={styles.menuBody}>
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
          {onUpdate ? (
            <ColorSwatches
              mode="palette"
              size="s"
              palette={TAG_COLORS}
              value={color}
              aria-label={labels.colors}
              labels={{ colorNames: labels.colorNames }}
              className={styles.colorGrid}
              onValueChange={(hue) => {
                if (hue && hue !== color) onUpdate(value, { color: hue });
              }}
            />
          ) : null}
          {onDelete ? (
            <>
              {onUpdate ? <Divider className={menu.separator} /> : null}
              {/* A menu row beside the `s` field and swatches: the list row at `s`, danger. */}
              <button
                type="button"
                data-tone="danger"
                {...menuRowProps({ size: "s", danger: true, focusFill: true })}
                onClick={() => {
                  onOpenChange(false);
                  onDelete(value);
                }}
              >
                <ListRowMark size="s" lines="line">
                  <Icon name="action.delete" />
                </ListRowMark>
                <span className={listRowStyles.title}>{labels.delete}</span>
              </button>
            </>
          ) : null}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
