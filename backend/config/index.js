
const env = process.env.NODE_ENV || 'development'

const development = {
  app: {
    port: process.env.PORT || 3000,
    development: true
  },
  db: {
    SQLiteDBName: './data/db/todos.db'
  }
}

const test = {
  app: {
    port: process.env.PORT || 3003,
    development: true
  },
  db: {
    SQLiteDBName: ':memory:'
  }
}

const config = {
  development,
  test
}

module.exports = config[env]
