exports.up = (knex) => Promise.all([
  knex.schema.table('scores', (table) => {
    table.decimal('score', 19, 18).notNullable().alter();
  }),
  knex.schema.table('staging', (table) => {
    table.decimal('score', 19, 18).notNullable().alter();
  })
]);

exports.down = (knex) => Promise.all([
  knex.schema.table('scores', (table) =>
    table.decimal('score', 3, 2).notNullable().alter()
  ),
  knex.schema.table('staging', (table) =>
    table.decimal('score', 3, 2).notNullable().alter()
  )
]);
