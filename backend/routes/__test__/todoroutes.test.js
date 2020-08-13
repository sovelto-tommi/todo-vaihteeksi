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
        const last = response.body[response.body.length - 1]
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
        return request(app)
          .get(`/api/todos/${createdid}`)
          .expect(200)
          .then(resp => {
            expect(resp.body.description).toEqual('Do it!')
            expect(resp.body.done).toBeFalsy()
            expect(resp.body.due_date).toEqual(
              new Date().toISOString().split('T')[0]
            )
          })
      })
  })
})

describe('Deleting items', () => {
  test('Deletion works as expected', async () => {
    const id = await dao.createTodo('Gone with the deletion')
    return request(app)
      .delete(`/api/todos/${id}`)
      .expect(204)
  })
  test('Trying to delete a non-existing item will return 404', async () => {
    const id = await dao.createTodo('Gone with the deletion')
    await request(app).delete(`/api/todos/2049667`).expect(404)
    return request(app)
      .delete(`/api/todos/${id}`)
      .expect(204)
      .then(resp => {
        return request(app)
          .delete(`/api/todos/${id}`)
          .expect(404)
      })
  })
})

describe('Donning and undonning ToDo items', () => {
  test('An undone item can be set to "DONE"', async () => {
    const id = await dao.createTodo('To be done')
    return request(app)
      .put(`/api/todos/${id}`)
      .send({ done: true })
      .expect(200)
      .then(resp => {
        expect(resp.body.done).toBeTruthy()
      })
  })
  test('An already done item can be set to "DONE"', async () => {
    const id = await dao.createTodo('To be done')
    await dao.setDone(id)
    return request(app)
      .put(`/api/todos/${id}`)
      .send({ done: true })
      .expect(200)
      .then(resp => {
        expect(resp.body.done).toBeTruthy()
      })
  })
  test('Non-existing todo item returns 404 when trying to set done', async () => {
    return request(app)
      .put(`/api/todos/2049667`)
      .send({ done: true })
      .expect(404)
  })
})

describe('Modifying ToDo items', () => {
  test('Can change description', async () => {
    const id = await dao.createTodo('New mods')
    return request(app)
      .put(`/api/todos/${id}`)
      .send({ description: 'Depeche mods' })
      .expect(200)
      .then(resp => {
        expect(resp.body.description).toEqual('Depeche mods')
      })
  })
  test('Non-existing todo item returns 404 when trying to change description', async () => {
    return request(app)
      .put(`/api/todos/2049667`)
      .send({ description: 'You wish' })
      .expect(404)
  })
  test('Can change due_date', async () => {
    const id = await dao.createTodo('Future is here')
    return request(app)
      .put(`/api/todos/${id}`)
      .send({ due_date: '2042-08-11' })
      .expect(200)
      .then(resp => {
        expect(resp.body.due_date).toEqual('2042-08-11')
      })
  })
  test('Non-existing todo item returns 404 when trying to change due_date', async () => {
    return request(app)
      .put(`/api/todos/2049667`)
      .send({ due_date: '2042-08-11' })
      .expect(404)
  })
  test('Can modify done, description, and due_date all at once', async () => {
    const id = await dao.createTodo('All')
    return request(app)
      .put(`/api/todos/${id}`)
      .send({ description: 'Musketeers', due_date: '2042-08-11', done: true })
      .expect(200)
      .then(resp => {
        expect(resp.body.description).toEqual('Musketeers')
        expect(resp.body.due_date).toEqual('2042-08-11')
        expect(resp.body.done).toBeTruthy()
      })
  })
})
