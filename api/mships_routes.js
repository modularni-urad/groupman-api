import { ROLE } from '../consts'

export default (ctx, app, MW) => {
  const { auth, bodyParser } = ctx

  app.get('/:gid', (req, res, next) => {
    MW.listGroup(req.params.gid, req.tenantid).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  app.get('/:uid/groups', (req, res, next) => {
    MW.listUserGroups(req.params.uid, req.tenantid).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  app.post('/:gid/:uid', auth.session,
    auth.requireMembership(ROLE.ADMIN),
    bodyParser,
    (req, res, next) => {
      MW.add2group(req.params.gid, req.params.uid, req.tenantid)
        .then(created => { res.status(201).json({status: 'ok'}) })
        .catch(next)
    })

  app.delete('/:gid/:uid', auth.session,
    auth.requireMembership(ROLE.ADMIN),
    (req, res, next) => {
      MW.removeFromGroup(req.params.gid, req.params.uid, req.tenantid)
        .then(updated => { res.json({status: 'ok'}) })
        .catch(next)
    })

  return app
}
