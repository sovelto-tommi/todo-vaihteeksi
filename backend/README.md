# Backend

## General

An example ToDo application to store ToDo items. The core functionality is for ToDo items for the current day, but the implementation supports also more complex scenarios.

## Technical implementations

### Setup

Backend for the (yet another) ToDo app. A node + express project,
created with Express Generator

```npx express --git --no-view backend```

A few libraries were added in addition to what the template brought in:
- `nodemon` to automate restarts
- `sqlite3` for database handling
- `jest` and `supertest` for tests

### API

API is simple, the basic stuff. ToDo items: get, delete and modify - all and individual. 


| Address  | Method | Description | Success | Returns | 
|----|----|----|----|---|
`/api/todos/` | GET | list of todos for the user | 200 | Array of ToDos
`/api/todos/` | POST | add a new todo for the user | 201 | Created ToDo
`/api/todos/:id` | GET | details of a single todo item | 200 | One ToDo
`/api/todos/:id` | PUT | modify a single todo item | 200 | Modified ToDo
`/api/todos/:id` | DELETE | delete a single todo item | 204 | 

Each endpoint with the `:id` parameter returns 404 for an unrecognized id. Other error codes when applicable. Unrecognized fields in sent payload are simply ignored.

For the payloads: see the source, the tests provide some usage examples.


### Data storage

Data is kept in a database. To keep things simple, this project uses SQLite. 
While a requirement is to be able to maintain the ToDo items even accross server boots we use a file based database.

Table creation: 
```
create table todo (id integer primary key autoincrement, description text not null, done boolean not null default false, due_date date default current_date, created timestamp default current_timestamp)
```

The Dao class is implemented as

```javascript
class SomeDao {
  // return created todo's id
  static createTodo(description) { }
  static readAll() {}
  static read(id) {}
  static setDone(id, undone=false) {}
  static modifyDueDate(id, duedate) {}
  static modifyDescription(id, description) {}
  static delete(id) {}
}
```

### Promisification

SQLite library offers only a callback API, so the implementation has a custom Promisifying class.

    Node's `util.promisify` is nice, but requires err as the first argument for the promisified functions. SQLite's basic library does not have such argument order, hence the custom implementation.

## Definite shortcomings

### Single user only

Current implementation is for a single user only. Multiple users can be added with relative ease.

**Fix**: Add user table, and user id for each todo item. First version could be without authentication: trust the user is whoever they say they are. 

## Possible modifications

### Duration

Add estimated duration to the ToDo item
