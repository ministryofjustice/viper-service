exports.up = (knex) =>
  knex.schema.createTable('staging', (table) => {
    table.string('nomis_id', 10).notNullable();
    table.decimal('score', 3, 2).notNullable();
    table.datetime('uploaded').notNullable().defaultTo(knex.raw('sysdatetime()'));
    table.primary(['nomis_id', 'uploaded']);
  });

exports.down = (knex) =>
  knex.schema.dropTable('staging');
