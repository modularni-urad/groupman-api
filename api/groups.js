
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'
import { TNAMES } from '../consts'

export default { create, update, list, add2group, removeFromGroup, listGroup, listUserGroups }

function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || null
  const fields = query.fields ? query.fields.split(',') : null
  const sort = query.sort ? query.sort.split(':') : null
  const filter = query.filter ? JSON.parse(query.filter) : null
  let qb = knex(TNAMES.GROUPS)
  qb = filter ? qb.where(whereFilter(filter)) : qb
  qb = fields ? qb.select(fields) : qb
  qb = sort ? qb.orderBy(sort[0], sort[1]) : qb
  return currentPage ? qb.paginate({ perPage, currentPage }) : qb
}

const editables = [ 'name', 'slug' ]

function create (data, author, knex) {
  data = _.pick(data, editables)
  return knex(TNAMES.GROUPS).insert(data).returning('*')
}

function update (id, data, knex) {
  data = _.pick(data, editables)
  return knex(TNAMES.GROUPS).where({ id }).update(data).returning('*')
}

function add2group(gid, uid, knex) {
  return knex(TNAMES.MSHIPS).insert({uid, gid})
}

function removeFromGroup(gid, uid, knex) {
  return knex(TNAMES.MSHIPS).where({uid, gid}).del()
}

function listGroup(gid, knex) {
  return knex(TNAMES.MSHIPS).where({gid}).pluck('uid')
}

function listUserGroups(uid, knex) {
  const gids = knex.select('gid').from(TNAMES.MSHIPS).where({uid})
  return knex(TNAMES.GROUPS).whereIn('id', gids).pluck('slug')
}