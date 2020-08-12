const request = require('supertest')
const app = require('../../app')

test('Initial test, todoroute is found', () => {
  return request(app)
    .get('/api/todos')
    .then(response => {
      expect(response.statusCode).toBe(200)
      expect(response.body).not.toBeNull()
    })
})
