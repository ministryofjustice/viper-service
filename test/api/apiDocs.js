const request = require('supertest');
const should = require('chai').should();

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');
const {db, tracker} = createMockDB();

describe('api /api-docs', () => {
  let server;
  before((done) => {
    app(config, log, db, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  beforeEach(() => { tracker.uninstall(); tracker.install(); });

  describe('GET /api-docs', () => {

    it('should return a 200 response with some content', () => {
      return request(server)
        .get('/api-docs')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {

          res.body.should.have.property('paths');
          res.body.paths.should.have.property('/api-docs');
          should.not.exist(res.body.paths['/api-docs']);
        });
    });
  });
});
