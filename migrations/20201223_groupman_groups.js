import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.GROUPS, (table) => {
    table.increments('id').primary()
    table.integer('orgid').notNullable()
    table.string('slug', 128).notNullable()
    table.string('name', 128).notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['orgid', 'slug'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.GROUPS)
}
