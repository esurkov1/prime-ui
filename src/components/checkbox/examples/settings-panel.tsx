import { Checkbox } from "prime-ui-kit";
import * as React from "react";

/**
 * Settings-style list: optional features with hints; one option disabled (e.g. plan-gated).
 */
export function SettingsPanelExample() {
  const [desktopNotify, setDesktopNotify] = React.useState(true);
  const [sound, setSound] = React.useState(false);
  const [weeklyDigest, setWeeklyDigest] = React.useState(true);

  return (
    <>
      <Checkbox.Root
        name="notify_desktop"
        value="on"
        size="m"
        checked={desktopNotify}
        onChange={(e) => setDesktopNotify(e.target.checked)}
      >
        <Checkbox.Label>Desktop notifications</Checkbox.Label>
        <Checkbox.Hint>Show alerts when the app is in the background.</Checkbox.Hint>
      </Checkbox.Root>
      <Checkbox.Root
        name="sound"
        value="on"
        size="m"
        checked={sound}
        onChange={(e) => setSound(e.target.checked)}
      >
        <Checkbox.Label>Sound effects</Checkbox.Label>
        <Checkbox.Hint>Short UI sounds for sends and errors.</Checkbox.Hint>
      </Checkbox.Root>
      <Checkbox.Root name="sso" value="on" size="m" disabled>
        <Checkbox.Label>SSO / SAML (Enterprise)</Checkbox.Label>
        <Checkbox.Hint>Contact sales to enable single sign-on.</Checkbox.Hint>
      </Checkbox.Root>
      <Checkbox.Root
        name="digest"
        value="on"
        size="m"
        checked={weeklyDigest}
        onChange={(e) => setWeeklyDigest(e.target.checked)}
      >
        <Checkbox.Label>Weekly activity summary</Checkbox.Label>
        <Checkbox.Hint>Email recap of mentions and tasks.</Checkbox.Hint>
      </Checkbox.Root>
    </>
  );
}
