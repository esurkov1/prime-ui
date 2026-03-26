/**
 * Единая точка для JS: ширина, на которой сайдбар переключается между колонкой (inline) и оверлеем.
 * Дублируется в CSS как `64rem` / `64.001rem` в `@media` (в медиазапросах нельзя сослаться на `var()`).
 *
 * Ориентиры: overlay drawer + modal-поведение (фокус, Escape, scroll lock), persistent nav на lg+.
 */
export const SIDEBAR_LAYOUT_BREAKPOINT_MAX = "64rem";

/** Viewport «узкий»: оверлей, `responsive` переводит раскладку в sheet-подобный режим. */
export const SIDEBAR_MEDIA_QUERY_NARROW = `(max-width: ${SIDEBAR_LAYOUT_BREAKPOINT_MAX})`;

/** Viewport «широкий»: сайдбар в потоке сетки (вместе с `AppShell` и т.д.). */
export const SIDEBAR_MEDIA_QUERY_INLINE = "(min-width: 64.001rem)";

/**
 * Планшетная полоса между узким оверлеем и полноширинным сайдбаром:
 * при `variant="double"` и `open=false` остаётся только ContextBar (иконки), без полного скрытия.
 * Дублируется в CSS как `80rem` в `@media`.
 */
export const SIDEBAR_COMPACT_BREAKPOINT_MAX = "80rem";

export const SIDEBAR_MEDIA_QUERY_COMPACT = `(min-width: 64.001rem) and (max-width: ${SIDEBAR_COMPACT_BREAKPOINT_MAX})`;
