exports.seed = (knex) =>
  knex('staging').delete()
    .then(
      () => knex('staging').insert([
        {nomis_id: 'A1234AA', score: 0.21213123},
        {nomis_id: 'A1234AB', score: 0.6231235},
        {nomis_id: 'A1234AC', score: 0.98123123},
        {nomis_id: 'A1234AD', score: 0.72123123},
        {nomis_id: 'A1234AE', score: 0.49123123},
        {nomis_id: 'A1234AF', score: 0.1217865}
      ])
    );
