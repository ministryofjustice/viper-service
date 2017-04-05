const should = require('chai').should();
const request = require('supertest');
const server = require('../../app.js');

describe('api', () => {

  describe('/offender', () => {

      describe('GET /:nomsId/viper', () => {

        it('should return a 200 response when the nomsId is valid', (done) => {

          request(server)
            .get('/offender/A1234BC/viper')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('nomsId', 'A1234BC');
              res.body.should.have.property('viperRating');

              done();
            });

        });

        it('should return a 409 response when the nomsId is a plain string', (done) => {

          request(server)
            .get('/offender/BANG/viper')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(409)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('code', 'InvalidArgument');
              res.body.should.have.property('message', 'nomsId (INVALID): Invalid characters');

              done();
            });

        });

        it('should return a 409 response when the nomsId is missing a digit', (done) => {

          request(server)
            .get('/offender/A123BC/viper')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(409)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('code', 'InvalidArgument');
              res.body.should.have.property('message', 'nomsId (INVALID): Invalid characters');

              done();
            });

        });

      });

  });

});
