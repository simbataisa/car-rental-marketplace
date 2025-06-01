# Vercel Deployment Guide

This guide will help you deploy the Car Rental Marketplace to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository hosted on GitHub, GitLab, or Bitbucket
- Node.js 18+ installed locally

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

3. **Environment Variables** (if needed)
   - Add any required environment variables in the Vercel dashboard
   - Common variables for this project:
     ```
     NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account/team
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `car-rental-marketplace`
   - In which directory is your code located? `./`

## Configuration Files

This project includes optimized configuration files for Vercel:

### `vercel.json`
- Specifies build settings
- Configures security headers
- Sets up function runtime
- Defines URL rewrites

### `next.config.ts`
- Optimized for Vercel deployment
- Image optimization settings
- Security headers
- Performance optimizations

### `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces bundle size
- Improves build performance

## Post-Deployment

### Custom Domain (Optional)
1. Go to your project dashboard on Vercel
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### Environment Variables
If your application requires environment variables:
1. Go to "Settings" → "Environment Variables"
2. Add variables for Production, Preview, and Development
3. Redeploy if needed

### Performance Monitoring
- Vercel automatically provides:
  - Core Web Vitals monitoring
  - Function logs
  - Analytics (on Pro plans)
  - Real User Monitoring

## Automatic Deployments

Once connected, Vercel will automatically:
- Deploy on every push to the main branch (Production)
- Create preview deployments for pull requests
- Run builds and tests
- Provide deployment previews

## Build Optimization

This project is configured with:
- **Standalone output** for optimal serverless functions
- **Image optimization** with WebP and AVIF support
- **Package import optimization** for better tree-shaking
- **Security headers** for enhanced protection
- **Compression** enabled for faster loading

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names (case-sensitive)
   - Redeploy after adding variables

3. **Function Timeouts**
   - Optimize API routes for faster execution
   - Consider upgrading to Pro plan for longer timeouts

### Support
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## Production Checklist

- [ ] All environment variables configured
- [ ] Custom domain set up (if applicable)
- [ ] Analytics enabled
- [ ] Error monitoring configured
- [ ] Performance optimizations verified
- [ ] Security headers tested
- [ ] Mobile responsiveness confirmed
- [ ] SEO meta tags implemented

---

**Note**: This deployment configuration is optimized for the Car Rental Marketplace application. Adjust settings as needed for your specific requirements.