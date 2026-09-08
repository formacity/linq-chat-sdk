# Adapter maintenance and release verification

Consumer behavior and compatibility live in [README.md](README.md), capability status and provider
evidence in [FEATURE_PARITY.md](FEATURE_PARITY.md), and application boundaries in the repository
[scope](../../scope.md). Exact runtime, peer, and development versions are owned by the
[adapter manifest](package.json), [root manifest](../../package.json), and
[lockfile](../../pnpm-lock.yaml); do not maintain a second version inventory here.

## Toolchain constraints

The TypeScript build and test configs explicitly include Node types. The build retains ESM,
declarations, declaration maps, and JavaScript source maps. Package sources are included so map
references resolve in a clean consumer. The adapter tooling has no required legacy TypeScript
compiler-API consumer, so no legacy compiler alias is installed. `ChatWithThreads` remains
necessary while the installed Chat runtime implements `thread()` but omits it from `ChatInstance`.
Recheck both declarations and runtime before removing that bridge.

pnpm uses a multi-document lockfile that also records the package manager. Changes to shared
tooling or adapter interfaces must retain the example application’s CI coverage; expand example
maintenance only within the authorized scope. Lifecycle scripts and release-age exceptions require review in
[pnpm-workspace.yaml](../../pnpm-workspace.yaml). `verifyDepsBeforeRun: error` prevents validation
commands from installing dependencies implicitly.

The SDK's `webhooks.unwrap()` does not supersede the adapter's exact-byte verification boundary.
When provider guides disagree, reconcile the primary webhook guide, canonical OpenAPI, and pinned
implementation. Inspect shipped SDK/runtime declarations as well as documentation before changing
contracts; an index summary is not evidence of pinned-package support.

## Local validation and candidate verification

Run on both runtime lines in the [CI matrix](../../.github/workflows/ci.yml):

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm --filter @forma/linq-chat-sdk-adapter exec vitest run --coverage --coverage.include "src/**/*.ts"
```

For scoped adapter development, use the filtered install and `pnpm check:adapter` documented in the
[root README](../../README.md). This does not replace full-workspace CI coverage.

Before release, commit the validated source, build from that revision, and pack once to a unique
local candidate directory. Record the exact package version, full source revision, absolute
archive path, and SHA256 in an adjacent verification manifest. Inspect exports, declarations,
map targets, and package contents. Install those exact bytes with the minimum supported Chat peer
in a clean consumer and validate types and actual Chat webhook/post behavior on both runtime lines.
The consumer must use the packed package, not a workspace link. Keep coverage for authentication,
hostile input, identity, mentions, callbacks/dedupe, errors, groups/polls, history, media, and
native-client access.

Consumer applications must verify the same archive bytes before release; any changed archive
requires fresh verification and a new manifest. Provider/device/live behavior is not established
by local checks.

## Publication

Publication requires separate owner approval after consumer verification. The repository is
`formacity/linq-chat-sdk`, using an owner-controlled GitHub release asset rather than npm or an
upstream Linq release. Existing adapter tags use `adapter-linq-v<package-version>` (for example,
`adapter-linq-v0.1.0-forma.7`). Use the owner-approved tag of the existing release:

```bash
gh release upload "$APPROVED_RELEASE_TAG" "$VERIFIED_ABSOLUTE_TARBALL_PATH" \
  --repo formacity/linq-chat-sdk
```

The release tag must resolve to the candidate's recorded source revision. This command uploads the
approved bytes to an existing release; creating the release/tag, pushing, merging, npm publication,
and deployment require their own authority. Do not add `--clobber`: existing assets must remain
immutable. Recheck SHA256 against the manifest immediately before an approved upload. The release
must identify the exact source revision and verification. No publication command is part of local
preparation.
