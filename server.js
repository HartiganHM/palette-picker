const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const port = process.env.PORT || 3000;

app.locals.title = 'Palette Picker';

app.set('port', port);

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, 'public')));

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json({ projects })
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      return response.status(200).json({ palettes });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(projects => {
      if (projects.length) {
        return response.status(200).json({ projects });
      } else {
        return response.status(404).json({
          error: `Could not find project with if of ${request.params.id}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
