# SMTP Integration for Password Change Notifications

## Overview

This feature adds email notification support when administrators change user passwords. When an admin updates a user's password through the API, an automated email is sent to the user's email address informing them of the change.

## Configuration

To enable email notifications, add the following environment variables to your `.env` file:

```env
SMTP_HOST=smtp.example.com        # Your SMTP server hostname
SMTP_PORT=587                     # SMTP server port (typically 587 for TLS, 465 for SSL)
SMTP_SECURE=false                 # true for SSL (port 465), false for TLS (port 587)
SMTP_USER=your_smtp_username      # SMTP authentication username
SMTP_PASSWORD=your_smtp_password  # SMTP authentication password
SMTP_FROM=noreply@example.com     # From email address for notifications
```

### Common SMTP Providers

#### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM=your-email@gmail.com
```
**Note:** For Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833).

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-smtp-password
SMTP_FROM=noreply@yourdomain.com
```

### Using Internal/Self-Hosted SMTP Server

You can use your own internal SMTP server without relying on external services:

#### Option 1: Local SMTP Server (Development/Testing)
For development or testing, you can run a simple SMTP server using Docker:

```bash
# Run a local SMTP server (MailHog - captures emails for testing)
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Or use MailDev
docker run -d -p 1025:1025 -p 1080:1080 maildev/maildev
```

Then configure:
```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
# No authentication needed for local testing
SMTP_FROM=noreply@yourcompany.local
```

**MailHog Web UI:** http://localhost:8025 (to view captured emails)  
**MailDev Web UI:** http://localhost:1080 (to view captured emails)

#### Option 2: Self-Hosted SMTP Server (Production)
For production, you can set up your own SMTP server:

**Using Postfix on Linux:**
```env
SMTP_HOST=mail.yourcompany.com  # Your internal mail server
SMTP_PORT=587                    # or 25 for internal networks
SMTP_SECURE=false
# May not need authentication if on internal network
SMTP_FROM=noreply@yourcompany.com
```

**Using Microsoft Exchange Server:**
```env
SMTP_HOST=exchange.yourcompany.local
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=smtp-service-account@yourcompany.com
SMTP_PASSWORD=service-account-password
SMTP_FROM=noreply@yourcompany.com
```

**Important Notes for Internal SMTP:**
- Ensure your SMTP server allows relay from your application server's IP
- Configure proper DNS (MX records) and SPF/DKIM if sending to external recipients
- Use authentication even on internal networks for security
- Test email delivery to both internal and external addresses
- Configure firewall rules to allow SMTP traffic (port 25/587/465)

#### Option 3: Docker Compose with Internal SMTP
Add to your `docker-compose.yml`:

```yaml
services:
  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    networks:
      - app-network

  app:
    # ... your app configuration
    environment:
      SMTP_HOST: mailhog
      SMTP_PORT: 1025
      SMTP_SECURE: "false"
      SMTP_FROM: noreply@yourcompany.local
    depends_on:
      - mailhog
    networks:
      - app-network

networks:
  app-network:
```

This setup allows you to use only your internal resources without external dependencies.

## How It Works

1. An administrator updates a user's password via `PUT /users/:id` with a `password` field in the request body.
2. The system hashes the new password and updates the user record in the database.
3. If SMTP is configured, an email notification is sent to the user's email address.
4. The email includes:
   - The user's name
   - The administrator's name who made the change
   - A warning to contact the administrator if the change was not requested

## API Usage

### Update User Password (Admin Only)

**Endpoint:** `PUT /users/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Data updated successfully",
  "user": {
    "id": 5,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    ...
  }
}
```

## Email Template

The password change notification email sent to users includes:

**Subject:** Your Password Has Been Changed

**Body:**
```
Hello [User Name],

This is to inform you that your password has been changed by administrator [Admin Name].

If you did not request this change, please contact your administrator immediately.

---
This is an automated message from the Employee Management System. Please do not reply to this email.
```

## Behavior Notes

### When Email is Sent
- ✅ Admin changes another user's password
- ❌ Admin changes their own password (no email sent)
- ❌ User updates other fields (no email sent)
- ❌ Admin updates other user fields without password (no email sent)

### Error Handling
- If SMTP is not configured, the system logs a warning but continues normal operation
- If email sending fails, the password update still succeeds
- Email failures are logged for debugging purposes

### Security Considerations
- Emails are sent only when an administrator makes the change
- The new password is never included in the email
- SMTP credentials should be stored in environment variables, not in code
- Use app-specific passwords or API keys for production SMTP services

## Testing

The feature includes comprehensive tests in `tests/email.test.js`:

```bash
npm test tests/email.test.js
```

Tests cover:
- Email is sent when admin changes user password
- Email is not sent for other field updates
- System handles email failures gracefully
- Correct email parameters are used

## Troubleshooting

### Email Not Sending

1. **Check SMTP Configuration**
   - Verify all SMTP environment variables are set correctly
   - Check that SMTP_PORT is a number
   - Confirm SMTP_SECURE matches your SMTP provider's requirements

2. **Check Logs**
   - Look for warning messages about SMTP configuration
   - Check for error messages about email sending failures

3. **Test SMTP Connection**
   ```javascript
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     host: 'smtp.example.com',
     port: 587,
     secure: false,
     auth: {
       user: 'your_user',
       pass: 'your_password'
     }
   });
   
   transporter.verify((error, success) => {
     if (error) {
       console.log('SMTP Error:', error);
     } else {
       console.log('SMTP Ready');
     }
   });
   ```

4. **Common Issues**
   - **"Connection refused"**: Check SMTP_HOST and SMTP_PORT
   - **"Authentication failed"**: Verify SMTP_USER and SMTP_PASSWORD
   - **"Message rejected"**: Check SMTP_FROM is allowed by your provider

### Email Goes to Spam

- Configure SPF, DKIM, and DMARC records for your domain
- Use a reputable SMTP service (SendGrid, Mailgun, etc.)
- Ensure SMTP_FROM uses a verified domain

## Development

When developing locally without SMTP configured, the system will:
- Log a warning that email service is not available
- Continue normal operation
- Not attempt to send emails

This allows development to continue without requiring SMTP setup for all developers.
