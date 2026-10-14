/**
 * The API vocabulary of the kit (CLAUDE.md §1, foundation §10) as data, so the docs contract can
 * check every `api.ts` against it: one name per concept. A name listed under `RENAMED` is the old
 * name of a concept with its one canonical name; an event prop must be a triad callback
 * (`onXChange`), a native DOM event, or one of `EVENTS`.
 */

/** Part segments, props and values that name a concept the vocabulary names differently. */
export const RENAMED = {
  parts: {
    "PageContent.List": "a `PageContent.Panel` (list and detail are panels of the split)",
    "PageContent.Detail": "a `PageContent.Panel` (list and detail are panels of the split)",
    "PageContent.Page": '`PageContent.Root as="section"`',
    "Timeline.Title": "`Timeline.ItemTitle`",
    "Timeline.Meta": "`Timeline.ItemMeta`",
    "Timeline.MetaPrimary": "`Timeline.ItemMeta`",
    "Timeline.Value": "`Timeline.ItemValue`",
    "Timeline.ValueMeta": "`Timeline.ItemMeta`",
    "Timeline.GapMeta": "`Timeline.Description` of a gap",
  } as Record<string, string>,
  /** `Part.prop` (or `*.prop` for every part) → the canonical name. */
  props: {
    "Kanban.Root.onItemClick": "`onItemOpen`",
    "Gantt.onSelect": "`onItemOpen`",
    "Gantt.onRowClick": "`onItemOpen`",
    "*.type": "`multiple` for one vs many (a `type` prop names no selection mode)",
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

/** Event props beyond the triads (`onXChange`) and native DOM events, each with one meaning. */
export const EVENTS = new Set([
  "onSelect", // activates a menu or command item
  "onRemove", // takes a value out of a selection
  "onDelete", // destroys an entity
  "onDismiss", // closes a message (Banner, Notification)
  "onConfirm", // a confirmed destructive or held action
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
