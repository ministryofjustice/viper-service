exports.seed = (knex) =>
  knex('scores')
    .whereIn('nomis_id',['J1234LO','R6524MO','I9876RA'])
    .delete()
    .then(
      () => knex('scores').insert([
        {nomis_id: 'J1234LO', score: 0.35},
        {nomis_id: 'R6524MO', score: 0.50},
        {nomis_id: 'I9876RA', score: 0.92},
      ])
    );
