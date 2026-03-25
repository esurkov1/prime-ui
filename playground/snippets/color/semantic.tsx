import styles from "./colorSwatches.module.css";

type SwatchItem = { token: string; label: string };

const SEMANTIC_GROUPS: { title: string; items: SwatchItem[] }[] = [
  {
    title: "Background",
    items: [
      { token: "--prime-sys-color-surface-default", label: "Canvas" },
      { token: "--prime-sys-color-surface-raised", label: "Surface" },
      { token: "--prime-sys-color-surface-elevated", label: "Elevated" },
      { token: "--prime-sys-color-surface-accentSoft", label: "Accent soft" },
      { token: "--prime-sys-color-surface-dangerSoft", label: "Danger soft" },
      { token: "--prime-sys-color-surface-overlay", label: "Overlay" },
    ],
  },
  {
    title: "Text",
    items: [
      { token: "--prime-sys-color-content-primary", label: "Primary" },
      { token: "--prime-sys-color-content-secondary", label: "Secondary" },
      { token: "--prime-sys-color-content-muted", label: "Muted" },
      { token: "--prime-sys-color-content-accent", label: "Accent" },
      { token: "--prime-sys-color-content-disabled", label: "Disabled" },
      { token: "--prime-sys-color-content-danger", label: "Danger" },
      { token: "--prime-sys-color-content-inverse", label: "Inverse" },
    ],
  },
  {
    title: "Border",
    items: [
      { token: "--prime-sys-color-border-subtle", label: "Subtle" },
      { token: "--prime-sys-color-border-separator", label: "Separator" },
      { token: "--prime-sys-color-border-strong", label: "Strong" },
      { token: "--prime-sys-color-border-emphasis", label: "Emphasis" },
      { token: "--prime-sys-color-border-muted", label: "Muted" },
      { token: "--prime-sys-color-border-accent", label: "Accent" },
      { token: "--prime-sys-color-border-danger", label: "Danger" },
      { token: "--prime-sys-color-border-disabled", label: "Disabled" },
      { token: "--prime-sys-color-border-inverse", label: "Inverse" },
    ],
  },
  {
    title: "Field",
    items: [
      { token: "--prime-sys-color-field-bg", label: "Background" },
      { token: "--prime-sys-color-field-text", label: "Text" },
      { token: "--prime-sys-color-field-placeholder", label: "Placeholder" },
      { token: "--prime-sys-color-field-border", label: "Border" },
      { token: "--prime-sys-color-field-borderHover", label: "Border hover" },
      { token: "--prime-sys-color-field-borderFocus", label: "Border focus" },
      { token: "--prime-sys-color-field-borderError", label: "Border error" },
    ],
  },
  {
    title: "Action",
    items: [
      { token: "--prime-sys-color-action-primaryBackground", label: "Primary bg" },
      { token: "--prime-sys-color-action-primaryBackgroundHover", label: "Primary bg hover" },
      { token: "--prime-sys-color-action-primaryForeground", label: "Primary text" },
      { token: "--prime-sys-color-action-primarySoftBackground", label: "Primary soft bg" },
      { token: "--prime-sys-color-action-primarySoftForeground", label: "Primary soft text" },
      { token: "--prime-sys-color-action-neutralBackground", label: "Neutral bg" },
      { token: "--prime-sys-color-action-neutralBackgroundHover", label: "Neutral bg hover" },
      { token: "--prime-sys-color-action-neutralForeground", label: "Neutral text" },
      { token: "--prime-sys-color-action-errorBackground", label: "Error bg" },
      { token: "--prime-sys-color-action-errorBackgroundHover", label: "Error bg hover" },
      { token: "--prime-sys-color-action-errorForeground", label: "Error text" },
    ],
  },
  {
    title: "Focus",
    items: [{ token: "--prime-sys-color-focus-ring", label: "Focus ring" }],
  },
  {
    title: "Status — away",
    items: [
      { token: "--prime-sys-color-status-away-background", label: "Background" },
      { token: "--prime-sys-color-status-away-backgroundEmphasis", label: "Strong" },
      { token: "--prime-sys-color-status-away-border", label: "Border" },
      { token: "--prime-sys-color-status-away-foreground", label: "Text" },
    ],
  },
  {
    title: "Status — error",
    items: [
      { token: "--prime-sys-color-status-error-background", label: "Background" },
      { token: "--prime-sys-color-status-error-backgroundEmphasis", label: "Strong" },
      { token: "--prime-sys-color-status-error-border", label: "Border" },
      { token: "--prime-sys-color-status-error-foreground", label: "Text" },
    ],
  },
  {
    title: "Status — feature",
    items: [
      { token: "--prime-sys-color-status-feature-background", label: "Background" },
      { token: "--prime-sys-color-status-feature-backgroundEmphasis", label: "Strong" },
      { token: "--prime-sys-color-status-feature-border", label: "Border" },
      { token: "--prime-sys-color-status-feature-foreground", label: "Text" },
    ],
  },
  {
    title: "Status — information",
    items: [
      { token: "--prime-sys-color-status-information-background", label: "Background" },
      { token: "--prime-sys-color-status-information-backgroundEmphasis", label: "Strong" },
      { token: "--prime-sys-color-status-information-border", label: "Border" },
      { token: "--prime-sys-color-status-information-foreground", label: "Text" },
    ],
  },
  {
    title: "Status — success",
    items: [
      { token: "--prime-sys-color-status-success-background", label: "Background" },
      { token: "--prime-sys-color-status-success-backgroundEmphasis", label: "Strong" },
      { token: "--prime-sys-color-status-success-border", label: "Border" },
      { token: "--prime-sys-color-status-success-foreground", label: "Text" },
    ],
  },
  {
    title: "Status — verified",
    items: [
      { token: "--prime-sys-color-status-verified-background", label: "Background" },
      { token: "--prime-sys-color-status-verified-backgroundEmphasis", label: "Strong" },
      { token: "--prime-sys-color-status-verified-border", label: "Border" },
      { token: "--prime-sys-color-status-verified-foreground", label: "Text" },
    ],
  },
  {
    title: "Status — warning",
    items: [
      { token: "--prime-sys-color-status-warning-background", label: "Background" },
      { token: "--prime-sys-color-status-warning-backgroundEmphasis", label: "Strong" },
      { token: "--prime-sys-color-status-warning-border", label: "Border" },
      { token: "--prime-sys-color-status-warning-foreground", label: "Text" },
    ],
  },
];

export default function SemanticColorSwatches() {
  return (
    <div className={styles.root}>
      {SEMANTIC_GROUPS.map((group) => (
        <section key={group.title} className={styles.group}>
          <h4 className={styles.groupTitle}>{group.title}</h4>
          <div className={styles.grid}>
            {group.items.map((item) => (
              <figure key={item.token} className={styles.figure}>
                <div
                  className={styles.swatch}
                  style={{ background: `var(${item.token})` }}
                  title={item.token}
                />
                <figcaption className={styles.caption}>
                  <span className={styles.label}>{item.label}</span>
                  <code className={styles.token}>{item.token}</code>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
