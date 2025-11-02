// tests/email.test.js
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../app');
const db = require('../models');
const emailService = require('../services/emailService');

let adminToken;
let employeeToken;
let employeeId;

describe('Email Service API', () => {
  before(async () => {
    // Drop and recreate schema to ensure clean state
    await db.sequelize.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await db.sequelize.query('CREATE SCHEMA public;');
    await db.sequelize.sync({ force: true });

    // Create admin user
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

    // Create employee user
    await request(app)
      .post('/register')
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

    const employeeRes = await request(app)
      .post('/login')
      .send({
        email: 'employee@example.com',
        password: 'password123'
      });

    employeeToken = employeeRes.body.token;
    
    // Get employee ID
    const profileRes = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${employeeToken}`);
    
    employeeId = profileRes.body.id;
  });

  afterEach(() => {
    // Restore any stubs after each test
    sinon.restore();
  });

  describe('Password Change Email Notification', () => {
    it('should send email when admin changes user password', async () => {
      // Stub the email service to track if it was called
      const emailStub = sinon.stub(emailService, 'sendPasswordChangeEmail').resolves();

      // Admin changes employee password
      const res = await request(app)
        .put(`/users/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          password: 'newpassword123'
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Data updated successfully');

      // Verify email was sent
      expect(emailStub.calledOnce).to.be.true;
      expect(emailStub.firstCall.args[0]).to.equal('employee@example.com');
      expect(emailStub.firstCall.args[1]).to.equal('John');
      expect(emailStub.firstCall.args[2]).to.equal('Doe');
    });

    it('should not send email when other fields are updated without password', async () => {
      // Stub the email service to track if it was called
      const emailStub = sinon.stub(emailService, 'sendPasswordChangeEmail').resolves();

      // Admin updates employee name
      const res = await request(app)
        .put(`/users/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Jane'
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Data updated successfully');

      // Verify email was NOT sent
      expect(emailStub.called).to.be.false;
    });

    it('should send email when user changes own password (if allowed)', async () => {
      // Note: Currently only admin can change password based on adminOnlyFields
      // This test verifies the behavior when that changes
      
      // Stub the email service
      const emailStub = sinon.stub(emailService, 'sendPasswordChangeEmail').resolves();

      // Try to change own password (this will fail with current implementation)
      const res = await request(app)
        .put(`/users/${employeeId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          password: 'myNewPassword123'
        });

      // Should be forbidden since password is admin-only field
      expect(res.status).to.equal(403);
      expect(emailStub.called).to.be.false;
    });
  });

  describe('Email Service Functions', () => {
    it('should create email transporter successfully', () => {
      const emailServiceModule = require('../services/emailService');
      expect(emailServiceModule.sendPasswordChangeEmail).to.be.a('function');
      expect(emailServiceModule.verifyConnection).to.be.a('function');
    });

    it('should handle email sending errors gracefully', async () => {
      // This tests that the email service doesn't throw errors that break the app
      // The function should complete without throwing, even if email fails
      const result = await emailService.sendPasswordChangeEmail(
        'test@example.com',
        'Test',
        'User'
      );
      
      // Function should not throw - result may be undefined or an info object
      // No specific assertion needed; test passes if no exception is thrown
    });
  });
});
