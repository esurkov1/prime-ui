import styles from "./sticky.module.css";

/**
 * A surface that sticks to the start edge of its scroller (`sticky.module.css`): it sticks at
 * `top: 0`, covers the sub-pixel seam above it in WebKit, and stops sticking on a screen lower than
 * 480px (foundation §9). The host sets only its stacking (`z-index`) and fill (`--sticky-bg`).
 */
export const stickySurfaceClass = styles.surface;
