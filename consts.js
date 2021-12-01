
export const TNAMES = {
  GROUPS: 'groups',
  MSHIPS: 'membships'
}

export const ROLE = {
  ADMIN: 'group_admin'
}

export function getQB (knex, tablename, schema) {
  return schema
    ? knex(knex.ref(tablename).withSchema(schema))
    : knex(tablename)
}