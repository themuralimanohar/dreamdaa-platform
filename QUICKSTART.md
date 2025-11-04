# Quick Start Guide

## Current Issue
There's an npm cache permission issue. Here are the solutions:

## Option 1: Fix npm cache (Recommended)
```bash
# Fix npm cache permissions
sudo chown -R $(whoami) ~/.npm

# Then install dependencies
npm install

# Start development server
npm run dev
```

## Option 2: Use Yarn (Alternative)
```bash
# Install yarn if not installed
npm install -g yarn

# Install dependencies with yarn
yarn install

# Start development server
yarn dev
```

## Option 3: Use npx (Quick test)
```bash
# Skip installation, run directly
npx next dev
```

## Expected Result
- Server runs on http://localhost:3000
- You'll see the DreamDaa homepage with:
  - Hero banner with donation CTA
  - About section explaining the mission
  - Sponsorship cards (Student/Classroom/School)
  - Contact and donation forms

## Current Features
✅ Homepage with hero banner and sponsorship options
✅ About Us page with mission and team info  
✅ Contact page with form and FAQ
✅ Donation page with comprehensive form
✅ Mobile-responsive design
✅ Professional branding and styling

## Next Steps After Running
1. Test the donation form (currently shows placeholder)
2. Review the responsive design on different screen sizes
3. Navigate through all pages to see the full experience

## Troubleshooting
If you still see issues:
1. Delete `node_modules` and `package-lock.json`
2. Clear npm cache: `npm cache clean --force`
3. Try installing with `--legacy-peer-deps` flag