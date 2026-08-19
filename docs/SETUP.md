Setup & Deployment Checklist

1. Install dependencies
   - npm ci

2. Environment
   - Copy .env.example to .env and fill values:
     - DATABASE_URL (Postgres connection)
     - NEXTAUTH_SECRET
     - NEXTAUTH_URL / NEXT_PUBLIC_APP_URL
     - OPENAI_API_KEY (optional, for real generation)
     - STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET (optional)
     - SENDGRID_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS (optional, for email)
     - REDIS_URL (optional for production rate-limiting)
     - ADMIN_SEED_EMAIL (email to create admin via seed script)

3. Prisma & DB
   - npx prisma generate
   - npx prisma migrate dev --name init
   - npm run seed

4. Local run
   - npm run dev
   - Open http://localhost:3000

5. Testing important flows
   - POST /api/generate {"prompt":"hello"} — uses OPENAI_API_KEY when set, else local fallback
   - POST /api/website to save site; GET /api/website?path=demo to preview
   - POST /api/team to create an invite (persists to DB if DATABASE_URL provided)
   - POST /api/stripe to create checkout session (stub when STRIPE key absent)
   - Webhooks: configure Stripe CLI or ngrok and set STRIPE_WEBHOOK_SECRET to verify signatures

6. Deployment
   - Set repository secrets in Vercel/GitHub Actions: DATABASE_URL, NEXTAUTH_SECRET, OPENAI_API_KEY, STRIPE keys, SENDGRID_API_KEY, REDIS_URL, ADMIN_SEED_EMAIL
   - Push branch and create PR; CI will run typecheck and build

7. Notes / Remaining choices
   - Replace Credentials auth provider with verified sign-in (email/OAuth) for production
   - Consider replacing file-store (data/) with DB-backed models for Sites/Team (already supported when DATABASE_URL present)
   - Verify CSP and security middleware in middleware.ts when deploying to production

If you want, I can prepare: a) SQL migration SQL to inspect before applying, b) PR description template. Which next? (reply: migration, prdesc, or both)