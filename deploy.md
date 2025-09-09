# Deployment Instructions

## Environment Variables Setup

You need to set these environment variables in Vercel:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your "lowkey" project
3. Go to Settings → Environment Variables
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://raaykthqnqnknjenjhif.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYXlrdGhxbnFua25qZW5qaGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MjMwMTIsImV4cCI6MjA3Mjk5OTAxMn0.CIgMrP2MHhQrh1ALK4Ukt7Tu7DpWnqN7vDZlUeEg3FU
ADMIN_PASSWORD = lowkey2025
```

## After Setting Environment Variables

1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger auto-deployment

## Test the System

1. Visit: https://lowkey-flax.vercel.app
2. Submit an email
3. Check dashboard: https://lowkey-flax.vercel.app/dashboard (password: lowkey2025)
4. Check Supabase: https://supabase.com/dashboard/project/raaykthqnqnknjenjhif/editor/emails

## Troubleshooting

If you get 500 errors:
1. Check Vercel function logs in the dashboard
2. Verify environment variables are set correctly
3. Check Supabase database connection
