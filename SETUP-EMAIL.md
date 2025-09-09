# Email Setup for Contact Form

The contact form has been set up to send real emails to `verein.gamechanger@gmail.com`. Here are two options to configure email sending:

## Option 1: Gmail with Nodemailer (Current Setup)

### Steps:
1. Configure your Gmail account for app passwords:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Enable 2-Factor Authentication if not already enabled
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Generate an App Password for "Mail"

2. Update `.env.local` with your credentials:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail-address@gmail.com
   SMTP_PASS=your-app-password-here
   ```

## Option 2: Resend (Recommended for Production)

Resend is a modern email service that's easier to set up and more reliable.

### Steps:
1. Install Resend:
   ```bash
   npm install resend
   ```

2. Sign up at [Resend.com](https://resend.com) and get your API key

3. Replace the current `/app/api/contact/route.ts` with the content from `/app/api/contact/resend-route.ts`

4. Update `.env.local`:
   ```env
   RESEND_API_KEY=your-resend-api-key-here
   ```

5. Verify your domain with Resend (or use their test domain for development)

## Testing

After configuring either option:

1. Start the development server: `npm run dev`
2. Navigate to the contact section on your website
3. Fill out and submit the contact form
4. Check that emails are received at `verein.gamechanger@gmail.com`

## Troubleshooting

- **Gmail "Less secure app access"**: This is deprecated. Use App Passwords instead.
- **SMTP connection failed**: Check your credentials and ensure 2FA is enabled for Gmail.
- **Resend domain verification**: For production, you'll need to verify your sending domain.
- **Rate limits**: Both services have rate limits for free accounts.

## Production Deployment

For production (Vercel, Netlify, etc.):
1. Add your environment variables to your hosting platform's environment settings
2. Never commit `.env.local` to your repository
3. Consider using Resend for better deliverability and easier setup

## Security Notes

- Environment variables are automatically excluded from the client bundle
- The API route runs server-side only
- Email addresses are validated before sending
- Consider adding rate limiting for production use