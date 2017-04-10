const should = require('chai').should();
const request = require('supertest');
const app = require('../app.js');

describe('api', () => {
    describe('GET /ping', () => {

      describe('when environment variables not set', () => {
        var expects = {
          version: 'Not Available',
          date: 'Not Available',
          commit: 'Not Available',
          tag: 'Not Available',
        };

        it('returns "Not Available"', (done) => {
          delete process.env.VERSION_NUMBER;
          delete process.env.BUILD_DATE;
          delete process.env.COMMIT_ID;
          delete process.env.BUILD_TAG;

          request(app(process.env))
            .get('/ping')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('version_number', expects.version);
              res.body.should.have.property('build_date', expects.date);
              res.body.should.have.property('commit_id', expects.commit);
              res.body.should.have.property('build_tag', expects.tag);

              done();
            });

        });

      });

      describe('when environment variables set', () => {
        var expects = {
          version: '0.1.2',
          date: new Date().toString(),
          commit: 'afb12cb3',
          tag: 'test',
        };

        it('returns JSON with app information', (done) => {
          process.env.VERSION_NUMBER   = expects.version;
          process.env.BUILD_DATE       = expects.date;
          process.env.COMMIT_ID        = expects.commit;
          process.env.BUILD_TAG        = expects.tag;

          request(app(process.env))
            .get('/ping')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('version_number', expects.version);
              res.body.should.have.property('build_date', expects.date);
              res.body.should.have.property('commit_id', expects.commit);
              res.body.should.have.property('build_tag', expects.tag);

              done();
            });

        });

      });

    });

  });
