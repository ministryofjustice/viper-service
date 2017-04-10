const should = require('chai').should();
const request = require('supertest');

describe('api', () => {
    const server = require('../server.js');

    describe('GET /ping', () => {

      // 'when environment variables not set' => 'returns "Not Available"'

      describe('when environment variables set', () => {
        var expects = {
          version: '0.1.2',
          date: new Date().toString(),
          commit: 'afb12cb3',
          tag: 'test',
        };

        process.env.VERSION_NUMBER   = expects.version;
        process.env.BUILD_DATE       = expects.date;
        process.env.COMMIT_ID        = expects.commit;
        process.env.BUILD_TAG        = expects.tag;

        it('returns JSON with app information', (done) => {

          request(server)
            .get('/ping')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('version_number', expects.version);

              done();
            });

        });

      });

    });

  });
