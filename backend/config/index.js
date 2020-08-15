require('dotenv').config()

const env = process.env.NODE_ENV || 'development'

const development = {
  app: {
    port: process.env.PORT || 5000,
    development: true
  },
  db: {
    SQLiteDBName: './data/db/todos.db'
  }
}

const test = {
  app: {
    port: process.env.PORT || 5003,
    development: true
  },
  db: {
    SQLiteDBName: ':memory:'
  }
}

const production = {
  app: {
    port: process.env.PORT || 5000,
    development: false
  },
  db: {
    SQLiteDBName: './data/db/todos.db'
  }
}

const config = {
  development,
  test,
  production
}

module.exports = config[env]
