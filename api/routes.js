import Mwarez from './middleware'
import MShipRoutes from './mships_routes'
import { ROLE } from '../consts'

export default (ctx) => {
  const { knex, auth, bodyParser } = ctx
  const app = ctx.express()
  const MW = Mwarez(ctx)

  app.get('/', (req, res, next) => {
    MW.list(req.query, req.tenantid).then(info => {
      res.json(info)
    }).catch(next)
  })

  app.post('/',
    auth.session,
    auth.requireMembership(ROLE.ADMIN),
    bodyParser,
    (req, res, next) => {
      MW.create(req.body, req.tenantid, auth.getUID(req))
        .then(created => { res.status(201).json(created) })
        .catch(next)
    })

  app.put('/:id',
    auth.session,
    auth.requireMembership(ROLE.ADMIN),
    bodyParser,
    (req, res, next) => {
      MW.update(req.params.id, req.body, req.tenantid)
        .then(updated => { res.json(updated[0]) })
        .catch(next)
    })

  MShipRoutes(ctx, app, MW)

  return app
}
