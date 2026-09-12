---
name: integrating-linq
description: Implement or debug Linq provider operations, webhook authentication/event parsing, or subscription setup. Use for Linq-specific contracts, not generic Chat SDK behavior.
---

# Integrating Linq

## Contract authority

Use official Linq documentation/OpenAPI for provider contracts, installed `@linqapp/sdk` types and
runtime for callable support, and the repository scope/README for adapter ownership and released
compatibility. These answer different questions: new provider capability does not automatically
expand adapter scope or exist in the pinned SDK. Record discrepancies instead of inventing
behavior. Skill snapshots and examples are secondary to those sources.

For a changed provider contract, follow the relevant current source from the
[Linq index](https://docs.linqapp.com/llms.txt) and
[iMessage index](https://docs.linqapp.com/channel/imessage/llms.txt). The canonical schema is
[Linq V3 OpenAPI](https://cdn.linqapp.com/openapi/linq-api-v3.yaml).

## Task routing

- Authentication, delivery, event parsing, or ingress: [webhook reference](reference/webhooks.md).
  Adapter entry points are `src/verification.ts`, `src/webhook.ts`, and `src/events.ts` under
  `packages/adapter-linq`; consult corresponding tests/fixtures for the changed contract.
- Sending or native operations: [provider reference](reference/provider.md), the official
  [messaging guide](https://docs.linqapp.com/channel/imessage/guides/messaging/), and installed SDK
  declarations. Adapter translation starts in `src/adapter.ts` and `src/conversation.ts`.
- Application subscription setup or storage: the setup/storage section in the webhook reference
  points to `apps/api` consumers. Example maintenance is separate from adapter work and must be
  within the requested scope.
- SDK upgrades: the official [SDK guide](https://docs.linqapp.com/channel/imessage/getting-started/sdks/),
  installed types/runtime, and the repository [maintenance guide](../../../packages/adapter-linq/MODERNIZATION.md).
  Exact dependency/toolchain versions belong to manifests and the lockfile.

Use the `chat-sdk` skill when the task also changes Chat SDK interfaces or dispatch behavior.
The [adapter instructions](../../../packages/adapter-linq/AGENTS.md) own implementation invariants;
[FEATURE_PARITY.md](../../../packages/adapter-linq/FEATURE_PARITY.md) owns status and evidence.
Load relevant sections, not every reference above.
