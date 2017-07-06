const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');
const {db, tracker} = createMockDB();

describe('api /health', () => {
  let server;
  before((done) => {
    app(config, log, db, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  beforeEach(() => { tracker.uninstall(); tracker.install(); });

  describe('GET /health', () => {

    it('should return a 200 response with some content', () => {
      tracker.on('query', (q) => {
        q.response([{'a': 1}]);
      });

      return request(server)
        .get('/health')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          res.body.should.have.property('healthy', true);
        });
    });

    it('should return a 500 response with fail content', () => {
      tracker.on('query', (q) => {
        q.reject(new Error('Oh dear!'));
      });

      return request(server)
        .get('/health')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .then((res) => {
          res.body.should.have.property('healthy', false);
        });
    });
  });
});
