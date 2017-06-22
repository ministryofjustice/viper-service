const should = require('chai').should();
const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');
const db = require('../../server/db')(false, log);

const tracker = require('mock-knex').getTracker();

describe('api', () => {

  beforeEach(() => { tracker.uninstall(); tracker.install(); });

  describe('/health', () => {

    describe('GET /health', () => {

      it('should return a 200 response with some content', (done) => {
        tracker.on('query', (q) => {
          q.response([{'a': 1}]);
        });

        app(config, log, db, (err, server) => {
          if (err) return done(err);
          request(server)
            .get('/health')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('healthy', true);

              done();
            });
        });

      });

      it('should return a 200 response with fail content', (done) => {
        tracker.on('query', (q) => {
          q.reject(new Error('Oh dear!'));
        });

        app(config, log, db, (err, server) => {
          if (err) return done(err);
          request(server)
            .get('/health')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('healthy', false);

              done();
            });
        });
      });
    });
  });
});
