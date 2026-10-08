import * as React from "react";

export type IconLayout = {
  /** Only icons: a square control without side padding. */
  iconOnly: boolean;
  /** An icon first, then text: the start side takes the optical padding. */
  leadingIcon: boolean;
  /** Text, then an icon last: the end side takes the optical padding. */
  trailingIcon: boolean;
};

/**
 * Where the icons sit among the direct children of a button-like control (Button,
 * ButtonGroup.Item): drives optical padding (icon side = padX − 4px), the square icon-only shape
 * and where a loading spinner goes. `iconType` is the control's own Icon part.
 */
export function iconLayout(children: React.ReactNode, iconType: React.ElementType): IconLayout {
  const content = React.Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );
  const isIcon = (child: React.ReactNode) => React.isValidElement(child) && child.type === iconType;
  const iconOnly = content.length > 0 && content.every(isIcon);
  return {
    iconOnly,
    leadingIcon: !iconOnly && content.length > 0 && isIcon(content[0]),
    trailingIcon: !iconOnly && content.length > 0 && isIcon(content[content.length - 1]),
  };
}
