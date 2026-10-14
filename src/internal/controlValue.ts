/** A native control whose value the kit writes as typing would. */
export type ValueControl = HTMLInputElement | HTMLTextAreaElement;

/**
 * Writes a value into a native control the way typing does, so React's `onChange` (and the owner's
 * `onValueChange`) receive it whether the field is controlled or not.
 */
export function setControlValue(control: ValueControl, value: string) {
  const proto =
    control instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(control, value);
  control.dispatchEvent(new Event("input", { bubbles: true }));
}
