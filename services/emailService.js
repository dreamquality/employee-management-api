// services/emailService.js
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Create SMTP transporter
 */
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST || 'localhost';
  const smtpPort = parseInt(process.env.SMTP_PORT || '1025', 10);
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  const config = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
  };

  // Only add auth if username is provided
  if (smtpUser) {
    config.auth = {
      user: smtpUser,
      pass: smtpPass,
    };
  }

  return nodemailer.createTransporter(config);
};

/**
 * Send password change notification email
 * @param {string} email - Recipient email address
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {Promise<void>}
 */
exports.sendPasswordChangeEmail = async (email, firstName, lastName) => {
  try {
    const transporter = createTransporter();
    const fromEmail = process.env.SMTP_FROM || 'noreply@employee-crm.com';

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: 'Password Changed - Employee Management CRM',
      text: `Hello ${firstName} ${lastName},\n\nYour password has been successfully changed.\n\nIf you did not make this change, please contact your administrator immediately.\n\nBest regards,\nEmployee Management CRM Team`,
      html: `
        <html>
          <body>
            <h2>Password Changed</h2>
            <p>Hello ${firstName} ${lastName},</p>
            <p>Your password has been successfully changed.</p>
            <p><strong>If you did not make this change, please contact your administrator immediately.</strong></p>
            <br>
            <p>Best regards,<br>Employee Management CRM Team</p>
          </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password change email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send password change email to ${email}:`, error);
    // Don't throw error to avoid breaking the password update flow
    // Just log it and continue
  }
};

/**
 * Verify SMTP connection
 * @returns {Promise<boolean>}
 */
exports.verifyConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('SMTP connection verified successfully');
    return true;
  } catch (error) {
    logger.error('SMTP connection verification failed:', error);
    return false;
  }
};

module.exports = exports;
