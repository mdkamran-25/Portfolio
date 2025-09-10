# Contact Form Email Setup Guide

## Overview
The contact form is fully functional and ready to send emails to your specified email address. This guide explains how to configure the email functionality.

## Current Setup
- ✅ Contact form UI is complete and responsive
- ✅ Form validation is working (all fields required)
- ✅ API endpoint `/api/contact` is implemented with nodemailer
- ✅ Error handling and user feedback are implemented
- ✅ Emails will be sent to: `webhost01001@gmail.com`

## Email Configuration Setup

### Step 1: Set up Gmail App Password
1. Go to your Google Account settings (https://myaccount.google.com/)
2. Enable 2-factor authentication if not already enabled
3. Go to **Security** > **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 2: Configure Environment Variables
Create a `.env.local` file in the root directory with the following content:

```env
# Email configuration for contact form
EMAIL_USER=webhost01001@gmail.com
EMAIL_PASSWORD=your-16-character-app-password-here

# Replace 'your-16-character-app-password-here' with the actual app password from step 1
```

### Step 3: Restart the Development Server
After adding the environment variables:
```bash
npm run dev
```

## How It Works

### Form Submission Flow
1. User fills out the contact form (Name, Email, Subject, Message)
2. Form validates all required fields
3. Form data is sent to `/api/contact` endpoint
4. Server uses nodemailer to send email via Gmail SMTP
5. Email is sent to `webhost01001@gmail.com` with all form details
6. User sees success or error message

### Email Content
The email sent will include:
- **From:** Your configured Gmail address
- **To:** webhost01001@gmail.com
- **Subject:** "New Contact Form Submission: [User's Subject]"
- **Content:** 
  - Name: [User's Name]
  - Email: [User's Email]
  - Subject: [User's Subject]
  - Message: [User's Message]

## Testing the Contact Form
1. Navigate to `/contact`
2. Fill out all form fields
3. Click "Send Message"
4. You should see "Message sent successfully!" if configured correctly
5. Check the email inbox at webhost01001@gmail.com

## Troubleshooting

### Common Issues
1. **"Failed to send message" error**
   - Check that EMAIL_PASSWORD is the 16-character app password, not your regular Gmail password
   - Verify that 2-factor authentication is enabled on your Gmail account
   - Ensure `.env.local` file is in the root directory

2. **Email not received**
   - Check spam/junk folder
   - Verify EMAIL_USER matches your Gmail address
   - Test with a different email client

### Security Notes
- Never commit `.env.local` to version control
- Use app passwords, not regular passwords
- The `.env.local` file is already included in `.gitignore`

## Production Deployment
For production deployment, set the environment variables in your hosting platform:
- **Vercel:** Add env vars in project settings
- **Netlify:** Add env vars in site settings
- **Heroku:** Use `heroku config:set`

Example:
```bash
EMAIL_USER=webhost01001@gmail.com
EMAIL_PASSWORD=your-app-password
```