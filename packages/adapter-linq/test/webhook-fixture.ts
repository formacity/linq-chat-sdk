import { createHmac } from "node:crypto";

export const SIGNING_KEY = "test_linq_webhook_secret";
export const SIGNING_SECRET = `whsec_${Buffer.from(SIGNING_KEY).toString("base64")}`;

type HeaderOverrides = Record<string, string> & { signature?: string };

export function createStandardRequest(payload: unknown, overrides: HeaderOverrides = {}): Request {
  return createSignedBody(JSON.stringify(payload), overrides);
}

/** Sign the actual bytes, independently of the production verifier. */
export function createSignedBody(body: string | Buffer, overrides: HeaderOverrides = {}): Request {
  const timestamp = overrides["webhook-timestamp"] ?? Math.floor(Date.now() / 1000).toString();
  const webhookId = overrides["webhook-id"] ?? "webhook-test-id";
  const signature =
    overrides.signature ??
    `v1,${createHmac("sha256", SIGNING_KEY)
      .update(`${webhookId}.${timestamp}.`)
      .update(body)
      .digest("base64")}`;
  const headers = new Headers({
    "content-type": "application/json",
    "webhook-id": webhookId,
    "webhook-signature": signature,
    "webhook-timestamp": timestamp,
  });
  for (const [name, value] of Object.entries(overrides)) {
    if (name !== "signature") headers.set(name, value);
  }
  return new Request("https://example.com/webhooks/linq", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : new Uint8Array(body),
  });
}
