const should = require('chai').should();
const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');
const db = require('../../server/db')(false, log);

const tracker = require('mock-knex').getTracker();

describe('api', () => {

  beforeEach(() => { tracker.uninstall(); tracker.install(); });

  describe('/offender', () => {

    describe('GET /:nomsId/viper', () => {

      it('should return a 200 response when the nomsId is valid', (done) => {

        tracker.on('query', (q) => {
          q.response([{score: 0.56}]);
        });

        app(config, log, db, (err, server) => {
          if (err) return done(err);
          request(server)
            .get('/offender/A1234BC/viper')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('nomsId', 'A1234BC');
              res.body.should.have.property('viperRating', 0.56);

              done();
            });
          });

      });

      it('should return a 500 response when the nomsId is a plain string', (done) => {

        app(config, log, db, (err, server) => {
          if (err) return done(err);
          request(server)
            .get('/offender/BANG/viper')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .end((err, res) => {
              should.not.exist(err);

              //res.body.should.have.property('code', 'InvalidArgument');
              res.body.should.have.property('message',
                'Request validation failed: Parameter (nomsId) does not match required pattern: ^[A-Z]\\d{4}[A-Z]{2}$');

              done();
            });
          });
      });

      it('should return a 500 response when the nomsId is missing a digit', (done) => {

        app(config, log, db, (err, server) => {
          if (err) return done(err);
          request(server)
            .get('/offender/A123BC/viper')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .end((err, res) => {
              should.not.exist(err);

              //res.body.should.have.property('code', 'InvalidArgument');
              res.body.should.have.property('message',
                'Request validation failed: Parameter (nomsId) does not match required pattern: ^[A-Z]\\d{4}[A-Z]{2}$');

              done();
            });
          });

        });

      });

  });

});
