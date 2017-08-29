const request = require('supertest');
require('chai').should();

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
          res.body.should.have.property('host')
            .which.eqls(res.req.getHeader('host'));
          res.body.should.have.property('schemes')
            .which.eqls(['http']);

          return new Promise((resolve, reject) => {
            require('swagger-tools').specs.v2_0.validate(res.body, (err, results) => {
              if (err) return reject(err);
              if (results && results.errors) {
                const error = results.errors
                  .map(({message, path}) => `${message} at ${path.join(".")}`)
                  .join("\n");
                return reject(new Error("Invalid Swagger:\n" + error));
              }
              resolve("ok");
            });
          });
        });
    });
  });
});
