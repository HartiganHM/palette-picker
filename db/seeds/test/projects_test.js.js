exports.seed = function(knex, Promise) {
  return knex('palettes')
    .del()
    .then(() => knex('projects').del())

    .then(() => {
      return Promise.all([
        knex('projects')
          .insert(
            {
              name: 'Awesome'
            },
            'id'
          )
          .then(project => {
            return knex('palettes').insert([
              {
                name: 'Blue',
                color1: '#27A836',
                color2: '#5FD185',
                color3: '#D895C0',
                color4: '#A22691',
                color5: '#6F7703',
                project_id: project[0]
              },
              {
                name: 'Green',
                color1: '#FFFFFF',
                color2: '#5FD185',
                color3: '#D895C0',
                color4: '#A22691',
                color5: '#000000',
                project_id: project[0]
              }
            ]);
          })
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]); // end Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
