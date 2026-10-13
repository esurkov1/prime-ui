#!/usr/bin/env node
/**
 * `npx prime-ui-kit skill [dir]` — copies the agent skill shipped in this package (`dist/skill/`)
 * into a project, by default `.claude/skills/prime-ui-kit`. Run again after an upgrade: the folder is
 * replaced, so the skill always matches the installed version. Node built-ins only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const USAGE = `Usage: prime-ui-kit skill [dir]

Copies the prime-ui-kit agent skill into [dir] (default: .claude/skills/prime-ui-kit).
Examples:
  npx prime-ui-kit skill                                    # this project, Claude Code
  npx prime-ui-kit skill ~/.claude/skills/prime-ui-kit      # all your projects
  npx prime-ui-kit skill .cursor/skills/prime-ui-kit        # another agent`;

const [command, target, ...rest] = process.argv.slice(2);

if (command !== "skill" || rest.length > 0) {
  console.log(USAGE);
  process.exit(command === undefined || command === "--help" || command === "-h" ? 0 : 1);
}

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "skill");
if (!fs.existsSync(path.join(source, "SKILL.md"))) {
  console.error(`prime-ui-kit: the skill is missing from this install (${source}).`);
  process.exit(1);
}

const dest = path.resolve(target ?? path.join(".claude", "skills", "prime-ui-kit"));
/* Replace only an earlier copy of the skill or an empty folder, never someone's other files. */
if (
  fs.existsSync(dest) &&
  !fs.existsSync(path.join(dest, "SKILL.md")) &&
  fs.readdirSync(dest).length > 0
) {
  console.error(`prime-ui-kit: ${dest} exists and is not a skill folder; pick another directory.`);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(source, dest, { recursive: true });

const { version } = JSON.parse(
  fs.readFileSync(path.join(source, "..", "..", "package.json"), "utf8"),
);
console.log(
  `prime-ui-kit: skill ${version} copied to ${path.relative(process.cwd(), dest) || "."}`,
);
