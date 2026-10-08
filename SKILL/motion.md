# Motion — animation and micro-animation on prime-ui-kit

Motion is part of the screen, not polish added at the end. A screen built on the kit moves the way
the kit's author would make it move: every state change is continuous, every press answers, nothing
flips — and nothing moves without a reason. Most of it is already inside the components; your job is
to use them so it can happen, and to add motion only where the kit leaves the choice to you.

The design contract is `docs/foundation.md` §7 in the kit repository. This file is how to apply it
on a screen.

## 1. What the kit already animates — do not rebuild it

Use the component and the motion comes with it. Never re-animate these with your own CSS.

| You need | The kit does it | How you get it |
|---|---|---|
| Press feedback | every pressable control scales to 0.98 (0.96 icon-only) | any `Button`, chip, item |
| A button whose label changes («Сохранить» → «Сохранено», «Продолжить» → «Подтвердить») | the new label flows in letter by letter, the width glides; digits-only changes stay in place | change the `Button.Root` text children |
| A long action from a button (download, export) | a fill grows inside the button | `Button.Root progress={0…1}`, the number in the label |
| A destructive action without a dialog | a held press with a fill clock; early release rolls back | `Button.Root holdToConfirm onConfirm={…}` |
| Loading inside a button | spinner over the kept label, width does not change | `loading` |
| Check / uncheck | the check draws in with a stroke, leaves fast | `Checkbox`, `Checkbox.Indicator`, `ColorSwatches` |
| Toggle | the thumb slides | `Switch` |
| One of a few | the indicator glides to the choice | `SegmentedControl`, `Tabs` |
| Disclosure | height through `grid-template-rows`, the chevron turns | `Accordion` |
| A counter or a count | digits roll like an odometer | `Badge` with a number child, the `counter` of `Input` / `Textarea` |
| Password strength | stepped bar fills cell by cell, the level word flows in | `Input.Root strength` |
| A one-time code | one focus ring glides between cells, digits fade in, success rolls across | `DigitInput` (`success` after the server accepts) |
| Steps of a whole | cells fill one after another | `ProgressBar steps value max` |
| Progress | the fill slides | `ProgressBar`, `ProgressCircle` |
| A trend card | scrub any point, the headline follows, the arrow turns, a new series cross-fades | `Sparkline` |
| Overlays | grow from the trigger (menus, popovers, tooltip from its arrow), modals stay centred, drawers and toasts come from their edge; exit is shorter than enter | `Dropdown`, `Popover`, `Tooltip`, `Modal`, `Drawer`, notifications |
| Tooltips along a toolbar | the first waits, the next ones show at once | `Tooltip` (shared warm window) |
| Toast stack | depth stack, expands on hover | `NotificationProvider` + `useNotifications` |
| Loading → data → empty → error | the region cross-fades and glides its height; loading is a skeleton of the data | `Crossfade` around the region, `Skeleton` in the data's geometry |
| Drag | the carried piece lifts, the drop glides into place | `Dnd`, `Kanban` |
| A rare milestone | a short confetti burst | `celebrate({ origin })` |

## 2. Decide first: should it move at all?

Ask by frequency, then by purpose.

| How often a person does it | Motion |
|---|---|
| Hundreds of times a day, or from the keyboard (arrowing a list, row hover, command palette) | none — color / fill only, at most `fast` |
| Tens of times a day (hover, tabs, toggles) | small and quick |
| Occasionally (dialogs, drawers, toasts) | the standard overlay motion |
| Rarely (success, empty state, onboarding, a milestone) | may carry delight |

Every motion has one of four purposes: feedback (a press answered), a state change (check, toggle,
selection moving), spatial continuity (a panel grows out of its trigger, an indicator travels), or
preventing a jump (items appearing, heights changing). «Looks nice» on a frequent element is not a
purpose.

Direct manipulation has no easing: while a finger or pointer drags, scrubs or resizes, the thing sits
under it. Easing starts when the hand lets go.

## 3. Tokens — the only durations and curves

| Token | Value | Use |
|---|---|---|
| `--prime-motion-duration-xfast` | 150 ms | hover fill on dense rows |
| `--prime-motion-duration-fast` | 230 ms | press, hover, small panels, every exit |
| `--prime-motion-duration-base` | 380 ms | dialogs, toggles, content swaps, things gliding into place |
| `--prime-motion-duration-slow` | 570 ms | drawers, sheets, long fills |
| `--prime-motion-easing-enter` | strong ease-out | appearing, responding |
| `--prime-motion-easing-exit` | strong ease-out | leaving (with a shorter duration than enter) |
| `--prime-motion-easing-standard` | ease-in-out | moving on screen, color and fill |
| `--prime-motion-easing-emphasized` | decisive start, soft landing | a thumb, an indicator, a check gliding into place |
| `--prime-motion-stagger` | 80 ms | step of a staggered first render |
| `--prime-motion-blur` | 2 px | hiding a change of shape while two states swap |
| `--prime-motion-press-scale` / `-compact` | 0.98 / 0.96 | `:active` scale |

