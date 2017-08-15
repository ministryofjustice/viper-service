exports.seed = (knex) =>
  knex('staging').delete()
    .then(
      () => knex('staging').insert([
        {nomis_id: 'B1234AA', score: 0.21213123},
        {nomis_id: 'B1234AB', score: 0.6231235},
        {nomis_id: 'B1234AC', score: 0.98123123},
        {nomis_id: 'I1111II', score: 0.72123123},
        {nomis_id: 'B8888BB', score: 0.49123123},
        {nomis_id: 'O0000OO', score: 0.1217865}
      ])
    );
