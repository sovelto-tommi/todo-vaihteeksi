var express = require('express')
var router = express.Router()
var url = require('url')
const debug = require('debug')('todoserver:todorouter')
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
    dao.createTodo(payload.description).then(async id => {
      let requrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
      })
      const created = await dao.read(id)
      const locationurl = `${requrl}/${id}`
      res.location(locationurl).status(201).send(created)
    })
  })

router.route('/:id')
  .get((req, res) => {
    dao.read(req.params.id).then(resp => {
      if (resp)
        res.json(resp)
      else {
        res.status(404).send()
      }
    })
  })
  .put(async (req, res) => {
    const td = req.body
    const id = req.params.id
    if (td.done) {
      debug("Done to be done")
      let ok = await dao.setDone(id)
      debug('Done be done')
      if (!ok) {
        return res.status(404).send()
      }
    } else if (td.done === false || td.done === 0) {
      debug("About to undo")
      let ok = await dao.setDone(id, true)
      debug('Undone done')
      if (!ok) {
        return res.status(404).send()
      }
    }
    if (td.description) {
      if (!(await dao.modifyDescription(id, td.description))) {
        return res.status(404).send()
      }
    }
    if (td.due_date) {
      if (!(await dao.modifyDueDate(id, td.due_date))) {
        return res.status(404).send()
      }
    }
    res.json(await dao.read(id))
  })
  .delete((req, res) => {
    dao.delete(req.params.id).then(done => {
      if (done) {
        return res.status(204).send()
      }
      return res.status(404).send()
    })
  })

module.exports = router
