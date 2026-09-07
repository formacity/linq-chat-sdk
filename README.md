# linq-chat-sdk

A [Linq](https://linqapp.com) adapter for [Chat SDK](https://www.npmjs.com/package/chat). It lets
Chat SDK applications receive and send iMessage, RCS, and SMS messages through an existing Linq
chat while retaining access to Linq-specific capabilities where the standard interface has no
faithful equivalent, including native mentions and conversation-scoped polls.

## Repository

- [`packages/adapter-linq`](packages/adapter-linq) contains the Forma-maintained adapter.
- [`apps/api`](apps/api) is an example Nitro application using Linq alongside other adapters.

`@forma/linq-chat-sdk-adapter` is a private workspace package for this fork. Linq's published
package remains `@linqapp/chat-sdk-adapter`; this repository does not publish under Linq's package
identity.

## Development

```bash
pnpm --filter @forma/linq-chat-sdk-adapter... install --frozen-lockfile
pnpm check:adapter
```

`pnpm check:adapter` runs the canonical webhook event-name drift check, adapter lint, formatting,
tests, TypeScript contracts, and build. CI runs this adapter-only check on Node.js 22.12 and 24.
The example application is maintained separately and is outside this validation target.

The adapter pins Linq SDK `0.62.0`, Chat/shared `4.40.0`, and `standardwebhooks@1.1.1`.
Development uses pnpm `12.3.4`, TypeScript `7.0.2`, and Vitest `5.0.0` with Vite `8.2.2`.
The SDK now exposes `webhooks.unwrap()`; the adapter retains its verified boundary for exact bytes,
explicit trusted forwarding, stable errors, and lossless future events. See the adapter
[modernization notes](packages/adapter-linq/MODERNIZATION.md) for migration and local release checks.

## Maintenance

`main` is Forma's development branch. `upstream/main` is a read-only source for reviewed Linq
updates. Do not rewrite published history or rebuild existing release tags.

Originally created by [Fardeem Munir](https://github.com/fardeem) and developed by the
[Linq](https://linqapp.com) team. Licensed under [Apache-2.0](LICENSE).
