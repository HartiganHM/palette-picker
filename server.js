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
          error: `Could not find project with id of ${request.params.id}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.get('/api/v1/projects/:projectId/palettes', (request, response) => {
  const { projectId } = request.params;

  database('palettes').where('project_id', projectId).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json({ palettes })
      } else {
        return response.status(404).json({
          error: `Could not find any palettes with project id of ${projectId}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      return response.status(201).json({ id: project[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.post('/api/v1/projects/:projectId/palettes', (request, response) => {
  const { projectId } = request.params;
  const palette = Object.assign({}, request.body, { project_id: projectId });

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response.status(422).json({
        error: `Your are missing the required parameter ${requiredParameter}`
      });
    }
  }

  database('projects').where('id', projectId).select()
    .then(projects => {
      if (!projects.length) {
        return response.status(404).json({
          error: `Could not find project with id of ${projectId}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });

  database('palettes').insert(palette, 'id')
    .then(palette => {
      return response.status(201).json({ id: palette[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.delete('/api/v1/projects/:projectId', (request, response) => {
  const { projectId } = request.params;
  database('palettes').where('project_id', projectId).delete()
    .then(projects => {
      database('projects').where('id', projectId).delete()
        .then(projects => {
          return response.sendStatus(204);
        })
        .catch(error => {
          return response.status(500).json({ error });
        });
    })
})

app.delete('/api/v1/palettes/:paletteId', (request, response) => {
  const { paletteId } = request.params;
  database('palettes').where('id', paletteId).delete()
    .then(palettes => {
      return response.sendStatus(204);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
