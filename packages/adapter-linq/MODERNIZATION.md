# Adapter modernization: 0.1.0-forma.8

This adapter-only change starts from `main` at
`7f5285207b4a737680a1d9cad1968e9deaf35e86` (`0.1.0-forma.7`).
Example applications, Nitro, databases, provider configuration, and deployments are separate work.

## Pinned baseline

| Component                         | Version         |
| --------------------------------- | --------------- |
| Chat and shared adapter utilities | 4.40.0          |
| Linq SDK                          | 0.62.0          |
| Standard Webhooks                 | 1.1.1           |
| pnpm                              | 12.3.4          |
| TypeScript native compiler        | 7.0.2           |
| Vitest and V8 coverage            | 5.0.0           |
| Vite                              | 8.2.2           |
| Turbo                             | 2.10.12         |
| oxlint / oxfmt                    | 1.82.0 / 0.67.0 |
| Node types                        | 22.20.1         |

The supported runtime lines are Node 22.12+ and 24. The tested Chat minimum is 4.40.0;
older versions are outside the peer range. Runtime dependencies are exact pins.

The TypeScript build and test configs explicitly include Node types. The build retains ESM,
declarations, declaration maps, and JavaScript source maps. Package sources are included so map
references resolve in a clean consumer. The adapter tooling has no required legacy TypeScript
compiler-API consumer, so no TypeScript 6 alias is installed. `ChatWithThreads` remains necessary:
Chat 4.40.0 implements `thread()` but still omits it from `ChatInstance`.

pnpm 12 uses a multi-document lockfile that also records the package manager. The example app's
importer retains its existing dependency specifications and resolved versions. The adapter/tooling
install graph needs no dependency lifecycle scripts (`allowBuilds: {}`). New scripts remain
unreviewed and fail under pnpm's strict default. Release-age exceptions name only the requested
oxlint/oxfmt versions and their platform bindings; further exceptions require review.
`verifyDepsBeforeRun: error` prevents validation commands from installing dependencies implicitly.

## Contract changes

- Authenticated inbound `mentions[]` takes precedence over deprecated first-mention fields. An
  owner entry requires `is_me: true`, exact owner-handle equality, and a bounded non-empty UTF-16
  range with intact surrogate pairs. Multiple mentions and formatting are allowed inbound. Only
  omission of the modern field permits the deprecated singular fallback. Outbound remains singular.
- `contact_card.received` is one of the 46 canonical named events and receives raw-only dispatch.
  It belongs to a line, does not establish a chat, and adds no contact/media workflow. Unknown
  sticker/reaction and `zero_retention` facts remain lossless raw data.
- Standard Webhooks still performs signature verification. Version 1.1.1 rejects empty decoded
  secrets and returns undefined for an authenticated empty body. Explicit post-authentication JSON
  parsing preserves `invalid_json` for that body. Lossy UTF-8 input cannot authenticate through
  replacement characters. Trusted forwarding remains an explicit, exclusive authority.
- Tests call the production `compileLinqMessage()` path; the two internal test-only wrappers and
  permissive option parsing are removed. No public compiler export was removed.
- Chat 4.40.0 callback storage includes action/conversation scope and uses a seven-day TTL. The
  actual Chat integration assertion follows that runtime while continuing to verify Linq metadata
  preservation. This does not add interactive-card support to Linq.

## Evidence

Provider contracts were checked on 2026-09-07 against the
[Linq channel index](https://docs.linqapp.com/llms.txt), its
[iMessage index](https://docs.linqapp.com/channel/imessage/llms.txt), and
[canonical OpenAPI](https://cdn.linqapp.com/openapi/linq-api-v3.yaml).
Relevant provider pages are [mentions](https://docs.linqapp.com/channel/imessage/guides/messaging/mentions/),
[webhooks](https://docs.linqapp.com/channel/imessage/guides/webhooks/), and
[zero-day retention](https://docs.linqapp.com/channel/imessage/guides/platform/zero-day-retention/).
The contact-card schema and example are `ContactCardReceivedEvent` and
`contact_card.received.v2026-02-03` in OpenAPI.

Versions and runtime behavior were checked against the exact npm registry tarballs for
[Chat 4.40.0](https://registry.npmjs.org/chat/4.40.0),
[Linq SDK 0.62.0](https://registry.npmjs.org/@linqapp/sdk/0.62.0),
[Standard Webhooks 1.1.1](https://registry.npmjs.org/standardwebhooks/1.1.1), and
[TypeScript 7.0.2](https://registry.npmjs.org/typescript/7.0.2), including their shipped declarations,
runtime, and relevant bundled Chat docs. The Linq SDK now exposes `webhooks.unwrap()`; this does
not supersede the adapter's verification boundary. Linq's Chat integration page still describes
an older signature shape; the primary webhook guide and pinned Standard Webhooks implementation
are authoritative. pnpm policy behavior follows its [build settings](https://pnpm.io/settings/build).

## Local validation and candidate handoff

Run under both Node 22.12 and 24:

```bash
pnpm --filter @forma/linq-chat-sdk-adapter... install --frozen-lockfile
pnpm check:adapter
pnpm --filter @forma/linq-chat-sdk-adapter exec vitest run --coverage --coverage.include "src/**/*.ts"
```

Before handoff, commit the validated source, build from that revision, and pack once to a unique
local candidate directory. Record the exact package version, full source revision, absolute
archive path, and SHA256 in an adjacent verification manifest. Inspect exports, declarations,
map targets, and package contents. Install those exact bytes with Chat 4.40.0 in a clean consumer
and validate types and actual Chat webhook/post behavior on both runtime lines. The consumer
must use the packed package, not a workspace link. Keep tests for authentication, hostile input,
identity, mentions, callbacks/dedupe, errors, groups/polls, history, media, and native-client access.

Send the manifest and archive identity to the coordinating Locky task. Locky integrates those
exact bytes locally before any release; a changed archive requires fresh verification and a new
handoff. Provider/device/live behavior is not claimed by local checks.

## Publication preparation only

Publication requires separate owner approval after consumer feedback. The intended repository is
`formacity/linq-chat-sdk`, using an owner-controlled GitHub release asset rather than npm or an
upstream Linq release. For an owner-created release named `adapter-v0.1.0-forma.8`, the later upload
command is:

```bash
gh release upload adapter-v0.1.0-forma.8 "$VERIFIED_ABSOLUTE_TARBALL_PATH" \
  --repo formacity/linq-chat-sdk
```

This uploads the approved bytes to that existing release. It does not create the release, push or
merge code, publish npm packages, or deploy anything. Do not add `--clobber`: existing assets must
remain immutable. Recheck SHA256 against the handed-off manifest immediately before any approved
upload. The release must describe the candidate's exact source revision and verification; its
Git tag is chosen separately by the owner. No publication command is run during local preparation.
