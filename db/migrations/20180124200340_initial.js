exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('color1');
      table.string('color2');
      table.string('color3');
      table.string('color4');
      table.string('color5');
      table.integer('project_id').unsigned();
      table.foreign('project_id').references('projects.id');

      table.timestamps(true, true);
    })
  ]); // end Promise.all
};

exports.down = function(knex, Promise) {};
