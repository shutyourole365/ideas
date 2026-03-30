# Deployment Guide

## Deploy to Vercel

### Option 1: CLI (Recommended)
```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

### Option 2: Git Integration
1. Push to GitHub: `git push origin main`
2. Go to https://vercel.com/new
3. Import this repository
4. Vercel auto-deploys on push

### Option 3: Manual via Dashboard
1. Visit https://vercel.com/dashboard
2. Click "New Project"
3. Select this GitHub repo
4. Click "Deploy"

---

## Environment Variables

Set these in Vercel dashboard under Settings → Environment Variables:

```
NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
NEXT_PUBLIC_VERCEL_TOKEN=your_token_here
# ... add other platform tokens as needed
```

---

## Running Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Production Checklist

- [ ] Add all platform API tokens
- [ ] Test all 21 integrations
- [ ] Enable persistent storage if needed (Settings)
- [ ] Test search/filtering
- [ ] Verify responsive design on mobile

---

## Architecture

- **Frontend**: Next.js 16 + React + TypeScript + Tailwind CSS
- **State Management**: Zustand
- **API Routes**: Node.js serverless functions
- **Integrations**: 21 platform SDKs/APIs
- **Storage**: Browser localStorage (opt-in)

---

## Adding New Platforms

1. Create client in `lib/integrations/[platform].ts`
2. Create API route in `app/api/[platform]/route.ts`
3. Create component in `components/[Platform]Dashboard.tsx`
4. Add to PLATFORMS array in `app/page.tsx`
5. Add token fields to `lib/store.ts`
6. Update `components/TokenSettings.tsx`
