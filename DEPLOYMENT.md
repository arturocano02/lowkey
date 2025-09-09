# 🚀 Lowkey Deployment Guide

## Deploy to Vercel

### Method 1: GitHub + Vercel Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial Lowkey landing page"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Custom Domain** (Optional):
   - In Vercel dashboard, go to your project
   - Settings → Domains
   - Add your custom domain

### Method 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

## 📧 Email Collection Options

### Current Setup (Local Storage)
- Emails stored in browser's localStorage
- View at: `yourdomain.com/admin`
- Export as CSV
- **Note**: This is temporary for testing

### Production Email Services

#### Option 1: ConvertKit (Recommended for creators)
```bash
npm install @convertkit/convertkit-js
```
- Free up to 1,000 subscribers
- Great for creators and brands
- Easy integration

#### Option 2: Mailchimp
```bash
npm install @mailchimp/mailchimp_marketing
```
- Free up to 2,000 contacts
- Good for newsletters

#### Option 3: EmailJS (No backend needed)
```bash
npm install @emailjs/browser
```
- Send emails directly from frontend
- No server required
- Free tier available

#### Option 4: Airtable + Zapier
- Store emails in Airtable
- Use Zapier for automation
- Free tiers available

## 🔧 Environment Variables

Create `.env.local` for production:

```env
# For ConvertKit
NEXT_PUBLIC_CONVERTKIT_API_KEY=your_api_key
NEXT_PUBLIC_CONVERTKIT_FORM_ID=your_form_id

# For EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## 📊 Analytics Setup

### Vercel Analytics (Free)
```bash
npm install @vercel/analytics
```

### Google Analytics
```bash
npm install gtag
```

## 🔒 Security Considerations

1. **Rate Limiting**: Add rate limiting to prevent spam
2. **Email Validation**: Server-side validation
3. **CAPTCHA**: Add reCAPTCHA for production
4. **GDPR Compliance**: Add privacy policy and consent

## 📱 Performance Optimization

- ✅ Images optimized with Next.js Image
- ✅ CSS masks for GPU acceleration
- ✅ Responsive design
- ✅ SEO optimized

## 🚀 Post-Deployment Checklist

- [ ] Test email collection
- [ ] Check mobile responsiveness
- [ ] Verify spotlight effect works
- [ ] Test form validation
- [ ] Check console for errors
- [ ] Set up analytics
- [ ] Configure custom domain
- [ ] Set up email service integration

## 📞 Support

For issues:
1. Check Vercel deployment logs
2. Check browser console
3. Test locally with `npm run dev`
4. Verify environment variables

## 🔄 Updates

To update your deployed site:
```bash
git add .
git commit -m "Update description"
git push origin main
```
Vercel automatically redeploys on push!
