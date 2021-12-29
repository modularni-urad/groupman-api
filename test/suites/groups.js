
module.exports = (g) => {
  //
  const r = g.chai.request(g.baseurl)

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
      g.mockUser.groups = ['group_admins']
      const res = await r.post('/').send(p1).set('Authorization', 'Bearer f')
      res.status.should.equal(201)
    })

    it('shall get the pok1', async () => {
      const res = await r.get('/').set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].slug.should.equal(p1.slug)
    })

    it('shall update the item pok1', async () => {
      const change = {
        name: 'pok1changed'
      }
      const res = await r.put(`/${p1.slug}`).send(change).set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get the pok1 with pagination', async () => {
      const res = await r.get('/?currentPage=1&perPage=10&sort=slug:asc')
          .set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      res.body.data.should.have.lengthOf(1)
      res.body.data[0].slug.should.equal(p1.slug)
      res.body.data[0].name.should.equal('pok1changed')
      res.body.pagination.currentPage = 1
    })

    it('shall get the pok1 through filter', async () => {
      const res = await r.get(`/?filter={"slug":"${p1.slug}"}`)
          .set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].slug.should.equal(p1.slug)
      res.body[0].name.should.equal('pok1changed')
    })
  })
}
