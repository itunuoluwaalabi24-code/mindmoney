# MINDMONEY — Stage 1 starter

A mobile-responsive web application foundation for an ADHD-first financial control SaaS.

## Included

- Next.js App Router + TypeScript
- Responsive dark fintech dashboard
- Demo transaction list and income-entry modal
- Illustrative income allocation preview
- Supabase browser-client helper
- Initial Supabase schema with row-level security
- Environment-variable template

## Important limitations

This is a Stage 1 starter, not a production financial application.

- Dashboard figures are demonstration data.
- The Add income action writes to local React state only.
- Authentication is not yet wired.
- No bank account is connected.
- No transfers or payments are initiated.
- The sample allocation percentages are illustrative, not financial advice.
- Review the SQL and test it in a separate development Supabase project before using it.

## Run locally

1. Install Node.js 20.9 or later.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase URL and publishable key when a project is ready.
5. Start the app: `npm run dev`

The dashboard can be previewed without Supabase because it currently uses demo data.

## Suggested next implementation milestone

Wire Supabase authentication and onboarding, then replace the hard-coded dashboard figures with user-owned database records. Add server-side financial calculations before implementing income allocation.
