# 🚀 Deployment Guide

## Quick Deploy to Railway (Recommended)

### Step 1: Prepare Your Repository
1. Make sure all your changes are committed to Git
2. Push to GitHub if you haven't already

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
  5. Choose your sweet-treats-budget-planner repository
6. Railway will automatically detect it's a Node.js app
7. Click "Deploy"

### Step 3: Your App is Live!
- Railway will give you a URL like: `https://your-app-name.railway.app`
- Your app will be accessible worldwide!

## Alternative: Deploy to Render

### Step 1: Sign up for Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: sweet-treats-budget-planner
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your app will be live at: `https://your-app-name.onrender.com`

## What Happens During Deployment

1. **Build Process**:
   - Installs Node.js dependencies
   - Builds React frontend (`npm run build`)
   - Creates production-ready files

2. **Runtime**:
   - Starts Express server
   - Serves React app from `/dist` folder
   - Handles API requests at `/api/*` endpoints
   - SQLite database is created automatically

3. **Database**:
   - SQLite database is created on first run
   - Sample ingredients are automatically added
   - Data persists between deployments

## Environment Variables (Optional)

Railway/Render will automatically set:
- `PORT` - The port your app runs on
- `NODE_ENV` - Set to "production"

## Monitoring Your App

### Railway Dashboard
- View logs in real-time
- Monitor performance
- Set up custom domains
- Scale resources as needed

### Render Dashboard
- View deployment logs
- Monitor uptime
- Set up custom domains
- Auto-deploy on Git pushes

## Troubleshooting

### Common Issues:
1. **Build fails**: Check that all dependencies are in `package.json`
2. **App won't start**: Check the start command is `npm start`
3. **Database errors**: SQLite will be created automatically on first run
4. **API not working**: Make sure routes are properly configured

### Getting Help:
- Check the deployment logs in Railway/Render dashboard
- Verify your local build works: `npm run build && npm start`
- Check the README.md for more details

## Next Steps

After deployment:
1. **Test your app**: Make sure all features work
2. **Add a custom domain** (optional)
3. **Set up monitoring** (optional)
4. **Share your app**: Send the URL to others!

---

🎉 **Congratulations! Your cake budget planner is now live on the internet!** 