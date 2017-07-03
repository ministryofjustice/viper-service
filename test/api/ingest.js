const request = require('supertest');
const app = require('../../server/app');
const config = require('../../server/config');
const log = require('../../server/log');
const {db, tracker} = createMockDB();
const ingester = require('../../api/datasources/ingester');
const sinon = require('sinon');

describe('api /ingest', () => {
  let server;

  before((done) => {

    app(config, log, db, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  beforeEach(() => {
    tracker.uninstall();
    tracker.install();
  });

  describe('POST /ingest', () => {

    it('should return a 202 response', () => {
      return request(server)
        .post('/ingest')
        .expect(202);
    });

    it('should invoke the ingester', () => {

      sinon.spy(ingester, "ingest");
      // tracker.on('raw', (query) => { query.response([]);});

      return request(server)
        .post('/ingest').then(() => {
          ingester.ingest.called.should.be.true;
        });
    });

  });
});
