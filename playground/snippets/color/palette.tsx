import styles from "./colorSwatches.module.css";

const SCALE_STEPS = [
  "950",
  "900",
  "800",
  "700",
  "600",
  "500",
  "400",
  "300",
  "200",
  "100",
  "50",
] as const;

function refVar(hue: string, step: string) {
  return `--prime-ref-color-${hue}-${step}`;
}

/** Примитивы из `tokens.css` (палитра до семантического слоя). */
const REF_GROUPS: { title: string; tokens: string[] }[] = [
  {
    title: "Gray & neutrals",
    tokens: [
      "--prime-ref-color-black",
      ...SCALE_STEPS.map((s) => refVar("gray", s)),
      "--prime-ref-color-gray-0",
      "--prime-ref-color-white",
      "--prime-ref-color-gray-alpha10",
      "--prime-ref-color-gray-alpha16",
      "--prime-ref-color-gray-alpha24",
    ],
  },
  ...(["red", "orange", "yellow", "green", "teal", "sky", "blue", "purple", "pink"] as const).map(
    (hue) => ({
      title: hue.charAt(0).toUpperCase() + hue.slice(1),
      tokens: SCALE_STEPS.map((s) => refVar(hue, s)),
    }),
  ),
];

function tokenLabel(token: string) {
  return token.replace(/^--prime-ref-color-/, "").replace(/-/g, " ");
}

export default function RefColorPalette() {
  return (
    <div className={styles.root}>
      {REF_GROUPS.map((group) => (
        <section key={group.title} className={styles.group}>
          <h4 className={styles.groupTitle}>{group.title}</h4>
          <div className={styles.grid}>
            {group.tokens.map((token) => (
              <figure key={token} className={styles.figure}>
                <div
                  className={styles.swatch}
                  style={{ background: `var(${token})` }}
                  title={token}
                />
                <figcaption className={styles.caption}>
                  <span className={styles.label}>{tokenLabel(token)}</span>
                  <code className={styles.token}>{token}</code>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
