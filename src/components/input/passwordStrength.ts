/** A password level: 0 — empty, 1 — weak, 2 — easy, 3 — medium, 4 — hard. */
export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

/** Below this length a password stays weak or easy, whatever it is made of. */
const SHORT = 8;

/**
 * The kit's default estimate. Every trait adds one point on its own, in any order: lowercase
 * letters, uppercase letters, digits, symbols, 10+ characters, 14+ characters. Points 0–2 are weak,
 * 3 easy, 4 medium, 5+ hard; a password shorter than 8 characters is at most easy. A quick hint
 * for the person typing, not a security check — the server decides what it accepts.
 */
export function getPasswordStrength(value: string): PasswordStrength {
  if (value.length === 0) return 0;
  const points =
    Number(/\p{Ll}/u.test(value)) +
    Number(/\p{Lu}/u.test(value)) +
    Number(/\p{N}/u.test(value)) +
    Number(/[^\p{L}\p{N}\s]/u.test(value)) +
    Number(value.length >= 10) +
    Number(value.length >= 14);
  const level: PasswordStrength = points >= 5 ? 4 : points === 4 ? 3 : points === 3 ? 2 : 1;
  return value.length < SHORT ? (Math.min(level, 2) as PasswordStrength) : level;
}
