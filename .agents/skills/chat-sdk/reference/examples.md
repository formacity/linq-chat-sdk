# Chat SDK examples and concepts

These are reference examples, not repository requirements. Resolve installed package paths
as described in [SKILL.md](../SKILL.md); shipped contracts take precedence.

## Quick start

```typescript
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";

const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
  },
  state: createRedisState(),
  dedupeTtlMs: 600_000,
});

bot.onNewMention(async (thread) => {
  await thread.subscribe();
  await thread.post("Hello! I'm listening to this thread.");
});

bot.onSubscribedMessage(async (thread, message) => {
  await thread.post(`You said: ${message.text}`);
});
```

## Core concepts

- **Chat** — main entry point; coordinates adapters, routing, locks, and state
- **Adapters** — platform-specific integrations for Slack, Teams, Google Chat, Discord, Telegram, GitHub, Linear, and WhatsApp
- **State adapters** — persistence for subscriptions, locks, dedupe, and thread state
- **Thread** — conversation context with `post()`, `stream()`, `subscribe()`, `setState()`, `startTyping()`
- **Message** — normalized content with `text`, `formatted`, attachments, author info, and platform `raw`
- **Channel** — container for threads and top-level posts

## Event handlers

| Handler                      | Trigger                                     |
| ---------------------------- | ------------------------------------------- |
| `onNewMention`               | Bot @-mentioned in an unsubscribed thread   |
| `onDirectMessage`            | New DM in an unsubscribed DM thread         |
| `onSubscribedMessage`        | Any message in a subscribed thread          |
| `onNewMessage(regex)`        | Regex match in an unsubscribed thread       |
| `onReaction(emojis?)`        | Emoji added or removed                      |
| `onAction(actionIds?)`       | Button clicks and select/radio interactions |
| `onModalSubmit(callbackId?)` | Modal form submitted                        |
| `onModalClose(callbackId?)`  | Modal dismissed/cancelled                   |
| `onSlashCommand(commands?)`  | Slash command invocation                    |
| `onAssistantThreadStarted`   | Slack assistant thread opened               |
| `onAssistantContextChanged`  | Slack assistant context changed             |
| `onAppHomeOpened`            | Slack App Home opened                       |
| `onMemberJoinedChannel`      | Slack member joined channel event           |

Consult the installed documentation for the handler being changed: `handling-events.mdx`,
`actions.mdx`, `modals.mdx`, `slash-commands.mdx`, or `direct-messages.mdx`.

## Streaming

Pass any `AsyncIterable<string>` to `thread.post()`. For AI SDK, prefer `result.fullStream` over `result.textStream` when available so step boundaries are preserved.

```typescript
import { ToolLoopAgent } from "ai";

// Use the application's configured AI SDK model.
const agent = new ToolLoopAgent({ model });

bot.onNewMention(async (thread, message) => {
  const result = await agent.stream({ prompt: message.text });
  await thread.post(result.fullStream);
});
```

Key details:

- `streamingUpdateIntervalMs` controls post+edit fallback cadence
- `fallbackStreamingPlaceholderText` defaults to `"..."`; set `null` to disable
- Structured `StreamChunk` support is Slack-only; other adapters ignore non-text chunks

## Cards and modals (JSX)

Set `jsxImportSource: "chat"` in `tsconfig.json`.

Card components:

- `Card`, `CardText`, `Section`, `Fields`, `Field`, `Button`, `CardLink`, `LinkButton`, `Actions`, `Select`, `SelectOption`, `RadioSelect`, `Table`, `Image`, `Divider`

Modal components:

- `Modal`, `TextInput`, `Select`, `SelectOption`, `RadioSelect`

```tsx
await thread.post(
  <Card title="Order #1234">
    <CardText>Your order has been received.</CardText>
    <Actions>
      <Button id="approve" style="primary">
        Approve
      </Button>
      <Button id="reject" style="danger">
        Reject
      </Button>
    </Actions>
  </Card>,
);
```

## Adapter inventory

See [chat-sdk.dev/adapters](https://chat-sdk.dev/adapters) for the current list of official, vendor-official, and community adapters, including package names and authors. For the exact factory function and config types of an installed adapter, inspect its `dist/index.d.ts` in `node_modules`.

## Building a custom adapter

Consult the relevant published docs:

- `node_modules/chat/docs/contributing/building.mdx`
- `node_modules/chat/docs/contributing/testing.mdx`
- `node_modules/chat/docs/contributing/publishing.mdx`

Also inspect:

- `node_modules/chat/dist/index.d.ts` — `Adapter` and related interfaces
- `node_modules/@chat-adapter/shared/dist/index.d.ts` — shared errors and utilities
- Installed official adapter `dist/index.d.ts` files — reference implementations for config and APIs

A custom adapter needs request verification, webhook parsing, message/thread/channel operations, ID encoding/decoding, and a format converter. Use `BaseFormatConverter` from `chat` and shared utilities from `@chat-adapter/shared`.

## Webhook setup

Each registered adapter exposes `bot.webhooks.<name>`. Wire it to a fetch-compatible framework route
according to the bundled docs and types present in the resolved package version.
