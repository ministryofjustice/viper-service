exports.seed = (knex) =>
  knex('scores').delete()
    .then(
      () => knex('scores').insert([
        {nomis_id: 'A1234AA', score: 0.2181236123},
        {nomis_id: 'A1234AB', score: 0.652134534543},
        {nomis_id: 'A1234AC', score: 0.98324545745},
        {nomis_id: 'J1234LO', score: 0.35},
        {nomis_id: 'R6524MO', score: 0.50},
        {nomis_id: 'I9876RA', score: 0.92},
      ])
    );
