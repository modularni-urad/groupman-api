import groups from './groups'
import { ROLE } from '../consts'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/:gid', (req, res, next) => {
    groups.listGroup(req.params.gid, knex).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  app.get('/:uid/groups', (req, res, next) => {
    groups.listUserGroups(req.params.uid, knex).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  app.post('/:gid/:uid',
    auth.requireMembership(ROLE.ADMIN),
    JSONBodyParser,
    (req, res, next) => {
      groups.add2group(req.params.gid, req.params.uid, knex)
        .then(created => { res.json({status: 'ok'}) })
        .catch(next)
    })

  app.delete('/:gid/:uid',
    auth.requireMembership(ROLE.ADMIN),
    (req, res, next) => {
      groups.removeFromGroup(req.params.gid, req.params.uid, knex)
        .then(updated => { res.json({status: 'ok'}) })
        .catch(next)
    })

  return app
}
