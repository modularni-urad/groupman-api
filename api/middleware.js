import { TNAMES, getQB } from '../consts'

const conf = {
  tablename: TNAMES.GROUPS,
  editables: [ 'name', 'slug' ],
  idattr: 'slug'
}

export default function (ctx) {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const entityMWBase = ctx.require('entity-api-base').default
  const MW = entityMWBase(conf, knex, ErrorClass)

  return {
    list: function (query, schema) {
      query.filter = query.filter ? JSON.parse(query.filter) : {}
      return MW.list(query, schema)
    },
    create: function (data, schema) {
      return MW.create(data, schema)
    },
    update: function (id, data, schema) {
      return MW.update(id, data, schema)
    },
    add2group: async function (gid, uid, schema) {
      try {
        const r = await getQB(knex, TNAMES.MSHIPS, schema).insert({uid, gid})
        return r
      } catch (err) {
        throw new ErrorClass(400, err.toString())
      }
    },
    removeFromGroup: function (gid, uid, schema) {
      try {
        return getQB(knex, TNAMES.MSHIPS, schema).where({uid, gid}).del()
      } catch (err) {
        throw new ErrorClass(400, err.toString())
      }
    },
    listGroup: function (gid, schema) {
      return getQB(knex, TNAMES.MSHIPS, schema).where({gid}).pluck('uid')
    },
    listUserGroups: function (uid, schema) {
      return getQB(knex, TNAMES.MSHIPS, schema).select('gid').where({uid}).pluck('gid')
    }
  }
}