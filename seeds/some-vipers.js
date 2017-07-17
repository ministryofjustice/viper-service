exports.seed = (knex) =>
  knex('scores')
    .whereIn('nomis_id',['I1111II','O0000OO','B8888BB'])
    .delete()
    .then(
      () => knex('scores').insert([
        {nomis_id: 'I1111II', score: 0.2181236123},
        {nomis_id: 'O0000OO', score: 0.652134534543},
        {nomis_id: 'B8888BB', score: 0.98324545745},
      ])
    );
