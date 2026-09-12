---
name: chat-sdk
description: Implement or debug Chat SDK bot routing, message APIs, or custom adapter/state contracts in the `chat` npm package.
---

# Chat SDK

Resolve `chat` from the workspace package being changed; pnpm may not expose it at the repository
root. Inspect its `package.json`, shipped `dist/index.d.ts`, and relevant runtime implementation.
Installed contracts take precedence over these examples. A missing bundled document does not
mean the package is absent.

## Find the relevant contract

Paths below are relative to the resolved package root. Read only those relevant to the task and
present in that version; use official [Chat SDK docs](https://chat-sdk.dev/docs) when bundled
material is absent.

| Task                             | Shipped sources                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Setup and lifecycle              | `docs/getting-started.mdx`, `docs/usage.mdx`, `docs/api/chat.mdx`                                                              |
| Routing and DMs                  | `docs/handling-events.mdx`, `docs/direct-messages.mdx`                                                                         |
| Threads, messages, posting       | `docs/threads-messages-channels.mdx`, `docs/posting-messages.mdx`, `docs/api/thread.mdx`, `docs/api/message.mdx`               |
| Streaming or attachments         | `docs/streaming.mdx` or `docs/files.mdx`                                                                                       |
| Cards, actions, modals, commands | The matching `docs/cards.mdx`, `docs/actions.mdx`, `docs/modals.mdx`, `docs/api/modals.mdx`, or `docs/slash-commands.mdx`      |
| Adapter implementation           | `docs/contributing/building.mdx`, `dist/index.d.ts`; installed `@chat-adapter/shared/dist/index.d.ts`                          |
| Adapter tests or release         | `docs/contributing/testing.mdx` or `docs/contributing/publishing.mdx`; repository maintenance policy owns release requirements |
| State adapters                   | `docs/state-adapters.mdx`                                                                                                      |
| Platform capability comparison   | `docs/adapters.mdx` and installed adapter declarations                                                                         |

For JSX, inspect `dist/jsx-runtime.d.ts`. For an adapter or state package, resolve that package's
own exports and runtime. Capability on one platform does not establish Linq support; use the
repository capability matrix for Linq.

[Examples and concepts](reference/examples.md) cover bot setup, handlers, streaming, cards,
custom adapters, and webhook wiring. Load them when an example helps. Use `integrating-linq`
for Linq provider schemas and authentication; it does not replace Chat SDK interface contracts.
