const { models } = require('./models');
import { App } from './app';
import { RoundsController } from './controllers/roundsController';
import { ProjectsController } from './controllers/projectsController';

const app = new App(
  [
    new RoundsController(),
    new ProjectsController()
  ],
  8000,
);

app.listen();