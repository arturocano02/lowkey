# Supabase Setup Guide

## Why Supabase?

Supabase is a free, open-source Firebase alternative that provides:
- **PostgreSQL database** (handles 1000+ emails easily)
- **Real-time subscriptions** (optional for future features)
- **Built-in authentication** (if needed later)
- **Free tier** with generous limits
- **Automatic backups** and data persistence

## Setup Steps

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for free
3. Create a new project

### 2. Create Database Table
In your Supabase SQL editor, run this command:

```sql
CREATE TABLE emails (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  timestamp TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX idx_emails_email ON emails(email);
CREATE INDEX idx_emails_created_at ON emails(created_at);
```

### 3. Get Your Credentials
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key

### 4. Set Environment Variables
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Admin Password
ADMIN_PASSWORD=lowkey2025
```

### 5. Deploy to Vercel
1. Add the environment variables in Vercel dashboard
2. Redeploy your project

## Where to See Your Emails

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click **Table Editor** → **emails**
3. See all emails in real-time with full data
4. Export data directly from Supabase
5. Set up automatic backups

### Option 2: Your Custom Dashboard
- URL: `https://your-domain.vercel.app/dashboard`
- Password: `lowkey2025`
- Features:
  - Real-time email count
  - Device breakdown (Mobile/Desktop)
  - CSV export
  - IP tracking

### Option 3: API Endpoints
- Get all emails: `GET /api/emails`
- Add email: `POST /api/emails`
- Export CSV: `POST /api/backup`

## Benefits of Supabase

✅ **Free Forever**: 500MB database, 2GB bandwidth  
✅ **Automatic Backups**: Daily backups included  
✅ **Real-time**: See emails as they come in  
✅ **Scalable**: Handles millions of records  
✅ **Secure**: Built-in security and encryption  
✅ **Export**: Easy data export in multiple formats  

## Free Tier Limits
- **Database**: 500MB (≈ 1 million emails)
- **Bandwidth**: 2GB/month
- **API Requests**: 50,000/month
- **Backups**: 7 days retention

This is more than enough for your landing page!
