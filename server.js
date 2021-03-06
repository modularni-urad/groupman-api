import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import { attachPaginate } from 'knex-paginate'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import initAuth from 'modularni-urad-utils/auth'
import initDB from 'modularni-urad-utils/db'
import initGRoutes from './api/groups_routes'
import initMShipsRoutes from './api/mships_routes'

export async function init (mocks = null) {
  const migrationsDir = path.join(__dirname, 'migrations')
  const knex = mocks
    ? await mocks.dbinit(migrationsDir)
    : await initDB(migrationsDir)
  attachPaginate()
  const app = express()
  const JSONBodyParser = bodyParser.json()
  const auth = mocks ? mocks.auth : initAuth(app)
  const appContext = { express, knex, auth, JSONBodyParser }

  app.use(initGRoutes(appContext))
  app.use('/mship', initMShipsRoutes(appContext))

  initErrorHandlers(app) // ERROR HANDLING
  return app
}

if (process.env.NODE_ENV !== 'test') {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000
  init().then(app => {
    app.listen(port, host, (err) => {
      if (err) throw err
      console.log(`boromir blows his whistle on ${host}:${port}`)
    })
  }).catch(err => {
    console.error(err)
  })
}
