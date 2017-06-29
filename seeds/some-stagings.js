exports.seed = (knex) =>
  knex('staging').delete()
    .then(
      () => knex('staging').insert([
        {nomis_id: 'A1234AA', score: 0.21},
        {nomis_id: 'A1234AB', score: 0.65},
        {nomis_id: 'A1234AC', score: 0.98},
        {nomis_id: 'A1234AD', score: 0.72},
        {nomis_id: 'A1234AE', score: 0.49},
        {nomis_id: 'A1234AF', score: 0.12}
      ])
    );
