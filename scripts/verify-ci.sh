#!/bin/sh
# `bun run verify` as CI runs it: Linux, the Bun of `packageManager`, four CPUs (a GitHub runner of a public repo),
# a clean install from the lockfile, on a copy of the working tree committed as CI sees a push.
# A check that passes here passes in CI; timing-sensitive tests fail here the way they fail there.
set -eu
cd "$(dirname "$0")/.."
BUN_VERSION=$(sed -n 's/.*"packageManager": "bun@\([^"]*\)".*/\1/p' package.json)
# The image with git is built once per Bun version and reused: no package download per run.
IMAGE="prime-ui-kit-verify:bun-$BUN_VERSION"
if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
  printf 'FROM oven/bun:%s\nRUN apt-get update -qq && apt-get install -y -qq --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*\n' "$BUN_VERSION" |
    docker build -q -t "$IMAGE" - >/dev/null
fi
exec docker run --rm --cpus=4 -v "$PWD":/src:ro "$IMAGE" sh -c '
  set -e
  git config --global --add safe.directory "*"
  git clone -q /src /w
  cd /src
  { git diff HEAD --name-only --diff-filter=d -z; git ls-files -z --others --exclude-standard; } |
    xargs -0 -r cp --parents -t /w
  git diff HEAD --name-only --diff-filter=D -z | (cd /w && xargs -0 -r rm -f)
  cd /w
  # CI checks a commit: the copied changes become one, so `git diff` checks see a clean tree.
  git add -A && git -c user.name=verify-ci -c user.email=verify-ci@localhost commit -qm wip --allow-empty
  bun install --frozen-lockfile
  bun run verify
'
