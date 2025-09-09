# 🔐 Lowkey Admin Dashboard Guide

## Dashboard Access

### URL: `https://lowkey-flax.vercel.app/dashboard`

### Default Password: `lowkey2024`

## Features

### 📊 **Statistics Dashboard**
- **Total Emails**: Count of all collected emails
- **Mobile Users**: Number of mobile device signups
- **Desktop Users**: Number of desktop device signups
- **Unique IPs**: Number of unique IP addresses

### 📧 **Email Management**
- **View All Emails**: Complete list with timestamps
- **Device Detection**: Mobile/Desktop/Tablet identification
- **Browser Info**: Chrome, Firefox, Safari, Edge detection
- **IP Tracking**: User location tracking
- **CSV Export**: Download all data as spreadsheet

### 🔒 **Security Features**
- **Password Protection**: Secure admin access
- **Session Management**: Automatic logout
- **IP Logging**: Track admin access

## How to Use

### 1. **Access Dashboard**
1. Go to `https://lowkey-flax.vercel.app/dashboard`
2. Enter password: `lowkey2024`
3. Click "Access Dashboard"

### 2. **View Email Collection**
- See all collected emails in real-time
- View device types and browser info
- Check timestamps and IP addresses

### 3. **Export Data**
- Click "Export CSV" to download all emails
- File includes: Email, Timestamp, Device, IP
- Perfect for importing into email marketing tools

### 4. **Refresh Data**
- Click "Refresh" to see new emails
- Dashboard updates automatically
- No need to reload the page

## Security

### **Change Default Password**
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add: `ADMIN_PASSWORD = your_new_password`
4. Redeploy project

### **Best Practices**
- Use a strong, unique password
- Don't share dashboard access
- Regularly export and backup data
- Monitor for suspicious activity

## Data Storage

### **Location**: `/data/emails.json` on Vercel
### **Format**: JSON with email, timestamp, userAgent, IP
### **Backup**: Export CSV regularly
### **Privacy**: IP addresses are logged for analytics

## Troubleshooting

### **Can't Access Dashboard**
- Check password is correct
- Clear browser cache
- Try incognito/private mode

### **No Emails Showing**
- Check if emails are being submitted
- Verify API is working
- Check browser console for errors

### **Export Not Working**
- Ensure emails exist
- Check browser download settings
- Try different browser

## Analytics Integration

### **Vercel Analytics**
- View traffic data in Vercel Dashboard
- See visitor counts and page views
- Track referral sources

### **Email Conversion**
- Compare email signups to total visitors
- Track conversion rates
- Monitor growth over time

## Support

For issues:
1. Check browser console for errors
2. Verify API endpoints are working
3. Check Vercel deployment logs
4. Ensure environment variables are set

---

**Dashboard URL**: `https://lowkey-flax.vercel.app/dashboard`  
**Default Password**: `lowkey2024`  
**Last Updated**: December 2024
