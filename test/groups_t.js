/* global describe it */
const chai = require('chai')
chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl + '/api.domain1.cz')

  const p1 = {
    slug: 'admins',
    name: 'administrators'
  }

  return describe('groups', () => {
    // it('must not create a new item wihout approp group', async () => {
    //   const res = await r.post('/points').send(p1)
    //   res.status.should.equal(403)
    // })

    it('shall create a new item p1', async () => {
      g.mockUser.groups = ['group_admin']
      const res = await r.post('/').send(p1).set('Authorization', 'Bearer f')
      res.status.should.equal(201)
    })

    // it('shall update the item pok1', () => {
    //   const change = {
    //     name: 'pok1changed'
    //   }
    //   return r.put(`/tasks/${p.id}`).send(change)
    //   .set('Authorization', g.gimliToken)
    //   .then(res => {
    //     res.should.have.status(200)
    //   })
    // })

    it('shall get the pok1', async () => {
      const res = await r.get('/')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].slug.should.equal(p1.slug)
    })

    it('shall get the pok1 with pagination', async () => {
      const res = await r.get('/?currentPage=1&perPage=10&sort=id:asc')
      res.status.should.equal(200)
      res.body.data.should.have.lengthOf(1)
      res.body.data[0].slug.should.equal(p1.slug)
      res.body.pagination.currentPage = 1
    })
  })
}
