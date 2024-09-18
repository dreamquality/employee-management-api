// tests/user.test.js
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const db = require('../models');

let employeeToken;

describe('User API', () => {
  before(async () => {
    await db.sequelize.sync({ force: true });

    // Создаем сотрудника и получаем токен
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
      });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'employee@example.com',
        password: 'password123',
      });

    employeeToken = res.body.token;
  });

  describe('GET /users', () => {
    it('should get list of employees with limited fields', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.not.have.property('salary');
    });
  });

  describe('PUT /users/:id', () => {
    it('should allow employee to update own profile', async () => {
      const user = await db.User.findOne({ where: { email: 'employee@example.com' } });
      const res = await request(app)
        .put(`/users/${user.id}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          phone: '+111222333',
          country: 'Russia',
        });

      expect(res.status).to.equal(200);
      expect(res.body.user).to.have.property('phone', '+111222333');
    });

    it('should not allow employee to update another employee\'s profile', async () => {
      const res = await request(app)
        .put('/users/999')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          phone: '+999999999',
        });

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('error');
    });
  });
});
