// tests/email.test.js
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../app');
const db = require('../models');
const emailService = require('../services/emailService');

let employeeToken;
let adminToken;
let employeeId;
let emailStub;

describe('Email Service', () => {
  before(async () => {
    // Drop and recreate schema to ensure clean state
    await db.sequelize.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await db.sequelize.query('CREATE SCHEMA public;');
    await db.sequelize.sync({ force: true });

    // Create admin
    await request(app)
      .post('/register')
      .send({
        email: 'admin@example.com',
        password: 'adminpassword',
        firstName: 'Admin',
        lastName: 'User',
        middleName: 'Middle',
        birthDate: '1980-01-01',
        phone: '+987654321',
        programmingLanguage: 'N/A',
        role: 'admin',
        secretWord: process.env.SECRET_WORD
      });

    const adminRes = await request(app)
      .post('/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpassword'
      });

    adminToken = adminRes.body.token;

    // Create employee
    const employeeRes = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'employee@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Middle',
        birthDate: '1990-01-01',
        phone: '+123456789',
        programmingLanguage: 'JavaScript',
        role: 'employee'
      });

    employeeId = employeeRes.body.user.id;
  });

  beforeEach(() => {
    // Stub the sendPasswordChangeEmail function
    emailStub = sinon.stub(emailService, 'sendPasswordChangeEmail').resolves({
      success: true,
      messageId: 'test-message-id'
    });
  });

  afterEach(() => {
    // Restore the stub
    emailStub.restore();
  });

  describe('Password Change Email', () => {
    it('should send email when admin changes user password', async () => {
      const res = await request(app)
        .put(`/users/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          password: 'newPassword123'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Data updated successfully');
      
      // Verify email was sent
      expect(emailStub.calledOnce).to.be.true;
      
      // Verify email parameters
      const emailArgs = emailStub.firstCall.args[0];
      expect(emailArgs).to.have.property('to', 'employee@example.com');
      expect(emailArgs).to.have.property('userName', 'John Doe');
      expect(emailArgs).to.have.property('changedBy', 'Admin User');
    });

    it('should not send email when admin updates other fields', async () => {
      const res = await request(app)
        .put(`/users/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          position: 'Senior Developer'
        });

      expect(res.status).to.equal(200);
      
      // Verify email was NOT sent
      expect(emailStub.called).to.be.false;
    });

    it('should not send email when admin changes their own password', async () => {
      // Get the admin's ID from the token
      const adminUser = await db.User.findOne({ where: { email: 'admin@example.com' } });
      
      const res = await request(app)
        .put(`/users/${adminUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          password: 'newAdminPassword123'
        });

      expect(res.status).to.equal(200);
      
      // Verify email was NOT sent (admin changing own password)
      expect(emailStub.called).to.be.false;
    });

    it('should handle email sending errors gracefully', async () => {
      // Stub to simulate email failure
      emailStub.restore();
      emailStub = sinon.stub(emailService, 'sendPasswordChangeEmail').rejects(
        new Error('SMTP connection failed')
      );

      const res = await request(app)
        .put(`/users/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          password: 'anotherNewPassword123'
        });

      // The request should still succeed even if email fails
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Data updated successfully');
      
      // Verify email was attempted
      expect(emailStub.calledOnce).to.be.true;
    });
  });

  describe('Email Service Configuration', () => {
    it('should return null when SMTP is not configured', () => {
      // Save original config
      const config = require('../config/appConfig');
      const originalHost = config.smtpHost;
      
      // Temporarily remove SMTP config
      config.smtpHost = undefined;
      
      const transporter = emailService.getTransporter();
      
      // Restore config
      config.smtpHost = originalHost;
      
      // Transporter should be null when not configured
      expect(transporter).to.be.null;
    });
  });
});
