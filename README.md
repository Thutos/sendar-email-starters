# Sendar application-email starters

Minimal Node, Python and Next.js examples for a booking confirmation.

[Integration guides](https://sendar.app/guides?utm_source=github&utm_medium=starter) · [Free domain checker](https://sendar.app/tools/domain-checker?utm_source=github&utm_medium=starter) · [Pricing](https://sendar.app/pricing)

## Preview without sending

Node 20+: `node send.mjs`. Python 3.10+: `python3 send.py`.
Both print a sample request by default. No packages, API key or network required.

## Send a controlled test

Create a Sendar account, verify your sending domain, and create an API key. Set `SENDAR_API_KEY`, `SENDAR_FROM` and `SENDAR_TO` in your server environment. Use a verified sender and a recipient you control. Set `SENDAR_SEND=1` only when you intend to send. Then run the example again.

Node supports `node --env-file=.env send.mjs`; Python reads exported environment variables. Never commit credentials or expose the key in browser code. A successful response means provider acceptance, not inbox delivery. Save the message ID. If a request times out, inspect the email log before retrying to avoid duplicate messages.

## Next.js

Copy `nextjs-page.tsx` into `app/sendar-demo/page.tsx` in an existing App Router project. Put the same variables in `.env.local` and run your normal development server. Visit `/sendar-demo` and use the button to send one message. Check the terminal and Sendar email log for the response.

The route and action are disabled outside development. This is not a public send endpoint. For production, send from an authenticated, authorised booking event and deduplicate business events. Never use NEXT_PUBLIC for a secret. The supplied date and reference are demo values; replace them with validated application data.

## Other workflows

Receipts should follow verified payment events. Password-reset tokens must be expiring and single-use, generated and validated by your application. Sendar transports the email; it does not issue reset tokens.

The Free plan includes 3,000 emails/month, capped at 100/day. Check current pricing and feature suitability before moving production traffic. Keep suppression and opt-out rules when migrating.

## Tests

`node --test test.mjs` tests preview, request mapping and failures with a mock transport. `python3 -m unittest test_python.py` checks the Python payload. Neither sends email.

## Agent discovery and recipes

The [public OpenAPI specification](https://sendar.app/openapi.json) and
[agent reference](https://sendar.app/docs/agent-reference.md) describe authentication,
limits, idempotency and expected failures. Pricing comes from the application's shared plan definitions.

Run `node recipes.mjs welcome` (or `booking`, `password-reset`, `invoice`, `migration`).
These recipes use a local mock by default. For an authorized live test set
`SENDAR_LIVE=1`, `SENDAR_API_KEY`, `SENDAR_FROM`, `SENDAR_TO` and a stable
`SENDAR_EVENT_ID` (16–128 allowed characters). Reset and invoice recipes also require
`SENDAR_RESET_URL` or `SENDAR_PAYMENT_URL`. Your application generates and validates
reset tokens. Recipes never retry automatically. Inspect message history after an
uncertain result; do not generate a new event key to force another send.
