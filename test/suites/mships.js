
module.exports = (g) => {
  //
  const r = g.chai.request(g.baseurl)

  return describe('memberships', () => {
    // it('must not create a new item wihout approp group', async () => {
    //   const res = await r.post('/points').send(p1)
    //   res.status.should.equal(403)
    // })

    it('shall add u1 to admins', async () => {
      g.mockUser.groups = ['group_admins']
      const res = await r.post('/admins/u1').set('Authorization', 'Bearer f')
      res.status.should.equal(201)
    })

    it('shall list admins members', async () => {
      const res = await r.get('/admins').set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].should.equal('u1')
    })

    it('shall list memberships of u1', async () => {
      const res = await r.get('/u1/groups').set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].should.equal('admins')
    })
  })
}
