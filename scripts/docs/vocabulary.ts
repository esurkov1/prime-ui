/**
 * The API vocabulary of the kit (AGENTS.md §1, foundation §10) as data, so the docs contract can
 * check every `api.ts` against it: one name per concept. A name listed under `RENAMED` is the old
 * name of a concept with its one canonical name; an event prop must be a triad callback
 * (`onXChange`), a native DOM event, or one of `EVENTS`.
 */

/** Part segments, props and values that name a concept the vocabulary names differently. */
export const RENAMED = {
  parts: {} as Record<string, string>,
  /** `Part.prop` (or `*.prop` for every part) → the canonical name. */
  props: {
    "*.fillWidth": "`fullWidth`",
    "*.leadingIcon": "an `X.Icon` part",
    "*.trailingIcon": "an `X.Icon` part after the label",
    "*.icon": "an `X.Icon` part",
    "*.leading": "an `X.Icon` part",
    "*.trailing": "an `X.Icon` part after the label",
    "*.active": "`current` (a navigation location) or `selected` (a choice)",
    "*.isOpen": "`open`",
    "*.onClose": "`onOpenChange(false)` or `onDismiss` (a message)",
  } as Record<string, string>,
  /** A value inside a literal union type → the canonical value. */
  values: {
    error: "`danger` (a status tone)",
    active: "`current`",
  } as Record<string, string>,
};

/**
 * A literal union holding `multiple` is a selection mode spelled as an enum: one vs many is the
 * `multiple?: boolean` flag (AGENTS.md §1, selection mode). A `mode` that is
 * structurally different (Datepicker `single | range`) holds no `multiple`.
 */
export const SELECTION_MODE_VALUE = "multiple";

/** `Part.prop` names the rules above would rename, kept on purpose — each with its reason. */
export const KEPT: Record<string, string> = {
  "NotificationCard.icon":
    "the static rendering of a `notify()` record, whose `icon` is data (AGENTS.md §1 icons)",
};

/** Event props beyond the triads (`onXChange`) and native DOM events, each with one meaning. */
export const EVENTS = new Set([
  "onSelect", // activates a menu or command item
  "onRemove", // takes a value out of a selection
  "onDelete", // destroys an entity
  "onDismiss", // closes a message (Banner, Notification)
  "onConfirm", // a confirmed destructive or held action, or a countdown run out
  "onCommit", // a field's value is committed (blur, Enter, release)
  "onRetry", // retries a failed load or transfer
  "onCancel", // cancels a transfer
  "onDownload", // starts a download
  "onLoadMore", // asks for the next batch
  "onLoadOlder", // asks for older history
  "onReachStart",
  "onReachEnd",
  "onReorder",
  "onRowClick",
  "onLinkClick", // a press on a link of a rich text (the app routes a relative address)
  "onItemOpen", // opens an item of a board or a schedule
  "onComplete", // every cell of a code is filled
  "onDragStart",
  "onDragEnd",
  "onDrop",
  "onEnter",
  "onLeave",
  "onCopy",
  "onCreate",
  "onBarCreate",
  "onOptionUpdate",
  "onOptionDelete",
  "onEnded",
  "onTranscribe",
  "onSend",
  "onSendVoice",
  "onSendVideoNote",
  "onEditLast",
  "onReactionToggle",
  "onEnterConfirm",
  "onNewMessage",
  "onRead",
]);

/** Native DOM events a part may take as a prop of its own (not through `…rest`). */
export const NATIVE_EVENTS = new Set(["onClick", "onKeyDown", "onFocus", "onBlur", "onChange"]);
