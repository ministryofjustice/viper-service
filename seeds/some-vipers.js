exports.seed = (knex) =>
  knex('scores').truncate()
    .then(
      () => knex('scores').insert([
        {nomis_id: 'A1234AA', score: 0.21, since: new Date('2017-06-20T11:59')},
        {nomis_id: 'A1234AB', score: 0.65, since: new Date('2017-06-21T11:59')},
        {nomis_id: 'A1234AC', score: 0.98, since: new Date('2017-06-22T11:59')},
      ])
    );
