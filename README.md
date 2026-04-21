# ResumeOnce

ResumeOnce is a desktop-first resume builder with ATS-safe templates, one-time export pricing, and lifetime hosted resume pages for upgraded users.

## What v1 ships

- Free account creation and drafting
- Resume editing with live preview
- Download view export plus LaTeX export
- One-time unlock for a single resume or lifetime access for all resumes
- Hosted public resume pages for lifetime users
- Desktop-only editor experience

## Local setup

1. Copy `.env.example` to `.env`.
2. Fill in Clerk, Razorpay, database, and optional Sentry values.
3. Install dependencies with `npm install`.
4. Run `npm run dev`.

## Required production environment variables

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_ROOT_DOMAIN`

Optional production variables:

- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

Production safety rules:

- `DEV_BYPASS_AUTH` must remain `false`
- `NEXT_PUBLIC_APP_URL` must use `https`
- `NEXT_PUBLIC_APP_URL` should be `https://resumeonce.co`
- `NEXT_PUBLIC_ROOT_DOMAIN` should be `resumeonce.co`
- `RAZORPAY_WEBHOOK_SECRET` must be real and not `REPLACE_ME`

## Payments and webhooks

- Client checkout starts at `POST /api/razorpay/create-order`
- Checkout success is confirmed at `POST /api/razorpay/verify-payment`
- Webhooks remain enabled at `POST /api/razorpay/webhook` as a backup finalization path
- Both verification paths finalize through the same server-side payment helper

Configure the Razorpay webhook to point to:

`https://resumeonce.co/api/razorpay/webhook`

Use the same webhook secret in Razorpay and `RAZORPAY_WEBHOOK_SECRET`.

## Publishing and domains

- Public resumes are served from `/r/[slug]`
- With `NEXT_PUBLIC_ROOT_DOMAIN=resumeonce.co`, `jane.resumeonce.co` rewrites to `/r/jane`
- Lifetime access is required before a resume can be published
- Add both `resumeonce.co` and wildcard `*.resumeonce.co` to the Vercel project domains

## Vercel launch checklist

1. Add `resumeonce.co` and `*.resumeonce.co` in Vercel.
2. Set the production env vars from `.env.example` with live Clerk and Razorpay keys.
3. Run `npx prisma migrate deploy` against the production database.
4. Configure the Razorpay webhook to `https://resumeonce.co/api/razorpay/webhook`.
5. Deploy from the branch that contains these production-readiness changes.

## Commands

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run test`

## Manual QA before launch

1. Sign up and sign in with Clerk.
2. Create a resume and confirm autosave/title save work.
3. Verify the editor shows the desktop-only notice on a narrow viewport.
4. Start a single unlock checkout and confirm `verify-payment` unlocks the resume.
5. Repeat for the lifetime plan and verify hosted publishing becomes available.
6. Open the `Download` flow and LaTeX export on an unlocked resume.
7. Publish and unpublish a lifetime resume and verify the public page updates.
8. Confirm Sentry DSNs are set and production builds succeed.
