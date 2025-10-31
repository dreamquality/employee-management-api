// tests/project.test.js
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const db = require('../models');

let employeeToken;
let adminToken;
let testProjectId;

describe('Project API', () => {
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

    const employeeRes = await request(app)
      .post('/login')
      .send({
        email: 'employee@example.com',
        password: 'password123'
      });

    employeeToken = employeeRes.body.token;

    // Create some test projects
    const project1 = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Project Alpha',
        description: 'First test project'
      });

    testProjectId = project1.body.project.id;

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Project Beta',
        description: 'Second test project'
      });

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Project Gamma',
        description: 'Third test project'
      });
  });

  describe('GET /projects', () => {
    it('should get all projects as authenticated user', async () => {
      const res = await request(app)
        .get('/projects')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(3);
      expect(res.body[0]).to.have.property('id');
      expect(res.body[0]).to.have.property('name');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .get('/projects');

      expect(res.status).to.equal(401);
    });
  });

  describe('GET /projects/search', () => {
    it('should search projects by name', async () => {
      const res = await request(app)
        .get('/projects/search?query=Alpha')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0].name).to.include('Alpha');
    });

    it('should return empty array for non-matching search', async () => {
      const res = await request(app)
        .get('/projects/search?query=NonExistent')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(0);
    });

    it('should fail without query parameter', async () => {
      const res = await request(app)
        .get('/projects/search')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).to.equal(400);
    });

    it('should search case-insensitively', async () => {
      const res = await request(app)
        .get('/projects/search?query=alpha')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });
  });

  describe('GET /projects/:id', () => {
    it('should get a project by id', async () => {
      const res = await request(app)
        .get(`/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', testProjectId);
      expect(res.body).to.have.property('name');
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .get('/projects/99999')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('POST /projects', () => {
    it('should create a project as admin', async () => {
      const res = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Project Delta',
          description: 'Fourth test project'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('project');
      expect(res.body.project).to.have.property('id');
      expect(res.body.project.name).to.equal('Project Delta');
    });

    it('should fail to create project as employee', async () => {
      const res = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          name: 'Project Epsilon',
          description: 'Fifth test project'
        });

      expect(res.status).to.equal(403);
    });

    it('should fail to create duplicate project', async () => {
      const res = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Project Alpha',
          description: 'Duplicate project'
        });

      expect(res.status).to.equal(400);
    });

    it('should fail with invalid data', async () => {
      const res = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'A', // Too short
          description: 'Invalid'
        });

      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /projects/:id', () => {
    it('should update a project as admin', async () => {
      const res = await request(app)
        .put(`/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Project Alpha Updated',
          description: 'Updated description'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('project');
      expect(res.body.project.name).to.equal('Project Alpha Updated');
    });

    it('should fail to update project as employee', async () => {
      const res = await request(app)
        .put(`/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          name: 'Project Alpha Updated Again'
        });

      expect(res.status).to.equal(403);
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .put('/projects/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Name'
        });

      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should fail to delete project as employee', async () => {
      const res = await request(app)
        .delete(`/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).to.equal(403);
    });

    it('should delete a project as admin', async () => {
      // Create a project to delete
      const createRes = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Project To Delete',
          description: 'This will be deleted'
        });

      const projectId = createRes.body.project.id;

      const res = await request(app)
        .delete(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success');
      expect(res.body.success).to.equal(true);

      // Verify it's deleted
      const getRes = await request(app)
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getRes.status).to.equal(404);
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .delete('/projects/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(404);
    });
  });
});
