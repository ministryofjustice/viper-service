exports.up = (knex) => knex.schema
  .table('staging', (table) => {
    table.index('uploaded');
  });

exports.down = (knex) =>
  knex.schema.table('scores', (table) => {
    table.dropIndex('uploaded');
  });
