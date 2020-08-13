const request = require('supertest')
const app = require('../../app')
const dao = require('../../data/db')
const debug = require('debug')('todoserver:tests')


test('Initial test, todoroute is found', () => {
  return request(app)
    .get('/api/todos')
    .then(response => {
      expect(response.statusCode).toBe(200)
      expect(response.body).not.toBeNull()
    })
})

describe('ToDo API GET tests', () => {
  test('Reading all todos include a manually created Todo', async () => {
    const id = await dao.createTodo('Duuude')
    return request(app)
      .get('/api/todos')
      .expect(200)
      .then(response => {
        expect(response.body.length).toBeGreaterThanOrEqual(1)
        const last = response.body[response.body.length-1]
        expect(last.description).toEqual('Duuude')
        expect(last.done).toBeFalsy()
    })
  })
  test('A single ToDo can be fetched', async () => {
    const id = await dao.createTodo('Singleton')
    return request(app)
      .get(`/api/todos/${id}`)
      .expect(200)
      .then(response => {
        expect(response.body.description).toEqual('Singleton')
      })
  })
  test('A nonexisting id for a todo returns not found', async () => {
    // Rather sure we didn't autoincrement to a this big id
    const id = Number.MAX_SAFE_INTEGER - 42  
    return request(app)
      .get(`/api/todos/${id}`)
      .expect(404)
  })

})

describe('ToDo API create tests', () => {
  test('A simple ToDo is created properly', () => {
    debug('About to post')
    return request(app)
      .post('/api/todos')
      .send({ description: 'Do it!' })
      .expect(201) 
      .expect('Location', /api\/todos\/\d+$/)
      .then(res => {
        const createdid = res.headers['location'].split('/').pop()
        debug('Created: ' + createdid)
        return request(app).
          get(`/api/todos/${createdid}`)
          .expect(200)
          .then(resp => {
            expect(resp.body.description).toEqual('Do it!')
            expect(resp.body.done).toBeFalsy()
            expect(resp.body.due_date).toEqual(new Date().toISOString().split('T')[0])
          })
      })
  })
})

