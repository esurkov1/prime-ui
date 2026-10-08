import type * as React from "react";

type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I,
) => void
  ? I
  : never;

/**
 * The ref a polymorphic `<Tag>` accepts when `Tag` is a union of tag names (an `as` prop): JSX
 * checks it against every element of the union at once. Parts keep `ref?: Ref<HTMLElement>` in
 * their props and pass `ref as TagRef<TheirAs>` to the tag.
 */
export type TagRef<Tag extends keyof HTMLElementTagNameMap> = React.Ref<
  UnionToIntersection<HTMLElementTagNameMap[Tag]>
>;
