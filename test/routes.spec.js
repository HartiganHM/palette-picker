process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('Should return the homepage', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(error => {
      throw error;
    });
  });

  it('Should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      });
  });
});

describe('API Routes', () => {

  describe('GET to /api/v1/projects', () => {
    it('Should return all of the projects', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.should.be.a('object');
        response.body.should.have.property('projects');
        response.body.projects.length.should.equal(1);

        let mockProject = { name: 'Awesome' }
        response.body.projects.find(project => project.name === mockProject.name)
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('GET to /api/v1/palettes', () => {
    it('Should get all of the palettes', () => {
      return chai.request(server)
      .get('/api/v1/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.should.be.a('object');
        response.body.should.have.property('palettes');
        response.body.palettes.length.should.equal(2);

        let mockPalette = { name: 'Green', color1: '#FFFFFF', color2: '#5FD185', color3: '#D895C0', color4: '#A22691', color5: '#000000' }
        response.body.palettes.find(palette => palette.name === mockPalette.name);
        response.body.palettes.find(palette => palette.color1 === mockPalette.color1);
        response.body.palettes.find(palette => palette.color2 === mockPalette.color2);
        response.body.palettes.find(palette => palette.color3 === mockPalette.color3);
        response.body.palettes.find(palette => palette.color4 === mockPalette.color4);
        response.body.palettes.find(palette => palette.color5 === mockPalette.color5);
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('GET to /api/v1/projects/:id', () => {
    it('Should return the requested project', () => {
      return chai.request(server)
      .get('/api/v1/projects/1')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.should.be.a('object');
        response.body.should.have.property('projects');
        response.body.projects.length.should.equal(1);

        let mockProject = { name: 'Awesome' }
        response.body.projects.find(project => project.name === mockProject.name)
      })
      .catch(error => {
        throw error;
      });
    });

    it('Should send a 404 if the project does not exist', () => {
      return chai.request(server)
      .get('/api/v1/projects/2')
      .then(response => {
        response.should.have.status(404);
        response.error.text.should.equal('{"error":"Could not find project with id of 2"}')
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('GET to /api/v1/projects/:projectId/palettes', () => {
    it('Should return the requested palettes', () => {
      return chai.request(server)
      .get('/api/v1/projects/1/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.should.be.a('object');
        response.body.should.have.property('palettes');
        response.body.palettes.length.should.equal(2);

        let mockPalette = { name: 'Green' }
        response.body.palettes.find(palette => palette.name === mockPalette.name)
      })
      .catch(error => {
        throw error;
      });
    });

    it('Should send a 404 if the project does not exist', () => {
      return chai.request(server)
      .get('/api/v1/projects/2/palettes')
      .then(response => {
        response.should.have.status(404);
        response.error.text.should.equal('{"error":"Could not find any palettes with project id of 2"}')
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('POST to /api/v1/projects', () => {

  });

  describe('POST to /api/v1/palettes', () => {

  });

  describe('DELETE to /api/v1/projects/:projectId', () => {

  });

  describe('DELETE to /api/v1/palettes/:paletteId', () => {

  });

});
