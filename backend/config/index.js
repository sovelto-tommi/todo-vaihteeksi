
const env = process.env.NODE_ENV || 'development'

const development = {
  app: {
    port: process.env.PORT || 3000,
    development: true
  }
}

const test = {
  app: {
    port: process.env.PORT || 3003,
    development: true
  }
}

const config = {
  development,
  test
}

module.exports = config[env]
