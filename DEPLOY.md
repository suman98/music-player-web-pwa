# Music Player PWA - Vercel Deployment Guide

This project is configured to deploy pre-built dist files to Vercel.

## Local Build & Deploy Process

### Step 1: Build Locally
```bash
npm install
npm run build
```

This will create/update the `dist/` folder with your production build.

### Step 2: Commit and Push
```bash
git add .
git commit -m "build: update production build"
git push origin main
```

The `dist/` folder is tracked in git, so it will be pushed to GitHub.

### Step 3: Vercel Deployment
Vercel is configured to:
- Skip the build step (no buildCommand)
- Deploy the pre-built `dist/` folder directly
- Only install `node_modules` if needed (optional)

When you push to GitHub, Vercel will automatically:
1. Pull your changes including the `dist/` folder
2. Serve the static files from `dist/`
3. Deploy in seconds (no build time!)

## Benefits
- ✅ Faster deployments (no build on Vercel)
- ✅ Full control over build process
- ✅ Predictable build results
- ✅ Can test locally before deploying

## Troubleshooting

### If dist folder isn't showing in GitHub:
The `.gitignore` has been updated to track the `dist/` folder. Run:
```bash
git add dist/
git commit -m "add: dist folder for Vercel deployment"
git push origin main
```

### To force rebuild:
```bash
rm -rf dist
npm run build
git add dist/
git commit -m "rebuild: force rebuild dist"
git push origin main
```

## Files Modified for This Setup
- `vercel.json` - Configured to skip build and serve dist/
- `.gitignore` - Removed dist/ from ignore list
- `package.json` - Simplified build scripts
