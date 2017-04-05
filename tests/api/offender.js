const should = require('chai').should();
const request = require('supertest');
const server = require('../../app.js');

describe('api', () => {

  describe('/offender', () => {

      describe('GET /viper', () => {

        it('should return a valid result', (done) => {

          done();
/*
          request(server)
            .get('/offender/A1234BC/viper')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('nomsId', 'A1234BC');

              done();
            });
    */
        });

      });

  });

});
