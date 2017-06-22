exports.up = (knex) =>
  knex.schema.createTable('scores', (table) => {
    table.string('nomis_id', 10).notNullable();
    table.dateTime('since').notNullable();
    table.decimal('score', 3, 2).notNullable();

    table.primary(['nomis_id', 'since']);
  });

exports.down = (knex) =>
  knex.schema.dropTable('scores');
