import { TNAMES } from '../consts'

function tableName (tname) {
  return process.env.CUSTOM_MIGRATION_SCHEMA 
    ? `${process.env.CUSTOM_MIGRATION_SCHEMA}.${tname}`
    : tname
}

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TNAMES.GROUPS, (table) => {
    table.string('slug', 32).notNullable()
    table.string('name', 128).notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.primary(['slug'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName(TNAMES.GROUPS))
}
