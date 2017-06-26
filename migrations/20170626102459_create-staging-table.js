exports.up = (knex) =>
  knex.schema.createTable('staging', (table) => {
    table.string('nomis_id', 10).notNullable();
    table.decimal('score', 3, 2).notNullable();
    table.primary('nomis_id');
  });

exports.down = (knex) =>
  knex.schema.dropTable('staging');
