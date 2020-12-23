import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.MSHIPS, (table) => {
    table.integer('uid').notNullable()
    table.integer('gid').notNullable()
    table.primary(['uid', 'gid'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.MSHIPS)
}
