const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');
const {db, tracker} = createMockDB();

describe('api /offender', () => {
  let server;
  before((done) => {
    app(config, log, db, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  beforeEach(() => { tracker.uninstall(); tracker.install(); });

  describe('GET /:nomsId/viper', () => {

    it('should return a 200 response when the nomsId is valid', () => {

      tracker.on('query', (q) => {
        q.response([{score: 0.56}]);
      });

      return request(server)
        .get('/offender/A1234BC/viper')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          res.body.should.have.property('nomsId', 'A1234BC');
          res.body.should.have.property('viperRating', 0.56);
        });
    });

    it('should return a 500 response when the nomsId is a plain string', () => {
      return request(server)
        .get('/offender/BANG/viper')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .then((res) => {
          //res.body.should.have.property('code', 'InvalidArgument');
          res.body.should.have.property('message',
            'Request validation failed: Parameter (nomsId) does not match required pattern: ^[A-Z]\\d{4}[A-Z]{2}$');
        });
    });

    it('should return a 500 response when the nomsId is missing a digit', () => {
      return request(server)
        .get('/offender/A123BC/viper')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .then((res) => {
          //res.body.should.have.property('code', 'InvalidArgument');
          res.body.should.have.property('message',
            'Request validation failed: Parameter (nomsId) does not match required pattern: ^[A-Z]\\d{4}[A-Z]{2}$');
        });

    });

  });
});
