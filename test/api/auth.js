const _ = require('lodash');
const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');
const {db, tracker} = createMockDB();

describe('basic authentication', () => {
  const auth = {user: 'basic-username', pass: 'basic-password'};
  let server;
  before((done) => {
    const configWithAuth = _.defaults({auth}, config);
    app(configWithAuth, log, db, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  beforeEach(() => { tracker.uninstall(); tracker.install(); });

  it('should block access without auth', () =>
    request(server)
      .get('/whatever')
      .expect(401)
  );
  it('should allow access with auth', () =>
    request(server)
      .get('/whatever')
      .auth(auth.user, auth.pass)
      .expect(404)
  );
  it('should allow /health access even without auth', () => {
    tracker.on('query', (q) => q.response([{0: 1}]));

    return request(server)
      .get('/health')
      .expect(200);
  });
});
