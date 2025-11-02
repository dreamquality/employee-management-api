// services/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config/appConfig');
const logger = require('../utils/logger');

// Create reusable transporter object using SMTP config
let transporter = null;

// Initialize transporter
function initializeTransporter() {
  if (!config.smtpHost || !config.smtpPort) {
    logger.warn('SMTP configuration is not set. Email service will not be available.');
    return null;
  }

  // Validate authentication credentials
  const hasUser = !!config.smtpUser;
  const hasPassword = !!config.smtpPassword;
  
  if (hasUser !== hasPassword) {
    logger.warn('SMTP authentication incomplete: both SMTP_USER and SMTP_PASSWORD must be provided. Email service will not be available.');
    return null;
  }

  const smtpAuth = hasUser && hasPassword ? {
    user: config.smtpUser,
    pass: config.smtpPassword,
  } : undefined;

  const smtpConfig = {
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure, // true for 465, false for other ports
    auth: smtpAuth,
  };

  return nodemailer.createTransport(smtpConfig);
}

// Get or create transporter
function getTransporter() {
  if (!transporter) {
    transporter = initializeTransporter();
  }
  return transporter;
}

/**
 * Send password change notification email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.userName - Name of the user whose password was changed
 * @param {string} options.changedBy - Name of the admin who changed the password
 * @returns {Promise<Object>} - Send result
 */
async function sendPasswordChangeEmail({ to, userName, changedBy }) {
  const transporter = getTransporter();
  
  if (!transporter) {
    logger.warn('Email transporter is not configured. Skipping email send.');
    return { success: false, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: config.smtpFrom || config.smtpUser,
    to,
    subject: 'Your Password Has Been Changed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Change Notification</h2>
        <p>Hello ${userName},</p>
        <p>This is to inform you that your password has been changed by administrator <strong>${changedBy}</strong>.</p>
        <p>If you did not request this change, please contact your administrator immediately.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message from the Employee Management System. Please do not reply to this email.
        </p>
      </div>
    `,
    text: `Hello ${userName},\n\nThis is to inform you that your password has been changed by administrator ${changedBy}.\n\nIf you did not request this change, please contact your administrator immediately.\n\nThis is an automated message from the Employee Management System. Please do not reply to this email.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Password change email sent successfully', { 
      to, 
      messageId: info.messageId 
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Failed to send password change email', { 
      to, 
      error: error.message 
    });
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPasswordChangeEmail,
  getTransporter, // Export for testing purposes
};
