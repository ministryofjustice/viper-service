const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');
const {db, tracker} = createMockDB();

describe('api /viper', () => {
  let server;
  before((done) => {
    app(config, log, db, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  beforeEach(() => { tracker.uninstall(); tracker.install(); });

  describe('GET /:nomsId', () => {

    it('should return a 200 response when the nomsId is valid', () => {
      let query;
      tracker.on('query', (q) => {
        query = q;
        q.response([{score: 0.56}]);
      });

      return request(server)
        .get('/viper/A1234BC')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          query.bindings.should.contain('A1234BC');

          res.body.should.have.property('nomsId', 'A1234BC');
          res.body.should.have.property('viperRating', 0.56);
        });
    });

    it('should return a 400 response when the nomsId is a plain string', () => {
      return request(server)
        .get('/viper/BANG')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then((res) => {
          res.body.should.have.property('error', 'validation');
        });
    });

    it('should return a 400 response when the nomsId is missing a digit', () => {
      return request(server)
        .get('/viper/A123BC')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then((res) => {
          res.body.should.have.property('error', 'validation');
        });

    });

  });
});
