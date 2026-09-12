# Linq provider operations

Provider facts were last reverified on **2026-09-07**. Recheck the relevant official source when
changing a versioned contract; this snapshot does not override installed SDK support.

## API and subscription facts

- API base URL: `https://api.linqapp.com/api/partner`; V3 resources live below `/v3`.
- Authentication: `Authorization: Bearer <token>`; prefer the installed official client.
- Create subscriptions with `POST /v3/webhook-subscriptions`.
- Each `target_url` must be unique per account.
- The create response reveals `signing_secret` once; persist it securely immediately.
- Pin the payload with `?version=2026-02-03` while that remains the current documented version.

## Native-only message parts

The installed SDK also includes the `app_clip` message part for a standalone Linq checkout URL. It is
iMessage-only and does not downgrade to SMS or RCS. Keep outbound use on the typed native client;
the adapter normalizes an inbound App Clip URL as ordinary text/link while retaining the full raw
part for title, description, and image metadata.

For signing, delivery, event envelopes, mentions, and application ingress, use
[webhooks.md](webhooks.md). Account/admin operations remain on the native client as specified in
[scope.md](../../../../scope.md).
