/**
 * Ratchet mode of a guard: the offenders a guard finds are compared with its baseline
 * `src/test/baselines/<guard>.json` (a sorted list of offender ids).
 *
 * - An offender that is not in the baseline fails at once: nothing new gets in.
 * - A baseline entry the guard no longer finds is stale. It is reported (a warning) while the
 *   streams that own the sites fix them; under `RATCHET_STRICT=1` (the final tighten) a stale entry
 *   fails too, so a baseline only shrinks and ends empty.
 *
 * `RATCHET_WRITE=1 bunx vitest run <file>` rewrites the baselines of the guards in that file from
 * what they find. Only the contracts stream writes a baseline; every other change may only remove
 * entries from one.
 */
import fs from "node:fs";
import path from "node:path";

import { expect } from "vitest";

import { root } from "./contract-utils";

const BASELINE_DIR = "src/test/baselines";

const baselinePath = (guard: string) => path.join(root, BASELINE_DIR, `${guard}.json`);

/** The baseline of `guard`: the offender ids it may still report. */
export function readBaseline(guard: string): string[] {
  const file = baselinePath(guard);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as string[];
}

function writeBaseline(guard: string, offenders: string[], scope: string) {
  const file = baselinePath(guard);
  // A scoped call (one component of a per-component guard) replaces only its own entries.
  offenders = [...readBaseline(guard).filter((id) => !id.startsWith(scope)), ...offenders];
  if (offenders.length === 0) {
    if (fs.existsSync(file)) fs.rmSync(file);
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify([...new Set(offenders)].sort(), null, 2)}\n`);
}

/**
 * Asserts the ratchet of `guard`: every offender is in its baseline. Stale baseline entries are
 * warned about, and fail under `RATCHET_STRICT=1`. A guard checked per component passes the
 * component's `scope` (the prefix of its offender ids): only the baseline entries under that
 * prefix are compared.
 */
export function ratchet(guard: string, offenders: readonly string[], scope = "") {
  const outside = offenders.filter((id) => !id.startsWith(scope));
  if (outside.length > 0) throw new Error(`${guard}: offenders outside the scope "${scope}"`);
  if (process.env.RATCHET_WRITE === "1") {
    writeBaseline(guard, [...offenders], scope);
    return;
  }
  const baseline = new Set(readBaseline(guard).filter((id) => id.startsWith(scope)));
  const found = new Set(offenders);
  const fresh = [...found].filter((id) => !baseline.has(id)).sort();
  const stale = [...baseline].filter((id) => !found.has(id)).sort();
  expect(fresh, `${guard}: new offenders (fix them; the baseline only shrinks)`).toEqual([]);
  if (stale.length === 0) return;
  if (process.env.RATCHET_STRICT === "1") {
    expect(
      stale,
      `${guard}: fixed — remove these entries from ${BASELINE_DIR}/${guard}.json`,
    ).toEqual([]);
  } else {
    console.warn(
      `${guard}: ${stale.length} baseline entr${stale.length === 1 ? "y is" : "ies are"} fixed — remove ${stale.length === 1 ? "it" : "them"} from ${BASELINE_DIR}/${guard}.json:\n  ${stale.join("\n  ")}`,
    );
  }
}
