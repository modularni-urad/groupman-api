import express from 'express'
import path from 'path'
import { attachPaginate } from 'knex-paginate'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import initAuth from 'modularni-urad-utils/auth'
import initDB from 'modularni-urad-utils/db'
import initGRoutes from './api/groups_routes'
import initMShipsRoutes from './api/mships_routes'

export default async function init (mocks = null) {
  const migrationsDir = path.join(__dirname, 'migrations')
  const knex = mocks
    ? await mocks.dbinit(migrationsDir)
    : await initDB(migrationsDir)
  attachPaginate()
  const app = express()
  const JSONBodyParser = express.json()
  const auth = mocks ? mocks.auth : initAuth(app)
  const appContext = { express, knex, auth, JSONBodyParser }

  app.use(initGRoutes(appContext))
  app.use('/mship', initMShipsRoutes(appContext))

  initErrorHandlers(app) // ERROR HANDLING
  return app
}