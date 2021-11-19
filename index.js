import express from 'express'
import path from 'path'
import { attachPaginate } from 'knex-paginate'
import {
  auth,
  initDB,
  initErrorHandlers,
  initConfigManager,
  CORSconfigCallback,
  createLoadOrgConfigMW
} from 'modularni-urad-utils'
import initGroupRoutes from './api/groups_routes'
import initMShipsRoutes from './api/mships_routes'

export default async function init (mocks = null) {
  await initConfigManager(process.env.CONFIG_FOLDER)
  const migrationsDir = path.join(__dirname, 'migrations')
  const knex = mocks
    ? await mocks.dbinit(migrationsDir)
    : await initDB(migrationsDir)
  attachPaginate()

  const app = express()
  process.env.NODE_ENV !== 'test' && app.use(cors(CORSconfigCallback))

  const ctx = {
    express, knex, auth, JSONBodyParser: express.json()
  }
  const groupAPI = initGroupRoutes(ctx)
  const mshipAPI = initMShipsRoutes(ctx)

  const loadOrgConfig = createLoadOrgConfigMW(req => {
    return req.params.domain
  })
  app.use('/:domain/', loadOrgConfig, groupAPI)
  app.use('/:domain/mship', loadOrgConfig, mshipAPI)

  initErrorHandlers(app) // ERROR HANDLING
  return app
}