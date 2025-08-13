# Deployment Guide

## Quick Deploy Options

### 1. GitHub Pages (Easiest)
```bash
# 1. Create a new GitHub repository
# 2. Push your code
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/covid-vaccine.git
git push -u origin main

# 3. Enable GitHub Pages
# Go to Settings > Pages > Source: Deploy from a branch > main
# Your site will be at: https://yourusername.github.io/covid-vaccine
```

### 2. Netlify (Drag & Drop)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your site is live instantly!

### 3. Vercel (CLI)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts - your site will be live in seconds
```

### 4. Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

## Local Testing

Before deploying, test locally:

```bash
# Option 1: Using Node.js
npm start

# Option 2: Using Python
python -m http.server 8000

# Option 3: Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` (or the port shown)

## File Structure for Deployment

Make sure these files are included:
```
covid-vaccine/
├── index.html          ✅ Required
├── main.js            ✅ Required  
├── styles.css         ✅ Required
├── dataset/           ✅ Required
│   ├── covid1.csv
│   ├── covid2.csv
│   └── covid3.csv
├── package.json       ✅ Optional (for Node.js tools)
└── README.md          ✅ Optional
```

## Troubleshooting

### Mixed Content Errors
- ✅ Fixed: All external scripts now use HTTPS
- ✅ Fixed: Data files use relative paths

### CORS Issues
- ✅ Fixed: Using local data files instead of external URLs

### Performance Issues
- Consider compressing large CSV files
- Use CDN for external libraries (already implemented)

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Purchase domain from registrar
2. Add DNS records pointing to your hosting service
3. Configure in hosting platform settings
