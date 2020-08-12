var express = require('express')
var router = express.Router()
const dao = require('../data/db')

router.get('/', function (req, res) {
  dao.readAll().then(resp => res.json(resp))
})

router.get('/:id', (req, res) => {
  dao.read(req.params.id).then(resp => {
    if (resp)
      res.json(resp)
    else {
      res.status(404).send()
    }
  })
})

module.exports = router
