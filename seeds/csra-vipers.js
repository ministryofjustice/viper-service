exports.seed = (knex) =>
  knex('scores')
    .whereIn('nomis_id',['A1401AE','A1414AE','A1421AE']) // These are NOMIS_ID's from NOTM staging environment
    .delete()
    .then(
      () => knex('scores').insert([
        { nomis_id: 'A1401AE', score: 0.35 },
        { nomis_id: 'A1414AE', score: 0.50 },
        { nomis_id: 'A1421AE', score: 0.92 },
      ])
    );
