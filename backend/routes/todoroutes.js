var express = require('express')
var router = express.Router()
var url = require('url')
const dao = require('../data/db')

router.route('/')
  .get((req, res) => {
    dao.readAll().then(resp => res.json(resp))
  })
  .post((req, res) => {
    const payload = req.body
    if (!payload.description) {
      res.status(400).json({ error: 'Missing ToDo description' })
      return
    }
    dao.createTodo(payload.description).then(id => {
      let requrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
      })
      const locationurl = `${requrl}/${id}`
      res.location(locationurl).status(201).send()
    })
  })

router.route('/:id').get((req, res) => {
  dao.read(req.params.id).then(resp => {
    if (resp)
      res.json(resp)
    else {
      res.status(404).send()
    }
  })
})

module.exports = router