Under `prefers-reduced-motion` the durations, stagger and press scale collapse to zero globally —
token-based CSS honours it for free. Anything you drive from JS checks the media query itself.

## 4. Rules for your own motion

- Tokens only: never a raw `ms` or `cubic-bezier` in your CSS.
- Animate `transform` and `opacity` (plus color, fill and shadow for state). Never `width`, `height`,
  `top`, `left`, `margin`; for height use `grid-template-rows: 0fr → 1fr`. Never `transition: all`.
- Enter on `enter`, leave on `exit`, and leave faster than you came. Never `ease-in`.
- Nothing overshoots: no bounce, no spring past the target, no elastic.
- Never from nothing: appear from `opacity: 0` plus a small offset (`--prime-space-1`/`-2`) or
  `scale(0.96)`, never `scale(0)`.
- State moves, it does not swap: a selection travels, a check draws, a counter rolls, two contents
  cross-fade. A toggled state uses transitions (they retarget mid-flight); keyframes only for one-shot
  appearance.
- Hover movement only inside `@media (hover: hover) and (pointer: fine)`; nothing is hover-only.
- Stagger only the first render of a short group (≤ 6 items) and never block interaction with it.
- A gesture clock (a hold, a countdown) is information, not motion: it keeps running under reduced
  motion.

## 5. Recipes

**A button that does a long job.** Do not swap the button for a progress bar. Pass `progress`, put
the number in the label, then a new label when it is done.

```tsx
import { Button, Icon } from "prime-ui-kit";

export function ExportButton({ progress, ready }: { progress?: number; ready: boolean }) {
  return (
    <Button.Root variant={ready ? "soft" : "solid"} progress={progress}>
      <Button.Icon>
        <Icon name="action.download" />
      </Button.Icon>
      {progress !== undefined
        ? `Экспорт ${Math.round(progress * 100)}%`
        : ready
          ? "Открыть файл"
          : "Экспорт в CSV"}
    </Button.Root>
  );
}
```

**Save → saved.** `loading` while the request runs, then change the label; the kit morphs it. Return
to the idle label after about two seconds.

**Delete without a dialog.** For an action that is easy to redo by hand, `holdToConfirm` replaces a
confirm dialog. Keep the dialog for anything irreversible that loses work.

```tsx
import { Button, Icon } from "prime-ui-kit";

export function DeleteDraft({ onDelete }: { onDelete: () => void }) {
  return (
    <Button.Root variant="soft" tone="danger" holdToConfirm onConfirm={onDelete}>
      <Button.Icon>
        <Icon name="action.delete" />
      </Button.Icon>
      Удерживайте, чтобы удалить черновик
    </Button.Root>
  );
}
```

**A region that loads.** Wrap it in `Crossfade` keyed by the state and show a `Skeleton` in the shape
of the data — never a spinner in the middle of an empty card, never a flip.

**A metric that updates.** Put a number in a `Badge` or a `Sparkline` and change it: the digits roll.
A number that changes by itself every frame (a running percentage) stays plain tabular text — rolling
there is noise.

**New password.** `Input.Root strength` — the meter and the level word come with it. Pair it with a
hint that states the rule in words.

**One-time code.** `DigitInput` with `onComplete` to verify, then `success` (accepted) or `error`
(rejected). Never colour the cells green before the server answered.

**Removing a row with undo.** Remove the row from the data, show a notification with an «Отменить»
action, put the row back on undo — undo beats a confirm dialog for reversible deletes.

**A rare achievement.** Say it in words (a `Banner`, the progress label turning success), then call
`celebrate({ origin: element })` once. Only for something that happens rarely — a quarter closed, the
first invoice paid, onboarding finished. Routine success is a notification.

```tsx
import { Button, celebrate } from "prime-ui-kit";

export function CloseQuarter({ onClose }: { onClose: () => void }) {
  return (
    <Button.Root
      onClick={(event) => {
        onClose();
        celebrate({ origin: event.currentTarget });
      }}
    >
      Закрыть квартал
    </Button.Root>
  );
}
```

## 6. Mistakes

- `transition: all 0.3s ease` → list the properties, use tokens.
- A spinner where the content's shape is known → `Skeleton` in that shape inside `Crossfade`.
- Content that appears or disappears with no transition (`{loading ? <A/> : <B/>}`) → `Crossfade`.
- Bounce, elastic or a spring that overshoots → `emphasized` lands without passing the target.
- Animating the highlight of a list moved by arrow keys, or a command palette → keep it still.
- Hover lift on table rows or list items → fill change only.
- Your own fade-in keyframes on a whole page or every card → no; first render is still, except a
  short staggered group.
- Confetti for a saved form → a notification; confetti only for rare milestones.
- Re-implementing a check, a toggle or an indicator with your own CSS → use the kit component; it
  already moves.
- JS-driven animation without a `prefers-reduced-motion` check → check it, or use CSS tokens.
