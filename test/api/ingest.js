const request = require('supertest');
const app = require('../../server/app');
const config = require('../../server/config');
const log = require('../../server/log');
const {db, tracker} = createMockDB();
const ingester = require('../../api/datasources/ingester');
const sinon = require('sinon');

describe('api /ingest', () => {
  let server;
  let sandbox;

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

    sandbox = sinon.sandbox.create();

  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('POST /ingest', () => {

    it('should return a 202 response', () => {
      return request(server)
        .post('/ingest')
        .expect(202);
    });

    it('should invoke the ingester', () => {

      sandbox.stub(ingester, "ingest").returns(Promise.resolve([]));

      return request(server)
        .post('/ingest').then(() => {
          ingester.ingest.called.should.be.true;
        });
    });

    it('should return 202 even if the database activity does not complete', () => {

      sandbox.stub(ingester, "ingest").returns(new Promise(() => {}));

      return request(server)
        .post('/ingest')
        .expect(202);
    });
  });
});
