const should = require('chai').should()
const request = require('supertest')
const sinon = require('sinon')

const app = require('../../server/app')

const config = require('../../server/config')
const log = require('../../server/log')

describe('api', () => {

  describe('/health', () => {

    describe('GET /health', () => {

      it('should return a 200 response with some content', (done) => {
        const db = {exec: sinon.stub().yields(null, 1)}

        app(config, log, db, (err, server) => {
          if (err) {
            return done(err)
          }
          request(server)
            .get('/health')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err)

              res.body.should.have.property('healthy', true)
              db.exec.callCount.should.eql(1)

              done()
            })
        })

      })

      it('should return a 200 response with fail content', (done) => {

        const db = {exec: sinon.stub().yields('Oh dear', null)}
        app(config, log, db, (err, server) => {
          if (err) {
            return done(err)
          }
          request(server)
            .get('/health')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err)

              res.body.should.have.property('healthy', false)
              db.exec.callCount.should.eql(1)

              done()
            })
        })
      })
    })
  })
})
