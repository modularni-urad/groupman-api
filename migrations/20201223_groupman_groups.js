import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.GROUPS, (table) => {
    table.increments('id').primary()
    table.string('slug', 128).notNullable()
    table.string('name', 128).notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.GROUPS)
}
