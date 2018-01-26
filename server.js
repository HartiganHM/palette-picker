const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express(); // Sets app variable to a new instance of express

const environment = process.env.NODE_ENV || 'development'; // Sets environment variable to use environment determine by process accessing server or to fallback to 'development'
const configuration = require('./knexfile')[environment]; // Sets configuration variable to use .knexfile at property of environment
const database = require('knex')(configuration); // Sets database variable to use knex method and pass in configuration variable
const port = process.env.PORT || 3000; // Sets port variable to use port determined by process accessing server or fall back to port 3000

const urlLogger = (request, response, next) => { // Middleware used to log the request url
  console.log('Request URL:', request.url);
  next();
};

const timeLogger = (request, response, next) => { // Middleware used to timestamp the request
  console.log('Datetime:', new Date(Date.now()).toString());
  next();
};

const accessControlAllowOrigin = (request, response, next) => { // Middleware used to set Access-Control-Allow-Origin header in response to avoid CORS errors
  response.header('Access-Control-Allow-Origin', '*');
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
};

app.locals.title = 'Palette Picker'; // Sets app locals title to name of prohect

app.set('port', port); // Sets app to use the port variable mentioned above

if (process.env.NODE_ENV !== 'test') { // Conditional check to avoid using logs in test environment
  app.use(timeLogger, urlLogger, accessControlAllowOrigin)
}

app
  .use(bodyParser.json()) // Sets app to use bodyParser module middleware so that request understands that response body is sending json content type
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, 'public')));

app.get('/api/v1/projects', (request, response) => { // Setting enpoint for server to get all projects from database
  database('projects').select() // Accesses projects table in database
    .then(projects => {
      return response.status(200).json({ projects }) // Processes promise and sends response with OK status and jsons projects from database
    })
    .catch(error => { // Catch for GET request of projects in case of internal server error, sends appropriate status with error message if applicable
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (request, response) => { // Setting enpoint for server to get all palettes from database
  database('palettes').select() // Accesses palettes table in database
    .then(palettes => {
      return response.status(200).json({ palettes }); // Processes promise and sends response with OK status and jsons palettes from database
    })
    .catch(error => { // Catch for GET request of palettes in case of internal server error, sends appropriate status with error message if applicable
      return response.status(500).json({ error });
    });
})

app.get('/api/v1/projects/:id', (request, response) => { // Setting enpoint for server to get all a specific project from database by id property
  database('projects').where('id', request.params.id).select() // Accesses projects table in database where id matches id sent through endpoint
    .then(projects => {
      if (projects.length) {
        return response.status(200).json({ projects }); // Processes promise and sends response with OK status and jsons selected projected from database
      } else {
        return response.status(404).json({ // Processes promise and sends reponse with Not Found status and jsons error message, informing that project of specified id does not exist
          error: `Could not find project with id of ${request.params.id}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error }); // Catch for GET request of specific project in case of internal server error, sends appropriate status with error message if applicable
    });
})

app.get('/api/v1/projects/:projectId/palettes', (request, response) => { // Setting enpoint for server to get all a specific palette from database by id property
  const { projectId } = request.params; // Deconstructs projectId variable from request parameters

  database('palettes').where('project_id', projectId).select() // Accesses palettes table in database where id matches id sent through endpoint
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json({ palettes }) // Processes promise and sends response with OK status and jsons selected palette from database
      } else {
        return response.status(404).json({ // Processes promise and sends reponse with Not Found status and jsons error message, informing that palette of specified id does not exist
          error: `Could not find any palettes with project id of ${projectId}`
        });
      }
    })
    .catch(error => { // Catch for GET request of specific palette in case of internal server error, sends appropriate status with error message if applicable
      return response.status(500).json({ error });
    });
})

app.post('/api/v1/projects', (request, response) => { // Setting enpoint for server to post a new project to database table of projects
  const project = request.body; // Create project variable from request body

  for (let requiredParameter of ['name']) { // Conditional for loop check to see if required parameters are sent through with post to endpoint
    if (!project[requiredParameter]) { // If request body does not contain required parameter...
      return response.status(422).json({ // return response with Unprocessable Entity status and error message informing of missing parameter
        error: `You are missing the required parameter ${requiredParameter}`
      });
    }
  }

  database('projects').insert(project, 'id') // If all parameters in request are present, access projects table from database and insert new project and assign unique id property
    .then(project => {
      return response.status(201).json({ id: project[0] });  // Processes promise and sends response with Created status and jsons new project id from database
    })
    .catch(error => { // Catch for POST request of new project in case of internal server error, sends appropriate status with error message if applicable
      return response.status(500).json({ error });
    });
})

app.post('/api/v1/projects/:projectId/palettes', (request, response) => { // Setting enpoint for server to post a new palette to database table of palettes
  const { projectId } = request.params; // Deconstructs projectId variable from request parameters
  const palette = Object.assign({}, request.body, { project_id: projectId }); // Create palette variable from request body adding newly created projectId variable

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {  // Conditional for loop check to see if required parameters are sent through with post to endpoint
    if (!palette[requiredParameter]) { // If request body does not contain a required parameter...
      return response.status(422).json({ // return response with Unprocessable Entity status and error message informing of missing parameter
        error: `You are missing the required parameter ${requiredParameter}`
      });
    }
  }

  database('projects').where('id', projectId).select() // Access projects table in database with requested project id through request params and select project
    .then(projects => {
      if (!projects.length) { // If project does not exist
        return response.status(404).json({ // Return response with Not Found status and error message infroming of not project by sent id
          error: `Could not find project with id of ${projectId}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });

  database('palettes').insert(palette, 'id') // If all parameters in request are present, access palettes table from database and insert new palette and assign unique id property
    .then(palette => {
      return response.status(201).json({ id: palette[0] }); // Processes promise and sends response with Created status and jsons new project id from database
    })
    .catch(error => { // Catch for POST request of new palette in case of internal server error, sends appropriate status with error message if applicable
      return response.status(500).json({ error });
    });
})

app.delete('/api/v1/projects/:projectId', (request, response) => { // Setting enpoint for server to DELETE a specific project from database table of projects
  const { projectId } = request.params; // Deconstructs projectId variable from request parameters
  database('palettes').where('project_id', projectId).delete() // Access palettes database to delete any palettes that are associated with specified project idea due to association of foreign id
    .then(projects => {
      database('projects').where('id', projectId).delete() // Access projects database to delete specified project
        .then(projects => {
          return response.sendStatus(204); // Send response with No Content status
        })
        .catch(error => { // Catch for DELETE request of specific project in case of internal server error, sends appropriate status with error message if applicable
          return response.status(500).json({ error });
        });
    })
})

app.delete('/api/v1/palettes/:paletteId', (request, response) => { // Setting enpoint for server to DELETE a specific palette from database table of palettes
  const { paletteId } = request.params; // Deconstructs projectId variable from request parameters
  database('palettes').where('id', paletteId).delete() // Access palettes database to delete specified project
    .then(palettes => {
      return response.sendStatus(204); // Send response with No Content status
    })
    .catch(error => { // Catch for DELETE request of specific palette in case of internal server error, sends appropriate status with error message if applicable
      return response.status(500).json({ error });
    });
})

app.listen(app.get('port'), () => { // Set app to get port and listen for any requests
  console.log(`${app.locals.title} is running on ${app.get('port')}.`); // Logs statement saying that app title is running on port specified by process or environment
});

module.exports = app; // Exports server as app to be used in testing environment
