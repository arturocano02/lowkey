# 📧 EmailJS Setup Guide

## Why EmailJS?
- **FREE**: 200 emails/month
- **CHEAP**: $15/month for 1,000 emails
- **NO BACKEND**: Works directly from frontend
- **EASY**: 5-minute setup

## Setup Steps

### 1. Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for free account
3. Verify your email

### 2. Create Email Service
1. Go to "Email Services" in dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow setup instructions
5. **Copy the Service ID**

### 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```
Subject: New Lowkey Waitlist Signup

New email signup:
Email: {{email}}
Time: {{timestamp}}
Device: {{userAgent}}

---
Sent from Lowkey Landing Page
```

4. **Copy the Template ID**

### 4. Get Public Key
1. Go to "Account" → "General"
2. **Copy your Public Key**

### 5. Add Environment Variables
Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### 6. Update Email Recipient
In `src/app/page.tsx`, line 119, replace:
```javascript
to_email: 'your-email@example.com'
```
With your actual email address.

## Pricing
- **Free**: 200 emails/month
- **Starter**: $15/month for 1,000 emails
- **Professional**: $30/month for 10,000 emails

## Testing
1. Deploy to Vercel
2. Test email submission
3. Check your email inbox
4. Verify emails are being received

## Troubleshooting
- Check browser console for errors
- Verify environment variables are set
- Test with a simple email first
- Check EmailJS dashboard for delivery status
