# SMTP Integration Guide

## Overview
This implementation adds SMTP email integration to the Employee Management CRM system. When an administrator changes a user's password, an email notification is automatically sent to the user's email address.

The system is designed to work flexibly with both:
- **MailHog** (development/testing) - captures emails locally without sending
- **Real SMTP services** (production) - sends actual emails via Gmail, SendGrid, AWS SES, etc.

## What Was Added

### 1. MailHog SMTP Service (Docker)
- **Purpose**: Local SMTP server for development and testing
- **SMTP Port**: 1025 (for sending emails)
- **Web UI Port**: 8025 (for viewing sent emails)
- **Location**: Added to `docker-compose.yml`

### 2. Email Service (`services/emailService.js`)
- Handles sending password change notification emails
- Automatically detects MailHog vs production mode
- Configurable via environment variables
- Graceful error handling (won't break password updates if email fails)
- Provides helpful logging to show which mode is active

### 3. Password Change Hook
- Automatically triggers when password is updated in `userController.js`
- Sends email to user's registered email address
- Only sends email when password field is actually changed

### 4. Tests (`tests/email.test.js`)
- Verifies email is sent on password change
- Verifies email is NOT sent on other updates
- Tests error handling

## Quick Start

### For Development (MailHog)

1. **Start the services** (including MailHog):
   ```bash
   docker compose up --build
   ```

2. **Access MailHog Web UI** at http://localhost:8025
   - All emails sent by the application will appear here
   - You can view, read, and delete test emails

3. **Change a user's password** via the API:
   ```bash
   curl -X PUT http://localhost:3000/users/123 \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"password": "newPassword123"}'
   ```

4. **Check MailHog UI** - you should see the password change email appear

### For Production (Real Email)

1. **Choose your email service** (Gmail, SendGrid, AWS SES, etc.)

2. **Update environment variables** in your `.env` file or deployment configuration:
   ```bash
   # Example for Gmail
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_FROM=your-email@gmail.com
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_SECURE=true
   ```

3. **Deploy your application** - emails will now be sent via your configured service

## Configuration Guide

### Environment Variables

The system uses these environment variables for SMTP configuration:

| Variable | Description | MailHog Value | Production Example |
|----------|-------------|---------------|-------------------|
| `SMTP_HOST` | SMTP server hostname | `mailhog` or `localhost` | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `1025` | `587` or `465` |
| `SMTP_FROM` | From email address | Any (e.g., `noreply@test.com`) | Your verified email |
| `SMTP_USER` | SMTP username | Empty (optional) | Your email/API key |
| `SMTP_PASS` | SMTP password | Empty (optional) | Your password/API key |
| `SMTP_SECURE` | Use TLS/SSL | `false` | `true` for port 465, `false` for 587 |

### Switching Between MailHog and Production

The system automatically detects which mode to use based on the `SMTP_HOST` value:
- If `SMTP_HOST` is `mailhog` or `localhost:1025` → **Development mode** (MailHog)
- Otherwise → **Production mode** (Real SMTP)

You'll see log messages indicating which mode is active:
```
Using MailHog for email testing (development mode)
```
or
```
Using SMTP server: smtp.gmail.com:587 (production mode)
```

### Example Configurations

See `.env.example` for detailed configuration examples for:
1. MailHog (Development)
2. Gmail
3. SendGrid
4. AWS SES
5. Custom SMTP services

## Testing the Email Service

Run the verification script:
```bash
node verify-email-service.js
```

This will:
- Display current SMTP configuration
- Test the SMTP connection
- Send a test email
- Show the MailHog UI URL (if using MailHog)

## Production Setup Details

**Example with Gmail:**
```plaintext
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=true
SMTP_FROM=your-email@gmail.com
```

**Example with SendGrid:**
```plaintext
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_SECURE=true
SMTP_FROM=noreply@yourdomain.com
```

**Example with AWS SES:**
```plaintext
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
SMTP_SECURE=true
SMTP_FROM=verified-email@yourdomain.com
```

## Email Template

The password change email includes:
- Subject: "Password Changed - Employee Management CRM"
- Recipient: User's registered email address
- Content:
  - Personalized greeting with user's first and last name
  - Notification that password was changed
  - Warning to contact admin if change was unauthorized
  - Both plain text and HTML versions

## Security Notes

1. **Email errors don't break password updates** - If email sending fails, it's logged but the password update still succeeds
2. **No vulnerabilities** - nodemailer v7.0.10 has no known security issues
3. **Environment-based config** - SMTP credentials stored in environment variables, not in code
4. **CodeQL passed** - All security checks passed with 0 alerts

## Testing

Run the full test suite:
```bash
npm test
```

Or with Docker:
```bash
docker compose run --rm test
```

The email tests use sinon stubs to verify email sending without requiring a real SMTP server.

## Troubleshooting

### Emails not appearing in MailHog
1. Check MailHog is running: `docker compose ps`
2. Check logs: `docker compose logs mailhog`
3. Verify environment variables in docker-compose.yml
4. Access MailHog UI at http://localhost:8025

### SMTP Connection Failed
1. Ensure MailHog service is running
2. Check SMTP_HOST and SMTP_PORT environment variables
3. Run verification script: `node verify-email-service.js`
4. Check application logs for SMTP errors

### Emails sent but not received in production
1. Verify SMTP credentials are correct
2. Check SMTP service is allowing connections from your server
3. Check spam folder
4. Review application logs for sending errors
5. Verify FROM email address is authorized to send

## Future Enhancements

Potential improvements:
- Email templates for other events (user creation, profile updates, etc.)
- Email queue for reliable delivery
- Email preferences (allow users to opt-out)
- Multiple email templates
- Internationalization (multi-language emails)
