# Motion — animation and micro-animation on prime-ui-kit

Motion is part of the screen, not polish added at the end. A screen built on the kit moves the way
the kit's author would make it move: every state change is continuous, every press answers, nothing
flips — and nothing moves without a reason. Most of it is already inside the components; your job is
to use them so it can happen, and to add motion only where the kit leaves the choice to you.

The full design contract is [foundation.md → Motion and micro-animation](../docs/foundation.md#motion-and-micro-animation);
this file is how to apply it on a screen.

## 1. What the kit already animates — do not rebuild it

Use the component and the motion comes with it. Never re-animate these with your own CSS.

| You need | The kit does it | How you get it |
|---|---|---|
| Press feedback | every pressable gives in by the same 2px at its edges (1px icon-only), a chip and a long bar alike | any `Button`, chip, item |
| Icons that feel alive | every kit icon plays its own gesture once when its host (button, link, tab, menu item, option, row) is hovered or pressed; never on keyboard focus, disabled, or under reduced motion | `<Icon name>`, `prime-ui-kit/icons` glyphs, `createIcon` (a soft pop); `animated={false}` to keep one still |
| A button whose label changes («Сохранить» → «Сохранено», «Продолжить» → «Подтвердить») | the new label flows in letter by letter, the width glides; digits-only changes stay in place | change the `Button.Root` text children |
| A long action from a button (download, export) | a fill grows inside the button | `Button.Root progress={0…1}`, the number in the label |
| One destructive action without a list or a dialog | a held press with a fill clock; early release rolls back | `Button.Root holdToConfirm onConfirm={…}` |
| Loading inside a button | spinner over the kept label, width does not change | `loading` |
| Check / uncheck | the check draws in with a stroke, leaves fast | `Checkbox`, `Checkbox.Indicator`, `ColorSwatches` |
| Toggle | the thumb slides | `Switch` |
| One of a few | the indicator glides to the choice | `SegmentedControl`, `Tabs` |
| A part that folds open or closed | it opens on the enter clock and closes faster, the content fading as the height glides; the chevron turns | `Accordion`, `Sidebar.Group collapsible`, `Sidebar.Sub`, DataTable expanded rows |
| A chat message changes size (a reaction, a transcript, an edit, an upload state) | one stroke: the bubble glides to its new size with its parts, the time and the tail still ([Message → States](../src/components/message/COMPONENT.md#states)) | `Message.Root` (built in) |
| A counter or a count | digits roll like an odometer | `Badge` with a number child, the `counter` of `Input` / `Textarea` |
| A field with an error | the control shakes once, sharply, when the error arrives or changes; the label stays, the message drops in | `error` (or `invalid`) on any field, `Checkbox.Root`, `Switch.Root`, `Radio.Group` — not for an error the field mounts with |
| Password strength | stepped bar fills cell by cell, the level word flows in | `Input.Root strength` |
| A one-time code | one focus ring glides between cells, digits fade in; while the server checks it the cells quiet down, success rolls across, a refused code clears and its reason shakes in | `DigitInput` (`onComplete` returns a Promise, or `success` / `error`) |
| Steps of a whole | cells fill one after another | `ProgressBar steps value max` |
| Progress | the fill slides | `ProgressBar`, `ProgressCircle` |
| A trend card | scrub any point, the card's reading (`useSparkline`) follows, a new series cross-fades | `Sparkline` |
| Overlays | grow from the trigger (menus, popovers, tooltip from its arrow), modals stay centred, drawers, sheets and toasts come from their edge; a dialog, drawer or sheet leaves faster than it came, a small floating panel opens and closes on the same quick `fast` clock; the last content stays on screen while the exit plays | `Dropdown`, `Popover`, `Tooltip`, `Modal`, `ConfirmDialog`, `Drawer`, `Sheet`, `MediaViewer`, notifications — the `Root` kept mounted |
| Tooltips along a toolbar | the first waits, the next ones show at once | `Tooltip` (shared warm window) |
| Toast stack | depth stack, expands on hover | `NotificationProvider` + `useNotifications` |
| Loading → data | the skeleton is there from the first paint and the data takes its place with a short fade; the height never glides | `Crossfade` with the state `"loading"`, `Skeleton` in the data's geometry |
| Data → empty → error, another record | the region cross-fades and glides its height | `Crossfade` around the region |
| Drag | the carried piece lifts, its neighbours glide apart, the drop glides into place; while its save runs the piece stays still and its grip turns busy, and a refused save glides it back — across columns too | `Dnd`, `Kanban` cards and columns, DataTable and `List` `onReorder`, `FileUpload` tiles |
| A setting saved on the server | the thumb moves at once and a spinner turns inside it (a slider thumb dims); a refused save glides it back | `Switch` (`onCheckedChange` returns a Promise, or `loading`), `Slider` (`onCommit`) |
| A chip or a file row removed | it waits dimmed with a spinner on its ×; once gone it fades and closes up, the next ones glide into its place; refused, it stays | `Badge` `onRemove`, `FileUpload` `onValueChange`, TagSelect chips |
| A schedule bar moved, stretched or drawn | the bar lifts and steps by whole days under the pointer with a dates tooltip; a drawn bar is a ghost that turns into a pulsing Skeleton while `onBarCreate` runs; a refused change glides back, a refused bar fades out; on an empty place a phantom bar steps by units under the pointer and grows into the drawn range; the zoom follows the hand — a pinch, a modifier wheel or a drag along the dates, anchored at the pointer — and settles onto a preset it ends near | `Gantt` (`onBarChange`, `onBarCreate`, `zoom`) |
| Messages | a message new at the end floats up a little and fades in; the first render, history loaded above and rows scrolled into view never move; a jumped-to message stays bright while the others step back; «печатает…», reactions, selection and the ticks move by themselves ([Chat → States](../src/components/chat/COMPONENT.md#states), [Message → States](../src/components/message/COMPONENT.md#states)) | `Chat` (`selected`, `search`, `typing`, `jumpTo`, `Chat.Pinned`), `Message` (`onReactionToggle`, `Message.Typing`, `Message.Reply target`) |
| Writing a message | the send glyph turns into place as text appears; the reply / edit bar enters; a paused recording stills its dot into a pause glyph and freezes the timer and the waveform; the recording bar cross-fades over the field inside the row's height, the hint slides and fades with the finger, the dot breathes and the live waveform follows the voice; the formatting toolbar fades in over a selection | `Composer` |
| Playing a voice message | the waveform fills as it plays and is the seek slider; play and pause cross-fade; the speed label flows into the next rate | `VoicePlayer` |
| A rare milestone | a short confetti burst | `celebrate({ origin })` |

### Who moves what

Motion belongs to the component that knows what changed. Four kinds move by themselves, each from
the state you pass — never from the shape of your markup:

- **A part appears or goes** because its data did (an error, a chip, a row, a bar that selection
  brings): it rises in once and closes up in place. What mounts together with its page, its region
  or an opening overlay is simply there.
- **A value is replaced by another value** in one place (a label, a glyph, a control on one tab and
  another control in the same place on the next): the two cross-fade where they stand and the place
  glides to the new size from the edge it holds to.
- **A region changes state** (`Crossfade` `state`): loading hands over to the data in place; data,
  empty, error and another record cross-fade and glide the height; a status that turns back within
  the swap hold (a quiet refetch) never moves.
- **A layer opens or closes** (Modal, Drawer, Sheet, menus): only its panel and its scrim move;
  nothing inside replays the opening, and a drag copy lifted out of it flies still.

What a container never does for you: a row of the header's `Actions`, a toolbar or a list of your
children does not invent motion for them by their kind. Each child keeps its place: write a control
that changes per tab as one expression in one place (`{tab === "text" ? <SegmentedControl.Root … /> : <Datepicker.Root … />}`)
and it cross-fades in that place; render a child on some tabs only and it rises in and closes up.
Never add your own `key` per tab to such a child — that makes it another child, not another value.

## 2. Decide first: should it move at all?

Ask by frequency, then by purpose.

| How often a person does it | Motion |
|---|---|
| Hundreds of times a day, or from the keyboard (arrowing a list, row hover, command palette) | none — color / fill only, at most `xfast` |
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

Every duration, curve and scale is a `--prime-motion-*` token; the table with values and uses is
[foundation.md → Motion and micro-animation](../docs/foundation.md#motion-and-micro-animation). In
short: movement runs on `--prime-motion-duration-xfast · fast · base · slow` with the `enter`, `exit`,
`standard` or `emphasized` easing; opacity and color changes run on the
`--prime-motion-fade-xfast · fast · base · slow` group; sizes you start from or pass through come
from the `--prime-motion-scale-*` ladder.

Under `prefers-reduced-motion` the movement durations, stagger and the press go to 0
globally — token-based CSS honours it for free. Fades stay: a transition on the
`--prime-motion-fade-*` group still eases a state in instead of flipping it, and a loading loop
(`--prime-motion-loop`) keeps running, slower. Anything you drive from JS checks the media query
itself.

## 4. Rules for your own motion

- Tokens only: never a raw `ms` or `cubic-bezier` in your CSS.
- Animate `transform` and `opacity` (plus color, fill and shadow for state). Never `width`, `height`,
  `top`, `left`, `margin`; for height use `grid-template-rows: 0fr → 1fr`. Never `transition: all`.
- Enter on `enter`, leave on `exit`, and leave faster than you came. Never `ease-in`.
- Nothing overshoots: no bounce, no spring past the target, no elastic.
- Never from nothing: appear from `opacity: 0` plus a small offset (`--prime-space-1`/`-2`) or
  `scale(0.96)`, never `scale(0)`.
- State moves, it does not swap: a selection travels, a check draws, a counter rolls, two contents
  cross-fade. Foundation §7 rule 9: «Toggled state uses CSS transitions (retarget mid-flight), not
  keyframes. Keyframes only for one-shot enter/exit … and one-shot gestures»; rule 3: «Durations and
  easings come from `--prime-motion-*`; never a raw `ms` or `cubic-bezier`».
- Hover movement only inside `@media (hover: hover)`; nothing is hover-only.
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

**Delete without a dialog.** When [friction](ux.md#5-friction-matches-the-cost-of-a-mistake) asks for
a held press, `holdToConfirm` with the action in `onConfirm`:

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

**A region that loads.** Wrap it in `Crossfade` keyed by the state, the loading one keyed
`"loading"`, and show a `Skeleton` in the shape of the data from the first render — never a spinner
in the middle of an empty card, never a flip, never a region that unfolds as the data comes
([the rule](foundations.md#11-state-changes-are-continuous)).

**A metric that updates.** Put a number in a `Badge` and change it: the digits roll.
A number that changes by itself every frame (a running percentage) stays plain tabular text — rolling
there is noise.

**New password.** `Input.Root strength` — the meter and the level word come with it. Pair it with a
hint that states the rule in words.

**One-time code.** `DigitInput` with `onComplete` to verify, then `success` (accepted) or `error`
(rejected). Never colour the cells green before the server answered.

**Removing a row with undo.** Remove the row from the data, show a notification with an «Отменить»
action, put the row back on undo — undo beats a confirm dialog for reversible deletes. When the delete
reaches the server only after the chance to undo has passed, send it from the notification's
`onDismiss(reason)`: every reason but `"action"` (the toast timed out, was closed, swiped or pushed
out of the stack) means the person let it go; the «Отменить» action closes its toast by itself with
`"action"` ([the undo example](../src/components/notification/examples/undo.tsx)).

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
- A loading state that renders nothing, or a list that slides or unfolds in when its data arrives →
  a `Skeleton` in the data's geometry from the first render, under the state `"loading"`, so the data
  replaces it in place.
- Bounce, elastic or a spring that overshoots → `emphasized` lands without passing the target.
- Animating the highlight of a list moved by arrow keys, or a command palette → keep it still.
- Hover lift on table rows or list items → fill change only.
- Your own hover rotate, spin or bounce on an icon, or an icon from another library that does not move
  → a kit icon: it already plays its gesture with its host. A glyph repeated in every row of a long
  list → `animated={false}`.
- Your own fade-in keyframes on a whole page or every card → no; first render is still, except a
  short staggered group.
- An animated wrapper of your own around kit content (a fading or sliding `div`, an enter class on a
  panel, a `key` that remounts a block to replay it) → no: the part that knows the change moves it
  ([who moves what](#who-moves-what)); a region that swaps states is a `Crossfade`.
- Confetti for a saved form → «Сохранено» on the button when the form stays on screen, a notification
  when it goes away; confetti only for rare milestones.
- An overlay mounted conditionally (`{open && <Modal.Root>}`) or with a `key` that changes per record →
  it vanishes without its exit. Keep the `Root` mounted and drive it with `open`; the kit holds the last
  content on screen while the exit plays.
- Re-implementing a check, a toggle or an indicator with your own CSS → use the kit component; it
  already moves.
- JS-driven animation without a `prefers-reduced-motion` check → check it, or use CSS tokens.
