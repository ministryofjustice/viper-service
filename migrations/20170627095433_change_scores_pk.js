
exports.up = (knex) => knex.schema
  .table('scores', (table) => {
    table.dropPrimary();
    table.primary('nomis_id');
    table.dropColumn('since');
  })
  .table('scores', (table) => {
    table.datetime('since').notNullable().defaultTo(knex.fn.now());
  });

exports.down = (knex) =>
  knex.schema.table('scores', (table) => {
    table.dropPrimary();
    table.primary(['nomis_id','since']);
  });
