import { TNAMES } from '../consts'

function tableName (tname) {
  return process.env.CUSTOM_MIGRATION_SCHEMA 
    ? `${process.env.CUSTOM_MIGRATION_SCHEMA}.${tname}`
    : tname
}

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName(TNAMES.MSHIPS), (table) => {
    table.string('uid', 64).notNullable()
    table.string('gid', 32).notNullable()
      .references('slug').inTable(tableName(TNAMES.GROUPS))
    table.primary(['uid', 'gid'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName(TNAMES.MSHIPS))
}
