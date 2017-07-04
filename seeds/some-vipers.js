exports.seed = (knex) =>
  knex('scores').delete()
    .then(
      () => knex('scores').insert([
        {nomis_id: 'A1234AA', score: 0.21},
        {nomis_id: 'A1234AB', score: 0.65},
        {nomis_id: 'A1234AC', score: 0.98},
      ])
    );
