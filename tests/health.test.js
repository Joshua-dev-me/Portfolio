const request = require('supertest');
const app = require('../server');

describe('Health Check Endpoint', () => {
  test('GET /health should return 200 and healthy status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
  });
});

describe('API Endpoints', () => {
  test('GET /api/profile should return profile data or 404', async () => {
    const response = await request(app).get('/api/profile');
    
    // Should return either profile data or 404 if no profile exists
    expect([200, 404]).toContain(response.status);
  });

  test('GET /api/skills should return skills data', async () => {
    const response = await request(app).get('/api/skills');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /api/projects should return projects data', async () => {
    const response = await request(app).get('/api/projects');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
