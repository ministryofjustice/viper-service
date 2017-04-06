const should = require('chai').should();
const request = require('supertest');
const server = require('../server.js');

describe('api', () => {

    describe('GET /ping', () => {

      it('returns JSON with app information', (done) => {

        request(server)
          .get('/ping')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            should.not.exist(err);

            res.body.should.have.property('version_number');
            res.body.should.have.property('build_date');
            res.body.should.have.property('commit_id');
            res.body.should.have.property('build_tag');

            done();
          });

      });

    });

  });
