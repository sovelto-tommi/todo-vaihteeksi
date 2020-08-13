const baseurl = '/api/todos'

export class ApiService {
  static fetchAllTodos () {
    return fetch(`${baseurl}`)
      .then(response => response.json())
        .then(data => {
          return data
      })
  }

  static fetchSingleTodo (id) {
    return fetch(`${baseurl}/${id}`)
      .then(response => response.json())
      .then(data => {
        return data
      })
  }


  static createTodo (todo) {
    return fetch(`${baseurl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    })
      .then(response => {
        if (response.status === 201) {
          return response.json()
        }
        throw new Error(JSON.stringify(response))
      })
        .then(added => {
        return added
      })
  }

  static deleteTodo (id) {
    return fetch(`${baseurl}/${id}`, {
      method: 'DELETE'
    }).then(response => {
      if (response.status === 204) return true
      if (response.status === 404)
        // Already deleted
        return false
      throw new Error(response.status)
    })
  }

  static updateTodo (todo) {
    return fetch(`${baseurl}/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    }).then(response => {
      if (response.status === 200) {
        return response.json()
      }
      throw new Error(JSON.stringify(response))
    })
  }
}

