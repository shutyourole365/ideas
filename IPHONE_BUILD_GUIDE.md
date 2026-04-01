# Build & Deploy from iPhone Guide

Trigger builds and deployments without a terminal — everything runs in the cloud!

## 🍎 iPhone Setup (One-time)

### 1. Create GitHub Account (if needed)
- Go to https://github.com/signup on your iPhone
- Create account or sign in

### 2. Create Expo Account (if needed)
- Go to https://expo.dev on your iPhone
- Create account or sign in
- Go to Settings → Tokens
- Create a new token (save it)

### 3. Set GitHub Secrets
On your iPhone:
1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:

```
EXPO_TOKEN = <your-expo-token-from-step-2>
VERCEL_TOKEN = <your-vercel-token>
VERCEL_ORG_ID = <your-vercel-org-id>
VERCEL_PROJECT_ID = <your-vercel-project-id>
```

**How to get Vercel tokens:**
- Go to https://vercel.com/account/tokens on iPhone
- Create new token (copy it)
- Go to Project Settings → Environment Variables
- Copy Org ID and Project ID

## 🚀 Build Mobile App from iPhone

1. **Go to GitHub repo** → Actions tab
2. **Select "Mobile App Build & Submit"** workflow
3. **Click "Run workflow"**
4. **Choose:**
   - Platform: iOS / Android / Both
   - Submit to stores: Yes/No
5. **Click green "Run workflow" button**
6. **Monitor in real-time** (refresh to see progress)

Takes ~15-30 minutes depending on platform.

## 🌐 Deploy Web App from iPhone

**Automatic (on push):**
- Just push code to main branch
- Workflow auto-triggers
- Monitor in Actions tab

**Manual trigger:**
1. Go to GitHub repo → Actions tab
2. Select "Deploy Web App to Vercel"
3. Click "Run workflow" → green button
4. Takes ~5 minutes

## 📊 Monitor Builds on iPhone

### GitHub Actions Dashboard
- https://github.com/yourusername/ideas/actions
- See all workflow runs
- Click to view logs
- Get status notifications

### EAS Dashboard
- https://expo.dev/projects
- View all builds in real-time
- Download built apps
- Submit to stores

### Vercel Dashboard
- https://vercel.com/dashboard
- View deployments
- See analytics
- Control production

## 🔔 Get Notifications

### GitHub Notifications
- Settings → Notifications
- Enable "Actions" alerts
- Get push notifications for build status

### Email Notifications
- Each workflow sends completion email
- Check GitHub email settings

## 💡 Pro Tips for iPhone

### 1. Add to Home Screen
- Safari → Share → Add to Home Screen
- Adds shortcuts for:
  - GitHub Actions: https://github.com/yourusername/ideas/actions
  - EAS Dashboard: https://expo.dev/projects
  - Vercel Dashboard: https://vercel.com

### 2. Use GitHub Mobile App
- Download "GitHub" app from App Store
- Login with your account
- Tap Actions to trigger builds
- Get notifications

### 3. Quick Commands via Shortcuts
Create an iPhone Shortcut:
1. Open Shortcuts app
2. Create new shortcut
3. Add "Open URL" action:
   ```
   https://github.com/yourusername/ideas/actions/workflows/mobile-build.yml
   ```
4. Tap to open workflow instantly

## 🔧 Common Tasks

### Build iOS Only
1. Actions → Mobile App Build & Submit
2. Platform: `ios`
3. Submit: `false` (for preview)
4. Run

### Build Android Only
1. Actions → Mobile App Build & Submit
2. Platform: `android`
3. Submit: `false` (for preview)
4. Run

### Build & Submit to Stores
1. Actions → Mobile App Build & Submit
2. Platform: `all`
3. Submit: `true`
4. Run (requires Apple/Google accounts configured)

### Deploy Web App
1. Push code to main, OR
2. Actions → Deploy Web App to Vercel
3. Run workflow
4. Done!

## ❓ Troubleshooting

### Build Failed
1. Check GitHub Actions logs
2. Click failed workflow → see error
3. Common issues:
   - Missing EXPO_TOKEN → Add to secrets
   - Out of disk → Manually restart
   - Rate limited → Wait 1 hour

### Deploy Failed
1. Check Vercel logs: https://vercel.com/deployments
2. Common issues:
   - Build failed → Check GitHub logs
   - Missing env vars → Add to Vercel settings
   - Wrong project ID → Verify secrets

### No Notifications
1. GitHub Settings → Notifications
2. Enable "Actions"
3. Check device notifications enabled
4. Restart GitHub app

## 🎯 Workflow Summary

| Task | Method | Time | Location |
|------|--------|------|----------|
| Build iOS | GitHub Actions | 20 min | https://github.com/.../actions |
| Build Android | GitHub Actions | 25 min | https://github.com/.../actions |
| Build Both | GitHub Actions | 30 min | https://github.com/.../actions |
| Deploy Web | GitHub Actions (auto) | 5 min | https://vercel.com |
| Submit to Stores | EAS Dashboard | Varies | https://expo.dev |
| Monitor Builds | EAS Dashboard | Real-time | https://expo.dev |

## 🔐 Security Notes

✅ Never share secrets
✅ Tokens are encrypted on GitHub
✅ Only visible to authorized users
✅ Rotate tokens regularly
✅ Monitor usage in dashboards

## 🚀 Quick Start (iPhone)

```
1. Save Expo token to GitHub Secrets
2. Go to GitHub Actions
3. Click "Run workflow"
4. Watch it build in the cloud ☁️
5. Download app from EAS or submit to stores
```

No terminal needed! All cloud-based. 🎉

---

**Need more help?** See:
- MOBILE_BUILD_SUMMARY.md - Technical details
- DEPLOYMENT.md - Web app deployment
- mobile/BUILD_GUIDE.md - Advanced build options
