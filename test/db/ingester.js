const expect = require('chai').expect;

const ingester = require('../../api/datasources/ingester');
const stagingSeed = require('../../seeds/some-stagings').seed;
const scoresSeed = require('../../seeds/some-vipers').seed;

const differenceInSeconds = require('date-fns').differenceInSeconds;

function absoluteDifferenceInSecondsOf (date1, date2) {
  return Math.abs(differenceInSeconds(date1, date2));
}

context('with a database', () => {
  let knex;
  before(function () {
    if (!process.env.DB_URI && !process.env.CI) {
      this.skip();
    } else {
      knex = createRealDB();
    }
  });

  it('Should automatically provide timestamps in the staging table', () => {
    const now = new Date();
    return stagingSeed(knex).then(() => knex.select('uploaded').from('staging').then((rows) => {
        expect(rows).to.have.lengthOf(6);
        rows.forEach((row) => {
          expect(row.uploaded).to.be.a('date');
          expect(absoluteDifferenceInSecondsOf(row.uploaded, now)).to.be.lessThan(5);
        });
      })
    );
  });

  it('should migrate data from staging into scores as inserts', () => {
    const now = new Date();

    return Promise.all([
      knex('scores').delete(),
      stagingSeed(knex)
    ])
      .then(() => ingester.ingest(knex))
      .then((stats) => {
        expect(stats).to.have.lengthOf(6);
        stats.forEach((row) => {
          expect(row.new_since).to.be.a('date');
          expect(row.operation).to.be.eq('INSERT');
          expect(differenceInSeconds(row.new_since, now)).to.be.lessThan(5);
        });
      })
      .then(() => knex('scores').count('nomis_id as n').first())
      .then((count) => {
        expect(count.n).to.equal(6);
      });
  });

  it('should migrate data from staging into existing scores as updates', () => {
    const now = new Date();

    return Promise.all([
      stagingSeed(knex), // 6 in staging
      scoresSeed(knex)   // 3 in scores
    ])
      .then(() => ingester.ingest(knex))
      .then((stats) => {
        expect(stats).to.have.lengthOf(6);
        stats.forEach((row) => {
          expect(row.new_since).to.be.a('date');
          expect(differenceInSeconds(row.new_since, now)).to.be.lessThan(5);
        });
        const filtered = stats.filter((row) => row.operation === 'UPDATE');

        expect(filtered).to.have.lengthOf(3);
      })
      .then(() => knex('scores').count('nomis_id as n').first())
      .then((count) => {
        expect(count.n).to.equal(6);
      });
  });

  it('should migrate only the latest data from staging', () => {

    let now = new Date();
    let later = new Date(now);
    later.setMinutes(now.getMinutes() + 1)

    return Promise.all([
      knex('staging').delete(),
      knex('scores').delete()
    ])
      .then(() =>
        knex('staging').insert([
          {nomis_id: 'A1234AA', score: 0.01, uploaded: now}
        ])
      )
      .then(() =>
        knex('staging').insert([
          {nomis_id: 'A1234AA', score: 0.99, uploaded: later}
        ])
      )
      .then(() => ingester.ingest(knex))
      .then((stats) => {
        expect(stats).to.have.lengthOf(1);
        stats.forEach((row) => {
          expect(row.new_score).to.be.equal(0.99);
        });
      });
  });
});

