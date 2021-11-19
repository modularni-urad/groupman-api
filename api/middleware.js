
import { whereFilter } from 'knex-filter-loopback'
import { APIError } from 'modularni-urad-utils'
import _ from 'underscore'
import { TNAMES } from '../consts'

export default { create, update, list, add2group, removeFromGroup, listGroup, listUserGroups }

function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || null
  const fields = query.fields ? query.fields.split(',') : null
  const sort = query.sort ? query.sort.split(':') : null
  let qb = knex(TNAMES.GROUPS).where(whereFilter(query.filter))
  qb = fields ? qb.select(fields) : qb
  qb = sort ? qb.orderBy(sort[0], sort[1]) : qb
  return currentPage ? qb.paginate({ perPage, currentPage }) : qb
}

const editables = [ 'name', 'slug' ]

async function create (data, orgid, author, knex) {
  data = Object.assign({ orgid }, _.pick(data, editables))
  try {
    const newitem = await knex(TNAMES.GROUPS).insert(data).returning('*')
    return newitem
  } catch (err) {
    throw new APIError(400, err.toString())
  }
}

function update (id, data, knex) {
  data = _.pick(data, editables)
  try {
    return knex(TNAMES.GROUPS).where({ id }).update(data).returning('*')
  } catch (err) {
    throw new APIError(400, err.toString())
  }  
}

function add2group(gid, uid, knex) {
  try {
    return knex(TNAMES.MSHIPS).insert({uid, gid})
  } catch (err) {
    throw new APIError(400, err.toString())
  }  
}

function removeFromGroup(gid, uid, knex) {
  try {
    return knex(TNAMES.MSHIPS).where({uid, gid}).del()
  } catch (err) {
    throw new APIError(400, err.toString())
  }
}

function listGroup(gid, knex) {
  return knex(TNAMES.MSHIPS).where({gid}).pluck('uid')
}

function listUserGroups(uid, knex) {
  const gids = knex.select('gid').from(TNAMES.MSHIPS).where({uid})
  return knex(TNAMES.GROUPS).whereIn('id', gids).pluck('slug')
}