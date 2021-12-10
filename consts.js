
export const TNAMES = {
  GROUPS: 'groups',
  MSHIPS: 'membships'
}

export const ROLE = {
  ADMIN: process.env.GROUP_ADMIN_GROUP_SLUG || 'group_admins'
}

export function getQB (knex, tablename, schema) {
  return schema
    ? knex(knex.ref(tablename).withSchema(schema))
    : knex(tablename)
}