# afa-platform
AFA Platform for UP Diliman Office of Field Activities

## Running it locally

1. Clone the repo and install dependencies.
   ```bash
   git clone https://github.com/<org-or-user>/afa-platform.git
   cd afa-platform
   npm install
   ```

2. Copy `.env.example` to `.env.local`.
   ```bash
   cp .env.example .env.local
   ```
   Then fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. These aren't committed to the repo (`.env.local` is gitignored), so ask Shine for the values directly instead of looking for them on GitHub.

3. Start the dev server.
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. To sign in with Google (`@up.edu.ph` accounts only), your email needs to be added as a test user on the Supabase project's Google OAuth consent screen first, ask Shine to add you if sign-in doesn't work.

