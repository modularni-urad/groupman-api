import _ from 'underscore'
import groups from './middleware'
import { ROLE } from '../consts'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    const filter = JSON.parse(_.get(req, 'query.filter', '{}'))
    const implicitFilter = { orgid: req.orgconfig.orgid }
    Object.assign(filter, implicitFilter)

    groups.list(Object.assign(req.query, { filter }), knex).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  app.post('/',
    auth.session,
    auth.requireMembership(ROLE.ADMIN),
    JSONBodyParser,
    (req, res, next) => {
      groups.create(req.body, req.orgconfig.orgid, auth.getUID(req), knex)
        .then(created => { res.status(201).json(created) })
        .catch(next)
    })

  app.put('/:id',
    auth.session,
    (req, res, next) => {
      auth.isMember(req, ROLE.ADMIN) || // i am admin
      auth.getUID(req).toString() === req.params.id // or i update myself
        ? next() : next(401)
    },
    JSONBodyParser,
    (req, res, next) => {
      groups.update(req.params.id, req.body, knex)
        .then(updated => { res.json(updated[0]) })
        .catch(next)
    })

  return app
}
