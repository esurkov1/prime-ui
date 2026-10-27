#!/bin/sh
# `bun run verify` as CI runs it: Linux, the Bun of `packageManager`, two CPUs (a GitHub runner),
# a clean install from the lockfile, on a copy of the working tree (uncommitted changes included).
# A check that passes here passes in CI; timing-sensitive tests fail here the way they fail there.
set -eu
cd "$(dirname "$0")/.."
BUN_VERSION=$(sed -n 's/.*"packageManager": "bun@\([^"]*\)".*/\1/p' package.json)
exec docker run --rm --cpus=2 -v "$PWD":/src:ro "oven/bun:$BUN_VERSION" sh -c '
  set -e
  apt-get update -qq >/dev/null && apt-get install -y -qq git >/dev/null
  git config --global --add safe.directory "*"
  git clone -q /src /w
  cd /src
  { git diff HEAD --name-only --diff-filter=d -z; git ls-files -z --others --exclude-standard; } |
    xargs -0 -r cp --parents -t /w
  git diff HEAD --name-only --diff-filter=D -z | (cd /w && xargs -0 -r rm -f)
  cd /w
  bun install --frozen-lockfile
  bun run verify
'
