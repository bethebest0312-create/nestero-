PR: feat(foundation): project foundation, DB models, API stubs, UI polish

Summary

This PR adds a full project foundation for Nestero: Next.js + TypeScript app router, Tailwind + SCSS theme, Prisma schema updates, safe local API stubs and DB-backed endpoints, a polished neon UI, and developer docs.

Key changes

- Config & tooling
  - package.json: scripts and dev deps (sass)
  - tsconfig, next.config, tailwind/postcss (existing)
  - docs/SETUP.md and docs/MIGRATION.md (runbook)

- Prisma
  - prisma/schema.prisma: added Site and TeamInvite models
  - prisma/seed.js: seed admin + demo site and team invite (safe, wrapped in try/catch)

- Server libs
  - src/lib/prisma.ts, apikeys, stripe, openai client, mail helper, fsStore helper

- APIs
  - src/app/api/generate (OpenAI + local fallback)
  - src/app/api/content, website, team (DB-backed when DATABASE_URL set, else file-store)
  - src/app/api/stripe (checkout helper + safe stub)
  - src/app/api/webhooks (Stripe signature verification + file-store persistence)
  - src/app/api/free (api keys + generate) and auth (NextAuth scaffold)

- UI
  - SCSS theme: src/app/globals.scss (neon vibe, animations)
  - Polished landing page and updated dashboard layout
  - Dashboard pages: AI Studio, Sites list
  - Website editor page (save/edit raw HTML + iframe preview)

- Local-only safe behavior
  - Stubs and file-store used when external secrets (OPENAI_API_KEY, STRIPE keys) or DATABASE_URL are missing so the app is safe to run locally without leaking secrets or performing paid calls.

How to test locally

1. npm ci
2. cp .env.example .env and set DATABASE_URL and NEXTAUTH_SECRET (others optional for real integrations)
3. npx prisma generate
4. npx prisma migrate dev --name init
5. npm run seed
6. npm run dev

Files to review in this PR
- prisma/schema.prisma
- prisma/seed.js
- src/lib/openaiClient.ts
- src/lib/stripe.ts
- src/lib/fsStore.ts
- src/app/api/**/* (generate, website, team, stripe, webhooks)
- src/app/globals.scss, src/app/layout.tsx, src/app/page.tsx
- src/app/dashboard/* and src/app/website/editor/*
- docs/SETUP.md, docs/MIGRATION.md, docs/PR_DESCRIPTION.md

Remaining choices & notes (reviewers should note)
- Credentials provider is used for rapid dev. Replace with secure email/OAuth for production.
- File-store is a fallback — prefer DB-backed Sites/Team when DATABASE_URL is set. Migrations are required locally.
- Stripe and OpenAI integrations are implemented with cautious fallbacks; to enable real calls set OPENAI_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET and SENDGRID_API_KEY/SMTP.

I can:
- Provide the generated SQL from a local `prisma migrate dev --create-only` run for review (paste it here)
- Replace the Credentials provider with email-based verification and add OAuth provider wiring
- Harden middleware/CSP for production

Approve & merge once CI typecheck/build passes and you have set required secrets in deployment environment.
