This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Import from GitHub (recommended)

This repo: [github.com/borisj74/BillingPlatform](https://github.com/borisj74/BillingPlatform)

1. Sign in at [vercel.com](https://vercel.com) (use **Continue with GitHub** so Vercel can see the repo).
2. **Add New… → Project** → **Import** `borisj74/BillingPlatform`.
3. Leave defaults: **Framework Preset: Next.js**, **Root Directory** `.`, **Build Command** `next build`, **Output** (default).
4. No environment variables are required for the current mock UI.
5. Click **Deploy**. Production URL will be shown when the build finishes; every push to `main` will redeploy.

Direct import (when logged in): [Import BillingPlatform on Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fborisj74%2FBillingPlatform).

### CLI (optional)

```bash
npm i -g vercel   # or: npx vercel
vercel login
vercel link       # link to the Vercel project once it exists
vercel --prod     # production deploy
```

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
