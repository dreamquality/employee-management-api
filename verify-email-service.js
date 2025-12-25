#!/usr/bin/env node
// verify-email-service.js
// Simple script to verify email service configuration

const emailService = require('./services/emailService');

async function main() {
  console.log('=== Email Service Verification ===\n');
  
  // Display configuration
  console.log('SMTP Configuration:');
  console.log(`  Host: ${process.env.SMTP_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.SMTP_PORT || '1025'}`);
  console.log(`  From: ${process.env.SMTP_FROM || 'noreply@employee-crm.com'}`);
  console.log('');

  // Test connection
  console.log('Testing SMTP connection...');
  const isConnected = await emailService.verifyConnection();
  
  if (isConnected) {
    console.log('✓ SMTP connection successful!\n');
    
    // Try sending a test email
    console.log('Sending test email...');
    await emailService.sendPasswordChangeEmail(
      'test@example.com',
      'Test',
      'User'
    );
    console.log('✓ Test email sent successfully!');
    console.log('\nIf using MailHog, view the email at: http://localhost:8025');
  } else {
    console.log('✗ SMTP connection failed!');
    console.log('\nPlease ensure:');
    console.log('  1. MailHog is running (docker-compose up mailhog)');
    console.log('  2. Environment variables are set correctly');
  }
  
  console.log('\n=== Verification Complete ===');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
