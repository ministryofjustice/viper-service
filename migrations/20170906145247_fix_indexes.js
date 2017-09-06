
exports.up = (knex) => knex.schema
  .table('staging', (table) => {
    table.dropIndex('uploaded');
  });

exports.down = (knex) => knex.schema
  .table('staging', (table) => {
    table.index('uploaded');
  });
