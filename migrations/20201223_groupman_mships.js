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
  return builder.createTable(TNAMES.MSHIPS, (table) => {
    table.string('uid', 64).notNullable()
    table.string('gid', 32).notNullable()
      .references('slug').inTable(tableName(TNAMES.GROUPS))
    table.primary(['uid', 'gid'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName(TNAMES.MSHIPS))
}
